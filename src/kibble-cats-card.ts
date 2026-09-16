/** Training as confirmation: enrolled cats up top, a one-tap inbox of pending face crops below.
 * Each crop already carries what the feeder's own identifier and Kibble's classifier think, so
 * the default gesture is one tap that means "yes" -- everything else (the chooser, per-cat
 * galleries) is the correction path, not the common case. See DESIGN.md for the full rationale.
 *
 * v1 scope note: single-crop confirm/choose/undo and per-cat gallery removal are implemented in
 * full; DESIGN.md's "Select mode" bulk bar (checkbox multi-select, "Confirm all <cat>"/"Label
 * as...") is not yet built -- every crop is handled one at a time. See README.md.
 */

import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import type { CatSample, HomeAssistant, KibbleCatSummary, KibbleCatsCardConfig, PendingFaceCrop } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { WsQuery, watchKey, describeWsError } from "./lib/ws-query";
import { ImageUrlCache, kibbleImageUrl } from "./lib/image-cache";
import { relativeTimeSentence } from "./lib/relative-time";
import { chooseSuggestion } from "./lib/suggestion";
import "./components/kibble-avatar";
import "./components/kibble-face-picker";
import "./cats-editor";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };
const DEFAULT_CONFIDENCE = 0.7;
const UNDO_WINDOW_MS = 5000;

interface UndoAction {
  message: string;
  run: () => void;
}

