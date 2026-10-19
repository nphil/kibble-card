/** The card's primary status object: a hopper (one wide compartment, or two side by side once the
 * divider is in) feeding a chute into a see-through side-view bowl whose level rises with the
 * feeder's own bowl-fill reading. Ported from the approved interactive prototype
 * (`dev/feed-hero.html`) -- clean gradient fills with subtle tone-on-tone textures, no
 * skeuomorphic food rendering and no numbers/ticks/arrows drawn on the bowl itself (a raw score
 * means nothing without a curve to read it against; see `lib/calibration.ts`). The finish -- a
 * dark "Frosted glass" or a bright "Soft ceramic" -- follows the Home Assistant theme via
 * `darkMode`, never a per-instance choice.
 *
 * Two data sources per hopper, same honesty rules as before: the MCU's own three-way point
 * sensor always wins the headline/tone/fill the moment it reads low or empty; the derived
 * "remaining" estimate can only ever add colour on top of an "ok" reading (`hopperView` in
 * `lib/hopper-status.ts` owns this, unchanged). Below the art, a row of compact chips (a dot,
 * the hopper's name, its state word) replaces the old tank-glyph tiles -- still tappable, still
 * opening the hopper detail sheet via `hopper-detail-requested`.
 *
 * The pour: kibble falls from the chute's outlet onto the bowl's *current* level for exactly as
 * long as `feeding` is true, plus one fall-time so pieces already in the air land -- driven only
 * by that prop, never a local timer, so a scheduled feed, a feed started from the feeder's own
 * physical button, and a feed started from another dashboard all animate identically. The pieces'
 * colour reflects `pourSource`: the hopper(s) this card's own hold button chose when it started
 * the feed, or -- when this card did not start it -- hopper 1 alone in single mode or both
 * hoppers mixed in dual mode, since nothing said which side actually fired. Under
 * `prefers-reduced-motion`, no pieces fall; the chute's outlet still glows while feeding, which
 * is a colour state, not motion.
 *
 * Pieces spawn only at the chute's own outlet with a tiny x jitter and near-zero initial speed,
 * fall straight down under gravity (accelerating, never a stock ease-out), and are clipped to
 * disappear into the bowl's *current* food surface, behind the front rim, with a brief settle --
 * a small, fixed set of pieces regardless of `portions`, so the stream always reads as thin and
 * calm, never a spray.
 */

import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import type { PropertyValues } from "lit";
import {
  hopperViews,
  hopperAriaLabel,
  hopperDisplayName,
  foodForHopper,
  type HopperLevel,
  type HopperRemaining,
  type HopperView,
  type HopperTone,
} from "../lib/hopper-status";
import { calibratedPercent } from "../lib/calibration";
import type { CalibrationHopper } from "../types";
import { effectivePourSource, type HopperSide, type PourSource } from "../lib/pour";
import { KIBBLE_FALL_DURATION_MS, prefersReducedMotion } from "../styles/tokens";

const ART_VIEW_W = 300;
const ART_VIEW_H = 250;

/** Hopper geometry -- one wide compartment in single mode, two half-width compartments in dual
 * mode, sharing the same outer bounds either way so the chute below always lines up centred. */
const HOPPER_X = 70;
const HOPPER_W = 160;
const HOPPER_Y = 16;
const HOPPER_H = 116;
const HOPPER_R = 24;

const CHUTE_TOP = 132;
const CHUTE_BOTTOM = 160;

/** Bowl geometry: a wide shallow dish in side elevation, thin-walled, its interior clipped to
 * the same silhouette inset by `BOWL_WALL` so the level rises inside a real hollow rather than a
 * box drawn over the shape. */
const BOWL_CX = 150;
const BOWL_RIM_Y = 182;
const BOWL_RX = 72;
const BOWL_RY = 7;
const BOWL_FOOT_Y = 238;
const BOWL_WALL = 5;

/** A dispense runs several seconds, but a feed whose `feeding` flag never clears must not pour
 * for the rest of the session -- the same safety floor the old bowl used. */
const MAX_DROP_MS = 60_000;

interface FoodTone {
  top: string;
  mid: string;
  deep: string;
  hi: string;
}

/** Hopper 1's food: a warm amber, told apart from hopper 2 by a fine dot texture. Hopper 2's
 * food: a pale sand, told apart by a scatter of short flecks. Colour and texture are both keyed
 * to the hopper's own index, never to whatever name the operator gave its food. */
