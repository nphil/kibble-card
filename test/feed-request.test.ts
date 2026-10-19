import { describe, expect, test } from "bun:test";
import {
  DEFAULT_FEED_REQUEST_CONFIG,
  FEED_REQUEST_IDLE,
  feedRequestFeedingChanged,
  feedRequestReset,
  feedRequestSubmitted,
  feedRequestTick,
  type FeedRequestConfig,
} from "../src/lib/feed-request";

const CONFIG: FeedRequestConfig = { timeoutMs: 1000 };

describe("feedRequestSubmitted", () => {
  test("starts a wait at zero elapsed, from idle", () => {
    expect(feedRequestSubmitted()).toEqual({ phase: "requesting", elapsedMs: 0 });
  });

  test("restarts the wait even from a stale timeout or a still-feeding state", () => {
    const stale = feedRequestTick(feedRequestSubmitted(), 1000, CONFIG);
    expect(stale.phase).toBe("timeout");
    expect(feedRequestSubmitted()).toEqual({ phase: "requesting", elapsedMs: 0 });
    expect(feedRequestFeedingChanged(feedRequestSubmitted(), true)).toEqual({ phase: "feeding", elapsedMs: 0 });
  });
});

describe("feedRequestTick", () => {
  test("accumulates elapsed time while requesting, under the timeout", () => {
    const state = feedRequestTick(feedRequestSubmitted(), 400, CONFIG);
    expect(state).toEqual({ phase: "requesting", elapsedMs: 400 });
  });

  test("multiple small ticks accumulate the same as one big tick", () => {
    let stepped = feedRequestSubmitted();
    for (let i = 0; i < 4; i += 1) stepped = feedRequestTick(stepped, 100, CONFIG);
    expect(stepped).toEqual(feedRequestTick(feedRequestSubmitted(), 400, CONFIG));
  });

  test("reaching the timeout settles into timeout, clamped, not overshot", () => {
    expect(feedRequestTick(feedRequestSubmitted(), 1000, CONFIG)).toEqual({ phase: "timeout", elapsedMs: 1000 });
  });

  test("a tick well past the timeout still lands exactly on the clamped value", () => {
    expect(feedRequestTick(feedRequestSubmitted(), 5000, CONFIG)).toEqual({ phase: "timeout", elapsedMs: 1000 });
  });

  test("is a no-op outside requesting -- idle, feeding, and timeout do not advance on a clock", () => {
    expect(feedRequestTick(FEED_REQUEST_IDLE, 500, CONFIG)).toBe(FEED_REQUEST_IDLE);
    const feeding = feedRequestFeedingChanged(feedRequestSubmitted(), true);
    expect(feedRequestTick(feeding, 500, CONFIG)).toBe(feeding);
    const timedOut = feedRequestTick(feedRequestSubmitted(), 1000, CONFIG);
    expect(feedRequestTick(timedOut, 500, CONFIG)).toBe(timedOut);
  });
});

describe("feedRequestFeedingChanged", () => {
  test("the entity turning on lands on feeding from requesting -- the expected path", () => {
    const requesting = feedRequestTick(feedRequestSubmitted(), 300, CONFIG);
    expect(feedRequestFeedingChanged(requesting, true)).toEqual({ phase: "feeding", elapsedMs: 0 });
  });

  test("the entity turning on lands on feeding even from idle or timeout -- a scheduled feed, a physical-button feed, or one fired from another dashboard never passed through requesting", () => {
    expect(feedRequestFeedingChanged(FEED_REQUEST_IDLE, true)).toEqual({ phase: "feeding", elapsedMs: 0 });
    const timedOut = feedRequestTick(feedRequestSubmitted(), 1000, CONFIG);
    expect(feedRequestFeedingChanged(timedOut, true)).toEqual({ phase: "feeding", elapsedMs: 0 });
  });

  test("the entity turning off from feeding returns to idle", () => {
    const feeding = feedRequestFeedingChanged(feedRequestSubmitted(), true);
    expect(feedRequestFeedingChanged(feeding, false)).toBe(FEED_REQUEST_IDLE);
  });

  test("the entity turning off is a no-op from every phase but feeding", () => {
    expect(feedRequestFeedingChanged(FEED_REQUEST_IDLE, false)).toBe(FEED_REQUEST_IDLE);
    const requesting = feedRequestSubmitted();
    expect(feedRequestFeedingChanged(requesting, false)).toBe(requesting);
    const timedOut = feedRequestTick(feedRequestSubmitted(), 1000, CONFIG);
    expect(feedRequestFeedingChanged(timedOut, false)).toBe(timedOut);
  });
});

describe("feedRequestReset", () => {
  test("always returns to idle", () => {
    expect(feedRequestReset()).toBe(FEED_REQUEST_IDLE);
  });
});

describe("full lifecycle", () => {
  test("submit -> tick under timeout -> feeding confirms -> feeding clears -> idle", () => {
    let state = feedRequestSubmitted();
    state = feedRequestTick(state, 800, CONFIG);
    expect(state.phase).toBe("requesting");
    state = feedRequestFeedingChanged(state, true);
    expect(state.phase).toBe("feeding");
    state = feedRequestFeedingChanged(state, false);
    expect(state).toBe(FEED_REQUEST_IDLE);
  });

  test("submit -> never confirmed -> timeout -> explicit reset", () => {
    let state = feedRequestSubmitted();
    state = feedRequestTick(state, CONFIG.timeoutMs, CONFIG);
    expect(state.phase).toBe("timeout");
    state = feedRequestReset();
    expect(state).toBe(FEED_REQUEST_IDLE);
  });
});

describe("DEFAULT_FEED_REQUEST_CONFIG", () => {
  test("waits about ten seconds before giving up", () => {
    expect(DEFAULT_FEED_REQUEST_CONFIG.timeoutMs).toBe(10_000);
  });
});
