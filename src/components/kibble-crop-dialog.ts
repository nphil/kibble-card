/** The manual face-crop tool behind the cats card's "Add photos": drag the square to cover the
 * cat's face, drag its corner to resize, always 1:1 -- the classifier wants a 224x224 face crop,
 * and a live preview canvas is the honest way to show exactly what will be uploaded, not a guess
 * at what the crop might look like. A controlled overlay: the parent owns `open`/`file`/the
 * upload queue and this only ever emits `use-crop` (the finished 224x224 JPEG blob) or asks to
 * close (skip this photo), the same contract `kibble-lightbox`/`kibble-face-picker` already use.
 *
 * Pointer Events (not separate touch handlers) drive the drag/resize, with `setPointerCapture`
 * so a fast drag keeps tracking even once the pointer leaves the handle's small hitbox -- this
 * is what makes touch and mouse behave identically here.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";

const CROP_SIZE_PX = 224;
const INITIAL_SELECTION_FRACTION = 0.7;
const MIN_SELECTION_FRACTION = 0.15;

interface Selection {
  x: number;
  y: number;
  size: number;
}

interface DragState {
  mode: "move" | "resize";
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startSelection: Selection;
  scale: number;
}

export class KibbleCropDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    file: { attribute: false },
    catName: { type: String, attribute: "cat-name" },
    queueIndex: { type: Number, attribute: "queue-index" },
    queueTotal: { type: Number, attribute: "queue-total" },
    busy: { type: Boolean },
    error: { type: String },
  };

  declare open: boolean;
  declare file: File | null;
  declare catName: string | null;
  declare queueIndex: number;
  declare queueTotal: number;
  declare busy: boolean;
  declare error: string | null;

  private _imgRef = createRef<HTMLImageElement>();
  private _canvasRef = createRef<HTMLCanvasElement>();
  private _cancelButtonRef = createRef<HTMLButtonElement>();

  private _objectUrl: string | null = null;
  private _resolvedFile: File | null = null;
  private _naturalWidth = 0;
  private _naturalHeight = 0;
  private _selection: Selection | null = null;
  private _lastBlob: Blob | null = null;
  private _dragState: DragState | null = null;

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this._close();
    }
  };

  constructor() {
    super();
    this.open = false;
    this.file = null;
    this.catName = null;
    this.queueIndex = 0;
    this.queueTotal = 1;
    this.busy = false;
    this.error = null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
  }

  protected willUpdate(): void {
    if (this.file !== this._resolvedFile) {
      this._resolvedFile = this.file;
      if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
      this._objectUrl = this.file ? URL.createObjectURL(this.file) : null;
      this._naturalWidth = 0;
      this._naturalHeight = 0;
      this._selection = null;
      this._lastBlob = null;
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._cancelButtonRef.value?.focus();
    }
  }

  render() {
    if (!this.open) return nothing;
    const showQueue = this.queueTotal > 1;
    const isLast = this.queueIndex >= this.queueTotal - 1;
    return html`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${`Crop a photo of ${this.catName ?? "this cat"}`}>
        <div class="sheet" @click=${(event: Event) => event.stopPropagation()}>
          <div class="heading">
            <span>Add a photo of ${this.catName ?? "this cat"}</span>
            ${showQueue ? html`<span class="queue">Photo ${this.queueIndex + 1} of ${this.queueTotal}</span>` : nothing}
          </div>
          <div class="stage">
            ${this._objectUrl ? html`<img ${ref(this._imgRef)} src=${this._objectUrl} alt="" @load=${this._onImageLoad} />` : nothing}
            ${this._selection ? this._renderSelection() : nothing}
          </div>
          <div class="preview-row">
            <canvas ${ref(this._canvasRef)} class="preview" width=${CROP_SIZE_PX} height=${CROP_SIZE_PX} aria-hidden="true"></canvas>
            <p class="hint">
              Drag the square to cover the cat's face, drag its corner to resize. This becomes the training photo
              -- ${CROP_SIZE_PX}\u00d7${CROP_SIZE_PX}.
            </p>
          </div>
          ${this.error
            ? html`
                <div class="error">
                  <span>${this.error}</span>
                  <button type="button" @click=${this._retry}>Try again</button>
                </div>
              `
            : nothing}
          <div class="actions">
            <button type="button" class="cancel" ${ref(this._cancelButtonRef)} ?disabled=${this.busy} @click=${this._close}>
              ${showQueue && !isLast ? "Skip" : "Cancel"}
            </button>
            <button type="button" class="use" ?disabled=${this.busy || !this._selection} @click=${this._useCrop}>
              ${this.busy ? "Uploading\u2026" : "Use this crop"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderSelection() {
    const img = this._imgRef.value;
    const sel = this._selection;
    if (!img || !sel || this._naturalWidth === 0) return nothing;
    const imgRect = img.getBoundingClientRect();
    const stageRect = img.parentElement!.getBoundingClientRect();
    const scale = imgRect.width / this._naturalWidth;
    const left = imgRect.left - stageRect.left + sel.x * scale;
    const top = imgRect.top - stageRect.top + sel.y * scale;
    const size = sel.size * scale;
    return html`
      <div
        class="selection"
        tabindex="0"
        role="group"
        aria-label="Face crop area"
        style="left: ${left}px; top: ${top}px; width: ${size}px; height: ${size}px;"
        @pointerdown=${(event: PointerEvent) => this._beginDrag(event, "move")}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
        @keydown=${this._onSelectionKeydown}
      >
        <div
          class="handle"
          @pointerdown=${(event: PointerEvent) => this._beginDrag(event, "resize")}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._endDrag}
          @pointercancel=${this._endDrag}
        ></div>
      </div>
    `;
  }

  private _onImageLoad = (): void => {
    const img = this._imgRef.value;
    if (!img) return;
    this._naturalWidth = img.naturalWidth;
    this._naturalHeight = img.naturalHeight;
    const size = Math.min(this._naturalWidth, this._naturalHeight) * INITIAL_SELECTION_FRACTION;
    this._selection = { x: (this._naturalWidth - size) / 2, y: (this._naturalHeight - size) / 2, size };
    this.requestUpdate();
    this._drawPreview();
  };

  private _beginDrag(event: PointerEvent, mode: "move" | "resize"): void {
    if (mode === "resize") event.stopPropagation();
    const img = this._imgRef.value;
    if (!img || !this._selection || this._naturalWidth === 0) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._dragState = {
      mode,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startSelection: { ...this._selection },
      scale: img.getBoundingClientRect().width / this._naturalWidth,
    };
  }

  private _onPointerMove = (event: PointerEvent): void => {
    const drag = this._dragState;
    if (!drag || drag.pointerId !== event.pointerId || drag.scale === 0) return;
    event.preventDefault();
    const dx = (event.clientX - drag.startClientX) / drag.scale;
    const dy = (event.clientY - drag.startClientY) / drag.scale;
    if (drag.mode === "move") {
      this._selection = this._clamp({ ...drag.startSelection, x: drag.startSelection.x + dx, y: drag.startSelection.y + dy });
    } else {
      const delta = Math.max(dx, dy);
      this._selection = this._clamp({ ...drag.startSelection, size: drag.startSelection.size + delta });
    }
    this.requestUpdate();
    this._drawPreview();
  };

  private _endDrag = (event: PointerEvent): void => {
    if (this._dragState?.pointerId === event.pointerId) this._dragState = null;
  };

  private _onSelectionKeydown = (event: KeyboardEvent): void => {
    if (!this._selection || this._naturalWidth === 0) return;
    const step = Math.max(2, Math.round(Math.min(this._naturalWidth, this._naturalHeight) * 0.02));
    const sel = { ...this._selection };
    switch (event.key) {
      case "ArrowLeft":
        sel.x -= step;
        break;
      case "ArrowRight":
        sel.x += step;
        break;
      case "ArrowUp":
        sel.y -= step;
        break;
      case "ArrowDown":
        sel.y += step;
        break;
      case "+":
      case "=":
        sel.x -= step / 2;
        sel.y -= step / 2;
        sel.size += step;
        break;
      case "-":
      case "_":
        sel.x += step / 2;
        sel.y += step / 2;
        sel.size -= step;
        break;
      default:
        return;
    }
    event.preventDefault();
    this._selection = this._clamp(sel);
    this.requestUpdate();
    this._drawPreview();
  };

  private _clamp(sel: Selection): Selection {
    const maxSize = Math.min(this._naturalWidth, this._naturalHeight);
    const minSize = Math.max(8, maxSize * MIN_SELECTION_FRACTION);
    const size = Math.min(Math.max(sel.size, minSize), maxSize);
    const x = Math.min(Math.max(sel.x, 0), this._naturalWidth - size);
    const y = Math.min(Math.max(sel.y, 0), this._naturalHeight - size);
    return { x, y, size };
  }

  private _drawPreview(): void {
    const canvas = this._canvasRef.value;
    const img = this._imgRef.value;
    const sel = this._selection;
    if (!canvas || !img || !sel) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CROP_SIZE_PX, CROP_SIZE_PX);
    ctx.drawImage(img, sel.x, sel.y, sel.size, sel.size, 0, 0, CROP_SIZE_PX, CROP_SIZE_PX);
  }

  /** The live preview canvas IS the source of truth for what gets uploaded -- it already holds
   * exactly the pixels the selection covers, redrawn on every drag, so there is no separate
   * offscreen render step here. */
  private _useCrop = (): void => {
    const canvas = this._canvasRef.value;
    if (!canvas || !this._selection) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        this._lastBlob = blob;
        this.dispatchEvent(new CustomEvent("use-crop", { detail: { blob }, bubbles: true, composed: true }));
      },
      "image/jpeg",
      0.9,
    );
  };

  private _retry = (): void => {
    if (!this._lastBlob) return;
    this.dispatchEvent(new CustomEvent("use-crop", { detail: { blob: this._lastBlob }, bubbles: true, composed: true }));
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
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 420px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    .heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .queue {
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .stage {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      border-radius: 8px;
      max-height: 50vh;
    }
    .stage img {
      display: block;
      max-width: 100%;
      max-height: 50vh;
      user-select: none;
      -webkit-user-drag: none;
    }
    .selection {
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #fff;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      cursor: move;
      touch-action: none;
    }
    .selection:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .handle {
      position: absolute;
      right: -9px;
      bottom: -9px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid var(--primary-color, #03a9f4);
      cursor: nwse-resize;
      touch-action: none;
    }
    .preview-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .preview {
      flex: 0 0 auto;
      width: 72px;
      height: 72px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color);
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
      font-size: 13px;
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
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .actions button {
      min-height: 44px;
      border-radius: 8px;
      border: none;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      padding: 0 16px;
    }
    .cancel {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .use {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
    }
    .actions button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .actions button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-crop-dialog", KibbleCropDialog);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-crop-dialog": KibbleCropDialog;
  }
}
