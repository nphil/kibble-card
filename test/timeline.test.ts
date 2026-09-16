import { describe, expect, test } from "bun:test";
import { detectionVerb, feedSummary, groupByDay } from "../src/lib/timeline";
import type { TimelineDetectionItem, TimelineFeedItem, TimelineItem } from "../src/types";

function detection(overrides: Partial<TimelineDetectionItem> & { ts: number }): TimelineDetectionItem {
  return {
    kind: "detection",
    class: "visit",
    cat: null,
    pet_id: null,
    vendor_cat: null,
    image: null,
    ...overrides,
  };
}

function feed(overrides: Partial<TimelineFeedItem> & { ts: number }): TimelineFeedItem {
  return { kind: "feed", amount: null, hopper: null, outcome: null, before: null, after: null, ...overrides };
}

describe("detectionVerb", () => {
  test("maps every known class to its own verb", () => {
    expect(detectionVerb("eat")).toBe("ate");
    expect(detectionVerb("visit")).toBe("came by");
    expect(detectionVerb("face")).toBe("identified");
    expect(detectionVerb("track")).toBe("identified");
  });

  test("never surfaces a raw class it doesn't recognize", () => {
    expect(detectionVerb("some_future_class")).toBe("was seen");
  });
});

describe("feedSummary", () => {
  test("names the amount and pluralizes portions", () => {
    expect(feedSummary({ amount: 5, hopper: "both" })).toBe("Fed 5 portions");
    expect(feedSummary({ amount: 1, hopper: "both" })).toBe("Fed 1 portion");
  });

  test("names the hopper only when it isn't both", () => {
    expect(feedSummary({ amount: 3, hopper: "1" })).toBe("Fed 3 portions from hopper 1");
    expect(feedSummary({ amount: 3, hopper: "both" })).toBe("Fed 3 portions");
    expect(feedSummary({ amount: 3, hopper: null })).toBe("Fed 3 portions");
  });

  test("omits the amount clause entirely when amount is null", () => {
    expect(feedSummary({ amount: null, hopper: "2" })).toBe("Fed");
  });
});

describe("groupByDay", () => {
  const now = new Date(2026, 5, 10, 20, 0, 0);
  const todayTs = Math.floor(new Date(2026, 5, 10, 18, 4, 0).getTime() / 1000);
  const alsoTodayTs = Math.floor(new Date(2026, 5, 10, 7, 30, 0).getTime() / 1000);
  const yesterdayTs = Math.floor(new Date(2026, 5, 9, 12, 0, 0).getTime() / 1000);
  const lastWeekTs = Math.floor(new Date(2026, 5, 2, 9, 0, 0).getTime() / 1000);

  test("buckets a newest-first mixed list of detections and feeds by calendar day", () => {
    const items: TimelineItem[] = [
      detection({ ts: todayTs, class: "eat", cat: "Pancake" }),
      feed({ ts: alsoTodayTs, amount: 5 }),
      detection({ ts: yesterdayTs, class: "visit" }),
    ];

    const days = groupByDay(items, now);

    expect(days.map((day) => day.label)).toEqual(["Today", "Yesterday"]);
    expect(days[0]!.items).toHaveLength(2);
    expect(days[0]!.items[0]).toBe(items[0]);
    expect(days[0]!.items[1]).toBe(items[1]);
    expect(days[1]!.items).toEqual([items[2]]);
  });

  test("labels anything older than yesterday with a weekday and date, not a relative word", () => {
    const days = groupByDay([detection({ ts: lastWeekTs })], now);

    expect(days[0]!.label).not.toBe("Today");
    expect(days[0]!.label).not.toBe("Yesterday");
    expect(days[0]!.label).toContain("Jun");
  });

  test("returns an empty list for an empty timeline", () => {
    expect(groupByDay([], now)).toEqual([]);
  });
});
