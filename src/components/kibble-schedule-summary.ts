/** The one-line schedule summary on the hero card, expanding to the schedule itself
 * (`kibble-schedule-body`: Kibble's per-hopper editor with the divider in, the embedded
 * `dispenser-schedule-card` or a fallback list with it out).
 */

import { LitElement, css, html, nothing } from "lit";
import type { ScheduleEntry } from "../lib/schedule";
import { scheduleSummary } from "../lib/schedule";
import { mdiIcon } from "../lib/mdi-icons";
import type { HomeAssistant } from "../types";
import "./kibble-schedule-body";

export class KibbleScheduleSummary extends LitElement {
  static properties = {
    hass: { attribute: false },
    entries: { attribute: false },
    scheduleCardStateEntity: { type: String },
    deviceName: { type: String },
    singleHopper: { type: Boolean },
    deviceId: { type: String },
    food1: { type: String },
    food2: { type: String },
  };

  declare hass: HomeAssistant;
  declare entries: ScheduleEntry[];
  declare scheduleCardStateEntity: string | undefined;
  declare deviceName: string;
  /** The hopper divider is out: an entry's amount is the one bin's total, not a per-side
   * pair -- see `lib/schedule.ts:entryAmountsLabel`. */
  declare singleHopper: boolean;
  /** The feeder's device id, for the per-hopper editor's schedule service calls. */
  declare deviceId: string | undefined;
  /** Hopper food names for the editor's labels (`null` while unnamed). */
  declare food1: string | null;
  declare food2: string | null;

  private _expanded = false;

  constructor() {
    super();
    this.entries = [];
    this.deviceName = "Kibble";
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
  }

  render() {
    const now = new Date();
    const summary = scheduleSummary(this.entries, now);
    return html`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${summary}</span>
        <span class="chevron ${this._expanded ? "open" : ""}">${mdiIcon("chevronDown")}</span>
      </button>
      ${this._expanded
        ? html`<div class="expanded">
            <kibble-schedule-body
              .hass=${this.hass}
              .entries=${this.entries}
              .scheduleCardStateEntity=${this.scheduleCardStateEntity}
              .singleHopper=${this.singleHopper}
              .deviceId=${this.deviceId}
              .food1=${this.food1}
              .food2=${this.food2}
            ></kibble-schedule-body>
          </div>`
        : nothing}
    `;
  }

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
  `;
}

customElements.define("kibble-schedule-summary", KibbleScheduleSummary);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-schedule-summary": KibbleScheduleSummary;
  }
}
