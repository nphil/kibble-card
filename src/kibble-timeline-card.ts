/** The feeder's activity as one rail: identifications, feed cycles and (opt-in) bare visits
 * merged server-side and grouped by day, newest first. A list with a thin time rail, not
 * stacked cards -- DESIGN.md's timeline is a real sequence, so a day separator carries the
 * "01/02/03" job a numbered marker would elsewhere. See README.md and DESIGN.md for the full
 * design rationale.
 */

import { LitElement, css, html, nothing } from "lit";
import type {
  HomeAssistant,
  KibbleTimelineCardConfig,
  TimelineEatItem,
  TimelineFeedItem,
  TimelineIdentifiedItem,
  TimelineItem,
  TimelineVisitItem,
} from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { WsQuery, watchKey } from "./lib/ws-query";
import { ImageUrlCache, kibbleImageUrl } from "./lib/image-cache";
import { comparePairFor, detectionHeadline, feedPhotos, feedSummary, filterVisits, groupByDay, railStyle, resolveThumbnail, type ComparePairRefs, type TimelineDay } from "./lib/timeline";
import "./components/kibble-before-after";
import "./components/kibble-lightbox";
import "./timeline-editor";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };
const DEFAULT_LIMIT = 30;

export class KibbleTimelineCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _visibleCount: { state: true },
    _lightboxUrl: { state: true },
    _lightboxAlt: { state: true },
    _comparePair: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleTimelineCardConfig | undefined;
  declare _visibleCount: number;
  declare _lightboxUrl: string | null;
  declare _lightboxAlt: string;
  /** Set instead of `_lightboxUrl` when a row's compare pair (not a plain single image) was
   * tapped -- see `_openComparePair`/`_renderThumb`. `entryId` travels with it since a row's
   * `_entryId` could in principle change between the tap and the next render. */
  declare _comparePair: { entryId: string; before: string | null; after: string | null } | null;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  // See `kibble-card.ts`'s identical fields: avoids recomputing entity-role resolution on
  // every `hass` tick (which is most of them, system-wide) when the registries didn't move.
  private _resolvedEntities: HomeAssistant["entities"] | undefined;
  private _resolvedDevices: HomeAssistant["devices"] | undefined;
  private _resolvedDeviceId: string | undefined;
  private _timelineQuery = new WsQuery<{ items: TimelineItem[] }>(() => this.requestUpdate());
  private _imageCache = new ImageUrlCache();
  private _lightboxTrigger: HTMLElement | null = null;

  constructor() {
    super();
    this._visibleCount = DEFAULT_LIMIT;
    this._lightboxUrl = null;
    this._lightboxAlt = "";
    this._comparePair = null;
  }

  setConfig(config: KibbleTimelineCardConfig): void {
    if (!config.device_id) {
      throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
    this._visibleCount = config.limit ?? DEFAULT_LIMIT;
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
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      const includeVisits = this._config?.show_visits === true;
      const key = `${watchKey(this.hass, [this._entities.lastDetection, this._entities.feeding, this._entities.dishAfter])}|visits=${includeVisits}`;
      this._timelineQuery.sync(key, () =>
        callWS({ type: "kibble/timeline", entry_id: entryId, include_visits: includeVisits }).then((r) => r as { items: TimelineItem[] }),
      );
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const timelineState = this._timelineQuery.state;
    const items = filterVisits(timelineState.data?.items ?? [], this._config.show_visits === true);
    const visible = items.slice(0, this._visibleCount);
    const days = groupByDay(visible, new Date());
    const hasMore = items.length > visible.length;
    const showEmpty = !timelineState.error && !timelineState.loading && timelineState.data !== null && days.length === 0;

    const compare = this._comparePair;
    const compareBeforeUrl = compare?.before ? this._imageCache.get(this.hass, kibbleImageUrl(compare.entryId, "event", compare.before), () => this.requestUpdate()) : null;
    const compareAfterUrl = compare?.after ? this._imageCache.get(this.hass, kibbleImageUrl(compare.entryId, "event", compare.after), () => this.requestUpdate()) : null;

    return html`
      <ha-card>
        <div class="container">
          ${this._config.name ? html`<div class="label">${this._config.name}</div>` : nothing}
          <div class="rail" style=${railStyle(this._config.max_height)}>
            ${timelineState.error ? this._renderError(timelineState.error) : nothing}
            ${showEmpty ? this._renderEmpty() : nothing}
            ${days.map((day) => this._renderDay(day))}
            ${hasMore ? html`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>` : nothing}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl !== null || compare !== null}
        .imageUrl=${this._lightboxUrl}
        .beforeUrl=${compareBeforeUrl}
        .afterUrl=${compareAfterUrl}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
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
        <div class="day-items">${day.items.map((item) => this._renderItem(item))}</div>
      </div>
    `;
  }

  private _renderItem(item: TimelineItem) {
    if (item.kind === "identified") return this._renderIdentified(item);
    if (item.kind === "eat") return this._renderEat(item);
    if (item.kind === "visit") return this._renderVisit(item);
    return this._renderFeed(item);
  }

  /** The named cat that was actually at the bowl -- no avatar (the name is already the first
   * word of the sentence) and the *live* image from the paired eat/visit, never a stored
   * training sample. */
  private _renderIdentified(item: TimelineIdentifiedItem) {
    const time = this._timeLabel(item.ts);
    const pair = comparePairFor(item);
    const thumb = resolveThumbnail(item.image, item.image_kind, pair);
    const alt = `${item.cat}, ${time}`;
    return html`
      <div class="row">
        <span class="time">${time}</span>
        <span class="row-text">${detectionHeadline(item)}</span>
        ${pair ? this._renderBowlPair(pair, alt) : nothing}
        ${thumb && this._entryId && !(pair && thumb.name === (pair.after ?? pair.before))
          ? this._renderThumb(kibbleImageUrl(this._entryId, thumb.kind, thumb.name), alt, pair ? (event) => this._openComparePair(event, pair, alt) : undefined)
          : nothing}
      </div>
    `;
  }

  /** An "eat" with nobody identified nearby -- still worth a row (food left the bowl), just
   * never a guessed name. */
  private _renderEat(item: TimelineEatItem) {
    const time = this._timeLabel(item.ts);
    const pair = comparePairFor(item);
    const thumb = resolveThumbnail(item.image, "event", pair);
    const alt = `A cat, ${time}`;
    return html`
      <div class="row">
        <span class="time">${time}</span>
        <span class="row-text">${detectionHeadline(item)}</span>
        ${pair ? this._renderBowlPair(pair, alt) : nothing}
        ${thumb && this._entryId && !(pair && thumb.name === (pair.after ?? pair.before))
          ? this._renderThumb(kibbleImageUrl(this._entryId, thumb.kind, thumb.name), alt, pair ? (event) => this._openComparePair(event, pair, alt) : undefined)
          : nothing}
      </div>
    `;
  }

  /** Only ever rendered when `show_visits` opts back into the noise this card hides by
   * default -- see `lib/timeline.ts#filterVisits`. */
  private _renderVisit(item: TimelineVisitItem) {
    const time = this._timeLabel(item.ts);
    return html`
      <div class="row">
        <span class="time">${time}</span>
        <span class="row-text">${detectionHeadline(item)}</span>
        ${item.image && this._entryId ? this._renderThumb(kibbleImageUrl(this._entryId, "event", item.image), `A cat, ${time}`) : nothing}
      </div>
    `;
  }

  private _renderFeed(item: TimelineFeedItem) {
    const time = this._timeLabel(item.ts);
    const entryId = this._entryId;
    const summary = feedSummary(item);
    // The device's own before/after dish pair, resolved the same way every other row's photo
    // is (an authenticated fetch through the shared object-URL cache) -- see `feedPhotos`'s
    // doc comment for why a feed cycle that captured neither photo renders honest text below
    // instead of an empty `kibble-before-after` tile.
    const pair = feedPhotos(item);
    const beforeUrl = pair?.before && entryId ? this._imageCache.get(this.hass, kibbleImageUrl(entryId, "feed", pair.before), () => this.requestUpdate()) : null;
    const afterUrl = pair?.after && entryId ? this._imageCache.get(this.hass, kibbleImageUrl(entryId, "feed", pair.after), () => this.requestUpdate()) : null;
    return html`
      <div class="row row-feed">
        <span class="time">${time}</span>
        <span class="row-text feed-text">
          ${summary.headline}${summary.scheduled ? html` <span class="quiet">(scheduled)</span>` : nothing}${summary.unconfirmed
            ? html` <span class="quiet" title="The feeder dispensed, but its controller never confirmed the amount -- this is the amount that was requested.">(unconfirmed)</span>`
            : nothing}
        </span>
        ${pair
          ? html`<kibble-before-after class="feed-compare" .beforeSrc=${beforeUrl} .afterSrc=${afterUrl} aspect="2.6"></kibble-before-after>`
          : html`<span class="feed-no-photo">No photo for this feed</span>`}
      </div>
    `;
  }

  /** The dish before and after a meal, shown side by side on the row itself.
   *
   * These used to be reachable only by tapping the row's single thumbnail, which opened a
   * compare lightbox. The owner's reaction to the first meal that had them (2026-09-20,
   * Kitty at 01:51) was that the timeline showed no bowl photos at all -- correctly, because
   * a face crop won the one thumbnail slot and nothing hinted that anything was behind it.
   * An affordance nobody can see is not an affordance. Both halves are on the row now, and
   * tapping either still opens the full-size compare.
   *
   * Rendered only where `comparePairFor` found something; a half that was never captured is
   * simply absent rather than a broken frame. */
  private _renderBowlPair(pair: ComparePairRefs, alt: string) {
    if (!this._entryId) return nothing;
    const entryId = this._entryId;
    const open = (event: Event) => this._openComparePair(event, pair, alt);
    const half = (name: string | null, which: string) =>
      name ? this._renderThumb(kibbleImageUrl(entryId, "event", name), `${which}: ${alt}`, open, "bowl-half") : nothing;
    return html`<span class="bowl-pair" title="Bowl before and after">${half(pair.before, "Before")}${half(pair.after, "After")}</span>`;
  }

  private _renderThumb(path: string, alt: string, onOpen?: (event: Event) => void, extraClass = "") {
    const url = this._imageCache.get(this.hass, path, () => this.requestUpdate());
    const label = onOpen ? `Compare before and after: ${alt}` : `View photo: ${alt}`;
    return html`
      <button type="button" class="thumb ${extraClass}" ?disabled=${!url} aria-label=${label} @click=${(event: Event) => (onOpen ? onOpen(event) : this._openLightbox(event, url, alt))}>
        ${url ? html`<img src=${url} alt="" loading="lazy" />` : nothing}
      </button>
    `;
  }

  private _timeLabel(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  private _showMore = (): void => {
    this._visibleCount += this._config?.limit ?? DEFAULT_LIMIT;
  };

  private _retryTimeline = (): void => {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    const includeVisits = this._config?.show_visits === true;
    this._timelineQuery.refresh(() =>
      callWS({ type: "kibble/timeline", entry_id: entryId, include_visits: includeVisits }).then((r) => r as { items: TimelineItem[] }),
    );
  };

  private _openLightbox(event: Event, url: string | null, alt: string): void {
    if (!url) return;
    this._lightboxTrigger = event.currentTarget as HTMLElement;
    this._lightboxUrl = url;
    this._lightboxAlt = alt;
  }

  /** Opens the same overlay `_openLightbox` uses, but with a before/after compare pair instead
   * of a single image -- see `kibble-lightbox`'s `beforeUrl`/`afterUrl`. */
  private _openComparePair(event: Event, pair: ComparePairRefs, alt: string): void {
    if (!this._entryId) return;
    this._lightboxTrigger = event.currentTarget as HTMLElement;
    this._comparePair = { entryId: this._entryId, before: pair.before, after: pair.after };
    this._lightboxAlt = alt;
  }

  private _closeLightbox = (): void => {
    this._lightboxUrl = null;
    this._comparePair = null;
    this._lightboxTrigger?.focus();
    this._lightboxTrigger = null;
  };

  static styles = css`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
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
    /* The rail scrolls inside the card rather than lengthening the page -- see
       KibbleTimelineCardConfig.max_height. overscroll-behavior stops a flick at the end of
       the list from scrolling the dashboard behind it, which on a phone is the difference
       between a contained list and an annoying one. */
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
    .day-label {
      /* Sticky so the date stays visible while its own rows scroll past: in a bounded rail
         you can otherwise be three meals deep with no idea which day you are reading. */
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      padding: 14px 16px 6px 68px;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .day-items {
      margin-left: 60px;
      border-left: 2px solid var(--divider-color);
      display: flex;
      flex-direction: column;
    }
    .row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 6px 16px 6px 12px;
    }
    .time {
      position: absolute;
      left: -60px;
      width: 48px;
      text-align: right;
      font-size: var(--kibble-text-caption);
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .row-text {
      flex: 1 1 auto;
      min-width: 0;
      font-size: var(--kibble-text-body);
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row-feed {
      min-height: 56px;
      flex-wrap: wrap;
      align-items: flex-start;
    }
    .feed-text {
      font-weight: 500;
    }
    /* Capped so a feed row stays the same scale as every other row. At aspect 1.8 and full
       width the tile stood ~250 px tall on a desktop dashboard, four times a meal row, which
       made a routine dispense the loudest thing in the list. */
    .feed-compare {
      flex: 0 1 auto;
      width: min(280px, 45%);
      max-width: 280px;
    }
    .feed-no-photo {
      flex: 1 1 100%;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .quiet {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .bowl-pair {
      display: inline-flex;
      gap: 3px;
      flex: 0 0 auto;
    }
    /* Slightly smaller than the single thumbnail: two of them sit where one used to, so the
       row keeps its height on a phone rather than growing for every meal. */
    .thumb.bowl-half {
      width: 34px;
      height: 34px;
    }
    .thumb {
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
      overflow: hidden;
    }
    .thumb:disabled {
      cursor: default;
    }
    .thumb:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .thumb img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .show-more {
      align-self: flex-start;
      margin: 12px 16px 0 68px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 8px 14px;
      font: inherit;
      font-size: var(--kibble-text-body);
      font-weight: 500;
      cursor: pointer;
      min-height: 40px;
    }
    .show-more:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @container (max-width: 360px) {
      .day-label {
        padding-left: 52px;
      }
      .day-items {
        margin-left: 44px;
      }
      .time {
        left: -44px;
        width: 36px;
        font-size: 11px;
      }
      .row {
        padding-right: 10px;
      }
    }
  `;
}

customElements.define("kibble-timeline-card", KibbleTimelineCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-timeline-card",
  name: "Kibble Timeline",
  description: "Today's feeds and who's been by, one rail, newest first, with day separators and photos.",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "kibble-timeline-card": KibbleTimelineCard;
  }
}
