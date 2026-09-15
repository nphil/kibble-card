/** Shared numeric/JS-side tokens. CSS-side type-scale/spacing tokens live as custom properties
 * on the card host (`kibble-card.ts`); these are the values JS logic itself needs to branch on
 * (the ResizeObserver threshold, animation timings that must stay under Nitin's caps).
 */

export const KIOSK_MIN_HEIGHT_PX = 440;
export const KIOSK_SCALE = 1.25;

export const HOLD_TO_FEED_MS = 600;
export const KIBBLE_FALL_DURATION_MS = 900;

export const KIBBLE_AMBER = "#F4A452";
export const KIBBLE_AMBER_DARK = "#DE8A3A";
export const KIBBLE_INK_ON_AMBER = "#3A2C28";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}
