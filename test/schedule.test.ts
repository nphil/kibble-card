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
  test("names the next time and spells the enabled count as a word", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("18:00"), entryAt("07:00", false), entryAt("12:30")];

    expect(scheduleSummary(entries, now)).toBe("Next feed 12:30, two a day");
  });

  test("counts only enabled entries, not paused ones", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("09:00"), entryAt("10:00", false), entryAt("11:00", false)];

    expect(scheduleSummary(entries, now)).toBe("Next feed 09:00, one a day");
  });

  test("falls back to a numeral once the count exceeds the spelled-out words", () => {
    const now = new Date(2026, 0, 1, 0, 0);
    const entries = Array.from({ length: 11 }, (_, i) => entryAt(`${String(i).padStart(2, "0")}:00`, true, `e${i}`));

    expect(scheduleSummary(entries, now)).toBe("Next feed 00:00, 11 a day");
  });

  test("reports all feeds paused when entries exist but none are enabled", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("09:00", false)];

    expect(scheduleSummary(entries, now)).toBe("All feeds paused");
  });

  test("reports no schedule set when the list is empty", () => {
    expect(scheduleSummary([], new Date())).toBe("No schedule set");
  });
});
