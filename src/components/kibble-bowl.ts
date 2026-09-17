/** The bowl: the card's primary status object, drawn as a flat front-on silhouette — one rounded
 * stroke, a shallow curved basin on a small foot — that *is* the gauge: an amber level rises
 * inside it in proportion to the hopper fill, split down the middle when the two hoppers report
 * separately. No numbers on the face; the exact percentages are the element's accessible name
 * and tooltip. Loose kibble pieces appear only in the dispensing animation.
 */

import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import type { PropertyValues } from "lit";
import { combineBowlFill } from "../lib/bowl-fill";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 260;
const VIEW_H = 156;
const CX = 130;
/** The bowl's open top edge and the basin's lowest point: the gauge runs between them. */
const TOP_Y = 34;
const BOTTOM_Y = 132;
const LEFT_X = 22;
const RIGHT_X = 238;
const STROKE = 5;

/** Open top, shallow curved basin: the fill is clipped to this same shape. */
const BOWL_PATH = `M ${LEFT_X} ${TOP_Y} C ${LEFT_X} ${TOP_Y + 74}, ${CX - 62} ${BOTTOM_Y}, ${CX} ${BOTTOM_Y} C ${CX + 62} ${BOTTOM_Y}, ${RIGHT_X} ${TOP_Y + 74}, ${RIGHT_X} ${TOP_Y} Z`;

const SCATTER = [-0.6, -0.32, -0.06, 0.2, 0.46, 0.66, -0.46];

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
    const label = display.split
      ? `Hopper 1 ${Math.round(display.hopper1!)}%, hopper 2 ${Math.round(display.hopper2!)}%`
      : display.combined == null
        ? "Bowl level unknown"
        : `Bowl ${Math.round(display.combined)}% full`;

    return html`
      <svg class="art" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label=${label} preserveAspectRatio="xMidYMid meet">
        <title>${label}</title>
        <defs>
          <clipPath id="bowl-clip"><path d=${BOWL_PATH} /></clipPath>
        </defs>
        <path class="basin" d=${BOWL_PATH} />
        <g clip-path="url(#bowl-clip)">
          ${display.split ? this._renderSplitFill(display.hopper1!, display.hopper2!) : this._renderFill(display.combined ?? 0, 0, VIEW_W)}
        </g>
        ${display.split ? svg`<line class="divider" x1=${CX} y1=${TOP_Y + 10} x2=${CX} y2=${BOTTOM_Y - 8} />` : nothing}
        <path class="outline" d=${BOWL_PATH} />
        <line class="foot" x1=${CX - 34} y1=${BOTTOM_Y + 14} x2=${CX + 34} y2=${BOTTOM_Y + 14} />
        ${this._dropping ? this._renderFallingKibble() : nothing}
      </svg>
    `;
  }

  /** The level: a rect clipped to the bowl, its top edge set by the fill fraction between the
   * basin floor and the open top. `x`/`w` bound it horizontally for the split view. */
  private _renderFill(fraction0to100: number, x: number, w: number) {
    const fraction = Math.max(0, Math.min(1, fraction0to100 / 100));
    const top = BOTTOM_Y - (BOTTOM_Y - TOP_Y) * fraction;
    return svg`<rect class="fill" x=${x} y=${top} width=${w} height=${BOTTOM_Y - top + STROKE} rx="0" />`;
  }

  private _renderSplitFill(hopper1: number, hopper2: number) {
    return svg`
      ${this._renderFill(hopper1, 0, CX)}
      ${this._renderFill(hopper2, CX, VIEW_W - CX)}
    `;
  }

  private _renderFallingKibble() {
    const pieces = SCATTER.slice(0, 7).map((t, i) => {
      const x = CX + t * 80;
      const delayMs = i * 70;
      const durationMs = 320;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;--fall-to:${BOTTOM_Y - 60}px;`;
      return svg`<g class="drop" style=${style}>${cloverPiece(x, 0, 7, t * 60)}</g>`;
    });
    return svg`<g class="drops">${pieces}</g>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .art {
      display: block;
      width: 100%;
      max-width: var(--kibble-bowl-max-width, 280px);
      height: auto;
      margin: 0 auto;
      overflow: visible;
    }
    .basin {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    }
    .outline,
    .foot {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: ${STROKE};
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .foot {
      opacity: 0.55;
    }
    .divider {
      stroke: var(--primary-text-color);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-dasharray: 1 7;
      opacity: 0.55;
    }
    .fill {
      fill: var(--kibble-amber);
      transition: y 500ms cubic-bezier(0.2, 0.8, 0.2, 1), height 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
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
  `;
}

customElements.define("kibble-bowl", KibbleBowl);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-bowl": KibbleBowl;
  }
}
