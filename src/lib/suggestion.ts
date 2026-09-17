/** Which suggestion, if any, a pending crop's chip should offer: the classifier's own guess when
 * it clears the confidence bar, else the feeder's onboard identification, else nothing to
 * confirm -- a chip only ever offers a genuine signal, never a guess dressed up as one. Both
 * signals are also checked against `knownCats`, the current roster: a cat can be deleted after
 * the feeder (or the classifier) already named it in a still-pending crop, and a chip pointing
 * at a name `label_face` would reject outright is worse than falling through to the other
 * signal, or to no suggestion at all. Kept free of hass/service plumbing so the threshold
 * boundary is directly unit testable.
 */

import type { PendingFaceCrop } from "../types";

export interface FaceSuggestion {
  cat: string;
  source: "classifier" | "vendor";
}

export function chooseSuggestion(
  crop: Pick<PendingFaceCrop, "guess" | "vendor_cat">,
  confidence: number,
  knownCats: ReadonlySet<string>,
): FaceSuggestion | null {
  if (crop.guess && crop.guess.score >= confidence && knownCats.has(crop.guess.cat)) {
    return { cat: crop.guess.cat, source: "classifier" };
  }
  if (crop.vendor_cat && knownCats.has(crop.vendor_cat)) {
    return { cat: crop.vendor_cat, source: "vendor" };
  }
  return null;
}
