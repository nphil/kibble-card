/** One tile, two photos, two ways to compare them: a side-by-side split (the honest default --
 * both images sit still, so nothing about the comparison depends on remembering what you just
 * dragged away from) and a drag/keyboard wipe that reveals one image through the other, because
 * a wipe is what actually makes "did the bowl level change" obvious at a glance. A small toggle
 * switches between them; the choice is remembered for this tile's lifetime only (an instance
 * field, never persisted) -- reopening the same dialog on a different photo pair starts back at
 * the default split.
 *
 * Handles a missing side honestly: given only one of `beforeSrc`/`afterSrc`, this renders just
 * that photo with its label and no toggle/wipe affordance at all, never a grey box standing in
 * for the photo that doesn't exist.
 *
 * Used three places: embedded directly in `kibble-settings-dialog`'s "Last feed" section (the
 * dispense pair) and in a `kibble-timeline-card` feed row (the same pair, inline in the rail),
 * and inside `kibble-lightbox`'s overlay frame for a timeline row's eat-compare pair -- this
 * component owns none of that dialog chrome itself.
 */

import { LitElement, css, html, nothing } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { type CompareMode, resolveCompareSides, wipePositionForKey, wipePositionForPointer, WIPE_DEFAULT } from "../lib/before-after";

export class KibbleBeforeAfter extends LitElement {
  static properties = {
    beforeSrc: { type: String },
    afterSrc: { type: String },
    beforeLabel: { type: String },
    afterLabel: { type: String },
    caption: { type: String },
    aspect: { type: Number },
    _mode: { state: true },
    _wipePosition: { state: true },
  };

  declare beforeSrc: string | null | undefined;
  declare afterSrc: string | null | undefined;
  declare beforeLabel: string;
  declare afterLabel: string;
  declare caption: string | null | undefined;
  declare aspect: number;

  declare _mode: CompareMode;
  declare _wipePosition: number;

  private _frameRef = createRef<HTMLDivElement>();

  constructor() {
    super();
    this.beforeSrc = null;
    this.afterSrc = null;
    this.beforeLabel = "Before";
    this.afterLabel = "After";
    this.caption = null;
    this.aspect = 16 / 9;
    this._mode = "split";
    this._wipePosition = WIPE_DEFAULT;
  }

  render() {
    const sides = resolveCompareSides(this.beforeSrc, this.afterSrc);
    if (!sides.before && !sides.after) return nothing;
    if (!sides.hasPair) {
      const src = (sides.before ?? sides.after)!;
      const label = sides.before ? this.beforeLabel : this.afterLabel;
      return html`
        <figure class="tile">
          <div class="frame" style="aspect-ratio: ${this.aspect};">
            <img src=${src} alt=${label} loading="lazy" />
            <span class="tag tag-solo">${label}</span>
          </div>
          ${this.caption ? html`<figcaption>${this.caption}</figcaption>` : nothing}
        </figure>
      `;
    }
    return html`
      <figure class="tile">
        <div class="frame" style="aspect-ratio: ${this.aspect};">
          ${this._mode === "split" ? this._renderSplit(sides.before!, sides.after!) : this._renderWipe(sides.before!, sides.after!)}
          <div class="mode-toggle" role="group" aria-label="Compare view">
            <button
              type="button"
              class="mode-btn ${this._mode === "split" ? "selected" : ""}"
              aria-pressed=${this._mode === "split"}
              @click=${() => this._setMode("split")}
            >
              Split
            </button>
            <button
              type="button"
              class="mode-btn ${this._mode === "wipe" ? "selected" : ""}"
              aria-pressed=${this._mode === "wipe"}
              @click=${() => this._setMode("wipe")}
            >
              Wipe
            </button>
          </div>
        </div>
        ${this.caption ? html`<figcaption>${this.caption}</figcaption>` : nothing}
      </figure>
    `;
  }

  private _renderSplit(before: string, after: string) {
    return html`
      <div class="split">
        <div class="half">
          <img src=${before} alt=${this.beforeLabel} loading="lazy" />
          <span class="tag">${this.beforeLabel}</span>
        </div>
        <div class="divider"></div>
        <div class="half">
          <img src=${after} alt=${this.afterLabel} loading="lazy" />
          <span class="tag">${this.afterLabel}</span>
        </div>
      </div>
    `;
  }

