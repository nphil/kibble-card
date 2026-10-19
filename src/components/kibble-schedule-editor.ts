/** The schedule editor for the divider-IN case. The third-party `dispenser-schedule-card` keeps
 * exactly one amount per entry and the integration mirrors it onto both hoppers, so with two
 * different foods in the two hoppers it cannot say "kibble only". This editor keeps a pair of
 * amounts per entry instead: one row per feed in clock order (time, hopper 1, hopper 2, an
 * on/paused switch); tapping a row opens its form in place (time, a stepper per hopper, save,
 * remove); "Add feed" opens the same form empty.
 *
 * The form is inline rather than a sheet on purpose: the card's container is a layout-contained
 * box, which would trap a `position: fixed` overlay inside the card instead of the viewport.
 *
 * Writes use the integration's own services (`kibble.schedule_add`, `schedule_set` for edits so
 * an entry keeps its id, `schedule_remove`, `schedule_set_enabled`); what each one is sent is
 * built by `lib/schedule.ts`. A rejected call is shown in an error line, never swallowed, and the
 * list itself only ever shows what the schedule sensor reports -- no optimistic copy to drift.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { fireHaptic } from "../lib/haptics";
import { mdiIcon } from "../lib/mdi-icons";
import {
  MAX_SCHEDULE_PORTIONS,
  draftProblem,
  entryAmountsLabel,
  formatClock,
  hopperLabel,
  scheduleAddData,
  scheduleSetEntries,
  serviceErrorMessage,
  sortScheduleEntries,
  type ScheduleDraft,
  type ScheduleEntry,
} from "../lib/schedule";
import type { HomeAssistant } from "../types";
import "./kibble-stepper";

/** `"new"` is the Add feed form; any other string is the id of the entry being edited. */
type EditTarget = "new" | string;

/** A new feed starts at noon with one portion of hopper 1 -- a valid, harmless draft the
 * person adjusts, rather than an empty form that cannot be saved. */
const NEW_DRAFT: ScheduleDraft = { time: "12:00", amount_l: 1, amount_r: 0 };

