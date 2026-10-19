import { describe, expect, test } from "bun:test";
import { combinedHopper, foodForHopper, hopperAriaLabel, hopperDisplayName, hopperFoodName, hopperView, hopperViews, parseHopperLevel, parseHopperRemaining, type HopperRemaining } from "../src/lib/hopper-status";

const NOW = new Date("2026-09-24T15:20:00Z");

function remaining(partial: Partial<HopperRemaining>): HopperRemaining {
  return { portions: null, fullAt: null, portionsSinceFull: null, fullToLow: null, ...partial };
}

describe("parseHopperLevel", () => {
  test("only the three real states parse", () => {
    expect(parseHopperLevel("empty")).toBe("empty");
    expect(parseHopperLevel("low")).toBe("low");
    expect(parseHopperLevel("ok")).toBe("ok");
  });

  test("rejects unavailable/unknown/undefined -- never guesses", () => {
    expect(parseHopperLevel("unavailable")).toBeNull();
    expect(parseHopperLevel("unknown")).toBeNull();
    expect(parseHopperLevel(undefined)).toBeNull();
  });
});

describe("parseHopperRemaining", () => {
  test("a missing entity state is null", () => {
    expect(parseHopperRemaining(undefined)).toBeNull();
  });

  test("an unknown/unavailable sensor state has no portions but keeps its attributes", () => {
    const parsed = parseHopperRemaining({
      entity_id: "sensor.x",
      state: "unknown",
      last_changed: "",
      last_updated: "",
      attributes: { full_at: "2026-09-22T12:00:00Z", portions_since_full: 3, full_to_low: null },
    });
    expect(parsed).toEqual({ portions: null, fullAt: "2026-09-22T12:00:00Z", portionsSinceFull: 3, fullToLow: null });
  });

  test("a known numeric state parses portions alongside the attributes", () => {
    const parsed = parseHopperRemaining({
      entity_id: "sensor.x",
      state: "12",
      last_changed: "",
      last_updated: "",
      attributes: { full_at: "2026-09-22T12:00:00Z", portions_since_full: 8, full_to_low: 20 },
    });
    expect(parsed).toEqual({ portions: 12, fullAt: "2026-09-22T12:00:00Z", portionsSinceFull: 8, fullToLow: 20 });
  });

  test("missing/malformed attributes fall back to null, never throw", () => {
    const parsed = parseHopperRemaining({ entity_id: "sensor.x", state: "5", last_changed: "", last_updated: "", attributes: {} });
    expect(parsed).toEqual({ portions: 5, fullAt: null, portionsSinceFull: null, fullToLow: null });
  });
});

describe("hopperView: unknown level", () => {
  test("renders a neutral dash and no fill, never a guessed state -- even with rich remaining data", () => {
    const view = hopperView(1, null, remaining({ portions: 12, fullToLow: 20, fullAt: "2026-09-22T12:00:00Z" }), NOW);
    expect(view).toEqual({ index: 1, level: null, tone: "unknown", headline: "Unknown", fillFraction: null, detail: null });
  });
});

