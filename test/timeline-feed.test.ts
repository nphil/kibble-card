import { describe, expect, test } from "bun:test";
import { TimelineFeed, type SubscribeCapableHass } from "../src/lib/timeline-feed";
import type { TimelineEvent } from "../src/types";

function row(uid: string, start: number): TimelineEvent {
  return { uid, kind: "feed", start, end: start, open: false, cat: null, identity: null, confidence: null, thumb: null, scene: null, before: null, after: null, sample_count: 0, session: null, feed: { portions: 1, scheduled: false, confirmed: true, single: false, sides: [{ hopper: 1, portions: 1, food: null }] } };
}

interface TimelinePage {
  items: TimelineEvent[];
  cursor: string | null;
  has_more: boolean;
}

function fakeHass(pages: TimelinePage[]) {
  const calls: Record<string, unknown>[] = [];
  const hass: SubscribeCapableHass = {
    callWS: async (message) => {
      calls.push(message);
      return pages.shift() ?? { items: [], cursor: null, has_more: false };
    },
  };
  return { hass, calls };
}

/** Flushes the microtask queue plus one macrotask tick: `TimelineFeed.sync`/`loadMore` are
 * fire-and-forget by design (matching how a Lit component calls them from `willUpdate`, no
 * promise to await), so there is no signal to await directly here. A 0ms timer is not a guessed
 * duration -- macrotasks are spec-guaranteed to run only once the microtask queue drains, which
 * is exactly "every pending `.then()` from the mock's async `callWS` has settled" -- so this is
 * deterministic, not a race, and more robust than hand-counting `await` hops. */
function settle(): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 0);
  return promise;
}

describe("TimelineFeed", () => {
  test("requests one bounded newest page for stable card updates", async () => {
    const { hass, calls } = fakeHass([{ items: [row("1", 100)], cursor: "next", has_more: true }]);
    const feed = new TimelineFeed(() => {});
    for (let i = 0; i < 5; i += 1) feed.sync(hass, "entry", 25);
    await settle();
    expect(calls).toEqual([{ type: "kibble/timeline", entry_id: "entry", limit: 25 }]);
    expect(feed.state).toMatchObject({ items: [row("1", 100)], cursor: "next", hasMore: true, loading: false });
  });

  test("appends the next page only after an explicit load-older action", async () => {
    const { hass, calls } = fakeHass([
      { items: [row("3", 300)], cursor: "older-than-300", has_more: true },
      { items: [row("2", 200), row("1", 100)], cursor: null, has_more: false },
    ]);
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", 25);
    await settle();
    feed.loadMore(hass, "entry", 25);
    await settle();
    expect(calls[1]).toEqual({ type: "kibble/timeline", entry_id: "entry", limit: 25, cursor: "older-than-300" });
    expect(feed.state).toMatchObject({ items: [row("3", 300), row("2", 200), row("1", 100)], cursor: null, hasMore: false, loadingMore: false });
  });

  test("ignores a superseded page response", async () => {
    let resolveFirst: ((page: TimelinePage) => void) | undefined;
    const hass: SubscribeCapableHass = {
      callWS: async (message) => {
        if (message.limit !== 10) return { items: [row("2", 200)], cursor: null, has_more: false };
        const { promise, resolve } = Promise.withResolvers<TimelinePage>();
        resolveFirst = resolve;
        return promise;
      },
    };
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", 10);
    feed.sync(hass, "entry", 25);
    await settle();
    resolveFirst?.({ items: [row("1", 100)], cursor: null, has_more: false });
    await settle();
    expect(feed.state.items).toEqual([row("2", 200)]);
  });

  test("loadMore does nothing while a request is already outstanding or history is exhausted", async () => {
    const { hass, calls } = fakeHass([{ items: [row("1", 100)], cursor: null, has_more: false }]);
    const feed = new TimelineFeed(() => {});
    feed.sync(hass, "entry", 25);
    feed.loadMore(hass, "entry", 25); // exhausted (has_more still false from initial state) -- no-op
    await settle();
    feed.loadMore(hass, "entry", 25); // now settled with has_more: false -- still a no-op
    await settle();
    expect(calls).toHaveLength(1);
  });
});

describe("TimelineFeed item mutation", () => {
  function seeded(): TimelineFeed {
    const feed = new TimelineFeed(() => {});
    feed.state = { items: [row("2", 200), row("1", 100)], loading: false, loadingMore: false, cursor: null, hasMore: false, error: null };
    return feed;
  }

  test("replaceItem swaps a matching uid in place, leaving order and other rows untouched", () => {
    const feed = seeded();
    const updated = row("1", 100);
    updated.cat = "Kitty";
    feed.replaceItem("1", updated);
    expect(feed.state.items).toEqual([row("2", 200), updated]);
  });

  test("replaceItem is a no-op for a uid that isn't loaded", () => {
    const feed = seeded();
    const before = feed.state.items;
    feed.replaceItem("missing", row("missing", 50));
    expect(feed.state.items).toBe(before);
  });

  test("removeItem drops exactly the matching uid", () => {
    const feed = seeded();
    feed.removeItem("2");
    expect(feed.state.items).toEqual([row("1", 100)]);
  });

  test("restoreItems replaces the whole list wholesale, for optimistic rollback", () => {
    const feed = seeded();
    const snapshot = feed.state.items;
    feed.removeItem("1");
    feed.removeItem("2");
    expect(feed.state.items).toEqual([]);
    feed.restoreItems(snapshot);
    expect(feed.state.items).toEqual(snapshot);
  });
});
