import { describe, expect, test } from "bun:test";
import { BOWL_MIX_MAX_AGE_MS, deriveBowlMix } from "../src/lib/bowl-mix";
import type { TimelineEvent, TimelineFeedDetail } from "../src/types";

const NOW = new Date("2026-09-24T12:00:00.000Z");

function feed(startOffsetSeconds: number, detail: Partial<TimelineFeedDetail> & Pick<TimelineFeedDetail, "sides">): TimelineEvent {
  return {
    uid: `feed-${startOffsetSeconds}`,
    kind: "feed",
    start: Math.floor(NOW.getTime() / 1000) + startOffsetSeconds,
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
    feed: { portions: detail.sides.reduce((sum, s) => sum + s.portions, 0), scheduled: false, confirmed: true, single: false, ...detail },
  };
}

describe("deriveBowlMix", () => {
  test("is zero in single mode regardless of any split feed", () => {
    const events = [feed(-60, { sides: [{ hopper: 1, portions: 1, food: "Kibble" }, { hopper: 2, portions: 3, food: "Freeze-dried" }] })];
    expect(deriveBowlMix(events, true, NOW)).toBe(0);
  });

  test("is zero with no feed history at all", () => {
    expect(deriveBowlMix([], false, NOW)).toBe(0);
  });

  test("is the hopper-2 share of the most recent split feed", () => {
    const events = [feed(-60, { sides: [{ hopper: 1, portions: 1, food: "Kibble" }, { hopper: 2, portions: 3, food: "Freeze-dried" }] })];
    expect(deriveBowlMix(events, false, NOW)).toBe(0.75);
  });

  test("is zero when the most recent split feed used only hopper 1", () => {
    const events = [feed(-60, { sides: [{ hopper: 1, portions: 2, food: "Kibble" }] })];
    expect(deriveBowlMix(events, false, NOW)).toBe(0);
  });

  test("is one when the most recent split feed used only hopper 2", () => {
    const events = [feed(-60, { sides: [{ hopper: 2, portions: 2, food: "Freeze-dried" }] })];
    expect(deriveBowlMix(events, false, NOW)).toBe(1);
  });

  test("picks the newest split feed over an older one, list already newest-first", () => {
    const events = [
      feed(-60, { sides: [{ hopper: 1, portions: 1, food: "Kibble" }, { hopper: 2, portions: 1, food: "Freeze-dried" }] }),
      feed(-3600, { sides: [{ hopper: 2, portions: 4, food: "Freeze-dried" }] }),
    ];
    expect(deriveBowlMix(events, false, NOW)).toBe(0.5);
  });

  test("ignores a feed older than the age cutoff, even if it is the only one with a split", () => {
    const tooOld = -(BOWL_MIX_MAX_AGE_MS / 1000 + 60);
    const events = [feed(tooOld, { sides: [{ hopper: 2, portions: 3, food: "Freeze-dried" }] })];
    expect(deriveBowlMix(events, false, NOW)).toBe(0);
  });

  test("a feed exactly at the age cutoff still counts", () => {
    const atCutoff = -(BOWL_MIX_MAX_AGE_MS / 1000);
    const events = [feed(atCutoff, { sides: [{ hopper: 2, portions: 3, food: "Freeze-dried" }] })];
    expect(deriveBowlMix(events, false, NOW)).toBe(1);
  });

  test("skips a recent feed with no side breakdown to find an older, still-fresh one that has it", () => {
    const events = [
      feed(-30, { sides: [] }),
      feed(-3600, { sides: [{ hopper: 2, portions: 1, food: "Freeze-dried" }] }),
    ];
    expect(deriveBowlMix(events, false, NOW)).toBe(1);
  });

  test("skips non-feed rows entirely, even ones that are more recent", () => {
    const visit: TimelineEvent = {
      uid: "v1",
      kind: "visit",
      start: Math.floor(NOW.getTime() / 1000) - 10,
      end: null,
      open: false,
      cat: "Pancake",
      identity: "auto",
      confidence: 0.9,
      thumb: null,
      scene: null,
      before: null,
      after: null,
      sample_count: 1,
      session: null,
    };
    const events = [visit, feed(-60, { sides: [{ hopper: 2, portions: 2, food: "Freeze-dried" }] })];
    expect(deriveBowlMix(events, false, NOW)).toBe(1);
  });
});
