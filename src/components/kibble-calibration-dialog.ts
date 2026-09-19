/** The bowl-calibration wizard, opened from the settings dialog's "Bowl calibration" section.
 * Per hopper: confirm the bowl is empty and `begin` a fresh curve, then loop "operator dispenses
 * one portion by hand, wizard captures the resulting score" until the operator says which step
 * looked full, then optionally copy the finished curve to the other hopper. This dialog never
 * calls the feed service itself -- every portion in the loop is dispensed by the operator, using
 * the card's existing feed control or the app, which is why "Capture reading" is the only button
 * here that touches the bowl at all. A controlled overlay, the same contract every dialog in
 * this repo uses: the parent owns `open`, this only ever asks to close (`close-requested`) or
 * reports that the daemon's calibration record changed (`calibration-changed`, so the bowl's own
 * calibrated-percentage display knows to re-read it).
 *
 * The step machine itself (which screen follows which, what a screen may do) lives in
 * `lib/calibration.ts`, unit tested there directly -- this file only wires those transitions to
 * the actual `kibble/calibration`/`kibble/calibration/action` calls and renders each step.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import {
  calibrationStatus,
  canReviewFull,
  detectScoreRegression,
  nextCalibrationStep,
  type CalibrationStatus,
  type CalibrationStep,
  type ScoreRegression,
} from "../lib/calibration";
import { describeWsError } from "../lib/ws-query";
import { relativeTimeSentence } from "../lib/relative-time";
import { mdiIcon } from "../lib/mdi-icons";
import type { CalibrationHopper, CalibrationPoint, CalibrationState, HomeAssistant } from "../types";

/** `connection.send_error`'s stable code for the daemon's 409 on `point` -- covers two distinct
 * causes at the same status (confirmed against the daemon source): an animal is over the bowl,
 * or vision simply hasn't produced a fill reading yet (e.g. just after enabling it). Either way
 * the wizard treats it as a plain retry prompt, never an error banner -- the other two codes the
 * action command can raise (`agent_rejected`, `feeder_unreachable`) fall through to the generic
 * error path, same as a network failure would. */
const CALIBRATION_BUSY_CODE = "calibration_busy";

interface ActionFailure {
  message: string;
  retry: () => void;
}

function portionWord(portions: number): string {
  return `${portions} portion${portions === 1 ? "" : "s"}`;
}

/** The curve stores scores as the daemon's raw 0.0-1.0 fraction (confirmed against
 * `calibration_write`: `score = bowl_fill / 100`) -- every place this dialog shows one to a
 * human scales it back up, matching the "raw score" numbers the rest of the app already talks
 * about (the integration brief's own "empty reads 0-8", and the bowl's own raw-score display). */
function formatScore(score: number): string {
  return String(Math.round(score * 100));
}

