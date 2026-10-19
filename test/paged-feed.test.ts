import { describe, expect, test } from "bun:test";
import { PagedFeed, type PagedHass } from "../src/lib/paged-feed";

interface Item {
  uid: string;
}

interface Page {
  items: Item[];
  total: number;
  cursor: string | null;
  has_more: boolean;
}

function settle(): Promise<void> {
  // See timeline-feed.test.ts's `settle` for why a 0ms timer (not a guessed duration) is the
  // deterministic way to flush a fire-and-forget internal request before asserting on it.
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 0);
  return promise;
}

function fakeHass(pagesByCursor: Record<string, Page>) {
  const calls: Record<string, unknown>[] = [];
  const hass: PagedHass = {
    callWS: async (message) => {
      calls.push(message);
      const key = typeof message.cursor === "string" ? message.cursor : "start";
      return pagesByCursor[key] ?? { items: [], total: 0, cursor: null, has_more: false };
    },
  };
  return { hass, calls };
}

describe("PagedFeed", () => {
  test("sync loads page 0 with no cursor and reports total/hasNext/hasPrevious", async () => {
    const { hass, calls } = fakeHass({ start: { items: [{ uid: "a" }, { uid: "b" }], total: 5, cursor: "p1", has_more: true } });
    const feed = new PagedFeed<Item>("kibble/review", () => {});
    feed.sync(hass, "entry", { entry_id: "entry" }, 2);
    await settle();
    expect(calls).toEqual([{ type: "kibble/review", limit: 2, entry_id: "entry" }]);
    expect(feed.state).toMatchObject({ items: [{ uid: "a" }, { uid: "b" }], total: 5, pageIndex: 0, hasNext: true, hasPrevious: false });
  });

  test("sync with an unchanged key is a no-op", async () => {
    const { hass, calls } = fakeHass({ start: { items: [], total: 0, cursor: null, has_more: false } });
    const feed = new PagedFeed<Item>("kibble/review", () => {});
    feed.sync(hass, "entry", { entry_id: "entry" }, 24);
    feed.sync(hass, "entry", { entry_id: "entry" }, 24);
    await settle();
    expect(calls).toHaveLength(1);
  });

  test("sync with a new key (a different cat's training grid) restarts at page 0", async () => {
    const { hass, calls } = fakeHass({
      start: { items: [{ uid: "kitty-1" }], total: 1, cursor: null, has_more: false },
    });
    const feed = new PagedFeed<Item>("kibble/training", () => {});
    feed.sync(hass, "entry:Kitty", { entry_id: "entry", cat: "Kitty" }, 24);
    await settle();
    feed.sync(hass, "entry:Pancake", { entry_id: "entry", cat: "Pancake" }, 24);
    await settle();
    expect(calls).toHaveLength(2);
    expect(calls[1]).toEqual({ type: "kibble/training", limit: 24, entry_id: "entry", cat: "Pancake" });
  });

  test("next fetches using the cursor the current page returned, and previous returns to page 0 without a cursor", async () => {
    const { hass, calls } = fakeHass({
      start: { items: [{ uid: "a" }], total: 2, cursor: "p1", has_more: true },
      p1: { items: [{ uid: "b" }], total: 2, cursor: null, has_more: false },
    });
    const feed = new PagedFeed<Item>("kibble/review", () => {});
    feed.sync(hass, "entry", { entry_id: "entry" }, 1);
    await settle();
    feed.next(hass, { entry_id: "entry" }, 1);
    await settle();
    expect(feed.state).toMatchObject({ items: [{ uid: "b" }], pageIndex: 1, hasNext: false, hasPrevious: true });
    feed.previous(hass, { entry_id: "entry" }, 1);
    await settle();
    expect(calls[2]).toEqual({ type: "kibble/review", limit: 1, entry_id: "entry" });
    expect(feed.state).toMatchObject({ items: [{ uid: "a" }], pageIndex: 0, hasPrevious: false });
  });

  test("next is a no-op once there is no next page, previous is a no-op on page 0", async () => {
    const { hass, calls } = fakeHass({ start: { items: [{ uid: "a" }], total: 1, cursor: null, has_more: false } });
    const feed = new PagedFeed<Item>("kibble/review", () => {});
    feed.sync(hass, "entry", { entry_id: "entry" }, 24);
    await settle();
    feed.next(hass, { entry_id: "entry" }, 24);
    feed.previous(hass, { entry_id: "entry" }, 24);
    await settle();
    expect(calls).toHaveLength(1);
  });

  test("removeItem drops matching entries from the current page and decrements total", () => {
    const feed = new PagedFeed<Item>("kibble/review", () => {});
    feed.state = { items: [{ uid: "a" }, { uid: "b" }, { uid: "c" }], total: 10, pageIndex: 0, hasNext: true, hasPrevious: false, loading: false, error: null };
    feed.removeItem((item) => item.uid === "b" || item.uid === "c");
    expect(feed.state.items).toEqual([{ uid: "a" }]);
    expect(feed.state.total).toBe(8);
  });

  test("removeItem is a no-op when nothing matches", () => {
    const feed = new PagedFeed<Item>("kibble/review", () => {});
    const initial = { items: [{ uid: "a" }], total: 1, pageIndex: 0, hasNext: false, hasPrevious: false, loading: false, error: null };
    feed.state = initial;
    feed.removeItem((item) => item.uid === "missing");
    expect(feed.state).toBe(initial);
  });
});
