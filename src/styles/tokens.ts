/** Shared numeric/JS-side tokens. CSS-side type-scale/spacing tokens live as custom properties
 * on the card host (`kibble-card.ts`); these are the values JS logic itself needs to branch on
 * (the ResizeObserver threshold, animation timings that must stay under Nitin's caps).
 */

export const KIOSK_MIN_HEIGHT_PX = 440;
export const KIOSK_SCALE = 1.25;

/** How long "Hold to feed" must be held.
 *
 * 600 ms was long enough to stop a cat's paw but too short to *read* as a hold: the button
 * filled and fired before the gesture registered as deliberate, so the interaction was
 * unclear even to the person performing it (owner, 2026-09-20). 1.5 s is long enough that the
 * fill sweeping across the button is visibly a progress bar you are driving, and short enough
 * not to feel like a punishment. */
export const HOLD_TO_FEED_MS = 1500;
export const KIBBLE_FALL_DURATION_MS = 900;

export const KIBBLE_AMBER = "#F4A452";
export const KIBBLE_AMBER_DARK = "#DE8A3A";
export const KIBBLE_INK_ON_AMBER = "#3A2C28";

// The "live" red is reserved for the video-live dot only -- never reused for error states,
// which use the theme's own `--error-color` instead (DESIGN.md's token table).
export const KIBBLE_LIVE = "#E5484D";

// One color per enrolled cat, assigned by `color_index` (stable per cat, not array position --
// see the integration's `CatInfo.color_index`). Cycles once there are more than four cats
// rather than inventing a fifth hue outside the token system.
export const CAT_PALETTE = ["#3FA7A0", "#9A5B9E", "#7FA05A", "#4F86C6"] as const;

export function catColorAt(colorIndex: number): string {
  const n = CAT_PALETTE.length;
  return CAT_PALETTE[((colorIndex % n) + n) % n]!;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}
