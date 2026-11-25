/** The review queue's rules: one photo at a time, in the order the server chose. Kept pure so
 * they can be tested without Home Assistant or a DOM.
 *
 * A sitting is the photo pages loaded so far plus what was answered in it. The server owns the
 * order and never changes it while someone is labelling, so the card never re-sorts: it
 * appends later pages (skipping photos it already has) and shows the first photo nobody has
 * answered. Undo takes the last answer back, and because that photo keeps its place in the
 * list it simply becomes the current photo again.
 */

import type { PhotoQueueItem, PhotoQueuePage } from "../types";
import { countOf } from "./format-count";
import { timeLabel, visitDayLabel } from "./timeline";

/** Ask for the next page once this few unanswered photos are loaded, so advancing never waits. */
export const PREFETCH_AT = 4;

export interface PhotoQueueState {
  /** Photos in the server's order. Answered ones stay (so Undo can bring one back) and are
   * skipped when picking the current photo. */
  items: PhotoQueueItem[];
  /** What this sitting sent for each photo: a cat name, `both`, `not_a_cat` or `skip`. */
  answers: ReadonlyMap<string, string>;
  /** Photo uids in the order they were answered, last one last: what Undo takes back. */
  history: string[];
  /** Photos still waiting for an answer, across every page. */
  remaining: number;
  cursor: string | null;
  hasMore: boolean;
}

/** Photos the server has not seen an answer for are still in its list, so the ones answered here
 * (or waiting in the outbox from an earlier visit) are left out of what is shown. `hidden` is
 * those uids. */
function freshItems(page: PhotoQueuePage, known: ReadonlySet<string>, hidden: ReadonlySet<string>): PhotoQueueItem[] {
  const seen = new Set(known);
  const fresh: PhotoQueueItem[] = [];
  for (const item of page.items) {
    const uid = item.sample.uid;
    if (seen.has(uid) || hidden.has(uid)) continue;
    seen.add(uid);
    fresh.push(item);
  }
  return fresh;
}

/** The server's count, less the answers it has not heard yet. */
function serverRemaining(page: PhotoQueuePage, hidden: ReadonlySet<string>): number {
  return Math.max(0, page.remaining - hidden.size);
}

/** Starts a sitting from the first page. `hidden`: photos whose answer is waiting to be sent. */
export function createQueue(page: PhotoQueuePage, hidden: ReadonlySet<string>): PhotoQueueState {
  return {
    items: freshItems(page, new Set(), hidden),
    answers: new Map(),
    history: [],
    remaining: serverRemaining(page, hidden),
    cursor: page.cursor,
    hasMore: page.has_more && Boolean(page.cursor),
  };
}

/** Adds a later page behind what is already loaded (a photo seen twice stays where it was) and
 * re-syncs the count with the server's. */
export function appendPage(state: PhotoQueueState, page: PhotoQueuePage, hidden: ReadonlySet<string>): PhotoQueueState {
  const known = new Set(state.items.map((item) => item.sample.uid));
  return {
    ...state,
    items: [...state.items, ...freshItems(page, known, hidden)],
    remaining: serverRemaining(page, hidden),
    cursor: page.cursor,
    hasMore: page.has_more && Boolean(page.cursor),
  };
}

function unanswered(state: PhotoQueueState): PhotoQueueItem[] {
  return state.items.filter((item) => !state.answers.has(item.sample.uid));
}

/** The photo on screen: the first one nobody has answered. */
export function currentPhoto(state: PhotoQueueState): PhotoQueueItem | null {
  return state.items.find((item) => !state.answers.has(item.sample.uid)) ?? null;
}

/** The next few photos after the one on screen: what to preload. */
export function upcomingPhotos(state: PhotoQueueState, count: number): PhotoQueueItem[] {
  return unanswered(state).slice(1, 1 + count);
}

/** True while more pages exist and few photos are left to show. */
export function needsMorePhotos(state: PhotoQueueState): boolean {
  return state.hasMore && unanswered(state).length <= PREFETCH_AT;
}

/** Nothing left on screen and nothing left on the server. */
export function isCaughtUp(state: PhotoQueueState): boolean {
  return currentPhoto(state) === null && !state.hasMore;
}

/** Records an answer for the photo on screen and moves on. */
export function answerPhoto(state: PhotoQueueState, label: string): PhotoQueueState {
  const photo = currentPhoto(state);
  if (!photo) return state;
  const uid = photo.sample.uid;
  return {
    ...state,
    answers: new Map(state.answers).set(uid, label),
    history: [...state.history, uid],
    remaining: Math.max(0, state.remaining - 1),
  };
}

/** The last answer of this sitting, for the Undo button and for sending `follow`. */
export function lastAnswer(state: PhotoQueueState): { uid: string; label: string } | null {
  const uid = state.history[state.history.length - 1];
  const label = uid === undefined ? undefined : state.answers.get(uid);
  return uid !== undefined && label !== undefined ? { uid, label } : null;
}

/** Takes the last answer back: that photo is the current one again. */
export function undoLast(state: PhotoQueueState): PhotoQueueState {
  const last = lastAnswer(state);
  if (!last) return state;
  const answers = new Map(state.answers);
  answers.delete(last.uid);
  return { ...state, answers, history: state.history.slice(0, -1), remaining: state.remaining + 1 };
}

/** The "N photos left" number: never less than one while a photo is on screen. */
export function photosLeft(state: PhotoQueueState): number {
  return Math.max(state.remaining, currentPhoto(state) ? 1 : 0);
}

/** "47 photos left", "1 photo left". */
export function photosLeftLabel(count: number, locale?: string): string {
  return `${countOf(count, "photo", "photos", locale)} left`;
}

/** "Nov 11, 1:05 PM, visit": when the photo was taken, and whether it belongs to a meal. Nothing
 * in it hints that photos come in groups. */
export function photoCaption(visit: Pick<PhotoQueueItem["visit"], "start" | "kind">, now: Date, locale?: string): string {
  const day = visitDayLabel(visit.start, now, locale) ?? "Today";
  return `${day}, ${timeLabel(visit.start, locale)}, ${visit.kind === "eat" ? "meal" : "visit"}`;
}

/** What is still unanswered, in page form: the last good page kept in memory, so opening the
 * queue again while Kibble is slow still shows something. Photos answered in the sitting are
 * left out. */
export function queueAsPage(state: PhotoQueueState): PhotoQueuePage {
  return { items: unanswered(state), remaining: state.remaining, visits: 0, cursor: state.cursor, has_more: state.hasMore };
}