const FOOD_1: FoodTone = { top: "#f0b774", mid: "#c9853f", deep: "#8e5424", hi: "#ffe1b8" };
const FOOD_2: FoodTone = { top: "#f6e7cc", mid: "#dcc19a", deep: "#b3916a", hi: "#fffaf0" };

interface Finish {
  name: string;
  body: readonly [string, string];
  stroke: string;
  sheen: number;
  chute: readonly [string, string];
  bowl: readonly [string, string];
  rim: string;
  light: boolean;
}

/** The prototype's two finishes, chosen by `darkMode`; a third ("Glow line") existed in the
 * prototype's own comparison but is not part of the shipped card. */
const FINISH: Record<"frosted" | "ceramic", Finish> = {
  frosted: {
    name: "Frosted glass",
    body: ["#1f2835", "#141a23"],
    stroke: "#ffffff26",
    sheen: 0.1,
    chute: ["#8b98a6", "#4d5864"],
    bowl: ["#262f3b", "#11161d"],
    rim: "#c3ccd6",
    light: false,
  },
  ceramic: {
    name: "Soft ceramic",
    body: ["#ffffff", "#e7edf3"],
    stroke: "#1a253122",
    sheen: 0.45,
    chute: ["#c9d2db", "#9aa7b4"],
    bowl: ["#ffffff", "#dfe6ee"],
    rim: "#ffffff",
    light: true,
  },
};

const TONE_COLOR: Record<HopperTone, string> = {
  ok: "var(--kibble-feed, #43a96a)",
  low: "var(--kibble-amber-dark, #de8a3a)",
  empty: "var(--error-color, #db4437)",
  unknown: "var(--secondary-text-color, #8b98a6)",
};

/** One hopper compartment's drawing inputs: where it sits, how full it is, and which food
 * gradient/texture pair belongs to it. */
interface HopperCompartment {
  x: number;
  w: number;
  fraction: number;
  food: FoodTone;
  gradientId: string;
  textureId: "tex-dot" | "tex-fleck";
  toneColor: string;
}

/** The brand's kibble motif as three overlapping lobes — a rounded clover, not a circle. Used
 * only for the falling pieces; the hopper/bowl fills are clean gradients, never this shape. */
function cloverPiece(x: number, y: number, r: number, rotationDeg: number): SVGTemplateResult {
  const lobes = [0, 120, 240].map((angle) => {
    const rad = ((angle + rotationDeg) * Math.PI) / 180;
    return svg`<circle cx=${(x + Math.cos(rad) * r * 0.55).toFixed(1)} cy=${(y + Math.sin(rad) * r * 0.55).toFixed(1)} r=${(r * 0.62).toFixed(1)} />`;
  });
  return svg`<g>${lobes}</g>`;
}

/** The two quiet, tone-on-tone textures that tell the foods apart without drawing them: a fine
 * dot grid for hopper 1's food, a scatter of short flecks for hopper 2's -- both at low opacity
 * over the gradient fill, shared by the hopper and the bowl so the same food always reads the
 * same way in both places. */
function textureDefs(): SVGTemplateResult {
  return svg`
    <pattern id="tex-dot" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
      <circle cx="2" cy="2" r="1.2" fill="#000" opacity="0.13" />
      <circle cx="5.5" cy="5.5" r="1.2" fill="#fff" opacity="0.09" />
    </pattern>
    <pattern id="tex-fleck" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
      <path d="M1 2h4M7 6h3M2 7h2" stroke="#6b5234" stroke-width="1.3" stroke-linecap="round" opacity="0.28" />
      <path d="M6 1.5h2" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
    </pattern>
  `;
}

function foodGradient(id: string, food: FoodTone): SVGTemplateResult {
  return svg`
    <linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${food.top} />
      <stop offset="0.55" stop-color=${food.mid} />
      <stop offset="1" stop-color=${food.deep} />
    </linearGradient>
  `;
}

/** A clean, flat level: the gradient fill, the tone-on-tone texture, and one bright surface
 * line -- minimal on purpose, so the level reads at a glance instead of as a texture. */
function foodLevel(x: number, top: number, w: number, bottom: number, gradientId: string, textureId: string, hi: string): SVGTemplateResult {
  const h = bottom - top;
  return svg`
    <rect x=${x} y=${top} width=${w} height=${h} fill="url(#${gradientId})" />
    <rect x=${x} y=${top} width=${w} height=${h} fill="url(#${textureId})" />
    <rect x=${x} y=${top} width=${w} height="2" fill=${hi} opacity="0.85" />
  `;
}

