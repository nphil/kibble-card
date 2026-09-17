import { describe, expect, test } from "bun:test";
import { RECONNECT_BASE_MS, RECONNECT_MAX_MS, nextReconnectDelay } from "../src/lib/reconnect";

describe("nextReconnectDelay", () => {
  test("doubles the base delay for the second attempt", () => {
    expect(nextReconnectDelay(RECONNECT_BASE_MS)).toBe(2000);
  });

  test("keeps doubling across the full schedule up to the cap", () => {
    let delay = RECONNECT_BASE_MS;
    const schedule = [delay];
    for (let i = 0; i < 5; i++) {
      delay = nextReconnectDelay(delay);
      schedule.push(delay);
    }

    expect(schedule).toEqual([1000, 2000, 4000, 8000, 16000, 30000]);
  });

  test("never exceeds the cap once reached", () => {
    expect(nextReconnectDelay(RECONNECT_MAX_MS)).toBe(RECONNECT_MAX_MS);
  });

  test("never exceeds the cap even from a delay already past it", () => {
    expect(nextReconnectDelay(RECONNECT_MAX_MS * 3)).toBe(RECONNECT_MAX_MS);
  });
});
