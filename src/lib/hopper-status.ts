/** Per-hopper display logic for the hero card's two "reserve tank" glyphs, replacing the old
 * single "Hopper stocked" text line. Two data sources per hopper: the MCU's own three-way point
 * sensor (`hopper_N_level`: empty / low / ok -- kibble docs/07 §10, the only signal this device
 * has ever had) and, once the "mark hopper full" feature has learned a hopper's capacity, the
 * derived `hopper_N_remaining` sensor (portions left, computed server-side as
 * `max(0, full_to_low - portions_since_full)`). The point sensor is always the safety net: this
 * module only ever lets `remaining` add colour to an "ok" reading, never override a "low" or
 * "empty" one -- a stale or drifted portion count must never mask a hopper the MCU says is
 * actually running out.
 */

import type { HassEntityState } from "../types";
import { relativeElapsed, relativeTimeCompact } from "./relative-time";

export type HopperLevel = "empty" | "low" | "ok";
export type HopperTone = "ok" | "low" | "empty" | "unknown";

export function parseHopperLevel(state: string | undefined): HopperLevel | null {
  return state === "empty" || state === "low" || state === "ok" ? state : null;
}

/** One hopper's `hopper_N_remaining` sensor, already parsed off its `HassEntityState` --
 * `portions` is `null` exactly when the sensor itself reads `unknown`/`unavailable` (capacity
 * never learned yet, or an integration version old enough not to carry this entity at all). */
export interface HopperRemaining {
  portions: number | null;
  /** ISO 8601 `full_at`, `null` if this hopper has never been marked full. */
  fullAt: string | null;
  portionsSinceFull: number | null;
  /** Learned portions from full down to the low-sensor trip point, `null` until learned. */
  fullToLow: number | null;
}

export function parseHopperRemaining(state: HassEntityState | undefined): HopperRemaining | null {
  if (!state) return null;
  const raw = state.state;
  const portions = raw === "unknown" || raw === "unavailable" || raw === "" ? null : Number(raw);
  const attrs = state.attributes ?? {};
  return {
    portions: portions != null && Number.isFinite(portions) ? portions : null,
    fullAt: typeof attrs.full_at === "string" ? attrs.full_at : null,
    portionsSinceFull: typeof attrs.portions_since_full === "number" ? attrs.portions_since_full : null,
    fullToLow: typeof attrs.full_to_low === "number" ? attrs.full_to_low : null,
  };
}

/** Where the "low" threshold sits on the tank glyph, as a fraction of the drawable interior's
 * height measured from the bottom. Shared by the fill-fraction math below and the glyph's own
 * drawing code (`kibble-bowl.ts`) so the two can never drift apart. */
export const HOPPER_LOW_LINE = 0.34;

/** Fixed fill fractions for the two states with no quantitative estimate behind them: `empty`
 * draws nothing, `low` sits visibly under the low line, and a plain `ok` (no capacity learned
 * yet) sits clearly above it without ever touching the top -- the point sensor can only ever say
 * "above the low line", never "how far above", so the glyph must not claim more than that. */
const STEP_FILL: Record<HopperLevel, number> = {
  empty: 0,
  low: 0.2,
  ok: 0.64,
};

/** Full-word elapsed time ("just now" / "12 minutes ago" / "2 hours ago" / "2 days ago"), built
 * on the same minute/hour/day bucketing `relativeTimeCompact` uses elsewhere so the rounding
 * boundaries never drift between the two presentations. */
function agoSentence(from: Date, now: Date): string {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const word = elapsed.unit === "minutes" ? "minute" : elapsed.unit === "hours" ? "hour" : "day";
  return `${elapsed.value} ${word}${elapsed.value === 1 ? "" : "s"} ago`;
}

