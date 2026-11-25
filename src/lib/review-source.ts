/** Loads the review queue's raw material: every visit Kibble could not name (`kibble/review`)
 * and the recent timeline with its unconfirmed guesses (`kibble/timeline`). Both are read to
 * the end through their cursors, so the queue is never capped at one page. The two reads are
 * separate so the screen can start on the unknown visits while the timeline is still loading.
 */

import type { ReviewPage, TimelineEvent, TimelinePage } from "../types";

export type CallWS = (message: Record<string, unknown>) => Promise<unknown>;

const REVIEW_PAGE_SIZE = 60;
const TIMELINE_PAGE_SIZE = 100;
/** A hard stop so a server that keeps answering `has_more` can never loop this forever. */
const MAX_PAGES = 20;

async function readAllPages<P extends TimelinePage>(callWS: CallWS, type: string, entryId: string, limit: number): Promise<{ items: TimelineEvent[]; last: P | null }> {
  const items: TimelineEvent[] = [];
  let cursor: string | null = null;
  let last: P | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    last = (await callWS({ type, entry_id: entryId, limit, ...(cursor ? { cursor } : {}) })) as P;
    items.push(...last.items);
    if (!last.has_more || !last.cursor) break;
    cursor = last.cursor;
  }
  return { items, last };
}

/** Every visit waiting for a name, newest first, and how many there are in total. */
export async function loadUnknownVisits(callWS: CallWS, entryId: string): Promise<{ items: TimelineEvent[]; total: number }> {
  const { items, last } = await readAllPages<ReviewPage>(callWS, "kibble/review", entryId, REVIEW_PAGE_SIZE);
  return { items, total: last?.total ?? items.length };
}

/** Every visit and meal the timeline still keeps, newest first (feeds left out). */
export async function loadTimelineVisits(callWS: CallWS, entryId: string): Promise<TimelineEvent[]> {
  const { items } = await readAllPages<TimelinePage>(callWS, "kibble/timeline", entryId, TIMELINE_PAGE_SIZE);
  return items.filter((item) => item.kind === "eat" || item.kind === "visit");
}

/** Just the count of visits waiting for a name: what an entry button's badge shows. */
export async function loadUnknownCount(callWS: CallWS, entryId: string): Promise<number> {
  const page = (await callWS({ type: "kibble/review", entry_id: entryId, limit: 1 })) as ReviewPage;
  return page.total;
}
