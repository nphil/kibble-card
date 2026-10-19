import { describe, expect, test } from "bun:test";
import { compareAssets, DEFAULT_RAIL_MAX_HEIGHT, eventDuration, eventTitle, feedTitle, groupByDay, groupConsecutive, needsIdentification, railStyle, rowThumbAsset, spanDuration, togetherTitle } from "../src/lib/timeline";
import type { Asset, TimelineEvent } from "../src/types";

const BODY: Asset = { id: "body", url: "/body" };
const SCENE: Asset = { id: "scene", url: "/scene" };
const BEFORE: Asset = { id: "before", url: "/before" };
const AFTER: Asset = { id: "after", url: "/after" };

function makeEvent(overrides: Partial<TimelineEvent> & Pick<TimelineEvent, "uid" | "kind" | "start">): TimelineEvent {
  return {
    end: null,
    open: false,
    cat: null,
    identity: null,
    confidence: null,
    thumb: null,
    scene: null,
    before: null,
    after: null,
    sample_count: 0,
    session: null,
    ...overrides,
  };
}

describe("eventTitle", () => {
  test("names the cat for a closed eat", () => {
    expect(eventTitle(makeEvent({ uid: "1", kind: "eat", start: 0, cat: "Pancake" }))).toBe("Pancake ate");
  });

  test("names the cat for a closed visit", () => {
    expect(eventTitle(makeEvent({ uid: "1", kind: "visit", start: 0, cat: "Kitty" }))).toBe("Kitty came by");
  });

  test("names the cat with a live state while open", () => {
    expect(eventTitle(makeEvent({ uid: "1", kind: "eat", start: 0, cat: "Pancake", open: true }))).toBe("Pancake is eating");
    expect(eventTitle(makeEvent({ uid: "1", kind: "visit", start: 0, cat: "Kitty", open: true }))).toBe("Kitty is here");
  });

  test("never renders the banned unknown-cat strings, closed or open", () => {
    const closed = eventTitle(makeEvent({ uid: "1", kind: "eat", start: 0, cat: null }));
    const open = eventTitle(makeEvent({ uid: "1", kind: "visit", start: 0, cat: null, open: true }));
    for (const title of [closed, open]) {
      expect(title).not.toBe("Unknown cat");
      expect(title).not.toBe("A cat ate");
      expect(title).not.toBe("A cat came by");
    }
  });

  test("delegates a feed row to feedTitle regardless of cat/open", () => {
    const feed = makeEvent({ uid: "1", kind: "feed", start: 0, feed: { portions: 2, scheduled: false, confirmed: true, single: true, sides: [] } });
    expect(eventTitle(feed)).toBe(feedTitle(feed));
  });
});

