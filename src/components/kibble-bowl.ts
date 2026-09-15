/** The bowl: the card's primary status object. Fill level, the cat silhouette and the feed
 * animation all live here — this is the thing you can read from across a room, per Nitin's
 * squint test. No MDI; every mark is either the brand cat or the brand kibble-piece shape.
 */

import { LitElement, css, html, nothing, svg } from "lit";
import type { PropertyValues } from "lit";
import { combineBowlFill } from "../lib/bowl-fill";
import { catSilhouette, kibblePiece } from "../lib/brand-shapes";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 240;
const VIEW_H = 170;
const RIM_CENTER_Y = 108;
const RIM_RY = 42;

/** Deterministic scatter offsets for texture kibble + falling kibble, so re-renders (and tests
 * that snapshot markup) don't jitter — this is art direction, not randomness that matters. */
const SCATTER = [-0.62, -0.31, -0.04, 0.22, 0.48, 0.68, -0.5, 0.08];

function fillEllipse(cx: number, cy: number, rx: number, ry: number, fraction: number) {
  const scale = Math.sqrt(Math.max(0, Math.min(1, fraction)));
  if (scale <= 0) return nothing;
  return svg`<ellipse cx=${cx} cy=${cy} rx=${rx * scale} ry=${ry * scale} class="fill" />`;
}

function textureKibble(cx: number, rx: number, fraction: number, seedOffset: number) {
  if (fraction < 0.15) return nothing;
  const count = fraction > 0.6 ? 4 : 2;
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const t = SCATTER[(i + seedOffset) % SCATTER.length]!;
    const x = cx + t * rx * 0.7 - 4;
    const y = RIM_CENTER_Y - 4 + (i % 2 === 0 ? -3 : 3);
    pieces.push(kibblePiece(x, y, 8, t * 40));
  }
  return svg`<g class="texture">${pieces}</g>`;
}

export class KibbleBowl extends LitElement {
  static properties = {
    hopper1: { type: Number },
    hopper2: { type: Number },
    catName: { type: String },
    feeding: { type: Boolean },
    statusText: { type: String },
  };

  declare hopper1: number | null;
  declare hopper2: number | null;
  declare catName: string | null;
  declare feeding: boolean;
  declare statusText: string;

  private _wasFeeding = false;
  private _dropping = false;
  private _dropTimer: number | undefined = undefined;

