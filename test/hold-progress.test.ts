import { describe, expect, test } from "bun:test";
import {
  DEFAULT_HOLD_CONFIG,
  HOLD_IDLE,
  holdMarkStagesFired,
  holdNearComplete,
  holdNewlyCrossedStages,
  holdPress,
  holdProgress,
  holdRelease,
  holdTick,
  type HoldConfig,
} from "../src/lib/hold-progress";

const CONFIG: HoldConfig = { durationMs: 1000, stageThresholds: [0.25, 0.5, 0.75], nearCompleteAt: 0.85, drainMs: 200 };

describe("holdPress / holdTick charging", () => {
  test("starts at zero progress", () => {
    const state = holdPress();
    expect(state.phase).toBe("charging");
    expect(holdProgress(state, CONFIG)).toBe(0);
  });

  test("progress rises linearly with elapsed time", () => {
    const state = holdTick(holdPress(), 250, CONFIG);
    expect(state.phase).toBe("charging");
    expect(holdProgress(state, CONFIG)).toBeCloseTo(0.25);
  });

  test("multiple small ticks accumulate the same as one big tick", () => {
    let accumulated = holdPress();
    for (let i = 0; i < 10; i += 1) accumulated = holdTick(accumulated, 75, CONFIG);
    const jumped = holdTick(holdPress(), 750, CONFIG);
    expect(holdProgress(accumulated, CONFIG)).toBeCloseTo(holdProgress(jumped, CONFIG));
  });

  test("reaching the full duration settles into completed, clamped, not overshot", () => {
    const state = holdTick(holdPress(), 1000, CONFIG);
    expect(state.phase).toBe("completed");
    expect(holdProgress(state, CONFIG)).toBe(1);
  });

  test("a tick well past the duration still lands exactly on completed", () => {
    const state = holdTick(holdPress(), 5000, CONFIG);
    expect(state.phase).toBe("completed");
    expect(state.elapsedMs).toBe(CONFIG.durationMs);
  });

  test("completed is a resting state -- further ticks are a no-op", () => {
    const completed = holdTick(holdPress(), 1000, CONFIG);
    const again = holdTick(completed, 500, CONFIG);
    expect(again).toEqual(completed);
  });
});

describe("stage thresholds", () => {
  test("no stage has fired before the first threshold", () => {
    const state = holdTick(holdPress(), 100, CONFIG);
    expect(holdNewlyCrossedStages(state, CONFIG)).toEqual([]);
  });

  test("crosses stage 0 the instant progress reaches 25%, exactly once", () => {
    let state = holdTick(holdPress(), 250, CONFIG);
    expect(holdNewlyCrossedStages(state, CONFIG)).toEqual([0]);
    state = holdMarkStagesFired(state, [0]);
    // Ticking forward without crossing another threshold fires nothing new.
    state = holdTick(state, 10, CONFIG);
    expect(holdNewlyCrossedStages(state, CONFIG)).toEqual([]);
  });

  test("a slow frame that jumps past two thresholds at once reports both, in order", () => {
    const state = holdTick(holdPress(), 600, CONFIG); // past both 25% and 50%
    expect(holdNewlyCrossedStages(state, CONFIG)).toEqual([0, 1]);
  });

  test("marking fired stages prevents them from re-firing; later ticks report only what's still new", () => {
    let state = holdTick(holdPress(), 260, CONFIG); // past stage 0 (25%) only
    state = holdMarkStagesFired(state, holdNewlyCrossedStages(state, CONFIG));
    state = holdTick(state, 500, CONFIG); // now at 76%: stages 1 and 2 are both newly crossed
    expect(holdNewlyCrossedStages(state, CONFIG)).toEqual([1, 2]);
  });

  test("walking the whole charge in small steps fires each stage exactly once, in order", () => {
    let state = holdPress();
    const firedOrder: number[] = [];
    for (let i = 0; i < 100; i += 1) {
      state = holdTick(state, 10, CONFIG);
      const crossed = holdNewlyCrossedStages(state, CONFIG);
      firedOrder.push(...crossed);
      state = holdMarkStagesFired(state, crossed);
    }
    expect(firedOrder).toEqual([0, 1, 2]);
  });
});

