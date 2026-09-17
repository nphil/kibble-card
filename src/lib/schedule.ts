/** Pure schedule math: the sensor's `entries` attribute in, "what's next" out. Kept independent
 * of the entity/attribute plumbing so the midnight-wraparound logic can be unit tested directly
 * against plain objects.
 */

export interface ScheduleEntry {
  id: string;
  time: string; // "HH:MM", 24h
  amount_l: number;
  amount_r: number;
  enabled: boolean;
}

export interface NextScheduled {
  entry: ScheduleEntry;
  minutesUntil: number;
}

/** Minutes since midnight for a validated "HH:MM" string. Exported: the entry-write path
 * (schedule dialog) needs the same parsing when sorting entries for display. */
export function parseTimeToMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) {
    throw new Error(`Invalid schedule time "${time}"`);
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid schedule time "${time}"`);
  }
  return hours * 60 + minutes;
}

/** The soonest enabled entry from `now`, wrapping past midnight. An entry at the current minute
 * counts as "next" (zero minutes away) rather than being pushed a full day out. Returns `null`
 * when there is nothing enabled to fire. */
export function nextScheduled(entries: ScheduleEntry[], now: Date): NextScheduled | null {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let best: NextScheduled | null = null;
  for (const entry of entries) {
    if (!entry.enabled) continue;
    const entryMinutes = parseTimeToMinutes(entry.time);
    const minutesUntil = ((entryMinutes - nowMinutes) % 1440 + 1440) % 1440;
    if (best === null || minutesUntil < best.minutesUntil) {
      best = { entry, minutesUntil };
    }
  }
  return best;
}

/** "HH:MM" rendered the way the user's browser writes clock times ("5:25 PM" in en-US, "17:25"
 * in en-GB) -- the same convention the timeline's timestamps already follow. */
export function formatClock(time: string, locale?: string): string {
  const minutes = parseTimeToMinutes(time);
  const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** The one-line summary shown on the card face: "Next feed 18:00, three a day", "All feeds
 * paused" when entries exist but none are enabled, or "No schedule set" when there are none at
 * all. The count is enabled entries only -- a paused entry doesn't actually feed anyone, so it
 * shouldn't count toward "how many times a day this happens". */
export function scheduleSummary(entries: ScheduleEntry[], now: Date, locale?: string): string {
  if (entries.length === 0) {
    return "No schedule set";
  }
  const next = nextScheduled(entries, now);
  if (!next) {
    return "All feeds paused";
  }
  const enabledCount = entries.filter((entry) => entry.enabled).length;
  const countWord = COUNT_WORDS[enabledCount] ?? String(enabledCount);
  return `Next feed ${formatClock(next.entry.time, locale)}, ${countWord} a day`;
}
