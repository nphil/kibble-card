/** Pure logic for the bowl-calibration wizard (`components/kibble-calibration-dialog.ts`): the
 * step state machine that drives the dialog, the "score went down" check the collecting step
 * warns on the moment it happens, and the raw-score -> calibrated-percentage conversion the
 * bowl display uses once a hopper has a finished curve. Kept free of hass/WS plumbing -- every
 * daemon call stays in the dialog -- so a bad transition or a bad interpolation is unit
 * testable directly against plain objects. See `types.ts`'s calibration section and DESIGN.md
 * for the wire contract this is built on.
 */

import type { CalibrationHopper, CalibrationPoint, CalibrationState } from "../types";

// ---- Wizard step state machine ----

/** One screen of the wizard, in the order the flow actually visits them. `done` is terminal
 * except for `restart`, which is how "Calibrate the other hopper" gets back to the top. */
export type CalibrationStep = "choose-hopper" | "confirm-empty" | "collecting" | "mark-full" | "offer-inherit" | "done";

/** Every event the wizard's own UI can raise. Each names what just *succeeded* server-side
 * (or, for `capture`, one more of the same success) -- the dialog only ever advances the step
 * after the matching daemon call actually returns, never on its own optimism. */
export type CalibrationWizardEvent = "start" | "empty-confirmed" | "capture" | "review-full" | "full-marked" | "inherit-resolved" | "restart";

const TRANSITIONS: Record<CalibrationStep, Partial<Record<CalibrationWizardEvent, CalibrationStep>>> = {
  "choose-hopper": { start: "confirm-empty" },
  "confirm-empty": { "empty-confirmed": "collecting" },
  collecting: { capture: "collecting", "review-full": "mark-full" },
  "mark-full": { "full-marked": "offer-inherit" },
  "offer-inherit": { "inherit-resolved": "done" },
  done: { restart: "choose-hopper" },
};

/** The step after `event` fires from `step`, or `step` unchanged when `event` isn't legal
 * there -- e.g. a duplicate/late response firing `full-marked` a second time while already on
 * `offer-inherit` is a no-op, not a skip or a crash. */
export function nextCalibrationStep(step: CalibrationStep, event: CalibrationWizardEvent): CalibrationStep {
  return TRANSITIONS[step][event] ?? step;
}

/** Every event legal from `step` right now -- what the dialog uses to decide which buttons to
 * even render. A visible-but-disabled "Mark full" before `review-full` is legal would just
 * invite the exact click this is for. */
export function allowedCalibrationEvents(step: CalibrationStep): CalibrationWizardEvent[] {
  return Object.keys(TRANSITIONS[step]) as CalibrationWizardEvent[];
}

/** Whether the collecting step may move on to "mark full" yet. The step machine alone allows
 * `review-full` as soon as collecting starts, but the 0-portion point by itself can never be
 * "full" -- that would mean the empty bowl and the full bowl read the same -- so this is the
 * curve-shaped half of "what is allowed when" the step transition can't express on its own. */
export function canReviewFull(points: CalibrationPoint[]): boolean {
  return points.some((point) => point.portions > 0);
}

// ---- Score regression ----

export interface ScoreRegression {
  previousPortions: number;
  previousScore: number;
  newScore: number;
}

/** `points` is the curve captured so far, oldest first. Compares `newPoint` only against the
 * immediately preceding step (not the running max) because that is exactly what the daemon
 * itself can't interpolate through -- a curve that dips anywhere along its length is unusable
 * end to end, but naming *which* step just broke it is what lets the operator recapture that
 * one step instead of restarting the whole curve. `null` means no regression to warn about. */
export function detectScoreRegression(points: CalibrationPoint[], newPoint: CalibrationPoint): ScoreRegression | null {
  const previous = points[points.length - 1];
  if (!previous || newPoint.score >= previous.score) return null;
  return { previousPortions: previous.portions, previousScore: previous.score, newScore: newPoint.score };
}

// ---- Status wording for the "choose hopper" step ----

export type CalibrationStatusKind = "never" | "measured" | "inherited";

