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

/** The one-line summary shown on the card face, e.g. "3 scheduled · next 18:00". */
export function scheduleSummary(entries: ScheduleEntry[], now: Date): string {
  if (entries.length === 0) {
    return "No schedule set";
  }
  const countLabel = entries.length === 1 ? "1 scheduled" : `${entries.length} scheduled`;
  const next = nextScheduled(entries, now);
  if (!next) {
    return `${countLabel} \u00b7 all paused`;
  }
  return `${countLabel} \u00b7 next ${next.entry.time}`;
}
