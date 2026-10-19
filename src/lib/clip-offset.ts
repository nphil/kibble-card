/** Where a session's own segment begins inside the ONE clip the whole meal shares
 * (docs/39-eating-clips.md): a split per-cat segment's own `start` is still just a point in
 * time inside its parent's single recorded span, so seeking there (minus a short lead) puts
 * the video right where that cat's own turn begins instead of at the top of the whole meal.
 */

/** Milliseconds of lead before a session's own recorded `start`: the feeder's own eat-hold and
 * poll cadence mean a session's `start` timestamp trails the moment the cat is actually already
 * at the bowl by a little, and the recorder's own pre-roll begins independently on its side --
 * this absorbs both without needing either clock to be exact. */
export const CLIP_SEEK_LEAD_MS = 3000;

/** `video.currentTime`'s own unit (seconds) to seek a clip to for one session: `eventStartSeconds`
 * is that session's own `start` (unix seconds -- a split child's own, never its parent's),
 * `clipStartMs` is the shared clip's own recorded start (`TimelineEvent.clip.start_ms`).
 * Clamped to 0 -- a session that starts at or before the clip itself (clock skew, or the very
 * first segment of a split family) must never seek to a negative time. */
export function clipSeekOffsetSeconds(eventStartSeconds: number, clipStartMs: number): number {
  const offsetMs = eventStartSeconds * 1000 - clipStartMs - CLIP_SEEK_LEAD_MS;
  return Math.max(0, offsetMs) / 1000;
}
