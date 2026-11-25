/** The event sheet shared by the timeline and cats cards. It shows what happened (the title, the
 * scene with its labeled animals, any clip) and the event's photos. Naming happens one photo at a
 * time: a tap opens the viewer, where that photo gets its answer, so the visit itself is read-only
 * here. The one question the sheet asks on its own is "Who ate?", for a meal two cats were at.
 * Answers are reported to the host card, which owns the outbox and every Home Assistant call.
 *
 * `summary` is available as soon as a row is tapped; `kibble/event` fills in the full photo and
 * subject lists after opening. Grouped timeline rows keep their compact pager, but every page is
 * still a whole feeder session. */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { CatSummary, HomeAssistant, Sample, SceneSubject, SessionCat, TimelineEvent } from "../types";
import { AssetRef, type ImageUrlCache } from "../lib/image-cache";
import { eventDuration, feedTitle, timeLabel } from "../lib/timeline";
import { groupSessionPhotos, sessionTitle } from "../lib/session-label";
import { photoTag } from "../lib/photo-answers";
import type { AteQuestion } from "../lib/who-ate";
import { boxInCrop, type OverlayBox } from "../lib/boxes";
import { mdiIcon } from "../lib/mdi-icons";
import { clipSeekOffsetSeconds } from "../lib/clip-offset";
import { catColorAt } from "../styles/tokens";
import { fallbackCatColor } from "../lib/cat-colors";
import { catSilhouette } from "../lib/brand-shapes";
import "./kibble-image";
import "./kibble-avatar";
import "./kibble-before-after";
import "./kibble-box-overlay";
import "./kibble-photo-viewer";
import "./kibble-who-ate";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// HA's own `auth/sign_path` -- long enough that a signed clip URL kept open in a background
// tab (or a slow LAN download of a multi-minute clip) does not expire mid-playback.
const CLIP_SIGN_EXPIRES_S = 3600;

// Scene / before / after JPEGs are 576x360 on the real feeder -- 16:10. The media stage's box
// is fixed at this ratio regardless of what is showing inside it (a clip's own 16:9 is simply
// `object-fit: contain`ed into the same box) so playing a clip never resizes the box around it.
const MEDIA_ASPECT = 1.6;

const PHOTOS_VISIBLE_CAP = 12;
const PHOTO_SKELETON_COUNT = 6;
const BOXES_STORAGE_KEY = "kibble:show-boxes";
const BOXES_CHANGE_EVENT = "kibble-boxes-visibility-changed";