function parseFullAt(iso: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Portions a freshly filled hopper is assumed to hold above its low sensor until the daemon has
 * learned the real figure (the first full-to-low run). Only used to let a "just filled" tank read
 * full and then drain visibly as portions go out; the fill never drops below the plain `ok` step
 * on this guess alone, and the real low sensor still takes over the moment it trips. */
export const ASSUMED_FULL_TO_LOW = 30;

/** Tank fill for a hopper marked full whose capacity is not learned yet: completely full right
 * after the mark, then draining against `ASSUMED_FULL_TO_LOW` (scaled by how many compartments
 * the view represents), floored at the plain `ok` step so a guess never implies "nearly low". */
function unlearnedFullFraction(portionsSinceFull: number | null, compartments: number): number {
  const since = portionsSinceFull ?? 0;
  const drained = 1 - since / (ASSUMED_FULL_TO_LOW * compartments);
  return Math.max(STEP_FILL.ok, Math.min(1, drained));
}

/** Maps a portions-remaining ratio onto the glyph's above-the-low-line region. Unlike the fixed
 * `ok` step, this can legitimately reach the top of the tank: it is backed by a real dispensed-
 * portion count, not a guess, so a fresh "marked full" reading is allowed to look full. */
function estimateFraction(portions: number, fullToLow: number): number {
  const ratio = fullToLow > 0 ? Math.max(0, Math.min(1, portions / fullToLow)) : 0;
  return HOPPER_LOW_LINE + (1 - HOPPER_LOW_LINE) * ratio;
}

/** One hopper's fully resolved view: what the glyph draws, the short word under it, and the
 * longer sentence a tap/hover reveals. `fillFraction` is `null` only for `tone === "unknown"`,
 * where the glyph draws an empty outline and a dash instead of guessing a level. */
export interface HopperView {
  /** `null` for the single combined hopper shown when the divider is removed. */
  index: 1 | 2 | null;
  level: HopperLevel | null;
  tone: HopperTone;
  /** Always short enough for the glanceable tile: "Stocked" / "Low" / "Empty" / "About 12 left"
   * / "Filled 2d ago" / "Unknown". */
  headline: string;
  fillFraction: number | null;
  /** The longer sentence a tap or hover reveals, e.g. "About 12 portions left · filled 2 days
   * ago" or "Filled 2 days ago, 9 portions since". `null` when there is nothing to add beyond
   * the headline. */
  detail: string | null;
}

/** Resolves one hopper's full display state. `level` (the MCU point sensor) always wins the
 * headline/tone/fill the moment it reads "low" or "empty" -- `remaining` can only ever add
 * detail on top of an "ok" reading, never contradict a sensor that says food is actually running
 * out. The "filled ago" sentence is independent of tone: it is honest, compatible context
 * ("this hopper is low; it was filled 2 days ago") whenever the daemon has ever recorded a mark,
 * shown alongside whatever the level sensor says right now. */
export function hopperView(index: 1 | 2 | null, level: HopperLevel | null, remaining: HopperRemaining | null, now: Date = new Date()): HopperView {
  const compartments = index === null ? 2 : 1;
  const fullAt = parseFullAt(remaining?.fullAt ?? null);
  const portionsSinceFull = remaining?.portionsSinceFull ?? null;
  const sinceClause = portionsSinceFull != null && portionsSinceFull > 0 ? `, ${portionsSinceFull} portion${portionsSinceFull === 1 ? "" : "s"} since` : "";
  const filledSentence = fullAt ? `Filled ${agoSentence(fullAt, now)}${sinceClause}` : null;

  if (level === null) {
    return { index, level: null, tone: "unknown", headline: "Unknown", fillFraction: null, detail: null };
  }
  if (level === "low" || level === "empty") {
    return { index, level, tone: level, headline: level === "low" ? "Low" : "Empty", fillFraction: STEP_FILL[level], detail: filledSentence };
  }

  // level === "ok": the point sensor has nothing more to say, so show the richest honest thing
  // layered on top of it -- a learned estimate first, then "filled ago" alone, then plain.
  if (remaining?.portions != null && remaining.fullToLow != null && remaining.fullToLow > 0) {
    const { portions, fullToLow } = remaining;
    const rounded = Math.round(portions);
    const estimateSentence = `About ${rounded} portion${rounded === 1 ? "" : "s"} left`;
    return {
      index,
      level,
      tone: "ok",
      headline: `About ${rounded} left`,
      fillFraction: estimateFraction(portions, fullToLow),
      detail: fullAt ? `${estimateSentence} \u00b7 filled ${agoSentence(fullAt, now)}` : estimateSentence,
    };
  }
  if (fullAt) {
    return {
      index,
      level,
      tone: "ok",
      headline: `Filled ${relativeTimeCompact(fullAt, now)}`,
      fillFraction: unlearnedFullFraction(portionsSinceFull, compartments),
      detail: filledSentence,
    };
  }
  return { index, level, tone: "ok", headline: "Stocked", fillFraction: STEP_FILL.ok, detail: null };
}

/** The tile's accessible name -- always states the plain tone in words, so a screen reader never
 * has to parse a number like "About 12 left" to know whether that's good or bad news. */
export function hopperName(view: HopperView): string {
  return view.index === null ? "Hopper" : `Hopper ${view.index}`;
}

/** A hopper's own food name straight off its `text.*_hopper_N_food` entity's `HassEntityState`
 * -- `null` when the entity doesn't exist, hasn't reported (unavailable/unknown), or was left
 * blank. Every one of those means "unnamed," never an empty label. */
export function hopperFoodName(state: HassEntityState | undefined): string | null {
  if (!state || state.state === "unavailable" || state.state === "unknown") return null;
  const trimmed = state.state.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Picks the food name that belongs to one hopper view's index -- `null` for the single
 * combined tank (`index === null`), which has no per-side food to name. */
export function foodForHopper(index: 1 | 2 | null, food1: string | null, food2: string | null): string | null {
  if (index === 1) return food1;
  if (index === 2) return food2;
  return null;
}

/** The tile/row's *display* name: the hopper's own food name once dual mode has one set,
 * otherwise the plain `hopperName` fallback. The combined single-mode tank is never named --
 * one shared bin has nothing to distinguish. */
export function hopperDisplayName(view: HopperView, food: string | null): string {
  if (view.index === null) return hopperName(view);
  const trimmed = food?.trim();
  return trimmed ? trimmed : hopperName(view);
}

/** `food` is optional so every existing call site (aria labels that only ever cared about tone)
 * keeps working unchanged; a caller showing the food-aware display name passes it through so
 * the accessible name never drifts from what's actually on screen (WCAG "label in name"). */
export function hopperAriaLabel(view: HopperView, food: string | null = null): string {
  const name = hopperDisplayName(view, food);
  if (view.tone === "unknown") return `${name}: level unknown`;
  const base = `${name}: ${view.headline}`;
  return view.detail ? `${base}. ${view.detail}` : base;
}

const SEVERITY: Record<HopperLevel, number> = { empty: 0, low: 1, ok: 2 };

function sumKnown(a: number | null, b: number | null): number | null {
  return a == null || b == null ? null : a + b;
}

/** With the divider removed both point sensors look into the same bin, so the pessimistic reading
 * wins; remaining/capacity only add up when both sides are known, and the fill mark is the latest
 * one either side recorded (marking "full" in single mode marks both). */
export function combinedHopper(
  level1: HopperLevel | null,
  level2: HopperLevel | null,
  remaining1: HopperRemaining | null,
  remaining2: HopperRemaining | null,
): { level: HopperLevel | null; remaining: HopperRemaining | null } {
  const levels = [level1, level2].filter((l): l is HopperLevel => l !== null);
  const level = levels.length === 0 ? null : levels.reduce((a, b) => (SEVERITY[a] <= SEVERITY[b] ? a : b));
  if (!remaining1 && !remaining2) return { level, remaining: null };
  const fullAts = [remaining1?.fullAt, remaining2?.fullAt].filter((v): v is string => typeof v === "string");
  const since = [remaining1?.portionsSinceFull, remaining2?.portionsSinceFull].filter((v): v is number => typeof v === "number");
  return {
    level,
    remaining: {
      portions: sumKnown(remaining1?.portions ?? null, remaining2?.portions ?? null),
      fullAt: fullAts.length ? fullAts.reduce((a, b) => (Date.parse(a) >= Date.parse(b) ? a : b)) : null,
      portionsSinceFull: since.length ? since.reduce((a, b) => a + b, 0) : null,
      fullToLow: sumKnown(remaining1?.fullToLow ?? null, remaining2?.fullToLow ?? null),
    },
  };
}

/** The tanks the card shows: two when the divider is in, one combined "Hopper" when it is out. */
export function hopperViews(
  single: boolean,
  level1: HopperLevel | null,
  level2: HopperLevel | null,
  remaining1: HopperRemaining | null,
  remaining2: HopperRemaining | null,
  now: Date = new Date(),
): HopperView[] {
  if (!single) return [hopperView(1, level1, remaining1, now), hopperView(2, level2, remaining2, now)];
  const { level, remaining } = combinedHopper(level1, level2, remaining1, remaining2);
  return [hopperView(null, level, remaining, now)];
}
