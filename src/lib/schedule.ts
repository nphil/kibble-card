/** Pure schedule math: the sensor's `entries` attribute in, "what's next" out. Kept independent
 * of the entity/attribute plumbing so the midnight-wraparound logic can be unit tested directly
 * against plain objects.
 */

import type { HassEntityState } from "../types";

export interface ScheduleEntry {
  id: string;
  time: string; // "HH:MM", 24h
  amount_l: number;
  amount_r: number;
  enabled: boolean;
}

/** The schedule sensor's `entries` attribute as a list -- empty while the sensor is missing,
 * unavailable, or carries no list. Shared by the hero and the standalone schedule card. */
export function scheduleEntriesFrom(state: HassEntityState | undefined): ScheduleEntry[] {
  const entries = state?.attributes?.entries;
  return Array.isArray(entries) ? (entries as ScheduleEntry[]) : [];
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

/** The most portions one hopper can be given in a single scheduled feed -- the integration
 * accepts 0..50, but the feeder's own stepper (`kibble-settings-dialog`, the schedule card's
 * `max_amount`) stops at 20, and one scheduled feed has no business exceeding it. */
export const MAX_SCHEDULE_PORTIONS = 20;

function portionsWord(count: number): string {
  return count === 1 ? "1 portion" : `${count} portions`;
}

/** The hopper's own name for the editor and its labels: the operator's food name once set,
 * else "Hopper N". */
export function hopperLabel(index: 1 | 2, food: string | null | undefined): string {
  const name = food?.trim();
  return name ? name : `Hopper ${index}`;
}

/** One schedule entry's amount, as the expanded schedule shows it. The values are PORTIONS (the
 * services call them `hopper1_g`/`hopper2_g` for historical reasons, but nothing is weighed).
 * In dual mode each hopper keeps its own number, headed by its food name ("Kibble 3",
 * "Freeze-dried 2 + Kibble 1"); a side at zero gives nothing, so it is left out rather than
 * printed as "Freeze-dried 0". With the divider out there is one bin, so showing two numbers
 * would imply a second dispenser that no longer exists; one combined figure -- the larger side,
 * matching the single packed amount the embedded card's own sensor derives from the same two
 * fields -- is what actually lands in the bowl. */
export function entryAmountsLabel(
  entry: Pick<ScheduleEntry, "amount_l" | "amount_r">,
  single: boolean,
  food1?: string | null,
  food2?: string | null,
): string {
  if (single) return portionsWord(Math.max(entry.amount_l, entry.amount_r));
  const parts: string[] = [];
  if (entry.amount_l > 0) parts.push(`${hopperLabel(1, food1)} ${entry.amount_l}`);
  if (entry.amount_r > 0) parts.push(`${hopperLabel(2, food2)} ${entry.amount_r}`);
  return parts.length > 0 ? parts.join(" + ") : "No food";
}

/** Entries in clock order. Compares minutes, not strings: "9:00" must sort before "10:00". */
export function sortScheduleEntries(entries: readonly ScheduleEntry[]): ScheduleEntry[] {
  return [...entries].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
}

/** What the editor's form holds: a clock time ("" while the picker is cleared) plus portions per
 * hopper. Hopper 1 is `amount_l`, hopper 2 `amount_r`, as on the schedule sensor. */
export interface ScheduleDraft {
  time: string;
  amount_l: number;
  amount_r: number;
}

/** Why a draft cannot be saved, in words for the person editing, or `null` when it can. */
export function draftProblem(draft: ScheduleDraft): string | null {
  if (!/^\d{1,2}:\d{2}$/.test(draft.time.trim())) return "Pick a time";
  try {
    parseTimeToMinutes(draft.time);
  } catch {
    return "Pick a time";
  }
  for (const amount of [draft.amount_l, draft.amount_r]) {
    if (!Number.isInteger(amount) || amount < 0 || amount > MAX_SCHEDULE_PORTIONS) {
      return `Portions go from 0 to ${MAX_SCHEDULE_PORTIONS}`;
    }
  }
  if (draft.amount_l === 0 && draft.amount_r === 0) return "Pick at least one portion";
  return null;
}

/** "HH:MM" (the sensor's and the time picker's shape) as the services' "HH:MM:SS". */
export function toServiceTime(time: string): string {
  const minutes = parseTimeToMinutes(time);
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}:00`;
}

/** One row of `kibble.schedule_set`'s table. `entry_id` is absent for a new row (the agent mints
 * it); the `_g` names are the service's, the values are portions. */
export interface ScheduleWriteEntry {
  entry_id?: string;
  time: string;
  hopper1_g: number;
  hopper2_g: number;
  enabled: boolean;
}

/** Data for `kibble.schedule_add`: a new feed, enabled. */
export function scheduleAddData(deviceId: string, draft: ScheduleDraft): Record<string, unknown> {
  return {
    device_id: deviceId,
    time: toServiceTime(draft.time),
    hopper1_g: draft.amount_l,
    hopper2_g: draft.amount_r,
    enabled: true,
  };
}

/** The whole table for `kibble.schedule_set` after editing one entry. `schedule_set` replaces
 * everything, so every other entry is passed through exactly as it is now (same id, time,
 * amounts, enabled) and the edited one keeps its id and its on/paused state -- only its time
 * and amounts change. Throws when `entryId` is no longer in the table (someone removed it
 * meanwhile): writing the table then would silently resurrect nothing and drop the edit. */
export function scheduleSetEntries(entries: readonly ScheduleEntry[], entryId: string, draft: ScheduleDraft): ScheduleWriteEntry[] {
  if (!entries.some((entry) => entry.id === entryId)) {
    throw new Error("That feed was removed meanwhile. Reopen the schedule and try again.");
  }
  return entries.map((entry) =>
    entry.id === entryId
      ? { entry_id: entry.id, time: toServiceTime(draft.time), hopper1_g: draft.amount_l, hopper2_g: draft.amount_r, enabled: entry.enabled }
      : { entry_id: entry.id, time: toServiceTime(entry.time), hopper1_g: entry.amount_l, hopper2_g: entry.amount_r, enabled: entry.enabled },
  );
}

/** A rejected service call as one readable sentence. Home Assistant rejects with a plain
 * `{ code, message }` object over the websocket, an `Error` elsewhere. */
export function serviceErrorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error.trim();
  if (typeof error === "object" && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message.trim();
  }
  return "Home Assistant did not accept the change";
}
