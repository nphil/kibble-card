/** "Change picture": choose one of a cat's own training photos as its avatar (`kibble/cats/
 * avatar/set`), upload a fresh one instead (crop as a circle-safe square, `POST .../upload/
 * avatar/<cat>`), or reset back to the auto-pick (`kibble/cats/avatar/clear`, only offered once
 * there is a custom choice to undo). Any of the three closes the sheet immediately and reports
 * the new avatar via `avatar-changed` so the parent's tile updates without waiting on a full
 * `kibble/cats` refetch -- the parent still refetches afterward for full consistency (`avatar_
 * custom` in particular), the same belt-and-suspenders pattern `kibble-cats-card.ts`'s own
 * label handlers already use.
 *
 * Controlled overlay, same contract as every other sheet in this card set.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { Asset, CatSummary, HomeAssistant, TrainingSample } from "../types";
import type { NormalizedArea } from "../lib/detection-areas";
import { defaultSquareCrop, type ImageSize } from "../lib/photo-crop";
import { imageNaturalSize, prepareUpload, uploadFilename } from "../lib/image-prep";
import { uploadAvatarPhoto } from "../lib/upload-client";
import { PagedFeed, type PagedFeedState } from "../lib/paged-feed";
import { ImageUrlCache } from "../lib/image-cache";
import { describeWsError } from "../lib/ws-query";
import { mdiIcon } from "../lib/mdi-icons";
import "./kibble-crop-editor";
import "./kibble-image";

const TRAINING_LIMIT = 24;
const FOCUSABLE_SELECTOR = ["button:not([disabled])", "[tabindex]:not([tabindex=\"-1\"])"].join(",");

export class KibbleAvatarPicker extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    entryId: { type: String },
    cache: { attribute: false },
    cat: { attribute: false },
    _uploadFile: { state: true },
    _uploadNaturalSize: { state: true },
    _uploadCrop: { attribute: false },
    _busy: { state: true },
    _error: { state: true },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  declare cache: ImageUrlCache | undefined;
  declare cat: CatSummary | null;
  declare _uploadFile: File | null;
  declare _uploadNaturalSize: ImageSize | null;
  declare _uploadCrop: NormalizedArea;
  declare _busy: boolean;
  declare _error: string | null;

  private readonly _trainingFeed = new PagedFeed<TrainingSample>("kibble/training", () => this.requestUpdate());
  private _uploadObjectUrl = "";
  private _uploadGeneration = 0;
  private readonly _closeButtonRef = createRef<HTMLButtonElement>();
  private readonly _fileInputRef = createRef<HTMLInputElement>();

  constructor() {
    super();
    this.open = false;
    this.cat = null;
    this._uploadFile = null;
    this._uploadNaturalSize = null;
    this._uploadCrop = [0, 0, 1, 1];
    this._busy = false;
    this._error = null;
  }

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (this._uploadFile) this._cancelUpload();
      else this._requestClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...this.renderRoot.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
    if (focusable.length === 0) return;
    const active = this.renderRoot.querySelector<HTMLElement>(":focus");
    const currentIndex = active ? focusable.indexOf(active) : -1;
    const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
      event.preventDefault();
      (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    this._trainingFeed.dispose();
    this._cancelUpload();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("open") && this.open) this._closeButtonRef.value?.focus();
    if (changed.has("open") && !this.open) {
      this._cancelUpload();
      this._error = null;
    }
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (this.open && hass?.callWS && entryId && cat) {
      this._trainingFeed.sync(hass, `${entryId}:${cat.name}`, this._feedParams(), TRAINING_LIMIT);
    }
  }

  private _feedParams(): Record<string, unknown> {
    return { entry_id: this.entryId, cat: this.cat?.name };
  }

  private _requestClose(): void {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }

  private _emitChanged(avatar: Asset | null, avatarCustom: boolean): void {
    const cat = this.cat;
    if (!cat) return;
    this.dispatchEvent(new CustomEvent("avatar-changed", { detail: { cat: cat.name, avatar, avatarCustom }, bubbles: true, composed: true }));
  }

  private async _chooseExisting(asset: Asset | null): Promise<void> {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (!hass?.callWS || !entryId || !cat || !asset || this._busy) return;
    this._busy = true;
    this._error = null;
    try {
      const result = (await hass.callWS({ type: "kibble/cats/avatar/set", entry_id: entryId, cat: cat.name, asset_id: asset.id })) as { avatar: Asset | null };
      this._emitChanged(result.avatar, true);
      this._requestClose();
    } catch (err) {
      this._error = describeWsError(err);
    } finally {
      this._busy = false;
    }
  }

  private async _onReset(): Promise<void> {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (!hass?.callWS || !entryId || !cat || this._busy) return;
    this._busy = true;
    this._error = null;
    try {
      const result = (await hass.callWS({ type: "kibble/cats/avatar/clear", entry_id: entryId, cat: cat.name })) as { avatar: Asset | null };
      this._emitChanged(result.avatar, false);
      this._requestClose();
    } catch (err) {
      this._error = describeWsError(err);
    } finally {
      this._busy = false;
    }
  }

  private _onFileChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = "";
    if (!file) return;
    this._uploadFile = file;
    this._uploadObjectUrl = URL.createObjectURL(file);
    this._uploadNaturalSize = null;
    this._uploadCrop = [0, 0, 1, 1];
    const generation = ++this._uploadGeneration;
    void imageNaturalSize(file).then((size) => {
      if (generation !== this._uploadGeneration || !size) return;
      this._uploadNaturalSize = size;
      this._uploadCrop = defaultSquareCrop(size);
    });
  }

  private _cancelUpload(): void {
    if (this._uploadObjectUrl) URL.revokeObjectURL(this._uploadObjectUrl);
    this._uploadObjectUrl = "";
    this._uploadFile = null;
    this._uploadNaturalSize = null;
  }

  private async _confirmUpload(): Promise<void> {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    const file = this._uploadFile;
    if (!hass || !entryId || !cat || !file || this._busy) return;
    this._busy = true;
    this._error = null;
    try {
      const blob = await prepareUpload(file, this._uploadCrop);
      const result = await uploadAvatarPhoto(hass, entryId, cat.name, blob, uploadFilename(file, blob), new AbortController().signal);
      if (result.error || !result.avatar) {
        this._error = result.error ?? "Couldn't save that photo.";
        return;
      }
      this._emitChanged(result.avatar, true);
      this._requestClose();
    } catch (err) {
      this._error = err instanceof Error ? err.message : "Couldn't save that photo.";
    } finally {
      this._busy = false;
    }
  }

  render() {
    const cat = this.cat;
    if (!this.open || !cat) return nothing;
    return html`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label=${`Change ${cat.name}'s picture`}>
        <div class="sheet">
          <header>
            <span class="title">Change picture</span>
            <button type="button" class="close" ${ref(this._closeButtonRef)} @click=${() => this._requestClose()} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          ${this._uploadFile ? this._renderUploadAdjust() : this._renderGrid(cat)}
          ${this._error ? html`<p class="error">${this._error}</p>` : nothing}
        </div>
      </div>
    `;
  }

  private _renderGrid(cat: CatSummary) {
    const state: PagedFeedState<TrainingSample> = this._trainingFeed.state;
    return html`
      <input type="file" accept="image/*" hidden ${ref(this._fileInputRef)} @change=${(e: Event) => this._onFileChosen(e)} />
      <div class="grid">
        <button type="button" class="tile upload-tile" ?disabled=${this._busy} @click=${() => this._fileInputRef.value?.click()}>Upload</button>
        ${(state.items ?? []).map((sample) => this._renderSampleTile(cat, sample))}
      </div>
      ${state.error ? html`<p class="error">${state.error}</p>` : nothing}
      ${state.items && state.items.length === 0 ? html`<p class="empty">No training photos yet -- upload one instead.</p>` : nothing}
      ${this._renderPager(state)}
      ${cat.avatar_custom ? html`<button type="button" class="reset" ?disabled=${this._busy} @click=${() => this._onReset()}>Reset to automatic</button>` : nothing}
    `;
  }

  private _renderSampleTile(cat: CatSummary, sample: TrainingSample) {
    const asset = sample.body ?? sample.face;
    const isCurrent = Boolean(asset && cat.avatar?.id === asset.id);
    return html`
      <button type="button" class="tile photo-tile ${isCurrent ? "current" : ""}" ?disabled=${this._busy || !asset} aria-label="Use this photo" @click=${() => this._chooseExisting(asset)}>
        ${asset ? html`<kibble-image .hass=${this.hass} .asset=${asset} .cache=${this.cache} alt=""></kibble-image>` : nothing}
      </button>
    `;
  }

  private _renderPager(state: PagedFeedState<TrainingSample>) {
    if (state.items === null || (!state.hasNext && !state.hasPrevious)) return nothing;
    return html`
      <div class="pager">
        <button type="button" ?disabled=${!state.hasPrevious || state.loading} @click=${() => this._trainingFeed.previous(this.hass, this._feedParams(), TRAINING_LIMIT)}>Previous</button>
        <button type="button" ?disabled=${!state.hasNext || state.loading} @click=${() => this._trainingFeed.next(this.hass, this._feedParams(), TRAINING_LIMIT)}>Next</button>
      </div>
    `;
  }

  private _renderUploadAdjust() {
    const size = this._uploadNaturalSize;
    return html`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${this._uploadObjectUrl}
            .naturalWidth=${size?.width ?? 0}
            .naturalHeight=${size?.height ?? 0}
            .crop=${this._uploadCrop}
            .circleGuide=${true}
            .fitParent=${true}
            @crop-changed=${(e: CustomEvent<{ crop: NormalizedArea }>) => {
              this._uploadCrop = e.detail.crop;
            }}
          ></kibble-crop-editor>
        </div>
        <div class="adjust-actions">
          <button type="button" class="secondary" ?disabled=${this._busy} @click=${() => this._cancelUpload()}>Back</button>
          <button type="button" class="primary" ?disabled=${this._busy} @click=${() => this._confirmUpload()}>Use this photo</button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
    .sheet {
      width: 100%;
      max-width: 560px;
      max-height: min(88vh, 780px);
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      padding-bottom: max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      border-radius: 16px 16px 0 0;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: var(--kibble-text-title);
      font-weight: 600;
    }
    .close {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .tile {
      aspect-ratio: 1;
      padding: 0;
      border: none;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }
    .tile:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .photo-tile {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      box-sizing: border-box;
      border: 2px solid transparent;
    }
    .photo-tile.current {
      border-color: var(--kibble-feed, #43a96a);
    }
    .upload-tile {
      border: 2px dashed var(--divider-color);
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .pager button {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 0 14px;
      min-height: 36px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .pager button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .reset {
      align-self: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: var(--kibble-text-caption);
      text-decoration: underline;
      cursor: pointer;
      min-height: 32px;
    }
    .reset:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .error {
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-caption);
    }
    .adjust {
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: min(70vh, 420px);
    }
    .adjust-stage {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .adjust-stage kibble-crop-editor {
      max-width: 320px;
      max-height: 100%;
    }
    .adjust-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .primary,
    .secondary {
      min-height: 44px;
      padding: 0 22px;
      border-radius: 10px;
      border: none;
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .primary {
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .secondary {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .primary:disabled,
    .secondary:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .close:focus-visible,
    .tile:focus-visible,
    .reset:focus-visible,
    .pager button:focus-visible,
    .primary:focus-visible,
    .secondary:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-avatar-picker", KibbleAvatarPicker);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-avatar-picker": KibbleAvatarPicker;
  }
}
