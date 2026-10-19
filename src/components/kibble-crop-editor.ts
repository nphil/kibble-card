/** A pointer-driven square crop frame over one photo: drag the body to move it, drag a corner to
 * resize it (locked square in source pixels, per `lib/photo-crop.ts`), pinch with two touches to
 * resize the same way. Purely a controlled overlay -- `crop` is owned by the caller and only
 * ever changed by dispatching `crop-changed`, the same contract every dialog in this card set
 * already uses (`kibble-label-sheet.ts`'s header). `circleGuide` draws a dashed circle inside the
 * frame for the avatar picker's "circle-safe" upload tile, a purely visual hint -- the crop
 * itself is always the square; a native `border-radius: 50%` elsewhere is what actually clips it
 * to a circle later.
 *
 * The stage's own box is set to the photo's exact aspect ratio (`aspect-ratio` CSS) and the
 * `<img>` fills it edge to edge -- no letterboxing -- so the stage's `getBoundingClientRect()` is
 * exactly the image's own pixel box and `detection-areas.ts`'s `clientPointToNormalized` needs no
 * extra offset math.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { clientPointToNormalized, type NormalizedArea, type NormalizedPoint } from "../lib/detection-areas";
import { moveSquareCrop, pinchDistance, resizeSquareCrop, scaleSquareCrop, type CropCorner, type ImageSize } from "../lib/photo-crop";

const CORNERS: readonly CropCorner[] = ["nw", "ne", "se", "sw"];

export class KibbleCropEditor extends LitElement {
  static properties = {
    imageUrl: { type: String },
    naturalWidth: { type: Number },
    naturalHeight: { type: Number },
    crop: { attribute: false },
    circleGuide: { type: Boolean },
    interactive: { type: Boolean },
    fitParent: { type: Boolean },
  };

  declare imageUrl: string;
  declare naturalWidth: number;
  declare naturalHeight: number;
  declare crop: NormalizedArea;
  declare circleGuide: boolean;
  declare interactive: boolean;
  /** When set, this element measures its own parent (via `ResizeObserver`) and sets its own
   * pixel `width`/`height` to the largest size that both preserves `naturalWidth`/
   * `naturalHeight`'s aspect ratio and fits entirely inside that parent -- the full-screen
   * "adjust this one photo" views need to cap a portrait phone photo's height as well as its
   * width, which plain CSS (`aspect-ratio` sized purely from an ambiguous auto/auto flex item)
   * does not reliably resolve across engines. Unset (the default, the photo grid's read-only
   * tiles) keeps the simpler CSS-only behavior: fill the parent's width, derive height from
   * the aspect ratio, since a grid cell's own row is meant to grow to match anyway. */
  declare fitParent: boolean;

  private readonly _stageRef = createRef<HTMLDivElement>();
  private readonly _pointers = new Map<number, NormalizedPoint>();
  private _dragCorner: CropCorner | null = null;
  private _dragMoveStart: { point: NormalizedPoint; crop: NormalizedArea } | null = null;
  private _pinchStart: { distance: number; crop: NormalizedArea } | null = null;

  constructor() {
    super();
    this.imageUrl = "";
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.crop = [0, 0, 1, 1];
    this.circleGuide = false;
    this.interactive = true;
    this.fitParent = false;
  }

  private _resizeObserver: ResizeObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.fitParent && this.parentElement && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(() => this._applyParentFit());
      this._resizeObserver.observe(this.parentElement);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  protected updated(changed: PropertyValues): void {
    if (this.fitParent && (changed.has("naturalWidth") || changed.has("naturalHeight"))) this._applyParentFit();
  }

  /** Sets this element's own inline pixel size to the largest box that fits within the parent's
   * current content box while preserving the photo's aspect ratio -- plain containment
   * arithmetic, computed here instead of leaned on CSS because the parent's resolved size (not
   * just its CSS declaration) is the only thing that can never be ambiguous. */
  private _applyParentFit(): void {
    const parent = this.parentElement;
    if (!parent || this.naturalWidth <= 0 || this.naturalHeight <= 0) return;
    const boxWidth = parent.clientWidth;
    const boxHeight = parent.clientHeight;
    if (boxWidth <= 0 || boxHeight <= 0) return;
    const scale = Math.min(boxWidth / this.naturalWidth, boxHeight / this.naturalHeight);
    this.style.width = `${Math.max(1, this.naturalWidth * scale)}px`;
    this.style.height = `${Math.max(1, this.naturalHeight * scale)}px`;
  }

  private _pointToNormalized(clientX: number, clientY: number): NormalizedPoint | null {
    const rect = this._stageRef.value?.getBoundingClientRect();
    return rect ? clientPointToNormalized(clientX, clientY, rect) : null;
  }

  private _emitChange(next: NormalizedArea): void {
    this.crop = next;
    this.dispatchEvent(new CustomEvent<{ crop: NormalizedArea }>("crop-changed", { detail: { crop: next }, bubbles: true, composed: true }));
  }

  private _beginPinch(): void {
    this._dragCorner = null;
    this._dragMoveStart = null;
    const points = [...this._pointers.values()];
    if (points.length < 2) return;
    this._pinchStart = { distance: pinchDistance(points[0]!, points[1]!), crop: this.crop };
  }

  private _capture(event: PointerEvent): void {
    this._stageRef.value?.setPointerCapture(event.pointerId);
    const point = this._pointToNormalized(event.clientX, event.clientY);
    if (point) this._pointers.set(event.pointerId, point);
  }

  private _onHandlePointerDown(corner: CropCorner, event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this._capture(event);
    if (this._pointers.size >= 2) this._beginPinch();
    else this._dragCorner = corner;
  }

  private _onBodyPointerDown(event: PointerEvent): void {
    if (!this.interactive) return;
    event.preventDefault();
    this._capture(event);
    if (this._pointers.size >= 2) {
      this._beginPinch();
      return;
    }
    const point = this._pointToNormalized(event.clientX, event.clientY);
    if (point) this._dragMoveStart = { point, crop: this.crop };
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._pointers.has(event.pointerId)) return;
    const point = this._pointToNormalized(event.clientX, event.clientY);
    if (!point) return;
    this._pointers.set(event.pointerId, point);
    const size: ImageSize = { width: this.naturalWidth, height: this.naturalHeight };
    if (this._pinchStart && this._pointers.size >= 2) {
      const points = [...this._pointers.values()];
      const distance = pinchDistance(points[0]!, points[1]!);
      if (this._pinchStart.distance > 0) this._emitChange(scaleSquareCrop(this._pinchStart.crop, distance / this._pinchStart.distance, size));
      return;
    }
    if (this._dragCorner) {
      this._emitChange(resizeSquareCrop(this.crop, this._dragCorner, point, size));
      return;
    }
    if (this._dragMoveStart) {
      this._emitChange(moveSquareCrop(this._dragMoveStart.crop, point.x - this._dragMoveStart.point.x, point.y - this._dragMoveStart.point.y));
    }
  }

  private _onPointerUp(event: PointerEvent): void {
    this._pointers.delete(event.pointerId);
    if (this._pointers.size < 2) this._pinchStart = null;
    if (this._pointers.size === 0) {
      this._dragCorner = null;
      this._dragMoveStart = null;
    }
  }

  render() {
    const [x1, y1, x2, y2] = this.crop;
    const frameStyle = `left:${x1 * 100}%;top:${y1 * 100}%;width:${(x2 - x1) * 100}%;height:${(y2 - y1) * 100}%;`;
    const aspect = this.naturalWidth > 0 && this.naturalHeight > 0 ? `${this.naturalWidth} / ${this.naturalHeight}` : "1 / 1";
    return html`
      <div
        class="stage"
        style="aspect-ratio:${aspect};cursor:${this.interactive ? "move" : "default"}"
        ${ref(this._stageRef)}
        @pointerdown=${(e: PointerEvent) => this._onBodyPointerDown(e)}
        @pointermove=${(e: PointerEvent) => this._onPointerMove(e)}
        @pointerup=${(e: PointerEvent) => this._onPointerUp(e)}
        @pointercancel=${(e: PointerEvent) => this._onPointerUp(e)}
      >
        ${this.imageUrl ? html`<img src=${this.imageUrl} alt="" draggable="false" />` : nothing}
        <div class="frame" style=${frameStyle}>
          ${this.circleGuide ? html`<div class="circle-guide"></div>` : nothing}
          ${this.interactive ? CORNERS.map((corner) => html`<button type="button" class="handle handle-${corner}" aria-label="Resize crop" @pointerdown=${(e: PointerEvent) => this._onHandlePointerDown(corner, e)}></button>`) : nothing}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
    .stage {
      position: relative;
      width: 100%;
      overflow: hidden;
      touch-action: none;
      background: #000;
      border-radius: 8px;
    }
    .stage img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      pointer-events: none;
      user-select: none;
    }
    .frame {
      position: absolute;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      border: 2px solid #fff;
      box-sizing: border-box;
    }
    .circle-guide {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px dashed rgba(255, 255, 255, 0.85);
      pointer-events: none;
    }
    .handle {
      position: absolute;
      width: 28px;
      height: 28px;
      margin: -14px;
      padding: 0;
      border: none;
      background: none;
      touch-action: none;
      cursor: pointer;
    }
    .handle::after {
      content: "";
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .handle-nw {
      left: 0;
      top: 0;
      cursor: nwse-resize;
    }
    .handle-ne {
      right: 0;
      top: 0;
      left: auto;
      cursor: nesw-resize;
    }
    .handle-se {
      right: 0;
      bottom: 0;
      left: auto;
      cursor: nwse-resize;
    }
    .handle-sw {
      left: 0;
      bottom: 0;
      cursor: nesw-resize;
    }
  `;
}

customElements.define("kibble-crop-editor", KibbleCropEditor);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-crop-editor": KibbleCropEditor;
  }
}
