/** The review queue's rules, kept pure so they can be tested without Home Assistant or a DOM.
 *
 * The unit of review is the feeder session (a whole visit or meal), never one photo: a single
 * answer names every photo of that visit, which is what makes 150 visits a few minutes of work
 * instead of 1500 separate photo decisions. One photo that disagrees with its visit is still
 * corrected in the event sheet's photo viewer.
 *
 * Three things live here: how timeline rows become an ordered work list (`buildReviewItems`),
 * what an answer is and how it maps to `kibble/session/label` (`ReviewAnswer`), and the queue
 * state machine (`ReviewQueueState` and the functions that step it). The state machine is what
 * guarantees the two promises the screen makes: an answer is never dropped, and never sent
 * twice for the same decision.
 */

import type { Asset, CatSummary, Sample, TimelineEvent } from "../types";
import type { SessionCatChoice, SessionLabelRequest } from "./session-label";

/** `unknown`: Kibble could not name the visit. `unsure`: it guessed with low confidence.
 * `guess`: it guessed confidently and a person has not confirmed it yet. */
export type ReviewTier = "unknown" | "unsure" | "guess";

/** A guess below this probability is shown before the confident ones. */
export const UNSURE_BELOW = 0.75;
/** Answers per batch: the queue pauses on a short "20 done" card at every multiple. */
export const BATCH_SIZE = 20;

const TIER_RANK: Record<ReviewTier, number> = { unknown: 0, unsure: 1, guess: 2 };

export interface ReviewItem {
  /** The session's own identity: the shared `session` uid of split rows, else the row's uid. */
  key: string;
  /** The row shown for this visit. Its `uid` resolves to the whole session server-side. */
  event: TimelineEvent;
  tier: ReviewTier;
  /** Every cat Kibble guessed for this visit, in time order; `[]` when it has no guess. */
  guesses: string[];
  /** The weakest guess's probability, 0..1; `null` when there is no guess. */
  confidence: number | null;
  isMeal: boolean;
  /** Photos this visit holds, across every per-cat row of it. */
  photos: number;
}

/** Turns `kibble/review` rows (visits Kibble could not name) and `kibble/timeline` rows (its
 * unconfirmed guesses included) into one ordered work list: one item per session, unknown
 * first, then unsure guesses, then confident guesses, newest first inside each group. Only
 * feeds are left out; photos imported from an older setup are reviewed like any visit.
 *
 * A session a person already confirmed any part of is left out entirely: answering it here
 * would replace that earlier answer, so it belongs to the event sheet. */
