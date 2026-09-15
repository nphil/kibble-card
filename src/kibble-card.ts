/** The Kibble card: one illustrated status object (the bowl) plus three big actions (amount,
 * feed, schedule), responsive to its own box via container queries so the same markup works as
 * a dashboard tile, a tablet card and a full-screen kiosk panel. See README.md for the full
 * design rationale.
 */

import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import type { PropertyValues } from "lit";
import type { HomeAssistant, KibbleCardConfig } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { deriveFeederStatus, relativeTime, statusText } from "./lib/feeding";
import type { ScheduleEntry } from "./lib/schedule";
import { mdiIcon } from "./lib/mdi-icons";
import { KIOSK_MIN_HEIGHT_PX, KIBBLE_AMBER, KIBBLE_AMBER_DARK, KIBBLE_INK_ON_AMBER } from "./styles/tokens";
import "./components/kibble-bowl";
import "./components/kibble-segmented-picker";
import "./components/kibble-stepper";
import "./components/kibble-hold-button";
import "./components/kibble-footer";
import "./components/kibble-schedule-summary";
import "./components/kibble-settings-dialog";
import "./editor";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };

export class KibbleCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _settingsOpen: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCardConfig | undefined;
  declare _settingsOpen: boolean;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _resizeObserver: ResizeObserver | undefined;

  constructor() {
    super();
    this._settingsOpen = false;
  }

  setConfig(config: KibbleCardConfig): void {
    if (!config.device_id) {
      throw new Error("Kibble card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 6;
  }

  static getStubConfig(hass: HomeAssistant): KibbleCardConfig {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-card", device_id: kibbleEntity?.device_id ?? "" };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("kibble-card-editor");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height ?? this.getBoundingClientRect().height;
      this.classList.toggle("kiosk", height >= KIOSK_MIN_HEIGHT_PX);
    });
    this._resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  protected willUpdate(changed: PropertyValues): void {
    if ((changed.has("hass") || changed.has("_config")) && this._config?.device_id && this.hass) {
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, this._config.device_id);
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const e = this._entities;

    const feedingState = e.feeding ? this.hass.states[e.feeding]?.state : undefined;
    const coreIds = [e.feeding, e.bowlFill1, e.bowlFill2, e.schedule].filter((id): id is string => Boolean(id));
    const coreStates = coreIds.map((id) => this.hass.states[id]?.state);
    const status = deriveFeederStatus(coreStates, feedingState);
    const feeding = feedingState === "on";

    const hopper1 = this._numberState(e.bowlFill1);
    const hopper2 = this._numberState(e.bowlFill2);
    const catName = this._catName();
    const text = status === "idle" ? statusText(status, this._lastFedRelative(feedingState)) : statusText(status, null);
    const scheduleEntries = this._scheduleEntries();
    const feedAmount = this._numberState(e.feedAmount) ?? 1;
    const desiccantDays = this._numberState(e.desiccantDays);
    const wifiState = e.wifiNetwork ? this.hass.states[e.wifiNetwork] : undefined;
    const cloudState = e.cloudConnection ? this.hass.states[e.cloudConnection]?.state : undefined;

    return html`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">${this._renderCamera(e.camera)}</div>
              <div class="hero-progress" data-active=${status === "dispensing"}></div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${mdiIcon("cog")}</button>
              ${this._config.name ? html`<div class="name-chip">${this._config.name}</div>` : nothing}
            </div>
            <kibble-bowl
              class="bowl-block"
              .hopper1=${hopper1}
              .hopper2=${hopper2}
              .catName=${catName}
              .feeding=${feeding}
              .statusText=${text}
            ></kibble-bowl>
            <div class="feed-controls">
              <kibble-segmented-picker
                class="picker-full"
                .value=${feedAmount}
                ?disabled=${status === "unreachable" || feeding}
                @portion-selected=${this._onPortionSelected}
                @more-requested=${this._openSettings}
              ></kibble-segmented-picker>
              <kibble-stepper
                class="picker-compact"
                .value=${feedAmount}
                ?disabled=${status === "unreachable" || feeding}
                @value-selected=${this._onPortionSelected}
              ></kibble-stepper>
              <kibble-hold-button
                .label=${feeding ? "Cancel" : "Hold to feed"}
                .variant=${feeding ? "cancel" : "feed"}
                ?disabled=${status === "unreachable"}
                @activate=${feeding ? this._onCancelActivate : this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            <kibble-schedule-summary
              class="schedule-row"
              .hass=${this.hass}
              .entries=${scheduleEntries}
              .scheduleCardStateEntity=${e.scheduleCardState}
            ></kibble-schedule-summary>
            <kibble-footer
              class="footer"
              .cloudState=${cloudState}
              .desiccantDays=${desiccantDays}
              .wifiLabel=${wifiState && wifiState.state !== "unavailable" ? wifiState.state : null}
              @open-settings=${this._openSettings}
            ></kibble-footer>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `;
  }

  private _renderCamera(cameraId: string | undefined) {
    if (!cameraId) {
      return html`<div class="hero-placeholder">No camera on this device</div>`;
    }
    if (customElements.get("hui-image")) {
      return html`<hui-image .hass=${this.hass} .cameraImage=${cameraId} cameraView="live"></hui-image>`;
    }
    const state = this.hass.states[cameraId];
    const src = state?.attributes.entity_picture as string | undefined;
    if (!state || state.state === "unavailable" || !src) {
      return html`<div class="hero-placeholder">Camera unavailable</div>`;
    }
    return html`<img src=${src} alt="Live view of the feeder" />`;
  }

  private _numberState(entityId: string | undefined): number | null {
    if (!entityId) return null;
    const value = Number(this.hass.states[entityId]?.state);
    return Number.isFinite(value) ? value : null;
  }

  private _catName(): string | null {
    const id = this._entities.lastSeenPet;
    if (!id) return null;
    const state = this.hass.states[id]?.state;
    if (!state || state === "unavailable" || state.toLowerCase() === "unknown") return null;
    return state;
  }

  private _lastFedRelative(feedingState: string | undefined): string | null {
    const id = this._entities.feeding;
    if (!id || feedingState !== "off") return null;
    const state = this.hass.states[id];
    if (!state) return null;
    return relativeTime(new Date(state.last_changed), new Date());
  }

  private _scheduleEntries(): ScheduleEntry[] {
    const id = this._entities.schedule;
    if (!id) return [];
    const attrs = this.hass.states[id]?.attributes;
    const entries = attrs?.entries;
    return Array.isArray(entries) ? (entries as ScheduleEntry[]) : [];
  }

  private _onPortionSelected(event: CustomEvent<{ value: number }>): void {
    if (!this._entities.feedAmount) return;
    this.hass.callService("number", "set_value", { value: event.detail.value }, { entity_id: this._entities.feedAmount });
  }

  private _onFeedActivate = (): void => {
    if (!this._entities.deviceId) return;
    const amount = this._numberState(this._entities.feedAmount) ?? 1;
    this.hass.callService("kibble", "feed", { device_id: this._entities.deviceId, hopper: "both", amount });
  };

  private _onCancelActivate = (): void => {
    if (!this._entities.deviceId) return;
    this.hass.callService("kibble", "cancel_feed", { device_id: this._entities.deviceId });
  };

  private _openSettings = (): void => {
    this._settingsOpen = true;
  };

  private _closeSettings = (): void => {
    this._settingsOpen = false;
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${unsafeCSS(KIBBLE_AMBER)};
      --kibble-amber-dark: ${unsafeCSS(KIBBLE_AMBER_DARK)};
      --kibble-ink-on-amber: ${unsafeCSS(KIBBLE_INK_ON_AMBER)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 32px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 15px;
      --kibble-catname-size: 13px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
      --kibble-footer-size: 12px;
    }
    :host(.kiosk) {
      --kibble-touch-target: 60px;
      --kibble-feed-button-height: 72px;
      --kibble-number-size: 40px;
      --kibble-feed-label-size: 22px;
      --kibble-status-size: 19px;
      --kibble-catname-size: 16px;
      --kibble-segment-size: 20px;
      --kibble-schedule-size: 17px;
      --kibble-footer-size: 15px;
    }
    ha-card {
      overflow: hidden;
      height: 100%;
      display: block;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      height: 100%;
    }
    .root {
      display: grid;
      height: 100%;
      overflow-y: auto;
      gap: 10px;
      padding-bottom: 10px;
      grid-template-columns: 1fr;
      grid-template-areas: "hero" "bowl" "feed" "schedule" "footer";
    }
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      height: 0;
      padding-bottom: 42%;
      background: #1c1c1c;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    }
    .hero-media {
      position: absolute;
      inset: 0;
    }
    .hero-media > * {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #bbb;
      font-size: 14px;
    }
    .hero-progress {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: transparent;
    }
    .hero-progress[data-active="true"] {
      background: linear-gradient(90deg, transparent, var(--kibble-amber), transparent);
      background-size: 200% 100%;
      animation: kibble-sweep 1.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-progress[data-active="true"] {
        animation: none;
        background: var(--kibble-amber);
      }
    }
    @keyframes kibble-sweep {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    .gear-button {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: pointer;
    }
    .name-chip {
      position: absolute;
      left: 12px;
      bottom: 12px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
    }
    .bowl-block {
      grid-area: bowl;
      padding: 8px 14px 0;
      --kibble-bowl-max-width: 170px;
    }
    .feed-controls {
      grid-area: feed;
      padding: 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .feed-controls .picker-full {
      display: none;
    }
    .feed-controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 340px) {
      .feed-controls .picker-full {
        display: block;
      }
      .feed-controls .picker-compact {
        display: none;
      }
    }
    .schedule-row {
      grid-area: schedule;
      padding: 0 10px;
    }
    .footer {
      grid-area: footer;
      padding: 0 10px;
    }

    /* >=640px: two columns, camera left full height, bowl/feed/schedule stacked on the right. */
    @container (min-width: 640px) {
      .root {
        grid-template-columns: 60% 1fr;
        grid-template-rows: auto auto 1fr auto;
        grid-template-areas: "hero bowl" "hero feed" "hero schedule" "footer footer";
        gap: 4px;
        padding-bottom: 0;
      }
      .hero {
        grid-area: hero;
        padding-bottom: 0;
        height: 100%;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      .bowl-block,
      .feed-controls {
        grid-area: unset;
        align-self: start;
        justify-self: stretch;
        z-index: 0;
        margin: 0;
        width: auto;
        background: none;
        border-radius: 0;
      }
      .bowl-block {
        grid-area: bowl;
        padding: 4px 16px 0;
        --kibble-bowl-max-width: 210px;
        --kibble-catname-size: unset;
        --kibble-status-size: unset;
      }
      .feed-controls {
        grid-area: feed;
        padding: 6px 16px 0;
      }
      .schedule-row {
        grid-area: schedule;
        padding: 2px 16px;
        align-self: start;
      }
      .footer {
        grid-area: footer;
        padding: 0 16px 2px;
      }
    }
  `;
}

customElements.define("kibble-card", KibbleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-card",
  name: "Kibble",
  description: "The full daily control surface for a Kibble Petkit feeder: live camera, bowl status, feed, and schedule.",
  preview: true,
});

export interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "kibble-card": KibbleCard;
  }
  interface Window {
    customCards?: CustomCardEntry[];
  }
}
