import { describe, expect, test } from "bun:test";
import { detectionHeadline, feedSummary, filterVisits, groupByDay } from "../src/lib/timeline";
import type { TimelineEatItem, TimelineFeedItem, TimelineIdentifiedItem, TimelineItem, TimelineVisitItem } from "../src/types";

function identified(overrides: Partial<TimelineIdentifiedItem> & { ts: number }): TimelineIdentifiedItem {
  return { kind: "identified", cat: "Pancake", paired_class: "eat", image: null, ...overrides };
}

function eat(overrides: Partial<TimelineEatItem> & { ts: number }): TimelineEatItem {
  return { kind: "eat", image: null, ...overrides };
}

function visit(overrides: Partial<TimelineVisitItem> & { ts: number }): TimelineVisitItem {
  return { kind: "visit", image: null, ...overrides };
}

function feed(overrides: Partial<TimelineFeedItem> & { ts: number }): TimelineFeedItem {
  return { kind: "feed", amount: null, hopper: null, manual: true, before: null, after: null, ...overrides };
}

describe("detectionHeadline", () => {
  test("names the cat and says \"ate\" once paired with a real eat detection", () => {
    expect(detectionHeadline(identified({ ts: 0, cat: "Pancake", paired_class: "eat" }))).toBe("Pancake ate");
  });

  test("names the cat but says \"was at the bowl\" when only paired with a visit", () => {
    expect(detectionHeadline(identified({ ts: 0, cat: "Kitty", paired_class: "visit" }))).toBe("Kitty was at the bowl");
  });

  test("names the cat but says \"was at the bowl\" when nothing paired at all", () => {
    expect(detectionHeadline(identified({ ts: 0, cat: "Kitty", paired_class: null }))).toBe("Kitty was at the bowl");
  });

  test("never guesses a name for an eat with nobody identified nearby", () => {
    expect(detectionHeadline(eat({ ts: 0 }))).toBe("A cat ate");
  });

  test("never guesses a name for a bare visit", () => {
    expect(detectionHeadline(visit({ ts: 0 }))).toBe("A cat came by");
  });
});

describe("filterVisits", () => {
  test("drops visit rows by default, keeping every other kind", () => {
    const items: TimelineItem[] = [identified({ ts: 2 }), visit({ ts: 1 }), eat({ ts: 0 })];

    expect(filterVisits(items, false)).toEqual([items[0], items[2]]);
  });

  test("keeps visit rows once showVisits opts back in", () => {
    const items: TimelineItem[] = [identified({ ts: 2 }), visit({ ts: 1 }), eat({ ts: 0 })];

    expect(filterVisits(items, true)).toEqual(items);
  });

  test("is a no-op on a list with no visits at all", () => {
    const items: TimelineItem[] = [identified({ ts: 1 }), feed({ ts: 0 })];

    expect(filterVisits(items, false)).toEqual(items);
  });
});

describe("feedSummary", () => {
  test("names the amount and pluralizes portions", () => {
    expect(feedSummary({ amount: 5, hopper: "both", manual: true })).toEqual({ headline: "Fed 5 portions", scheduled: false });
    expect(feedSummary({ amount: 1, hopper: "both", manual: true })).toEqual({ headline: "Fed 1 portion", scheduled: false });
  });

  test("names the hopper only when it isn't both", () => {
    expect(feedSummary({ amount: 3, hopper: "1", manual: true }).headline).toBe("Fed 3 portions from hopper 1");
    expect(feedSummary({ amount: 3, hopper: "both", manual: true }).headline).toBe("Fed 3 portions");
    expect(feedSummary({ amount: 3, hopper: null, manual: true }).headline).toBe("Fed 3 portions");
  });

  test("omits the amount clause entirely when amount is null", () => {
    expect(feedSummary({ amount: null, hopper: "2", manual: true }).headline).toBe("Fed");
  });

  test("flags a scheduler-fired cycle as scheduled and a manual one as not, independent of amount", () => {
    expect(feedSummary({ amount: 5, hopper: "both", manual: false }).scheduled).toBe(true);
    expect(feedSummary({ amount: 5, hopper: "both", manual: true }).scheduled).toBe(false);
    expect(feedSummary({ amount: null, hopper: null, manual: false }).scheduled).toBe(true);
  });
});

describe("groupByDay", () => {
  const now = new Date(2026, 5, 10, 20, 0, 0);
  const todayTs = Math.floor(new Date(2026, 5, 10, 18, 4, 0).getTime() / 1000);
  const alsoTodayTs = Math.floor(new Date(2026, 5, 10, 7, 30, 0).getTime() / 1000);
  const yesterdayTs = Math.floor(new Date(2026, 5, 9, 12, 0, 0).getTime() / 1000);
  const lastWeekTs = Math.floor(new Date(2026, 5, 2, 9, 0, 0).getTime() / 1000);

  test("buckets a newest-first mixed list of identifications, visits and feeds by calendar day", () => {
    const items: TimelineItem[] = [identified({ ts: todayTs, cat: "Pancake" }), feed({ ts: alsoTodayTs, amount: 5 }), visit({ ts: yesterdayTs })];

    const days = groupByDay(items, now);

    expect(days.map((day) => day.label)).toEqual(["Today", "Yesterday"]);
    expect(days[0]!.items).toHaveLength(2);
    expect(days[0]!.items[0]).toBe(items[0]);
    expect(days[0]!.items[1]).toBe(items[1]);
    expect(days[1]!.items).toEqual([items[2]]);
  });

  test("labels anything older than yesterday with a weekday and date, not a relative word", () => {
    const days = groupByDay([eat({ ts: lastWeekTs })], now);

    expect(days[0]!.label).not.toBe("Today");
    expect(days[0]!.label).not.toBe("Yesterday");
    expect(days[0]!.label).toContain("Jun");
  });

  test("returns an empty list for an empty timeline", () => {
    expect(groupByDay([], now)).toEqual([]);
  });
});
