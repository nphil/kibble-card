/** When a cat was most recently seen, from the newest of two independent signals: `kibble/cats`'
 * own `last_seen` (the vendor/classifier's per-cat pointer, refreshed on any detection) and this
 * cat's own "identified" rows in `kibble/timeline` (a "sighting", exactly what
 * `lib/timeline.ts#detectionHeadline`'s "Kitty was here" means). The two can disagree -- a
 * detection can update one before the other, or per-cat identification can be off entirely while
 * the vendor's own pointer keeps moving -- so the honest answer is always the newer of the two,
 * never either alone. A caller with zero sightings must still show this rather than claiming the
 * cat was never seen; see `KibbleCatsCard#_renderGallery`. `null` only when neither signal has
 * ever fired.
 */
export function catLastSeenTs(lastSeen: number | null, sightingTimestamps: readonly number[]): number | null {
  const newest = Math.max(lastSeen ?? 0, 0, ...sightingTimestamps);
  return newest > 0 ? newest : null;
}