function hopperArt(finish: Finish, compartments: readonly HopperCompartment[]): SVGTemplateResult {
  const single = compartments.length === 1;
  const foodLayer = compartments.map((c) =>
    c.fraction > 0.01 ? foodLevel(c.x, HOPPER_Y + 6 + (HOPPER_H - 12) * (1 - c.fraction), c.w, HOPPER_Y + HOPPER_H, c.gradientId, c.textureId, c.food.hi) : nothing,
  );
  return svg`
    <defs>
      <linearGradient id="hopper-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${finish.body[0]} />
        <stop offset="1" stop-color=${finish.body[1]} />
      </linearGradient>
      <linearGradient id="hopper-sheen" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.08" stop-color="#fff" stop-opacity=${finish.sheen} />
        <stop offset="0.22" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.85" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.95" stop-color="#fff" stop-opacity=${finish.sheen * 0.6} />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="hopper-inner-shadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=${finish.light ? 0.06 : 0.35} />
        <stop offset="0.12" stop-color="#000" stop-opacity="0" />
        <stop offset="0.88" stop-color="#000" stop-opacity="0" />
        <stop offset="1" stop-color="#000" stop-opacity=${finish.light ? 0.08 : 0.4} />
      </linearGradient>
      ${textureDefs()}
      ${foodGradient("hopper-food-1", FOOD_1)}
      ${foodGradient("hopper-food-2", FOOD_2)}
      <clipPath id="hopper-interior-clip">
        <rect x=${HOPPER_X + 3} y=${HOPPER_Y + 3} width=${HOPPER_W - 6} height=${HOPPER_H - 6} rx=${HOPPER_R - 3} />
      </clipPath>
      <filter id="hopper-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x=${HOPPER_X} y=${HOPPER_Y + 6} width=${HOPPER_W} height=${HOPPER_H} rx=${HOPPER_R} fill="#000" opacity=${finish.light ? 0.08 : 0.35} filter="url(#hopper-shadow-blur)" />
    <rect x=${HOPPER_X} y=${HOPPER_Y} width=${HOPPER_W} height=${HOPPER_H} rx=${HOPPER_R} fill="url(#hopper-body)" />
    <g clip-path="url(#hopper-interior-clip)">
      ${foodLayer}
      <rect x=${HOPPER_X} y=${HOPPER_Y} width=${HOPPER_W} height=${HOPPER_H} fill="url(#hopper-inner-shadow)" />
    </g>
    ${single
      ? nothing
      : svg`<line x1=${HOPPER_X + HOPPER_W / 2} x2=${HOPPER_X + HOPPER_W / 2} y1=${HOPPER_Y + 8} y2=${HOPPER_Y + HOPPER_H - 8} stroke=${finish.light ? "#1a253140" : "#ffffff40"} stroke-width="2" stroke-linecap="round" />`}
    <rect x=${HOPPER_X} y=${HOPPER_Y} width=${HOPPER_W} height=${HOPPER_H} rx=${HOPPER_R} fill="url(#hopper-sheen)" />
    <rect x=${HOPPER_X + 0.75} y=${HOPPER_Y + 0.75} width=${HOPPER_W - 1.5} height=${HOPPER_H - 1.5} rx=${HOPPER_R} fill="none" stroke=${finish.stroke} stroke-width="1.5" />
    <path d="M${HOPPER_X + HOPPER_R} ${HOPPER_Y + 1.5} H${HOPPER_X + HOPPER_W - HOPPER_R}" stroke="#fff" stroke-opacity=${finish.light ? 0.9 : 0.18} stroke-width="1.2" stroke-linecap="round" />
  `;
}

