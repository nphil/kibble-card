/** Pure decision logic for the hero's dual-hopper feed: how each hopper's own chosen portion
 * count (kibble-card.ts's own per-hopper `kibble-segmented-picker`/`kibble-stepper`, 0..5) maps
 * onto what `kibble.feed` actually receives. Kept pure and separate from the element/service-call
 * plumbing so the four cases (0/n, n/0, a/b, 0/0) are directly unit testable.
 */

import type { HopperSide } from "./pour";

export interface DualFeedPlan {
  hopper: HopperSide;
  amount: number;
  amount2?: number;
}

/** `null` means neither hopper has a nonzero amount selected -- there is nothing to dispense.
 * The hero's Hold button is disabled in that same state; this is the one source of truth both
 * share, so neither can drift from the other. */
export function dualFeedPlan(amount1: number, amount2: number): DualFeedPlan | null {
  if (amount1 > 0 && amount2 > 0) return { hopper: "both", amount: amount1, amount2 };
  if (amount1 > 0) return { hopper: "1", amount: amount1 };
  if (amount2 > 0) return { hopper: "2", amount: amount2 };
  return null;
}