export function buildReviewItems(unknown: readonly TimelineEvent[], timeline: readonly TimelineEvent[]): ReviewItem[] {
  const groups = new Map<string, Map<string, TimelineEvent>>();
  const touched = new Set<string>();
  for (const row of [...unknown, ...timeline]) {
    if (row.kind === "feed") continue;
    const key = row.session ?? row.uid;
    if (row.identity === "reviewed" || row.identity === "not_a_cat" || row.open) touched.add(key);
    const rows = groups.get(key) ?? new Map<string, TimelineEvent>();
    rows.set(row.uid, row);
    groups.set(key, rows);
  }
  const items: ReviewItem[] = [];
  for (const [key, byUid] of groups) {
    if (touched.has(key)) continue;
    const rows = [...byUid.values()].sort((a, b) => a.start - b.start || a.uid.localeCompare(b.uid));
    const guessed = rows.filter((row) => row.identity === "auto" && row.cat);
    const hasUnknown = rows.some((row) => row.identity !== "auto" || !row.cat);
    const confidences = guessed.map((row) => row.confidence).filter((value): value is number => typeof value === "number");
    const confidence = confidences.length ? Math.min(...confidences) : null;
    const tier: ReviewTier = hasUnknown ? "unknown" : confidence !== null && confidence < UNSURE_BELOW ? "unsure" : "guess";
    const shown = rows.find((row) => row.thumb) ?? rows[0]!;
    items.push({
      key,
      event: { ...shown, start: rows[0]!.start },
      tier,
      guesses: [...new Set(guessed.map((row) => row.cat!))],
      confidence,
      isMeal: rows.some((row) => row.kind === "eat"),
      photos: rows.reduce((sum, row) => sum + (row.sample_count ?? 0), 0),
    });
  }
  return items.sort(
    (a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || b.event.start - a.event.start || a.key.localeCompare(b.key),
  );
}

// ---- Answers --------------------------------------------------------------------------------

export type ReviewAnswer =
  | { kind: "cats"; cats: SessionCatChoice[] }
  | { kind: "not_a_cat" }
  | { kind: "unknown" };

export type ReviewOptionKind = "cat" | "several" | "not_a_cat" | "unknown";

export interface ReviewOption {
  id: string;
  kind: ReviewOptionKind;
  cat: string | null;
  label: string;
  /** The single key that picks this option, or `null` past the ninth. */
  hotkey: string | null;
}

/** The answer buttons, in the order they are shown and numbered: every cat, then "Both" (or
 * "More than one" with three or more cats), "Not a cat", "Can't tell". */
export function reviewOptions(cats: readonly Pick<CatSummary, "name">[]): ReviewOption[] {
  const options: Omit<ReviewOption, "hotkey">[] = cats.map((cat) => ({ id: "cat:" + cat.name, kind: "cat", cat: cat.name, label: cat.name }));
  if (cats.length >= 2) options.push({ id: "several", kind: "several", cat: null, label: cats.length === 2 ? "Both" : "More than one" });
  options.push({ id: "not_a_cat", kind: "not_a_cat", cat: null, label: "Not a cat" });
  options.push({ id: "unknown", kind: "unknown", cat: null, label: "Can\u2019t tell" });
  return options.map((option, index) => ({ ...option, hotkey: index < 9 ? String(index + 1) : null }));
}

/** Which option Kibble's own guess points at, so it can be shown pre-highlighted. */
export function guessOptionId(guesses: readonly string[], options: readonly ReviewOption[]): string | null {
  if (guesses.length === 0) return null;
  const id = guesses.length === 1 ? "cat:" + guesses[0] : "several";
  return options.some((option) => option.id === id) ? id : null;
}

export function catAnswer(cat: string, isMeal: boolean): ReviewAnswer {
  return { kind: "cats", cats: [{ cat, ate: isMeal }] };
}

/** Several cats were there; `ate` names the ones that ate (ignored for a plain visit). */
export function severalAnswer(cats: readonly string[], ate: readonly string[], isMeal: boolean): ReviewAnswer {
  return { kind: "cats", cats: cats.map((cat) => ({ cat, ate: isMeal && ate.includes(cat) })) };
}

export interface AteChoice {
  id: string;
  label: string;
  ate: string[];
}

/** The one-tap follow-up after "Both" on a meal: everyone ate, or exactly one of them did. */
export function ateChoices(cats: readonly string[]): AteChoice[] {
  return [
    { id: "all", label: cats.length === 2 ? "Both" : "All", ate: [...cats] },
    ...cats.map((cat) => ({ id: "cat:" + cat, label: cat, ate: [cat] })),
  ];
}

export function answerRequest(item: Pick<ReviewItem, "event">, answer: ReviewAnswer): SessionLabelRequest {
  if (answer.kind === "cats") return { uid: item.event.uid, cats: answer.cats.map((cat) => ({ ...cat })) };
  return { uid: item.event.uid, verdict: answer.kind };
}

export function sameAnswer(a: ReviewAnswer, b: ReviewAnswer): boolean {
  if (a.kind !== "cats" || b.kind !== "cats") return a.kind === b.kind;
  if (a.cats.length !== b.cats.length) return false;
  return a.cats.every((cat) => b.cats.some((other) => other.cat === cat.cat && other.ate === cat.ate));
}

/** The option a saved answer corresponds to, for highlighting it when stepping back. */
export function answerOptionId(answer: ReviewAnswer): string {
  if (answer.kind !== "cats") return answer.kind;
  return answer.cats.length === 1 ? "cat:" + answer.cats[0]!.cat : "several";
}

/** The photos of one visit in browsing order: the best crop first, then every other photo in
 * time order, each asset once. The whole scene is not part of this list (it has its own
 * toggle). */
export function reviewPhotos(event: Pick<TimelineEvent, "thumb">, samples: readonly Sample[] | null): Asset[] {
  const photos: Asset[] = [];
  const seen = new Set<string>();
  const add = (asset: Asset | null | undefined): void => {
    if (!asset || seen.has(asset.id)) return;
    seen.add(asset.id);
    photos.push(asset);
  };
  add(event.thumb);
  for (const sample of samples ?? []) add(sample.body ?? sample.face);
  return photos;
}

/** Kibble's per-photo guesses for a visit it could not name as a whole: the cat most photos
 * point at, when that is a clear majority. Lets "agree" stay one tap even on unknown visits. */
export function majorityGuess(samples: readonly Sample[], cats: readonly string[]): { cat: string; confidence: number } | null {
  const weight = new Map<string, number>();
  let total = 0;
  for (const sample of samples) {
    if (!sample.guess || !cats.includes(sample.guess)) continue;
    const value = sample.guess_confidence ?? 0.5;
    weight.set(sample.guess, (weight.get(sample.guess) ?? 0) + value);
    total += value;
  }
  let best: { cat: string; confidence: number } | null = null;
  for (const [cat, value] of weight) {
    if (!best || value > best.confidence) best = { cat, confidence: value };
  }
  if (!best || total <= 0 || best.confidence / total < 0.6) return null;
  return { cat: best.cat, confidence: best.confidence / total };
}

// ---- Queue state ----------------------------------------------------------------------------

/** `queued`: decided, not sent yet. `saving`: the one request in flight. `failed`: the last
 * attempt was rejected and it is waiting for a retry. */
export type SaveStatus = "queued" | "saving" | "saved" | "failed";

export interface AnswerRecord {
  key: string;
  answer: ReviewAnswer;
  status: SaveStatus;
  /** Bumped every time the answer for this visit changes; a save result that carries an older
   * `seq` belongs to a superseded answer and is ignored. */
  seq: number;
  attempts: number;
  error: string | null;
  /** The server said this visit no longer exists: retrying cannot help. */
  gone: boolean;
}

export interface ReviewQueueState {
  /** The work list for this sitting, answered visits included, in the order they are shown. */
  items: ReviewItem[];
  /** Index of the visit on screen; `items.length` once every visit has an answer. */
  position: number;
  records: Record<string, AnswerRecord>;
  /** Keys in the order they were answered: the undo stack. */
  history: string[];
  /** Answers in a row since the last undo. */
  streak: number;
  seq: number;
}

/** Starts a sitting. `startKey` (a session key or any uid of it) is moved to the front so the
 * visit a person tapped is the first one they see. */
export function createQueue(items: readonly ReviewItem[], startKey?: string | null): ReviewQueueState {
  const ordered = [...items];
  if (startKey) {
    const index = ordered.findIndex((item) => item.key === startKey || item.event.uid === startKey);
    if (index > 0) ordered.unshift(...ordered.splice(index, 1));
  }
  return { items: ordered, position: 0, records: {}, history: [], streak: 0, seq: 0 };
}

export function currentItem(state: ReviewQueueState): ReviewItem | null {
  return state.items[state.position] ?? null;
}

/** The next few visits after the one on screen that still need an answer: what to preload. */
export function upcomingItems(state: ReviewQueueState, count: number): ReviewItem[] {
  const answered = new Set(state.history);
  const upcoming: ReviewItem[] = [];
  for (let index = state.position + 1; index < state.items.length && upcoming.length < count; index++) {
    const item = state.items[index]!;
    if (!answered.has(item.key)) upcoming.push(item);
  }
  return upcoming;
}

function nextPosition(items: readonly ReviewItem[], history: readonly string[], from: number): number {
  const answered = new Set(history);
  for (let index = from; index < items.length; index++) {
    if (!answered.has(items[index]!.key)) return index;
  }
  return items.length;
}

/** Records an answer for the visit on screen and moves on. Re-giving the answer that is
 * already saved (after stepping back) sends nothing new. */
export function answerCurrent(state: ReviewQueueState, answer: ReviewAnswer): ReviewQueueState {
  const item = currentItem(state);
  if (!item) return state;
  const existing = state.records[item.key];
  const history = [...state.history.filter((key) => key !== item.key), item.key];
  const unchanged = existing !== undefined && existing.status !== "failed" && sameAnswer(existing.answer, answer);
  const seq = unchanged ? state.seq : state.seq + 1;
  const record: AnswerRecord = unchanged
    ? existing
    : { key: item.key, answer, status: "queued", seq, attempts: 0, error: null, gone: false };
  return {
    ...state,
    seq,
    records: { ...state.records, [item.key]: record },
    history,
    streak: state.streak + 1,
    position: nextPosition(state.items, history, state.position + 1),
  };
}

/** Steps back to the last answered visit. An answer that has not been sent yet is cancelled
 * outright; one that is already saved stays saved until a different answer replaces it, and
 * is shown as the current choice so the screen never claims something it did not do. */
export function undoLast(state: ReviewQueueState): ReviewQueueState {
  const key = state.history[state.history.length - 1];
  if (key === undefined) return state;
  const index = state.items.findIndex((item) => item.key === key);
  const history = state.history.slice(0, -1);
  if (index === -1) return { ...state, history, streak: 0 };
  const records = { ...state.records };
  if (records[key]?.status === "queued") delete records[key];
  return { ...state, history, records, streak: 0, position: index };
}

/** The one answer to send next, oldest first, or `null` while a request is already in flight
 * or nothing is waiting. One request at a time keeps answers for the same visit in order and
 * makes a double submit impossible. */
export function nextToSave(state: ReviewQueueState): AnswerRecord | null {
  let next: AnswerRecord | null = null;
  for (const record of Object.values(state.records)) {
    if (record.status === "saving") return null;
    if (record.status === "queued" && (!next || record.seq < next.seq)) next = record;
  }
  return next;
}

function withRecord(state: ReviewQueueState, key: string, seq: number, update: (record: AnswerRecord) => AnswerRecord): ReviewQueueState {
  const record = state.records[key];
  if (!record || record.seq !== seq) return state;
  return { ...state, records: { ...state.records, [key]: update(record) } };
}

export function markSaving(state: ReviewQueueState, key: string, seq: number): ReviewQueueState {
  return withRecord(state, key, seq, (record) => ({ ...record, status: "saving", attempts: record.attempts + 1, error: null }));
}

/** A request for (`key`, `seq`) finished. When the answer changed while it was in flight the
 * record already carries a newer `seq` and stays `queued`, so the newer answer is sent next. */
export function markSaved(state: ReviewQueueState, key: string, seq: number): ReviewQueueState {
  return withRecord(state, key, seq, (record) => ({ ...record, status: "saved", error: null }));
}

export function markFailed(state: ReviewQueueState, key: string, seq: number, error: string, gone = false): ReviewQueueState {
  return withRecord(state, key, seq, (record) => ({ ...record, status: "failed", error, gone }));
}

/** Puts every failed answer that can still succeed back in line, oldest first. */
export function retryFailed(state: ReviewQueueState): ReviewQueueState {
  let changed = false;
  const records: Record<string, AnswerRecord> = {};
  for (const [key, record] of Object.entries(state.records)) {
    if (record.status === "failed" && !record.gone) {
      records[key] = { ...record, status: "queued", error: null };
      changed = true;
    } else {
      records[key] = record;
    }
  }
  return changed ? { ...state, records } : state;
}

/** Forgets answers for visits the server no longer has, once the person has been told. */
export function dismissGone(state: ReviewQueueState): ReviewQueueState {
  const gone = new Set(Object.values(state.records).filter((record) => record.gone).map((record) => record.key));
  if (gone.size === 0) return state;
  const records = Object.fromEntries(Object.entries(state.records).filter(([key]) => !gone.has(key)));
  return { ...state, records, history: state.history.filter((key) => !gone.has(key)) };
}

export interface SaveCounts {
  /** Decided and not confirmed by the server yet (queued or in flight). */
  pending: number;
  /** Rejected, waiting for a retry. */
  failed: number;
  /** Rejected because the visit no longer exists. */
  gone: number;
}

export function saveCounts(state: ReviewQueueState): SaveCounts {
  const counts: SaveCounts = { pending: 0, failed: 0, gone: 0 };
  for (const record of Object.values(state.records)) {
    if (record.status === "queued" || record.status === "saving") counts.pending++;
    else if (record.status === "failed" && record.gone) counts.gone++;
    else if (record.status === "failed") counts.failed++;
  }
  return counts;
}

/** Folds a freshly loaded work list into a sitting in progress. Everything up to and including
 * the visit on screen stays exactly where it is, so nothing jumps under a thumb; behind it,
 * visits that no longer need an answer (named elsewhere, or aged out) are dropped and newly
 * arrived ones take their place in the fresh order. */
export function mergeItems(state: ReviewQueueState, fresh: readonly ReviewItem[]): ReviewQueueState {
  const head = state.items.slice(0, state.position + 1);
  const headKeys = new Set(head.map((item) => item.key));
  const freshKeys = new Set(fresh.map((item) => item.key));
  const keptTail = state.items
    .slice(state.position + 1)
    .filter((item) => !freshKeys.has(item.key) && state.records[item.key] !== undefined);
  const tail = [...keptTail, ...fresh.filter((item) => !headKeys.has(item.key))];
  const items = [...head, ...tail];
  const position = state.position >= state.items.length ? nextPosition(items, state.history, head.length) : state.position;
  return { ...state, items, position };
}

export interface QueueProgress {
  /** Visits answered this sitting. */
  done: number;
  /** Visits still waiting for an answer. */
  remaining: number;
  /** Position inside the current batch, 0..`BATCH_SIZE`. */
  batchDone: number;
  /** Size of the current batch: `BATCH_SIZE`, or fewer for the last one. */
  batchSize: number;
}

export function queueProgress(state: ReviewQueueState, batchSize = BATCH_SIZE): QueueProgress {
  const done = state.history.length;
  const answered = new Set(state.history);
  const remaining = state.items.reduce((count, item) => count + (answered.has(item.key) ? 0 : 1), 0);
  const batchStart = Math.floor(done / batchSize) * batchSize;
  return { done, remaining, batchDone: done - batchStart, batchSize: Math.min(batchSize, done - batchStart + remaining) };
}

/** True right after the answer that completes a batch, while more visits remain. */
export function isBatchBoundary(state: ReviewQueueState, batchSize = BATCH_SIZE): boolean {
  const progress = queueProgress(state, batchSize);
  return progress.done > 0 && progress.done % batchSize === 0 && progress.remaining > 0;
}

export interface CatTally {
  cat: string;
  /** Visits this sitting that were named as this cat (alone or with others). */
  visits: number;
  /** Photos in visits named as this cat alone: what the recogniser gains at least. */
  photos: number;
}

export interface ReviewSummary {
  total: number;
  cats: CatTally[];
  notACat: number;
  cantTell: number;
}

/** What this sitting achieved, from the answers that are still standing (an undone answer, or
 * one for a visit that no longer exists, does not count). */
export function summarize(state: ReviewQueueState, cats: readonly string[]): ReviewSummary {
  const tallies = new Map<string, CatTally>(cats.map((cat) => [cat, { cat, visits: 0, photos: 0 }]));
  const summary: ReviewSummary = { total: 0, cats: [], notACat: 0, cantTell: 0 };
  const itemsByKey = new Map(state.items.map((item) => [item.key, item]));
  for (const key of state.history) {
    const record = state.records[key];
    if (!record || record.gone) continue;
    summary.total++;
    if (record.answer.kind === "not_a_cat") summary.notACat++;
    else if (record.answer.kind === "unknown") summary.cantTell++;
    else {
      for (const choice of record.answer.cats) {
        const tally = tallies.get(choice.cat) ?? { cat: choice.cat, visits: 0, photos: 0 };
        tally.visits++;
        if (record.answer.cats.length === 1) tally.photos += itemsByKey.get(key)?.photos ?? 0;
        tallies.set(choice.cat, tally);
      }
    }
  }
  summary.cats = [...tallies.values()];
  return summary;
}

/** How many training photos each cat gained between two `kibble/cats` reads: the real number
 * the end-of-queue summary shows once the server has caught up. Never negative. */
export function trainingGains(
  before: readonly Pick<CatSummary, "name" | "training">[],
  after: readonly Pick<CatSummary, "name" | "training">[],
): Record<string, number> {
  const gains: Record<string, number> = {};
  for (const cat of after) {
    const start = before.find((other) => other.name === cat.name)?.training.total ?? 0;
    gains[cat.name] = Math.max(0, cat.training.total - start);
  }
  return gains;
}