function chuteArt(finish: Finish, active: boolean): SVGTemplateResult {
  const top = CHUTE_TOP;
  const bottom = CHUTE_BOTTOM;
  return svg`
    <defs>
      <linearGradient id="chute-body" x1="0" x2="1">
        <stop offset="0" stop-color=${finish.chute[1]} />
        <stop offset="0.45" stop-color=${finish.chute[0]} />
        <stop offset="1" stop-color=${finish.chute[1]} />
      </linearGradient>
    </defs>
    <path
      d="M104 ${top} L196 ${top} Q192 ${top + 4} 170 ${bottom - 6} L163 ${bottom} L137 ${bottom} L130 ${bottom - 6} Q108 ${top + 4} 104 ${top} Z"
      fill="url(#chute-body)"
      stroke=${finish.light ? "#1a253120" : "#00000040"}
    />
    <rect
      x="139"
      y=${bottom - 3}
      width="22"
      height="4"
      rx="2"
      fill=${active ? "#f7c948" : finish.light ? "#6b7886" : "#0a0d12"}
      style=${active ? "filter:drop-shadow(0 0 6px #f7c948)" : ""}
    />
  `;
}

/** The bowl's interior floor -> rim distance mapped to a fill fraction, in the art's own view
 * coordinates -- shared by the bowl's own level and the pour's landing point so a piece always
 * lands exactly where the level actually is, never a guessed offset. */
function bowlLevelY(fraction: number): number {
  const innerFoot = BOWL_FOOT_Y - BOWL_WALL;
  const depth = innerFoot - BOWL_RIM_Y;
  return innerFoot - depth * Math.max(0, Math.min(1, fraction));
}

/** The bowl's interior hollow, inset from the outer silhouette by the wall thickness -- the
 * exact shape the food fill (below) and the pour's landing clip (`pourPieces`) both clip to, so
 * kibble always disappears into precisely the boundary the food itself renders inside of. */
function bowlInteriorPath(): string {
  const cx = BOWL_CX;
  const rimY = BOWL_RIM_Y;
  const innerX = BOWL_RX - BOWL_WALL;
  const innerFoot = BOWL_FOOT_Y - BOWL_WALL;
  return `M${cx - innerX} ${rimY} C${cx - innerX + 2} ${rimY + 37} ${cx - 38} ${innerFoot} ${cx} ${innerFoot} C${cx + 38} ${innerFoot} ${cx + innerX - 2} ${rimY + 37} ${cx + innerX} ${rimY} Z`;
}

/** The see-through side-view bowl: a thin-walled dish, its interior clipped to the same
 * silhouette inset by the wall thickness, with the level rising inside that hollow. `mix` blends
 * hopper 2's food in from the right edge over a soft-feathered mask -- a clean two-tone split,
 * never per-piece scattering. */
function bowlArt(finish: Finish, fraction: number | null, mix: number): SVGTemplateResult {
  const cx = BOWL_CX;
  const rimY = BOWL_RIM_Y;
  const rx = BOWL_RX;
  const ry = BOWL_RY;
  const foot = BOWL_FOOT_Y;
  const outer = `M${cx - rx} ${rimY} C${cx - rx + 2} ${rimY + 40} ${cx - 42} ${foot} ${cx} ${foot} C${cx + 42} ${foot} ${cx + rx - 2} ${rimY + 40} ${cx + rx} ${rimY} Z`;
  const innerFoot = foot - BOWL_WALL;
  const inner = bowlInteriorPath();
  const f = fraction == null ? 0 : Math.max(0, Math.min(1, fraction));
  const clampedMix = Math.max(0, Math.min(1, mix));
  const level = bowlLevelY(f);
  const w = rx * 2;
  const showFood = f > 0.02;
  const showMix = showFood && clampedMix > 0.01;
  const mixFrom = Math.max(0, 1 - clampedMix - 0.06).toFixed(3);
  const mixTo = Math.min(1, 1 - clampedMix + 0.06).toFixed(3);
  return svg`
    <defs>
      ${foodGradient("bowl-food-1", FOOD_1)}
      ${foodGradient("bowl-food-2", FOOD_2)}
      <clipPath id="bowl-interior-clip"><path d=${inner} /></clipPath>
      <linearGradient id="bowl-wall" x1="0" x2="1">
        <stop offset="0" stop-color=${finish.bowl[0]} stop-opacity="0.55" />
        <stop offset="0.2" stop-color="#fff" stop-opacity=${finish.light ? 0.5 : 0.1} />
        <stop offset="0.45" stop-color=${finish.bowl[1]} stop-opacity="0.25" />
        <stop offset="0.9" stop-color="#fff" stop-opacity=${finish.light ? 0.3 : 0.06} />
        <stop offset="1" stop-color=${finish.bowl[0]} stop-opacity="0.55" />
      </linearGradient>
      <linearGradient id="bowl-mix-gradient" x1="0" x2="1">
        <stop offset=${mixFrom} stop-color="#fff" stop-opacity="0" />
        <stop offset=${mixTo} stop-color="#fff" stop-opacity="1" />
      </linearGradient>
      <mask id="bowl-mix-mask" maskContentUnits="userSpaceOnUse">
        <rect x=${cx - rx} y=${rimY - 10} width=${w} height=${foot - rimY + 20} fill="url(#bowl-mix-gradient)" />
      </mask>
    </defs>
    <ellipse cx=${cx} cy=${foot + 5} rx=${rx * 0.7} ry="5" fill="#000" opacity=${finish.light ? 0.1 : 0.4} />
    <path d=${inner} fill=${finish.light ? "#e9eef3" : "#0b0f15"} />
    <g clip-path="url(#bowl-interior-clip)">
      ${showFood
        ? svg`
            <rect x=${cx - rx} y=${level} width=${w} height=${innerFoot - level + 2} fill="url(#bowl-food-1)" />
            <rect x=${cx - rx} y=${level} width=${w} height=${innerFoot - level + 2} fill="url(#tex-dot)" />
            ${showMix
              ? svg`<g mask="url(#bowl-mix-mask)">
                  <rect x=${cx - rx} y=${level} width=${w} height=${innerFoot - level + 2} fill="url(#bowl-food-2)" />
                  <rect x=${cx - rx} y=${level} width=${w} height=${innerFoot - level + 2} fill="url(#tex-fleck)" />
                </g>`
              : nothing}
            <rect x=${cx - rx} y=${level} width=${w} height="2" fill="#fff" opacity="0.55" />
          `
        : nothing}
    </g>
    <path d=${outer} fill="url(#bowl-wall)" stroke=${finish.light ? "#1a253126" : "#ffffff30"} stroke-width="1.5" />
    <ellipse cx=${cx} cy=${rimY} rx=${rx} ry=${ry} fill="none" stroke=${finish.light ? "#ffffff" : finish.rim} stroke-width="2.5" />
  `;
}

