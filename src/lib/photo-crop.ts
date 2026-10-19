/** Square-crop geometry for the photo intake flows (training uploads, avatar picker): a crop is
 * always an image-fraction `[x1,y1,x2,y2]` against the source photo's own *oriented* (post-EXIF)
 * pixel box, exactly like `detection-areas.ts`'s `NormalizedArea` -- but additionally locked
 * square in *physical* (source-pixel) terms, which `detection-areas.ts`'s free-form rectangles
 * never need to care about. Reuses that module's primitives everywhere the square constraint
 * doesn't change the math (`handlePoint`, `normalizedAreaFromPoints`, `clampUnit`, `moveArea`)
 * and adds only what a square needs on top: a default centered crop, corner-drag resize that
 * keeps both edges equal in pixels (not fractions -- a non-square photo's fractions differ per
 * axis even for a visually square crop), and pinch-to-scale.
 */

import { areaWidth, clampUnit, handlePoint, moveArea, normalizedAreaFromPoints, MIN_AREA_SIZE, type NormalizedArea, type NormalizedPoint } from "./detection-areas";

export interface ImageSize {
  width: number;
  height: number;
}

/** Only corner handles resize a locked-square crop -- there is no meaningful "drag just the
 * right edge" of a square, since the perpendicular edges would have to move too. Matches the
 * assignment's own "drag to move, pinch or corner-drag to resize." */
export type CropCorner = "nw" | "ne" | "se" | "sw";

const OPPOSITE_CORNER: Record<CropCorner, CropCorner> = { nw: "se", ne: "sw", se: "nw", sw: "ne" };
const CORNER_SIGN: Record<CropCorner, { x: 1 | -1; y: 1 | -1 }> = {
  se: { x: 1, y: 1 },
  sw: { x: -1, y: 1 },
  ne: { x: 1, y: -1 },
  nw: { x: -1, y: -1 },
};

/** How small a crop may shrink to, as a fraction of the image's *shorter* side -- the square
 * analogue of `detection-areas.ts`'s `MIN_AREA_SIZE` (stay grabbable at the smallest supported
 * stage width), expressed against one physical measurement instead of two independent axis
 * fractions since a locked square only ever has one size. */
export const MIN_CROP_FRACTION = MIN_AREA_SIZE;

function isValidSize(size: ImageSize): boolean {
  return Number.isFinite(size.width) && Number.isFinite(size.height) && size.width > 0 && size.height > 0;
}

/** The largest square that fits centered inside an image of `size`, as an image-fraction crop --
 * every newly added photo starts here. A square source photo crops to the whole frame. Degenerate
 * sizes (not yet known, decode failed) also fall back to the whole frame rather than a crop that
 * would divide by zero. */
export function defaultSquareCrop(size: ImageSize): NormalizedArea {
  if (!isValidSize(size)) return [0, 0, 1, 1];
  const { width, height } = size;
  if (width === height) return [0, 0, 1, 1];
  if (width > height) {
    const half = height / width / 2;
    return [0.5 - half, 0, 0.5 + half, 1];
  }
  const half = width / height / 2;
  return [0, 0.5 - half, 1, 0.5 + half];
}

/** Moves `crop` by `dxFraction,dyFraction` (image fractions), sliding it back inside the unit
 * square at the frame edge rather than resizing it. A translate never changes a rectangle's
 * size regardless of aspect, so `detection-areas.ts`'s own `moveArea` already does exactly this
 * -- nothing square-specific to add. */
export function moveSquareCrop(crop: NormalizedArea, dxFraction: number, dyFraction: number): NormalizedArea {
  return moveArea(crop, dxFraction, dyFraction);
}

/** Drags corner `corner` to `point` (image fractions), keeping the crop square in physical
 * pixels with the opposite corner held fixed -- the standard photo-crop corner-resize contract.
 * Clamped so the crop can never grow past the image bounds or shrink under `minFraction` of the
 * image's shorter side. */
export function resizeSquareCrop(crop: NormalizedArea, corner: CropCorner, point: NormalizedPoint, size: ImageSize, minFraction: number = MIN_CROP_FRACTION): NormalizedArea {
  if (!isValidSize(size)) return crop;
  const { width, height } = size;
  const anchor = handlePoint(crop, OPPOSITE_CORNER[corner]);
  const sign = CORNER_SIGN[corner];
  const rawWidthPx = Math.abs(point.x - anchor.x) * width;
  const rawHeightPx = Math.abs(point.y - anchor.y) * height;
  const roomXPx = (sign.x > 0 ? 1 - anchor.x : anchor.x) * width;
  const roomYPx = (sign.y > 0 ? 1 - anchor.y : anchor.y) * height;
  const minPx = minFraction * Math.min(width, height);
  const sidePx = Math.min(Math.max(rawWidthPx, rawHeightPx, minPx), roomXPx, roomYPx);
  const cornerX = clampUnit(anchor.x + sign.x * (sidePx / width));
  const cornerY = clampUnit(anchor.y + sign.y * (sidePx / height));
  return normalizedAreaFromPoints(anchor, { x: cornerX, y: cornerY });
}

/** Scales `crop`'s physical side length by `factor` (>1 grows, <1 shrinks) around its own
 * center -- the pinch-to-resize gesture. Clamped between `minFraction` of the image's shorter
 * side and the image's own shorter side (a square crop can never exceed the frame), then the
 * *center* slides back inside the unit square if it was too close to an edge to hold the new
 * size centered, rather than shrinking the requested size further. */
export function scaleSquareCrop(crop: NormalizedArea, factor: number, size: ImageSize, minFraction: number = MIN_CROP_FRACTION): NormalizedArea {
  if (!isValidSize(size) || !Number.isFinite(factor) || factor <= 0) return crop;
  const { width, height } = size;
  const centerX = (crop[0] + crop[2]) / 2;
  const centerY = (crop[1] + crop[3]) / 2;
  const minPx = minFraction * Math.min(width, height);
  const maxPx = Math.min(width, height);
  const targetPx = Math.min(maxPx, Math.max(minPx, areaWidth(crop) * width * factor));
  const halfFracX = targetPx / width / 2;
  const halfFracY = targetPx / height / 2;
  const clampedCenterX = Math.min(1 - halfFracX, Math.max(halfFracX, centerX));
  const clampedCenterY = Math.min(1 - halfFracY, Math.max(halfFracY, centerY));
  return [clampedCenterX - halfFracX, clampedCenterY - halfFracY, clampedCenterX + halfFracX, clampedCenterY + halfFracY];
}

/** Straight-line distance between two pointer points, in whatever unit they're given (client
 * pixels for a real touch gesture) -- a pinch's own metric: `scaleSquareCrop`'s `factor` is the
 * ratio of this distance now over this distance when the gesture started. */
export function pinchDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
