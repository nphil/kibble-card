import { describe, expect, test } from "bun:test";
import { LearningFeed, learningFeed } from "../src/lib/learning-feed";
import type { HomeAssistantConnection } from "../src/types";
import { FakeClock, settle } from "./helpers";

/** A stand-in for Home Assistant's socket: each failure in `failures` is used up by one attempt. */
function fakeConnection(failures: unknown[] = []) {
  const subscriptions: { message: Record<string, unknown>; push: (payload: unknown) => void; closed: boolean }[] = [];
  let attempts = 0;
  const connection: HomeAssistantConnection = {
    subscribeMessage: (callback, message) => {
      attempts++;
      if (failures.length > 0) return Promise.reject(failures.shift());
      const subscription = { message, push: callback as (payload: unknown) => void, closed: false };
      subscriptions.push(subscription);
      return Promise.resolve(async () => {
        subscription.closed = true;
      });
    },
  };
  return { connection, subscriptions, attempts: () => attempts };
}

describe("LearningFeed", () => {
  test("the first listener opens one subscription, they share it, and the last one to leave closes it", async () => {
    const { connection, subscriptions } = fakeConnection();
    const feed = new LearningFeed("entry-1", new FakeClock());
    feed.attach({ connection, connected: true });
    const first = feed.listen(() => {});
    const second = feed.listen(() => {});
    await settle();
    expect(subscriptions.map((subscription) => subscription.message)).toEqual([{ type: "kibble/learning/subscribe", entry_id: "entry-1" }]);
    first();
    await settle();
    expect(subscriptions[0]!.closed).toBe(false);
    second();
    await settle();
    expect(subscriptions[0]!.closed).toBe(true);
  });

  test("passes on each status as it arrives and ignores what it cannot read", async () => {
    const { connection, subscriptions } = fakeConnection();
    const feed = new LearningFeed("entry-1", new FakeClock());
    let heard = 0;
    feed.attach({ connection, connected: true });
    feed.listen(() => heard++);
    await settle();
    subscriptions[0]!.push({ learning: { state: "learning", pending: 3 } });
    expect(feed.status).toMatchObject({ state: "learning", pending: 3 });
    expect(heard).toBe(1);
    subscriptions[0]!.push({ learning: { state: "something new" } });
    subscriptions[0]!.push({});
    expect(feed.status).toMatchObject({ state: "learning", pending: 3 });
    expect(heard).toBe(1);
  });

  test("waits quietly for a connection, then subscribes", async () => {
    const { connection, subscriptions } = fakeConnection();
    const feed = new LearningFeed("entry-1", new FakeClock());
    feed.listen(() => {});
    await settle();
    expect(subscriptions).toHaveLength(0);
    feed.attach({ connection, connected: true });
    await settle();
    expect(subscriptions).toHaveLength(1);
  });

  test("a subscription that fails is tried again on the backoff", async () => {
    const clock = new FakeClock();
    const { connection, subscriptions, attempts } = fakeConnection([{ code: "unknown_error", message: "offline" }]);
    const feed = new LearningFeed("entry-1", clock);
    feed.attach({ connection, connected: true });
    feed.listen(() => {});
    await settle();
    expect(attempts()).toBe(1);
    clock.advance(999);
    await settle();
    expect(attempts()).toBe(1);
    clock.advance(1);
    await settle();
    expect(attempts()).toBe(2);
    expect(subscriptions).toHaveLength(1);
  });

  test("an integration too old to know the command gets no learning line and no retries", async () => {
    const clock = new FakeClock();
    const { connection, attempts } = fakeConnection([{ code: "unknown_command", message: "Unknown command." }]);
    const feed = new LearningFeed("entry-1", clock);
    feed.attach({ connection, connected: true });
    feed.listen(() => {});
    await settle();
    clock.advance(120_000);
    await settle();
    expect(feed.status).toBeNull();
    expect(attempts()).toBe(1);
    expect(clock.waiting).toBe(0);
  });

  test("a new connection closes the old subscription and starts over on the new one", async () => {
    const old = fakeConnection();
    const fresh = fakeConnection();
    const feed = new LearningFeed("entry-1", new FakeClock());
    feed.attach({ connection: old.connection, connected: true });
    feed.listen(() => {});
    await settle();
    old.subscriptions[0]!.push({ learning: { state: "waiting", pending: 1 } });
    feed.attach({ connection: fresh.connection, connected: true });
    await settle();
    expect(old.subscriptions[0]!.closed).toBe(true);
    expect(fresh.subscriptions).toHaveLength(1);
    expect(feed.status).toBeNull();
  });

  test("there is one feed per entry", () => {
    expect(learningFeed("entry-feed-a")).toBe(learningFeed("entry-feed-a"));
    expect(learningFeed("entry-feed-a")).not.toBe(learningFeed("entry-feed-b"));
  });
});
