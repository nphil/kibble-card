/** The hopper: the card's primary status object, drawn as the feeder's own silhouette — the tall
 * rounded silo with the vertical sight windows on its face (the YumShare Dual's "01"/"02"
 * marks). Rendered, not diagrammed: studio-lit matte plastic, recessed dark windows, a level of
 * textured kibble rising inside each window in proportion to the hopper fill (one wide window
 * when the hoppers aren't reported separately). No numbers on the face; the exact percentages
 * are the element's accessible name and tooltip.
 *
 * Theming: every surface derives from Home Assistant's theme variables. The plastic is the card
 * background lifted toward the text colour (`color-mix`), so a dark theme gets a dark-grey silo
 * with light highlights and a light theme the near-white one; windows, marks and shadow follow
 * the text colour; the level uses the card's own amber tokens.
 */

import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import type { PropertyValues } from "lit";
import { combineBowlFill } from "../lib/bowl-fill";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 200;
const VIEW_H = 224;
const CX = 100;
const BODY_X = 36;
const BODY_Y = 14;
const BODY_W = 128;
const BODY_H = 200;
const BODY_R = 18;
/** The sight windows: the gauge runs between WIN_TOP and WIN_BOTTOM. */
const WIN_TOP = 44;
const WIN_BOTTOM = 184;
const WIN_W = 24;
const WIN_R = 10;
const WIN_GAP = 36;
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

interface SightWindow {
  x: number;
  w: number;
  mark: string | null;
  fraction: number;
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
        ? "Hopper level unknown"
        : `Hopper ${Math.round(display.combined)}% full`;
    const windows: SightWindow[] = display.split
      ? [
          { x: CX - WIN_GAP / 2 - WIN_W, w: WIN_W, mark: "01", fraction: display.hopper1! / 100 },
          { x: CX + WIN_GAP / 2, w: WIN_W, mark: "02", fraction: display.hopper2! / 100 },
        ]
      : [{ x: CX - WIN_W, w: WIN_W * 2, mark: null, fraction: (display.combined ?? 0) / 100 }];

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
          <linearGradient id="silo-glass" x1="0" x2="1">
            <stop offset="0" stop-color="var(--silo-glass-edge)" />
            <stop offset="0.5" stop-color="var(--silo-glass)" />
            <stop offset="1" stop-color="var(--silo-glass-edge)" />
          </linearGradient>
          <linearGradient id="silo-food" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--kibble-amber)" />
            <stop offset="1" stop-color="var(--kibble-amber-dark)" />
          </linearGradient>
          <filter id="silo-inner" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" /></filter>
          ${windows.map((w, i) => svg`<clipPath id=${`silo-win-${i}`}><rect x=${w.x} y=${WIN_TOP} width=${w.w} height=${WIN_BOTTOM - WIN_TOP} rx=${WIN_R} /></clipPath>`)}
        </defs>
        <rect class="body" x=${BODY_X} y=${BODY_Y} width=${BODY_W} height=${BODY_H} rx=${BODY_R} />
        <rect class="cap" x=${BODY_X} y=${BODY_Y} width=${BODY_W} height="26" rx="13" />
        <rect class="cap-highlight" x=${BODY_X + 6} y=${BODY_Y + 6} width=${BODY_W - 12} height="9" rx="4.5" />
        <rect class="body-edge" x=${BODY_X} y=${BODY_Y} width=${BODY_W} height=${BODY_H} rx=${BODY_R} />
        ${windows.map((w, i) => this._renderWindow(w, i))}
        ${this._dropping ? this._renderFallingKibble() : nothing}
      </svg>
    `;
  }

  /** One sight window: recessed dark glass with an inner shadow, the level clipped to it with a
   * kibble texture and a surface highlight (nothing at zero — an empty hopper is an empty window,
   * not a sliver), a vertical reflection, and the printed mark above. */
  private _renderWindow(w: SightWindow, i: number) {
    const fraction = Math.max(0, Math.min(1, w.fraction));
    const top = WIN_BOTTOM - (WIN_BOTTOM - WIN_TOP) * fraction;
    const clip = `url(#silo-win-${i})`;
    const dots: SVGTemplateResult[] = [];
    if (fraction > 0) {
      let row = 0;
      for (let y = top + 6; y < WIN_BOTTOM; y += TEXTURE_STEP, row += 1) {
        const x = w.x + w.w / 2 + (row % 2 === 0 ? -w.w * 0.22 : w.w * 0.22);
        dots.push(svg`<circle cx=${x.toFixed(1)} cy=${y.toFixed(1)} r="2.6" />`);
      }
    }
    return svg`
      <g>
        <rect class="glass" x=${w.x} y=${WIN_TOP} width=${w.w} height=${WIN_BOTTOM - WIN_TOP} rx=${WIN_R} />
        <g clip-path=${clip}>
          <rect class="glass-inner" x=${w.x - 2} y=${WIN_TOP - 8} width=${w.w + 4} height=${WIN_BOTTOM - WIN_TOP + 4} rx=${WIN_R} filter="url(#silo-inner)" />
          ${fraction > 0
            ? svg`
                <rect class="fill" x=${w.x} y=${top} width=${w.w} height=${WIN_BOTTOM - top + 2} />
                <g class="texture">${dots}</g>
                <rect class="fill-surface" x=${w.x} y=${top} width=${w.w} height="2" />
              `
            : nothing}
          <rect class="reflection" x=${w.x + 2.5} y=${WIN_TOP + 3} width="4.5" height=${WIN_BOTTOM - WIN_TOP - 6} rx="2.25" />
        </g>
        ${w.mark ? svg`<text class="mark" x=${w.x + w.w / 2} y=${WIN_TOP - 9} text-anchor="middle">${w.mark}</text>` : nothing}
      </g>
    `;
  }

  private _renderFallingKibble() {
    const pieces = SCATTER.map((t, i) => {
      const x = CX + t * 20;
      const delayMs = i * 70;
      const durationMs = 380;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;--fall-to:20px;`;
      return svg`<g class="drop" style=${style}>${cloverPiece(x, BODY_Y + BODY_H + 4, 6, t * 60)}</g>`;
    });
    return svg`<g class="drops">${pieces}</g>`;
  }

  static styles = css`
    :host {
      display: block;
      /* The plastic: the card background lifted toward the text colour in four steps, so the
       * lit face, the mid tone, the turned edges and the cap all come from the theme. */
      --silo-base: var(--card-background-color, var(--ha-card-background, #fff));
      --silo-ink: var(--primary-text-color, #222);
      --silo-light: color-mix(in srgb, var(--silo-base) 78%, var(--silo-ink));
      --silo-mid: color-mix(in srgb, var(--silo-base) 84%, var(--silo-ink));
      --silo-shade: color-mix(in srgb, var(--silo-base) 68%, var(--silo-ink));
      --silo-dark: color-mix(in srgb, var(--silo-base) 58%, var(--silo-ink));
      /* The sight window shows the hopper's interior: always darker than the plastic, in both
       * themes, so the level reads as something inside the body. */
      --silo-glass: color-mix(in srgb, var(--silo-base) 40%, #000);
      --silo-glass-edge: color-mix(in srgb, var(--silo-base) 52%, #000);
    }
    .art {
      display: block;
      width: 100%;
      max-width: var(--kibble-bowl-max-width, 190px);
      height: auto;
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
    .reflection {
      fill: #fff;
      opacity: 0.14;
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
