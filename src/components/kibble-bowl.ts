/** The bowl: the card's primary status object. A single continuous ceramic-dish silhouette
 * (rim, curved sides, a small foot, a contact shadow), a two-tone recessed interior for depth,
 * and food drawn as a mound — a convex pile that rises with fill level and carries loose,
 * individually-shaped kibble pieces on its surface — not a flat tinted disc.
 */

import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import type { PropertyValues } from "lit";
import { combineBowlFill } from "../lib/bowl-fill";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 260;
const VIEW_H = 200;
const CX = 130;
const RIM_CY = 60;
const RIM_RX = 116;
const RIM_RY = 40;
const FOOT_CY = 178;
const FOOT_RX = 46;
const FOOT_RY = 10;
const FLOOR_Y = 78;
const BASIN_HALF_W = 86;
const MAX_MOUND_HEIGHT = 46;

/** One continuous silhouette: rim's right point down the curved side to the foot, across the
 * foot, up the other side, closed along the rim's own near (front) arc. */
const BODY_PATH = `M ${CX + RIM_RX} ${RIM_CY} C ${CX + RIM_RX} ${RIM_CY + 50}, ${CX + 70} ${FOOT_CY - 13}, ${CX + FOOT_RX} ${FOOT_CY} A ${FOOT_RX} ${FOOT_RY} 0 0 1 ${CX - FOOT_RX} ${FOOT_CY} C ${CX - 70} ${FOOT_CY - 13}, ${CX - RIM_RX} ${RIM_CY + 50}, ${CX - RIM_RX} ${RIM_CY} A ${RIM_RX} ${RIM_RY} 0 0 0 ${CX + RIM_RX} ${RIM_CY} Z`;

const SCATTER = [-0.6, -0.32, -0.06, 0.2, 0.46, 0.66, -0.46, 0.08, 0.34, -0.2];

/** A quadratic-bezier mound: flat baseline rising to a convex peak — the dome silhouette. */
function moundPath(left: number, right: number, height: number): string {
  const cx = (left + right) / 2;
  return `M ${left} ${FLOOR_Y} Q ${cx} ${FLOOR_Y - 2 * height} ${right} ${FLOOR_Y} Z`;
}

function moundTopY(t: number, left: number, right: number, height: number): number {
  const peakControlY = FLOOR_Y - 2 * height;
  return (1 - t) * (1 - t) * FLOOR_Y + 2 * (1 - t) * t * peakControlY + t * t * FLOOR_Y;
}

/** The brand's kibble motif as three overlapping lobes — a rounded clover, not a circle. */
function cloverPiece(x: number, y: number, r: number, rotationDeg: number): SVGTemplateResult {
  const lobes = [0, 120, 240].map((angle) => {
    const rad = ((angle + rotationDeg) * Math.PI) / 180;
    return svg`<circle cx=${(x + Math.cos(rad) * r * 0.55).toFixed(1)} cy=${(y + Math.sin(rad) * r * 0.55).toFixed(1)} r=${(r * 0.62).toFixed(1)} />`;
  });
  return svg`<g>${lobes}</g>`;
}

function mound(left: number, right: number, fraction: number, seed: number) {
  if (fraction <= 0.02) return nothing;
  const height = MAX_MOUND_HEIGHT * fraction;
  const pieceCount = Math.round(6 + 4 * fraction);
  const pieces: SVGTemplateResult[] = [];
  for (let i = 0; i < pieceCount; i++) {
    const t = (i + 0.5) / pieceCount;
    const x = left + (right - left) * t;
    const topY = moundTopY(t, left, right, height);
    const jitter = SCATTER[(i + seed) % SCATTER.length]! * 6;
    const r = 5.5 + ((i + seed) % 3) * 1.4;
    const edgeBreak = i === 0 || i === pieceCount - 1 ? (i === 0 ? -3 : 3) : 0;
    pieces.push(cloverPiece(x + edgeBreak, topY + jitter - 2, r, i * 47 + seed * 13));
  }
  return svg`
    <path d=${moundPath(left, right, height)} class="fill" />
    <g class="texture">${pieces}</g>
  `;
}

export class KibbleBowl extends LitElement {
  static properties = {
    hopper1: { type: Number },
    hopper2: { type: Number },
    feeding: { type: Boolean },
  };

  declare hopper1: number | null;
  declare hopper2: number | null;
  declare feeding: boolean;

  private _wasFeeding = false;
  private _dropping = false;
  private _dropTimer: number | undefined = undefined;

  constructor() {
    super();
    this.hopper1 = null;
    this.hopper2 = null;
    this.feeding = false;
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
          <ellipse cx=${CX} cy=${FOOT_CY + 14} rx="66" ry="9" class="shadow" />
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
      </div>
    `;
  }

  private _renderSingleBasin(fraction0to100: number) {
    const fraction = fraction0to100 / 100;
    return svg`
      <g>
        <ellipse cx=${CX} cy="62" rx="100" ry="32" class="basin-far" />
        <ellipse cx=${CX} cy="68" rx="90" ry="25" class="basin-near" />
        ${mound(CX - BASIN_HALF_W * (0.32 + 0.68 * Math.sqrt(fraction)), CX + BASIN_HALF_W * (0.32 + 0.68 * Math.sqrt(fraction)), fraction, 0)}
      </g>
    `;
  }

  private _renderSplitBasin(hopper1: number, hopper2: number) {
    const leftCenter = CX - 44;
    const rightCenter = CX + 44;
    const halfW = 40;
    const f1 = hopper1 / 100;
    const f2 = hopper2 / 100;
    return svg`
      <g>
        <ellipse cx=${CX} cy="62" rx="100" ry="32" class="basin-far" />
        <ellipse cx=${CX} cy="68" rx="90" ry="25" class="basin-near" />
        ${mound(leftCenter - halfW * (0.35 + 0.65 * Math.sqrt(f1)), leftCenter + halfW * (0.35 + 0.65 * Math.sqrt(f1)), f1, 1)}
        ${mound(rightCenter - halfW * (0.35 + 0.65 * Math.sqrt(f2)), rightCenter + halfW * (0.35 + 0.65 * Math.sqrt(f2)), f2, 4)}
        <g class="divider">
          <line x1=${CX - 3} y1="46" x2=${CX - 3} y2="90" />
          <line x1=${CX + 3} y1="46" x2=${CX + 3} y2="90" />
        </g>
      </g>
    `;
  }

  private _renderFallingKibble() {
    const pieces = SCATTER.slice(0, 7).map((t, i) => {
      const x = CX + t * (BASIN_HALF_W - 6);
      const delayMs = i * 70;
      const durationMs = 320;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;--fall-to:${FLOOR_Y - 30}px;`;
      return svg`<g class="drop" style=${style}>${cloverPiece(x, 0, 7, t * 60)}</g>`;
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
    .shadow {
      fill: rgba(0, 0, 0, 0.16);
    }
    .body {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
      stroke: var(--primary-text-color);
      stroke-width: 2.6;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
    }
    .basin-far {
      fill: var(--divider-color);
    }
    .basin-near {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.16));
    }
    .divider line {
      stroke: var(--primary-text-color);
      stroke-width: 1.4;
    }
    .fill {
      fill: var(--kibble-amber);
    }
    .texture circle {
      fill: var(--kibble-amber-dark);
    }
    .drops circle {
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
      font-size: var(--kibble-number-size, 34px);
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
      font-size: calc(var(--kibble-number-size, 34px) * 0.72);
    }
  `;
}

customElements.define("kibble-bowl", KibbleBowl);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-bowl": KibbleBowl;
  }
}