  constructor() {
    super();
    this.hopper1 = null;
    this.hopper2 = null;
    this.catName = null;
    this.feeding = false;
    this.statusText = "";
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._dropTimer);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("feeding") && this.feeding && !this._wasFeeding && !prefersReducedMotion()) {
      this._dropping = true;
      clearTimeout(this._dropTimer);
      this._dropTimer = setTimeout(() => {
        this._dropping = false;
        this.requestUpdate();
      }, KIBBLE_FALL_DURATION_MS);
    }
    this._wasFeeding = this.feeding;
  }

  render() {
    const display = combineBowlFill(this.hopper1, this.hopper2);

    return html`
      <div class="wrap">
        <svg class="art" viewBox="0 0 ${VIEW_W} ${VIEW_H}" aria-hidden="true">
          ${this.catName ? html`<g class="cat" transform="translate(88 6) scale(0.25)">${catSilhouette()}</g>` : nothing}
          ${display.split ? this._renderSplitBasin(display.hopper1!, display.hopper2!) : this._renderSingleBasin(display.combined ?? 0)}
          ${this._dropping ? this._renderFallingKibble() : nothing}
        </svg>
        <div class="numbers">
          ${display.split
            ? html`
                <span class="fill-number split">${Math.round(display.hopper1!)}<small>%</small></span>
                <span class="fill-number split">${Math.round(display.hopper2!)}<small>%</small></span>
              `
            : html`<span class="fill-number">${display.combined == null ? "\u2014" : html`${Math.round(display.combined)}<small>%</small>`}</span>`}
        </div>
        ${this.catName ? html`<div class="cat-name">${this.catName}</div>` : nothing}
        <div class="status" data-feeding=${this.feeding}>${this.statusText}</div>
      </div>
    `;
  }

  private _renderSingleBasin(fraction0to100: number) {
    const fraction = fraction0to100 / 100;
    const cx = VIEW_W / 2;
    return svg`
      <g>
        <ellipse cx=${cx} cy=${RIM_CENTER_Y} rx="100" ry=${RIM_RY} class="basin" />
        <ellipse cx=${cx} cy=${RIM_CENTER_Y} rx="100" ry=${RIM_RY} class="rim" />
        ${fillEllipse(cx, RIM_CENTER_Y, 92, RIM_RY - 6, fraction)}
        ${textureKibble(cx, 92, fraction, 0)}
      </g>
    `;
  }

  private _renderSplitBasin(hopper1: number, hopper2: number) {
    const leftCx = 68;
    const rightCx = 172;
    return svg`
      <g>
        <rect x="10" y=${RIM_CENTER_Y - RIM_RY} width="220" height=${RIM_RY * 2} rx=${RIM_RY} class="basin" />
        <rect x="10" y=${RIM_CENTER_Y - RIM_RY} width="220" height=${RIM_RY * 2} rx=${RIM_RY} class="rim" />
        <line x1="120" y1=${RIM_CENTER_Y - RIM_RY + 6} x2="120" y2=${RIM_CENTER_Y + RIM_RY - 6} class="divider" />
        ${fillEllipse(leftCx, RIM_CENTER_Y, 50, RIM_RY - 8, hopper1 / 100)}
        ${fillEllipse(rightCx, RIM_CENTER_Y, 50, RIM_RY - 8, hopper2 / 100)}
        ${textureKibble(leftCx, 50, hopper1 / 100, 1)}
        ${textureKibble(rightCx, 50, hopper2 / 100, 3)}
      </g>
    `;
  }

  private _renderFallingKibble() {
    const pieces = SCATTER.slice(0, 6).map((t, i) => {
      const x = VIEW_W / 2 + t * 90 - 5;
      const delayMs = i * 70;
      const durationMs = 320;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;`;
      return svg`<g class="drop" style=${style}>${kibblePiece(x, 4, 10, t * 30)}</g>`;
    });
    return svg`<g class="drops">${pieces}</g>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .art {
      width: 100%;
      max-width: var(--kibble-bowl-max-width, 280px);
      height: auto;
      overflow: visible;
    }
    .basin {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    }
    .rim {
      fill: none;
      stroke: var(--divider-color, rgba(127, 127, 127, 0.3));
      stroke-width: 2.5;
    }
    .divider {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.3));
      stroke-width: 2;
    }
    .fill {
      fill: var(--kibble-amber);
    }
    .texture rect {
      fill: var(--kibble-amber-dark);
      opacity: 0.85;
    }
    .cat {
      fill: var(--secondary-text-color);
    }
    .drops rect {
      fill: var(--kibble-amber-dark);
      animation: kibble-drop var(--fall-duration) cubic-bezier(0.4, 0, 1, 1) var(--fall-delay) both;
    }
    @keyframes kibble-drop {
      from {
        transform: translateY(-40px) rotate(0deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      to {
        transform: translateY(0) rotate(var(--fall-rotate));
        opacity: 1;
      }
    }
    .numbers {
      display: flex;
      gap: 18px;
      margin-top: -8px;
    }
    .fill-number {
      font-size: var(--kibble-number-size, 32px);
      font-weight: 700;
      line-height: 1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .fill-number small {
      font-size: 0.5em;
      font-weight: 600;
      margin-left: 1px;
    }
    .fill-number.split {
      font-size: calc(var(--kibble-number-size, 32px) * 0.72);
    }
    .cat-name {
      font-size: var(--kibble-catname-size, 13px);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .status {
      font-size: var(--kibble-status-size, 15px);
      color: var(--secondary-text-color);
      text-align: center;
    }
    .status[data-feeding="true"] {
      color: var(--kibble-amber-dark);
      font-weight: 600;
    }
  `;
}

customElements.define("kibble-bowl", KibbleBowl);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-bowl": KibbleBowl;
  }
}
