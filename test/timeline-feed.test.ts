import { describe, expect, test } from "bun:test";
import { TimelineFeed, type SubscribeCapableHass } from "../src/lib/timeline-feed";
import type { TimelineItem } from "../src/types";

const row = (ts: number): TimelineItem => ({ kind: "feed", ts, amount: 1, hopper: "1", before: null, after: null, manual: true, confirmed: true }) as unknown as TimelineItem;

function fakeHass(options: { subscribe?: boolean; failSubscribe?: boolean; oneShot?: TimelineItem[] } = {}) {
  const calls: Record<string, unknown>[] = [];
  // One entry per subscription, so a test can push to an OLD one after resubscribing --
  // which is the only way to check that a superseded subscription's frames are ignored.
  const pushes: ((message: { items?: TimelineItem[] }) => void)[] = [];
  let unsubscribed = 0;
  const hass: SubscribeCapableHass = {
    callWS: async (message) => {
      calls.push(message);
      return { items: options.oneShot ?? [] };
    },
  };
  if (options.subscribe !== false) {
    hass.connection = {
      subscribeMessage: async (callback, message) => {
        calls.push(message);
        if (options.failSubscribe) throw new Error("unknown_command");
        pushes.push(callback);
        return () => {
          unsubscribed += 1;
        };
      },
    };
  }
  return {
    hass,
    calls,
    emit: (items: TimelineItem[], index = pushes.length - 1) => pushes[index]?.({ items }),
    unsubscribes: () => unsubscribed,
  };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("TimelineFeed", () => {
  test("rows pushed by the subscription land without anything asking for them", async () => {
    const { hass, emit } = fakeHass();
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", false);
    await settle();
    emit([row(100)]);
    expect(feed.state.items?.map((i) => i.ts)).toEqual([100]);
    // The case the old watch-key approach missed entirely: a second frame for the same rows
    // gaining their photos, with no entity state change to trigger a re-fetch.
    emit([row(100), row(200)]);
    expect(feed.state.items?.map((i) => i.ts)).toEqual([100, 200]);
    expect(feed.state.loading).toBe(false);
  });

  test("identical parameters never resubscribe", async () => {
    const { hass, calls } = fakeHass();
    const feed = new TimelineFeed(() => {});
    for (let i = 0; i < 5; i += 1) feed.sync(hass, "entry", false);
    await settle();
    expect(calls.length).toBe(1);
    // A changed option is a different subscription, though.
    feed.sync(hass, "entry", true);
    await settle();
    expect(calls.length).toBe(2);
  });

  test("an integration without the subscription still shows a timeline", async () => {
    // An older integration answers `unknown_command`. A card frozen on "loading" would be a
    // worse regression than the staleness the subscription replaces.
    const { hass, calls } = fakeHass({ failSubscribe: true, oneShot: [row(7)] });
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", false);
    await settle();
    await settle();
    expect(feed.state.items?.map((i) => i.ts)).toEqual([7]);
    expect(calls.some((c) => c.type === "kibble/timeline")).toBe(true);
  });

  test("disposal unsubscribes, so a dead card stops costing the integration work", async () => {
    const { hass, unsubscribes } = fakeHass();
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", false);
    await settle();
    feed.dispose();
    expect(unsubscribes()).toBe(1);
  });

  test("a superseded subscription cannot overwrite the current one's rows", async () => {
    // Two syncs in flight (entry resolved, then the visits option flipped): the first one's
    // late frames must not repaint rows for parameters nobody is showing any more.
    const { hass, emit } = fakeHass();
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", false);
    await settle();
    feed.sync(hass, "entry", true);
    await settle();
    emit([row(999)]);
    expect(feed.state.items?.map((i) => i.ts)).toEqual([999]);
    emit([row(1)], 0); // the first subscription, now superseded
    expect(feed.state.items?.map((i) => i.ts)).toEqual([999]);
  });
});
