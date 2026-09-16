/** The feeder's activity as one rail: detections and feed cycles merged server-side and grouped
 * by day, newest first. A list with a thin time rail, not stacked cards -- DESIGN.md's timeline
 * is a real sequence, so a day separator carries the "01/02/03" job a numbered marker would
 * elsewhere. See README.md and DESIGN.md for the full design rationale.
 */

import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import type {
  HomeAssistant,
  KibbleCatSummary,
  KibbleTimelineCardConfig,
  TimelineDetectionItem,
  TimelineFeedItem,
  TimelineItem,
} from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { WsQuery, watchKey } from "./lib/ws-query";
import { ImageUrlCache, kibbleImageUrl } from "./lib/image-cache";
import { detectionVerb, feedSummary, groupByDay, type TimelineDay } from "./lib/timeline";
import "./components/kibble-avatar";
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
  };

  declare hass: HomeAssistant;
  declare _config: KibbleTimelineCardConfig | undefined;
  declare _visibleCount: number;
  declare _lightboxUrl: string | null;
  declare _lightboxAlt: string;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  private _timelineQuery = new WsQuery<{ items: TimelineItem[] }>(() => this.requestUpdate());
  private _catsQuery = new WsQuery<{ cats: KibbleCatSummary[] }>(() => this.requestUpdate());
  private _imageCache = new ImageUrlCache();
  private _lightboxTrigger: HTMLElement | null = null;

  constructor() {
    super();
    this._visibleCount = DEFAULT_LIMIT;
    this._lightboxUrl = null;
    this._lightboxAlt = "";
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

  protected willUpdate(changed: PropertyValues): void {
    if ((changed.has("hass") || changed.has("_config")) && this._config?.device_id && this.hass) {
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, this._config.device_id);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, this._config.device_id);
    }
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      const key = watchKey(this.hass, [this._entities.lastDetection, this._entities.feeding, this._entities.dishAfter]);
      this._timelineQuery.sync(key, () => callWS({ type: "kibble/timeline", entry_id: entryId }).then((r) => r as { items: TimelineItem[] }));
      this._catsQuery.sync(key, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as { cats: KibbleCatSummary[] }));
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const timelineState = this._timelineQuery.state;
    const catsByName = new Map((this._catsQuery.state.data?.cats ?? []).map((cat) => [cat.name, cat] as const));
    const items = timelineState.data?.items ?? [];
    const visible = items.slice(0, this._visibleCount);
    const days = groupByDay(visible, new Date());
    const hasMore = items.length > visible.length;
    const showEmpty = !timelineState.error && !timelineState.loading && timelineState.data !== null && days.length === 0;

    return html`
      <ha-card>
        <div class="container">
          ${this._config.name ? html`<div class="label">${this._config.name}</div>` : nothing}
          <div class="rail">
            ${timelineState.error ? this._renderError(timelineState.error) : nothing}
            ${showEmpty ? this._renderEmpty() : nothing}
            ${days.map((day) => this._renderDay(day, catsByName))}
            ${hasMore ? html`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>` : nothing}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl !== null}
        .imageUrl=${this._lightboxUrl}
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

  private _renderDay(day: TimelineDay, catsByName: Map<string, KibbleCatSummary>) {
    return html`
      <div class="day">
        <div class="day-label">${day.label}</div>
        <div class="day-items">
          ${day.items.map((item) => (item.kind === "detection" ? this._renderDetection(item, catsByName) : this._renderFeed(item)))}
        </div>
      </div>
    `;
  }

  private _renderDetection(item: TimelineDetectionItem, catsByName: Map<string, KibbleCatSummary>) {
    const cat = item.cat ? catsByName.get(item.cat) : undefined;
    const time = this._timeLabel(item.ts);
    const who = item.cat ?? "a cat";
    return html`
      <div class="row">
        <span class="time">${time}</span>
        <kibble-avatar
          class="row-avatar"
          .hass=${this.hass}
          .name=${item.cat}
          .colorIndex=${cat?.color_index ?? null}
          .entryId=${this._entryId}
          .sampleName=${cat?.avatar ?? null}
        ></kibble-avatar>
        <span class="row-text">${who} ${detectionVerb(item.class)}</span>
        ${item.image && this._entryId ? this._renderThumb(kibbleImageUrl(this._entryId, "event", item.image), `${who}, ${time}`) : nothing}
      </div>
    `;
  }

  private _renderFeed(item: TimelineFeedItem) {
    const time = this._timeLabel(item.ts);
    const entryId = this._entryId;
    return html`
      <div class="row row-feed">
        <span class="time">${time}</span>
        <span class="row-text feed-text">${feedSummary(item)}</span>
        <div class="feed-thumbs">
          ${item.before && entryId ? this._renderThumb(kibbleImageUrl(entryId, "feed", item.before), `Bowl before the ${time} feed`) : nothing}
          ${item.after && entryId ? this._renderThumb(kibbleImageUrl(entryId, "feed", item.after), `Bowl after the ${time} feed`) : nothing}
        </div>
      </div>
    `;
  }

  private _renderThumb(path: string, alt: string) {
    const url = this._imageCache.get(this.hass, path, () => this.requestUpdate());
    return html`
      <button type="button" class="thumb" ?disabled=${!url} aria-label=${`View photo: ${alt}`} @click=${(event: Event) => this._openLightbox(event, url, alt)}>
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
    this._timelineQuery.refresh(() => callWS({ type: "kibble/timeline", entry_id: entryId }).then((r) => r as { items: TimelineItem[] }));
  };

  private _openLightbox(event: Event, url: string | null, alt: string): void {
    if (!url) return;
    this._lightboxTrigger = event.currentTarget as HTMLElement;
    this._lightboxUrl = url;
    this._lightboxAlt = alt;
  }

  private _closeLightbox = (): void => {
    this._lightboxUrl = null;
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
    .day-label {
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
    .row-avatar {
      --kibble-avatar-size: 28px;
      flex: 0 0 auto;
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
    }
    .feed-text {
      font-weight: 500;
    }
    .feed-thumbs {
      display: flex;
      gap: 4px;
      flex: 0 0 auto;
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
  description: "Today's feeds and visits as one rail, newest first, with day separators and photos.",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "kibble-timeline-card": KibbleTimelineCard;
  }
}
