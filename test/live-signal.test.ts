import { describe, expect, test } from "bun:test";
import { LiveSignal, type SubscribeCapableHass } from "../src/lib/live-signal";

/** Flushes the async subscribe/unsubscribe chain before assertions -- see timeline-feed.test.ts's
 * `settle` for why a 0ms timer here is deterministic, not a guessed duration. */
function settle(): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 0);
  return promise;
}

describe("LiveSignal", () => {
  test("subscribes to the given entry and calls onChanged on a push", async () => {
    let pushCallback: ((message: { changed: boolean }) => void) | undefined;
    const hass: SubscribeCapableHass = {
      connection: {
        subscribeMessage: async (callback, message) => {
          expect(message).toEqual({ type: "kibble/timeline/subscribe", entry_id: "entry-1" });
          pushCallback = callback as typeof pushCallback;
          return async () => {};
        },
      },
    };
    let changed = 0;
    const signal = new LiveSignal(() => {
      changed += 1;
    });
    signal.sync(hass, "entry-1");
    await settle();
    pushCallback?.({ changed: true });
    expect(changed).toBe(1);
  });

  test("sync with the same entry is a no-op -- never resubscribes", async () => {
    let subscribeCalls = 0;
    const hass: SubscribeCapableHass = {
      connection: {
        subscribeMessage: async () => {
          subscribeCalls += 1;
          return async () => {};
        },
      },
    };
    const signal = new LiveSignal(() => {});
    signal.sync(hass, "entry-1");
    signal.sync(hass, "entry-1");
    await settle();
    expect(subscribeCalls).toBe(1);
  });

  test("sync with a changed entry unsubscribes the old one before subscribing the new one", async () => {
    const unsubscribedFor: string[] = [];
    const hass: SubscribeCapableHass = {
      connection: {
        subscribeMessage: async (_callback, message) => {
          const entryId = message.entry_id as string;
          return async () => {
            unsubscribedFor.push(entryId);
          };
        },
      },
    };
    const signal = new LiveSignal(() => {});
    signal.sync(hass, "entry-1");
    await settle();
    signal.sync(hass, "entry-2");
    await settle();
    expect(unsubscribedFor).toEqual(["entry-1"]);
  });

  test("a push after the entry changed again is ignored -- stale subscriptions never fire onChanged", async () => {
    let firstCallback: ((message: { changed: boolean }) => void) | undefined;
    const hass: SubscribeCapableHass = {
      connection: {
        subscribeMessage: async (callback, message) => {
          if (message.entry_id === "entry-1") firstCallback = callback as typeof firstCallback;
          return async () => {};
        },
      },
    };
    let changed = 0;
    const signal = new LiveSignal(() => {
      changed += 1;
    });
    signal.sync(hass, "entry-1");
    await settle();
    signal.sync(hass, "entry-2");
    await settle();
    firstCallback?.({ changed: true });
    expect(changed).toBe(0);
  });

  test("dispose unsubscribes and a hass with no connection never throws or subscribes", async () => {
    let unsubscribed = false;
    const hass: SubscribeCapableHass = {
      connection: {
        subscribeMessage: async () => async () => {
          unsubscribed = true;
        },
      },
    };
    const signal = new LiveSignal(() => {});
    signal.sync(hass, "entry-1");
    await settle();
    signal.dispose();
    await settle();
    expect(unsubscribed).toBe(true);

    const bare = new LiveSignal(() => {});
    expect(() => bare.sync({}, "entry-1")).not.toThrow();
    await settle();
  });
});
