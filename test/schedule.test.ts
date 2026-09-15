import { describe, expect, test } from "bun:test";
import { nextScheduled, parseTimeToMinutes, scheduleSummary, type ScheduleEntry } from "../src/lib/schedule";

function entryAt(time: string, enabled = true, id = time): ScheduleEntry {
  return { id, time, amount_l: 5, amount_r: 5, enabled };
}

describe("parseTimeToMinutes", () => {
  test("parses valid HH:MM values", () => {
    expect(parseTimeToMinutes("00:00")).toBe(0);
    expect(parseTimeToMinutes("18:00")).toBe(18 * 60);
    expect(parseTimeToMinutes("23:59")).toBe(23 * 60 + 59);
  });

  test("rejects malformed or out-of-range values", () => {
    expect(() => parseTimeToMinutes("24:00")).toThrow();
    expect(() => parseTimeToMinutes("12:60")).toThrow();
    expect(() => parseTimeToMinutes("not-a-time")).toThrow();
  });
});

describe("nextScheduled", () => {
  test("picks the soonest entry later the same day", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("18:00"), entryAt("07:00"), entryAt("12:30")];

    const next = nextScheduled(entries, now);

    expect(next?.entry.time).toBe("12:30");
    expect(next?.minutesUntil).toBe(4 * 60 + 30);
  });

  test("wraps past midnight when every entry has already passed today", () => {
    const now = new Date(2026, 0, 1, 23, 50);
    const entries = [entryAt("07:30"), entryAt("18:00")];

    const next = nextScheduled(entries, now);

    expect(next?.entry.time).toBe("07:30");
    expect(next?.minutesUntil).toBe(7 * 60 + 40);
  });

  test("treats an entry at the current minute as next, not a full day away", () => {
    const now = new Date(2026, 0, 1, 18, 0);
    const entries = [entryAt("18:00"), entryAt("06:00")];

    const next = nextScheduled(entries, now);

    expect(next?.entry.time).toBe("18:00");
    expect(next?.minutesUntil).toBe(0);
  });

  test("ignores disabled entries and returns null when nothing is enabled", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("09:00", false), entryAt("10:00", false)];

    expect(nextScheduled(entries, now)).toBeNull();
  });
});

describe("scheduleSummary", () => {
  test("reports count and next time", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("18:00"), entryAt("07:00", false), entryAt("12:30")];

    expect(scheduleSummary(entries, now)).toBe("3 scheduled \u00b7 next 12:30");
  });

  test("reports all-paused when entries exist but none are enabled", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("09:00", false)];

    expect(scheduleSummary(entries, now)).toBe("1 scheduled \u00b7 all paused");
  });

  test("reports no schedule set when the list is empty", () => {
    expect(scheduleSummary([], new Date())).toBe("No schedule set");
  });
});
