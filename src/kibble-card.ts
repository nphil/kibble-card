/** The Kibble card: one illustrated status object (the bowl) plus three big actions (amount,
 * feed, schedule), responsive to its own box via container queries so the same markup works as
 * a dashboard tile, a tablet card and a full-screen kiosk panel. See README.md for the full
 * design rationale.
 */

import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import type { CalibrationState, CatSummary, HomeAssistant, KibbleCardConfig, TimelinePage } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { deriveFeederStatus, statusText, type FeederStatus } from "./lib/feeding";
import { relativeTimeSentence } from "./lib/relative-time";
import { WsQuery, watchKey } from "./lib/ws-query";
import { scheduleEntriesFrom, type ScheduleEntry } from "./lib/schedule";
import { ImageUrlCache } from "./lib/image-cache";
import { mdiIcon } from "./lib/mdi-icons";
import { version as KIBBLE_CARD_VERSION } from "../package.json";
import { KIOSK_MIN_HEIGHT_PX, KIBBLE_AMBER, KIBBLE_AMBER_DARK, KIBBLE_FEED, KIBBLE_FEED_DARK, KIBBLE_INK_ON_AMBER, KIBBLE_INK_ON_FEED, KIBBLE_LIVE } from "./styles/tokens";
import "./components/kibble-bowl";
import { parseHopperLevel, parseHopperRemaining, hopperFoodName } from "./lib/hopper-status";
import { displayCalibrationHopper } from "./lib/calibration";
import { dualFeedPlan } from "./lib/dual-feed";
import { popupForHash } from "./lib/popup-hash";
import type { PourSource } from "./lib/pour";
import { deriveBowlMix } from "./lib/bowl-mix";
import {
  FEED_REQUEST_IDLE,
  DEFAULT_FEED_REQUEST_CONFIG,
  feedRequestFeedingChanged,
  feedRequestReset,
  feedRequestSubmitted,
  feedRequestTick,
  type FeedRequestState,
} from "./lib/feed-request";
import "./components/kibble-segmented-picker";
import "./components/kibble-stepper";
import "./components/kibble-hold-button";
import "./components/kibble-schedule-summary";
import "./components/kibble-calibration-dialog";
import "./components/kibble-detection-areas-dialog";
import "./components/kibble-settings-dialog";
import "./components/kibble-hopper-sheet";
import "./components/kibble-avatar";
import "./components/kibble-live-hero";
import type { KibbleLiveHero } from "./components/kibble-live-hero";
import "./components/kibble-bubble-row";
import { bubbleCardAvailable } from "./components/kibble-bubble-row";
import "./editor";
import "./kibble-timeline-card";
import "./kibble-cats-card";
import "./kibble-schedule-card";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };

const PORTION_OPTIONS = [1, 2, 3, 4, 5] as const;
const PORTION_SEGMENT_OPTIONS = PORTION_OPTIONS.map((n) => ({ value: String(n), label: String(n) }));
/** Bubble's `styles` hook: the feed row is the card's one accent-filled control, so it wears
 * the amber the native hold button always did (theme-overridable through the same variables). */
