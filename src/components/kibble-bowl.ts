/** The bowl: the card's primary status object. Drawn as an actual bowl seen at a slight angle —
 * a wide rim, a tapered body, a recessed interior — not a flat lozenge, so fill level, the two-
 * chamber split, and the cat silhouette all read unmistakably from across a room.
 */

import { LitElement, css, html, nothing, svg } from "lit";
import type { PropertyValues } from "lit";
import { combineBowlFill } from "../lib/bowl-fill";
import { catSilhouette, kibblePiece } from "../lib/brand-shapes";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 260;
const VIEW_H = 200;
const CX = 130;
const RIM_CY = 66;
const RIM_RX = 116;
const RIM_RY = 44;
const BASE_CY = 168;
const BASE_RX = 76;
const BASIN_RX = 96;
const BASIN_RY = 34;

const SCATTER = [-0.62, -0.31, -0.04, 0.22, 0.48, 0.68, -0.5, 0.08, 0.35, -0.18];

/** The bowl's exterior silhouette: rim's front (lower) arc down to the base, across, and back up
 * — the classic 2D "looking into a bowl" body shape. */
const BODY_PATH = `M ${CX + RIM_RX} ${RIM_CY} A ${RIM_RX} ${RIM_RY} 0 0 1 ${CX - RIM_RX} ${RIM_CY} C ${CX - RIM_RX + 8} ${RIM_CY + 58}, ${CX - BASE_RX + 6} ${BASE_CY - 26}, ${CX - BASE_RX} ${BASE_CY} L ${CX + BASE_RX} ${BASE_CY} C ${CX + BASE_RX - 6} ${BASE_CY - 26}, ${CX + RIM_RX - 8} ${RIM_CY + 58}, ${CX + RIM_RX} ${RIM_CY} Z`;

function fillShape(cx: number, rx: number, ry: number, fraction: number) {
  const scale = Math.sqrt(Math.max(0, Math.min(1, fraction)));
  if (scale <= 0) return nothing;
  return svg`<ellipse cx=${cx} cy=${RIM_CY + 6} rx=${rx * scale} ry=${ry * scale} class="fill" />`;
}

function textureKibble(cx: number, rx: number, fraction: number, seedOffset: number) {
  if (fraction < 0.15) return nothing;
  const count = fraction > 0.6 ? 5 : 3;
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const t = SCATTER[(i + seedOffset) % SCATTER.length]!;
    const x = cx + t * rx * 0.72 - 5;
    const y = RIM_CY + 2 + (i % 2 === 0 ? -4 : 5);
    pieces.push(kibblePiece(x, y, 10, t * 50));
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
        <svg class="art" viewBox="0 0 ${VIEW_W} ${VIEW_H}" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
          ${this.catName ? html`<g class="cat" transform="translate(96 -6) scale(0.27)">${catSilhouette()}</g>` : nothing}
          <path class="body" d=${BODY_PATH} />
          ${display.split ? this._renderSplitBasin(display.hopper1!, display.hopper2!) : this._renderSingleBasin(display.combined ?? 0)}
          <ellipse cx=${CX} cy=${RIM_CY} rx=${RIM_RX} ry=${RIM_RY} class="rim" />
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
    return svg`
      <g>
        <ellipse cx=${CX} cy=${RIM_CY} rx=${BASIN_RX} ry=${BASIN_RY} class="basin" />
        ${fillShape(CX, BASIN_RX - 6, BASIN_RY - 6, fraction)}
        ${textureKibble(CX, BASIN_RX, fraction, 0)}
      </g>
    `;
  }

  private _renderSplitBasin(hopper1: number, hopper2: number) {
    const leftCx = CX - BASIN_RX / 2 - 4;
    const rightCx = CX + BASIN_RX / 2 + 4;
    const halfRx = BASIN_RX / 2 - 6;
    return svg`
      <g>
        <ellipse cx=${CX} cy=${RIM_CY} rx=${BASIN_RX} ry=${BASIN_RY} class="basin" />
        ${fillShape(leftCx, halfRx - 4, BASIN_RY - 8, hopper1 / 100)}
        ${fillShape(rightCx, halfRx - 4, BASIN_RY - 8, hopper2 / 100)}
        ${textureKibble(leftCx, halfRx, hopper1 / 100, 1)}
        ${textureKibble(rightCx, halfRx, hopper2 / 100, 4)}
        <path d="M ${CX} ${RIM_CY - BASIN_RY + 4} L ${CX} ${RIM_CY + BASIN_RY - 4}" class="divider" />
      </g>
    `;
  }

  private _renderFallingKibble() {
    const pieces = SCATTER.slice(0, 7).map((t, i) => {
      const x = CX + t * (BASIN_RX - 10) - 6;
      const delayMs = i * 70;
      const durationMs = 320;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;--fall-to:${RIM_CY - 10}px;`;
      return svg`<g class="drop" style=${style}>${kibblePiece(x, -20, 12, t * 30)}</g>`;
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
      max-width: var(--kibble-bowl-max-width, 320px);
      height: auto;
      overflow: visible;
    }
    .body {
      fill: var(--ha-card-background, var(--card-background-color));
      stroke: var(--primary-text-color);
      stroke-width: 3;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 3;
    }
    .basin {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.16));
      stroke: var(--divider-color);
      stroke-width: 1.5;
    }
    .divider {
      stroke: var(--primary-text-color);
      stroke-width: 4;
      stroke-linecap: round;
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
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      to {
        transform: translateY(var(--fall-to)) rotate(var(--fall-rotate));
        opacity: 1;
      }
    }
    .numbers {
      display: flex;
      gap: 22px;
      margin-top: -6px;
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
