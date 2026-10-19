/** The feeder's activity as one calm, continuously-scrolling list: every visit, meal and feed,
 * newest first, grouped by day and collapsed when the same cat repeats the same kind of event
 * within a few minutes. A thin coloured rail (one dot per row, in the cat's own colour) runs
 * down the left, time to its left, content to its right -- a real chronological sequence, so a
 * rail is earned here rather than decorative. Exactly three titles exist for a named/finished
 * event -- "<Cat> came by", "<Cat> ate", "Fed N portion(s)" -- the cat's own name tinted in its
 * colour, never a raw class string. A meal or feed with both a before and after photo shows them
 * as a real, readable pair right in the row; a visit shows a large round photo. An unidentified
 * row trades its title for an inline "Who was this?" picker: cat-coloured pill chips, one tap
 * labels it (and every event the row collapsed) optimistically, with a quiet rollback and inline
 * error if the save fails. Tapping any photo opens the shared labelling sheet for a fuller
 * correction. The whole list sits on one card surface with the page's own scroll carrying it by
 * default (an optional `max_height` opts back into a bounded, internally-scrolling rail); older
 * pages load automatically as an intersection sentinel comes into view. A freshly pushed event
 * slides and fades in once; nothing else animates on its own. See
 * `kibble/docs/36-ai-pipeline.md` for the full contract this renders.
 */

import type { CustomCardEntry } from "./kibble-card";
import { LitElement, css, html, nothing } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { CatsResponse, EventDetail, HomeAssistant, KibbleTimelineCardConfig, TimelineEvent } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { ImageUrlCache } from "./lib/image-cache";
import { TimelineFeed } from "./lib/timeline-feed";
import { WsQuery } from "./lib/ws-query";
import { labelSample } from "./lib/sample-label";
import { reviewSummaryMessage, type ReviewedEventLabel } from "./lib/review-summary";
import { labelSession, type SessionLabelRequest } from "./lib/session-label";
import {
  catVerb,
  compareAssets,
  eventDuration,
  eventTitle,
  feedTitle,
  groupByDay,
  groupConsecutive,
  groupCountLabel,
  orderTogetherEvents,
  railStyle,
  rowThumbAsset,
  timeLabel,
  togetherTitle,
  spanDuration,
  type EventGroup,
  type TimelineDay,
} from "./lib/timeline";
import { catSilhouette } from "./lib/brand-shapes";
import { mdiIcon } from "./lib/mdi-icons";
import { catColorAt } from "./styles/tokens";
import { fallbackCatColor } from "./lib/cat-colors";
import "./components/kibble-image";
import "./components/kibble-avatar";
import "./components/kibble-label-sheet";
import "./timeline-editor";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };
const DEFAULT_LIMIT = 30;