/** The kibble poured from the chute's outlet onto the bowl's current level. Colour is keyed to
 * `source` (see `effectivePourSource`), never a fixed tone -- a single-hopper pour reads in that
 * hopper's own food colour, a mixed one cycles both. */
function pourColorsFor(source: HopperSide): readonly string[] {
  if (source === "1") return [FOOD_1.mid, FOOD_1.top, FOOD_1.deep];
  if (source === "2") return [FOOD_2.mid, FOOD_2.top, FOOD_2.deep];
  return [FOOD_1.mid, FOOD_1.top, FOOD_2.mid, FOOD_2.top];
}

/** How long one piece's fall + settle takes -- comfortably under `KIBBLE_FALL_DURATION_MS` (how
 * long the caller keeps rendering pieces after `feeding` clears), so whichever piece is mid-fall
 * at that instant still has a full cycle's worth of time to land before the stream is torn down. */
const POUR_CYCLE_MS = 600;

/** Deterministic per-lane spawn offsets: a tiny horizontal jitter (well inside the chute's own
 * narrow outlet) and a small fixed tumble so a piece reads as a solid grain, not confetti --
 * fixed values, not random, so the pour never shimmers between renders. `phase` staggers each
 * lane's cycle so the stream reads as a continuous, thin trickle rather than pieces falling in
 * lockstep. */
const POUR_LANES: readonly { dx: number; rotationDeg: number; phase: number }[] = [
  { dx: -1.3, rotationDeg: -10, phase: 0 },
  { dx: 1.1, rotationDeg: 14, phase: 1 / 3 },
  { dx: -0.2, rotationDeg: 4, phase: 2 / 3 },
];

/** The falling stream: a small, fixed set of pieces (never scaled up by `portions` -- a bigger
 * feed runs the real dispense longer, not a wider spray) spawn only at the chute's own outlet
 * with a tiny x jitter and near-zero initial speed, then fall straight down under gravity onto
 * the bowl's *current* level, landing exactly where the level actually is via `distance` (same
 * source as the level itself, `bowlLevelY`). The CSS keyframes below sample position at `t^2`
 * steps -- true quadratic ease-in, not a stock easing curve -- so the fall visibly accelerates
 * the way a dropped object does, then settles with a brief squash before disappearing into the
 * pile. Clipped to the open-air corridor above the rim plus the bowl's own interior hollow
 * (`bowlInteriorPath`, the exact boundary the food fill itself clips to), so a piece heading for
 * a low level reads as landing inside the dish rather than floating in front of it. */