describe("near-completion tension zone", () => {
  test("not near complete below the threshold", () => {
    const state = holdTick(holdPress(), 800, CONFIG);
    expect(holdNearComplete(state, CONFIG)).toBe(false);
  });

  test("near complete once progress reaches the threshold", () => {
    const state = holdTick(holdPress(), 850, CONFIG);
    expect(holdNearComplete(state, CONFIG)).toBe(true);
  });

  test("never near complete outside charging -- nothing left to build tension toward", () => {
    expect(holdNearComplete(HOLD_IDLE, CONFIG)).toBe(false);
    const completed = holdTick(holdPress(), 1000, CONFIG);
    expect(holdNearComplete(completed, CONFIG)).toBe(false);
    const draining = holdRelease(holdTick(holdPress(), 900, CONFIG), CONFIG);
    expect(holdNearComplete(draining, CONFIG)).toBe(false);
  });
});

describe("cancel drains without firing", () => {
  test("releasing mid-charge moves to draining, never completed", () => {
    const charging = holdTick(holdPress(), 400, CONFIG);
    const released = holdRelease(charging, CONFIG);
    expect(released.phase).toBe("draining");
  });

  test("the drain starts from wherever the charge had reached, not from full", () => {
    const charging = holdTick(holdPress(), 400, CONFIG); // 40%
    const released = holdRelease(charging, CONFIG);
    expect(holdProgress(released, CONFIG)).toBeCloseTo(0.4);
  });

  test("progress counts smoothly back down to zero over drainMs, never snapping instantly", () => {
    const released = holdRelease(holdTick(holdPress(), 400, CONFIG), CONFIG);
    const halfDrained = holdTick(released, CONFIG.drainMs / 2, CONFIG);
    expect(holdProgress(halfDrained, CONFIG)).toBeGreaterThan(0);
    expect(holdProgress(halfDrained, CONFIG)).toBeLessThan(0.4);
  });

  test("a full drain settles at idle with zero progress", () => {
    const released = holdRelease(holdTick(holdPress(), 400, CONFIG), CONFIG);
    const drained = holdTick(released, CONFIG.drainMs, CONFIG);
    expect(drained).toEqual(HOLD_IDLE);
    expect(holdProgress(drained, CONFIG)).toBe(0);
  });

  test("a cancelled hold never reaches completed no matter how long it drains for", () => {
    const released = holdRelease(holdTick(holdPress(), 900, CONFIG), CONFIG);
    const overDrained = holdTick(released, 100_000, CONFIG);
    expect(overDrained.phase).not.toBe("completed");
    expect(overDrained).toEqual(HOLD_IDLE);
  });

  test("releasing while already idle or completed is a no-op", () => {
    expect(holdRelease(HOLD_IDLE, CONFIG)).toEqual(HOLD_IDLE);
    const completed = holdTick(holdPress(), 1000, CONFIG);
    expect(holdRelease(completed, CONFIG)).toEqual(completed);
  });
});

describe("completion fires exactly once", () => {
  test("the phase transitions into completed on exactly one tick across a full walk", () => {
    let state = holdPress();
    let completions = 0;
    let previousPhase = state.phase;
    for (let i = 0; i < 200; i += 1) {
      state = holdTick(state, 10, CONFIG);
      if (previousPhase !== "completed" && state.phase === "completed") completions += 1;
      previousPhase = state.phase;
    }
    expect(completions).toBe(1);
  });

  test("a single huge tick also completes exactly once, not once per elapsed duration", () => {
    const state = holdTick(holdPress(), 10_000, CONFIG);
    expect(state.phase).toBe("completed");
    // Re-ticking (simulating a driver that keeps calling after completion) must not re-enter.
    const again = holdTick(state, 10_000, CONFIG);
    expect(again.phase).toBe("completed");
    expect(again).toEqual(state);
  });
});

describe("DEFAULT_HOLD_CONFIG", () => {
  test("duration stays within the 1.2-1.5s design window", () => {
    expect(DEFAULT_HOLD_CONFIG.durationMs).toBeGreaterThanOrEqual(1200);
    expect(DEFAULT_HOLD_CONFIG.durationMs).toBeLessThanOrEqual(1500);
  });

  test("exactly three stage thresholds, ascending, before the near-complete zone", () => {
    expect(DEFAULT_HOLD_CONFIG.stageThresholds).toHaveLength(3);
    const sorted = [...DEFAULT_HOLD_CONFIG.stageThresholds].sort((a, b) => a - b);
    expect(DEFAULT_HOLD_CONFIG.stageThresholds).toEqual(sorted);
    expect(DEFAULT_HOLD_CONFIG.stageThresholds[2]).toBeLessThan(DEFAULT_HOLD_CONFIG.nearCompleteAt);
  });
});