describe("feedTitle", () => {
  test("falls back to bare 'Fed' with no feed detail at all", () => {
    expect(feedTitle({ feed: undefined })).toBe("Fed");
  });

  test("falls back to bare 'Fed' when even the amount is unknown", () => {
    expect(feedTitle({ feed: { portions: null as unknown as number, scheduled: false, confirmed: false, single: false, sides: [] } })).toBe("Fed");
  });

  test("single mode: singular portion", () => {
    expect(feedTitle({ feed: { portions: 1, scheduled: false, confirmed: true, single: true, sides: [] } })).toBe("Fed 1 portion");
  });

  test("single mode: plural portions, never a hopper word", () => {
    const title = feedTitle({ feed: { portions: 3, scheduled: true, confirmed: true, single: true, sides: [] } });
    expect(title).toBe("Fed 3 portions");
    expect(title).not.toContain("hopper");
  });

  test("dual mode with no per-side breakdown (a legacy row) reads as a plain total, not 'Fed'", () => {
    expect(feedTitle({ feed: { portions: 4, scheduled: false, confirmed: true, single: false, sides: [] } })).toBe("Fed 4 portions");
  });

  test("dual, one side fired, named -- the food, not the hopper number", () => {
    expect(
      feedTitle({ feed: { portions: 2, scheduled: false, confirmed: true, single: false, sides: [{ hopper: 1, portions: 2, food: "kibble" }] } }),
    ).toBe("Fed 2 portions of kibble");
  });

  test("dual, one side fired, unnamed -- falls back to the hopper number", () => {
    expect(
      feedTitle({ feed: { portions: 2, scheduled: true, confirmed: true, single: false, sides: [{ hopper: 2, portions: 2, food: null }] } }),
    ).toBe("Fed 2 portions from hopper 2");
  });

  test("dual, both sides fired, both named", () => {
    const feed = {
      portions: 3,
      scheduled: false,
      confirmed: true,
      single: false,
      sides: [
        { hopper: 1 as const, portions: 1, food: "kibble" },
        { hopper: 2 as const, portions: 2, food: "freeze-dried" },
      ],
    };
    expect(feedTitle({ feed })).toBe("Fed 1 kibble and 2 freeze-dried");
  });

  test("dual, both sides fired, unnamed and equal", () => {
    const feed = {
      portions: 2,
      scheduled: false,
      confirmed: true,
      single: false,
      sides: [
        { hopper: 1 as const, portions: 1, food: null },
        { hopper: 2 as const, portions: 1, food: null },
      ],
    };
    expect(feedTitle({ feed })).toBe("Fed 1 portion from each hopper");
  });

  test("dual, both sides fired, unnamed and unequal", () => {
    const feed = {
      portions: 3,
      scheduled: false,
      confirmed: true,
      single: false,
      sides: [
        { hopper: 1 as const, portions: 2, food: null },
        { hopper: 2 as const, portions: 1, food: null },
      ],
    };
    expect(feedTitle({ feed })).toBe("Fed 2 from hopper 1 and 1 from hopper 2");
  });

  test("dual, both sides fired, only one named -- treated as unnamed rather than mixing in the one food", () => {
    const feed = {
      portions: 2,
      scheduled: false,
      confirmed: true,
      single: false,
      sides: [
        { hopper: 1 as const, portions: 1, food: "kibble" },
        { hopper: 2 as const, portions: 1, food: null },
      ],
    };
    expect(feedTitle({ feed })).toBe("Fed 1 portion from each hopper");
  });

  test("never produces an em dash", () => {
    const cases: Array<Parameters<typeof feedTitle>[0]> = [
      { feed: undefined },
      { feed: { portions: 1, scheduled: false, confirmed: true, single: true, sides: [] } },
      { feed: { portions: 3, scheduled: false, confirmed: true, single: false, sides: [{ hopper: 1, portions: 2, food: null }, { hopper: 2, portions: 1, food: null }] } },
    ];
    for (const feed of cases) {
      expect(feedTitle(feed)).not.toContain("\u2014");
    }
  });
});

describe("eventDuration", () => {
  test("null for an open meal even with an end already set", () => {
    expect(eventDuration({ kind: "eat", start: 0, end: 60, open: true })).toBeNull();
  });

  test("null for a visit or a feed", () => {
    expect(eventDuration({ kind: "visit", start: 0, end: 90, open: false })).toBeNull();
    expect(eventDuration({ kind: "feed", start: 0, end: 90, open: false })).toBeNull();
  });

  test("null when end is missing or not after start", () => {
    expect(eventDuration({ kind: "eat", start: 100, end: null, open: false })).toBeNull();
    expect(eventDuration({ kind: "eat", start: 100, end: 100, open: false })).toBeNull();
  });

  test("formats a closed meal's real length", () => {
    expect(eventDuration({ kind: "eat", start: 0, end: 45, open: false })).toBe("45 sec");
    expect(eventDuration({ kind: "eat", start: 0, end: 125, open: false })).toBe("2 min 5 sec");
    expect(eventDuration({ kind: "eat", start: 0, end: 120, open: false })).toBe("2 min");
  });
});

describe("spanDuration", () => {
  test("formats the combined time span", () => {
    expect(spanDuration(100, 405)).toBe("5 min 5 sec");
  });

  test("rejects empty, reversed, or non-finite spans", () => {
    expect(spanDuration(100, 100)).toBeNull();
    expect(spanDuration(200, 100)).toBeNull();
    expect(spanDuration(Number.NaN, 200)).toBeNull();
  });
});

