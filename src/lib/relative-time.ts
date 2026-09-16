/** Shared elapsed-time bucketing: minutes/hours/days since `from`, floored, with the sub-minute
 * case folded into "now". Two presentations read off the same buckets so the 1-minute/60-minute/
 * 24-hour rounding boundaries can't drift between the hero's tight status line ("2h ago") and
 * prose contexts elsewhere ("2 h ago") -- one rule, two spellings. `from`/`now` are both real
 * `Date`s so the rounding boundaries are exercised directly in tests, no fake timers required.
 */

export type RelativeUnit = "now" | "minutes" | "hours" | "days";

export interface RelativeElapsed {
  unit: RelativeUnit;
  value: number;
}

export function relativeElapsed(from: Date, now: Date): RelativeElapsed {
  const diffMinutes = Math.floor(Math.max(0, now.getTime() - from.getTime()) / 60000);
  if (diffMinutes < 1) return { unit: "now", value: 0 };
  if (diffMinutes < 60) return { unit: "minutes", value: diffMinutes };
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return { unit: "hours", value: diffHours };
  return { unit: "days", value: Math.floor(diffHours / 24) };
}

/** Compact form for tight layouts: "just now", "45m ago", "2h ago", "2d ago". */
export function relativeTimeCompact(from: Date, now: Date): string {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const suffix = elapsed.unit === "minutes" ? "m" : elapsed.unit === "hours" ? "h" : "d";
  return `${elapsed.value}${suffix} ago`;
}

/** Sentence form for prose contexts (cat "seen ..." lines, day-of copy): "just now",
 * "45 min ago", "2 h ago", "2 d ago". */
export function relativeTimeSentence(from: Date, now: Date): string {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const word = elapsed.unit === "minutes" ? "min" : elapsed.unit === "hours" ? "h" : "d";
  return `${elapsed.value} ${word} ago`;
}