describe("hopperView: ok", () => {
  test("plain ok with no mark-full history is just Stocked, no tap detail", () => {
    const view = hopperView(1, "ok", null, NOW);
    expect(view.tone).toBe("ok");
    expect(view.headline).toBe("Stocked");
    expect(view.detail).toBeNull();
    expect(view.fillFraction).toBeGreaterThan(0.34);
    expect(view.fillFraction).toBeLessThan(1);
  });

  test("a learned estimate shows the portion count and fills above the low line", () => {
    const view = hopperView(2, "ok", remaining({ portions: 12, fullToLow: 20, fullAt: "2026-09-22T15:20:00Z" }), NOW);
    expect(view.headline).toBe("About 12 left");
    expect(view.detail).toBe("About 12 portions left \u00b7 filled 2 days ago");
    expect(view.fillFraction).toBeCloseTo(0.34 + 0.66 * 0.6);
  });

  test("a fresh full mark (remaining == full_to_low) is allowed to read as genuinely full", () => {
    const view = hopperView(1, "ok", remaining({ portions: 20, fullToLow: 20, fullAt: "2026-09-24T15:19:00Z" }), NOW);
    expect(view.fillFraction).toBe(1);
  });

  test("marked full but capacity not learned yet: compact headline, full sentence on tap, draining fill", () => {
    const view = hopperView(1, "ok", remaining({ fullAt: "2026-09-22T15:20:00Z", portionsSinceFull: 9, fullToLow: null }), NOW);
    expect(view.headline).toBe("Filled 2d ago");
    expect(view.detail).toBe("Filled 2 days ago, 9 portions since");
    expect(view.fillFraction).toBeLessThan(1);
    expect(view.fillFraction).toBeGreaterThan(0.64);
  });

  test("just marked full reads as a completely full tank, and never drains below plain Stocked", () => {
    const fresh = hopperView(1, "ok", remaining({ fullAt: "2026-09-24T15:00:00Z", portionsSinceFull: 0, fullToLow: null }), NOW);
    expect(fresh.fillFraction).toBe(1);
    const long = hopperView(1, "ok", remaining({ fullAt: "2026-09-10T15:00:00Z", portionsSinceFull: 500, fullToLow: null }), NOW);
    expect(long.fillFraction).toBeCloseTo(0.64);
  });

  test("marked full with zero portions dispensed since omits the portions clause", () => {
    const view = hopperView(1, "ok", remaining({ fullAt: "2026-09-24T15:00:00Z", portionsSinceFull: 0, fullToLow: null }), NOW);
    expect(view.headline).toBe("Filled 20m ago");
    expect(view.detail).toBe("Filled 20 minutes ago");
  });

  test("a singular portion is worded correctly, not '1 portions'", () => {
    const view = hopperView(1, "ok", remaining({ fullAt: "2026-09-24T15:00:00Z", portionsSinceFull: 1, fullToLow: null }), NOW);
    expect(view.detail).toBe("Filled 20 minutes ago, 1 portion since");
  });

  test("fullToLow of zero is treated as not-yet-learned, not a divide-by-zero crash", () => {
    const view = hopperView(1, "ok", remaining({ portions: 0, fullToLow: 0 }), NOW);
    expect(view.headline).toBe("Stocked");
  });
});

describe("single hopper (divider out)", () => {
  test("two compartments render as two views, one undivided hopper as a single view", () => {
    expect(hopperViews(false, "ok", "ok", null, null, NOW).map((v) => v.index)).toEqual([1, 2]);
    const [only, ...rest] = hopperViews(true, "ok", "ok", null, null, NOW);
    expect(rest).toEqual([]);
    expect(only.index).toBeNull();
    expect(hopperAriaLabel(only)).toBe("Hopper: Stocked");
  });

  test("the more pessimistic side's sensor decides the combined level", () => {
    expect(combinedHopper("ok", "low", null, null).level).toBe("low");
    expect(combinedHopper("empty", "low", null, null).level).toBe("empty");
    expect(combinedHopper(null, "ok", null, null).level).toBe("ok");
    expect(combinedHopper(null, null, null, null).level).toBeNull();
  });

  test("remaining and capacity only add up when both sides are learned", () => {
    const both = combinedHopper("ok", "ok", remaining({ portions: 10, fullToLow: 20 }), remaining({ portions: 6, fullToLow: 18 }));
    expect(both.remaining?.portions).toBe(16);
    expect(both.remaining?.fullToLow).toBe(38);
    const half = combinedHopper("ok", "ok", remaining({ portions: 10, fullToLow: 20 }), remaining({}));
    expect(half.remaining?.portions).toBeNull();
  });

  test("a fresh mark on the undivided hopper reads full", () => {
    const mark = remaining({ fullAt: "2026-09-24T15:19:00Z", portionsSinceFull: 0 });
    const [view] = hopperViews(true, "ok", "ok", mark, mark, NOW);
    expect(view.fillFraction).toBe(1);
  });
});

