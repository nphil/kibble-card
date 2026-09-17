/** The bowl: the card's primary status object, drawn as the feeder's food bowl seen from the
 * front — a wide, low dish with a turned rim, its interior a recessed dark cavity in which a level
 * of textured kibble rises in proportion to how full the camera says the bowl is (the reading is
 * the feeder's own vision estimate of bowl fullness, not a hopper sensor — kibble docs/34). When
 * the two hoppers report separately the dish is split by the divider into two cavities ("01"/"02",
 * the YumShare Dual's own marks). No numbers on the face; the exact percentage is the element's
 * accessible name and tooltip.
 *
 * Theming: every surface derives from Home Assistant's theme variables. The plastic is the card
 * background lifted toward the text colour (`color-mix`), so a dark theme gets a dark-grey dish
 * with light highlights and a light theme the near-white one; the cavity and marks follow the
 * text colour; the level uses the card's own amber tokens.
 */

import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import type { PropertyValues } from "lit";
import { combineBowlFill } from "../lib/bowl-fill";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 240;
const VIEW_H = 176;
const CX = 120;
/** The dish body: a wide mouth curving down into a rounded belly and a small flat foot. */
const RIM_Y = 34;
const RIM_X = 10;
const RIM_W = VIEW_W - RIM_X * 2;
const RIM_H = 18;
const FOOT_Y = 158;
const FOOT_HALF = 44;
/** The cavity (the gauge): its interior runs between CAV_TOP and CAV_BOTTOM. */
const CAV_TOP = RIM_Y + 8;
const CAV_BOTTOM = 124;
const CAV_INSET = 32;
const DIVIDER_W = 10;
/** Kibble texture inside the level: a fixed zig-zag of dots, clipped by the level itself. */
const TEXTURE_STEP = 9;

const SCATTER = [-0.5, -0.2, 0.1, 0.4, -0.35, 0.25, 0];

/** The brand's kibble motif as three overlapping lobes — a rounded clover, not a circle. */
function cloverPiece(x: number, y: number, r: number, rotationDeg: number): SVGTemplateResult {
  const lobes = [0, 120, 240].map((angle) => {
    const rad = ((angle + rotationDeg) * Math.PI) / 180;
    return svg`<circle cx=${(x + Math.cos(rad) * r * 0.55).toFixed(1)} cy=${(y + Math.sin(rad) * r * 0.55).toFixed(1)} r=${(r * 0.62).toFixed(1)} />`;
  });
  return svg`<g>${lobes}</g>`;
}

/** The dish silhouette: a rounded rim line, walls that curve inward as they descend, a rounded
 * belly and a short flat foot -- the feeder's own bowl in elevation. */
function dishPath(): string {
  const left = RIM_X;
  const right = RIM_X + RIM_W;
  const r = 9;
  return [
    `M ${left + r} ${RIM_Y}`,
    `H ${right - r}`,
    `q ${r} 0 ${r} ${r}`,
    // right wall: bows outward slightly, then sweeps in to the foot
    `C ${right} ${RIM_Y + 70}, ${CX + FOOT_HALF + 30} ${FOOT_Y - 10}, ${CX + FOOT_HALF} ${FOOT_Y}`,
    `H ${CX - FOOT_HALF}`,
    `C ${CX - FOOT_HALF - 30} ${FOOT_Y - 10}, ${left} ${RIM_Y + 70}, ${left} ${RIM_Y + r}`,
    `q 0 ${-r} ${r} ${-r}`,
    "Z",
  ].join(" ");
}

/** One cavity of the dish: a pocket whose walls follow the dish's own curve, so the level sits
 * inside the bowl rather than in a box drawn on it. */
function cavityPath(x0: number, x1: number): string {
  const r = 14;
  const depth = CAV_BOTTOM - CAV_TOP;
  const inset = Math.min(18, (x1 - x0) * 0.16);
  return [
    `M ${x0} ${CAV_TOP}`,
    `H ${x1}`,
    `C ${x1} ${CAV_TOP + depth * 0.55}, ${x1 - inset + r} ${CAV_BOTTOM}, ${x1 - inset - r} ${CAV_BOTTOM}`,
    `H ${x0 + inset + r}`,
    `C ${x0 + inset - r} ${CAV_BOTTOM}, ${x0} ${CAV_TOP + depth * 0.55}, ${x0} ${CAV_TOP}`,
    "Z",
  ].join(" ");
}

