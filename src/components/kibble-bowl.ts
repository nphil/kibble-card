/** The bowl: the card's primary status object, drawn as the feeder's food bowl seen from the
 * front — a wide, low dish with a turned rim, its interior a recessed dark cavity in which a level
 * of textured kibble rises in proportion to how full the camera says the bowl is (the reading is
 * the feeder's own vision estimate of bowl fullness, not a hopper sensor — kibble docs/34; there is
 * exactly one such reading, the whole bowl, so one cavity: the second value the feeder keeps beside
 * it is the same reading snapshotted when the last meal began, not a second side). No numbers on
 * the face by default -- the raw score means nothing to a viewer without a curve to read it
 * against (`lib/calibration.ts`), so it stays the element's accessible name and tooltip only.
 * Once the hopper this display draws from has a finished calibration curve, a second line
 * appears with the real percentage, raw score alongside it rather than instead of it -- every
 * existing threshold in this codebase is still expressed in the raw number, so it never
 * disappears just because a curve now exists. Under the dish, one line of text for the hoppers
 * themselves -- the reservoirs above the bowl have only a food-shortage sensor each (empty /
 * low / ok, never a percentage), so their state is a word, coloured only when a side needs
 * refilling.
 *
 * Theming: every surface derives from Home Assistant's theme variables. The plastic is the card
 * background lifted toward the text colour (`color-mix`), so a dark theme gets a dark-grey dish
 * with light highlights and a light theme the near-white one; the cavity and marks follow the
 * text colour; the level uses the card's own amber tokens.
 */

import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import type { PropertyValues } from "lit";
import { hopperStatus, type HopperLevel } from "../lib/hopper-status";
import { calibratedPercent } from "../lib/calibration";
import type { CalibrationHopper } from "../types";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const VIEW_W = 240;
const VIEW_H = 176;
const CX = 120;
/** The dish body: a wide mouth curving down into a rounded belly and a small flat foot. */
const RIM_Y = 34;
const RIM_X = 10;
const RIM_W = VIEW_W - RIM_X * 2;
// The rim band. Was 18, which at this scale drew a lip thicker than the bowl's own wall --
// the eye reads that as a rolled edge on a plastic tub, not the thin rim of a dish.
const RIM_H = 11;
const FOOT_Y = 158;
const FOOT_HALF = 44;
/** Wall thickness: the interior is the dish silhouette inset by this much, so the bowl reads
 * as a shell with a hollow rather than a solid shape with a gauge drawn on its face.
 *
 * Until 2026-09-20 the interior was an independent rounded pocket ending at y=124 while the
 * dish's own foot is at 158, so the level's bottom edge floated in the middle of the bowl and
 * its walls ran straight where the bowl's curve inward. It read, correctly, as a separate
 * panel laid over the graphic. */
const WALL = 9;
/** The interior's mouth, just under the rim band, and its floor, just above the foot. */
const CAV_TOP = RIM_Y + RIM_H - 4;
const CAV_BOTTOM = FOOT_Y - WALL;
/** Kibble texture inside the level: a fixed zig-zag of dots, clipped by the level itself. */
const TEXTURE_STEP = 9;

const SCATTER = [-0.5, -0.2, 0.1, 0.4, -0.35, 0.25, 0];
/** Matches the card's own portion picker; a bad `portions` cannot flood the animation. */
const MAX_PORTIONS = 10;
/** A dispense runs ~4 s per portion, but a feed whose `feeding` flag never clears must not
 * animate forever -- that state was real as recently as the MCU ack bug on 2026-09-20. */
const MAX_DROP_MS = 60_000;

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

/** The hollow inside the dish: the same silhouette as [`dishPath`], inset by [`WALL`].
 *
 * Every control point mirrors the outer path's, which is the whole point -- the inside of a
 * bowl is the outside minus its wall, so the level that fills it curves exactly the way the
 * bowl does and meets the rim where the rim is. */
function cavityPath(): string {
  const left = RIM_X + WALL;
  const right = RIM_X + RIM_W - WALL;
  const footHalf = FOOT_HALF - WALL;
  return [
    `M ${left} ${CAV_TOP}`,
    `H ${right}`,
    // Mirrors dishPath's right wall: bows out, then sweeps in to the floor.
    `C ${right} ${CAV_TOP + 62}, ${CX + footHalf + 26} ${CAV_BOTTOM - 9}, ${CX + footHalf} ${CAV_BOTTOM}`,
    `H ${CX - footHalf}`,
    `C ${CX - footHalf - 26} ${CAV_BOTTOM - 9}, ${left} ${CAV_TOP + 62}, ${left} ${CAV_TOP}`,
    "Z",
  ].join(" ");
}


