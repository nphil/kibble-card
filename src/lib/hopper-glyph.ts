/** The hopper tank glyph: a small reserve tank with a fill port cap, shared between the hero's
 * compact tile (`kibble-bowl.ts`) and the detail sheet's larger row (`kibble-hopper-sheet.ts`)
 * so both draw the exact same shape -- only the wrapping component's own CSS decides how big
 * `.tank` renders; the `viewBox` scales the same geometry to fit either. Same "shared drawing
 * helper" pattern as `brand-shapes.ts`'s `catSilhouette`/`kibblePiece`.
 */

import { svg, type SVGTemplateResult } from "lit";
import { HOPPER_LOW_LINE, type HopperView } from "./hopper-status";

const TANK_VB_H = 46;
const TANK_X = 5;
const TANK_Y = 8;
const TANK_H = 34;
const TANK_R = 7;
const TANK_CAP_Y = 2;
const TANK_CAP_W = 8;
const TANK_CAP_H = 7;
const TANK_CAP_R = 2;
/** Body width of one compartment, and of the single undivided hopper (both halves' worth). */
const TANK_W_SINGLE_COMPARTMENT = 24;
const TANK_W_UNDIVIDED = 48;

/** One hopper's tank glyph. The low line is a fixed reference tick at `HOPPER_LOW_LINE`, drawn
 * for every tone except `unknown` -- there is nothing to compare against a level nobody has
 * reported yet, so `unknown` gets a dash inside the tank instead. Renders with `class="tank"
 * data-tone="..."`, styled entirely by the consuming component (fill colour, size). */
export function hopperTank(view: HopperView): SVGTemplateResult {
  const clipId = `hopper-clip-${view.index ?? "all"}`;
  const TANK_W = view.index === null ? TANK_W_UNDIVIDED : TANK_W_SINGLE_COMPARTMENT;
  const TANK_VB_W = TANK_W + TANK_X * 2;
  const TANK_CAP_X = TANK_X + (TANK_W - TANK_CAP_W) / 2;
  const lowLineY = (TANK_Y + TANK_H * (1 - HOPPER_LOW_LINE)).toFixed(1);
  const fraction = view.fillFraction;
  return svg`
    <svg class="tank" data-tone=${view.tone} data-wide=${view.index === null} viewBox="0 0 ${TANK_VB_W} ${TANK_VB_H}" aria-hidden="true">
      <defs>
        <clipPath id=${clipId}><rect x=${TANK_X} y=${TANK_Y} width=${TANK_W} height=${TANK_H} rx=${TANK_R} /></clipPath>
      </defs>
      <rect class="tank-cap" x=${TANK_CAP_X} y=${TANK_CAP_Y} width=${TANK_CAP_W} height=${TANK_CAP_H} rx=${TANK_CAP_R} />
      <rect class="tank-body" x=${TANK_X} y=${TANK_Y} width=${TANK_W} height=${TANK_H} rx=${TANK_R} />
      ${fraction != null && fraction > 0
        ? svg`<g clip-path="url(#${clipId})"><rect class="tank-fill" x=${TANK_X} y=${(TANK_Y + TANK_H * (1 - fraction)).toFixed(1)} width=${TANK_W} height=${(TANK_H * fraction + 1).toFixed(1)} /></g>`
        : ""}
      ${view.tone !== "unknown"
        ? svg`<line class="tank-low-line" x1=${TANK_X + 2} y1=${lowLineY} x2=${TANK_X + TANK_W - 2} y2=${lowLineY} />`
        : svg`<text class="tank-unknown" x=${TANK_X + TANK_W / 2} y=${TANK_Y + TANK_H / 2 + 1} text-anchor="middle" dominant-baseline="central">\u2013</text>`}
      <rect class="tank-outline" x=${TANK_X} y=${TANK_Y} width=${TANK_W} height=${TANK_H} rx=${TANK_R} />
    </svg>
  `;
}

/** Shared CSS for `.tank` and its parts -- both consumers interpolate this once into their own
 * `static styles` (a Lit `css` template can embed another verbatim via `${TANK_STYLES}`) so the
 * tone colours and stroke treatment can never drift between the tile and the sheet. Sizing
 * (`width`/`height` on `.tank` itself) is deliberately left to each consumer. */
export const TANK_STYLES = `
  /* The undivided tank keeps the compartment's height and doubles its body width. */
  .tank[data-wide="true"] {
    width: 50px;
  }
  .tank-cap,
  .tank-body {
    fill: var(--silo-mid);
    stroke: var(--primary-text-color);
    stroke-opacity: 0.16;
    stroke-width: 1;
  }
  .tank-outline {
    fill: none;
    stroke: var(--primary-text-color);
    stroke-opacity: 0.16;
    stroke-width: 1;
  }
  .tank-low-line {
    stroke: var(--primary-text-color);
    stroke-opacity: 0.32;
    stroke-width: 1;
    stroke-dasharray: 2 1.4;
  }
  .tank-fill {
    transition: y 400ms cubic-bezier(0.2, 0.8, 0.2, 1), height 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .tank[data-tone="ok"] .tank-fill {
    fill: var(--kibble-feed, #43a96a);
  }
  .tank[data-tone="low"] .tank-fill {
    fill: var(--kibble-amber-dark, #de8a3a);
  }
  .tank[data-tone="empty"] .tank-body,
  .tank[data-tone="empty"] .tank-cap,
  .tank[data-tone="empty"] .tank-outline {
    stroke: var(--error-color, #db4437);
    stroke-opacity: 0.75;
  }
  .tank[data-tone="unknown"] .tank-body,
  .tank[data-tone="unknown"] .tank-cap {
    stroke-dasharray: 2.5 2;
    opacity: 0.55;
  }
  .tank-unknown {
    fill: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 700;
  }
`;