  private _renderWipe(before: string, after: string) {
    const pos = this._wipePosition;
    return html`
      <div
        class="wipe"
        ${ref(this._frameRef)}
        @pointerdown=${this._beginDrag}
        @pointermove=${this._onDrag}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
      >
        <img class="layer" src=${after} alt=${this.afterLabel} loading="lazy" />
        <div class="layer clip" style="clip-path: inset(0 ${100 - pos}% 0 0);">
          <img src=${before} alt=${this.beforeLabel} loading="lazy" />
        </div>
        <span class="tag tag-before">${this.beforeLabel}</span>
        <span class="tag tag-after">${this.afterLabel}</span>
        <div
          class="handle"
          role="slider"
          tabindex="0"
          aria-label="Reveal before vs after"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${Math.round(pos)}
          aria-valuetext=${`${Math.round(pos)}% ${this.beforeLabel.toLowerCase()}`}
          style="left: ${pos}%;"
          @keydown=${this._onHandleKeydown}
        >
          <span class="grip"></span>
        </div>
      </div>
    `;
  }

  private _setMode(mode: CompareMode): void {
    this._mode = mode;
  }

  private _beginDrag = (event: PointerEvent): void => {
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._updateFromPointer(event.clientX);
  };

  private _onDrag = (event: PointerEvent): void => {
    if (event.buttons === 0) return;
    event.preventDefault();
    this._updateFromPointer(event.clientX);
  };

  private _endDrag = (event: PointerEvent): void => {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
  };

  private _updateFromPointer(clientX: number): void {
    const rect = this._frameRef.value?.getBoundingClientRect();
    if (!rect) return;
    this._wipePosition = wipePositionForPointer(clientX, rect);
  }

  private _onHandleKeydown = (event: KeyboardEvent): void => {
    const next = wipePositionForKey(this._wipePosition, event.key);
    if (next === null) return;
    event.preventDefault();
    this._wipePosition = next;
  };

  static styles = css`
    :host {
      display: block;
    }
    .tile {
      margin: 0;
    }
    .frame {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      touch-action: none;
    }
    .frame > img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    figcaption {
      margin-top: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .tag {
      position: absolute;
      top: 8px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      pointer-events: none;
    }
    .tag-solo {
      left: 8px;
    }
    /* Split */
    .split {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .half {
      position: relative;
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
    }
    .half img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .half .tag {
      left: 8px;
    }
    .half:last-child .tag {
      left: auto;
      right: 8px;
    }
    .divider {
      flex: 0 0 auto;
      width: 2px;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    }
    /* Wipe */
    .wipe {
      position: absolute;
      inset: 0;
      cursor: ew-resize;
    }
    .wipe .layer {
      position: absolute;
      inset: 0;
    }
    .wipe .layer img,
    .wipe img.layer {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .wipe .clip {
      overflow: hidden;
    }
    .tag-before {
      left: 8px;
    }
    .tag-after {
      right: 8px;
    }
    .handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      cursor: ew-resize;
    }
    .handle:focus-visible {
      outline: none;
    }
    .handle:focus-visible .grip {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .grip {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    /* Mode toggle */
    .mode-toggle {
      position: absolute;
      /* Bottom, not top, so it never sits over the "After"/wipe tags, which are always top:
       * 8px regardless of mode (see .tag above) -- top-right previously hid "After" under
       * this control entirely. */
      bottom: 8px;
      right: 8px;
      display: flex;
      gap: 2px;
      padding: 2px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
    }
    .mode-btn {
      border: none;
      background: none;
      color: #fff;
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      min-height: 28px;
    }
    .mode-btn.selected {
      background: var(--kibble-amber, #f4a452);
      color: var(--kibble-ink-on-amber, #3a2c28);
    }
    .mode-btn:focus-visible {
      outline: 2px solid #fff;
      outline-offset: -2px;
    }
  `;
}

customElements.define("kibble-before-after", KibbleBeforeAfter);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-before-after": KibbleBeforeAfter;
  }
}