export class KibbleScheduleEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    entries: { attribute: false },
    deviceId: { type: String },
    food1: { type: String },
    food2: { type: String },
    _target: { state: true },
    _draft: { state: true },
    _confirmRemove: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _toggling: { state: true },
  };

  declare hass: HomeAssistant;
  declare entries: ScheduleEntry[];
  declare deviceId: string | undefined;
  /** The operator's name for each hopper's food -- `null` while unnamed. */
  declare food1: string | null;
  declare food2: string | null;
  declare _target: EditTarget | null;
  declare _draft: ScheduleDraft;
  declare _confirmRemove: boolean;
  declare _busy: boolean;
  declare _error: string | null;
  /** Entry ids whose on/paused switch has a call in flight. */
  declare _toggling: ReadonlySet<string>;

  constructor() {
    super();
    this.entries = [];
    this.food1 = null;
    this.food2 = null;
    this._target = null;
    this._draft = { ...NEW_DRAFT };
    this._confirmRemove = false;
    this._busy = false;
    this._error = null;
    this._toggling = new Set();
  }

  protected willUpdate(changed: PropertyValues): void {
    // The entry being edited vanished (removed from elsewhere): there is nothing left to edit.
    if (changed.has("entries") && this._target !== null && this._target !== "new" && !this.entries.some((entry) => entry.id === this._target)) {
      this._closeForm();
    }
  }

  render() {
    const sorted = sortScheduleEntries(this.entries);
    return html`
      ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
      ${sorted.length === 0 && this._target !== "new" ? html`<p class="empty">No feeds scheduled</p>` : nothing}
      <ul class="entries">
        ${sorted.map((entry) => html`<li>${this._target === entry.id ? this._renderForm(entry) : this._renderRow(entry)}</li>`)}
      </ul>
      ${this._target === "new"
        ? html`<div class="form-slot">${this._renderForm(null)}</div>`
        : html`
            <button type="button" class="add" ?disabled=${this._busy || !this.deviceId} @click=${this._openNew}>
              <span class="add-icon">${mdiIcon("plus")}</span><span>Add feed</span>
            </button>
          `}
    `;
  }

  private _renderRow(entry: ScheduleEntry) {
    const label = `${formatClock(entry.time)}, ${entryAmountsLabel(entry, false, this.food1, this.food2)}, ${entry.enabled ? "on" : "paused"}`;
    return html`
      <div class="row ${entry.enabled ? "" : "paused"}">
        <button type="button" class="row-main" aria-label="Edit feed: ${label}" ?disabled=${this._busy} @click=${() => this._openEdit(entry)}>
          <span class="time">${formatClock(entry.time)}</span>
          ${this._renderAmount(hopperLabel(1, this.food1), entry.amount_l)} ${this._renderAmount(hopperLabel(2, this.food2), entry.amount_r)}
        </button>
        <button
          type="button"
          class="switch ${entry.enabled ? "on" : ""}"
          role="switch"
          aria-checked=${entry.enabled}
          aria-label="${formatClock(entry.time)} feed ${entry.enabled ? "on" : "paused"}"
          ?disabled=${this._busy || this._toggling.has(entry.id)}
          @click=${() => this._toggle(entry)}
        >
          <span class="track"><span class="thumb"></span></span>
          <span class="switch-word">${entry.enabled ? "On" : "Paused"}</span>
        </button>
      </div>
    `;
  }

  private _renderAmount(name: string, amount: number) {
    return html`
      <span class="amount ${amount === 0 ? "zero" : ""}">
        <span class="amount-name">${name}</span>
        <span class="amount-value">${amount}</span>
      </span>
    `;
  }

  private _renderForm(entry: ScheduleEntry | null) {
    if (entry && this._confirmRemove) return this._renderRemoveConfirm(entry);
    const draft = this._draft;
    const problem = draftProblem(draft);
    const name1 = hopperLabel(1, this.food1);
    const name2 = hopperLabel(2, this.food2);
    return html`
      <form class="form" @submit=${this._onSubmit} novalidate>
        <h3>${entry ? "Edit feed" : "Add feed"}</h3>
        <label class="field">
          <span class="field-label">Time</span>
          <input type="time" step="60" required .value=${draft.time} ?disabled=${this._busy} @input=${this._onTimeInput} />
        </label>
        <div class="field">
          <span class="field-label">${name1}</span>
          <kibble-stepper
            .value=${draft.amount_l}
            .min=${0}
            .max=${MAX_SCHEDULE_PORTIONS}
            aria-label="${name1} portions"
            ?disabled=${this._busy}
            @value-selected=${(event: CustomEvent<{ value: number }>) => this._setAmount("amount_l", event)}
          ></kibble-stepper>
        </div>
        <div class="field">
          <span class="field-label">${name2}</span>
          <kibble-stepper
            .value=${draft.amount_r}
            .min=${0}
            .max=${MAX_SCHEDULE_PORTIONS}
            aria-label="${name2} portions"
            ?disabled=${this._busy}
            @value-selected=${(event: CustomEvent<{ value: number }>) => this._setAmount("amount_r", event)}
          ></kibble-stepper>
        </div>
        ${problem ? html`<p class="hint" role="status">${problem}</p>` : nothing}
        <div class="actions">
          ${entry
            ? html`<button type="button" class="btn danger-text" ?disabled=${this._busy} @click=${() => (this._confirmRemove = true)}>
                <span class="btn-icon">${mdiIcon("deleteOutline")}</span><span>Remove</span>
              </button>`
            : nothing}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${this._closeForm}>Cancel</button>
          <button type="submit" class="btn primary" ?disabled=${this._busy || problem !== null}>${this._busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    `;
  }

  private _renderRemoveConfirm(entry: ScheduleEntry) {
    return html`
      <div class="form" role="alertdialog" aria-label="Remove this feed?">
        <h3>Remove the ${formatClock(entry.time)} feed?</h3>
        <p class="confirm-text">
          ${entryAmountsLabel(entry, false, this.food1, this.food2)} will no longer be given at that time. This cannot be undone.
        </p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${() => (this._confirmRemove = false)}>Keep</button>
          <button type="button" class="btn danger" ?disabled=${this._busy} @click=${() => this._remove(entry)}>
            ${this._busy ? "Removing…" : "Remove feed"}
          </button>
        </div>
      </div>
    `;
  }

  private _openNew = (): void => {
    this._error = null;
    this._confirmRemove = false;
    this._draft = { ...NEW_DRAFT };
    this._target = "new";
  };

  private _openEdit(entry: ScheduleEntry): void {
    this._error = null;
    this._confirmRemove = false;
    this._draft = { time: entry.time.padStart(5, "0"), amount_l: entry.amount_l, amount_r: entry.amount_r };
    this._target = entry.id;
  }

  private _closeForm = (): void => {
    this._target = null;
    this._confirmRemove = false;
  };

  private _onTimeInput = (event: Event): void => {
    this._draft = { ...this._draft, time: (event.target as HTMLInputElement).value };
  };

  private _setAmount(side: "amount_l" | "amount_r", event: CustomEvent<{ value: number }>): void {
    event.stopPropagation();
    this._draft = { ...this._draft, [side]: event.detail.value };
  }

  private _onSubmit = (event: Event): void => {
    event.preventDefault();
    void this._save();
  };

  /** Runs one write: marks the editor busy, clears the previous error, and on a rejection shows
   * why. Resolves `true` only when Home Assistant accepted the call. */
  private async _run(failure: string, call: () => Promise<unknown>): Promise<boolean> {
    this._error = null;
    this._busy = true;
    try {
      await call();
      return true;
    } catch (error) {
      this._error = `${failure}: ${serviceErrorMessage(error)}`;
      return false;
    } finally {
      this._busy = false;
    }
  }

  private async _save(): Promise<void> {
    const target = this._target;
    if (target === null || draftProblem(this._draft) !== null) return;
    const deviceId = this.deviceId;
    if (!deviceId) {
      this._error = "Could not save the feed: the feeder was not found";
      return;
    }
    const draft = this._draft;
    const saved = await this._run("Could not save the feed", () =>
      target === "new"
        ? this.hass.callService("kibble", "schedule_add", scheduleAddData(deviceId, draft))
        : this.hass.callService("kibble", "schedule_set", { device_id: deviceId, entries: scheduleSetEntries(this.entries, target, draft) }),
    );
    if (saved) {
      fireHaptic("success");
      this._closeForm();
    }
  }

  private async _remove(entry: ScheduleEntry): Promise<void> {
    const deviceId = this.deviceId;
    if (!deviceId) {
      this._error = "Could not remove the feed: the feeder was not found";
      return;
    }
    const removed = await this._run("Could not remove the feed", () =>
      this.hass.callService("kibble", "schedule_remove", { device_id: deviceId, entry_id: entry.id }),
    );
    if (removed) this._closeForm();
  }

  private async _toggle(entry: ScheduleEntry): Promise<void> {
    const deviceId = this.deviceId;
    if (!deviceId) return;
    this._error = null;
    this._toggling = new Set(this._toggling).add(entry.id);
    try {
      await this.hass.callService("kibble", "schedule_set_enabled", { device_id: deviceId, entry_id: entry.id, enabled: !entry.enabled });
    } catch (error) {
      this._error = `Could not ${entry.enabled ? "pause" : "turn on"} the feed: ${serviceErrorMessage(error)}`;
    } finally {
      const next = new Set(this._toggling);
      next.delete(entry.id);
      this._toggling = next;
    }
  }

  static styles = css`
    :host {
      display: block;
    }
    .entries {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .entries li {
      border-top: 1px solid var(--divider-color);
    }
    .entries li:first-child {
      border-top: none;
    }
    .empty {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
    }
    .error {
      margin: 0 0 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: var(--kibble-schedule-size, 14px);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row.paused .time,
    .row.paused .amount-value {
      color: var(--secondary-text-color);
    }
    .row-main {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: 4.6em 1fr 1fr;
      align-items: center;
      gap: 8px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 6px 0;
      background: none;
      border: none;
      font: inherit;
      color: var(--primary-text-color);
      text-align: left;
      cursor: pointer;
    }
    .time {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .amount {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .amount-name {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .amount-value {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .amount.zero .amount-value {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .switch {
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 0 0 0 4px;
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .switch-word {
      min-width: 3.6em;
      text-align: left;
    }
    .track {
      position: relative;
      width: 40px;
      height: 24px;
      border-radius: 12px;
      background: var(--divider-color);
      transition: background 0.15s ease;
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      transition: transform 0.15s ease;
    }
    .switch.on .track {
      background: var(--kibble-feed, #43a96a);
    }
    .switch.on .thumb {
      transform: translateX(16px);
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--kibble-amber-dark, #de8a3a);
      outline-offset: 2px;
    }
    .add {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 0 12px 0 0;
      background: none;
      border: none;
      font: inherit;
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 600;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .add-icon {
      display: flex;
      font-size: 20px;
    }
    .form-slot {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 8px 0;
      padding: 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .field-label {
      min-width: 0;
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    input[type="time"] {
      min-height: 44px;
      box-sizing: border-box;
      padding: 0 12px;
      border: 2px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 16px;
      font-variant-numeric: tabular-nums;
    }
    kibble-stepper {
      flex: none;
    }
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .confirm-text {
      margin: 0;
      font-size: var(--kibble-schedule-size, 14px);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .spacer {
      flex: 1;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .btn.primary {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .btn.danger {
      border-color: transparent;
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .btn.danger-text {
      border-color: transparent;
      padding: 0 8px;
      color: var(--error-color, #db4437);
    }
    .btn-icon {
      display: flex;
      font-size: 18px;
    }
    @media (prefers-reduced-motion: reduce) {
      .track,
      .thumb {
        transition: none;
      }
    }
  `;
}

customElements.define("kibble-schedule-editor", KibbleScheduleEditor);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-schedule-editor": KibbleScheduleEditor;
  }
}
