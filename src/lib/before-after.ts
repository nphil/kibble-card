/** Pure decision logic behind `components/kibble-before-after.ts`: wipe-position clamping,
 * keyboard-to-position mapping, and pointer-to-position math, kept free of DOM/pointer-event
 * objects so the interaction is directly unit testable without a browser. The component is the
 * only caller; it wires these functions to real `PointerEvent`/`KeyboardEvent` handlers and a
 * measured `DOMRect`.
 */

export type CompareMode = "split" | "wipe";

export const WIPE_MIN = 0;
export const WIPE_MAX = 100;
export const WIPE_DEFAULT = 50;
const WIPE_STEP = 5;

export function clampWipePosition(value: number): number {
  if (Number.isNaN(value)) return WIPE_DEFAULT;
  return Math.min(WIPE_MAX, Math.max(WIPE_MIN, value));
}

/** Maps an arrow/Home/End keydown to the wipe handle's next position, or `null` for any other
 * key -- so the caller can tell "ignore this key" apart from "moved to the position it was
 * already at". Left/Down nudge toward `before` (position 0 shows all `after`, none of
 * `before`); Right/Up nudge toward `after`'s opposite, i.e. reveal more `before`. Home/End jump
 * to the ends of the range, matching a native `<input type="range">`'s own key handling. */
export function wipePositionForKey(current: number, key: string): number | null {
  switch (key) {
    case "ArrowLeft":
    case "ArrowDown":
      return clampWipePosition(current - WIPE_STEP);
    case "ArrowRight":
    case "ArrowUp":
      return clampWipePosition(current + WIPE_STEP);
    case "Home":
      return WIPE_MIN;
    case "End":
      return WIPE_MAX;
    default:
      return null;
  }
}

/** Converts a pointer's viewport X into a wipe percentage across a frame's bounding rect. A
 * zero-width rect (measured before layout) reads as the default centre rather than dividing by
 * zero. */
export function wipePositionForPointer(clientX: number, rect: { left: number; width: number }): number {
  if (rect.width <= 0) return WIPE_DEFAULT;
  return clampWipePosition(((clientX - rect.left) / rect.width) * 100);
}

export interface CompareSides {
  before: string | null;
  after: string | null;
  /** True only when *both* sides have a photo -- a compare (split or wipe) needs both; a lone
   * side is just a photo with its label, never a placeholder standing in for the missing one. */
  hasPair: boolean;
}

export function resolveCompareSides(beforeSrc: string | null | undefined, afterSrc: string | null | undefined): CompareSides {
  const before = beforeSrc || null;
  const after = afterSrc || null;
  return { before, after, hasPair: before !== null && after !== null };
}
