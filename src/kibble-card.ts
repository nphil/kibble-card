/** The Kibble card: one illustrated status object (the bowl) plus three big actions (amount,
 * feed, schedule), responsive to its own box via container queries so the same markup works as
 * a dashboard tile, a tablet card and a full-screen kiosk panel. See README.md for the full
 * design rationale.
 */

import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import type { HomeAssistant, KibbleCardConfig, KibbleCatSummary } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { deriveFeederStatus, statusText, type FeederStatus } from "./lib/feeding";
import { relativeTimeSentence } from "./lib/relative-time";
import { WsQuery, watchKey } from "./lib/ws-query";
import type { ScheduleEntry } from "./lib/schedule";
import { mdiIcon } from "./lib/mdi-icons";
import { KIOSK_MIN_HEIGHT_PX, KIBBLE_AMBER, KIBBLE_AMBER_DARK, KIBBLE_INK_ON_AMBER, KIBBLE_LIVE } from "./styles/tokens";
import "./components/kibble-bowl";
import "./components/kibble-segmented-picker";
import "./components/kibble-stepper";
import "./components/kibble-hold-button";
import "./components/kibble-schedule-summary";
import "./components/kibble-settings-dialog";
import "./components/kibble-avatar";
import "./components/kibble-live-hero";
import "./components/kibble-bubble-row";
import { bubbleCardAvailable } from "./components/kibble-bubble-row";
import "./editor";
import "./kibble-timeline-card";
import "./kibble-cats-card";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };

const PORTION_OPTIONS = [1, 2, 3, 4, 5] as const;

/** Bubble's `styles` hook: the feed row is the card's one accent-filled control, so it wears
 * the amber the native hold button always did (theme-overridable through the same variables). */
