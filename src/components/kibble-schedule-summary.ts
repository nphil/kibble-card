/** The one-line schedule summary, expanding to either the embedded `dispenser-schedule-card`
 * (github.com/cristianchelu/dispenser-schedule-card) or a plain fallback list. The embed only
 * activates once both (a) that card is installed and (b) a `schedule_card_state` entity exists —
 * `docs/custom.md`'s `device.type: custom` adapter reads a packed string from an entity's own
 * *state*, which our real `sensor.…_schedule` cannot provide (its state is the entry count, by
 * design) — so this card never fabricates a broken config against the wrong entity; see
 * README.md "Schedule card integration" for the entity/services this still needs upstream.
 */

import { LitElement, css, html, nothing } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { ScheduleEntry } from "../lib/schedule";
import { scheduleSummary } from "../lib/schedule";
import { mdiIcon } from "../lib/mdi-icons";
import type { HomeAssistant } from "../types";

const DISPENSER_CARD_TAG = "dispenser-schedule-card";

export class KibbleScheduleSummary extends LitElement {
  static properties = {
    hass: { attribute: false },
    entries: { attribute: false },
    scheduleCardStateEntity: { type: String },
    deviceName: { type: String },
  };

  declare hass: HomeAssistant;
  declare entries: ScheduleEntry[];
  declare scheduleCardStateEntity: string | undefined;
  declare deviceName: string;

  private _expanded = false;
  private _embedRef = createRef<HTMLElement & { hass: HomeAssistant; setConfig: (c: Record<string, unknown>) => void }>();

  constructor() {
    super();
    this.entries = [];
    this.deviceName = "Kibble";
  }

  updated(): void {
    if (this._embedRef.value && this.hass) {
      this._embedRef.value.hass = this.hass;
    }
  }

  render() {
    const now = new Date();
    const summary = scheduleSummary(this.entries, now);
    return html`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${summary}</span>
        <span class="chevron ${this._expanded ? "open" : ""}">${mdiIcon("chevronDown")}</span>
      </button>
      ${this._expanded ? html`<div class="expanded">${this._renderExpanded()}</div>` : nothing}
    `;
  }

  private _renderExpanded() {
    if (this._canEmbed()) {
      return html`<div ${ref(this._configureEmbed)}></div>`;
    }
    if (this.entries.length === 0) {
      return html`<p class="empty">No schedule set</p>`;
    }
    const sorted = [...this.entries].sort((a, b) => a.time.localeCompare(b.time));
    return html`
      <ul class="entries">
        ${sorted.map(
          (entry) => html`
            <li class=${entry.enabled ? "" : "disabled"}>
              <span class="time">${entry.time}</span>
              <span class="amounts">${entry.amount_l}g + ${entry.amount_r}g</span>
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

  private _toggle(): void {
    this._expanded = !this._expanded;
    this.requestUpdate();
  }

  static styles = css`
    :host {
      display: block;
    }
    .row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: none;
      border: none;
      padding: 10px 4px;
      min-height: var(--kibble-touch-target, 48px);
      font: inherit;
      font-size: var(--kibble-schedule-size, 14px);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .chevron {
      display: flex;
      color: var(--secondary-text-color);
      transition: transform 0.15s ease;
    }
    .chevron.open {
      transform: rotate(180deg);
    }
    .expanded {
      padding: 0 4px 8px;
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

customElements.define("kibble-schedule-summary", KibbleScheduleSummary);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-schedule-summary": KibbleScheduleSummary;
  }
}