describe("needsIdentification", () => {
  test("true for a closed, unnamed visit or eat", () => {
    expect(needsIdentification({ kind: "visit", cat: null, open: false })).toBe(true);
    expect(needsIdentification({ kind: "eat", cat: null, open: false })).toBe(true);
  });

  test("false once a cat is named", () => {
    expect(needsIdentification({ kind: "visit", cat: "Kitty", open: false })).toBe(false);
  });

  test("false while still open -- premature to ask who it is", () => {
    expect(needsIdentification({ kind: "eat", cat: null, open: true })).toBe(false);
  });

  test("false for a feed -- nothing to identify", () => {
    expect(needsIdentification({ kind: "feed", cat: null, open: false })).toBe(false);
  });
});

describe("rowThumbAsset", () => {
  test("prefers the body crop over the scene", () => {
    expect(rowThumbAsset({ kind: "visit", thumb: BODY, scene: SCENE })).toBe(BODY);
  });

  test("falls back to the scene when no crop was captured", () => {
    expect(rowThumbAsset({ kind: "eat", thumb: null, scene: SCENE })).toBe(SCENE);
  });

  test("null with neither asset", () => {
    expect(rowThumbAsset({ kind: "visit", thumb: null, scene: null })).toBeNull();
  });

  test("always null for a feed, even if thumb/scene happen to be set", () => {
    expect(rowThumbAsset({ kind: "feed", thumb: BODY, scene: SCENE })).toBeNull();
  });
});

describe("compareAssets", () => {
  test("null unless both before and after exist", () => {
    expect(compareAssets({ kind: "eat", before: BEFORE, after: null })).toBeNull();
    expect(compareAssets({ kind: "eat", before: null, after: AFTER })).toBeNull();
  });

  test("returns the pair for a meal or a feed with both photos", () => {
    expect(compareAssets({ kind: "eat", before: BEFORE, after: AFTER })).toEqual({ before: BEFORE, after: AFTER });
    expect(compareAssets({ kind: "feed", before: BEFORE, after: AFTER })).toEqual({ before: BEFORE, after: AFTER });
  });

  test("null for a visit even with both photos present", () => {
    expect(compareAssets({ kind: "visit", before: BEFORE, after: AFTER })).toBeNull();
  });
});

