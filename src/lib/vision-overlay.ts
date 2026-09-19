/** Pure geometry (plus the one bit of text that rides along with it) for the live hero's
 * detection overlay (`components/kibble-live-hero.ts`): turns the feeder's own fraction boxes
 * (`kibble/vision/last`'s `detections`, 0..1 of the analysed frame) into CSS percentages, picks
 * which box the identified cat's name labels, and decides which side of that box the label sits
 * on. Kept free of Lit/DOM so the fraction-to-percent math and the label-flip rule are directly
 * unit testable without rendering anything.
 */

import type { VisionDetection } from "../types";

/** A box whose top edge is at least this close to the frame's own top edge leaves no room to
 * anchor a label pill above it without clipping it -- the label drops inside the box instead. */
export const LABEL_FLIP_THRESHOLD = 0.02;

export interface DetectionRect {
  left: string;
  top: string;
  width: string;
  height: string;
}

/** `fraction` (0..1) as a CSS percentage string, rounded to hundredths so float noise in the
 * feeder's own coordinates (e.g. `0.5711000000000001`) never shows up as a seven-digit style
 * value. */
function toPercent(fraction: number): string {
  return `${Math.round(fraction * 10000) / 100}%`;
}

/** `box`'s fraction coordinates (0..1 of the analysed frame) as CSS percentages of the video
 * element's own box -- the analysed frame and the stream share one 16:9 source, so this maps
 * directly with no letterboxing correction. Width/height are the SPAN between the two edges,
 * not `x2`/`y2` themselves -- the classic off-by-one this is worth pinning down with a test. */
export function detectionRect(box: Pick<VisionDetection, "x1" | "y1" | "x2" | "y2">): DetectionRect {
  return {
    left: toPercent(box.x1),
    top: toPercent(box.y1),
    width: toPercent(box.x2 - box.x1),
    height: toPercent(box.y2 - box.y1),
  };
}

/** The one detection the cat-name label anchors to: the largest *admitted* box by area.
 * Admission is what separates "a cat" from "the clutter memory's furniture", so the label never
 * lands on a quiet/dashed box just because it happens to be bigger. `null` when nothing is
 * admitted, however confident the open track is. */
export function largestAdmittedDetection(detections: readonly VisionDetection[]): VisionDetection | null {
  let best: VisionDetection | null = null;
  let bestArea = -Infinity;
  for (const detection of detections) {
    if (!detection.admitted) continue;
    const area = (detection.x2 - detection.x1) * (detection.y2 - detection.y1);
    if (area > bestArea) {
      best = detection;
      bestArea = area;
    }
  }
  return best;
}

/** True once `box`'s top edge is close enough to the frame's own top that the label's normal
 * placement (anchored just above the box) would be clipped by the frame itself -- the label
 * flips to just inside the box's top edge instead. */
export function labelFlipsInside(box: Pick<VisionDetection, "y1">): boolean {
  return box.y1 <= LABEL_FLIP_THRESHOLD;
}

/** The label pill's text: the name alone, or the name plus the feeder's confidence when it sent
 * one. DESIGN.md's "no middle-dot metadata strings" rule applies here too, so the score reads as
 * part of the same short phrase instead of a separated stat. */
export function catLabelText(cat: string, catScore: number | null | undefined): string {
  if (catScore === null || catScore === undefined) return cat;
  return `${cat} ${Math.round(catScore * 100)}%`;
}