function pourPieces(colors: readonly string[], portions: number, outletX: number, outletY: number, targetY: number): SVGTemplateResult {
  const lanes = portions >= 3 ? POUR_LANES : POUR_LANES.slice(0, 2);
  const distance = (targetY - outletY).toFixed(1);
  const pieces = lanes.map((lane, i) => {
    const delayMs = Math.round(lane.phase * POUR_CYCLE_MS);
    const style = `--fall-delay:${delayMs}ms;--fall-duration:${POUR_CYCLE_MS}ms;--fall-to:${distance}px;`;
    return svg`<g class="pour-piece" style=${style} fill=${colors[i % colors.length]}>${cloverPiece(outletX + lane.dx, outletY, 3.6, lane.rotationDeg)}</g>`;
  });
  return svg`
    <defs>
      <clipPath id="pour-clip">
        <rect x=${outletX - 6} y=${CHUTE_BOTTOM - 4} width="12" height=${BOWL_RIM_Y - CHUTE_BOTTOM + 4} />
        <path d=${bowlInteriorPath()} />
      </clipPath>
    </defs>
    <g class="pour-pieces" clip-path="url(#pour-clip)">${pieces}</g>
  `;
}

function bowlTitle(fraction: number | null, calibratedPercentValue: number | null, isEstimate: boolean): string {
  if (fraction == null) return "Bowl level unknown";
  const percent = calibratedPercentValue != null ? calibratedPercentValue : fraction * 100;
  return isEstimate ? `Bowl about ${Math.round(percent)}% full` : `Bowl ${Math.round(percent)}% full`;
}

function hopperGroupTitle(hoppers: readonly HopperView[], food1: string | null, food2: string | null): string {
  if (hoppers.length === 1) return `${hopperDisplayName(hoppers[0]!, null)}: ${hoppers[0]!.headline}`;
  return hoppers.map((view) => `${hopperDisplayName(view, foodForHopper(view.index, food1, food2))}: ${view.headline}`).join(", ");
}

/** One compact chip: a tone dot, the hopper's display name, and its headline word -- replaces
 * the old tank-glyph tile. Always tappable, even a plain "Stocked" reading with nothing extra to
 * reveal, because the sheet it opens is also where "mark hopper full" lives. */
function renderChip(view: HopperView, food: string | null, onActivate: () => void) {
  const name = hopperDisplayName(view, food);
  const label = hopperAriaLabel(view, food);
  return html`
    <button type="button" class="chip" data-tone=${view.tone} style=${`--chip-c:${TONE_COLOR[view.tone]}`} aria-label=${label} title=${view.detail ?? ""} @click=${onActivate}>
      <span class="chip-dot"></span>
      <span class="chip-name">${name}</span>
      <span class="chip-word">${view.headline}</span>
    </button>
  `;
}

export class KibbleBowl extends LitElement {
  static properties = {
    fill: { type: Number },
    hopperLevel1: { type: String },
    hopperLevel2: { type: String },
    hopperRemaining1: { attribute: false },
    hopperRemaining2: { attribute: false },
    singleHopper: { type: Boolean },
    food1: { type: String },
    food2: { type: String },
    feeding: { type: Boolean },
    portions: { type: Number },
    calibration: { attribute: false },
    darkMode: { type: Boolean },
    bowlMix: { type: Number },
    pourSource: { attribute: false },
    fillSource: { type: String },
  };