describe("groupConsecutive", () => {
  test("keeps unrelated events as separate single-member groups", () => {
    const items = [
      makeEvent({ uid: "3", kind: "eat", start: 300, cat: "Pancake" }),
      makeEvent({ uid: "2", kind: "visit", start: 200, cat: "Pancake" }),
      makeEvent({ uid: "1", kind: "eat", start: 100, cat: "Kitty" }),
    ];
    const groups = groupConsecutive(items);
    expect(groups).toHaveLength(3);
    expect(groups.map((g) => g.events.length)).toEqual([1, 1, 1]);
  });

  test("collapses same kind/cat within the window into one group with every member", () => {
    const items = [
      makeEvent({ uid: "2", kind: "visit", start: 300, cat: "Pancake" }),
      makeEvent({ uid: "1", kind: "visit", start: 120, cat: "Pancake" }),
    ];
    const groups = groupConsecutive(items);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.event.uid).toBe("2");
    expect(groups[0]!.events.map((e) => e.uid)).toEqual(["2", "1"]);
  });

  test("exactly at the window boundary still collapses", () => {
    const items = [makeEvent({ uid: "2", kind: "eat", start: 300, cat: "Kitty" }), makeEvent({ uid: "1", kind: "eat", start: 0, cat: "Kitty" })];
    expect(groupConsecutive(items)).toHaveLength(1);
  });

  test("one second past the window boundary does not collapse", () => {
    const items = [makeEvent({ uid: "2", kind: "eat", start: 301, cat: "Kitty" }), makeEvent({ uid: "1", kind: "eat", start: 0, cat: "Kitty" })];
    expect(groupConsecutive(items)).toHaveLength(2);
  });

  test("a different kind in between breaks the run", () => {
    const items = [
      makeEvent({ uid: "3", kind: "visit", start: 200, cat: "Kitty" }),
      makeEvent({ uid: "2", kind: "eat", start: 150, cat: "Kitty" }),
      makeEvent({ uid: "1", kind: "visit", start: 100, cat: "Kitty" }),
    ];
    const groups = groupConsecutive(items);
    expect(groups).toHaveLength(3);
  });

  test("two unnamed events of the same kind still collapse (cat null === cat null)", () => {
    const items = [makeEvent({ uid: "2", kind: "visit", start: 200 }), makeEvent({ uid: "1", kind: "visit", start: 100 })];
    expect(groupConsecutive(items)).toHaveLength(1);
  });

  test("collapses overlapping lanes from one session even when another row sits between them", () => {
    const kitty = makeEvent({ uid: "kitty", kind: "eat", start: 200, end: 300, cat: "Kitty", session: "session-a" });
    const unrelated = makeEvent({ uid: "other", kind: "visit", start: 190, end: 195, cat: "Milo" });
    const pancake = makeEvent({ uid: "pancake", kind: "eat", start: 150, end: 250, cat: "Pancake", session: "session-a" });
    const groups = groupConsecutive([kitty, unrelated, pancake], 400);
    expect(groups).toHaveLength(2);
    const together = groups.find((group) => group.together);
    expect(together).toMatchObject({ together: true, start: 150, end: 300 });
    expect(together?.events.map((event) => event.uid)).toEqual(["kitty", "pancake"]);
  });

  test("does not collapse same-session lanes whose time ranges do not overlap", () => {
    const first = makeEvent({ uid: "first", kind: "eat", start: 100, end: 150, cat: "Kitty", session: "session-a" });
    const second = makeEvent({ uid: "second", kind: "eat", start: 151, end: 190, cat: "Pancake", session: "session-a" });
    expect(groupConsecutive([second, first], 300).map((group) => group.together ?? false)).toEqual([false, false]);
  });

  test("uses now as the end of an open lane when finding overlap", () => {
    const open = makeEvent({ uid: "open", kind: "eat", start: 100, end: null, open: true, cat: "Kitty", session: "session-a" });
    const recent = makeEvent({ uid: "recent", kind: "visit", start: 250, end: 280, cat: "Pancake", session: "session-a" });
    expect(groupConsecutive([open, recent], 300)[0]).toMatchObject({ together: true, start: 100, end: 300 });
  });

  test("orders shared-session titles by eaters without an unknown-cat lane", () => {
    const kitty = makeEvent({ uid: "kitty", kind: "eat", start: 200, end: 300, cat: "Kitty", session: "session-a" });
    const unknown = makeEvent({ uid: "unknown", kind: "eat", start: 180, end: 280, cat: null, session: "session-a" });
    const visitor = makeEvent({ uid: "visitor", kind: "visit", start: 190, end: 250, cat: "Pancake", session: "session-a" });
    expect(togetherTitle([unknown, kitty])).toBe("Kitty and Who? ate");
    expect(togetherTitle([visitor, unknown, kitty])).toBe("Kitty ate, Who? ate, Pancake came by");
  });
});

describe("groupByDay", () => {
  const now = new Date(2026, 8, 24, 20, 0, 0);
  const todayTs = Math.floor(new Date(2026, 8, 24, 9, 0, 0).getTime() / 1000);
  const yesterdayTs = Math.floor(new Date(2026, 8, 23, 9, 0, 0).getTime() / 1000);
  const olderTs = Math.floor(new Date(2026, 8, 20, 9, 0, 0).getTime() / 1000);

  function group(uid: string, start: number) {
    return { event: makeEvent({ uid, kind: "visit", start }), events: [makeEvent({ uid, kind: "visit", start })] };
  }

  test("labels today and yesterday by name, older by weekday and date", () => {
    const days = groupByDay([group("1", todayTs), group("2", yesterdayTs), group("3", olderTs)], now);
    expect(days.map((d) => d.label)).toEqual(["Today", "Yesterday", "Sunday, Sep 20"]);
  });

  test("buckets multiple same-day groups together in arrival order", () => {
    const days = groupByDay([group("1", todayTs + 3600), group("2", todayTs)], now);
    expect(days).toHaveLength(1);
    expect(days[0]!.groups.map((g) => g.event.uid)).toEqual(["1", "2"]);
  });
});

describe("railStyle", () => {
  test("defaults to a bounded cap -- the rail scrolls inside itself, not the page", () => {
    expect(railStyle(undefined)).toBe(`max-height:${DEFAULT_RAIL_MAX_HEIGHT}`);
  });

  test("none opts out of a max-height entirely, growing with the page instead", () => {
    expect(railStyle("none")).toBe("");
  });

  test("passes through an explicit setting", () => {
    expect(railStyle("400px")).toBe("max-height:400px");
  });
});