export class KibbleTimelineCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _sheetSummary: { state: true },
    _sheetSamples: { state: true },
    _sheetSceneSubjects: { state: true },
    _sheetSessionCats: { state: true },
    _sheetMultipleCats: { state: true },
    _sheetSamplesFailed: { state: true },
    _sheetSampleBusyUid: { state: true },
    _sheetGroup: { state: true },
    _sheetTogether: { state: true },
    _sheetBusy: { state: true },
    _sheetError: { state: true },
    _edgeTop: { state: true },
    _edgeBottom: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleTimelineCardConfig | undefined;
  declare _sheetSummary: TimelineEvent | null;
  declare _sheetSamples: EventDetail["samples"] | null;
  declare _sheetSceneSubjects: EventDetail["scene_subjects"];
  declare _sheetSessionCats: EventDetail["cats"] | null;
  declare _sheetMultipleCats: boolean;
  declare _sheetSamplesFailed: boolean;
  declare _sheetSampleBusyUid: string | null;
  declare _sheetGroup: TimelineEvent[];
  declare _sheetTogether: boolean;
  declare _sheetBusy: boolean;
  declare _sheetError: string | null;
  declare _edgeTop: boolean;
  declare _edgeBottom: boolean;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  private _resolvedEntities: HomeAssistant["entities"] | undefined;
  private _resolvedDevices: HomeAssistant["devices"] | undefined;
  private _resolvedDeviceId: string | undefined;
  private _timelineFeed = new TimelineFeed(() => this.requestUpdate());
  private _imageCache = new ImageUrlCache();
  private _catsQuery = new WsQuery<CatsResponse>(() => this.requestUpdate());
  private _catsEntryId: string | undefined;
  private _detailGeneration = 0;
  private _sheetTrigger: HTMLElement | null = null;
  private _sentinelRef = createRef<HTMLDivElement>();
  private _railRef = createRef<HTMLDivElement>();
  private _sentinelObserver: IntersectionObserver | null = null;
  private _observedSentinel: Element | null = null;
  private _observedSentinelCapped: boolean | null = null;
  /** The newest uid already rendered once; only new live rows get the entrance animation. */
  private _newestKnownUid: string | null = null;
  private _animateUids = new Set<string>();
  /** Session answers saved while the sheet is open, reduced to one toast on close. */
  private _sheetReviewedEvents = new Map<string, ReviewedEventLabel>();
  private _sheetPhotoUids = new Set<string>();

  constructor() {
    super();
    this._sheetSummary = null;
    this._sheetSamples = null;
    this._sheetSceneSubjects = [];
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._sheetSamplesFailed = false;
    this._sheetSampleBusyUid = null;
    this._sheetGroup = [];
    this._sheetTogether = false;
    this._sheetBusy = false;
    this._sheetError = null;
    this._edgeTop = false;
    this._edgeBottom = false;
  }

  setConfig(config: KibbleTimelineCardConfig): void {
    if (!config.device_id) {
      throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 6;
  }

  static getStubConfig(hass: HomeAssistant): KibbleTimelineCardConfig {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-timeline-card", device_id: kibbleEntity?.device_id ?? "" };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("kibble-timeline-card-editor");
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._imageCache.dispose();
    this._timelineFeed.dispose();
    this._sentinelObserver?.disconnect();
    this._detailGeneration += 1;
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
    this._timelineFeed.sync(this.hass, this._entryId, this._config?.limit ?? DEFAULT_LIMIT);
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS && this._entryId !== this._catsEntryId) {
      this._catsEntryId = this._entryId;
      const entryId = this._entryId;
      this._catsQuery.sync(entryId, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as CatsResponse));
    }
    this._syncAnimation();
  }

  /** Identifies rows to animate: everything newer than the newest uid we knew about last time,
   * but only once we've actually seen a first list (never animates the initial load). */
  private _syncAnimation(): void {
    const items = this._timelineFeed.state.items;
    if (!items || items.length === 0) return;
    const newest = items[0]!.uid;
    if (newest === this._newestKnownUid) {
      this._animateUids = new Set();
      return;
    }
    const animate = new Set<string>();
    if (this._newestKnownUid !== null) {
      for (const item of items) {
        if (item.uid === this._newestKnownUid) break;
        animate.add(item.uid);
      }
    }
    this._animateUids = animate;
    this._newestKnownUid = newest;
  }

  protected updated(): void {
    this._syncSentinel();
    this._updateEdges();
  }

  /** The load-more sentinel must be observed relative to the rail itself whenever the rail is
   * the one actually scrolling (the default, bounded layout) -- otherwise the 200px preload
   * margin is measured against the viewport, which for a rail that scrolls internally is the
   * wrong box entirely. When `max_height: none` opts back into page scroll, the viewport is
   * once again the right (and only) root. Recreated whenever the sentinel element or which
   * mode applies changes, not just the element. */
  private _syncSentinel(): void {
    const element = this._sentinelRef.value ?? null;
    const capped = railStyle(this._config?.max_height) !== "";
    if (element === this._observedSentinel && capped === this._observedSentinelCapped) return;
    this._sentinelObserver?.disconnect();
    this._observedSentinel = element;
    this._observedSentinelCapped = capped;
    if (!element) {
      this._sentinelObserver = null;
      return;
    }
    this._sentinelObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this._loadOlder();
      },
      { root: capped ? this._railRef.value : null, rootMargin: "200px" },
    );
    this._sentinelObserver.observe(element);
  }

  private _onRailScroll = (): void => {
    this._updateEdges();
  };

  /** Recomputes whether the rail is scrolled away from its top/bottom edge, re-run after every
   * update (paging in older rows, a live push, or a config change all resize the scrollable
   * content) and on every scroll of the rail itself. */
  private _updateEdges(): void {
    const el = this._railRef.value;
    if (!el) {
      if (this._edgeTop || this._edgeBottom) {
        this._edgeTop = false;
        this._edgeBottom = false;
      }
      return;
    }
    const top = el.scrollTop > 2;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight > 2;
    if (top !== this._edgeTop) this._edgeTop = top;
    if (bottom !== this._edgeBottom) this._edgeBottom = bottom;
  }

  private _locale(): string | undefined {
    return this.hass?.locale?.language ?? this.hass?.language;
  }

  private _catColor(name: string | null): string | null {
    if (!name) return null;
    const cat = this._catsQuery.state.data?.cats.find((c) => c.name === name);
    return cat ? catColorAt(cat.color) : fallbackCatColor(name);
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const timelineState = this._timelineFeed.state;
    const groups = groupConsecutive(timelineState.items ?? [], Date.now() / 1000);
    const days = groupByDay(groups, new Date());
    const hasMore = timelineState.hasMore;
    const showEmpty = !timelineState.error && !timelineState.loading && timelineState.items !== null && days.length === 0;

    return html`
      <ha-card>
        <div class="container">
          ${this._config.name ? html`<div class="label">${this._config.name}</div>` : nothing}
          <div class="rail-wrap">
            <div class="rail" style=${railStyle(this._config.max_height)} @scroll=${this._onRailScroll} ${ref(this._railRef)}>
              ${timelineState.error ? this._renderError(timelineState.error) : nothing}
              ${showEmpty ? this._renderEmpty() : nothing}
              ${days.map((day) => this._renderDay(day))}
              ${hasMore ? html`<div class="sentinel" ${ref(this._sentinelRef)}></div>` : nothing}
              ${timelineState.loadingMore ? html`<p class="loading-more">Loading older events…</p>` : nothing}
            </div>
            <div class="edge-fade edge-fade-top ${this._edgeTop ? "visible" : ""}"></div>
            <div class="edge-fade edge-fade-bottom ${this._edgeBottom ? "visible" : ""}"></div>
          </div>
        </div>
      </ha-card>
      <kibble-label-sheet
        ?open=${this._sheetSummary !== null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cats=${this._catsQuery.state.data?.cats ?? []}
        .summary=${this._sheetSummary}
        .samples=${this._sheetSamples}
        .sceneSubjects=${this._sheetSceneSubjects}
        .sessionCats=${this._sheetSessionCats}
        .multipleCats=${this._sheetMultipleCats}
        .samplesFailed=${this._sheetSamplesFailed}
        .group=${this._sheetGroup}
        .groupTogether=${this._sheetTogether}
        .busy=${this._sheetBusy}
        .error=${this._sheetError}
        .sampleBusyUid=${this._sheetSampleBusyUid}
        @close-requested=${this._closeSheet}
        @session-label-requested=${this._onSessionLabelRequested}
        @sample-label-requested=${this._onSampleLabelRequested}
        @event-requested=${this._onEventRequested}
        @samples-retry-requested=${this._onSamplesRetryRequested}
      ></kibble-label-sheet>
    `;
  }

  private _renderEmpty() {
    return html`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`;
  }

  private _renderError(message: string) {
    return html`
      <div class="error">
        <span>Couldn't load the timeline. ${message}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `;
  }

  private _renderDay(day: TimelineDay) {
    return html`
      <div class="day">
        <div class="day-label">${day.label}</div>
        <div class="day-items">${day.groups.map((group) => this._renderRow(group))}</div>
      </div>
    `;
  }

  private _renderRow(group: EventGroup) {
    const event = group.event;
    const together = group.together === true;
    const time = timeLabel(group.start ?? event.start, this._locale());
    const color = together ? "var(--secondary-text-color)" : this._catColor(event.cat) ?? "var(--secondary-text-color)";
    const animate = group.events.some((member) => this._animateUids.has(member.uid));
    return html`
      <div class="row ${animate ? "row-enter" : ""}">
        <time class="time">${time}</time>
        <span class="dot-col"><span class="dot" style="--dot-color:${together ? this._togetherDotStyle(group.events) : color}"></span></span>
        <div class="content">${together ? this._renderTogether(group) : this._renderKnown(group, color)}</div>
      </div>`;
  }

  private _renderTogether(group: EventGroup) {
    const title = togetherTitle(group.events);
    const duration = group.start != null && group.end != null ? spanDuration(group.start, group.end) : null;
    return html`
      <div class="together-heading">
        <button type="button" class="together-open" aria-label=${title} @click=${(event: Event) => this._openSheet(group, event.currentTarget as HTMLElement)}>
          <span class="title together-title">${this._renderTogetherTitle(group.events)}</span>
        </button>
      </div>
      ${duration ? html`<span class="meta">for ${duration}</span>` : nothing}
      ${this._renderTogetherMedia(group)}`;
  }

  private _renderTogetherTitle(events: readonly TimelineEvent[]) {
    const lanes = orderTogetherEvents(events);
    const names = lanes.map((lane) => lane.cat
      ? html`<span class="cat-name" style="color:${this._catColor(lane.cat) ?? "var(--secondary-text-color)"}">${lane.cat}</span>`
      : html`<span class="together-unknown-name">Who?</span>`);
    const joinedNames = html`${names.map((name, index) => html`${index === 0 ? nothing : index === names.length - 1 ? (names.length === 2 ? " and " : ", and ") : ", "}${name}`)}`;
    const first = lanes[0];
    if (first && first.kind !== "feed" && lanes.every((lane) => lane.kind === first.kind && lane.open === first.open)) {
      const verb = first.open ? (first.kind === "eat" ? "are eating" : "are here") : catVerb(first);
      return html`${joinedNames} ${verb}`;
    }
    return html`${lanes.map((lane, index) => html`${index ? ", " : nothing}${names[index]} ${catVerb(lane)}`)}`;
  }
  private _togetherDotStyle(events: readonly TimelineEvent[]): string {
    const lanes = orderTogetherEvents(events);
    if (lanes.length === 0) return "var(--secondary-text-color)";
    const segment = 100 / lanes.length;
    const stops = lanes.map((lane, index) => {
      const color = lane.cat ? this._catColor(lane.cat) ?? "var(--secondary-text-color)" : "var(--secondary-text-color)";
      return `${color} ${index * segment}% ${(index + 1) * segment}%`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }

  private _renderTogetherMedia(group: EventGroup) {
    const events = group.events;
    const compareEvent = events.find((event) => event.kind === "eat" && compareAssets(event) !== null);
    const mediaEvent = events.find((event) => event.kind === "eat" && Boolean(event.clip) && Boolean(event.scene))
      ?? events.find((event) => Boolean(event.scene))
      ?? events.find((event) => event.kind === "eat" && Boolean(event.clip))
      ?? events.find((event) => event.kind === "eat" && Boolean(event.thumb))
      ?? events.find((event) => Boolean(event.thumb))
      ?? group.event;
    const poster = events.find((event) => event.scene)?.scene ?? events.find((event) => event.thumb)?.thumb ?? null;
    const mediaGroup = { ...group, event: mediaEvent };

    if (compareEvent) {
      const compare = compareAssets(compareEvent);
      if (compare) {
        const compareGroup = { ...group, event: compareEvent };
        if (!poster) return html`<div class="media media-eat">${this._renderComparePair(compareGroup, compare, "full")}</div>`;
        return html`
          <div class="media media-eat">
            ${this._renderPhotoButton(mediaGroup, poster, "photo-tile photo-third")}
            ${this._renderComparePair(compareGroup, compare, "third")}
          </div>
        `;
      }
    }
    return html`<div class="media">${this._renderPhotoButton(mediaGroup, poster, "photo-tile photo-visit")}</div>`;
  }

  private _renderKnown(group: EventGroup, color: string) {
    const event = group.event;
    return html`
      ${this._renderTitle(group, color)}
      ${this._renderMeta(event)}
      ${this._renderMedia(group, event)}`;
  }

  private _renderTitle(group: EventGroup, color: string) {
    const event = group.event;
    const titleBody = event.kind === "feed"
      ? html`${feedTitle(event)}`
      : event.cat
        ? html`<span class="cat-name" style="color:${color}">${event.cat}</span> ${catVerb(event)}`
        : html`${event.open ? (event.kind === "eat" ? "Someone is eating" : "Someone is here") : "Who was here?"}`;
    const label = `Review ${eventTitle(event)}, ${timeLabel(event.start, this._locale())}`;
    return html`<button type="button" class="title-open" aria-label=${label} @click=${(click: Event) => this._openSheet(group, click.currentTarget as HTMLElement)}>
      <span class="title-line">
        <span class="title">${titleBody}</span>
        ${event.open ? this._renderLiveRing(color) : nothing}
        ${group.events.length > 1 ? html`<span class="count-badge">${groupCountLabel(event.kind, group.events.length)}</span>` : nothing}
      </span></button>`;
  }

  private _renderLiveRing(color: string) {
    return html`
      <span class="live-badge" style="--dot-color:${color}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `;
  }

  private _renderMeta(event: TimelineEvent) {
    if (event.kind === "feed") return nothing;
    const duration = eventDuration(event);
    return duration ? html`<span class="meta">for ${duration}</span>` : nothing;
  }

  private _renderMedia(group: EventGroup, event: TimelineEvent) {
    const compare = compareAssets(event);
    if (event.kind === "feed") {
      // A feed with no before/after pair is just a text row: a stand-in tile per feed would
      // fill the timeline with identical blocks that carry no information.
      return compare ? this._renderComparePair(group, compare, "full") : nothing;
    }
    const thumbAsset = rowThumbAsset(event);
    if (event.kind === "eat" && compare) {
      // No thumb and no scene: the grey silhouette tile a `_renderPhotoButton` fallback would
      // show here carries no information at all when the before/after pair already shows the
      // cat -- drop it and let the pair take the row's full width instead.
      if (!thumbAsset) {
        return html`<div class="media media-eat">${this._renderComparePair(group, compare, "full")}</div>`;
      }
      return html`
        <div class="media media-eat">
          ${this._renderPhotoButton(group, thumbAsset, "photo-tile photo-third")}
          ${this._renderComparePair(group, compare, "third")}
        </div>
      `;
    }
    return html`<div class="media">${this._renderPhotoButton(group, thumbAsset, "photo-tile photo-visit")}</div>`;
  }

  private _renderPhotoButton(group: EventGroup, asset: TimelineEvent["thumb"], extraClass: string) {
    const event = group.event;
    const hasClip = event.kind === "eat" && Boolean(event.clip);
    const label = `View and correct: ${eventTitle(event)}, ${timeLabel(event.start, this._locale())}${hasClip ? ". Has video." : ""}`;
    return html`
      <button type="button" class="${extraClass}" aria-label=${label} @click=${(e: Event) => this._openSheet(group, e.currentTarget as HTMLElement)}>
        ${asset
          ? html`<kibble-image .hass=${this.hass} .asset=${asset} .cache=${this._imageCache} alt=""></kibble-image>`
          : html`<span class="neutral-icon">${catSilhouette()}</span>`}
        ${hasClip ? html`<span class="clip-badge">${mdiIcon("play")}</span>` : nothing}
      </button>
    `;
  }

  private _renderComparePair(group: EventGroup, compare: { before: TimelineEvent["before"]; after: TimelineEvent["after"] }, size: "third" | "full") {
    const label = `View and correct: ${eventTitle(group.event)}, ${timeLabel(group.event.start, this._locale())}`;
    return html`
      <div class="compare-pair ${size === "full" ? "compare-full" : "compare-third"}">
        <button type="button" class="compare-tile" aria-label=${`${label}. Before.`} @click=${(e: Event) => this._openSheet(group, e.currentTarget as HTMLElement)}>
          ${compare.before ? html`<kibble-image .hass=${this.hass} .asset=${compare.before} .cache=${this._imageCache} alt=""></kibble-image>` : nothing}
          <span class="compare-label">Before</span>
        </button>
        <button type="button" class="compare-tile" aria-label=${`${label}. After.`} @click=${(e: Event) => this._openSheet(group, e.currentTarget as HTMLElement)}>
          ${compare.after ? html`<kibble-image .hass=${this.hass} .asset=${compare.after} .cache=${this._imageCache} alt=""></kibble-image>` : nothing}
          <span class="compare-label">After</span>
        </button>
      </div>
    `;
  }

  private _refreshCats(): void {
    const hass = this.hass;
    const entryId = this._entryId;
    const callWS = hass?.callWS;
    if (!callWS || !entryId) return;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as CatsResponse));
  }

  private _applySheetDetail(detail: EventDetail): void {
    this._sheetSummary = detail.event;
    this._sheetSamples = detail.samples;
    this._sheetSceneSubjects = detail.scene_subjects;
    this._sheetSessionCats = detail.cats;
    this._sheetMultipleCats = detail.multiple_cats;
    this._sheetSamplesFailed = false;
    this.requestUpdate();
  }

  /** Resolves any timeline row uid to its complete feeder session for the shared sheet. */
  private _loadEventDetail(uid: string, keepData = false): void {
    const member = this._sheetGroup.find((candidate) => candidate.uid === uid);
    if (member) this._sheetSummary = member;
    if (!keepData) {
      this._sheetSamples = null;
      this._sheetSceneSubjects = [];
      this._sheetSessionCats = null;
      this._sheetMultipleCats = false;
      this._sheetSamplesFailed = false;
    }
    this._sheetError = null;
    const generation = ++this._detailGeneration;
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) {
      this._sheetSamplesFailed = !keepData;
      return;
    }
    callWS({ type: "kibble/event", entry_id: entryId, uid })
      .then((result) => {
        if (generation !== this._detailGeneration) return;
        this._applySheetDetail(result as EventDetail);
      })
      .catch(() => {
        if (generation !== this._detailGeneration) return;
        if (!keepData) this._sheetSamplesFailed = true;
        this.requestUpdate();
      });
  }

  private _openSheet(group: EventGroup, trigger: HTMLElement): void {
    this._sheetTrigger = trigger;
    this._sheetGroup = group.events;
    this._sheetTogether = group.together === true;
    this._sheetReviewedEvents = new Map();
    this._sheetPhotoUids = new Set();
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._loadEventDetail(group.event.uid);
  }

  private _onEventRequested = (event: CustomEvent<{ uid: string }>): void => {
    this._loadEventDetail(event.detail.uid);
  };

  private _onSamplesRetryRequested = (): void => {
    const uid = this._sheetSummary?.uid;
    if (uid) this._loadEventDetail(uid);
  };

  private _closeSheet = (): void => {
    const message = reviewSummaryMessage({ events: [...this._sheetReviewedEvents.values()], photosUpdated: this._sheetPhotoUids.size }, this._locale());
    this._sheetSummary = null;
    this._sheetSamples = null;
    this._sheetSceneSubjects = [];
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._sheetSamplesFailed = false;
    this._sheetSampleBusyUid = null;
    this._sheetGroup = [];
    this._sheetTogether = false;
    this._sheetError = null;
    this._sheetReviewedEvents = new Map();
    this._sheetPhotoUids = new Set();
    this._sheetTrigger?.focus();
    this._sheetTrigger = null;
    if (message) this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
  };

  /** Saves a whole-session answer and refreshes the row, cats, and sheet from the returned detail. */
  private _onSessionLabelRequested = (event: CustomEvent<SessionLabelRequest & { closeOnSuccess?: boolean; pendingLabel?: string }>): void => {
    const entryId = this._entryId;
    const hass = this.hass;
    if (!entryId || !hass?.callWS) return;
    const { uid, cats, verdict, subjects, closeOnSuccess } = event.detail;
    const request: SessionLabelRequest = { uid, ...(cats ? { cats } : {}), ...(verdict ? { verdict } : {}), ...(subjects?.length ? { subjects } : {}) };
    this._sheetBusy = true;
    this._sheetError = null;
    labelSession(hass, entryId, request)
      .then((detail) => {
        this._sheetBusy = false;
        this._applySheetDetail(detail);
        this._timelineFeed.refresh(hass, entryId, this._config?.limit ?? DEFAULT_LIMIT);
        this._refreshCats();
        for (const key of this._sheetReviewedEvents.keys()) {
          if (key === detail.event.uid || key.startsWith(detail.event.uid + ":")) this._sheetReviewedEvents.delete(key);
        }
        if (request.verdict) {
          this._sheetReviewedEvents.set(detail.event.uid, { uid: detail.event.uid, event: detail.event, label: request.verdict });
        } else {
          for (const cat of request.cats ?? []) {
            const uid = detail.event.uid + ":" + cat.cat;
            this._sheetReviewedEvents.set(uid, { uid, event: { kind: cat.ate ? "eat" : "visit", open: detail.event.open, start: detail.event.start }, label: cat.cat });
          }
        }
        if (closeOnSuccess) this._closeSheet();
        else this.requestUpdate();
      })
      .catch((err: unknown) => {
        this._sheetBusy = false;
        this._sheetError = err instanceof Error ? err.message : "Couldn't save this label.";
        this.requestUpdate();
      });
  };

  private _onSampleLabelRequested = (event: CustomEvent<{ sampleUid: string; label: string }>): void => {
    const entryId = this._entryId;
    const hass = this.hass;
    if (!entryId || !hass?.callWS) return;
    const { sampleUid, label } = event.detail;
    this._sheetSampleBusyUid = sampleUid;
    this._sheetError = null;
    labelSample(hass, entryId, { sampleUid, label })
      .then((sample) => {
        this._sheetSampleBusyUid = null;
        if (this._sheetSamples) this._sheetSamples = this._sheetSamples.map((item) => item.uid === sample.uid ? sample : item);
        this._sheetPhotoUids.add(sampleUid);
        const uid = this._sheetSummary?.uid;
        if (uid) this._loadEventDetail(uid, true);
        this.requestUpdate();
      })
      .catch((err: unknown) => {
        this._sheetSampleBusyUid = null;
        this._sheetError = err instanceof Error ? err.message : "Couldn't save this label.";
        this.requestUpdate();
      });
  };

  private _loadOlder = (): void => {
    this._timelineFeed.loadMore(this.hass, this._entryId, this._config?.limit ?? DEFAULT_LIMIT);
  };

  private _retryTimeline = (): void => {
    this._timelineFeed.refresh(this.hass, this._entryId, this._config?.limit ?? DEFAULT_LIMIT);
  };

  static styles = css`
    :host {
      display: block;
      --kibble-text-caption: 13px;
      --kibble-text-body: 15px;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      padding: 4px 0 12px;
    }
    .label {
      padding: 12px 16px 0;
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      padding: 24px 16px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 8px 16px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button {
      flex: 0 0 auto;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .error button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    /* The rail scrolls inside itself by default -- railStyle's own inline max-height (a real
       bounded cap unless a caller opts out with max_height: none) is what actually turns this
       into a scroll container; overflow/scrollbar rules here just style that container once it
       is one. */
    .rail-wrap {
      position: relative;
    }
    .rail {
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color) transparent;
    }
    .rail::-webkit-scrollbar {
      width: 6px;
    }
    .rail::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 3px;
    }
    /* A soft hint that there is more above/below than the current scroll position shows --
       never blocks a tap (pointer-events: none), never fights the sticky day heading for
       attention (same background colour, so the seam between them is invisible). */
    .edge-fade {
      position: absolute;
      left: 0;
      right: 0;
      height: 28px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .edge-fade-top {
      top: 0;
      background: linear-gradient(to bottom, var(--ha-card-background, var(--card-background-color, #fff)), transparent);
    }
    .edge-fade-bottom {
      bottom: 0;
      background: linear-gradient(to top, var(--ha-card-background, var(--card-background-color, #fff)), transparent);
    }
    .edge-fade.visible {
      opacity: 1;
    }
    .day-label {
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      padding: 18px 16px 8px 96px;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .day-items {
      position: relative;
      margin-left: 96px;
      border-left: 2px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 2px 0;
    }
    .row {
      position: relative;
      padding: 0 16px 0 22px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .row-enter {
        animation: kibble-row-enter 420ms cubic-bezier(0.2, 0.7, 0.3, 1);
      }
    }
    @keyframes kibble-row-enter {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .time {
      position: absolute;
      left: -96px;
      width: 80px;
      padding-top: 2px;
      text-align: right;
      font-size: var(--kibble-text-caption);
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .dot-col {
      position: absolute;
      left: -7px;
      top: 6px;
    }
    .dot {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--dot-color);
      box-shadow: 0 0 0 3px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    /* The title and Review chip keep 48 px touch targets, but the negative block margin lets the
     * visible text sit exactly where a normal row's title does (top-aligned with its time). */
    .together-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      margin-block: -14px;
    }
    .together-open {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      gap: 8px;
      min-width: 0;
      min-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .title-open {
      display: block;
      width: 100%;
      border: 0;
      margin: 0;
      padding: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
    }
    .title-open:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .title-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .cat-name {
      font-weight: 700;
    }
    .count-badge {
      font-size: var(--kibble-text-caption);
      font-weight: 500;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 999px;
      padding: 2px 10px;
    }
    .meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .live-badge {
      position: relative;
      width: 12px;
      height: 12px;
      flex: none;
    }
    .live-core {
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: var(--dot-color);
    }
    .live-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid var(--dot-color);
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .live-pulse {
        animation: kibble-pulse-ring 1.8s ease-out infinite;
      }
    }
    @keyframes kibble-pulse-ring {
      0% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .media {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      padding-bottom: 14px;
    }
    .media-eat {
      align-items: stretch;
    }
    .photo-tile {
      position: relative;
      flex: none;
      padding: 0;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clip-badge {
      position: absolute;
      left: 4px;
      bottom: 4px;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 14px;
      pointer-events: none;
    }
    span.photo-tile {
      cursor: default;
    }
    .photo-visit {
      width: 78px;
      height: 78px;
    }
    .photo-third {
      width: 30%;
      max-width: 120px;
      aspect-ratio: 1;
    }
    .photo-unknown {
      width: 100px;
      height: 100px;
    }
    .neutral-icon {
      width: 60%;
      height: 60%;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .compare-pair {
      display: flex;
      gap: 8px;
      min-width: 0;
    }
    .compare-third {
      flex: 1 1 auto;
    }
    .compare-full {
      flex: 1 1 auto;
      width: 100%;
    }
    .compare-tile {
      position: relative;
      flex: 1 1 0;
      height: 130px;
      padding: 0;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
    }
    .compare-full .compare-tile {
      height: 150px;
    }
    .compare-tile kibble-image {
      width: 100%;
      height: 100%;
    }
    .compare-label {
      position: absolute;
      left: 8px;
      bottom: 8px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
    }
    .photo-tile:focus-visible,
    .compare-tile:focus-visible,
    .chip:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
      padding-bottom: 14px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border: none;
      border-radius: 999px;
      background: color-mix(in srgb, var(--dot-color, var(--primary-color)) 16%, transparent);
      color: var(--dot-color, var(--primary-color, #03a9f4));
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      padding: 7px 16px 7px 10px;
      min-height: 38px;
      cursor: pointer;
    }
    .chip-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--dot-color);
      flex: none;
    }
    .chip.chip-muted {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      color: var(--secondary-text-color);
      font-weight: 500;
      padding: 7px 16px;
    }
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .row-error {
      display: block;
      padding-bottom: 12px;
      font-size: var(--kibble-text-caption);
      color: var(--error-color, #db4437);
    }
    .sentinel {
      height: 1px;
      width: 100%;
    }
    .loading-more {
      margin: 0;
      padding: 10px 16px 2px;
      text-align: center;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    @container (max-width: 380px) {
      .day-label {
        padding-left: 74px;
      }
      .day-items {
        margin-left: 74px;
      }
      .row {
        padding-left: 18px;
      }
      .time {
        left: -74px;
        width: 60px;
      }
      .photo-third {
        max-width: 92px;
      }
      .compare-tile {
        height: 108px;
      }
    }
  `;
}

customElements.define("kibble-timeline-card", KibbleTimelineCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-timeline-card",
  name: "Kibble Timeline",
  description: "Today's feeds and who's been by, one calm list, newest first, with real photos.",
  preview: true,
});

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
  interface HTMLElementTagNameMap {
    "kibble-timeline-card": KibbleTimelineCard;
  }
}
