/** Ignore-mask and bowl-zone editor for the vision detector, in the style of UniFi Protect's
 * privacy/exclusion zones and Frigate's object masks: a live camera still, rectangles you draw
 * and drag, and nothing else to configure. A controlled overlay, the same contract every dialog
 * in this repo uses -- the parent owns `open`, this only ever asks to close (`close-requested`)
 * or reports a save (`saved`).
 *
 * ## Why there is no "include"/"Focus" area anymore
 *
 * The previous editor had two kinds of region: exclude (ignore this spot) and include (only
 * look inside this spot). Removed here, end to end (UI, `types.ts`, the WS contract, and
 * `librefeed/daemon/src/vision.rs`'s `body_include_rois`), on evidence, not just because it went
 * unused:
 *
 * - The live feeder's own config had both arrays empty -- nobody had drawn either kind.
 * - The daemon's `body_area_filter_reason` gates admission by CENTROID containment: a body whose
 *   center falls outside every include box is filtered out with reason `"outside_include"` and
 *   never becomes a track, a sample, or a bowl-overlap check -- silently, with no surfaced
 *   feedback in this card. A mis-drawn include box (too tight, or drawn against a stale frame)
 *   quietly stops the feeder from ever seeing a cat, with nothing on screen to explain why.
 * - Reference products agree exclude-only is the right tool here. Frigate's docs are explicit:
 *   "masks should be used sparingly; in most cases where users reach for one, a zone with
 *   required_zones is the right tool instead" -- and Frigate's zones scope which already-detected
 *   objects count as an *alert*, they never gate the underlying detector the way this card's old
 *   include boxes did (docs.frigate.video/configuration/masks,
 *   docs.frigate.video/configuration/zones). UniFi Protect's Smart Detection Zones are the
 *   closest thing to a positive/include region, and even there the documented pattern is "draw
 *   one broad zone (often the whole frame), then cut exclusion zones out of it for false
 *   positives" (help.ui.com/hc/en-us/articles/360056987954) -- exclusion is still the tool doing
 *   the real work.
 * - This camera is fixed and single-purpose: one bowl, one job. There is no "driveway vs. sky"
 *   scene worth scoping positively; a cat anywhere in frame near the bowl is relevant. The one
 *   region that genuinely needs to be scoped -- "is the animal at the bowl" -- already has its
 *   own dedicated concept below (the bowl zone), which is what Frigate/UniFi's zone idea maps to
 *   here, not a second general-purpose include mask.
 *
 * ## Why rectangles, not polygons
 *
 * The daemon's own ROI math (`rois_intersect`, `roi_iou`, the exclusion centroid test) is
 * axis-aligned boxes throughout, on a 92 MB embedded device with a hand-rolled JSON parser and
 * an extensive existing test suite. Teaching it point-in-polygon masks would touch that
 * per-frame, per-body hot path and the wire format for a UX gain this scene rarely needs -- a
 * handful of rectangles already covers "mask out that window" or "mask out the shelf". Resize
 * handles on a rectangle (corners + edge midpoints, `lib/detection-areas.ts`) give most of a
 * polygon editor's directness -- drag any edge or corner, exactly like "drag vertices" -- at a
 * fraction of the risk and with zero daemon wire changes. Two spots where the polygon-editor
 * brief doesn't translate 1:1, both substituted deliberately rather than silently dropped:
 * "tap an edge midpoint to add a point" has no rectangle analog (there is no arbitrary point to
 * add), so an edge handle resizes that edge instead; "long-press or right-click to delete a
 * point" becomes right-click (and the always-visible list row's delete button) to delete a whole
 * mask -- long-press was left out specifically because it would have to race the same pointer
 * that a touch move-drag already captures, for a gesture the list's delete button already covers
 * unambiguously.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { HomeAssistant, VisionAreas, VisionBowl, VisionDetection, VisionFrame } from "../types";
import {
  DEFAULT_BOWL_ROI,
  HANDLE_IDS,
  areaHeight,
  areaWidth,
  clientPointToNormalized,
  handlePoint,
  isDrawableArea,
  moveArea,
  normalizedAreaFromPoints,
  normalizeWireArea,
  normalizeWireAreas,
  resizeAreaFromHandle,
  type HandleId,
  type NormalizedArea,
  type NormalizedPoint,
} from "../lib/detection-areas";
import { boxRect } from "../lib/boxes";
import { describeWsError } from "../lib/ws-query";
import { mdiIcon } from "../lib/mdi-icons";

/** Same cadence as the live hero's own detection overlay (`kibble-live-hero.ts`) -- the daemon
 * only re-analyses at its own configured interval, polling faster just re-reads the same frame. */
