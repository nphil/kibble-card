import { describe, expect, test } from "bun:test";
import {
  draftProblem,
  entryAmountsLabel,
  formatClock,
  hopperLabel,
  nextScheduled,
  parseTimeToMinutes,
  scheduleAddData,
  scheduleSetEntries,
  scheduleSummary,
  serviceErrorMessage,
  sortScheduleEntries,
  toServiceTime,
  type ScheduleEntry,
} from "../src/lib/schedule";

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

    expect(scheduleSummary(entries, now, "en-US")).toBe("Next feed 12:30 PM, two a day");
  });

  test("counts only enabled entries, not paused ones", () => {
    const now = new Date(2026, 0, 1, 8, 0);
    const entries = [entryAt("09:00"), entryAt("10:00", false), entryAt("11:00", false)];

    expect(scheduleSummary(entries, now, "en-US")).toBe("Next feed 9:00 AM, one a day");
  });

  test("falls back to a numeral once the count exceeds the spelled-out words", () => {
    const now = new Date(2026, 0, 1, 0, 0);
    const entries = Array.from({ length: 11 }, (_, i) => entryAt(`${String(i).padStart(2, "0")}:00`, true, `e${i}`));

    expect(scheduleSummary(entries, now, "en-US")).toBe("Next feed 12:00 AM, 11 a day");
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

describe("formatClock", () => {
  test("writes the clock the way the locale does", () => {
    expect(formatClock("17:25", "en-US")).toBe("5:25 PM");
    expect(formatClock("00:05", "en-US")).toBe("12:05 AM");
    expect(formatClock("17:25", "en-GB")).toBe("17:25");
  });
});

describe("entryAmountsLabel", () => {
  test("dual mode names each hopper by its food", () => {
    expect(entryAmountsLabel({ amount_l: 2, amount_r: 1 }, false, "Freeze-dried", "Kibble")).toBe("Freeze-dried 2 + Kibble 1");
  });

  test("dual mode leaves out a side that gets nothing", () => {
    expect(entryAmountsLabel({ amount_l: 0, amount_r: 3 }, false, "Freeze-dried", "Kibble")).toBe("Kibble 3");
    expect(entryAmountsLabel({ amount_l: 4, amount_r: 0 }, false, "Freeze-dried", "Kibble")).toBe("Freeze-dried 4");
  });

  test("dual mode falls back to Hopper 1 / Hopper 2 while a food is unnamed", () => {
    expect(entryAmountsLabel({ amount_l: 1, amount_r: 2 }, false)).toBe("Hopper 1 1 + Hopper 2 2");
    expect(entryAmountsLabel({ amount_l: 1, amount_r: 2 }, false, "  ", "Kibble")).toBe("Hopper 1 1 + Kibble 2");
  });

  test("dual mode with both sides at zero says so rather than printing nothing", () => {
    expect(entryAmountsLabel({ amount_l: 0, amount_r: 0 }, false, "A", "B")).toBe("No food");
  });

  test("single mode collapses to the larger side -- the one bin's total -- in portions", () => {
    expect(entryAmountsLabel({ amount_l: 6, amount_r: 0 }, true)).toBe("6 portions");
    expect(entryAmountsLabel({ amount_l: 0, amount_r: 3 }, true)).toBe("3 portions");
    expect(entryAmountsLabel({ amount_l: 1, amount_r: 0 }, true)).toBe("1 portion");
  });

  test("single mode on an unconverted legacy split still reads as one honest number", () => {
    expect(entryAmountsLabel({ amount_l: 4, amount_r: 3 }, true)).toBe("4 portions");
  });
});

describe("hopperLabel", () => {
  test("uses the food name when set, else the hopper number", () => {
    expect(hopperLabel(1, "Kibble")).toBe("Kibble");
    expect(hopperLabel(2, "")).toBe("Hopper 2");
    expect(hopperLabel(2, null)).toBe("Hopper 2");
  });
});

describe("sortScheduleEntries", () => {
  test("orders by clock time, not text (9:00 before 10:00)", () => {
    const sorted = sortScheduleEntries([entryAt("10:00"), entryAt("9:00"), entryAt("00:00")]);
    expect(sorted.map((entry) => entry.time)).toEqual(["00:00", "9:00", "10:00"]);
  });

  test("leaves the input untouched", () => {
    const input = [entryAt("12:00"), entryAt("07:00")];
    sortScheduleEntries(input);
    expect(input.map((entry) => entry.time)).toEqual(["12:00", "07:00"]);
  });
});

describe("draftProblem", () => {
  test("accepts a time with at least one portion, either side", () => {
    expect(draftProblem({ time: "12:00", amount_l: 0, amount_r: 3 })).toBeNull();
    expect(draftProblem({ time: "00:00", amount_l: 20, amount_r: 20 })).toBeNull();
  });

  test("needs a valid time", () => {
    expect(draftProblem({ time: "", amount_l: 1, amount_r: 0 })).toBe("Pick a time");
    expect(draftProblem({ time: "25:00", amount_l: 1, amount_r: 0 })).toBe("Pick a time");
  });

  test("needs at least one side above zero", () => {
    expect(draftProblem({ time: "12:00", amount_l: 0, amount_r: 0 })).toBe("Pick at least one portion");
  });

  test("keeps each side within 0..20 whole portions", () => {
    expect(draftProblem({ time: "12:00", amount_l: 21, amount_r: 0 })).toBe("Portions go from 0 to 20");
    expect(draftProblem({ time: "12:00", amount_l: 1, amount_r: -1 })).toBe("Portions go from 0 to 20");
    expect(draftProblem({ time: "12:00", amount_l: 1.5, amount_r: 0 })).toBe("Portions go from 0 to 20");
  });
});

describe("toServiceTime", () => {
  test("widens HH:MM to HH:MM:SS, padding a one-digit hour", () => {
    expect(toServiceTime("12:00")).toBe("12:00:00");
    expect(toServiceTime("00:00")).toBe("00:00:00");
    expect(toServiceTime("7:05")).toBe("07:05:00");
  });

  test("rejects a malformed time", () => {
    expect(() => toServiceTime("")).toThrow();
  });
});

describe("scheduleAddData", () => {
  test("maps a draft to schedule_add's fields, enabled", () => {
    expect(scheduleAddData("dev1", { time: "18:30", amount_l: 0, amount_r: 3 })).toEqual({
      device_id: "dev1",
      time: "18:30:00",
      hopper1_g: 0,
      hopper2_g: 3,
      enabled: true,
    });
  });
});

describe("scheduleSetEntries", () => {
  const table: ScheduleEntry[] = [
    { id: "a", time: "00:00", amount_l: 0, amount_r: 3, enabled: true },
    { id: "b", time: "12:00", amount_l: 0, amount_r: 3, enabled: false },
    { id: "c", time: "7:30", amount_l: 2, amount_r: 1, enabled: true },
  ];

  test("changes only the edited entry, which keeps its id and its on/paused state", () => {
    const result = scheduleSetEntries(table, "b", { time: "13:15", amount_l: 2, amount_r: 4 });
    expect(result[1]).toEqual({ entry_id: "b", time: "13:15:00", hopper1_g: 2, hopper2_g: 4, enabled: false });
  });

  test("passes every other entry through unchanged, ids and order included", () => {
    const result = scheduleSetEntries(table, "b", { time: "13:15", amount_l: 2, amount_r: 4 });
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ entry_id: "a", time: "00:00:00", hopper1_g: 0, hopper2_g: 3, enabled: true });
    expect(result[2]).toEqual({ entry_id: "c", time: "07:30:00", hopper1_g: 2, hopper2_g: 1, enabled: true });
  });

  test("refuses an entry that is no longer in the table", () => {
    expect(() => scheduleSetEntries(table, "gone", { time: "13:15", amount_l: 1, amount_r: 0 })).toThrow();
  });
});

describe("serviceErrorMessage", () => {
  test("reads Home Assistant's { message } rejection and plain Errors", () => {
    expect(serviceErrorMessage({ code: "service_validation_error", message: "Schedule writes are disabled" })).toBe("Schedule writes are disabled");
    expect(serviceErrorMessage(new Error("boom"))).toBe("boom");
    expect(serviceErrorMessage("nope")).toBe("nope");
  });

  test("falls back to a generic sentence when there is nothing to read", () => {
    expect(serviceErrorMessage(undefined)).toBe("Home Assistant did not accept the change");
    expect(serviceErrorMessage({})).toBe("Home Assistant did not accept the change");
  });
});
