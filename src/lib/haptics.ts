/** HA frontend's own haptic bridge: a plain `window` `CustomEvent` the stock frontend listens
 * for and, running inside the Home Assistant companion app on a phone, turns into a real tactile
 * tick. Everywhere else (a browser tab, this dev harness) it is a harmless, listener-less event.
 * `light` marks a hold's stage-threshold crossings; `success` marks a completed hold or a
 * confirmed action (mark hopper full). */

export type HapticKind = "light" | "success";

export function fireHaptic(kind: HapticKind): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("haptic", { detail: kind }));
}