const VISION_POLL_MS = 1000;
const NUDGE_STEP = 0.01;
const UNDO_LIMIT = 50;

const HANDLE_CURSOR: Record<HandleId, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

type EditTarget = { kind: "mask"; index: number } | { kind: "bowl" };

interface EditDrag {
  pointerId: number;
  target: EditTarget;
  /** `null` means dragging the shape's body (move), not a handle (resize). */
  handle: HandleId | null;
  start: NormalizedPoint;
  original: NormalizedArea;
}

interface EditorSnapshot {
  masks: NormalizedArea[];
  bowl: NormalizedArea;
}

/** Full-camera still editor for the vision detector's ignore masks and bowl zone. */
export class KibbleDetectionAreasDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    cameraEntity: { attribute: false },
    entryId: { attribute: false },
    open: { type: Boolean, reflect: true },
  };

  declare hass: HomeAssistant;
  declare cameraEntity: string | undefined;
  declare entryId: string | undefined;
  declare open: boolean;

  private _imageRef = createRef<HTMLImageElement>();
  private _cancelRef = createRef<HTMLButtonElement>();
  private _imageUrl: string | null = null;
  private _imagePath: string | null = null;
  private _objectUrl: string | null = null;

  private _masks: NormalizedArea[] = [];
  private _bowl: NormalizedArea = DEFAULT_BOWL_ROI;
  private _baseline: EditorSnapshot | null = null;
  private _selected: EditTarget | null = null;
  private _hidden = new Set<number>();
  private _undoStack: EditorSnapshot[] = [];

  /** New-mask drag (empty stage -> a fresh rectangle), mirrors the stage's own pointer capture. */
  private _drawStart: NormalizedPoint | null = null;
  private _drawing: NormalizedArea | null = null;
  private _pointerId: number | null = null;
  /** Existing-shape drag (move or resize), captured on the shape/handle element itself. */
  private _edit: EditDrag | null = null;

  private _showDetections = false;
  private _visionFrame: VisionFrame | null = null;
  private _visionTimer: number | undefined = undefined;

  private _confirmDiscard = false;
  private _loading = false;
  private _saving = false;
  private _error: string | null = null;
  private _loadGeneration = 0;

  constructor() {
    super();
    this.open = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._revokeObjectUrl();
    this._stopVisionPolling();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._cancelRef.value?.focus();
      void this._loadEditor();
    }
    if (changed.has("open") && !this.open) {
      this._drawStart = null;
      this._drawing = null;
      this._pointerId = null;
      this._edit = null;
      this._selected = null;
      this._confirmDiscard = false;
      this._showDetections = false;
      this._stopVisionPolling();
    }
  }

  render() {
    if (!this.open) return nothing;
    const canSave = !this._loading && !this._saving && Boolean(this.entryId);
    return html`
      <div class="backdrop" @click=${this._requestClose}>
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detection-areas-title"
          @click=${(event: Event) => event.stopPropagation()}
          @keydown=${this._onKeydown}
        >
          <header class="header">
            <h2 id="detection-areas-title">Detection areas</h2>
            <button type="button" class="icon-button" aria-label="Close" @click=${this._requestClose}>${mdiIcon("close")}</button>
          </header>

          <div class="body">
            <div class="toolbar" role="group" aria-label="Editor tools">
              <button
                type="button"
                class="toggle-pill ${this._showDetections ? "active" : ""}"
                aria-pressed=${this._showDetections}
                @click=${this._toggleDetections}
              >
                <span class="swatch detections"></span>Show detections
              </button>
              <button
                type="button"
                class="quiet-button"
                ?disabled=${!this._undoStack.length || this._saving}
                @click=${this._undo}
              >
                ${mdiIcon("undo")}Undo
              </button>
            </div>

            <div class="stage-wrap">
              ${this._imageUrl
                ? this._renderStage()
                : html`<div class="empty-stage">${this._loading ? "Loading camera still…" : "Camera still unavailable"}</div>`}
            </div>

            ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}

            <div class="lists">
              <section class="mask-section">
                <h3>Ignore masks</h3>
                ${this._masks.length ? html`<ul class="mask-list">${this._masks.map((area, index) => this._renderMaskRow(area, index))}</ul>` : nothing}
              </section>
              <section class="mask-section">
                <h3>Bowl zone</h3>
                ${this._renderBowlRow()}
              </section>
            </div>
          </div>

          <footer class="footer">${this._confirmDiscard ? this._renderDiscardConfirm() : this._renderFooterActions(canSave)}</footer>
        </section>
      </div>
    `;
  }

  private _renderFooterActions(canSave: boolean) {
    return html`
      <button type="button" class="cancel" ${ref(this._cancelRef)} ?disabled=${this._saving} @click=${this._requestClose}>Cancel</button>
      <button type="button" class="save" ?disabled=${!canSave} @click=${this._save}>${this._saving ? "Saving…" : "Save"}</button>
    `;
  }

  private _renderDiscardConfirm() {
    return html`
      <p class="discard-prompt" role="alert">Discard unsaved changes?</p>
      <button type="button" class="quiet-button" @click=${this._keepEditing}>Keep editing</button>
      <button type="button" class="cancel discard" @click=${this._requestClose}>Discard</button>
    `;
  }

  // ---- stage ------------------------------------------------------------------------------

  /** Handles for the selected shape are rendered here, as siblings of `.shape`, positioned
   * relative to the STAGE (the same coordinate space `handlePoint` returns) -- NOT nested
   * inside `.shape`. `.shape` itself is already offset and scaled to the mask's own box via
   * its own left/top/width/height percentages; a handle nested inside it would have its
   * stage-fraction coordinates re-interpreted as a fraction of that already-scaled box,
   * bunching every handle into one corner instead of spanning the shape's corners and edges. */
  private _renderStage() {
    const selectedArea = this._selected ? this._areaFor(this._selected) : null;
    const ratio = this._stageAspectRatio();
    const stageStyle = `aspect-ratio:${ratio};width:min(100%, calc(min(60vh, 640px) * ${ratio}));`;
    return html`
      <div
        class="stage"
        style=${stageStyle}
        @pointerdown=${this._onStagePointerDown}
        @pointermove=${this._onStageMove}
        @pointerup=${this._onStageUp}
        @pointercancel=${this._onStageCancel}
      >
        <img ${ref(this._imageRef)} src=${this._imageUrl} alt="Feeder camera still" @load=${this._onImageLoad} />
        ${this._showDetections ? this._renderDetections() : nothing}
        ${this._masks.length === 0 ? html`<p class="stage-hint" aria-hidden="true">Drag to mask an area</p>` : nothing}
        ${this._renderShape(this._bowl, { kind: "bowl" }, this._selected?.kind === "bowl", "bowl", "Bowl zone")}
        ${this._masks.map((area, index) => {
          if (this._hidden.has(index)) return nothing;
          const selected = this._selected?.kind === "mask" && this._selected.index === index;
          return this._renderShape(area, { kind: "mask", index }, selected, "mask", `Mask ${index + 1}`);
        })}
        ${this._drawing ? this._renderDrawingPreview(this._drawing) : nothing}
        ${this._selected && selectedArea ? HANDLE_IDS.map((handle) => this._renderHandle(selectedArea, this._selected!, handle)) : nothing}
      </div>
    `;
  }

  private _renderDetections() {
    const detections: VisionDetection[] = this._visionFrame?.detections ?? [];
    return detections.map((detection) => {
      const rect = boxRect([detection.x1, detection.y1, detection.x2, detection.y2]);
      const style = `left:${rect.left};top:${rect.top};width:${rect.width};height:${rect.height};`;
      return html`<div class="detection ${detection.admitted ? "" : "quiet"}" style=${style}></div>`;
    });
  }

  private _renderShape(area: NormalizedArea, target: EditTarget, selected: boolean, kindClass: "mask" | "bowl", label: string) {
    const style = `left:${area[0] * 100}%;top:${area[1] * 100}%;width:${areaWidth(area) * 100}%;height:${areaHeight(area) * 100}%;`;
    return html`
      <div class="shape ${kindClass} ${selected ? "selected" : ""}" style=${style}>
        <button
          type="button"
          class="shape-body"
          aria-label="${label}${selected ? ", selected" : ""}"
          @pointerdown=${(event: PointerEvent) => this._beginMove(event, target)}
          @pointermove=${this._onEditMove}
          @pointerup=${this._onEditEnd}
          @pointercancel=${this._onEditEnd}
          @click=${() => this._selectTarget(target)}
          @contextmenu=${(event: Event) => this._onShapeContextMenu(event, target)}
        >
          <span class="shape-tag">${label}</span>
        </button>
      </div>
    `;
  }

  private _renderHandle(area: NormalizedArea, target: EditTarget, handle: HandleId) {
    const point = handlePoint(area, handle);
    const style = `left:${point.x * 100}%;top:${point.y * 100}%;cursor:${HANDLE_CURSOR[handle]};`;
    return html`
      <div
        class="handle"
        style=${style}
        aria-hidden="true"
        @pointerdown=${(event: PointerEvent) => this._beginResize(event, target, handle)}
        @pointermove=${this._onEditMove}
        @pointerup=${this._onEditEnd}
        @pointercancel=${this._onEditEnd}
      >
        <span class="handle-dot"></span>
      </div>
    `;
  }

  private _renderDrawingPreview(area: NormalizedArea) {
    const style = `left:${area[0] * 100}%;top:${area[1] * 100}%;width:${areaWidth(area) * 100}%;height:${areaHeight(area) * 100}%;`;
    return html`<div class="shape mask drawing" style=${style}><div class="shape-body"></div></div>`;
  }

  // ---- lists --------------------------------------------------------------------------------

  private _renderMaskRow(area: NormalizedArea, index: number) {
    const selected = this._selected?.kind === "mask" && this._selected.index === index;
    const hidden = this._hidden.has(index);
    return html`
      <li class="mask-row ${selected ? "selected" : ""}">
        <button type="button" class="mask-row-label" @click=${() => this._selectTarget({ kind: "mask", index })}>
          <span class="swatch exclude"></span>Mask ${index + 1}
        </button>
        <button
          type="button"
          class="icon-button"
          aria-label="${hidden ? "Show" : "Hide"} mask ${index + 1}"
          @click=${() => this._toggleVisibility(index)}
        >
          ${mdiIcon(hidden ? "eyeOff" : "eye")}
        </button>
        <button type="button" class="icon-button" aria-label="Delete mask ${index + 1}" @click=${() => this._deleteMask(index)}>
          ${mdiIcon("deleteOutline")}
        </button>
      </li>
    `;
  }

  private _renderBowlRow() {
    const selected = this._selected?.kind === "bowl";
    return html`
      <div class="mask-row bowl-row ${selected ? "selected" : ""}">
        <button type="button" class="mask-row-label" @click=${() => this._selectTarget({ kind: "bowl" })}>
          <span class="swatch bowl"></span>Bowl zone
        </button>
        <button type="button" class="quiet-button" @click=${this._resetBowl}>Reset</button>
      </div>
    `;
  }

  // ---- data loading -------------------------------------------------------------------------

  private async _loadEditor(): Promise<void> {
    const generation = ++this._loadGeneration;
    this._error = null;
    this._selected = null;
    this._drawing = null;
    this._undoStack = [];
    this._hidden = new Set();
    this._confirmDiscard = false;
    this._loading = true;
    this.requestUpdate();
    await Promise.all([this._loadAreas(), this._loadImage()]);
    if (generation === this._loadGeneration) {
      this._loading = false;
      this.requestUpdate();
    }
  }

  private async _loadAreas(): Promise<void> {
    const callWS = this.hass?.callWS;
    if (!callWS || !this.entryId) {
      this._masks = [];
      this._bowl = DEFAULT_BOWL_ROI;
      this._baseline = { masks: [], bowl: DEFAULT_BOWL_ROI };
      return;
    }
    try {
      const [areas, bowl] = await Promise.all([
        callWS({ type: "kibble/vision/areas", entry_id: this.entryId }) as Promise<VisionAreas>,
        callWS({ type: "kibble/vision/bowl", entry_id: this.entryId }) as Promise<VisionBowl>,
      ]);
      this._masks = normalizeWireAreas(areas.exclude);
      this._bowl = normalizeWireArea(bowl.bowl_roi) ?? DEFAULT_BOWL_ROI;
    } catch (error) {
      this._error = describeWsError(error);
      this._masks = [];
      this._bowl = DEFAULT_BOWL_ROI;
    }
    this._baseline = { masks: this._masks, bowl: this._bowl };
  }

  private async _loadImage(): Promise<void> {
    const entity = this.cameraEntity ? this.hass?.states[this.cameraEntity] : undefined;
    const path = typeof entity?.attributes.entity_picture === "string" ? entity.attributes.entity_picture : null;
    if (path === this._imagePath && this._imageUrl) return;
    this._imagePath = path;
    if (!path) {
      if (!this._imageUrl) this.requestUpdate();
      return;
    }
    if (!this.hass.fetchWithAuth) {
      this._imageUrl = path;
      this.requestUpdate();
      return;
    }
    try {
      const response = await this.hass.fetchWithAuth(path);
      if (!response.ok) throw new Error("Camera still could not be loaded.");
      const blob = await response.blob();
      const nextObjectUrl = URL.createObjectURL(blob);
      this._revokeObjectUrl();
      this._objectUrl = nextObjectUrl;
      this._imageUrl = nextObjectUrl;
    } catch (error) {
      // "Falling back to the latest frame" only means something if a prior frame survives the
      // error -- a failed refresh keeps showing the last still that DID load. A dialog that has
      // never once loaded a frame still surfaces the error clearly instead of showing nothing.
      if (!this._imageUrl) this._error = error instanceof Error ? error.message : "Camera still could not be loaded.";
    }
    this.requestUpdate();
  }

  private _onImageLoad = (): void => {
    this.requestUpdate();
  };

  /** The real snapshot's own width/height ratio -- an aspect-ratio-correct `.stage` box is
   * what fills it edge to edge with no letterbox bands, instead of the stage falling back to
   * some unrelated block-flow height. Priority: the loaded `<img>`'s own decoded size (most
   * authoritative, and already the exact box mask coordinates are drawn against), else the
   * most recent `kibble/vision/last` frame's `w`/`h` (present before the image has loaded, if
   * detection polling happens to already be running), else a plain 16:9 guess. */
  private _stageAspectRatio(): number {
    const img = this._imageRef.value;
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) return img.naturalWidth / img.naturalHeight;
    if (this._visionFrame?.w && this._visionFrame?.h) return this._visionFrame.w / this._visionFrame.h;
    return 16 / 9;
  }

  // ---- detection overlay polling -------------------------------------------------------------

  private _pollVision = (): void => {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    callWS({ type: "kibble/vision/last", entry_id: entryId }).then(
      (result) => {
        this._visionFrame = (result as { frame: VisionFrame | null }).frame;
        this.requestUpdate();
      },
      () => {
        // Diagnostic only -- a failed poll just leaves the previous frame's boxes on screen.
      },
    );
  };

  private _toggleDetections = (): void => {
    this._showDetections = !this._showDetections;
    if (this._showDetections) {
      this._pollVision();
      this._visionTimer = setInterval(this._pollVision, VISION_POLL_MS) as unknown as number;
    } else {
      this._stopVisionPolling();
    }
    this.requestUpdate();
  };

  private _stopVisionPolling(): void {
    if (this._visionTimer !== undefined) clearInterval(this._visionTimer);
    this._visionTimer = undefined;
  }

  // ---- drawing a new mask on empty stage ------------------------------------------------------

  private _onStagePointerDown = (event: PointerEvent): void => {
    if (this._saving || event.button !== 0) return;
    const image = this._imageRef.value;
    if (!image) return;
    const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
    this._selected = null;
    this._drawStart = point;
    this._drawing = [point.x, point.y, point.x, point.y];
    this._pointerId = event.pointerId;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    event.preventDefault();
    this.requestUpdate();
  };

  private _onStageMove = (event: PointerEvent): void => {
    if (this._pointerId !== event.pointerId || !this._drawStart) return;
    const image = this._imageRef.value;
    if (!image) return;
    const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
    this._drawing = normalizedAreaFromPoints(this._drawStart, point);
    this.requestUpdate();
  };

  private _onStageUp = (event: PointerEvent): void => {
    if (this._pointerId !== event.pointerId || !this._drawStart) return;
    const image = this._imageRef.value;
    if (image) {
      const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
      const area = normalizedAreaFromPoints(this._drawStart, point);
      if (isDrawableArea(area)) {
        this._pushUndo();
        this._masks = [...this._masks, area];
        this._selected = { kind: "mask", index: this._masks.length - 1 };
      }
    }
    this._finishStageDraw(event);
  };

  private _onStageCancel = (event: PointerEvent): void => {
    if (this._pointerId !== event.pointerId) return;
    this._finishStageDraw(event);
  };

  private _finishStageDraw(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    this._pointerId = null;
    this._drawStart = null;
    this._drawing = null;
    this.requestUpdate();
  }

  // ---- moving/resizing an existing mask or the bowl zone ---------------------------------------

  private _beginMove = (event: PointerEvent, target: EditTarget): void => {
    if (this._saving || event.button !== 0) return;
    event.stopPropagation();
    const image = this._imageRef.value;
    if (!image) return;
    this._pushUndo();
    this._selected = target;
    const start = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
    this._edit = { pointerId: event.pointerId, target, handle: null, start, original: this._areaFor(target) };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    event.preventDefault();
    this.requestUpdate();
  };

  private _beginResize = (event: PointerEvent, target: EditTarget, handle: HandleId): void => {
    if (this._saving || event.button !== 0) return;
    event.stopPropagation();
    const image = this._imageRef.value;
    if (!image) return;
    this._pushUndo();
    this._selected = target;
    const start = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
    this._edit = { pointerId: event.pointerId, target, handle, start, original: this._areaFor(target) };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    event.preventDefault();
    this.requestUpdate();
  };

  private _onEditMove = (event: PointerEvent): void => {
    const edit = this._edit;
    if (!edit || edit.pointerId !== event.pointerId) return;
    const image = this._imageRef.value;
    if (!image) return;
    const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
    const next = edit.handle
      ? resizeAreaFromHandle(edit.original, edit.handle, point)
      : moveArea(edit.original, point.x - edit.start.x, point.y - edit.start.y);
    this._setAreaFor(edit.target, next);
    this.requestUpdate();
  };

  private _onEditEnd = (event: PointerEvent): void => {
    const edit = this._edit;
    if (!edit || edit.pointerId !== event.pointerId) return;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    this._edit = null;
    this.requestUpdate();
  };

  private _onShapeContextMenu(event: Event, target: EditTarget): void {
    event.preventDefault();
    if (target.kind === "mask") this._deleteMask(target.index);
  }

  private _areaFor(target: EditTarget): NormalizedArea {
    return target.kind === "bowl" ? this._bowl : this._masks[target.index]!;
  }

  private _setAreaFor(target: EditTarget, area: NormalizedArea): void {
    if (target.kind === "bowl") this._bowl = area;
    else this._masks = this._masks.map((mask, index) => (index === target.index ? area : mask));
  }

  // ---- selection, visibility, delete, reset ----------------------------------------------------

  private _selectTarget = (target: EditTarget): void => {
    this._selected = target;
    this.requestUpdate();
  };

  private _toggleVisibility = (index: number): void => {
    const next = new Set(this._hidden);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
      if (this._selected?.kind === "mask" && this._selected.index === index) this._selected = null;
    }
    this._hidden = next;
    this.requestUpdate();
  };

  private _deleteMask = (index: number): void => {
    this._pushUndo();
    this._masks = this._masks.filter((_, current) => current !== index);
    this._hidden = new Set([...this._hidden].filter((hiddenIndex) => hiddenIndex !== index).map((hiddenIndex) => (hiddenIndex > index ? hiddenIndex - 1 : hiddenIndex)));
    if (this._selected?.kind === "mask") {
      if (this._selected.index === index) this._selected = null;
      else if (this._selected.index > index) this._selected = { kind: "mask", index: this._selected.index - 1 };
    }
    this.requestUpdate();
  };

  private _resetBowl = (): void => {
    this._pushUndo();
    this._bowl = DEFAULT_BOWL_ROI;
    this.requestUpdate();
  };

  // ---- undo -------------------------------------------------------------------------------

  private _pushUndo(): void {
    this._undoStack.push({ masks: this._masks, bowl: this._bowl });
    if (this._undoStack.length > UNDO_LIMIT) this._undoStack.shift();
  }

  private _undo = (): void => {
    const previous = this._undoStack.pop();
    if (!previous) return;
    this._masks = previous.masks;
    this._bowl = previous.bowl;
    this._selected = null;
    this.requestUpdate();
  };

  // ---- keyboard -----------------------------------------------------------------------------

  private _onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && !this._saving) {
      event.preventDefault();
      this._requestClose();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !this._saving) {
      event.preventDefault();
      this._undo();
      return;
    }
    if (!this._selected || this._saving) return;
    const nudge: Record<string, NormalizedPoint> = {
      ArrowLeft: { x: -NUDGE_STEP, y: 0 },
      ArrowRight: { x: NUDGE_STEP, y: 0 },
      ArrowUp: { x: 0, y: -NUDGE_STEP },
      ArrowDown: { x: 0, y: NUDGE_STEP },
    };
    const delta = nudge[event.key];
    if (delta) {
      event.preventDefault();
      this._pushUndo();
      const area = this._areaFor(this._selected);
      const next = event.shiftKey
        ? resizeAreaFromHandle(area, "se", { x: area[2] + delta.x, y: area[3] + delta.y })
        : moveArea(area, delta.x, delta.y);
      this._setAreaFor(this._selected, next);
      this.requestUpdate();
      return;
    }
    if ((event.key === "Delete" || event.key === "Backspace") && this._selected.kind === "mask") {
      event.preventDefault();
      this._deleteMask(this._selected.index);
    }
  };

  // ---- save / close / unsaved guard --------------------------------------------------------

  private _isDirty(): boolean {
    if (!this._baseline) return false;
    const round = (area: NormalizedArea) => area.map((n) => Math.round(n * 10000)).join(",");
    if (this._masks.length !== this._baseline.masks.length) return true;
    if (round(this._bowl) !== round(this._baseline.bowl)) return true;
    return this._masks.some((area, index) => round(area) !== round(this._baseline!.masks[index]!));
  }

  private async _save(): Promise<void> {
    const callWS = this.hass?.callWS;
    if (!callWS || !this.entryId) return;
    this._saving = true;
    this._error = null;
    this.requestUpdate();
    try {
      try {
        await callWS({ type: "kibble/vision/areas/set", entry_id: this.entryId, exclude: this._masks });
      } catch (error) {
        throw new Error(`Could not save masks. ${describeWsError(error)}`);
      }
      try {
        await callWS({ type: "kibble/vision/bowl/set", entry_id: this.entryId, bowl_roi: this._bowl });
      } catch (error) {
        throw new Error(`Masks saved, but the bowl zone failed to save. ${describeWsError(error)}`);
      }
      const [areas, bowl] = await Promise.all([
        callWS({ type: "kibble/vision/areas", entry_id: this.entryId }) as Promise<VisionAreas>,
        callWS({ type: "kibble/vision/bowl", entry_id: this.entryId }) as Promise<VisionBowl>,
      ]);
      this._masks = normalizeWireAreas(areas.exclude);
      this._bowl = normalizeWireArea(bowl.bowl_roi) ?? DEFAULT_BOWL_ROI;
      this._baseline = { masks: this._masks, bowl: this._bowl };
      this._undoStack = [];
      this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
    } catch (error) {
      this._error = error instanceof Error ? error.message : "Could not save detection areas.";
    } finally {
      this._saving = false;
      this.requestUpdate();
    }
    // Only after `_saving` is back to false -- `_requestClose`'s own guard exists to stop a
    // Cancel/backdrop/Escape close from racing an in-flight save, and would otherwise also
    // swallow this one. A failed save leaves the dialog open with the error banner showing.
    if (!this._error) this._requestClose();
  }

  private _requestClose = (): void => {
    if (this._saving) return;
    if (this._isDirty() && !this._confirmDiscard) {
      this._confirmDiscard = true;
      this.requestUpdate();
      return;
    }
    this._confirmDiscard = false;
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  };

  private _keepEditing = (): void => {
    this._confirmDiscard = false;
    this.requestUpdate();
  };

  private _revokeObjectUrl(): void {
    if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
    this._objectUrl = null;
  }

  static styles = css`
    :host(:not([open])) { display: none; }
    :host {
      position: fixed;
      inset: 0;
      z-index: 120;
      color: var(--primary-text-color);
    }
    .backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
      padding: clamp(12px, 3vw, 32px);
      background: rgba(0, 0, 0, 0.76);
      overflow: auto;
    }
    .panel {
      width: min(980px, 100%);
      min-height: min(720px, 100%);
      margin: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      border-radius: 18px;
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: 0 18px 70px rgba(0, 0, 0, 0.42);
    }
    .header {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      padding: 22px 26px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    h2 { margin: 0 0 6px; font-size: 23px; }
    .header p { max-width: 690px; margin: 0; color: var(--secondary-text-color); line-height: 1.45; }
    .icon-button {
      width: 44px;
      height: 44px;
      min-height: 44px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 30px;
      line-height: 1;
      cursor: pointer;
    }
    header .icon-button svg { width: 20px; height: 20px; }
    .mask-list .icon-button svg { width: 18px; height: 18px; }
    .body { display: flex; flex: 1; flex-direction: column; gap: 14px; padding: 20px 26px; }
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .toggle-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 44px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-weight: 650;
      cursor: pointer;
    }
    .toggle-pill.active {
      color: var(--primary-text-color);
      border-color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
    }
    .swatch { display: inline-block; width: 11px; height: 11px; border-radius: 3px; flex: 0 0 auto; }
    .swatch.detections { background: var(--primary-color, #03a9f4); border: 1px solid var(--primary-color, #03a9f4); }
    .swatch.exclude { background: rgba(224, 80, 78, 0.5); border: 1px solid #f16a66; }
    .swatch.bowl { background: color-mix(in srgb, var(--primary-color, #03a9f4) 25%, transparent); border: 1px solid var(--primary-color, #03a9f4); }
    /* No flex:1/flex-centering here on purpose: .stage already sizes itself precisely to the
     * snapshot's own aspect ratio and centers itself horizontally (its own margin: 0 auto) --
     * a flex-grow wrap would stretch taller than that exact height on a tall viewport and
     * center the (correctly-sized but now shorter) stage inside itself, showing this wrap's
     * own dark background as letterbox bands around an otherwise edge-to-edge image.
     * Shrink-wrapping keeps the wrap exactly as tall as the image, every time. */
    .stage-wrap { border-radius: 12px; background: #101314; overflow: hidden; }
    .stage { position: relative; max-height: min(60vh, 640px); margin: 0 auto; overflow: hidden; touch-action: none; cursor: crosshair; }
    .stage img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .empty-stage { min-height: 280px; display: grid; place-items: center; color: var(--secondary-text-color); }

    .detection { position: absolute; border: 1.5px dashed rgba(255, 255, 255, 0.85); border-radius: 3px; pointer-events: none; }
    .detection.quiet { border-color: rgba(255, 255, 255, 0.4); border-style: dotted; }

    .shape { position: absolute; min-width: 0; min-height: 0; }
    .shape-body {
      position: absolute;
      inset: 0;
      padding: 0;
      margin: 0;
      border: 2px solid;
      border-radius: 4px;
      color: #fff;
      font: inherit;
      font-size: 12px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      cursor: move;
      overflow: hidden;
      text-align: left;
      touch-action: none;
    }
    .shape-tag { position: absolute; top: 5px; left: 6px; white-space: nowrap; }
    .shape.mask .shape-body {
      border-color: #f16a66;
      background-image: repeating-linear-gradient(45deg, rgba(224, 80, 78, 0.32) 0 6px, rgba(224, 80, 78, 0.12) 6px 12px);
    }
    .shape.bowl .shape-body {
      border-color: var(--primary-color, #03a9f4);
      border-style: dashed;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      cursor: move;
    }
    .shape.drawing { pointer-events: none; }
    .shape.drawing .shape-body { border: 2px dashed #f16a66; background: rgba(224, 80, 78, 0.18); opacity: 0.9; }
    .shape.selected .shape-body { border-width: 3px; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85), 0 0 0 5px rgba(255, 255, 255, 0.18); }
    .shape-body:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

    .handle {
      position: absolute;
      width: 44px;
      height: 44px;
      margin: -22px 0 0 -22px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .handle-dot { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 2px solid #24180a; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }

    .error { margin: 0; color: var(--error-color, #ff8a80); }
    .stage-hint {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      padding: 4px 10px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 13px;
      pointer-events: none;
    }

    .lists { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .mask-section h3 { margin: 0 0 8px; font-size: 14px; font-weight: 650; color: var(--primary-text-color); }
    .mask-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
    .mask-row, .bowl-row { display: flex; align-items: center; gap: 2px; border-radius: 8px; }
    .mask-row.selected, .bowl-row.selected { background: var(--secondary-background-color, rgba(127, 127, 127, 0.13)); }
    .mask-row-label {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 0 8px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .quiet-button, .cancel, .save {
      min-height: 44px;
      padding: 0 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .quiet-button svg, .toggle-pill svg { width: 16px; height: 16px; }
    button:disabled { opacity: 0.45; cursor: default; }
    .mask-row-label:focus-visible,
    .icon-button:focus-visible,
    .quiet-button:focus-visible,
    .toggle-pill:focus-visible,
    .save:focus-visible,
    .cancel:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .footer { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 10px; padding: 16px 26px 22px; border-top: 1px solid var(--divider-color); }
    .discard-prompt { flex: 1; min-width: 160px; margin: 0; color: var(--primary-text-color); font-weight: 600; }
    .save { border-color: var(--kibble-amber, #e8ab4f); background: var(--kibble-amber, #e8ab4f); color: var(--kibble-ink-on-amber, #24180a); }
    .cancel.discard { border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); }

    @media (max-width: 640px) {
      .backdrop { padding: 0; }
      .panel { min-height: 100%; border: 0; border-radius: 0; }
      .header, .body, .footer { padding-left: 18px; padding-right: 18px; }
      .lists { grid-template-columns: 1fr; gap: 16px; }
    }
  `;
}

customElements.define("kibble-detection-areas-dialog", KibbleDetectionAreasDialog);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-detection-areas-dialog": KibbleDetectionAreasDialog;
  }
}
