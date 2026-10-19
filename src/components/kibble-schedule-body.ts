/** The expanded schedule, shared by every surface that shows it: the hero's collapsible summary
 * line (`kibble-schedule-summary`) and the standalone `kibble-schedule-card` that a dashboard
 * pop-up hosts. With the hopper divider IN that is Kibble's own per-hopper editor
 * (`kibble-schedule-editor`): the embedded `dispenser-schedule-card` keeps one amount per entry
 * and mirrors it onto both hoppers, so it cannot schedule "kibble only". With the divider OUT
 * (one bin, one amount) it is either that embedded card or a plain fallback list.
 *
 * The embed only activates once both (a) that card is installed and (b) a `schedule_card_state`
 * entity exists — `docs/custom.md`'s `device.type: custom` adapter reads a packed string from an
 * entity's own *state*, which our real `sensor.…_schedule` cannot provide (its state is the
 * entry count, by design) — so this never fabricates a broken config against the wrong entity;
 * see README.md "Schedule card integration" for the entity/services this still needs upstream.
 */

import { LitElement, css, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { ScheduleEntry } from "../lib/schedule";
import { entryAmountsLabel, formatClock, sortScheduleEntries } from "../lib/schedule";
import type { HomeAssistant } from "../types";
import "./kibble-schedule-editor";

const DISPENSER_CARD_TAG = "dispenser-schedule-card";

export class KibbleScheduleBody extends LitElement {
  static properties = {
    hass: { attribute: false },
    entries: { attribute: false },
    scheduleCardStateEntity: { type: String },
    /** The hopper divider is out: an entry's amount is the one bin's total, not a per-side
     * pair -- see `lib/schedule.ts:entryAmountsLabel`. */
    singleHopper: { type: Boolean },
    /** The feeder's device id, for the per-hopper editor's schedule service calls. */
    deviceId: { type: String },
    /** Hopper food names for the editor's labels (`null` while unnamed). */
    food1: { type: String },
    food2: { type: String },
  };

  declare hass: HomeAssistant;
  declare entries: ScheduleEntry[];
  declare scheduleCardStateEntity: string | undefined;
  declare singleHopper: boolean;
  declare deviceId: string | undefined;
  declare food1: string | null;
  declare food2: string | null;

  private _embedRef = createRef<HTMLElement & { hass: HomeAssistant; setConfig: (c: Record<string, unknown>) => void }>();

  constructor() {
    super();
    this.entries = [];
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
  }

  updated(): void {
    if (this._embedRef.value && this.hass) {
      this._embedRef.value.hass = this.hass;
    }
  }

  render() {
    if (!this.singleHopper) {
      return html`<kibble-schedule-editor
        .hass=${this.hass}
        .entries=${this.entries}
        .deviceId=${this.deviceId}
        .food1=${this.food1}
        .food2=${this.food2}
      ></kibble-schedule-editor>`;
    }
    if (this._canEmbed()) {
      return html`<div ${ref(this._configureEmbed)}></div>`;
    }
    if (this.entries.length === 0) {
      return html`<p class="empty">No schedule set</p>`;
    }
    const sorted = sortScheduleEntries(this.entries);
    return html`
      <ul class="entries">
        ${sorted.map(
          (entry) => html`
            <li class=${entry.enabled ? "" : "disabled"}>
              <span class="time">${formatClock(entry.time)}</span>
              <span class="amounts">${entryAmountsLabel(entry, true)}</span>
              <span class="state">${entry.enabled ? "On" : "Paused"}</span>
            </li>
          `,
        )}
      </ul>
    `;
  }

  private _canEmbed(): boolean {
    if (!customElements.get(DISPENSER_CARD_TAG)) return false;
    if (!this.scheduleCardStateEntity) return false;
    const state = this.hass?.states[this.scheduleCardStateEntity];
    return state !== undefined && state.state !== "unavailable";
  }

  private _configureEmbed = (el?: Element): void => {
    if (!el || !this.scheduleCardStateEntity) return;
    const card = el.querySelector(DISPENSER_CARD_TAG) as (HTMLElement & { setConfig: (c: Record<string, unknown>) => void; hass: HomeAssistant }) | null;
    if (card) {
      card.hass = this.hass;
      return;
    }
    const created = document.createElement(DISPENSER_CARD_TAG) as HTMLElement & {
      setConfig: (c: Record<string, unknown>) => void;
      hass: HomeAssistant;
    };
    created.setConfig({
      type: "custom:dispenser-schedule-card",
      device: {
        type: "custom",
        entity: this.scheduleCardStateEntity,
        max_entries: 24,
        min_amount: 1,
        max_amount: 20,
        step_amount: 1,
        status_map: ["0 -> dispensed", "1 -> failed", "2 -> pending", "3 -> dispensing"],
        status_pattern: "(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",
        actions: {
          add: "kibble.schedule_card_add",
          edit: "kibble.schedule_card_edit",
          remove: "kibble.schedule_card_remove",
          toggle: "kibble.schedule_card_toggle",
        },
      },
      unit_of_measurement: { one: "portion", other: "portions" },
    });
    created.hass = this.hass;
    el.appendChild(created);
  };

  static styles = css`
    :host {
      display: block;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
      margin: 0;
    }
    .entries {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .entries li {
      display: flex;
      gap: 10px;
      align-items: baseline;
      font-size: var(--kibble-schedule-size, 14px);
      color: var(--primary-text-color);
    }
    .entries li.disabled {
      color: var(--secondary-text-color);
      text-decoration: line-through;
      text-decoration-color: var(--divider-color);
    }
    .entries .time {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      min-width: 3.5em;
    }
    .entries .amounts {
      flex: 1;
    }
    .entries .state {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `;
}

customElements.define("kibble-schedule-body", KibbleScheduleBody);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-schedule-body": KibbleScheduleBody;
  }
}