export class KibbleBowl extends LitElement {
  static properties = {
    fill: { type: Number },
    hopperLevel1: { type: String },
    hopperLevel2: { type: String },
    feeding: { type: Boolean },
    portions: { type: Number },
    calibration: { attribute: false },
  };

  /** Bowl fullness 0-100, `null` when the feeder has no reading. */
  declare fill: number | null;
  declare hopperLevel1: HopperLevel | null;
  declare hopperLevel2: HopperLevel | null;
  declare feeding: boolean;
  /** How many servings the pending feed will dispense: the falling kibble is scaled to it, so
   * asking for four does not look like asking for one. */
  declare portions: number;
  /** The hopper `lib/calibration.ts:displayCalibrationHopper` picked to interpret `fill`
   * against, or `null` when nothing usable is calibrated yet. */
  declare calibration: CalibrationHopper | null;

  private _wasFeeding = false;
  private _dropping = false;
  private _dropTimer: number | undefined;

  constructor() {
    super();
    this.fill = null;
    this.hopperLevel1 = null;
    this.hopperLevel2 = null;
    this.feeding = false;
    this.portions = 1;
    this.calibration = null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._dropTimer);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("feeding")) {
      // The stream runs for as long as the feeder is actually dispensing, rather than for a
      // fixed burst: a dispense takes ~4 s per portion (measured on the MCU link), so a
      // 900 ms animation finished while the motor was still running and the card went still
      // in the middle of the very event it was depicting. Now it starts when `feeding` does
      // and stops one fall-time after it clears, which lets the last pieces land.
      if (this.feeding && !this._wasFeeding && !prefersReducedMotion()) {
        clearTimeout(this._dropTimer);
        this._dropping = true;
        // A safety stop: if `feeding` somehow never clears (the abandoned-feed case the MCU
        // ack bug used to produce), the bowl must not animate for the rest of the session.
        this._dropTimer = setTimeout(() => {
          this._dropping = false;
          this.requestUpdate();
        }, MAX_DROP_MS) as unknown as number;
      } else if (!this.feeding && this._wasFeeding && this._dropping) {
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
    // `calibratedPercent` expects the curve's own 0.0-1.0 scale, not `fill`'s live 0-100 one --
    // see that function's doc comment for why those two units differ (confirmed against the
    // daemon: `score = bowl_fill / 100`, exactly).
    const calibratedFillPercent = this.fill == null ? null : calibratedPercent(this.calibration, this.fill / 100);
    const label =
      calibratedFillPercent != null
        ? `Bowl ${Math.round(calibratedFillPercent)}% full (raw score ${Math.round(this.fill!)})`
        : this.fill == null
          ? "Bowl level unknown"
          : `Bowl ${Math.round(this.fill)}% full`;
    // The level spans the interior's full mouth and is clipped to its outline, so its edges
    // are the bowl's own curves rather than a narrower box inside them.
    const x0 = RIM_X + WALL;
    const x1 = RIM_X + RIM_W - WALL;
    const fraction = this.fill == null ? null : this.fill / 100;
    const hopper = hopperStatus(this.hopperLevel1, this.hopperLevel2);

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
          <clipPath id="silo-win"><path d=${cavityPath()} /></clipPath>
        </defs>
        <path class="body" d=${dishPath()} />
        ${this._renderCavity(x0, x1, fraction)}
        <rect class="cap" x=${RIM_X - 3} y=${RIM_Y - 3} width=${RIM_W + 6} height=${RIM_H} rx="5.5" />
        <rect class="cap-highlight" x=${RIM_X + 6} y=${RIM_Y - 1} width=${RIM_W - 12} height="2.5" rx="1.25" />
        <path class="body-edge" d=${dishPath()} />
        ${this._dropping ? this._renderFallingKibble() : nothing}
      </svg>
      ${calibratedFillPercent != null
        ? html`<div class="calibrated" role="status">${Math.round(calibratedFillPercent)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill!)}</span></div>`
        : nothing}
      ${hopper ? html`<div class="hopper" data-tone=${hopper.tone} role="status">${hopper.text}</div>` : nothing}
    `;
  }

  /** The cavity: recessed dark interior with an inner shadow, the level clipped to it with a
   * kibble texture and a surface highlight (nothing at zero — an empty bowl is an empty cavity,
   * not a sliver). A `null` fraction means the feeder has no reading (kibble docs/34): the
   * cavity shows a "?" rather than reading as empty, which is the difference between "I don't
   * know" and "your cat has no food". */
  private _renderCavity(x0: number, x1: number, rawFraction: number | null) {
    const w = x1 - x0;
    const midX = x0 + w / 2;
    if (rawFraction == null) {
      return svg`
        <g>
          <path class="glass" d=${cavityPath()} />
          <text class="unknown" x=${midX} y=${(CAV_TOP + CAV_BOTTOM) / 2 + 2} text-anchor="middle" dominant-baseline="central">?</text>
        </g>
      `;
    }
    const fraction = Math.max(0, Math.min(1, rawFraction));
    const top = CAV_BOTTOM - (CAV_BOTTOM - CAV_TOP) * fraction;
    const dots: SVGTemplateResult[] = [];
    if (fraction > 0) {
      let row = 0;
      for (let y = top + 6; y < CAV_BOTTOM; y += TEXTURE_STEP, row += 1) {
        const cols = Math.max(1, Math.floor(w / 14));
        for (let k = 0; k < cols; k += 1) {
          const x = x0 + 7 + k * 14 + (row % 2 === 0 ? 0 : 7);
          if (x < x1 - 6) dots.push(svg`<circle cx=${x.toFixed(1)} cy=${y.toFixed(1)} r="2.6" />`);
        }
      }
    }
    return svg`
      <g>
        <path class="glass" d=${cavityPath()} />
        <g clip-path="url(#silo-win)">
          <rect class="glass-inner" x=${x0 - 2} y=${CAV_TOP - 8} width=${w + 4} height=${CAV_BOTTOM - CAV_TOP + 4} filter="url(#silo-inner)" />
          ${fraction > 0
            ? svg`
                <rect class="fill" x=${x0} y=${top} width=${w} height=${CAV_BOTTOM - top + 2} />
                <g class="texture">${dots}</g>
                <rect class="fill-surface" x=${x0} y=${top} width=${w} height="2" />
              `
            : nothing}
        </g>
      </g>
    `;
  }

  /** The falling stream, scaled to the servings being dispensed.
   *
   * One serving and four used to look identical -- seven pieces either way -- which made the
   * animation decorative rather than informative. The count now grows with `portions` and the
   * pieces loop for as long as the feeder is actually running, so the card depicts the event
   * happening rather than playing a fixed jingle at the start of it. */
  private _renderFallingKibble() {
    const servings = Math.max(1, Math.min(MAX_PORTIONS, Math.round(this.portions || 1)));
    const count = Math.min(SCATTER.length * 3, 5 + servings * 4);
    const cycleMs = 520;
    const pieces = Array.from({ length: count }, (_, i) => {
      const t = SCATTER[i % SCATTER.length] + (i >= SCATTER.length ? (i % 3) * 0.11 - 0.11 : 0);
      const x = CX + t * 40;
      // Spread the launches evenly across one cycle and loop: a continuous fall, not a burst
      // that lands and leaves the bowl static while the motor still turns.
      const delayMs = Math.round((i / count) * cycleMs);
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${cycleMs}ms;--fall-rotate:${(t * 180).toFixed(0)}deg;--fall-to:34px;`;
      return svg`<g class="drop" style=${style}>${cloverPiece(x, 4, 5.4, t * 60)}</g>`;
    });
    return svg`<g class="drops">${pieces}</g>`;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      min-height: 0;
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
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      aspect-ratio: ${VIEW_W} / ${VIEW_H};
      margin: 0 auto;
      overflow: visible;
    }
    /* The calibrated readout: a real, meaningful number now that a curve exists, so unlike the
     * raw score it earns primary-text weight -- the raw figure stays too, just secondary,
     * since every existing threshold elsewhere is still keyed to it, never this one. */
    .calibrated {
      flex: none;
      margin-top: 6px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .calibrated .raw {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    /* The hopper line: secondary text when stocked, the card's amber when a side is running
     * low, the theme's error colour when one is empty. */
    .hopper {
      flex: none;
      margin-top: 4px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.2;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .hopper[data-tone="low"] {
      color: var(--kibble-amber-dark);
    }
    .hopper[data-tone="empty"] {
      color: var(--error-color, #db4437);
      font-weight: 600;
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
    .drops circle {
      fill: var(--kibble-amber-dark);
      animation: kibble-drop var(--fall-duration) cubic-bezier(0.4, 0, 1, 1) var(--fall-delay) infinite both;
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
