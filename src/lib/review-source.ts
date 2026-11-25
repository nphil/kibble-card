/** Reads the review queue from Kibble: `kibble/review/photos`, one page of photos waiting for an
 * answer. The server decides which photos and in what order; the card only asks for the next
 * page. A page is cleaned up on the way in, so the screen never meets a photo without a uid or
 * a count that is not a number.
 */

import type { PhotoQueueItem, PhotoQueuePage } from "../types";

export type CallWS = (message: Record<string, unknown>) => Promise<unknown>;

/** Photos per page: enough to keep ahead of a quick thumb, small enough to load at once. */
export const PHOTO_PAGE_SIZE = 24;

function count(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function isItem(value: unknown): value is PhotoQueueItem {
  if (!value || typeof value !== "object") return false;
  const { sample, visit } = value as { sample?: { uid?: unknown }; visit?: { uid?: unknown } };
  return typeof sample?.uid === "string" && typeof visit?.uid === "string";
}

/** One page of photos waiting for an answer, `cursor` continuing the previous page. */
export async function loadPhotoPage(callWS: CallWS, entryId: string, cursor: string | null = null, limit = PHOTO_PAGE_SIZE): Promise<PhotoQueuePage> {
  const raw = (await callWS({ type: "kibble/review/photos", entry_id: entryId, limit, ...(cursor ? { cursor } : {}) })) as Partial<PhotoQueuePage> | null;
  return {
    items: Array.isArray(raw?.items) ? raw.items.filter(isItem) : [],
    remaining: count(raw?.remaining),
    visits: count(raw?.visits),
    cursor: typeof raw?.cursor === "string" && raw.cursor ? raw.cursor : null,
    has_more: raw?.has_more === true,
  };
}

/** Just how many photos are waiting: what an entry button's badge shows. */
export async function loadPhotosLeft(callWS: CallWS, entryId: string): Promise<number> {
  return (await loadPhotoPage(callWS, entryId, null, 1)).remaining;
}