  /** Bowl fullness 0-100, `null` when the feeder has no reading. */
  declare fill: number | null;
  declare hopperLevel1: HopperLevel | null;
  declare hopperLevel2: HopperLevel | null;
  declare feeding: boolean;
  /** How many servings the pending feed will dispense. The pour itself stays a small, fixed
   * stream regardless -- a bigger feed runs longer, not wider -- but three or more servings
   * adds one more lane so the trickle reads very slightly busier without ever becoming a spray. */
  declare portions: number;
  /** The hopper `lib/calibration.ts:displayCalibrationHopper` picked to interpret `fill`
   * against, or `null` when nothing usable is calibrated yet. */
  declare calibration: CalibrationHopper | null;
  declare hopperRemaining1: HopperRemaining | null;
  declare hopperRemaining2: HopperRemaining | null;
  /** The hopper divider is out: show one combined tank instead of two compartments. */
  declare singleHopper: boolean;
  /** The operator's own name for each hopper's food (dual mode only) -- `null` when unnamed. */
  declare food1: string | null;
  declare food2: string | null;
  /** `hass.states[<bowlFill entity>].attributes.source` -- `"estimate"` while a post-feed
   * projection is showing (a real camera reading has not confirmed it yet), `"measured"`
   * otherwise. Only changes the bowl's hover title wording ("about N%" vs "N%"). */
  declare fillSource: string | null;
  /** `true` when Home Assistant is in dark mode -- picks the "Frosted glass" finish; `false`
   * picks "Soft ceramic". */
  declare darkMode: boolean;
  /** The 0..1 share of hopper 2's food currently in the bowl, from `lib/bowl-mix.ts` --
   * `0` in single mode or when nothing recorded a split recently. */
  declare bowlMix: number;
  /** Which hopper(s) this card's own hold button chose for the feed in progress, or `null` when
   * this card did not start it (a scheduled feed, the feeder's own physical button, or another
   * dashboard) -- see `lib/pour.ts`. */
  declare pourSource: PourSource;

  private _wasFeeding = false;
  private _dropping = false;
  private _dropTimer: number | undefined;

