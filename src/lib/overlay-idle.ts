/** Pure idle-timeout state machine behind `kibble-live-hero`'s video-overlay controls (fade out
 * like a video player's own control bar after a few seconds of no interaction). No wall clock,
 * no timers, no DOM -- the component owns a real `setTimeout` against `IDLE_MS`; this module
 * only decides, given an event and the current state, what the controls' visibility should
 * become next. Kept free of DOM/timer plumbing so the whole state machine is directly unit
 * testable, the same shape as `reconnect.ts`.
 */

/** How long the controls stay visible with no activity before they fade out. */
export const IDLE_MS = 5000;

export interface OverlayIdleState {
  visible: boolean;
}

/** The controls' fully-revealed state -- reused directly by every interaction that should reveal
 * them and restart the idle timer (pointer move/enter, wheel, a click/tap that reached a real
 * control because the controls were already visible, keyboard focus landing inside them), by the
 * component's own initial state, and by `revealOnFirstTap`'s reveal branch below. */
export const VISIBLE: OverlayIdleState = { visible: true };
/** The controls' faded-out state -- `onIdleTimeout`'s only real transition. */
export const HIDDEN: OverlayIdleState = { visible: false };

/** A tap/click on the frame itself while the controls are already hidden: reveals them and
 * reports that the tap must not also reach whatever sits under the pointer (a control, or the
 * frame's own expand-on-tap) -- the standard "first tap just reveals" mobile video-player
 * convention. A tap while already visible is not this function's job: it is a no-op
 * (`consumed: false`, state unchanged) so a caller that calls it unconditionally still behaves
 * correctly, even though every real call site here only calls it while `!state.visible`. */
export function revealOnFirstTap(state: OverlayIdleState): { state: OverlayIdleState; consumed: boolean } {
  if (state.visible) return { state, consumed: false };
  return { state: VISIBLE, consumed: true };
}

/** The idle timer firing: hides the controls, unless `pinned` says something is holding them
 * visible right now (mic/talkback active, the call-cats cooldown pulse running, a control
 * focused via the keyboard, an open settings popup, or anything else the caller decides should
 * pin) -- in which case nothing changes. The caller is expected to not even arm the timer while
 * pinned (`shouldArmTimer`) and to re-arm it the moment a pin condition ends, rather than let
 * this function poll; this is only a defensive fallback for a pin starting the same instant the
 * timer fires. */
export function onIdleTimeout(state: OverlayIdleState, pinned: boolean): OverlayIdleState {
  return pinned ? state : HIDDEN;
}

/** Whether the idle timer should be armed at all right now -- `false` while any pin condition
 * holds (see `onIdleTimeout`'s own doc), or while the controls are already hidden (nothing to
 * time out from). Named so the component's "activity just happened" handler and its "a pin
 * condition just ended" handler make the exact same arm/don't-arm decision without their own
 * copies of this logic drifting apart from each other. */
export function shouldArmTimer(state: OverlayIdleState, pinned: boolean): boolean {
  return state.visible && !pinned;
}