export class KibbleCalibrationDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    entryId: { attribute: false },
    open: { type: Boolean, reflect: true },
    _step: { state: true },
    _hopper: { state: true },
    _calibration: { state: true },
    _loading: { state: true },
    _loadError: { state: true },
    _note: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _waitingForBowl: { state: true },
    _regression: { state: true },
    _markFullPortions: { state: true },
    _clearConfirmArmed: { state: true },
    _inheritedTo: { state: true },
  };

  declare hass: HomeAssistant;
  declare entryId: string | undefined;
  declare open: boolean;
  declare _step: CalibrationStep;
  declare _hopper: 0 | 1 | null;
  declare _calibration: CalibrationState | null;
  declare _loading: boolean;
  declare _loadError: string | null;
  declare _note: string;
  declare _busy: boolean;
  declare _error: ActionFailure | null;
  declare _waitingForBowl: boolean;
  declare _regression: ScoreRegression | null;
  declare _markFullPortions: number | null;
  declare _clearConfirmArmed: boolean;
  /** Set only when the operator just accepted the offer-inherit step, so `_renderDone` can say
   * where the curve went; cleared on every reset. */
  declare _inheritedTo: 0 | 1 | null;

  private _closeButtonRef = createRef<HTMLButtonElement>();
  private _clearConfirmTimer: number | undefined;

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) this._close();
  };

  constructor() {
    super();
    this.open = false;
    this.entryId = undefined;
    this._resetWizard();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._clearConfirmTimer);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._resetWizard();
      this._closeButtonRef.value?.focus();
      this._loadCalibration();
    }
  }

  private _resetWizard(): void {
    this._step = "choose-hopper";
    this._hopper = null;
    this._calibration = null;
    this._loading = false;
    this._loadError = null;
    this._note = "";
    this._busy = false;
    this._error = null;
    this._waitingForBowl = false;
    this._regression = null;
    this._markFullPortions = null;
    this._clearConfirmArmed = false;
    this._inheritedTo = null;
  }

  private _hopperData(index: 0 | 1 | null): CalibrationHopper | null {
    if (index === null || !this._calibration) return null;
    return this._calibration.hoppers[index];
  }

  private _loadCalibration = (): void => {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) {
      this._loadError = "Not connected.";
      return;
    }
    this._loading = true;
    this._loadError = null;
    callWS({ type: "kibble/calibration", entry_id: entryId }).then(
      (result) => {
        this._calibration = result as CalibrationState;
        this._loading = false;
      },
      (err: unknown) => {
        this._loadError = describeWsError(err);
        this._loading = false;
      },
    );
  };

  /** Every mutating call shares this: busy/error bookkeeping, the daemon's one special-cased
   * failure code, and telling the bowl display a finished/discarded curve may have changed. */
  private _runAction(action: Record<string, unknown>, retry: () => void, onSuccess: (state: CalibrationState) => void): void {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    this._busy = true;
    this._error = null;
    this._waitingForBowl = false;
    callWS({ type: "kibble/calibration/action", entry_id: entryId, ...action }).then(
      (result) => {
        this._busy = false;
        onSuccess(result as CalibrationState);
        this.dispatchEvent(new CustomEvent("calibration-changed", { bubbles: true, composed: true }));
      },
      (err: unknown) => {
        this._busy = false;
        if ((err as { code?: string } | null)?.code === CALIBRATION_BUSY_CODE) {
          this._waitingForBowl = true;
          return;
        }
        this._error = { message: describeWsError(err), retry };
      },
    );
  }

  private _selectHopper(index: 0 | 1): void {
    this._hopper = index;
    this._error = null;
  }

  private _beginRequested(): void {
    this._note = "";
    this._step = nextCalibrationStep(this._step, "start");
  }

  private _confirmEmpty = (): void => {
    if (this._hopper === null) return;
    const hopper = this._hopper;
    const note = this._note.trim();
    this._runAction({ action: "begin", hopper, ...(note ? { note } : {}) }, this._confirmEmpty, () => {
      // `begin` alone doesn't capture anything -- immediately follow it with the 0-portion
      // point so the curve the operator sees always starts at the empty bowl they just
      // confirmed, exactly like every later step.
      this._runAction({ action: "point", hopper, portions: 0 }, this._confirmEmpty, (state) => {
        this._calibration = state;
        this._regression = null;
        this._step = nextCalibrationStep(this._step, "empty-confirmed");
      });
    });
  };

  private _capturePoint = (): void => {
    if (this._hopper === null) return;
    const hopper = this._hopper;
    const points = this._hopperData(hopper)?.points ?? [];
    const portions = (points[points.length - 1]?.portions ?? 0) + 1;
    this._runAction({ action: "point", hopper, portions }, this._capturePoint, (state) => {
      const newPoint = state.hoppers[hopper]?.points.find((point) => point.portions === portions);
      this._regression = newPoint ? detectScoreRegression(points, newPoint) : null;
      this._calibration = state;
      this._step = nextCalibrationStep(this._step, "capture");
    });
  };

  private _reviewFull(): void {
    this._markFullPortions = null;
    this._step = nextCalibrationStep(this._step, "review-full");
  }

  private _confirmMarkFull = (): void => {
    if (this._hopper === null || this._markFullPortions === null) return;
    const hopper = this._hopper;
    const portions = this._markFullPortions;
    this._runAction({ action: "full", hopper, portions }, this._confirmMarkFull, (state) => {
      this._calibration = state;
      this._step = nextCalibrationStep(this._step, "full-marked");
    });
  };

  /** "Not now" resolves the offer with no daemon call at all -- declining isn't an action the
   * curve needs to remember, it just means this session doesn't touch the other hopper. */
  private _declineInherit(): void {
    this._inheritedTo = null;
    this._step = nextCalibrationStep(this._step, "inherit-resolved");
  }

  private _acceptInherit = (): void => {
    if (this._hopper === null) return;
    const from = this._hopper;
    const to = from === 0 ? 1 : 0;
    this._runAction({ action: "inherit", hopper: to, from }, this._acceptInherit, (state) => {
      this._calibration = state;
      this._inheritedTo = to;
      this._step = nextCalibrationStep(this._step, "inherit-resolved");
    });
  };

  /** Same tap-twice window `kibble-settings-dialog`'s cloud/stack toggles use -- clearing a
   * finished curve is exactly as consequential as those, so it gets the same second-tap guard
   * rather than firing on one accidental click. */
  private _clearRequested(): void {
    if (this._clearConfirmArmed) {
      clearTimeout(this._clearConfirmTimer);
      this._clearConfirmArmed = false;
      this._runClear();
      return;
    }
    this._clearConfirmArmed = true;
    this._clearConfirmTimer = setTimeout(() => {
      this._clearConfirmArmed = false;
    }, 3000) as unknown as number;
  }

  private _runClear = (): void => {
    if (this._hopper === null) return;
    const hopper = this._hopper;
    this._runAction({ action: "clear", hopper }, this._runClear, (state) => {
      this._calibration = state;
    });
  };

  private _restart(): void {
    const other = this._hopper === 0 ? 1 : this._hopper === 1 ? 0 : null;
    this._step = nextCalibrationStep(this._step, "restart");
    this._hopper = other;
    this._note = "";
    this._markFullPortions = null;
    this._regression = null;
    this._inheritedTo = null;
    this._clearConfirmArmed = false;
  }

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  };

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Calibrate bowl">
        <div class="sheet" @click=${(event: Event) => event.stopPropagation()}>
          <header>
            <span>Calibrate bowl</span>
            <button type="button" class="icon-button" ${ref(this._closeButtonRef)} @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          <div class="body">
            ${!this.hass?.callWS || !this.entryId ? html`<p class="hint">Calibration isn't available right now.</p>` : this._renderStep()}
          </div>
        </div>
      </div>
    `;
  }

  private _renderStep() {
    switch (this._step) {
      case "choose-hopper":
        return this._renderChooseHopper();
      case "confirm-empty":
        return this._renderConfirmEmpty();
      case "collecting":
        return this._renderCollecting();
      case "mark-full":
        return this._renderMarkFull();
      case "offer-inherit":
        return this._renderOfferInherit();
      case "done":
        return this._renderDone();
    }
  }

  private _renderChooseHopper() {
    if (this._loading) return html`<p class="hint">Loading calibration\u2026</p>`;
    if (this._loadError) {
      return html`
        <div class="error">
          <span>Couldn't load calibration. ${this._loadError}</span>
          <button type="button" @click=${this._loadCalibration}>Try again</button>
        </div>
      `;
    }
    return html`
      <p class="hint">Pick a hopper. Each side keeps its own curve, since the two hoppers can hold different food.</p>
      <div class="hopper-rows">${([0, 1] as const).map((index) => this._renderHopperRow(index))}</div>
      ${this._hopper !== null ? this._renderHopperActions(this._hopper) : nothing}
    `;
  }

  private _renderHopperRow(index: 0 | 1) {
    const status = calibrationStatus(this._hopperData(index));
    return html`
      <button type="button" class="hopper-row ${this._hopper === index ? "selected" : ""}" @click=${() => this._selectHopper(index)}>
        <span class="hopper-row-label">Hopper ${index + 1}</span>
        <span class="hopper-row-status">${this._statusLine(status)}</span>
        ${status.note ? html`<span class="hopper-row-note">${status.note}</span>` : nothing}
      </button>
    `;
  }

  private _statusLine(status: CalibrationStatus): string {
    if (status.kind === "never") return "Never calibrated";
    const when = status.measuredAt ? relativeTimeSentence(new Date(status.measuredAt * 1000), new Date()) : null;
    const finished = status.finished ? "" : " (unfinished)";
    if (status.kind === "inherited") {
      return `Inherited from Hopper ${status.inheritedFromDisplay}${when ? ` \u00b7 ${when}` : ""}${finished}`;
    }
    return `Measured${when ? ` ${when}` : ""}${finished}`;
  }

  private _renderHopperActions(index: 0 | 1) {
    const status = calibrationStatus(this._hopperData(index));
    const label = index + 1;
    if (status.kind === "never") {
      return html`<button type="button" class="primary" @click=${() => this._beginRequested()}>Calibrate Hopper ${label}</button>`;
    }
    return html`
      <div class="hopper-actions">
        <button type="button" class="danger ${this._clearConfirmArmed ? "confirming" : ""}" ?disabled=${this._busy} @click=${() => this._clearRequested()}>
          ${this._clearConfirmArmed ? "Tap again to clear" : "Clear calibration"}
        </button>
        <button type="button" class="primary" @click=${() => this._beginRequested()}>Recalibrate Hopper ${label}</button>
      </div>
      ${this._renderError()}
    `;
  }

  private _renderConfirmEmpty() {
    const index = this._hopper;
    if (index === null) return nothing;
    const label = index + 1;
    const alreadyCalibrated = calibrationStatus(this._hopperData(index)).kind !== "never";
    return html`
      <p class="hint">Make sure Hopper ${label}'s side of the bowl is completely empty, then start.</p>
      ${alreadyCalibrated ? html`<div class="warning">Starting discards Hopper ${label}'s existing calibration.</div>` : nothing}
      <label class="field">
        <span>What food is this? (optional)</span>
        <input
          type="text"
          .value=${this._note}
          placeholder="e.g. freeze-dried on this side"
          @input=${(event: Event) => {
            this._note = (event.target as HTMLInputElement).value;
          }}
        />
      </label>
      ${this._waitingForBowl ? this._renderWaitingForBowl() : nothing}
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._confirmEmpty}>${this._busy ? "Starting\u2026" : "Bowl is empty \u2014 start"}</button>
      </div>
    `;
  }

  private _renderCollecting() {
    const index = this._hopper;
    if (index === null) return nothing;
    const points = this._hopperData(index)?.points ?? [];
    return html`
      <p class="hint">Dispense one portion into Hopper ${index + 1}'s side yourself, then capture the reading.</p>
      ${this._renderCurve(points)}
      ${this._regression
        ? html`<div class="warning">
            This step's score (${formatScore(this._regression.newScore)}) is lower than the previous step's (${formatScore(this._regression.previousScore)}) \u2014 a
            curve that dips can't be interpolated. Recapture this step before continuing.
          </div>`
        : nothing}
      ${this._waitingForBowl ? this._renderWaitingForBowl() : nothing}
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy || !canReviewFull(points)} @click=${() => this._reviewFull()}>This is full</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._capturePoint}>${this._busy ? "Capturing\u2026" : "Capture reading"}</button>
      </div>
    `;
  }

  private _renderCurve(points: CalibrationPoint[]) {
    if (points.length === 0) return nothing;
    return html`
      <ul class="curve">
        ${points.map((point, i) => {
          const previous = i > 0 ? points[i - 1]! : null;
          const dropped = previous !== null && point.score < previous.score;
          return html`
            <li class="curve-row ${dropped ? "dropped" : ""}">
              <span>${portionWord(point.portions)}</span>
              <span class="score">${formatScore(point.score)}</span>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private _renderMarkFull() {
    const index = this._hopper;
    if (index === null) return nothing;
    const points = (this._hopperData(index)?.points ?? []).filter((point) => point.portions > 0);
    return html`
      <p class="hint">Which step looked full?</p>
      <ul class="curve selectable">
        ${points.map(
          (point) => html`
            <li>
              <button type="button" class="curve-choice ${this._markFullPortions === point.portions ? "selected" : ""}" @click=${() => (this._markFullPortions = point.portions)}>
                <span>${portionWord(point.portions)}</span>
                <span class="score">${formatScore(point.score)}</span>
              </button>
            </li>
          `,
        )}
      </ul>
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy || this._markFullPortions === null} @click=${this._confirmMarkFull}>
          ${this._busy ? "Saving\u2026" : this._markFullPortions === null ? "Mark full" : `Mark full at ${portionWord(this._markFullPortions)}`}
        </button>
      </div>
    `;
  }

  private _renderOfferInherit() {
    const from = this._hopper;
    if (from === null) return nothing;
    const to = from === 0 ? 1 : 0;
    const otherHasData = calibrationStatus(this._hopperData(to)).kind !== "never";
    return html`
      <p class="hint">Hopper ${from + 1} is calibrated.</p>
      <p class="hint">
        Copy this curve to Hopper ${to + 1}? Only do this if it's the same food in both hoppers \u2014 this is a shortcut for
        "same food," not a second measurement.${otherHasData ? html` This replaces Hopper ${to + 1}'s existing calibration.` : nothing}
      </p>
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy} @click=${() => this._declineInherit()}>Not now</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._acceptInherit}>${this._busy ? "Copying\u2026" : `Copy to Hopper ${to + 1}`}</button>
      </div>
    `;
  }

  private _renderDone() {
    const index = this._hopper;
    if (index === null) return nothing;
    return html`
      <p class="hint">Hopper ${index + 1} is calibrated.${this._inheritedTo !== null ? html` Copied to Hopper ${this._inheritedTo + 1} too.` : nothing}</p>
      <div class="actions">
        <button type="button" @click=${() => this._restart()}>Calibrate the other hopper</button>
        <button type="button" class="primary" @click=${this._close}>Done</button>
      </div>
    `;
  }

  private _renderWaitingForBowl() {
    const retry = this._step === "collecting" ? this._capturePoint : this._confirmEmpty;
    return html`
      <div class="warning">
        <span>No clear bowl reading right now \u2014 something may be in the way, or the feeder hasn't reported one yet. Try again in a moment.</span>
        <button
          type="button"
          @click=${() => {
            this._waitingForBowl = false;
            retry();
          }}
        >
          Try again
        </button>
      </div>
    `;
  }

  private _renderError() {
    const error = this._error;
    if (!error) return nothing;
    return html`
      <div class="error">
        <span>${error.message}</span>
        <button
          type="button"
          @click=${() => {
            this._error = null;
            error.retry();
          }}
        >
          Try again
        </button>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 420px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 16px;
      font-weight: 600;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .body {
      padding: 4px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hint {
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field input {
      min-height: 44px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      padding: 0 12px;
      box-sizing: border-box;
    }
    .hopper-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hopper-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      min-height: 48px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-sizing: border-box;
    }
    .hopper-row.selected {
      border-color: var(--primary-color, #03a9f4);
    }
    .hopper-row-label {
      font-weight: 600;
    }
    .hopper-row-status,
    .hopper-row-note {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .hopper-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .curve {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 220px;
      overflow-y: auto;
    }
    .curve-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
    .curve-row.dropped {
      background: color-mix(in srgb, var(--kibble-amber-dark, #de8a3a) 16%, transparent);
      color: var(--kibble-amber-dark, #de8a3a);
      font-weight: 600;
    }
    .curve .score {
      font-weight: 600;
    }
    .curve.selectable {
      gap: 6px;
    }
    .curve-choice {
      display: flex;
      justify-content: space-between;
      width: 100%;
      min-height: 44px;
      padding: 8px 12px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      box-sizing: border-box;
    }
    .curve-choice.selected {
      border-color: var(--primary-color, #03a9f4);
    }
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    button {
      min-height: 44px;
      border-radius: 8px;
      border: none;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      padding: 0 16px;
    }
    .actions button:not(.primary):not(.danger) {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .primary {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
    }
    .danger {
      background: none;
      border: 2px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .danger.confirming {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .warning,
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    .warning {
      background: color-mix(in srgb, var(--kibble-amber-dark, #de8a3a) 12%, transparent);
      color: var(--kibble-amber-dark, #de8a3a);
    }
    .error {
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
    }
    .warning button,
    .error button {
      flex: 0 0 auto;
      min-height: 32px;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
    }
  `;
}

customElements.define("kibble-calibration-dialog", KibbleCalibrationDialog);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-calibration-dialog": KibbleCalibrationDialog;
  }
}
