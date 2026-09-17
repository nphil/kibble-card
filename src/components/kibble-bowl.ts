/** The bowl: the card's primary status object. A single continuous ceramic-dish silhouette
 * (rim, curved sides, a small foot, a contact shadow) that *is* the gauge: an amber level fills
 * the silhouette from the foot toward the rim in proportion to the hopper fill, split down the
 * middle when the two hoppers are reported separately. Loose kibble pieces appear only in the
 * dispensing animation.
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

/** One continuous silhouette: rim's right point down the curved side to the foot, across the
 * foot, up the other side, closed along the rim's own near (front) arc. */
const BODY_PATH = `M ${CX + RIM_RX} ${RIM_CY} C ${CX + RIM_RX} ${RIM_CY + 50}, ${CX + 70} ${FOOT_CY - 13}, ${CX + FOOT_RX} ${FOOT_CY} A ${FOOT_RX} ${FOOT_RY} 0 0 1 ${CX - FOOT_RX} ${FOOT_CY} C ${CX - 70} ${FOOT_CY - 13}, ${CX - RIM_RX} ${RIM_CY + 50}, ${CX - RIM_RX} ${RIM_CY} A ${RIM_RX} ${RIM_RY} 0 0 0 ${CX + RIM_RX} ${RIM_CY} Z`;

const SCATTER = [-0.6, -0.32, -0.06, 0.2, 0.46, 0.66, -0.46, 0.08, 0.34, -0.2];

/** The brand's kibble motif as three overlapping lobes — a rounded clover, not a circle. */
function cloverPiece(x: number, y: number, r: number, rotationDeg: number): SVGTemplateResult {
  const lobes = [0, 120, 240].map((angle) => {
    const rad = ((angle + rotationDeg) * Math.PI) / 180;
    return svg`<circle cx=${(x + Math.cos(rad) * r * 0.55).toFixed(1)} cy=${(y + Math.sin(rad) * r * 0.55).toFixed(1)} r=${(r * 0.62).toFixed(1)} />`;
  });
  return svg`<g>${lobes}</g>`;
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
          <defs>
            <clipPath id="bowl-clip"><path d=${BODY_PATH} /></clipPath>
          </defs>
          <ellipse cx=${CX} cy=${FOOT_CY + 14} rx="66" ry="9" class="shadow" />
          <path class="body" d=${BODY_PATH} />
          <g clip-path="url(#bowl-clip)">
            ${display.split ? this._renderSplitFill(display.hopper1!, display.hopper2!) : this._renderFill(display.combined ?? 0, 0, VIEW_W)}
          </g>
          <path class="outline" d=${BODY_PATH} />
          <ellipse cx=${CX} cy=${RIM_CY} rx=${RIM_RX} ry=${RIM_RY} class="rim" />
          ${display.split ? svg`<line class="divider" x1=${CX} y1=${RIM_CY + RIM_RY} x2=${CX} y2=${FOOT_CY} />` : nothing}
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

  /** The bowl silhouette is the gauge: an amber level rises from the foot toward the rim in
   * proportion to the fill, clipped to the body so the bowl "fills up" rather than carrying a
   * separate pile drawn on top of it. `x`/`w` bound the fill horizontally for the split view. */
  private _renderFill(fraction0to100: number, x: number, w: number) {
    const fraction = Math.max(0, Math.min(1, fraction0to100 / 100));
    const top = FOOT_CY - (FOOT_CY - (RIM_CY + RIM_RY)) * fraction;
    return svg`
      <rect class="fill" x=${x} y=${top} width=${w} height=${FOOT_CY - top + 20} />
      ${fraction > 0 ? svg`<rect class="fill-surface" x=${x} y=${top - 1.5} width=${w} height="3" />` : nothing}
    `;
  }

  private _renderSplitFill(hopper1: number, hopper2: number) {
    return svg`
      ${this._renderFill(hopper1, 0, CX)}
      ${this._renderFill(hopper2, CX, VIEW_W - CX)}
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
    }
    .outline {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 2.6;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
    }
    .divider {
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
      stroke-dasharray: 4 4;
    }
    .fill {
      fill: var(--kibble-amber);
      opacity: 0.9;
      transition: y 400ms ease, height 400ms ease;
    }
    .fill-surface {
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
