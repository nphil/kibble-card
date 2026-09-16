/** Which suggestion, if any, a pending crop's chip should offer: the classifier's own guess when
 * it clears the confidence bar, else the feeder's onboard identification, else nothing to
 * confirm -- a chip only ever offers a genuine signal, never a guess dressed up as one. Kept
 * free of hass/service plumbing so the threshold boundary is directly unit testable.
 */

import type { PendingFaceCrop } from "../types";

export interface FaceSuggestion {
  cat: string;
  source: "classifier" | "vendor";
}

export function chooseSuggestion(
  crop: Pick<PendingFaceCrop, "guess" | "vendor_cat">,
  confidence: number,
): FaceSuggestion | null {
  if (crop.guess && crop.guess.score >= confidence) {
    return { cat: crop.guess.cat, source: "classifier" };
  }
  if (crop.vendor_cat) {
    return { cat: crop.vendor_cat, source: "vendor" };
  }
  return null;
}