describe("hopperView: the real sensor always wins", () => {
  test("low ignores a rosy remaining estimate entirely", () => {
    const view = hopperView(1, "low", remaining({ portions: 12, fullToLow: 20 }), NOW);
    expect(view.tone).toBe("low");
    expect(view.headline).toBe("Low");
    expect(view.fillFraction).toBeLessThan(0.34);
  });

  test("empty ignores a rosy remaining estimate entirely", () => {
    const view = hopperView(2, "empty", remaining({ portions: 15, fullToLow: 20 }), NOW);
    expect(view.tone).toBe("empty");
    expect(view.headline).toBe("Empty");
    expect(view.fillFraction).toBe(0);
  });

  test("low/empty still surface filled-ago context as compatible detail, not a contradiction", () => {
    const view = hopperView(2, "empty", remaining({ fullAt: "2026-09-22T15:20:00Z", portionsSinceFull: 9 }), NOW);
    expect(view.headline).toBe("Empty");
    expect(view.detail).toBe("Filled 2 days ago, 9 portions since");
  });

  test("empty with no fill history at all has nothing to show on tap", () => {
    const view = hopperView(1, "empty", null, NOW);
    expect(view.detail).toBeNull();
  });
});

describe("hopperAriaLabel", () => {
  test("unknown", () => {
    expect(hopperAriaLabel(hopperView(1, null, null, NOW))).toBe("Hopper 1: level unknown");
  });

  test("plain state with no detail", () => {
    expect(hopperAriaLabel(hopperView(2, "ok", null, NOW))).toBe("Hopper 2: Stocked");
  });

  test("appends the detail sentence when present", () => {
    const label = hopperAriaLabel(hopperView(1, "low", remaining({ fullAt: "2026-09-22T15:20:00Z", portionsSinceFull: 9 }), NOW));
    expect(label).toBe("Hopper 1: Low. Filled 2 days ago, 9 portions since");
  });
});

describe("hopperFoodName", () => {
  test("unavailable, unknown, and blank all mean unnamed", () => {
    expect(hopperFoodName(undefined)).toBeNull();
    expect(hopperFoodName({ entity_id: "text.f", state: "unavailable", attributes: {}, last_changed: "", last_updated: "" })).toBeNull();
    expect(hopperFoodName({ entity_id: "text.f", state: "unknown", attributes: {}, last_changed: "", last_updated: "" })).toBeNull();
    expect(hopperFoodName({ entity_id: "text.f", state: "  ", attributes: {}, last_changed: "", last_updated: "" })).toBeNull();
  });

  test("trims a real name", () => {
    expect(hopperFoodName({ entity_id: "text.f", state: " Kibble ", attributes: {}, last_changed: "", last_updated: "" })).toBe("Kibble");
  });
});

describe("hopperDisplayName / foodForHopper", () => {
  test("the single combined tank is never named, even when a food string is passed in", () => {
    const view = hopperView(null, "ok", null, NOW);
    expect(hopperDisplayName(view, "Kibble")).toBe("Hopper");
  });

  test("dual mode uses the food name once set", () => {
    const view = hopperView(1, "ok", null, NOW);
    expect(hopperDisplayName(view, "Kibble")).toBe("Kibble");
  });

  test("dual mode falls back to 'Hopper N' when unnamed", () => {
    const view = hopperView(2, "ok", null, NOW);
    expect(hopperDisplayName(view, null)).toBe("Hopper 2");
  });

  test("foodForHopper picks the matching side and null for the combined tank", () => {
    expect(foodForHopper(1, "Kibble", "Freeze-dried")).toBe("Kibble");
    expect(foodForHopper(2, "Kibble", "Freeze-dried")).toBe("Freeze-dried");
    expect(foodForHopper(null, "Kibble", "Freeze-dried")).toBeNull();
  });
});

describe("hopperAriaLabel with food", () => {
  test("the accessible name follows the food name, matching the visible label", () => {
    const label = hopperAriaLabel(hopperView(1, "ok", null, NOW), "Kibble");
    expect(label).toBe("Kibble: Stocked");
  });

  test("defaults to the plain 'Hopper N' name when no food is passed", () => {
    expect(hopperAriaLabel(hopperView(2, "ok", null, NOW))).toBe("Hopper 2: Stocked");
  });
});
