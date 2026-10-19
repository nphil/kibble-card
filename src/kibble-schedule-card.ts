/** The feeding schedule as a card of its own, already expanded: what a dashboard pop-up (a Bubble
 * Card `#schedule`) hosts when the hero card is told the dashboard owns the schedule
 * (`schedule_hash`). It resolves its entities from the device exactly as the hero does and
 * renders `kibble-schedule-body` -- Kibble's per-hopper editor with the divider in, the embedded
 * `dispenser-schedule-card` (or a fallback list) with it out -- so the pop-up and the hero's own
 * expanded line can never show different things.
 */

import type { CustomCardEntry } from "./kibble-card";
import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { hopperFoodName } from "./lib/hopper-status";
import { scheduleEntriesFrom } from "./lib/schedule";
import { KIBBLE_AMBER_DARK, KIBBLE_FEED, KIBBLE_INK_ON_FEED } from "./styles/tokens";
import type { HomeAssistant, KibbleScheduleCardConfig } from "./types";
import "./components/kibble-schedule-body";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };

export class KibbleScheduleCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleScheduleCardConfig | undefined;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  // What `_entities` was last resolved from: `hass` is a new object on every state change in the
  // house, the registries and the configured device rarely change (same reasoning as the hero).
  private _resolvedEntities: HomeAssistant["entities"] | undefined;
  private _resolvedDeviceId: string | undefined;

  setConfig(config: KibbleScheduleCardConfig): void {
    if (!config.device_id) {
      throw new Error("Kibble schedule card: `device_id` is required.");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 4;
  }

  static getStubConfig(hass: HomeAssistant): KibbleScheduleCardConfig {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-schedule-card", device_id: kibbleEntity?.device_id ?? "" };
  }

  protected willUpdate(): void {
    const deviceId = this._config?.device_id;
    if (this.hass && deviceId && (this.hass.entities !== this._resolvedEntities || deviceId !== this._resolvedDeviceId)) {
      this._resolvedEntities = this.hass.entities;
      this._resolvedDeviceId = deviceId;
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, deviceId);
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const e = this._entities;
    const states = this.hass.states;
    const scheduleState = e.schedule ? states[e.schedule] : undefined;
    // Same reading as the hero's `_singleHopper()`: only an explicit "off" divider means one bin.
    const singleHopper = e.hopperDivider != null && states[e.hopperDivider]?.state === "off";
    return html`
      <ha-card>
        ${!scheduleState || scheduleState.state === "unavailable"
          ? html`<p class="unavailable">The schedule is unavailable right now</p>`
          : html`<kibble-schedule-body
              .hass=${this.hass}
              .entries=${scheduleEntriesFrom(scheduleState)}
              .scheduleCardStateEntity=${e.scheduleCardState}
              .singleHopper=${singleHopper}
              .deviceId=${e.deviceId}
              .food1=${e.hopperFood1 ? hopperFoodName(states[e.hopperFood1]) : null}
              .food2=${e.hopperFood2 ? hopperFoodName(states[e.hopperFood2]) : null}
            ></kibble-schedule-body>`}
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      /* The tokens the schedule editor draws with; the hero sets the same ones on its own host. */
      --kibble-feed: ${unsafeCSS(KIBBLE_FEED)};
      --kibble-ink-on-feed: ${unsafeCSS(KIBBLE_INK_ON_FEED)};
      --kibble-amber-dark: ${unsafeCSS(KIBBLE_AMBER_DARK)};
      --kibble-touch-target: 48px;
      --kibble-schedule-size: 14px;
    }
    ha-card {
      display: block;
      padding: 8px 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .unavailable {
      margin: 8px 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
    }
  `;
}

customElements.define("kibble-schedule-card", KibbleScheduleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-schedule-card",
  name: "Kibble Schedule",
  description: "The feeding schedule, already open: per-hopper amounts with the divider fitted. For a dashboard pop-up.",
  preview: true,
} satisfies CustomCardEntry);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-schedule-card": KibbleScheduleCard;
  }
}