const FEED_ROW_STYLES = `
  .bubble-button-card-container { background: var(--kibble-amber, #f2a33c) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;
/** One portion button: a plain Bubble name button, number centred, 48px tall; the selected
 * one wears the accent. */
function portionStyles(selected: boolean, disabled: boolean): string {
  return `
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${selected ? "background: var(--kibble-amber, #f2a33c) !important;" : ""} ${disabled ? "opacity: 0.5;" : ""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${selected ? "color: var(--kibble-ink-on-amber, #241a07) !important;" : ""} }
`;
}
const FEEDING_ROW_STYLES = `
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`;

export class KibbleCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _settingsOpen: { state: true },
    _bubble: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCardConfig | undefined;
  declare _settingsOpen: boolean;
  /** Bubble Card is installed: the feed controls render as real Bubble rows. */
  declare _bubble: boolean;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  // What `_entities`/`_entryId` were last resolved from -- `hass` is a new object reference on
  // every state change anywhere in the house, but the entity/device registries themselves (and
  // the configured device) rarely change, so re-running `resolveKibbleEntities` on every tick
  // would be pure waste; this makes the recompute track its real inputs instead of `hass` itself.
  private _resolvedEntities: HomeAssistant["entities"] | undefined;
  private _resolvedDevices: HomeAssistant["devices"] | undefined;
  private _resolvedDeviceId: string | undefined;
  private _resizeObserver: ResizeObserver | undefined;
  // The status overlay's avatar needs the named cat's color/photo from the roster; a private
  // field (not a reactive property) since `WsQuery` drives its own `requestUpdate` on change.
  private _catsQuery = new WsQuery<{ cats: KibbleCatSummary[] }>(() => this.requestUpdate());

  constructor() {
    super();
    this._settingsOpen = false;
    this._bubble = false;
    void bubbleCardAvailable().then((ok) => {
      this._bubble = ok;
    });
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
      const rect = entries[0]?.contentRect;
      const height = rect?.height ?? this.getBoundingClientRect().height;
      const width = rect?.width ?? this.getBoundingClientRect().width;
      this.classList.toggle("kiosk", height >= KIOSK_MIN_HEIGHT_PX);
      this.classList.toggle("compact", width < 640 && height > 0 && height <= 520);
    });
    this._resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  protected willUpdate(): void {
    const deviceId = this._config?.device_id;
    if (
      this.hass &&
      deviceId &&
      (this.hass.entities !== this._resolvedEntities || this.hass.devices !== this._resolvedDevices || deviceId !== this._resolvedDeviceId)
    ) {
      this._resolvedEntities = this.hass.entities;
      this._resolvedDevices = this.hass.devices;
      this._resolvedDeviceId = deviceId;
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, deviceId);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, deviceId);
    }
    // Only worth asking for the cat roster once there is a name to look up (`lastSeenPet`) and
    // somewhere to ask (`entryId`, `callWS`) -- most of the time this simply never fires.
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS && this._entities.lastSeenPet) {
      const entryId = this._entryId;
      this._catsQuery.sync(watchKey(this.hass, [this._entities.lastSeenPet]), () =>
        callWS({ type: "kibble/cats", entry_id: entryId }).then((result) => result as { cats: KibbleCatSummary[] }),
      );
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
    const scheduleEntries = this._scheduleEntries();
    const feedAmount = this._numberState(e.feedAmount) ?? 1;
    const overlay = this._heroOverlay(status);

    return html`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cameraEntity=${e.camera}
                  .scryptedId=${this._config.scrypted_id}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!overlay.live}></span>
                ${overlay.catName
                  ? html`<kibble-avatar
                      .hass=${this.hass}
                      .name=${overlay.catName}
                      .colorIndex=${overlay.colorIndex}
                      .entryId=${this._entryId}
                      .sampleName=${overlay.avatarSample}
                    ></kibble-avatar>`
                  : nothing}
                <span class="hero-status-text" data-tone=${overlay.tone}>${overlay.text}</span>
              </div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${mdiIcon("cog")}</button>
              ${this._config.name ? html`<div class="name-chip">${this._config.name}</div>` : nothing}
            </div>
            <div class="side">
            <kibble-bowl class="bowl-block" .hopper1=${hopper1} .hopper2=${hopper2} .feeding=${feeding}></kibble-bowl>
            <div class="feed-controls" @hass-action=${this._onBubbleAction}>
              ${this._bubble
                ? html`<div class="portions">
                      ${this._portionConfigs(feedAmount, status === "unreachable" || feeding).map(
                        (config) => html`<kibble-bubble-row .hass=${this.hass} .config=${config}></kibble-bubble-row>`,
                      )}
                    </div>
                    <kibble-bubble-row .hass=${this.hass} .config=${this._feedRowConfig(feeding, status === "unreachable")}></kibble-bubble-row>`
                : html`<kibble-segmented-picker
                      class="picker-full"
                      .value=${feedAmount}
                      ?disabled=${status === "unreachable" || feeding}
                      @portion-selected=${this._onPortionSelected}
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
                    ></kibble-hold-button>`}
            </div>
            ${this._config.schedule_hash
              ? nothing
              : html`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${scheduleEntries}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `;
  }

  private _numberState(entityId: string | undefined): number | null {
    if (!entityId) return null;
    const value = Number(this.hass.states[entityId]?.state);
    return Number.isFinite(value) ? value : null;
  }

  /** The video status overlay's full view model. `tone` is "error" only for unreachable (the
   * one case that's actually a problem) and "amber" for dispensing (an active, positive state,
   * matching the accent used everywhere else feeding is in progress); everything else is plain
   * overlay text. The avatar fields are populated only in the idle "who was last seen" case. */
  private _heroOverlay(status: FeederStatus): {
    text: string;
    tone: "normal" | "amber" | "error";
    live: boolean;
    catName: string | null;
    colorIndex: number | null;
    avatarSample: string | null;
  } {
    const cameraId = this._entities.camera;
    const cameraState = cameraId ? this.hass.states[cameraId] : undefined;
    const live = cameraState !== undefined && cameraState.state !== "unavailable";

    if (status === "unreachable") {
      return { text: statusText(status, null), tone: "error", live, catName: null, colorIndex: null, avatarSample: null };
    }
    if (status === "dispensing") {
      return { text: statusText(status, null), tone: "amber", live, catName: null, colorIndex: null, avatarSample: null };
    }
    const seen = this._catSeen();
    if (!seen) {
      return { text: "Ready to feed", tone: "normal", live, catName: null, colorIndex: null, avatarSample: null };
    }
    const roster = this._catsQuery.state.data?.cats.find((cat) => cat.name === seen.name) ?? null;
    return {
      text: `${seen.name} seen ${seen.relative}`,
      tone: "normal",
      live,
      catName: seen.name,
      colorIndex: roster?.color_index ?? null,
      avatarSample: roster?.avatar ?? null,
    };
  }

  /** Who was last seen and how long ago, straight off `lastSeenPet`'s own state/`last_changed` --
   * `null` covers both "no such entity" and the sensor's own unknown/unavailable idle value. */
  private _catSeen(): { name: string; relative: string } | null {
    const id = this._entities.lastSeenPet;
    const entityState = id ? this.hass.states[id] : undefined;
    if (!entityState || entityState.state === "unavailable" || entityState.state.toLowerCase() === "unknown") {
      return null;
    }
    return { name: entityState.state, relative: relativeTimeSentence(new Date(entityState.last_changed), new Date()) };
  }

  private _scheduleEntries(): ScheduleEntry[] {
    const id = this._entities.schedule;
    if (!id) return [];
    const attrs = this.hass.states[id]?.attributes;
    const entries = attrs?.entries;
    return Array.isArray(entries) ? (entries as ScheduleEntry[]) : [];
  }

  // The two Bubble rows. Bubble handles the gestures (tap / hold) and reports them as HA's
  // standard `hass-action` event carrying the action config, so each action here is a
  // `fire-dom-event` tagged with a `kibble` verb the handler below dispatches on.
  private _portionConfigs(selected: number | null, disabled: boolean): Record<string, unknown>[] {
    const none = { action: "none" };
    return PORTION_OPTIONS.map((portion) => {
      const actions = {
        tap_action: disabled ? none : { action: "fire-dom-event", kibble: "portion", portion },
        double_tap_action: none,
        hold_action: none,
      };
      return {
        card_type: "button",
        button_type: "name",
        name: String(portion),
        show_icon: false,
        show_state: false,
        styles: portionStyles(portion === selected, disabled),
        // Bubble wires top-level actions to the icon and `button_action` to the button body.
        ...actions,
        button_action: actions,
      };
    });
  }

  private _feedRowConfig(feeding: boolean, disabled: boolean): Record<string, unknown> {
    const none = { action: "none" };
    const actions = {
      tap_action: feeding && !disabled ? { action: "fire-dom-event", kibble: "cancel" } : none,
      double_tap_action: none,
      hold_action: !feeding && !disabled ? { action: "fire-dom-event", kibble: "feed" } : none,
    };
    return {
      card_type: "button",
      button_type: "name",
      name: disabled ? "Feeder unreachable" : feeding ? "Feeding… tap to cancel" : "Hold to feed",
      icon: feeding ? "mdi:stop-circle-outline" : "mdi:bowl-mix",
      styles: feeding ? FEEDING_ROW_STYLES : FEED_ROW_STYLES,
      ...actions,
      button_action: actions,
    };
  }

  private _onBubbleAction = (event: Event): void => {
    const detail = (event as CustomEvent<{ action: string; config: Record<string, unknown> }>).detail;
    const action = detail?.config?.[`${detail.action}_action`] as { action?: string; kibble?: string; portion?: number } | undefined;
    if (action?.action !== "fire-dom-event" || !action.kibble) return;
    event.stopPropagation();
    if (action.kibble === "portion" && typeof action.portion === "number" && this._entities.feedAmount) {
      this.hass.callService("number", "set_value", { value: action.portion }, { entity_id: this._entities.feedAmount });
    } else if (action.kibble === "feed") {
      this._onFeedActivate();
    } else if (action.kibble === "cancel") {
      this._onCancelActivate();
    }
  };

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

  // Unset `settings_hash` (the HACS default -- the card stands alone with no pop-up dashboard):
  // open the in-card dialog, exactly as before. Set (a dashboard that defines a `#settings`
  // Bubble Card pop-up): navigate there instead, so the whole dashboard shares one settings
  // surface rather than this card keeping a second, inconsistent one alive underneath it.
  // Assigning `location.hash` is not enough: HA's router rewrites a bare hash to `#/…` and
  // Bubble Card only listens for the frontend's own `location-changed` event.
  private _openSettings = (): void => {
    const hash = this._config?.settings_hash;
    if (hash) {
      history.pushState(null, "", hash);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      return;
    }
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
      --kibble-live: ${unsafeCSS(KIBBLE_LIVE)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 34px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 22px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
    }
    :host(.kiosk) {
      --kibble-touch-target: 60px;
      --kibble-feed-button-height: 72px;
      --kibble-number-size: 42px;
      --kibble-feed-label-size: 22px;
      --kibble-status-size: 27px;
      --kibble-segment-size: 20px;
      --kibble-schedule-size: 17px;
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
      grid-template-areas: "hero" "bowl" "feed" "schedule";
    }
    /* The feeder's streams are 16:10 (1152x720 sub, 1728x1080 main): the hero keeps that ratio
     * so the fisheye frame is never cropped or stretched to fit a layout guess. */
    .side {
      display: contents;
    }
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 10;
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
    /* The live dot + latest cat + avatar: the one thing this restyle puts front and center --
     * "who has been by" belongs on the video itself, not buried in a footer row. */
    .hero-status {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      max-width: calc(100% - 56px);
      width: fit-content;
      padding: 5px 10px 5px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
    }
    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--kibble-live);
      flex: 0 0 auto;
    }
    .live-dot[hidden] {
      display: none;
    }
    .hero-status kibble-avatar {
      --kibble-avatar-size: 20px;
    }
    .hero-status-text {
      font-size: 13px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero-status-text[data-tone="amber"] {
      color: var(--kibble-amber);
    }
    .hero-status-text[data-tone="error"] {
      color: var(--error-color, #ff8a80);
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
      --kibble-bowl-max-width: 250px;
    }
    .feed-controls {
      grid-area: feed;
      padding: 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .portions {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .portions > * {
      min-width: 0;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .feed-controls .picker-full {
      display: none;
    }
    .feed-controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 280px) {
      .feed-controls .picker-full {
        display: block;
      }
      .feed-controls .picker-compact {
        display: none;
      }
    }
    .schedule-row {
      grid-area: schedule;
      padding: 0 10px 6px;
    }
    :host(.compact) .root {
      gap: 6px;
    }
    :host(.compact) .hero {
      aspect-ratio: auto;
      height: 80px;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }
    :host(.compact) .bowl-block {
      padding-top: 2px;
      --kibble-bowl-max-width: 200px;
    }

    /* >=640px: two columns, camera left, silo/feed/schedule stacked right. The camera is 60%
     * of the card at 16:10, so the row is exactly 0.6 * 10/16 = 37.5% of the card width tall;
     * the right column is boxed to that same height so it can never outgrow the video. */
    @container (min-width: 640px) {
      .root {
        grid-template-columns: 60% 1fr;
        grid-template-rows: auto;
        grid-template-areas: "hero side";
        gap: 4px;
        padding-bottom: 0;
        height: auto;
        overflow: visible;
      }
      .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto auto;
        height: calc(100cqw * 0.6 * 10 / 16);
        min-height: 0;
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
        grid-area: unset;
        align-self: stretch;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 16px 0;
        --kibble-bowl-max-width: 250px;
      }
      .bowl-block > * {
        height: 100%;
        max-height: 100%;
      }
      .feed-controls {
        grid-area: unset;
        padding: 6px 16px 12px;
        --kibble-touch-target: 48px;
        --kibble-segment-size: 16px;
      }
      .schedule-row {
        grid-area: unset;
        padding: 2px 16px 10px;
        align-self: start;
      }
    }
  `;
}

customElements.define("kibble-card", KibbleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-card",
  name: "Kibble",
  description: "The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",
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