const FEED_ROW_STYLES = `
  .bubble-button-card-container { background: var(--kibble-feed, #43a96a) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;
/** One portion button: a plain Bubble name button, number centred, 48px tall; the selected
 * one wears the accent. */
function portionStyles(selected: boolean, disabled: boolean): string {
  return `
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${selected ? "background: var(--kibble-feed, #43a96a) !important;" : ""} ${disabled ? "opacity: 0.5;" : ""} }
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
    _calibrationOpen: { state: true },
    _detectionAreasOpen: { state: true },
    _hopperSheetOpen: { state: true },
    _bubble: { state: true },
    _feedRequest: { state: true },
    _feedError: { state: true },
    _pourSource: { state: true },
    _heroControlsVisible: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCardConfig | undefined;
  declare _settingsOpen: boolean;
  /** Bubble Card is installed: the feed controls render as real Bubble rows. */
  declare _bubble: boolean;
  declare _feedRequest: FeedRequestState;
  /** Transient status text overriding the hold label -- a network failure ("Try hold again") or
   * a request the feeder never confirmed ("No response from the feeder"). `null` the rest of
   * the time. Separate from `_feedRequest` because the two failure modes are genuinely
   * different (the service call itself rejecting, vs. it succeeding but the feeder staying
   * silent) and each earns its own wording. */
  declare _feedError: string | null;
  /** Which hopper(s) *this card's own* hold button chose for the feed currently in progress --
   * `null` once there is no such feed (idle, or one this card did not start). Drives the bowl's
   * pour colour; see `lib/pour.ts`. */
  declare _pourSource: PourSource;
  /** Mirrors `<kibble-live-hero>`'s own `overlay-idle-changed` event -- drives the same fade on
   * `.gear-button`, which overlaps the hero's video from *outside* its shadow DOM and so has no
   * other way to know its controls just faded out. */
  declare _heroControlsVisible: boolean;

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
  private _feedRequestTimeoutTimer: ReturnType<typeof setTimeout> | undefined;
  private _feedErrorTimer: ReturnType<typeof setTimeout> | undefined;
  /** The last `feeding` boolean `willUpdate` reacted to, so a transition (not just "still on"
   * or "still off") drives `_feedRequest`/`_pourSource`/the timeline refetch exactly once each,
   * regardless of how many unrelated `hass` ticks land in between. */
  private _wasFeedingForRequest = false;
  /** Bumped on every `feeding` transition so `kibble/timeline`'s own watch key changes even
   * when the entity cycles back to a state string it already had (off -> on -> off would
   * otherwise look "unchanged" to `WsQuery`) -- same trick `_calibrationGeneration` uses below. */
  private _timelineGeneration = 0;
  // The bowl's mixed-food share reads `kibble/timeline`'s newest few rows for the most recent
  // feed that recorded a per-hopper split (`lib/bowl-mix.ts`); refetched on every feed-state
  // transition, never on a timer.
  private _timelineQuery = new WsQuery<TimelinePage>(() => this.requestUpdate());
  // Shared by the hero status avatar and live detection labels for this card's lifetime.
  private _imageCache = new ImageUrlCache();
  // The status overlay's avatar needs the named cat's color/photo from the roster; a private
  // field (not a reactive property) since `WsQuery` drives its own `requestUpdate` on change.
  private _catsQuery = new WsQuery<{ cats: CatSummary[] }>(() => this.requestUpdate());
  // No entity's state changing correlates with a calibration change the way `lastSeenPet`
  // does for the cat roster above -- the wizard is the only thing that ever mutates this, so
  // it bumps this generation counter itself (`_onCalibrationChanged`) instead of a watch key.
  private _calibrationQuery = new WsQuery<CalibrationState>(() => this.requestUpdate());
  private _calibrationGeneration = 0;
  /** The calibration wizard, opened from the card itself rather than from the settings panel.
   *
   * It lives here as well as inside `kibble-settings-dialog` because a dashboard that sets
   * `settings_hash` never opens that panel at all: the gear navigates to the operator's own
   * Bubble Card pop-up instead, and the wizard inside the card's panel is then unreachable --
   * which is exactly what happened on the real dashboard (2026-09-19). A pop-up row can now
   * fire `kibble: "calibrate"` the same way its feed rows already fire `kibble: "feed"`. */
  private _calibrationOpen = false;
  private _detectionAreasOpen = false;
  private _hopperSheetOpen = false;

  constructor() {
    super();
    this._settingsOpen = false;
    this._bubble = false;
    this._feedRequest = FEED_REQUEST_IDLE;
    this._feedError = null;
    this._pourSource = null;
    this._heroControlsVisible = true;
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
    window.addEventListener("hashchange", this._onHashChange);
    window.addEventListener("location-changed", this._onHashChange);
    this._onHashChange();
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
    window.removeEventListener("hashchange", this._onHashChange);
    window.removeEventListener("location-changed", this._onHashChange);
    this._clearFeedRequestTimeoutTimer();
    this._clearFeedErrorTimer();
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._imageCache.dispose();
  }

  protected willUpdate(): void {
    const deviceId = this._config?.device_id;
    // Data-driven, not measured: the >=960px side-by-side tier's own CSS (below) uses this to
    // give dual-hopper mode a higher side-by-side threshold than single -- two stepper rows
    // plus the hold button need more height than single's one picker does, and a true-16:9
    // video at 63% width does not always have that much to spare. Toggled from `hass` state
    // the same way `_singleHopper()` reads it, so it never drifts from what the row currently
    // renders, and never needs its own ResizeObserver.
    this.classList.toggle("dual-hopper", this.hass ? !this._singleHopper() : false);
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
        callWS({ type: "kibble/cats", entry_id: entryId }).then((result) => result as { cats: CatSummary[] }),
      );
    }
    // Gated on `bowlFill` (not, say, `hopperLevel1`): calibration only means anything where
    // there's a raw score to interpret in the first place.
    if (this.hass && this._entryId && callWS && this._entities.bowlFill) {
      const entryId = this._entryId;
      this._calibrationQuery.sync(`${entryId}:${this._calibrationGeneration}`, () =>
        callWS({ type: "kibble/calibration", entry_id: entryId }).then((result) => result as CalibrationState),
      );
    }
    // The feeding entity flipping is the one signal this card reacts to beyond plain rendering:
    // it drives the pill's own requesting -> feeding -> idle machine (a scheduled feed, the
    // feeder's own physical button, and another dashboard's feed all flip this same entity, so
    // the pill reflects reality regardless of who started it) and bumps the watch key for the
    // bowl-mix timeline query below.
    if (this.hass && this._entities.feeding) {
      const feedingNow = this.hass.states[this._entities.feeding]?.state === "on";
      if (feedingNow !== this._wasFeedingForRequest) {
        this._wasFeedingForRequest = feedingNow;
        this._feedRequest = feedRequestFeedingChanged(this._feedRequest, feedingNow);
        if (feedingNow) {
          this._clearFeedRequestTimeoutTimer();
          this._feedError = null;
        } else {
          this._pourSource = null;
        }
        this._timelineGeneration += 1;
      }
    }
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      this._timelineQuery.sync(`${entryId}:${this._timelineGeneration}`, () =>
        callWS({ type: "kibble/timeline", entry_id: entryId, limit: 5 }).then((result) => result as TimelinePage),
      );
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const e = this._entities;

    const feedingState = e.feeding ? this.hass.states[e.feeding]?.state : undefined;
    const coreIds = [e.feeding, e.bowlFill, e.schedule].filter((id): id is string => Boolean(id));
    const coreStates = coreIds.map((id) => this.hass.states[id]?.state);
    const status = deriveFeederStatus(coreStates, feedingState);
    const feeding = feedingState === "on";

    const bowlFill = this._numberState(e.bowlFill);
    const fillSource = e.bowlFill ? (this.hass.states[e.bowlFill]?.attributes?.source as string | undefined) ?? null : null;
    const calibrationHopper = displayCalibrationHopper(this._calibrationQuery.state.data);
    const hopperLevel1 = parseHopperLevel(e.hopperLevel1 && this.hass.states[e.hopperLevel1]?.state);
    const hopperLevel2 = parseHopperLevel(e.hopperLevel2 && this.hass.states[e.hopperLevel2]?.state);
    const hopperRemaining1 = e.hopperRemaining1 ? parseHopperRemaining(this.hass.states[e.hopperRemaining1]) : null;
    const hopperRemaining2 = e.hopperRemaining2 ? parseHopperRemaining(this.hass.states[e.hopperRemaining2]) : null;
    const singleHopper = this._singleHopper();
    const food1 = e.hopperFood1 ? hopperFoodName(this.hass.states[e.hopperFood1]) : null;
    const food2 = e.hopperFood2 ? hopperFoodName(this.hass.states[e.hopperFood2]) : null;
    const scheduleEntries = this._scheduleEntries();
    const feedAmount = this._numberState(e.feedAmount) ?? 1;
    const hopperAmount1 = this._numberState(e.feedAmountHopper1) ?? 0;
    const hopperAmount2 = this._numberState(e.feedAmountHopper2) ?? 0;
    // Single mode's own shared control still drives the bowl's stream-lane count; dual mode's
    // `feedAmount` entity is no longer touched by this card at all (see `_onFeedActivate`), so
    // the honest total is both hoppers' own chosen amounts instead -- same "never claim more
    // than what's honest" rule `pour.ts`'s own doc states for the pour colour.
    const totalPortions = singleHopper ? feedAmount : hopperAmount1 + hopperAmount2;
    const overlay = this._heroOverlay(status);

    const feedRequestLabel = this._feedError ?? (this._feedRequest.phase === "requesting" ? "Requesting…" : "Hold to feed");
    const feedControlLabel = feeding ? "Feeding" : feedRequestLabel;
    // Dual mode: nothing to dispense once both hoppers read 0 -- `dualFeedPlan` (used by
    // `_onFeedActivate`) would return null for the exact same inputs, so this is the render-time
    // half of that one rule, never a second copy of its branching.
    const dualFeedIsEmpty = !singleHopper && hopperAmount1 === 0 && hopperAmount2 === 0;
    const feedControlDisabled = status === "unreachable" || (!feeding && this._feedRequest.phase === "requesting") || dualFeedIsEmpty;
    const feedControlPending = !feeding && this._feedRequest.phase === "requesting";
    const darkMode = this.hass.themes?.darkMode === true;
    const bowlMix = deriveBowlMix(this._timelineQuery.state.data?.items ?? [], singleHopper);

    return html`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cats=${this._catsQuery.state.data?.cats ?? []}
                  .cache=${this._imageCache}
                  .cameraEntity=${e.camera}
                  .scryptedId=${this._config.scrypted_id}
                  .entryId=${this._entryId}
                  .overlayEntity=${e.detectionOverlaySwitch}
                  .callCatsEntity=${e.callCatsButton}
                  .externalPin=${this._settingsOpen}
                  @overlay-idle-changed=${this._onHeroOverlayIdleChanged}
                  @media-aspect-changed=${this._onMediaAspectChanged}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!overlay.live}></span>
                ${overlay.catName
                  ? html`<kibble-avatar
                      .hass=${this.hass}
                      .name=${overlay.catName}
                      .colorIndex=${overlay.colorIndex}
                      .asset=${overlay.avatarAsset}
                      .cache=${this._imageCache}
                    ></kibble-avatar>`
                  : nothing}
                <span class="hero-status-text" data-tone=${overlay.tone}>${overlay.text}</span>
              </div>
              <button
                class="gear-button ${this._heroControlsVisible ? "" : "idle-hidden"}"
                aria-label="Settings"
                @click=${this._openSettings}
                @focus=${this._notifyHeroActivity}
              >
                ${mdiIcon("cog")}
              </button>
              ${this._config.name ? html`<div class="name-chip">${this._config.name}</div>` : nothing}
            </div>
            <div class="side">
            <div class="panel">
            <kibble-bowl
              class="bowl-art"
              .fill=${bowlFill}
              .fillSource=${fillSource}
              .calibration=${calibrationHopper}
              .hopperLevel1=${hopperLevel1}
              .hopperLevel2=${hopperLevel2}
              .hopperRemaining1=${hopperRemaining1}
              .hopperRemaining2=${hopperRemaining2}
              .singleHopper=${singleHopper}
              .food1=${food1}
              .food2=${food2}
              .feeding=${feeding}
              .portions=${totalPortions}
              .darkMode=${darkMode}
              .bowlMix=${bowlMix}
              .pourSource=${this._pourSource}
              @hopper-detail-requested=${this._openHopperSheet}
            ></kibble-bowl>
            <div class="controls" @hass-action=${this._onBubbleAction}>
              <!-- Always this card's own controls, never a Bubble Card row.
                   Delegating the feed action to Bubble looked native on a Bubble dashboard
                   and behaved badly everywhere it mattered: no hold animation (Bubble has
                   none to drive), and on Android a long press raised the OS text-selection
                   magnifier because that row suppresses neither selection nor the callout.
                   A press-and-hold control has to own its own pointer handling. -->
              ${singleHopper
                ? html`
                    <kibble-segmented-picker
                      class="picker-full"
                      .value=${String(feedAmount)}
                      .options=${PORTION_SEGMENT_OPTIONS}
                      group-label="Feed amount, portions"
                      ?disabled=${status === "unreachable" || feeding}
                      @option-selected=${this._onPortionSelected}
                    ></kibble-segmented-picker>
                    <kibble-stepper
                      class="picker-compact"
                      .value=${feedAmount}
                      ?disabled=${status === "unreachable" || feeding}
                      @value-selected=${this._onPortionSelected}
                    ></kibble-stepper>
                  `
                : html`
                    <div class="hopper-row">
                      <span class="hopper-row-label">${food1 ?? "Hopper 1"}</span>
                      <kibble-stepper
                        .value=${hopperAmount1}
                        .min=${0}
                        .max=${5}
                        aria-label="${food1 ?? "Hopper 1"} portions"
                        ?disabled=${status === "unreachable" || feeding}
                        @value-selected=${this._onHopper1PortionSelected}
                      ></kibble-stepper>
                    </div>
                    <div class="hopper-row">
                      <span class="hopper-row-label">${food2 ?? "Hopper 2"}</span>
                      <kibble-stepper
                        .value=${hopperAmount2}
                        .min=${0}
                        .max=${5}
                        aria-label="${food2 ?? "Hopper 2"} portions"
                        ?disabled=${status === "unreachable" || feeding}
                        @value-selected=${this._onHopper2PortionSelected}
                      ></kibble-stepper>
                    </div>
                  `}
              <kibble-hold-button
                .label=${feedControlLabel}
                .variant=${feeding ? "cancel" : "feed"}
                ?disabled=${feedControlDisabled}
                ?pending=${feedControlPending}
                @activate=${feeding ? this._onCancelActivate : this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            </div>
            ${this._config.schedule_hash
              ? nothing
              : html`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${scheduleEntries}
                  .scheduleCardStateEntity=${e.scheduleCardState}
                  .singleHopper=${singleHopper}
                  .deviceId=${e.deviceId}
                  .food1=${food1}
                  .food2=${food2}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog
        .hass=${this.hass}
        .entities=${e}
        .entryId=${this._entryId}
        .singleHopper=${singleHopper}
        .food1=${food1}
        .food2=${food2}
        ?open=${this._settingsOpen}
        @close-requested=${this._closeSettings}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-settings-dialog>
      <kibble-hopper-sheet
        .hass=${this.hass}
        .entities=${e}
        ?open=${this._hopperSheetOpen}
        .hopperLevel1=${hopperLevel1}
        .hopperLevel2=${hopperLevel2}
        .hopperRemaining1=${hopperRemaining1}
        .hopperRemaining2=${hopperRemaining2}
        .singleHopper=${singleHopper}
        .food1=${food1}
        .food2=${food2}
        @close-requested=${this._closeHopperSheet}
      ></kibble-hopper-sheet>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this._entryId}
        .singleHopper=${singleHopper}
        .food1=${food1}
        .food2=${food2}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-calibration-dialog>
      <kibble-detection-areas-dialog
        .hass=${this.hass}
        .cameraEntity=${e.camera}
        .entryId=${this._entryId}
        ?open=${this._detectionAreasOpen}
        @close-requested=${this._closeDetectionAreas}
      ></kibble-detection-areas-dialog>
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
    avatarAsset: CatSummary["avatar"];
  } {
    const cameraId = this._entities.camera;
    const cameraState = cameraId ? this.hass.states[cameraId] : undefined;
    const live = cameraState !== undefined && cameraState.state !== "unavailable";

    if (status === "unreachable") {
      return { text: statusText(status, null), tone: "error", live, catName: null, colorIndex: null, avatarAsset: null };
    }
    if (status === "dispensing") {
      return { text: statusText(status, null), tone: "amber", live, catName: null, colorIndex: null, avatarAsset: null };
    }
    const seen = this._catSeen();
    // The feeder's own eat detector is up: a meal is happening right now, which outranks
    // "seen N minutes ago". The cat is whoever was last identified -- the identification
    // arrives a few seconds before the eat verdict on the same visit.
    const eatingId = this._entities.eating;
    const eating = eatingId !== undefined && this.hass.states[eatingId]?.state === "on";
    if (!seen) {
      return { text: eating ? "Eating now" : "Ready to feed", tone: "normal", live, catName: null, colorIndex: null, avatarAsset: null };
    }
    const roster = this._catsQuery.state.data?.cats.find((cat) => cat.name === seen.name) ?? null;
    return {
      text: eating ? `${seen.name} is eating` : `${seen.name} seen ${seen.relative}`,
      tone: "normal",
      live,
      catName: seen.name,
      colorIndex: roster?.color ?? null,
      avatarAsset: roster?.avatar ?? null,
    };
  }

  /** Who was last seen and how long ago. The time comes from the sensor's own
   * `last_identified` attribute -- the moment the feeder actually identified that cat -- never
   * from HA's `last_changed`, which is merely when the state STRING last changed. Those differ
   * badly in exactly the cases that matter: reloading the integration rewrote `last_changed`
   * and the hero cheerfully announced "Kitty seen 13 min ago" while the roster beside it, which
   * reads the real timestamp, said two hours (2026-09-19). `last_changed` remains the fallback
   * for a feeder too old to send the attribute. `null` covers both "no such entity" and the
   * sensor's own unknown/unavailable idle value. */
  private _catSeen(): { name: string; relative: string } | null {
    const id = this._entities.lastSeenPet;
    const entityState = id ? this.hass.states[id] : undefined;
    if (!entityState || entityState.state === "unavailable" || entityState.state.toLowerCase() === "unknown") {
      return null;
    }
    const identified = entityState.attributes?.last_identified;
    const when = typeof identified === "string" ? new Date(identified) : new Date(entityState.last_changed);
    const at = Number.isNaN(when.getTime()) ? new Date(entityState.last_changed) : when;
    return { name: entityState.state, relative: relativeTimeSentence(at, new Date()) };
  }

  private _scheduleEntries(): ScheduleEntry[] {
    const id = this._entities.schedule;
    return scheduleEntriesFrom(id ? this.hass.states[id] : undefined);
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
    } else if (action.kibble === "calibrate") {
      this._calibrationOpen = true;
    }
  };

  /** Shared by the single-mode portion segmented-picker's `option-selected` (string values) and
   * the compact stepper's `value-selected` (numeric) -- both just want `feedAmount` set. */
  private _onPortionSelected(event: CustomEvent<{ value: string | number }>): void {
    this._setHopperPortion(this._entities.feedAmount, event);
  }

  private _onHopper1PortionSelected = (event: CustomEvent<{ value: string | number }>): void => {
    this._setHopperPortion(this._entities.feedAmountHopper1, event);
  };

  private _onHopper2PortionSelected = (event: CustomEvent<{ value: string | number }>): void => {
    this._setHopperPortion(this._entities.feedAmountHopper2, event);
  };

  /** Writes one number entity from a picker's `option-selected`/stepper's `value-selected` --
   * shared by the single-mode shared control and each of dual mode's two per-hopper rows, none
   * of which need anything beyond "set this entity to this value". */
  private _setHopperPortion(entityId: string | undefined, event: CustomEvent<{ value: string | number }>): void {
    if (!entityId) return;
    const value = Number(event.detail.value);
    if (!Number.isFinite(value)) return;
    this.hass.callService("number", "set_value", { value }, { entity_id: entityId });
  }

  /** The hopper divider switch reads off: the feeder is running as one undivided hopper. */
  private _singleHopper(): boolean {
    const entityId = this._entities.hopperDivider;
    return entityId != null && this.hass.states[entityId]?.state === "off";
  }

  private _onFeedActivate = async (): Promise<void> => {
    if (!this._entities.deviceId || this._feedRequest.phase === "requesting") return;
    // Single mode has exactly one control and always dispenses something (feedAmount's own
    // floor is MIN_AMOUNT, never 0) -- "both" is the whole serving from the one real dispenser.
    // Dual mode reads each hopper's own row directly: `dualFeedPlan` turns the pair into
    // exactly what `kibble.feed` should receive, or `null` once both read 0 -- unreachable from
    // the UI (the Hold button is disabled in that state, `feedControlDisabled`), but guarded
    // here too rather than trusting the disabled attribute alone.
    const single = this._singleHopper();
    const plan = single
      ? { hopper: "both" as const, amount: this._numberState(this._entities.feedAmount) ?? 1 }
      : dualFeedPlan(this._numberState(this._entities.feedAmountHopper1) ?? 0, this._numberState(this._entities.feedAmountHopper2) ?? 0);
    if (!plan) return;
    this._clearFeedRequestTimeoutTimer();
    this._clearFeedErrorTimer();
    this._feedError = null;
    // The hold's own local completion (the checkmark, the flare, the burst) already fired by
    // the time this runs -- from here the pill just needs an honest "Requesting…" until the
    // feeder's own `feeding` entity confirms it, which `willUpdate`'s feeding-transition check
    // reacts to independently of this call's outcome.
    this._feedRequest = feedRequestSubmitted();
    this._armFeedRequestTimeout();
    // Recorded as the pour's own colour source before the call even resolves, so the bowl is
    // already primed the instant `feeding` flips.
    this._pourSource = plan.hopper;
    try {
      await this.hass.callService("kibble", "feed", {
        device_id: this._entities.deviceId,
        hopper: plan.hopper,
        amount: plan.amount,
        ...(plan.amount2 !== undefined ? { amount2: plan.amount2 } : {}),
      });
      // Success only means Home Assistant accepted the call -- stay in "requesting" until the
      // armed timeout gives up or the entity itself confirms dispensing has actually started.
    } catch {
      this._clearFeedRequestTimeoutTimer();
      this._feedRequest = feedRequestReset();
      this._pourSource = null;
      this._feedError = "Try hold again";
      this._resetFeedErrorAfter(5_000);
    }
  };

  /** Gives the feeder `DEFAULT_FEED_REQUEST_CONFIG.timeoutMs` to confirm dispensing has started
   * before the pill gives up honestly rather than reading "Requesting…" forever. A single timer
   * for the whole wait (rather than a repeating tick) is enough: `feedRequestTick` settles to
   * the same clamped `timeout` phase whether it is fed one big step or many small ones. */
  private _armFeedRequestTimeout(): void {
    this._clearFeedRequestTimeoutTimer();
    this._feedRequestTimeoutTimer = setTimeout(() => {
      this._feedRequestTimeoutTimer = undefined;
      if (this._feedRequest.phase !== "requesting") return;
      this._feedRequest = feedRequestTick(this._feedRequest, DEFAULT_FEED_REQUEST_CONFIG.timeoutMs, DEFAULT_FEED_REQUEST_CONFIG);
      this._pourSource = null;
      this._feedError = "No response from the feeder";
      this._resetFeedErrorAfter(5_000);
    }, DEFAULT_FEED_REQUEST_CONFIG.timeoutMs);
  }

  private _clearFeedRequestTimeoutTimer(): void {
    if (this._feedRequestTimeoutTimer !== undefined) clearTimeout(this._feedRequestTimeoutTimer);
    this._feedRequestTimeoutTimer = undefined;
  }

  /** Clears a shown error/timeout message after its own display window, returning the machine
   * to rest so a fresh hold starts clean. Shared by both failure modes -- the wording differs,
   * the reset behaviour does not. */
  private _resetFeedErrorAfter(delay: number): void {
    this._clearFeedErrorTimer();
    this._feedErrorTimer = setTimeout(() => {
      this._feedErrorTimer = undefined;
      this._feedError = null;
      this._feedRequest = feedRequestReset();
    }, delay);
  }

  private _clearFeedErrorTimer(): void {
    if (this._feedErrorTimer !== undefined) clearTimeout(this._feedErrorTimer);
    this._feedErrorTimer = undefined;
  }

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
    this._notifyHeroActivity();
    const hash = this._config?.settings_hash;
    if (hash) {
      history.pushState(null, "", hash);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      return;
    }
    this._settingsOpen = true;
  };

  /** Forwards a click/focus on `.gear-button` -- chrome that overlaps the hero's video from
   * *outside* its shadow DOM -- into the hero's own idle timer, exactly as if the activity had
   * happened inside it. */
  private _notifyHeroActivity = (): void => {
    this.renderRoot.querySelector<KibbleLiveHero>("kibble-live-hero")?.notifyActivity();
  };

  /** Mirrors `<kibble-live-hero>`'s own fade onto `.gear-button`, which has no other way to
   * learn its controls just faded (it lives outside the hero's shadow DOM entirely). */
  private _onHeroOverlayIdleChanged = (e: Event): void => {
    this._heroControlsVisible = (e as CustomEvent<{ visible: boolean }>).detail.visible;
  };

  /** `kibble-live-hero` sets its own `--kibble-hero-aspect` on itself once it learns the
   * stream's real ratio (`_reportMediaAspect`), but that only sizes that one element -- `.hero`,
   * its ANCESTOR in this card's own shadow tree, needs its own copy of the same custom property
   * for its own `aspect-ratio` rule (custom properties inherit downward only, never up from a
   * child to its parent). Set imperatively, not through a reactive property: nothing else in
   * this card's own template depends on the value, so there is no reason to trigger a full
   * re-render on every `loadedmetadata`/`load` tick just to patch one CSS custom property
   * lit-html was never asked to track in the first place. */
  private _onMediaAspectChanged = (e: Event): void => {
    const ratio = (e as CustomEvent<{ ratio: number }>).detail?.ratio;
    if (!Number.isFinite(ratio) || ratio <= 0) return;
    this.renderRoot.querySelector<HTMLElement>(".hero")?.style.setProperty("--kibble-hero-aspect", String(ratio));
  };

  private _closeSettings = (): void => {
    this._settingsOpen = false;
  };

  /** Opens the wizard when the dashboard navigates to `calibrate_hash` (default
   * `#calibrate`).
   *
   * A hash, not a `fire-dom-event` row, because the operator's settings pop-up is a Bubble
   * Card that lives OUTSIDE this element: its rows cannot reach the `hass-action` listener on
   * the card's own controls, so the existing `kibble:` action mechanism is unavailable to
   * them. A hash crosses that boundary, and it is the same mechanism `settings_hash` already
   * uses to send the gear the other way. */
  private _onHashChange = (): void => {
    const popup = popupForHash(window.location.hash, this._config);
    if (popup === "calibrate") this._calibrationOpen = true;
    if (popup === "detection-areas") this._detectionAreasOpen = true;
  };

  /** Clears the popup hash the dialog was opened from, so the next `location-changed`
   * (any navigation anywhere on the dashboard re-fires it) cannot silently reopen a dialog
   * the operator just dismissed. */
  private _clearPopupHash(): void {
    if (popupForHash(window.location.hash, this._config) === null) return;
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  private _closeCalibration = (event: Event): void => {
    // Stopped here for the same reason the settings panel stops it: both dialogs use the
    // `close-requested` name, and letting it bubble past would close whatever else is open.
    event.stopPropagation();
    this._calibrationOpen = false;
    this._clearPopupHash();
  };

  private _closeDetectionAreas = (event: Event): void => {
    event.stopPropagation();
    this._detectionAreasOpen = false;
    this._clearPopupHash();
  };

  private _openHopperSheet = (): void => {
    this._hopperSheetOpen = true;
  };

  private _closeHopperSheet = (event: Event): void => {
    event.stopPropagation();
    this._hopperSheetOpen = false;
  };

  /** The wizard just changed a hopper's curve (or discarded/cleared one) -- bump the sync key
   * `willUpdate` compares so the bowl's calibrated-percentage display refetches, the same way
   * an entity's own state change would if calibration had one to watch. */
  private _onCalibrationChanged = (): void => {
    this._calibrationGeneration += 1;
    this.requestUpdate();
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${unsafeCSS(KIBBLE_AMBER)};
      --kibble-amber-dark: ${unsafeCSS(KIBBLE_AMBER_DARK)};
      /* The feed action, deliberately not the food's amber -- see the token's own doc. */
      --kibble-feed: ${unsafeCSS(KIBBLE_FEED)};
      --kibble-feed-dark: ${unsafeCSS(KIBBLE_FEED_DARK)};
      --kibble-ink-on-feed: ${unsafeCSS(KIBBLE_INK_ON_FEED)};
      --kibble-ink-on-amber: ${unsafeCSS(KIBBLE_INK_ON_AMBER)};
      --kibble-live: ${unsafeCSS(KIBBLE_LIVE)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 34px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 22px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
      /* The one vertical rhythm every gap and every section's own top padding is built from --
       * the art, the chips, the choice row, the stepper, and the pill all breathe by the same
       * amount, so nothing in the hero reads as an accident of whichever element happened to
       * need a number. */
      --kibble-rhythm: 14px;
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
    /* One column: the card is exactly as tall as its content, never a scroll box inside the
     * dashboard's own scroll. The two-column layout below boxes itself to the video instead.
     * Zero row gap on purpose: the video and the panel below it are one continuous card
     * surface, not two stacked tiles -- the hero's own square bottom corners (below) are what
     * make that continuity read as intentional rather than a seam. Every panel/schedule gets
     * its own top padding instead, off the same --kibble-rhythm scale. */
    .root {
      display: grid;
      gap: 0;
      grid-template-columns: 1fr;
      grid-template-areas: "hero" "panel" "schedule";
    }
    /* .side only exists as a grid area at >= 960px container width -- display: contents
     * unwraps it entirely below that so .panel/.schedule-row place directly into .root's own
     * "panel"/"schedule" areas, exactly as if .side were never in the markup at all. The
     * @container (min-width: 960px) block below turns it back into a real grid container once
     * there is a second column for it to own. */
    .side {
      display: contents;
    }
    /* Always the stream's true aspect ratio -- --kibble-hero-aspect starts at the sane 16/9
     * default every real feeder stream actually is (main 1920x1080, sub 1280x720) and is
     * overwritten by _onMediaAspectChanged the moment kibble-live-hero reports the real
     * media size, so the box never guesses a ratio the video itself does not have. */
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      aspect-ratio: var(--kibble-hero-aspect, 16 / 9);
      background: #1c1c1c;
      /* Square where the panel continues directly below -- rounded only at the top, so the
       * video and the card's own surface read as one shape, not two abutted rectangles. */
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    }
    .hero-media {
      position: absolute;
      inset: 0;
    }
    /* Fills .hero exactly; kibble-live-hero never crops beyond this box on its own (it
     * object-fit: contains the actual video/image internally), so there is no object-fit to
     * set here -- it would do nothing anyway, since this child is a custom element, never a
     * replaced one. */
    .hero-media > * {
      display: block;
      width: 100%;
      height: 100%;
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
    /* Mirrors <kibble-live-hero>'s own controls/topbar fade (overlay-idle-changed, forwarded by
       _onHeroOverlayIdleChanged) since this button overlaps the hero's video from outside its
       shadow DOM and shares none of its CSS. No transition property outside the no-preference
       query, so a reduced-motion user's browser snaps the opacity instantly. */
    @media (prefers-reduced-motion: no-preference) {
      .gear-button {
        transition: opacity 200ms ease;
      }
    }
    .gear-button.idle-hidden {
      opacity: 0;
      pointer-events: none;
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
    /* The one calm panel: the art, the chips (drawn inside kibble-bowl itself), the hopper
     * choice, the portion stepper, and the pill -- one shared content width and one left edge,
     * so the art's own centre lines up with the pill's. Never touched by the container queries
     * below: the same rule places it under the video on a narrow card and beside it on a wide
     * one, capped and centred either way so it never grows into a giant balloon on a big
     * screen. kibble-bowl is the one child allowed to shrink (flex: 1 1 auto) when the wide
     * layout's own height budget is tight; the controls beneath it never do. */
    .panel {
      grid-area: panel;
      display: flex;
      flex-direction: column;
      min-height: 0;
      gap: var(--kibble-rhythm);
      width: 100%;
      max-width: 340px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: var(--kibble-rhythm) 16px calc(var(--kibble-rhythm) + 2px);
    }
    .bowl-art {
      flex: 1 1 auto;
      min-height: 0;
    }
    .controls {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: var(--kibble-rhythm);
      width: 100%;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .controls .picker-full {
      display: none;
    }
    .controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 280px) {
      .controls .picker-full {
        display: block;
      }
      .controls .picker-compact {
        display: none;
      }
    }
    /* One dual-hopper row: the hopper's label left, its stepper right. Both rows share one
     * column edge, so the steppers line up whatever the food names' lengths, and each row is
     * one control tall, so two rows plus the Hold button never grow the hero. */
    .hopper-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 12px;
    }
    .hopper-row-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--kibble-segment-size);
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .schedule-row {
      grid-area: schedule;
      padding: var(--kibble-rhythm) 16px 6px;
    }
    :host(.compact) {
      --kibble-rhythm: 8px;
    }
    :host(.compact) .hero {
      aspect-ratio: auto;
      height: 80px;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }

    /* 560-959px (dual-hopper: 560-1279px, see the two @container blocks below -- two stepper
     * rows plus the hold button need more height at the same video width, so dual mode keeps
     * this layout until there is room): the video is full width above ONE row -- the bowl art
     * and the feed controls side by side, vertically centred. .root itself stays the
     * single-column stacked grid (only .panel's own internal direction changes) since the
     * video still spans the whole card width in this tier, exactly like the narrower stacked
     * layout above it. Unconditional -- both hopper modes want a row here, only where they
     * leave it differs. */
    @container (min-width: 560px) {
      .panel {
        flex-direction: row;
        align-items: center;
        max-width: 640px;
      }
      .bowl-art {
        flex: 0 1 220px;
        max-width: 220px;
      }
      .controls {
        flex: 1 1 0%;
        width: auto;
        min-width: 0;
      }
    }
    /* >=1100px, single-hopper only (:host(.dual-hopper) gets the same rules at a higher
     * threshold, below): two real columns, video left, panel/schedule stacked right -- .panel
     * reverts to the vertical layout the narrower tiers use (undoing the 560px row above),
     * since it now has its own dedicated column instead of sitting below a full-width video.
     * The video column is ~63% of the card width at its own true ratio (.hero's aspect-ratio,
     * set above): that fixed width plus the aspect ratio gives it a definite, intrinsic
     * height, which is what actually sets the row's height -- align-self: start (rather than
     * the default stretch) keeps the box at exactly that height instead of being stretched to
     * match .side if the panel ever needs more room than the video does. .side keeps the
     * default stretch and matches whatever height that turns out to be; .bowl-art's own
     * flex: 1 1 auto; min-height: 0 (unchanged from the base rule below) is what actually
     * absorbs the difference, since it is the one flexible child in that column -- and
     * kibble-bowl.ts's own .art{min-height:0} is what lets it genuinely shrink that far
     * without kibble-bowl's non-shrinking .calibrated/.chips ever losing their own space.
     * 1100px, not 960px: below it the shrunk art drops under ~70px (measured ~22px at 960,
     * ~45px at 1024) -- legible chips are not enough on their own if the illustration above
     * them has shrunk to a speck, so single mode stays in the 560px row tier (where bowl-art
     * is sized from its own width, never height-squeezed) until there is room for both.
     * .panel's overflow-y: auto and .bowl-art's overflow: hidden are a last-resort safety net
     * for a combination this tight and single mode alone should essentially never reach. */
    @container (min-width: 1100px) {
      :host(:not(.dual-hopper)) .root {
        grid-template-columns: 63% 1fr;
        grid-template-rows: calc(100cqw * 0.63 / var(--kibble-hero-aspect, 1.7778));
        grid-template-areas: "hero side";
        height: auto;
        overflow: visible;
      }
      :host(:not(.dual-hopper)) .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      :host(:not(.dual-hopper)) .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
      }
      :host(:not(.dual-hopper)) .panel {
        flex-direction: column;
        max-width: 340px;
        overflow-y: auto;
      }
      :host(:not(.dual-hopper)) .bowl-art {
        flex: 1 1 auto;
        max-width: none;
        overflow: hidden;
      }
      :host(:not(.dual-hopper)) .controls {
        flex: none;
        width: 100%;
      }
      :host(:not(.dual-hopper)) .panel,
      :host(:not(.dual-hopper)) .schedule-row {
        grid-area: unset;
      }
      :host(:not(.dual-hopper)) .schedule-row {
        align-self: start;
      }
    }
    /* >=1440px, dual-hopper only: identical layout to the single-hopper >=1100px tier above,
     * just a later threshold, for the same ~70px-minimum-art reason. Measured, not guessed: at
     * a true 16:9 video and 63% width, two stepper rows plus the hold button plus kibble-bowl's
     * own non-shrinking hopper-status chips (and, once calibration exists, its
     * calibrated-percent line) leave art around 183px at 960-1200px (comfortable) but the
     * SAME numbers only apply while dual stays in the row tier below -- once forced into this
     * column tier, dual needs noticeably more width than single before art clears ~70px again
     * (measured ~78px right at 1440, well under 70 at 1280) since it is negotiating for space
     * against a taller controls block (two stepper rows, not one). Below this threshold dual
     * mode stays in the 560px row tier above instead, where bowl-art is sized from its own
     * width and never height-squeezed at all. */
    @container (min-width: 1440px) {
      :host(.dual-hopper) .root {
        grid-template-columns: 63% 1fr;
        grid-template-rows: calc(100cqw * 0.63 / var(--kibble-hero-aspect, 1.7778));
        grid-template-areas: "hero side";
        height: auto;
        overflow: visible;
      }
      :host(.dual-hopper) .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      :host(.dual-hopper) .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
      }
      :host(.dual-hopper) .panel {
        flex-direction: column;
        max-width: 340px;
        overflow-y: auto;
      }
      :host(.dual-hopper) .bowl-art {
        flex: 1 1 auto;
        max-width: none;
        overflow: hidden;
      }
      :host(.dual-hopper) .controls {
        flex: none;
        width: 100%;
      }
      :host(.dual-hopper) .panel,
      :host(.dual-hopper) .schedule-row {
        grid-area: unset;
      }
      :host(.dual-hopper) .schedule-row {
        align-self: start;
      }
    }
  `;
}

// Printed once on load so "is this browser actually running the new card?" is answerable
// from the console instead of by guessing at caches. HACS version-busts the resource URL, but
// a tablet holding a service-worker copy looks identical to a card that simply does not work
// -- which cost a round of debugging on 2026-09-20.
console.info(`%c KIBBLE-CARD %c ${KIBBLE_CARD_VERSION} `, "background:#43A96A;color:#10301D;font-weight:700", "background:#10301D;color:#fff");

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
