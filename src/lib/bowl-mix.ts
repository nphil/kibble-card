/** How much of the bowl's current contents should read as hopper 2's food, 0..1 -- derived from
 * `kibble/timeline`'s own per-hopper breakdown rather than assumed, so the art's mixed-food
 * rendering matches what actually landed in the bowl instead of guessing an even split.
 *
 * Only the most recent feed that both (a) happened within `BOWL_MIX_MAX_AGE_MS` and (b) recorded
 * a per-hopper split counts: an old split feed says nothing about what's in the bowl now, long
 * since eaten into or topped up by single-hopper feeds since, and a feed with no split (a legacy
 * row, or one that predates per-side tracking) has nothing honest to report either -- rather than
 * assume 50/50 for it, this keeps looking further back, still bounded by the same age cutoff.
 * Single-hopper mode has no second food to mix in at all.
 */

import type { TimelineEvent } from "../types";

export const BOWL_MIX_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export function deriveBowlMix(events: readonly TimelineEvent[], singleHopper: boolean, now: Date = new Date()): number {
  if (singleHopper) return 0;
  const cutoffSeconds = (now.getTime() - BOWL_MIX_MAX_AGE_MS) / 1000;
  for (const event of events) {
    if (event.kind !== "feed" || event.start < cutoffSeconds) continue;
    const sides = event.feed?.sides;
    if (!sides || sides.length === 0) continue;
    const total = sides.reduce((sum, side) => sum + side.portions, 0);
    if (total <= 0) continue;
    const hopper2Portions = sides.find((side) => side.hopper === 2)?.portions ?? 0;
    return hopper2Portions / total;
  }
  return 0;
}