interface Cavity {
  x0: number;
  x1: number;
  mark: string | null;
  /** `null` when the feeder has no valid reading -- an empty cavity would claim "empty". */
  fraction: number | null;
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
  private _dropTimer: number | undefined;

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
    if (changed.has("feeding")) {
      if (this.feeding && !this._wasFeeding && !prefersReducedMotion()) {
        this._dropping = true;
        clearTimeout(this._dropTimer);
        this._dropTimer = setTimeout(() => {
          this._dropping = false;
          this.requestUpdate();
        }, KIBBLE_FALL_DURATION_MS) as unknown as number;
      }
      this._wasFeeding = this.feeding;
    }
  }

  render() {
    const display = combineBowlFill(this.hopper1, this.hopper2);
    const label = display.split
      ? `Bowl side 1 ${Math.round(display.hopper1!)}%, side 2 ${Math.round(display.hopper2!)}%`
      : display.combined == null
        ? "Bowl level unknown"
        : `Bowl ${Math.round(display.combined)}% full`;
    const inner0 = RIM_X + CAV_INSET;
    const inner1 = RIM_X + RIM_W - CAV_INSET;
    const cavities: Cavity[] = display.split
      ? [
          { x0: inner0, x1: CX - DIVIDER_W / 2, mark: "01", fraction: display.hopper1! / 100 },
          { x0: CX + DIVIDER_W / 2, x1: inner1, mark: "02", fraction: display.hopper2! / 100 },
        ]
      : [{ x0: inner0, x1: inner1, mark: null, fraction: display.combined == null ? null : display.combined / 100 }];

    return html`
      <svg class="art" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label=${label} preserveAspectRatio="xMidYMid meet">
        <title>${label}</title>
        <defs>
          <linearGradient id="silo-body" x1="0" x2="1">
            <stop offset="0" stop-color="var(--silo-shade)" />
            <stop offset="0.18" stop-color="var(--silo-light)" />
            <stop offset="0.62" stop-color="var(--silo-mid)" />
            <stop offset="1" stop-color="var(--silo-dark)" />
          </linearGradient>
          <linearGradient id="silo-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--silo-light)" />
            <stop offset="1" stop-color="var(--silo-shade)" />
          </linearGradient>
          <linearGradient id="silo-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--silo-glass-edge)" />
            <stop offset="1" stop-color="var(--silo-glass)" />
          </linearGradient>
          <linearGradient id="silo-food" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--kibble-amber)" />
            <stop offset="1" stop-color="var(--kibble-amber-dark)" />
          </linearGradient>
          <filter id="silo-inner" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" /></filter>
          ${cavities.map((c, i) => svg`<clipPath id=${`silo-win-${i}`}><path d=${cavityPath(c.x0, c.x1)} /></clipPath>`)}
        </defs>
        <path class="body" d=${dishPath()} />
        <rect class="cap" x=${RIM_X - 4} y=${RIM_Y - 4} width=${RIM_W + 8} height=${RIM_H} rx="9" />
        <rect class="cap-highlight" x=${RIM_X + 6} y=${RIM_Y} width=${RIM_W - 12} height="4" rx="2" />
        <path class="body-edge" d=${dishPath()} />
        ${cavities.map((c, i) => this._renderCavity(c, i))}
        ${this._dropping ? this._renderFallingKibble() : nothing}
      </svg>
    `;
  }

  /** One cavity: recessed dark interior with an inner shadow, the level clipped to it with a
   * kibble texture and a surface highlight (nothing at zero — an empty bowl is an empty cavity,
   * not a sliver), and the printed mark on the rim above. A `null` fraction means the feeder has
   * no reading (kibble docs/34): the cavity shows a "?" rather than reading as empty, which is
   * the difference between "I don't know" and "your cat has no food". */
  private _renderCavity(c: Cavity, i: number) {
    const clip = `url(#silo-win-${i})`;
    const w = c.x1 - c.x0;
    const markX = c.x0 + w / 2;
    if (c.fraction == null) {
      return svg`
        <g>
          <path class="glass" d=${cavityPath(c.x0, c.x1)} />
          <text class="unknown" x=${markX} y=${(CAV_TOP + CAV_BOTTOM) / 2 + 2} text-anchor="middle" dominant-baseline="central">?</text>
          ${c.mark ? svg`<text class="mark" x=${markX} y=${RIM_Y + 9} text-anchor="middle">${c.mark}</text>` : nothing}
        </g>
      `;
    }
    const fraction = Math.max(0, Math.min(1, c.fraction));
    const top = CAV_BOTTOM - (CAV_BOTTOM - CAV_TOP) * fraction;
    const dots: SVGTemplateResult[] = [];
    if (fraction > 0) {
      let row = 0;
      for (let y = top + 6; y < CAV_BOTTOM; y += TEXTURE_STEP, row += 1) {
        const cols = Math.max(1, Math.floor(w / 14));
        for (let k = 0; k < cols; k += 1) {
          const x = c.x0 + 7 + k * 14 + (row % 2 === 0 ? 0 : 7);
          if (x < c.x1 - 6) dots.push(svg`<circle cx=${x.toFixed(1)} cy=${y.toFixed(1)} r="2.6" />`);
        }
      }
    }
    return svg`
      <g>
        <path class="glass" d=${cavityPath(c.x0, c.x1)} />
        <g clip-path=${clip}>
          <rect class="glass-inner" x=${c.x0 - 2} y=${CAV_TOP - 8} width=${w + 4} height=${CAV_BOTTOM - CAV_TOP + 4} filter="url(#silo-inner)" />
          ${fraction > 0
            ? svg`
                <rect class="fill" x=${c.x0} y=${top} width=${w} height=${CAV_BOTTOM - top + 2} />
                <g class="texture">${dots}</g>
                <rect class="fill-surface" x=${c.x0} y=${top} width=${w} height="2" />
              `
            : nothing}
        </g>
        ${c.mark ? svg`<text class="mark" x=${markX} y=${RIM_Y + 9} text-anchor="middle">${c.mark}</text>` : nothing}
      </g>
    `;
  }

  private _renderFallingKibble() {
    const pieces = SCATTER.map((t, i) => {
      const x = CX + t * 40;
      const delayMs = i * 70;
      const durationMs = 380;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;--fall-to:34px;`;
      return svg`<g class="drop" style=${style}>${cloverPiece(x, 4, 6, t * 60)}</g>`;
    });
    return svg`<g class="drops">${pieces}</g>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      /* The plastic: the card background lifted toward the text colour in four steps, so the
       * lit face, the mid tone, the turned edges and the rim all come from the theme. */
      --silo-base: var(--card-background-color, var(--ha-card-background, #fff));
      --silo-ink: var(--primary-text-color, #222);
      --silo-light: color-mix(in srgb, var(--silo-base) 78%, var(--silo-ink));
      --silo-mid: color-mix(in srgb, var(--silo-base) 84%, var(--silo-ink));
      --silo-shade: color-mix(in srgb, var(--silo-base) 68%, var(--silo-ink));
      --silo-dark: color-mix(in srgb, var(--silo-base) 58%, var(--silo-ink));
      /* The cavity is the bowl's interior: always darker than the plastic, in both themes, so
       * the level reads as something inside the dish. */
      --silo-glass: color-mix(in srgb, var(--silo-base) 40%, #000);
      --silo-glass-edge: color-mix(in srgb, var(--silo-base) 52%, #000);
    }
    .art {
      display: block;
      width: auto;
      max-width: var(--kibble-bowl-max-width, 190px);
      height: 100%;
      max-height: 100%;
      aspect-ratio: ${VIEW_W} / ${VIEW_H};
      margin: 0 auto;
      overflow: visible;
    }
    .body {
      fill: url(#silo-body);
    }
    /* On a light card the near-white plastic needs an edge to read as an object; on a dark
     * card the same 0.14 alpha of the text colour is invisible, which is the point. */
    .body-edge {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-opacity: 0.14;
      stroke-width: 1;
    }
    .cap {
      fill: url(#silo-cap);
    }
    .cap-highlight {
      fill: var(--silo-ink);
      opacity: 0.16;
    }
    .glass {
      fill: url(#silo-glass);
    }
    .glass-inner {
      fill: #000;
      opacity: 0.35;
    }
    .fill {
      fill: url(#silo-food);
      transition: y 500ms cubic-bezier(0.2, 0.8, 0.2, 1), height 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .texture circle {
      fill: var(--kibble-amber-dark);
      opacity: 0.55;
    }
    .fill-surface {
      fill: #fff;
      opacity: 0.5;
    }
    .unknown {
      /* Same ink as the printed rim marks, just larger: legible against the dark cavity in
       * either theme, still clearly a label rather than a level. */
      fill: var(--secondary-text-color, var(--primary-text-color));
      font-size: 36px;
      font-weight: 700;
      opacity: 0.6;
    }
    .mark {
      fill: var(--secondary-text-color, var(--primary-text-color));
      opacity: 0.7;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.14em;
      font-family: inherit;
    }
    .drops circle {
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
        opacity: 0;
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
