/** Pure charge/cancel/complete state machine for `kibble-hold-button.ts`'s press-and-hold
 * gesture -- everything about *when* a stage pulse fires, when the tension zone begins, and
 * whether this hold ends in a completion or a cancel, with no DOM, timers, or animation APIs
 * involved. The component drives one `HoldState` value from a `requestAnimationFrame` loop
 * (computing `elapsedMs` from a real clock each frame, never accumulating drift) and turns the
 * derived `holdProgress`/`holdNearComplete`/`holdNewlyCrossedStages` values into transform/
 * opacity style writes; this module only ever answers "what is true right now".
 */

export type HoldPhase = "idle" | "charging" | "draining" | "completed";

export interface HoldState {
  phase: HoldPhase;
  /** ms elapsed since the current phase (`charging` or `draining`) began. Unused in `idle`/
   * `completed`, which are resting states with nothing left to advance. */
  elapsedMs: number;
  /** Stage indices already fired during this charge, so a driver calling `holdTick` every frame
   * never re-fires one. Reset on every fresh `holdPress`. */
  firedStages: readonly number[];
  /** Progress captured at the instant `holdRelease` was called -- what `draining` counts back
   * down from. Meaningless outside `draining`. */
  releaseProgress: number;
}

export const HOLD_IDLE: HoldState = { phase: "idle", elapsedMs: 0, firedStages: [], releaseProgress: 0 };

export interface HoldConfig {
  durationMs: number;
  /** Ascending progress fractions in (0, 1) at which a stage tick fires: a pulse, a brightness
   * step, and a light haptic. */
  stageThresholds: readonly number[];
  /** Progress fraction at which the near-completion tension treatment (glow + tremble) begins. */
  nearCompleteAt: number;
  /** How long a cancelled hold takes to drain back to zero, in ms -- a fast ease-out, never an
   * instant snap. */
  drainMs: number;
}

export const DEFAULT_HOLD_CONFIG: HoldConfig = {
  durationMs: 1500,
  // Thirds read as more deliberate stage-ups than quarters, and holding the third tier off
  // until 86% leaves a real "just before completion" gap before the near-complete zone takes
  // over -- see that zone's own comment for why the two never overlap.
  stageThresholds: [0.33, 0.66, 0.86],
  // Starts just after the third stage tier locks in, so the tremble/glow ramp reads as pure
  // anticipation on a settled gold tier rather than fighting a colour change mid-tremble.
  nearCompleteAt: 0.88,
  // A fast ease-out, but with enough room to actually read as a deliberate settle rather than
  // a snap back to zero.
  drainMs: 300,
};

/** Starts a fresh charge. Any prior progress (mid-drain, or a stale completed hold) is
 * discarded -- a new press always starts at zero. */
export function holdPress(): HoldState {
  return { phase: "charging", elapsedMs: 0, firedStages: [], releaseProgress: 0 };
}

/** Advances the clock by `deltaMs`. Charging that reaches `config.durationMs` settles into
 * `completed`, clamped there rather than overshooting past it. Draining that reaches
 * `config.drainMs` settles into `idle`. A no-op from `idle`/`completed`: both are resting states
 * with nothing to advance. */
export function holdTick(state: HoldState, deltaMs: number, config: HoldConfig): HoldState {
  if (state.phase === "charging") {
    const elapsedMs = state.elapsedMs + deltaMs;
    if (elapsedMs >= config.durationMs) {
      return { phase: "completed", elapsedMs: config.durationMs, firedStages: state.firedStages, releaseProgress: 0 };
    }
    return { ...state, elapsedMs };
  }
  if (state.phase === "draining") {
    const elapsedMs = state.elapsedMs + deltaMs;
    if (elapsedMs >= config.drainMs) return HOLD_IDLE;
    return { ...state, elapsedMs };
  }
  return state;
}

/** Released before completion: `charging` -> `draining`, capturing wherever the charge had
 * reached so the drain counts back down from there rather than from a full bar. A no-op from
 * any other phase -- `idle` has nothing to release, and `draining`/`completed` are already
 * resolved one way or the other. */
export function holdRelease(state: HoldState, config: HoldConfig): HoldState {
  if (state.phase !== "charging") return state;
  const progress = Math.min(1, state.elapsedMs / config.durationMs);
  return { phase: "draining", elapsedMs: 0, firedStages: [], releaseProgress: progress };
}

/** 0..1 visual fill for the current state. */
export function holdProgress(state: HoldState, config: HoldConfig): number {
  if (state.phase === "idle") return 0;
  if (state.phase === "completed") return 1;
  if (state.phase === "charging") return Math.min(1, state.elapsedMs / config.durationMs);
  // draining: reverse-interpolate from the progress at release back to zero over drainMs.
  const drained = config.drainMs > 0 ? Math.min(1, state.elapsedMs / config.drainMs) : 1;
  return state.releaseProgress * (1 - drained);
}

/** Whether the final-approach tension treatment (glow + tremble) should be showing right now.
 * Only meaningful mid-charge -- a cancelled hold has nothing left to build tension toward. */
export function holdNearComplete(state: HoldState, config: HoldConfig): boolean {
  if (state.phase !== "charging") return false;
  return holdProgress(state, config) >= config.nearCompleteAt;
}

/** Stage indices crossed for the first time by this exact state, compared against
 * `state.firedStages` -- call once per frame and fire each returned index's pulse/haptic, then
 * fold the result back in with `holdMarkStagesFired` so the next frame doesn't repeat it. A
 * frame slow enough to jump past two thresholds at once still returns both, in order. */
export function holdNewlyCrossedStages(state: HoldState, config: HoldConfig): number[] {
  if (state.phase !== "charging") return [];
  const progress = holdProgress(state, config);
  const crossed: number[] = [];
  config.stageThresholds.forEach((threshold, index) => {
    if (progress >= threshold && !state.firedStages.includes(index)) crossed.push(index);
  });
  return crossed;
}

export function holdMarkStagesFired(state: HoldState, indices: readonly number[]): HoldState {
  if (indices.length === 0) return state;
  return { ...state, firedStages: [...state.firedStages, ...indices] };
}
