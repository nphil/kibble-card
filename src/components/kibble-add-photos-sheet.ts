/** The "Add photos" flow: a grid of the photos just chosen from the OS file picker, each with a
 * square crop frame defaulting to the largest centered square (tap a tile to drag/pinch/corner-
 * drag it instead); one primary "Add N photos" button starts a bounded-concurrency upload
 * (`lib/upload-queue.ts`), with a thin progress ring per tile while it runs and a compact tally
 * once every tile has settled. A failed tile offers its own retry, never blocking the rest.
 *
 * Controlled overlay, same contract as `kibble-label-sheet.ts`: the parent owns `open` and hands
 * in the chosen `File[]`; this only ever asks to close (`close-requested`), on which the parent
 * re-reads `kibble/cats` and that cat's training page -- unconditionally, since some tiles may
 * have already landed even if the rest were cancelled mid-batch.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { HomeAssistant } from "../types";
import type { NormalizedArea } from "../lib/detection-areas";
import { defaultSquareCrop, type ImageSize } from "../lib/photo-crop";
import { imageNaturalSize, prepareUpload, uploadFilename } from "../lib/image-prep";
import { UploadQueue, type UploadItemStatus, type UploadTally } from "../lib/upload-queue";
import { uploadTrainingPhoto } from "../lib/upload-client";
import { mdiIcon } from "../lib/mdi-icons";
import "./kibble-crop-editor";

interface PhotoTile {
  id: string;
  file: File;
  objectUrl: string;
  naturalSize: ImageSize | null;
  crop: NormalizedArea;
}

const FOCUSABLE_SELECTOR = ["button:not([disabled])", "[tabindex]:not([tabindex=\"-1\"])"].join(",");

export class KibbleAddPhotosSheet extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    entryId: { type: String },
    cat: { type: String },
    files: { attribute: false },
    _tiles: { state: true },
    _adjustingId: { state: true },
    _queueTick: { state: true },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  declare cat: string | undefined;
  /** The just-chosen files, handed in once by the card when the OS picker resolves. Compared by
   * reference in `willUpdate`: a new array (even a re-pick of the exact same files) resets the
   * whole tile list and any queue in progress. */
  declare files: File[];
  declare _tiles: PhotoTile[];
  /** Which tile's full crop-adjust overlay is open, or `null` (the grid). */
  declare _adjustingId: string | null;
  /** Bumped on every `UploadQueue` change to force a re-render -- the queue is not itself a Lit
   * reactive property, so this is what makes its per-item status changes actually repaint. */
  declare _queueTick: number;

  private _queue: UploadQueue | null = null;
  private _tileGeneration = 0;
  private _loadedFiles: File[] | null = null;
  private readonly _closeButtonRef = createRef<HTMLButtonElement>();

  constructor() {
    super();
    this.open = false;
    this.files = [];
    this._tiles = [];
    this._adjustingId = null;
    this._queueTick = 0;
  }

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (this._adjustingId) this._adjustingId = null;
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
    this._disposeTiles();
    this._queue?.dispose();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("open") && this.open) this._closeButtonRef.value?.focus();
    if (this.open && this.files !== this._loadedFiles) {
      this._loadedFiles = this.files;
      this._resetForFiles(this.files);
    }
  }

  private _disposeTiles(): void {
    for (const tile of this._tiles) URL.revokeObjectURL(tile.objectUrl);
  }

  private _resetForFiles(files: File[]): void {
    this._queue?.dispose();
    this._queue = null;
    this._disposeTiles();
    this._adjustingId = null;
    const generation = ++this._tileGeneration;
    this._tiles = files.map((file, index) => ({ id: `f${index}`, file, objectUrl: URL.createObjectURL(file), naturalSize: null, crop: [0, 0, 1, 1] as NormalizedArea }));
    for (const tile of this._tiles) {
      void imageNaturalSize(tile.file).then((size) => {
        if (generation !== this._tileGeneration || !size) return;
        tile.naturalSize = size;
        tile.crop = defaultSquareCrop(size);
        this.requestUpdate();
      });
    }
  }

  private _removeTile(id: string): void {
    const tile = this._tiles.find((t) => t.id === id);
    if (tile) URL.revokeObjectURL(tile.objectUrl);
    this._tiles = this._tiles.filter((t) => t.id !== id);
  }

  private _onCropChanged(id: string, crop: NormalizedArea): void {
    const tile = this._tiles.find((t) => t.id === id);
    if (tile) tile.crop = crop;
    this.requestUpdate();
  }

  private _startUpload(): void {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (!hass || !entryId || !cat || this._tiles.length === 0 || this._queue) return;
    const tiles = this._tiles;
    const queue = new UploadQueue(
      {
        compress: (id) => prepareUpload(tiles.find((t) => t.id === id)!.file, tiles.find((t) => t.id === id)!.crop),
        upload: async (id, blob, signal) => {
          const tile = tiles.find((t) => t.id === id)!;
          const result = await uploadTrainingPhoto(hass, entryId, cat, blob, uploadFilename(tile.file, blob), signal);
          return { status: result.status, message: result.message };
        },
      },
      () => {
        this._queueTick++;
      },
      2,
    );
    queue.enqueue(tiles.map((tile) => tile.id));
    queue.start();
    this._queue = queue;
    this._queueTick++;
  }

  private _requestClose(): void {
    this._queue?.cancelPending();
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }

  render() {
    if (!this.open) return nothing;
    const adjusting = this._adjustingId ? this._tiles.find((t) => t.id === this._adjustingId) : undefined;
    return html`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label="Add photos">
        <div class="sheet">
          <header>
            <span class="title">Add photos${this.cat ? html` of ${this.cat}` : nothing}</span>
            <button type="button" class="close" ${ref(this._closeButtonRef)} @click=${() => this._requestClose()} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          ${this._tiles.length === 0 ? html`<p class="empty">No photos chosen.</p>` : html`<div class="grid">${this._tiles.map((tile) => this._renderTile(tile))}</div>`}
          ${this._renderFooter()}
        </div>
        ${adjusting ? this._renderAdjust(adjusting) : nothing}
      </div>
    `;
  }

  private _renderTile(tile: PhotoTile) {
    const status = this._queue?.get(tile.id)?.status;
    const message = this._queue?.get(tile.id)?.message ?? null;
    return html`
      <div class="tile">
        <button type="button" class="tile-photo" aria-label="Adjust crop" ?disabled=${Boolean(this._queue)} @click=${() => { this._adjustingId = tile.id; }}>
          <kibble-crop-editor .imageUrl=${tile.objectUrl} .naturalWidth=${tile.naturalSize?.width ?? 0} .naturalHeight=${tile.naturalSize?.height ?? 0} .crop=${tile.crop} .interactive=${false}></kibble-crop-editor>
        </button>
        ${!this._queue ? html`<button type="button" class="remove" aria-label="Remove this photo" @click=${() => this._removeTile(tile.id)}>${"\u00d7"}</button>` : nothing}
        ${status ? this._renderTileStatus(tile.id, status, message) : nothing}
      </div>
    `;
  }

  private _renderTileStatus(id: string, status: UploadItemStatus, message: string | null) {
    if (status === "queued") return nothing;
    if (status === "compressing" || status === "uploading") return html`<span class="tile-badge busy" aria-label="Uploading">${mdiIcon("refresh")}</span>`;
    if (status === "added") return html`<span class="tile-badge added" aria-label="Added">${mdiIcon("check")}</span>`;
    if (status === "duplicate") return html`<span class="tile-badge muted">Duplicate</span>`;
    if (status === "no_cat") return html`<span class="tile-badge muted">Not a cat</span>`;
    if (status === "canceled") return html`<span class="tile-badge muted">Canceled</span>`;
    return html`
      <span class="tile-badge error" title=${message ?? "Couldn't upload this photo."}>
        Failed
        <button type="button" @click=${() => this._queue?.retry(id)}>Retry</button>
      </span>
    `;
  }

  private _renderFooter() {
    const queue = this._queue;
    if (queue && queue.allSettled) {
      return html`
        <div class="footer">
          <p class="tally">${this._tallyPhrase(queue.tally())}</p>
          <button type="button" class="primary" @click=${() => this._requestClose()}>Done</button>
        </div>
      `;
    }
    if (queue) {
      const settled = this._tiles.filter((tile) => queue.get(tile.id)?.status !== "queued" && queue.get(tile.id)?.status !== "compressing" && queue.get(tile.id)?.status !== "uploading").length;
      return html`<div class="footer"><p class="progress">Adding ${settled} of ${this._tiles.length}\u2026</p></div>`;
    }
    return html`
      <div class="footer">
        <button type="button" class="primary" ?disabled=${this._tiles.length === 0} @click=${() => this._startUpload()}>Add ${this._tiles.length} photo${this._tiles.length === 1 ? "" : "s"}</button>
      </div>
    `;
  }

  private _tallyPhrase(tally: UploadTally): string {
    const parts: string[] = [];
    if (tally.added) parts.push(`${tally.added} added`);
    if (tally.duplicate) parts.push(`${tally.duplicate} duplicate${tally.duplicate === 1 ? "" : "s"}`);
    if (tally.no_cat) parts.push(`${tally.no_cat} not a cat`);
    if (tally.error) parts.push(`${tally.error} failed`);
    if (tally.canceled) parts.push(`${tally.canceled} canceled`);
    return parts.length > 0 ? parts.join(" \u00b7 ") : "Nothing added.";
  }

  private _renderAdjust(tile: PhotoTile) {
    return html`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${tile.objectUrl}
            .naturalWidth=${tile.naturalSize?.width ?? 0}
            .naturalHeight=${tile.naturalSize?.height ?? 0}
            .crop=${tile.crop}
            .fitParent=${true}
            @crop-changed=${(e: CustomEvent<{ crop: NormalizedArea }>) => this._onCropChanged(tile.id, e.detail.crop)}
          ></kibble-crop-editor>
        </div>
        <button type="button" class="adjust-done" @click=${() => { this._adjustingId = null; }}>Done</button>
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
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 10px;
    }
    .tile {
      position: relative;
    }
    .tile-photo {
      display: block;
      width: 100%;
      padding: 0;
      border: none;
      background: none;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }
    .tile-photo:disabled {
      cursor: default;
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;
    }
    .tile-badge {
      position: absolute;
      left: 6px;
      bottom: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
    }
    .tile-badge.added {
      background: var(--kibble-feed, #43a96a);
    }
    .tile-badge.error {
      background: var(--error-color, #db4437);
      gap: 6px;
    }
    .tile-badge.error button {
      border: none;
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
      border-radius: 999px;
      padding: 1px 8px;
      font: inherit;
      font-size: 10px;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .tile-badge.busy svg {
        animation: kibble-add-photos-spin 0.9s linear infinite;
      }
    }
    @keyframes kibble-add-photos-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .primary {
      min-height: 44px;
      border-radius: 10px;
      border: none;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .primary:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .progress,
    .tally {
      margin: 0;
      text-align: center;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .adjust {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.94);
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
      max-width: 100%;
      max-height: 100%;
    }
    .adjust-done {
      align-self: center;
      min-height: 44px;
      padding: 0 28px;
      border-radius: 999px;
      border: none;
      background: #fff;
      color: #111;
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .close:focus-visible,
    .tile-photo:focus-visible,
    .remove:focus-visible,
    .primary:focus-visible,
    .adjust-done:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-add-photos-sheet", KibbleAddPhotosSheet);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-add-photos-sheet": KibbleAddPhotosSheet;
  }
}