export class KibbleCatsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _hiddenCrops: { state: true },
    _pickerCrop: { state: true },
    _undo: { state: true },
    _addName: { state: true },
    _addBusy: { state: true },
    _addError: { state: true },
    _actionError: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCatsCardConfig | undefined;
  declare _hiddenCrops: Set<string>;
  declare _pickerCrop: PendingFaceCrop | null;
  declare _undo: UndoAction | null;
  declare _addName: string;
  declare _addBusy: boolean;
  declare _addError: string | null;
  declare _actionError: { message: string; retry: () => void } | null;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  private _catsQuery = new WsQuery<{ cats: KibbleCatSummary[] }>(() => this.requestUpdate());
  private _pendingQuery = new WsQuery<{ crops: PendingFaceCrop[] }>(() => this.requestUpdate());
  private _sampleQueries = new Map<string, WsQuery<{ samples: CatSample[] }>>();
  private _imageCache = new ImageUrlCache();
  private _lastPendingData: { crops: PendingFaceCrop[] } | null = null;
  private _undoTimer: number | undefined;
  private _pickerTrigger: HTMLElement | null = null;

  constructor() {
    super();
    this._hiddenCrops = new Set();
    this._pickerCrop = null;
    this._undo = null;
    this._addName = "";
    this._addBusy = false;
    this._addError = null;
    this._actionError = null;
  }

  setConfig(config: KibbleCatsCardConfig): void {
    if (!config.device_id) {
      throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 8;
  }

  static getStubConfig(hass: HomeAssistant): KibbleCatsCardConfig {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-cats-card", device_id: kibbleEntity?.device_id ?? "" };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("kibble-cats-card-editor");
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._imageCache.dispose();
    clearTimeout(this._undoTimer);
  }

  private _confidence(): number {
    return this._config?.confidence ?? DEFAULT_CONFIDENCE;
  }

  protected willUpdate(changed: PropertyValues): void {
    if ((changed.has("hass") || changed.has("_config")) && this._config?.device_id && this.hass) {
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, this._config.device_id);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, this._config.device_id);
    }
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      const key = watchKey(this.hass, [this._entities.pendingFace, this._entities.lastSeenPet]);
      this._catsQuery.sync(key, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as { cats: KibbleCatSummary[] }));
      this._pendingQuery.sync(key, () => callWS({ type: "kibble/faces/pending", entry_id: entryId }).then((r) => r as { crops: PendingFaceCrop[] }));
      for (const cat of this._catsQuery.state.data?.cats ?? []) {
        if (this._sampleQueries.has(cat.name)) continue;
        const query = new WsQuery<{ samples: CatSample[] }>(() => this.requestUpdate());
        this._sampleQueries.set(cat.name, query);
      }
      for (const [name, query] of this._sampleQueries) {
        query.sync(key, () => callWS({ type: "kibble/faces/samples", entry_id: entryId, cat: name }).then((r) => r as { samples: CatSample[] }));
      }
    }
    // Fresh server data supersedes any optimistic hide -- clear once a new fetch result lands.
    if (this._pendingQuery.state.data !== this._lastPendingData) {
      this._lastPendingData = this._pendingQuery.state.data;
      this._hiddenCrops = new Set();
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const cats = this._catsQuery.state.data?.cats ?? [];
    const allCrops = this._pendingQuery.state.data?.crops ?? [];
    const crops = allCrops.filter((crop) => !this._hiddenCrops.has(crop.name));
    const presentNames = new Set(
      this._entities.catPresence.filter((p) => this.hass.states[p.entityId]?.state === "on").map((p) => p.name),
    );

    return html`
      <ha-card>
        <div class="container">
          ${this._config.name ? html`<div class="label">${this._config.name}</div>` : nothing}
          ${this._actionError ? this._renderActionError() : nothing}
          <section class="header">
            ${cats.length === 0 ? html`<p class="empty">No cats yet. Add one to start training.</p>` : html`<div class="cat-list">${cats.map((cat) => this._renderCatHeader(cat, presentNames.has(cat.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${crops.length === 1 ? "1 to review" : `${crops.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error ? this._renderPendingError() : nothing}
            ${crops.length === 0 && !this._pendingQuery.state.error
              ? html`<p class="empty">Nothing to review. New crops arrive when a cat is identified at the bowl.</p>`
              : html`<div class="crop-grid" @keydown=${this._onGridKeydown}>${crops.map((crop) => this._renderCrop(crop))}</div>`}
          </section>
          ${cats.map((cat) => this._renderGallery(cat))}
        </div>
      </ha-card>
      ${this._undo ? this._renderUndo(this._undo) : nothing}
      <kibble-face-picker
        ?open=${this._pickerCrop !== null}
        .hass=${this.hass}
        .cats=${cats}
        .entryId=${this._entryId}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
    `;
  }

  private _renderCatHeader(cat: KibbleCatSummary, present: boolean) {
    const seen = cat.last_seen != null ? `seen ${relativeTimeSentence(new Date(cat.last_seen * 1000), new Date())}` : "not seen yet";
    return html`
      <div class="cat">
        <kibble-avatar
          class=${present ? "present" : ""}
          .hass=${this.hass}
          .name=${cat.name}
          .colorIndex=${cat.color_index}
          .entryId=${this._entryId}
          .sampleName=${cat.avatar}
        ></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${cat.name}</span>
          <span class="cat-meta">${cat.samples === 1 ? "1 sample" : `${cat.samples} samples`}, ${seen}</span>
        </div>
      </div>
    `;
  }

  private _renderAddCat() {
    return html`
      <form class="add-cat" @submit=${this._onAddCatSubmit}>
        <input
          type="text"
          placeholder="Add a cat"
          aria-label="New cat's name"
          .value=${this._addName}
          ?disabled=${this._addBusy}
          @input=${(event: Event) => {
            this._addName = (event.target as HTMLInputElement).value;
          }}
        />
        <button type="submit" ?disabled=${this._addBusy || !this._addName.trim()}>Add a cat</button>
        ${this._addError ? html`<span class="inline-error">${this._addError}</span>` : nothing}
      </form>
    `;
  }

  private async _onAddCatSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const name = this._addName.trim();
    if (!name || !this._entities.deviceId) return;
    this._addBusy = true;
    this._addError = null;
    try {
      await this.hass.callService("kibble", "add_cat", { device_id: this._entities.deviceId, name });
      this._addName = "";
      this._refreshCats();
    } catch (err) {
      this._addError = describeWsError(err);
    } finally {
      this._addBusy = false;
    }
  }

  private _renderCrop(crop: PendingFaceCrop) {
    const suggestion = chooseSuggestion(crop, this._confidence());
    const path = this._entryId ? kibbleImageUrl(this._entryId, "pending", crop.name) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    return html`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!url}
          aria-label=${suggestion ? `Confirm ${suggestion.cat}` : "Choose a cat for this crop"}
          @click=${() => this._onCropTap(crop, suggestion)}
        >
          ${url ? html`<img src=${url} alt="" loading="lazy" />` : nothing}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${(e: Event) => this._openPicker(crop, e)}>&#8942;</button>
        <div class="chip ${suggestion ? `chip-${suggestion.source}` : "chip-empty"}">
          ${suggestion ? html`${suggestion.cat}<span class="mark">${suggestion.source === "classifier" ? "AI" : "ID"}</span>` : "Tap to choose"}
        </div>
      </div>
    `;
  }

  private _onGridKeydown(event: KeyboardEvent): void {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const grid = event.currentTarget as HTMLElement;
    const buttons = [...grid.querySelectorAll<HTMLButtonElement>(".crop-thumb")];
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = buttons[(currentIndex + delta + buttons.length) % buttons.length];
    next?.focus();
  }

  private _onCropTap(crop: PendingFaceCrop, suggestion: ReturnType<typeof chooseSuggestion>): void {
    if (!suggestion) {
      this._pickerCrop = crop;
      return;
    }
    this._confirm(crop, suggestion.cat);
  }

  private _openPicker(crop: PendingFaceCrop, event: Event): void {
    this._pickerTrigger = event.currentTarget as HTMLElement;
    this._pickerCrop = crop;
  }

  private _closePicker = (): void => {
    this._pickerCrop = null;
    this._pickerTrigger?.focus();
    this._pickerTrigger = null;
  };

  private _onPickerChoice = (event: CustomEvent<{ cat: string }>): void => {
    const crop = this._pickerCrop;
    this._pickerCrop = null;
    if (crop) this._confirm(crop, event.detail.cat);
  };

  private _confirm(crop: PendingFaceCrop, cat: string): void {
    if (!this._entities.deviceId) return;
    const deviceId = this._entities.deviceId;
    this._hiddenCrops = new Set(this._hiddenCrops).add(crop.name);
    const displayCat = cat === "not_a_cat" ? "Not a cat" : cat === "other" ? "Skip" : cat;
    this.hass
      .callService("kibble", "label_face", { device_id: deviceId, crop_id: crop.name, cat })
      .then(() => {
        this._refreshAll();
        this._setUndo({
          message: `Labelled as ${displayCat}. `,
          run: () => {
            this.hass.callService("kibble", "unlabel_face", { device_id: deviceId, cat, name: crop.name }).then(() => this._refreshAll());
          },
        });
      })
      .catch((err: unknown) => {
        const next = new Set(this._hiddenCrops);
        next.delete(crop.name);
        this._hiddenCrops = next;
        this._actionError = { message: `Couldn't label this crop. ${describeWsError(err)}`, retry: () => this._confirm(crop, cat) };
      });
  }

  private _setUndo(action: UndoAction): void {
    clearTimeout(this._undoTimer);
    this._undo = action;
    this._undoTimer = setTimeout(() => {
      this._undo = null;
    }, UNDO_WINDOW_MS) as unknown as number;
  }

  private _renderUndo(action: UndoAction) {
    return html`
      <div class="undo-bar" role="status">
        <span>${action.message}</span>
        <button
          type="button"
          @click=${() => {
            clearTimeout(this._undoTimer);
            this._undo = null;
            action.run();
          }}
        >
          Undo
        </button>
      </div>
    `;
  }

  private _renderActionError() {
    const error = this._actionError;
    if (!error) return nothing;
    return html`
      <div class="error">
        <span>${error.message}</span>
        <button
          type="button"
          @click=${() => {
            this._actionError = null;
            error.retry();
          }}
        >
          Try again
        </button>
      </div>
    `;
  }

  private _renderPendingError() {
    const message = this._pendingQuery.state.error;
    if (!message) return nothing;
    return html`
      <div class="error">
        <span>Couldn't load the review queue. ${message}</span>
        <button type="button" @click=${() => this._refreshPending()}>Try again</button>
      </div>
    `;
  }

  private _renderGallery(cat: KibbleCatSummary) {
    const query = this._sampleQueries.get(cat.name);
    const samples = query?.state.data?.samples ?? [];
    if (samples.length === 0 && cat.samples === 0) return nothing;
    return html`
      <section class="gallery">
        <div class="gallery-heading">${cat.name}, ${cat.samples === 1 ? "1 sample" : `${cat.samples} samples`}</div>
        <div class="gallery-grid">
          ${samples.map((sample) => this._renderSample(cat.name, sample))}
        </div>
      </section>
    `;
  }

  private _renderSample(catName: string, sample: CatSample) {
    const path = this._entryId ? kibbleImageUrl(this._entryId, `sample/${catName}`, sample.name) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    return html`
      <div class="sample">
        ${url ? html`<img src=${url} alt="" loading="lazy" />` : nothing}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${catName}`} @click=${() => this._removeSample(catName, sample)}>
          ${"\u00d7"}
        </button>
      </div>
    `;
  }

  private _removeSample(cat: string, sample: CatSample): void {
    if (!this._entities.deviceId) return;
    const deviceId = this._entities.deviceId;
    this.hass
      .callService("kibble", "unlabel_face", { device_id: deviceId, cat, name: sample.name })
      .then(() => this._refreshAll())
      .catch((err: unknown) => {
        this._actionError = { message: `Couldn't remove this sample. ${describeWsError(err)}`, retry: () => this._removeSample(cat, sample) };
      });
  }

  private _refreshCats(): void {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as { cats: KibbleCatSummary[] }));
  }

  private _refreshPending(): void {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    this._pendingQuery.refresh(() => callWS({ type: "kibble/faces/pending", entry_id: entryId }).then((r) => r as { crops: PendingFaceCrop[] }));
  }

  private _refreshAll(): void {
    this._refreshCats();
    this._refreshPending();
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    for (const [name, query] of this._sampleQueries) {
      query.refresh(() => callWS({ type: "kibble/faces/samples", entry_id: entryId, cat: name }).then((r) => r as { samples: CatSample[] }));
    }
  }

  static styles = css`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    ha-card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      overflow: hidden;
    }
    .container {
      container-type: inline-size;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .label {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button,
    .inline-error {
      font-size: var(--kibble-text-caption);
    }
    .error button {
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 40px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }
    .cat-name {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .cat-meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .add-cat {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .add-cat input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
      font-size: var(--kibble-text-body);
    }
    .add-cat button {
      min-height: 40px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      padding: 0 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .add-cat button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .inline-error {
      color: var(--error-color, #db4437);
    }
    .inbox {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .inbox-heading {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .crop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .crop {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .crop-thumb {
      width: 100%;
      aspect-ratio: 1;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .crop-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .crop-thumb:focus-visible,
    .chooser:focus-visible,
    .remove:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible,
    .undo-bar button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chooser {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      cursor: pointer;
      line-height: 1;
      font-size: 14px;
    }
    .chip {
      font-size: 11px;
      text-align: center;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .chip-classifier {
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }
    .chip-vendor {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .mark {
      font-size: 9px;
      font-weight: 700;
      padding: 0 4px;
      border-radius: 4px;
      background: color-mix(in srgb, currentColor 16%, transparent);
    }
    .undo-bar {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 999px;
      background: #222;
      color: #fff;
      font-size: var(--kibble-text-body);
      z-index: 10;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .undo-bar button {
      border: none;
      background: none;
      color: #8ecbff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .undo-bar {
        animation: kibble-undo-in 150ms ease-out;
      }
    }
    @keyframes kibble-undo-in {
      from {
        opacity: 0;
        transform: translate(-50%, 8px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .gallery {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .gallery-heading {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .gallery-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sample {
      position: relative;
      width: 56px;
      height: 56px;
    }
    .sample img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
    }
    @container (max-width: 360px) {
      .crop-grid {
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      }
    }
  `;
}

customElements.define("kibble-cats-card", KibbleCatsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-cats-card",
  name: "Kibble Cats",
  description: "Enrolled cats plus a one-tap training inbox for the feeder's own face crops.",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "kibble-cats-card": KibbleCatsCard;
  }
}
