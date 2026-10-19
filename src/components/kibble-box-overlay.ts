import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { CatSummary, HomeAssistant } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { boxRect, placeLabels, type LabelPlacement, type OverlayBox } from "../lib/boxes";
import { placeNamePicker, type NamePickerPlacement } from "../lib/session-label";
import "./kibble-image";
import "./kibble-avatar";

export class KibbleBoxOverlay extends LitElement {
  static properties = {
    boxes: { attribute: false },
    hass: { attribute: false },
    cache: { attribute: false },
    cats: { attribute: false },
    busy: { type: Boolean },
    labelSafeTop: { attribute: false },
    _labelPositions: { state: true },
    _pickerKey: { state: true },
    _pickerPlacement: { state: true },
  };

  declare boxes: OverlayBox[];
  declare hass: HomeAssistant | undefined;
  declare cache: ImageUrlCache | undefined;
  declare cats: CatSummary[];
  declare busy: boolean;
  declare labelSafeTop: number;
  declare private _labelPositions: Record<string, LabelPlacement>;
  declare private _pickerKey: string | null;
  declare private _pickerPlacement: NamePickerPlacement | null;

  private _resizeObserver: ResizeObserver | undefined;
  private _focusTrigger: HTMLButtonElement | null = null;
  private _pointerDown = (event: PointerEvent): void => {
    if (this._pickerKey && !event.composedPath().includes(this)) this._closePicker(false);
  };
  private _keyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !this._pickerKey) return;
    event.preventDefault();
    event.stopPropagation();
    this._closePicker(true);
  };

  constructor() {
    super();
    this.boxes = [];
    this.cats = [];
    this.busy = false;
    this.labelSafeTop = 0;
    this._labelPositions = {};
    this._pickerKey = null;
    this._pickerPlacement = null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("pointerdown", this._pointerDown, true);
    window.addEventListener("keydown", this._keyDown, true);
  }

  firstUpdated(): void {
    this._resizeObserver = new ResizeObserver(() => {
      this._repositionLabels();
      this._repositionPicker();
    });
    this._resizeObserver.observe(this);
    this._repositionLabels();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("pointerdown", this._pointerDown, true);
    window.removeEventListener("keydown", this._keyDown, true);
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
  }

  updated(changed: PropertyValues): void {
    if (changed.has("boxes") || changed.has("labelSafeTop")) this._repositionLabels();
    if (changed.has("boxes") && this._pickerKey && !this.boxes.some((box) => box.key === this._pickerKey)) this._closePicker(false);
    if (changed.has("_pickerKey") || changed.has("boxes") || changed.has("cats")) this._repositionPicker();
  }

  private _repositionLabels = (): void => {
    const bounds = this.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    const labelNodes = [...this.renderRoot.querySelectorAll<HTMLElement>(".label")];
    const labels = this.boxes.flatMap((box) => {
      const text = box.label ?? (box.tone === "not-cat" ? "Not a cat" : null);
      if (!text) return [];
      const node = labelNodes.find((element) => element.dataset.labelKey === box.key);
      const measured = node?.getBoundingClientRect();
      return [{ key: box.key, box: box.box, width: measured?.width || Math.max(44, text.length * 7 + 34), height: measured?.height || 22 }];
    });
    const next = Object.fromEntries(placeLabels(labels, bounds.width, bounds.height, 4, this.labelSafeTop).map((placement) => [placement.key, placement]));
    const keys = Object.keys(next);
    if (keys.length === Object.keys(this._labelPositions).length && keys.every((key) => {
      const before = this._labelPositions[key];
      const after = next[key];
      return before?.left === after?.left && before?.top === after?.top && before?.flipped === after?.flipped;
    })) return;
    this._labelPositions = next;
  };

  private _openPicker(box: OverlayBox, event: MouseEvent): void {
    if (this.busy || box.subjectSid == null) return;
    this._focusTrigger = event.currentTarget as HTMLButtonElement;
    this._pickerPlacement = null;
    this._pickerKey = box.key;
    void this.updateComplete.then(async () => {
      this._repositionPicker();
      await this.updateComplete;
      this.renderRoot.querySelector<HTMLElement>(".picker-option:not([disabled])")?.focus();
    });
  }

  private _closePicker(restoreFocus: boolean): void {
    const trigger = this._focusTrigger;
    this._pickerKey = null;
    this._pickerPlacement = null;
    this._focusTrigger = null;
    if (restoreFocus) trigger?.focus();
  }

  private _repositionPicker = (): void => {
    if (!this._pickerKey) return;
    const box = this.boxes.find((candidate) => candidate.key === this._pickerKey);
    const picker = this.renderRoot.querySelector<HTMLElement>(".picker");
    const frame = this.getBoundingClientRect();
    if (!box || !picker || frame.width <= 0 || frame.height <= 0) return;
    const bounds = picker.getBoundingClientRect();
    const placement = placeNamePicker(box.box, frame.width, frame.height, bounds.width, bounds.height);
    const before = this._pickerPlacement;
    if (before?.left === placement.left && before.top === placement.top && before.flipped === placement.flipped) return;
    this._pickerPlacement = placement;
  };

  private _chooseSubject(box: OverlayBox, label: string): void {
    if (this.busy || box.subjectSid == null) return;
    this._closePicker(true);
    this.dispatchEvent(new CustomEvent("subject-label-requested", {
      detail: { sid: box.subjectSid, label },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const selectable = this.boxes.some((box) => box.selectable);
    const pickerBox = this.boxes.find((box) => box.key === this._pickerKey);
    return html`
      <div class="overlay ${selectable ? "interactive" : "passive"}" ?aria-hidden=${!selectable}>
        ${this.boxes.map((box) => this._renderBox(box))}
        ${pickerBox ? this._renderPicker(pickerBox) : nothing}
      </div>`;
  }

  private _renderPicker(box: OverlayBox) {
    const visible = this._pickerPlacement !== null;
    const style = visible ? `left:${this._pickerPlacement!.left}px;top:${this._pickerPlacement!.top}px;` : "left:8px;top:8px;visibility:hidden;";
    return html`<div class="picker" role="group" aria-label="Name this animal" style=${style}>
      ${this.cats.map((cat) => html`<button type="button" class="picker-option" aria-pressed=${box.subjectLabel === cat.name} ?disabled=${this.busy} @click=${() => this._chooseSubject(box, cat.name)}>
        <kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar><span>${cat.name}</span>${box.subjectLabel === cat.name ? html`<span class="picker-check" aria-hidden="true">✓</span>` : nothing}
      </button>`) }
      <button type="button" class="picker-option" aria-pressed=${box.subjectLabel === "not_a_cat"} ?disabled=${this.busy} @click=${() => this._chooseSubject(box, "not_a_cat")}>
        <kibble-avatar .name=${null}></kibble-avatar><span>Not a cat</span>${box.subjectLabel === "not_a_cat" ? html`<span class="picker-check" aria-hidden="true">✓</span>` : nothing}
      </button>
    </div>`;
  }

  private _renderBox(box: OverlayBox) {
    const rect = boxRect(box.box);
    const boundsStyle = `left:${rect.left};top:${rect.top};width:${rect.width};height:${rect.height};--box-color:${box.color ?? "rgba(255,255,255,.9)"};`;
    const emphasis = box.emphasis ?? "normal";
    const text = box.label ?? (box.tone === "not-cat" ? "Not a cat" : null);
    const placement = this._labelPositions[box.key];
    const labelStyle = placement ? `left:${placement.left}px;top:${placement.top}px;` : `left:${rect.left};top:${rect.top};`;
    return html`
      <div class="box-wrap tone-${box.tone} emphasis-${emphasis}" style=${boundsStyle}>
        <span class="stroke"></span>
        ${box.selectable ? html`<button type="button" class="hit" aria-label=${text ? `Name ${text}` : "Name this animal"} @click=${(event: MouseEvent) => this._openPicker(box, event)}></button>` : nothing}
      </div>
      ${text ? html`<span class="label tone-${box.tone} emphasis-${emphasis}" data-label-key=${box.key} style=${labelStyle}>
        ${box.tone === "cat" ? html`<span class="avatar-ring" style=${`--box-color:${box.color ?? "var(--primary-color)"}`}><span class="monogram" aria-hidden="true">${text.trim().charAt(0).toUpperCase()}</span>${box.avatar ? html`<kibble-image .hass=${this.hass} .asset=${box.avatar} .cache=${this.cache} alt=""></kibble-image>` : nothing}</span>` : box.tone === "unknown" ? html`<span class="unknown-avatar">?</span>` : nothing}
        <span class="label-text">${text}</span>
      </span>` : nothing}`;
  }
  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      overflow: hidden;
      pointer-events: none;
      contain: layout paint;
    }
    .overlay {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .overlay.passive,
    .overlay.interactive {
      pointer-events: none;
    }
    .picker {
      position: absolute;
      z-index: 20;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: min(264px, calc(100% - 16px));
      max-height: calc(100% - 16px);
      overflow: auto;
      padding: 6px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 14px;
      background: rgba(18, 18, 20, 0.94);
      color: #fff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
      backdrop-filter: blur(12px);
      pointer-events: auto;
      overscroll-behavior: contain;
    }
    .picker-option {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 48px;
      padding: 4px 8px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .picker-option kibble-avatar {
      flex: none;
      --kibble-avatar-size: 30px;
    }
    .picker-option[aria-pressed="true"] {
      background: rgba(255, 255, 255, 0.14);
    }
    .picker-option:focus-visible {
      outline: 2px solid var(--primary-color, #9c7bff);
      outline-offset: -2px;
    }
    .picker-option:disabled {
      opacity: 0.55;
      cursor: default;
    }
    .picker-check {
      margin-left: auto;
      color: var(--kibble-feed, #6fd398);
      font-weight: 700;
    }
    .box-wrap {
      position: absolute;
      box-sizing: border-box;
      pointer-events: none;
    }
    /* A solid box is a 2 px colour line between two thin dark lines, so it reads on bright day
     * scenes and on the dark purple night (IR) image alike. Cat colours are lifted toward white
     * for the line itself: the darker palette slots (plum) vanish on an IR frame otherwise. */
    .stroke {
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      border: 2px solid rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
    .tone-cat .stroke {
      border-color: color-mix(in srgb, var(--box-color) 68%, #fff);
    }
    .tone-unknown .stroke {
      border-color: rgba(255, 255, 255, 0.9);
    }
    .tone-not-cat .stroke {
      border-width: 1.5px;
      border-style: dashed;
      border-color: rgba(255, 255, 255, 0.78);
    }
    .tone-clutter .stroke {
      border: 1px dashed rgba(255, 255, 255, 0.45);
      border-radius: 3px;
    }
    .tone-peer .stroke {
      border: 1px dashed rgba(255, 255, 255, 0.6);
      border-radius: 3px;
      box-shadow: none;
    }
    .box-wrap.emphasis-selected .stroke {
      border-width: 3px;
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--box-color) 40%, transparent), 0 0 0 1px rgba(0, 0, 0, 0.45),
        inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
    .box-wrap.emphasis-dim,
    .label.emphasis-dim {
      opacity: 0.45;
    }
    .hit {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      min-width: 48px;
      min-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      background: transparent;
      opacity: 0;
      pointer-events: auto;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
    .box-wrap:focus-within .stroke {
      box-shadow: 0 0 0 3px var(--primary-text-color), 0 0 0 5px rgba(0, 0, 0, 0.65);
    }
    .label {
      position: absolute;
      z-index: 2;
      height: 22px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: min(240px, calc(100% - 4px));
      padding: 3px 8px 3px 3px;
      border-radius: 999px;
      background: rgba(18, 18, 20, 0.72);
      color: #fff;
      font: 600 12px/1.1 var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      will-change: left, top;
    }
    .avatar-ring,
    .unknown-avatar {
      width: 16px;
      height: 16px;
      flex: none;
      box-sizing: border-box;
      display: inline-grid;
      place-items: center;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar-ring {
      position: relative;
      border: 1.5px solid var(--box-color);
      background: color-mix(in srgb, var(--box-color) 20%, #121214);
      color: var(--box-color);
    }
    .avatar-ring .monogram {
      position: absolute;
      inset: 0;
      z-index: 0;
      display: grid;
      place-items: center;
    }
    .avatar-ring kibble-image {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .monogram {
      font-size: 9px;
      line-height: 1;
      font-weight: 700;
    }
    .unknown-avatar {
      background: rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.92);
      font-size: 11px;
      font-weight: 700;
    }
    .label-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tone-not-cat {
      color: rgba(255, 255, 255, 0.82);
    }
    @media (prefers-reduced-motion: no-preference) {
      .stroke {
        transition: border-color 150ms ease, border-width 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
      }
      .box-wrap {
        transition: left 250ms ease, top 250ms ease, width 250ms ease, height 250ms ease, opacity 150ms ease;
      }
      .label {
        transition: left 250ms ease, top 250ms ease, opacity 150ms ease;
      }
    }
  `;
}

customElements.define("kibble-box-overlay", KibbleBoxOverlay);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-box-overlay": KibbleBoxOverlay;
  }
}
