/** One in-page signal that says "a visit was just named". Every Kibble card on a dashboard
 * listens, so naming a visit in one card updates the others at once instead of waiting for the
 * integration's own push (which only arrives after its background retraining).
 *
 * A module-level `EventTarget`, deliberately not a `window` listener: the cards share one
 * bundle, so they share this object, and nothing leaks into the page.
 */

const bus = new EventTarget();
const EVENT = "kibble-review-changed";

export function announceReviewChange(entryId: string): void {
  bus.dispatchEvent(new CustomEvent(EVENT, { detail: { entryId } }));
}

/** Calls `listener` for every change to `entryId()`'s visits; returns the unsubscribe. */
export function onReviewChange(entryId: () => string | undefined, listener: () => void): () => void {
  const handler = (event: Event): void => {
    if ((event as CustomEvent<{ entryId: string }>).detail.entryId === entryId()) listener();
  };
  bus.addEventListener(EVENT, handler);
  return () => bus.removeEventListener(EVENT, handler);
}
