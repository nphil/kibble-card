/** Pure hopper-status wording. The feeder's two hoppers each carry an MCU food-shortage sensor
 * (a point sensor, not a gauge -- kibble docs/07 §10) reporting `empty` / `low` / `ok`, exposed
 * as the integration's two `hopper_N_level` enum sensors. One quiet line when everything is
 * fine; when a side needs attention, name that side and nothing else. */

export type HopperLevel = "empty" | "low" | "ok";

export type HopperTone = "ok" | "low" | "empty";

export interface HopperStatus {
  text: string;
  tone: HopperTone;
}

export function parseHopperLevel(state: string | undefined): HopperLevel | null {
  return state === "empty" || state === "low" || state === "ok" ? state : null;
}

const WORD: Record<Exclude<HopperLevel, "ok">, string> = { empty: "empty", low: "running low" };

/** `null` when neither side has reported yet (the MCU's sentinel after a boot) -- the caller
 * renders nothing rather than claiming a state. */
export function hopperStatus(side1: HopperLevel | null, side2: HopperLevel | null): HopperStatus | null {
  if (side1 === null && side2 === null) return null;
  const problems = [
    [1, side1],
    [2, side2],
  ].filter((entry): entry is [number, Exclude<HopperLevel, "ok">] => entry[1] !== null && entry[1] !== "ok");
  if (problems.length === 0) return { text: "Hopper stocked", tone: "ok" };
  const tone: HopperTone = problems.some(([, level]) => level === "empty") ? "empty" : "low";
  if (problems.length === 2 && problems[0][1] === problems[1][1]) {
    return { text: `Hopper ${WORD[problems[0][1]]}`, tone };
  }
  return { text: problems.map(([side, level]) => `Hopper ${side} ${WORD[level]}`).join(" · "), tone };
}