function readBoxesVisible(): boolean {
  try {
    return localStorage.getItem(BOXES_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}


export class KibbleLabelSheet extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    entryId: { type: String },
    cache: { attribute: false },
    cats: { attribute: false },
    summary: { attribute: false },
    samples: { attribute: false },
    sceneSubjects: { attribute: false },
    sessionCats: { attribute: false },
    samplesFailed: { type: Boolean },
    group: { attribute: false },
    groupTogether: { type: Boolean },
    _photosExpanded: { state: true },
    _viewerIndex: { state: true },
    _zoom: { state: true },
    _clipSrc: { state: true },
    _clipError: { state: true },
    _showBoxes: { state: true },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  declare cache: ImageUrlCache | undefined;
  declare cats: CatSummary[];
  /** The event as known from the list that was tapped -- always present while `open`. */
  declare summary: TimelineEvent | null;
  /** `null` while `kibble/event`'s fetch is still in flight, or if it failed. */
  declare samples: Sample[] | null;
  /** True once the parent gives up trying to load `samples` -- distinct from "still loading" so
   * the sheet shows a Retry action instead of claiming to still be working on it. */
  declare samplesFailed: boolean;
  /** The tapped row's own collapsed members, newest first -- one element for an ungrouped row
   * or the cats card. `summary.uid`'s position in this array drives the header pager. */
  declare group: TimelineEvent[];
  declare groupTogether: boolean;
  declare sceneSubjects: SceneSubject[];
  declare sessionCats: SessionCat[] | null;
  declare _showBoxes: boolean;

  /** Whether the photo grid shows every sample or just the first dozen behind a "+N" tile. */
  private _photosExpanded = false;
  /** Which sample index the photo viewer is open on, or `null`. */
  private _viewerIndex: number | null = null;
  /** The scene photo shown full screen, or `null`. */
  private _zoom: Sample["body"] = null;
  /** The event a photos-grid/viewer/zoom UI state was last built for -- resets all of it the
   * moment a *different* event's sheet opens (a fresh open, or the pager), so nothing stale
   * carries over. */
  private _lastEventUid: string | null = null;
  private readonly _beforeRef = new AssetRef();
  private readonly _afterRef = new AssetRef();
  private readonly _sceneRef = new AssetRef();
  private _closeButtonRef = createRef<HTMLButtonElement>();
  private _videoRef = createRef<HTMLVideoElement>();
  /** The signed clip URL once the user tapped play, or `null` for the photo/poster state. */
  private _clipSrc: string | null = null;
  /** Set when the `<video>` itself errors (a 404: the clip aged out of Scrypted's own quota
   * after it was linked) -- reverts quietly to the photo and hides the play button, per
   * `docs/39-eating-clips.md`, rather than showing a broken player. */
  private _clipError = false;
  /** The event `_clipSrc`/`_clipError` belong to -- resets both the moment the sheet closes or
   * shows a different event, so a later re-open of the SAME event always starts back at the
   * poster, never resumes mid-playback. */
  private _clipEventUid: string | null = null;

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (this._viewerIndex !== null) return; // the photo viewer owns Escape/Tab while it is open
    if (event.key === "Escape") {
      event.preventDefault();
      if (this._zoom) this._zoom = null;
      else this._close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...this.renderRoot.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
    if (focusable.length === 0) {
      event.preventDefault();
      this._closeButtonRef.value?.focus();
      return;
    }
    const active = this.renderRoot.querySelector<HTMLElement>(":focus");
    const currentIndex = active ? focusable.indexOf(active) : -1;
    const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
      event.preventDefault();
      (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
    }
  };

  constructor() {
    super();
    this.open = false;
    this.cats = [];
    this.summary = null;
    this.samples = null;
    this.samplesFailed = false;
    this.group = [];
    this.groupTogether = false;
    this.sceneSubjects = [];
    this.sessionCats = null;
    this._showBoxes = readBoxesVisible();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
    window.addEventListener(BOXES_CHANGE_EVENT, this._onSharedBoxesChange);
    window.addEventListener("storage", this._onStorage);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    window.removeEventListener(BOXES_CHANGE_EVENT, this._onSharedBoxesChange);
    window.removeEventListener("storage", this._onStorage);
    this._beforeRef.dispose();
    this._afterRef.dispose();
    this._sceneRef.dispose();
    this._stopClipPlayback();
  }
  private _onSharedBoxesChange = (event: Event): void => {
    const visible = (event as CustomEvent<{ visible?: unknown }>).detail?.visible;
    if (typeof visible === "boolean") this._showBoxes = visible;
  };

  private _onStorage = (event: StorageEvent): void => {
    if (event.key === BOXES_STORAGE_KEY) this._showBoxes = event.newValue !== "false";
  };

  private _setBoxesVisible(visible: boolean): void {
    this._showBoxes = visible;
    try {
      localStorage.setItem(BOXES_STORAGE_KEY, String(visible));
    } catch {
      // The in-memory toggle still works when storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent(BOXES_CHANGE_EVENT, { detail: { visible } }));
  }

  private _toggleBoxes = (): void => this._setBoxesVisible(!this._showBoxes);

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("open") && this.open) this._closeButtonRef.value?.focus();
    const event = this.summary;
    this._beforeRef.sync(this.hass, this.cache, event?.before, () => this.requestUpdate());
    this._afterRef.sync(this.hass, this.cache, event?.after, () => this.requestUpdate());
    this._sceneRef.sync(this.hass, this.cache, event?.scene ?? null, () => this.requestUpdate());
    const eventUid = event?.uid ?? null;
    if (eventUid !== this._lastEventUid) {
      this._lastEventUid = eventUid;
      this._photosExpanded = false;
      this._viewerIndex = null;
      this._zoom = null;
    }
    // On sheet close or a switch to a different event, release the video and revert to the
    // poster/photo state (docs/39-eating-clips.md) -- a later re-open of the SAME event still
    // starts fresh, never resumes mid-playback.
    if ((changed.has("open") && !this.open) || eventUid !== this._clipEventUid) {
      this._clipEventUid = eventUid;
      this._releaseClip();
    }
  }

  render() {
    const event = this.summary;
    if (!this.open || !event) return nothing;
    const sessionCats = this._sessionCatsFor(event);
    const isFeed = event.kind === "feed";
    const locale = this.hass?.locale?.language ?? this.hass?.language;
    const title = isFeed ? feedTitle(event) : sessionTitle(sessionCats, event);
    const stageKind = this._stageKind(event);
    return html`
      <div class="backdrop" @click=${this._close}>
        <div class="sheet" role="dialog" aria-modal="true" aria-label=${title} @click=${(e: Event) => e.stopPropagation()}>
          ${this._renderHeader(event, locale, title, sessionCats)}
          <div class="scroll">
            <div class="layout ${stageKind === "none" ? "no-media" : ""}">
              ${stageKind !== "none"
                ? html`
                    <div class="media-col">
                      ${stageKind === "media" ? this._renderMediaStage(event) : this._renderCompare()}
                      ${stageKind === "media" && event.before && event.after ? this._renderCompare() : nothing}
                    </div>
                  `
                : nothing}
              <div class="info-col">${!isFeed ? html`${this._renderAsk(event, sessionCats)}${this._renderPhotos(event, sessionCats)}` : nothing}</div>
            </div>
          </div>
          <footer><button type="button" class="primary-btn" @click=${this._close}>Done</button></footer>
        </div>
        ${this._zoom ? this._renderZoom() : nothing}
      </div>
      <kibble-photo-viewer
        ?open=${this._viewerIndex !== null}
        .hass=${this.hass}
        .cache=${this.cache}
        .cats=${this.cats}
        .samples=${this.samples ?? []}
        .showBoxes=${this._showBoxes}
        @boxes-visibility-requested=${this._onBoxesVisibilityRequested}
        .initialIndex=${this._viewerIndex ?? 0}
        @viewer-close-requested=${this._onViewerClose}
      ></kibble-photo-viewer>
    `;
  }

  private _catColor(name: string): string {
    const cat = this.cats.find((c) => c.name === name);
    return cat ? catColorAt(cat.color) : fallbackCatColor(name);
  }

  private _sceneOverlayBoxes(): OverlayBox[] {
    return this.sceneSubjects.map((subject, index) => {
      const name = subject.label && subject.label !== "not_a_cat" ? subject.label : null;
      const cat = name ? this.cats.find((candidate) => candidate.name === name) : null;
      const tone = name ? "cat" : subject.label === "not_a_cat" ? "not-cat" : "unknown";
      return {
        key: "scene:" + index,
        box: subject.box,
        tone,
        label: name ?? (tone === "not-cat" ? "Not a cat" : "Who?"),
        color: name ? this._catColor(name) : undefined,
        avatar: cat?.avatar ?? null,
      };
    });
  }

  private _onBoxesVisibilityRequested = (request: CustomEvent<{ visible?: unknown }>): void => {
    const visible = request.detail?.visible;
    if (typeof visible === "boolean") this._setBoxesVisible(visible);
  };

  private _renderBoxesToggle() {
    return html`<button type="button" class="box-toggle" aria-pressed=${this._showBoxes} aria-label=${this._showBoxes ? "Hide boxes" : "Show boxes"} @click=${(event: Event) => { event.stopPropagation(); this._toggleBoxes(); }}>${mdiIcon(this._showBoxes ? "eye" : "eyeOff")}</button>`;
  }
  private _photoOverlayBoxes(sample: Sample): OverlayBox[] {
    if (!sample.body || !sample.box || !sample.crop) return [];
    const ownBox = boxInCrop(sample.box, sample.crop);
    if (!ownBox) return [];
    const name = sample.label ?? sample.guess;
    const named = name !== null && name !== "not_a_cat" && name !== "skip" && name !== "both" ? name : null;
    const tone = named ? "cat" : name === "not_a_cat" ? "not-cat" : "unknown";
    const cat = named ? this.cats.find((candidate) => candidate.name === named) : null;
    return [
      { key: "sample:" + sample.uid, box: ownBox, tone, color: named ? this._catColor(named) : undefined, avatar: cat?.avatar ?? null },
      ...sample.peers.flatMap((peer, index) => {
        const box = boxInCrop(peer, sample.crop!);
        return box ? [{ key: "peer:" + sample.uid + ":" + index, box, tone: "peer" as const }] : [];
      }),
    ];
  }

  // ---- Header + pager ----

  private _renderHeader(event: TimelineEvent, locale: string | undefined, title: string, cats: readonly SessionCat[]) {
    const duration = eventDuration(event);
    const liveCat = cats.find((cat) => cat.ate)?.cat ?? cats[0]?.cat ?? event.cat;
    const color = liveCat ? this._catColor(liveCat) : null;
    const index = this.group.findIndex((member) => member.uid === event.uid);
    return html`
      <header>
        ${this.group.length > 1 && !this.groupTogether ? this._renderPager(index) : nothing}
        <div class="heading">
          <span class="title">${title}</span>
          <span class="meta">
            ${timeLabel(event.start, locale)}${duration ? html`, ${duration}` : nothing}
            ${event.open ? this._renderLiveBadge(color) : nothing}
          </span>
        </div>
        <button type="button" class="close" ${ref(this._closeButtonRef)} @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
      </header>
    `;
  }

  private _renderLiveBadge(color: string | null) {
    return html`
      <span class="live-badge" style="--dot-color:${color ?? "var(--kibble-live, #e5484d)"}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `;
  }

  private _renderPager(index: number) {
    const total = this.group.length;
    return html`
      <div class="pager">
        <button type="button" class="pager-btn" aria-label="Previous event" ?disabled=${index <= 0} @click=${() => this._goToGroupIndex(index - 1)}>
          <span class="chevron chevron-left">${mdiIcon("chevronDown")}</span>
        </button>
        <span class="pager-count">${index + 1} of ${total}</span>
        <button
          type="button"
          class="pager-btn"
          aria-label="Next event"
          ?disabled=${index === -1 || index >= total - 1}
          @click=${() => this._goToGroupIndex(index + 1)}
        >
          <span class="chevron chevron-right">${mdiIcon("chevronDown")}</span>
        </button>
      </div>
    `;
  }

  private _goToGroupIndex(index: number): void {
    const target = this.group[index];
    if (!target) return;
    this.dispatchEvent(new CustomEvent("event-requested", { detail: { uid: target.uid }, bubbles: true, composed: true }));
  }

  // ---- Media stage ----

  /** A clip needs its poster (the scene photo) to be playable in this UI at all -- the two are
   * always captured together in practice; this just keeps that assumption in one place. */
  private _hasClip(event: TimelineEvent): boolean {
    return event.kind === "eat" && Boolean(event.clip) && Boolean(event.scene) && !this._clipError;
  }

  private _stageKind(event: TimelineEvent): "media" | "compare" | "none" {
    if (event.scene || this._hasClip(event)) return "media";
    if (event.before && event.after) return "compare";
    return "none";
  }

  private _renderMediaStage(event: TimelineEvent) {
    if (this._clipSrc) {
      return html`
        <div class="stage">
          <video
            ${ref(this._videoRef)}
            class="stage-video"
            controls
            playsinline
            autoplay
            preload="metadata"
            poster=${this._sceneRef.url ?? ""}
            src=${this._clipSrc}
            @loadedmetadata=${() => this._seekClip(event)}
            @error=${() => this._onClipError()}
          ></video>
        </div>
      `;
    }
    const asset = event.scene;
    const hasClip = this._hasClip(event);
    return html`
      <div class="stage">
        ${asset
          ? html`
              <button type="button" class="stage-zoom" aria-label="View photo full screen" @click=${() => { this._zoom = asset; }}>
                <kibble-image .hass=${this.hass} .asset=${asset} .cache=${this.cache} alt="" fit="contain"></kibble-image>
              </button>
              ${hasClip
                ? html`
                    <button type="button" class="clip-play" aria-label="Play video" @click=${(e: Event) => { e.stopPropagation(); void this._playClip(event); }}>
                      ${mdiIcon("play")}
                    </button>
                  `
                : nothing}
            `
          : nothing}
        ${this._showBoxes && this.sceneSubjects.length ? html`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>` : nothing}
        ${this.sceneSubjects.length ? this._renderBoxesToggle() : nothing}
      </div>
    `;
  }

  /** Signs `/api/kibble/<entry>/clip/<uid>` via HA's own `auth/sign_path` (the same mechanism
   * every other `requires_auth` view relies on) and swaps the poster/photo for a `<video>` at
   * that URL -- `docs/39-eating-clips.md`: the browser then streams and seeks it directly, no
   * headers required. Bails quietly (leaves the photo showing) if signing fails, or if the
   * sheet moved on to a different event while the WS round trip was still in flight. */
  private async _playClip(event: TimelineEvent): Promise<void> {
    const hass = this.hass;
    const entryId = this.entryId;
    if (!hass?.callWS || !entryId || !event.clip) return;
    const path = `/api/kibble/${entryId}/clip/${event.uid}`;
    try {
      const result = (await hass.callWS({ type: "auth/sign_path", path, expires: CLIP_SIGN_EXPIRES_S })) as { path: string };
      if (this.summary?.uid !== event.uid) return; // moved on while signing was in flight
      this._clipError = false;
      this._clipSrc = result.path;
    } catch {
      this._clipError = true;
    }
  }

  /** Seeks a just-loaded `<video>` to this session's own offset into the shared clip
   * (`lib/clip-offset.ts`) -- fired on `loadedmetadata`, once the browser actually knows the
   * clip's duration/seekable range. */
  private _seekClip(event: TimelineEvent): void {
    const video = this._videoRef.value;
    if (!video || !event.clip) return;
    video.currentTime = clipSeekOffsetSeconds(event.start, event.clip.start_ms);
  }

  /** The `<video>` errored (a 404: the clip aged out of Scrypted's own quota after it was
   * linked) -- reverts quietly to the photo and hides the play button. */
  private _onClipError(): void {
    this._stopClipPlayback();
    this._clipError = true;
  }

  /** Releases the `<video>` element's connection (pause, drop `src`, `load()`) without
   * touching `_clipError` -- the shared mechanic both a quiet revert-on-error and a full
   * close/event-change reset (`_releaseClip`) build on. */
  private _stopClipPlayback(): void {
    const video = this._videoRef.value;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    this._clipSrc = null;
  }

  /** Full reset back to the photo/poster state, error flag included -- sheet close or a switch
   * to a different event (`willUpdate`), so a later re-open always starts fresh. */
  private _releaseClip(): void {
    this._stopClipPlayback();
    this._clipError = false;
  }

  private _renderCompare() {
    return html`<kibble-before-after class="compare" .beforeSrc=${this._beforeRef.url} .afterSrc=${this._afterRef.url} .aspect=${MEDIA_ASPECT}></kibble-before-after>`;
  }

  private _renderZoom() {
    const event = this.summary;
    return html`
      <div class="zoom" @click=${(e: Event) => { e.stopPropagation(); this._zoom = null; }}>
        <div class="zoom-scene" @click=${(e: Event) => e.stopPropagation()}>
          <kibble-image .hass=${this.hass} .asset=${this._zoom} .cache=${this.cache} alt="" fit="contain"></kibble-image>
          ${event && this._showBoxes && this.sceneSubjects.length ? html`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>` : nothing}
        </div>
        ${this.sceneSubjects.length ? this._renderBoxesToggle() : nothing}
        <button type="button" class="zoom-close" aria-label="Close photo" @click=${(e: Event) => { e.stopPropagation(); this._zoom = null; }}>${mdiIcon("close")}</button>
      </div>
    `;
  }

  // ---- What the sheet asks ----

  private _sessionCatsFor(event: TimelineEvent): SessionCat[] {
    if (this.sessionCats) return this.sessionCats;
    if (!event.cat) return [];
    return [{ cat: event.cat, ate: event.kind === "eat", confirmed: event.identity === "reviewed", confidence: event.confidence ?? null, photos: event.sample_count ?? 0 }];
  }

  /** "Who ate?" on a meal that still needs it, and a hint to tap a photo to name it. */
  private _renderAsk(event: TimelineEvent, sessionCats: readonly SessionCat[]) {
    const cats = sessionCats.map((cat) => cat.cat);
    const question: AteQuestion | null = event.needs_ate && cats.length >= 2 ? { visitUid: event.uid, cats, start: event.start } : null;
    return html`
      <div class="ask">
        ${question ? html`<kibble-who-ate .hass=${this.hass} .cache=${this.cache} .question=${question} .roster=${this.cats}></kibble-who-ate>` : nothing}
        ${this.samples?.length ? html`<p class="hint">Tap a photo to say who is in it.</p>` : nothing}
      </div>
    `;
  }

  // ---- Photos ----

  private _renderPhotos(_event: TimelineEvent, cats: readonly SessionCat[]) {
    if (this.samplesFailed) return html`<div class="photos"><div class="photos-heading">Photos</div><p class="photos-error"><span>Couldn't load photos.</span> <button type="button" @click=${this._retrySamples}>Retry</button></p></div>`;
    if (this.samples === null) return html`<div class="photos"><div class="photos-heading">Photos</div><div class="photos-grid">${Array.from({ length: PHOTO_SKELETON_COUNT }, () => html`<div class="photo-skeleton"></div>`)}</div></div>`;
    if (this.samples.length === 0) return nothing;
    const sections = groupSessionPhotos(this.samples, cats);
    if (sections.length === 0) return html`<div class="photos"><div class="photos-heading"><span>Photos</span><span class="photos-count">${this.samples.length}</span></div>${this._renderPhotoGrid(this.samples)}</div>`;
    return html`<div class="photos">${sections.map((section) => html`
      <section class="photo-section" aria-label=${section.cat + " photos"}>
        <div class="photos-heading"><span><span class="photo-section-dot" style=${"--section-color:" + (this._catColor(section.cat) ?? "var(--secondary-text-color)")}></span>${section.cat}</span><span class="photos-count">${section.samples.length}</span></div>
        ${this._renderPhotoGrid(section.samples)}
      </section>`)}</div>`;
  }

  private _renderPhotoGrid(photos: readonly Sample[]) {
    const expanded = this._photosExpanded || photos.length <= PHOTOS_VISIBLE_CAP;
    const visible = expanded ? photos : photos.slice(0, PHOTOS_VISIBLE_CAP);
    const remaining = photos.length - PHOTOS_VISIBLE_CAP;
    return html`<div class="photos-grid">
      ${visible.map((sample) => this._renderPhotoTile(sample, this.samples!.findIndex((item) => item.uid === sample.uid))) }
      ${!expanded ? html`<button type="button" class="photo-tile photo-more" @click=${() => { this._photosExpanded = true; }}>+${remaining}</button>` : nothing}
    </div>`;
  }

  /** A photo someone named differently from its visit wears that cat's face in its corner. */
  private _catBadge(sample: Sample): CatSummary | null {
    if (sample.review === null || sample.review === sample.cat) return null;
    return this.cats.find((cat) => cat.name === sample.review) ?? null;
  }

  private _renderPhotoTile(sample: Sample, index: number) {
    const asset = sample.body ?? sample.face;
    const tag = photoTag(sample);
    const badge = this._catBadge(sample);
    const label = `Photo ${index + 1} of ${this.samples!.length}${tag ? ", " + tag.text.toLowerCase() : ""}`;
    return html`
      <button type="button" class="photo-tile ${tag?.kind === "skip" ? "dim" : ""}" aria-label=${label} @click=${() => { this._viewerIndex = index; }}>
        ${asset ? html`<kibble-image .hass=${this.hass} .asset=${asset} .cache=${this.cache} alt=""></kibble-image>` : html`<span class="photo-neutral">${catSilhouette()}</span>`}
        ${tag ? html`<span class="photo-tag">${tag.text}</span>` : nothing}
        ${badge ? html`<span class="photo-badge photo-badge-avatar"><kibble-avatar .hass=${this.hass} .name=${badge.name} .colorIndex=${badge.color ?? null} .asset=${badge.avatar ?? null} .cache=${this.cache}></kibble-avatar></span>` : nothing}
        ${this._showBoxes && sample.body && sample.box && sample.crop ? html`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(sample)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>` : nothing}
      </button>`;
  }

  private _onViewerClose = (): void => {
    this._viewerIndex = null;
  };

  private _retrySamples = (): void => {
    this.dispatchEvent(new CustomEvent("samples-retry-requested", { bubbles: true, composed: true }));
  };

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  };

  static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 600px;
      max-height: 92vh;
      max-height: 94dvh;
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 600px) {
      .sheet {
        border-radius: 16px;
      }
    }
    @media (min-width: 900px) {
      .sheet {
        max-width: 1040px;
      }
    }
    header {
      position: relative;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 16px 0;
    }
    header .close {
      position: absolute;
      top: 12px;
      right: 12px;
    }
    .heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      padding-right: 52px;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .cat-name {
      font-weight: 700;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
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
        animation: kibble-sheet-pulse-ring 1.8s ease-out infinite;
      }
    }
    @keyframes kibble-sheet-pulse-ring {
      0% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .close {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .pager {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
    }
    .pager-btn {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
    }
    .pager-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .chevron {
      display: inline-flex;
    }
    .chevron-left {
      transform: rotate(90deg);
    }
    .chevron-right {
      transform: rotate(-90deg);
    }
    .pager-count {
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .close:focus-visible,
    .pager-btn:focus-visible,
    .photo-tile:focus-visible,
    .primary-btn:focus-visible,
    .stage-zoom:focus-visible,
    .box-toggle:focus-visible,
    .zoom-close:focus-visible,
    .clip-play:focus-visible,
    .photos-error button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color) transparent;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-areas: "media" "info";
      gap: 16px;
      padding: 14px 16px 16px;
    }
    .layout.no-media {
      grid-template-areas: "info";
    }
    @media (min-width: 900px) {
      .layout {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
        grid-template-areas: "media info";
        align-items: start;
      }
      .layout.no-media {
        grid-template-columns: 1fr;
        grid-template-areas: "info";
        max-width: 560px;
        margin: 0 auto;
        width: 100%;
      }
    }
    .media-col {
      grid-area: media;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 0;
    }
    .media-col > * {
      flex-shrink: 0;
    }
    .info-col {
      grid-area: info;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .info-col > * {
      flex-shrink: 0;
    }
    /* A plain flex sibling of .scroll, never position: sticky -- it sits at the true bottom
     * of the sheet's own flex column, outside the scrolling region entirely, so it can never
     * produce a sticky-positioning compositing seam against the rounded/scrolling content
     * above it. Stays visible whether the sheet's content is short (its natural position) or
     * tall enough that .scroll takes up the remaining space (still the last thing in flow). */
    footer {
      flex-shrink: 0;
      padding: 10px 16px 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .primary-btn {
      width: 100%;
      min-height: 48px;
      border: none;
      border-radius: 8px;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
    }
    .primary-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .stage {
      position: relative;
      width: 100%;
      aspect-ratio: 1.6;
      border-radius: 8px;
      overflow: hidden;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .box-toggle {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 12;
      top: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      font: inherit;
      cursor: pointer;
      backdrop-filter: blur(8px);
    }
    .box-toggle svg {
      width: 22px;
      height: 22px;
    }

    .stage-zoom {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      cursor: zoom-in;
    }
    .stage-zoom kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .stage-video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }
    .clip-play {
      all: unset;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      box-sizing: border-box;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
    @media (hover: hover) {
      .clip-play:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }
    .compare {
      width: 100%;
    }
    .zoom {
      all: unset;
      position: fixed;
      inset: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.92);
      cursor: zoom-out;
    }
    .zoom kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .zoom {
      cursor: zoom-out;
    }
    .zoom-scene {
      position: relative;
      width: min(calc(100vw - 24px), calc((100dvh - 24px) * 1.6));
      aspect-ratio: 1.6;
      cursor: default;
    }
    .zoom-close {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 12;
      top: max(12px, env(safe-area-inset-top));
      left: 12px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      cursor: pointer;
    }


    .ask {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hint {
      margin: 0;
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
    }
    .photos {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photo-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photo-section-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      background: var(--section-color);
    }
    .photos {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photos-heading {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .photos-count {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 8px;
    }
    .photo-tile {
      position: relative;
      aspect-ratio: 1;
      padding: 0;
      border: none;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
    }
    .photo-tile kibble-image {
      width: 100%;
      height: 100%;
    }
    .photo-tile.dim kibble-image {
      filter: grayscale(1);
      opacity: 0.55;
    }
    .photo-neutral {
      display: block;
      width: 56%;
      height: 56%;
      margin: 22% auto;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .photo-more {
      display: flex;
      align-items: center;
      justify-content: center;
      font: inherit;
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .photo-badge {
      position: absolute;
      right: 3px;
      bottom: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      pointer-events: none;
    }
    .photo-badge-avatar {
      width: 22px;
      height: 22px;
    }
    .photo-badge-avatar kibble-avatar {
      --kibble-avatar-size: 22px;
    }
    .photo-tag {
      position: absolute;
      left: 4px;
      bottom: 4px;
      max-width: calc(100% - 8px);
      padding: 2px 6px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
    }
    .photo-skeleton {
      aspect-ratio: 1;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    @media (prefers-reduced-motion: no-preference) {
      .photo-skeleton {
        animation: kibble-sheet-skeleton-pulse 1.2s ease-in-out infinite;
      }
    }
    @keyframes kibble-sheet-skeleton-pulse {
      0%,
      100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
    .photos-error {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .photos-error button {
      flex: none;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 4px 10px;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      min-height: 32px;
    }
  `;
}

customElements.define("kibble-label-sheet", KibbleLabelSheet);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-label-sheet": KibbleLabelSheet;
  }
}
