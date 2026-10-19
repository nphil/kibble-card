/** Optimistic per-sample reconciliation for an event-level `kibble/label` save -- the labelling
 * sheet's own photo grid and viewer read a sample's `label`/`review` directly (ux-spec.md
 * section A: no shared "caption" abstraction, no per-photo AI guess text anywhere), so the only
 * thing this module still owns is the one rule below.
 */

import type { Sample } from "../types";

/** Optimistically predicts each sample's own effective `label` right after an event-level
 * `kibble/label` call, mirroring the store's own `reconcile_event_training` rule exactly:
 * `"unknown"` never touches training at all; a cat/`not_a_cat` label is adopted by every
 * sample with no override of its own (`review === null`); a skip stays untrained regardless;
 * an existing per-photo override is left exactly alone. Lets the sheet show the *result* of a
 * label tap immediately, without waiting for the background reconciliation that actually
 * persists it -- the same fast-response/slow-followup split `kibble/label` itself uses.
 * Returns the same array reference when nothing actually changes. */
export function reconcileSamplesForEventLabel(samples: Sample[], label: string): Sample[] {
  if (label === "unknown") return samples;
  let changed = false;
  const next = samples.map((sample) => {
    if (sample.review !== null) return sample; // a skip or an override -- relabelling never moves it
    if (sample.label === label) return sample;
    changed = true;
    return { ...sample, label };
  });
  return changed ? next : samples;
}