  constructor() {
    super();
    this.fill = null;
    this.hopperLevel1 = null;
    this.hopperLevel2 = null;
    this.hopperRemaining1 = null;
    this.hopperRemaining2 = null;
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
    this.feeding = false;
    this.portions = 1;
    this.calibration = null;
    this.darkMode = false;
    this.bowlMix = 0;
    this.pourSource = null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._dropTimer);
  }

  private _openHopperDetail(): void {
    this.dispatchEvent(new CustomEvent("hopper-detail-requested", { bubbles: true, composed: true }));
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("feeding")) {
      // Runs for as long as the feeder is actually dispensing, never a fixed burst: starts the
      // instant `feeding` does (a scheduled feed, the physical button, and another dashboard's
      // feed all flip this same entity) and stops one fall-time after it clears, so pieces
      // already in the air land. A safety stop guards the case where `feeding` never clears.
      if (this.feeding && !this._wasFeeding) {
        clearTimeout(this._dropTimer);
        this._dropping = true;
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

  private _compartments(hoppers: readonly HopperView[]): HopperCompartment[] {
    if (hoppers.length === 1) {
      const view = hoppers[0]!;
      return [{ x: HOPPER_X, w: HOPPER_W, fraction: view.fillFraction ?? 0, food: FOOD_1, gradientId: "hopper-food-1", textureId: "tex-dot", toneColor: TONE_COLOR[view.tone] }];
    }
    const [view1, view2] = hoppers;
    return [
      { x: HOPPER_X, w: HOPPER_W / 2, fraction: view1!.fillFraction ?? 0, food: FOOD_1, gradientId: "hopper-food-1", textureId: "tex-dot", toneColor: TONE_COLOR[view1!.tone] },
      { x: HOPPER_X + HOPPER_W / 2, w: HOPPER_W / 2, fraction: view2!.fillFraction ?? 0, food: FOOD_2, gradientId: "hopper-food-2", textureId: "tex-fleck", toneColor: TONE_COLOR[view2!.tone] },
    ];
  }

  render() {
    const finish = this.darkMode ? FINISH.frosted : FINISH.ceramic;
    const hoppers = hopperViews(this.singleHopper, this.hopperLevel1, this.hopperLevel2, this.hopperRemaining1, this.hopperRemaining2);
    const compartments = this._compartments(hoppers);
    // `calibratedPercent` expects the curve's own 0.0-1.0 scale, not `fill`'s live 0-100 one --
    // see that function's doc comment for why those two units differ.
    const calibratedFillPercent = this.fill == null ? null : calibratedPercent(this.calibration, this.fill / 100);
    const fraction = this.fill == null ? null : this.fill / 100;
    const source = effectivePourSource(this.pourSource, this.singleHopper);
    const pourColors = pourColorsFor(source);
    const outletY = CHUTE_BOTTOM - 2;
    const level = bowlLevelY(fraction ?? 0);
    const isEstimate = this.fillSource === "estimate";
    const artLabel = `${hopperGroupTitle(hoppers, this.food1, this.food2)}. ${bowlTitle(fraction, calibratedFillPercent, isEstimate)}`;

    return html`
      <svg class="art" viewBox="0 0 ${ART_VIEW_W} ${ART_VIEW_H}" role="img" aria-label=${artLabel} preserveAspectRatio="xMidYMid meet">
        <g class="hopper-scene">
          <title>${hopperGroupTitle(hoppers, this.food1, this.food2)}</title>
          ${hopperArt(finish, compartments)}
        </g>
        ${chuteArt(finish, this.feeding)}
        <g class="bowl-scene">
          <title>${bowlTitle(fraction, calibratedFillPercent, isEstimate)}</title>
          ${bowlArt(finish, fraction, this.bowlMix)}
        </g>
        ${this._dropping && !prefersReducedMotion() ? pourPieces(pourColors, this.portions, BOWL_CX, outletY, level) : nothing}
      </svg>
      ${calibratedFillPercent != null
        ? html`<div class="calibrated" role="status">${Math.round(calibratedFillPercent)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill!)}</span></div>`
        : nothing}
      <div class="chips">${hoppers.map((view) => renderChip(view, foodForHopper(view.index, this.food1, this.food2), () => this._openHopperDetail()))}</div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--kibble-rhythm, 10px);
      width: 100%;
    }
    /* width:100% + aspect-ratio gives .art its natural preferred size, same as always -- the
     * new part is min-height: 0, overriding the flex automatic-minimum-size default (which
     * clamps shrinking to an item's own preferred size for anything with an intrinsic aspect
     * ratio and overflow:visible). Without it, a squeezed host (kibble-card.ts's >=960px
     * side-by-side tier, where this column's own height is capped to match the video) could
     * not actually shrink .art at all -- it just kept its natural ~256px height and visually
     * overflowed straight through .calibrated/.chips below it and into whatever sits past this
     * component entirely. flex-shrink is 1 by default; .calibrated/.chips are flex: none
     * (below) and never give up their own space, so a genuine squeeze always comes out of .art
     * first -- preserveAspectRatio="xMidYMid meet" on the svg itself (render(), above) is what
     * then scales the actual artwork down to whatever smaller box results, instead of cropping
     * or distorting it. */
    .art {
      display: block;
      width: 100%;
      aspect-ratio: ${ART_VIEW_W} / ${ART_VIEW_H};
      min-height: 0;
      overflow: visible;
    }
    /* The calibrated readout: a real, meaningful number now that a curve exists, so unlike the
     * raw score it earns primary-text weight -- the raw figure stays too, just secondary, since
     * every existing threshold elsewhere is still keyed to it, never this one. */
    .calibrated {
      flex: none;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: var(--primary-text-color);
    }
    .calibrated .raw {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .chips {
      flex: none;
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      width: 100%;
    }
    .chip {
      flex: 1 1 0;
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      font: inherit;
      color: inherit;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    .chip:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .chip:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 1px;
    }
    .chip-dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--chip-c);
      box-shadow: 0 0 6px var(--chip-c);
    }
    .chip-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .chip-word {
      flex: none;
      font-size: 12px;
      font-weight: 700;
    }
    .chip[data-tone="low"] .chip-word {
      color: var(--kibble-amber-dark);
    }
    .chip[data-tone="empty"] .chip-word {
      color: var(--error-color, #db4437);
    }
    .pour-piece {
      transform-box: fill-box;
      animation: kibble-pour-fall var(--fall-duration) linear var(--fall-delay) infinite both;
    }
    /* Position samples position at t^2 (0, 0.04, 0.178, 0.415, 0.713, 1) -- true quadratic
     * ease-in between those stops, so the fall visibly accelerates like a dropped object
     * instead of following a stock easing curve. The last stretch (90-100%) holds at the
     * landed position for a brief squash-and-release settle, then fades into the pile. */
    @keyframes kibble-pour-fall {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0;
      }
      6% {
        opacity: 1;
      }
      18% {
        transform: translateY(calc(var(--fall-to) * 0.04));
      }
      38% {
        transform: translateY(calc(var(--fall-to) * 0.178));
      }
      58% {
        transform: translateY(calc(var(--fall-to) * 0.415));
      }
      76% {
        transform: translateY(calc(var(--fall-to) * 0.713));
      }
      90% {
        transform: translateY(var(--fall-to));
      }
      96% {
        transform: translateY(var(--fall-to)) scale(1.15, 0.82);
        opacity: 1;
      }
      100% {
        transform: translateY(var(--fall-to)) scale(1);
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
