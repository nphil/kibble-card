import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { boxRect, placeLabels, type LabelPlacement, type OverlayBox } from "../lib/boxes";
import "./kibble-image";

/** Boxes, and optionally name tags, drawn over a picture. Purely visual: it never takes a tap,
 * so whatever sits under it (a photo, a swipe) keeps working. */
export class KibbleBoxOverlay extends LitElement {
  static properties = {
    boxes: { attribute: false },
    hass: { attribute: false },
    cache: { attribute: false },
    labelSafeTop: { attribute: false },
    _labelPositions: { state: true },
  };

  declare boxes: OverlayBox[];
  declare hass: HomeAssistant | undefined;
  declare cache: ImageUrlCache | undefined;
  declare labelSafeTop: number;
  declare private _labelPositions: Record<string, LabelPlacement>;

  private _resizeObserver: ResizeObserver | undefined;

  constructor() {
    super();
    this.boxes = [];
    this.labelSafeTop = 0;
    this._labelPositions = {};
  }

  firstUpdated(): void {
    this._resizeObserver = new ResizeObserver(() => this._repositionLabels());
    this._resizeObserver.observe(this);
    this._repositionLabels();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
  }

  updated(changed: PropertyValues): void {
    if (changed.has("boxes") || changed.has("labelSafeTop")) this._repositionLabels();
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

  render() {
    return html`<div class="overlay" aria-hidden="true">${this.boxes.map((box) => this._renderBox(box))}</div>`;
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