export interface CalibrationStatus {
  kind: CalibrationStatusKind;
  /** 1-based, display-ready hopper number this curve was inherited from -- set only when
   * `kind` is `"inherited"`. */
  inheritedFromDisplay: number | null;
  measuredAt: number | null;
  note: string | null;
  /** `full_portions` has been set -- a curve can have points but no finished "full" yet
   * (calibration abandoned mid-flow), which still reports `kind: "measured"` but isn't done. */
  finished: boolean;
}

/** Derives the "choose hopper" screen's status line from one hopper's raw calibration record --
 * see the dialog's `_renderChooseHopper` for how `kind`/`finished` pick the exact wording. */
export function calibrationStatus(hopper: CalibrationHopper | null): CalibrationStatus {
  if (!hopper) return { kind: "never", inheritedFromDisplay: null, measuredAt: null, note: null, finished: false };
  const inheritedFrom = typeof hopper.source === "object" ? hopper.source.inherited_from : null;
  return {
    kind: inheritedFrom !== null ? "inherited" : "measured",
    inheritedFromDisplay: inheritedFrom !== null ? inheritedFrom + 1 : null,
    measuredAt: hopper.measured_at,
    note: hopper.note || null,
    finished: hopper.full_portions != null,
  };
}

// ---- Raw score -> calibrated percentage ----

/** Converts one raw bowl score into a 0-100 calibrated percentage using a finished curve, by
 * linear interpolation between whichever two recorded points bracket `rawScore` -- the wizard
 * captures one portion at a time (rather than just the empty and full endpoints) specifically
 * so this can track the camera's real, non-linear response instead of fitting one straight
 * line through the whole curve. `null` for a hopper that was never calibrated, or one still
 * mid-calibration (no `full_portions` yet): there is no "100%" to calibrate against.
 *
 * `rawScore` MUST already be in the curve's own 0.0-1.0 units, i.e. `points[].score`'s scale --
 * NOT `sensor.<feeder>_bowl_fill`'s live 0-100 state, which is that same fraction times 100
 * (confirmed against the daemon's own `calibration_write`: `score = bowl_fill / 100`, exactly,
 * no independent rounding). A caller reading the live sensor divides by 100 before calling
 * this; callers already holding a `CalibrationPoint.score` pass it straight through.
 *
 * Assumes a non-decreasing curve, same as the daemon does -- the wizard's own live "score went
 * down" warning (`detectScoreRegression`) is what keeps a real curve that way. */
export function calibratedPercent(hopper: CalibrationHopper | null, rawScore: number): number | null {
  if (!hopper || hopper.full_portions == null || hopper.full_score == null) return null;
  const points = [...hopper.points].sort((a, b) => a.portions - b.portions);
  const first = points[0];
  if (!first) return null;
  if (rawScore <= first.score) return 0;
  if (rawScore >= hopper.full_score) return 100;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    if (rawScore > curr.score) continue;
    const span = curr.score - prev.score;
    const fraction = span <= 0 ? 0 : (rawScore - prev.score) / span;
    const portionAtScore = prev.portions + fraction * (curr.portions - prev.portions);
    const percent = (portionAtScore / hopper.full_portions) * 100;
    return Math.max(0, Math.min(100, percent));
  }
  return 100;
}

/** Which hopper's curve the shared bowl reading should be interpreted against. There is no
 * hardware signal for "which hopper's food is in the bowl right now" -- confirmed against the
 * integration side of this contract: nothing tracks that, and nothing could, since both augers
 * feed one bowl until a physical divider exists -- so this is a deliberate, simple default:
 * prefer hopper 0 ("Hopper 1"), falling back to hopper 1 only when that's the one actually
 * calibrated. Once both hoppers agree (the common case, via the wizard's own "same food"
 * inherit) which one this picks stops mattering. */
export function displayCalibrationHopper(state: CalibrationState | null): CalibrationHopper | null {
  if (!state) return null;
  return state.hoppers[0] ?? state.hoppers[1] ?? null;
}
