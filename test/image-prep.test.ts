import { describe, expect, test } from "bun:test";
import { targetDimensions } from "../src/lib/image-prep";

describe("targetDimensions", () => {
  test("leaves an image already under the cap untouched", () => {
    expect(targetDimensions(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });

  test("leaves an image exactly at the cap untouched", () => {
    expect(targetDimensions(1600, 900, 1600)).toEqual({ width: 1600, height: 900 });
  });

  test("downscales a landscape photo so the longer edge hits the cap", () => {
    // 4000x3000, cap 1600: scale 0.4 -> 1600x1200.
    expect(targetDimensions(4000, 3000, 1600)).toEqual({ width: 1600, height: 1200 });
  });

  test("downscales a portrait photo the same way, on the tall axis", () => {
    expect(targetDimensions(3000, 4000, 1600)).toEqual({ width: 1200, height: 1600 });
  });

  test("never enlarges a small image", () => {
    expect(targetDimensions(200, 150, 1600)).toEqual({ width: 200, height: 150 });
  });

  test("uses its own default cap when none is given", () => {
    const result = targetDimensions(5000, 5000);
    expect(Math.max(result.width, result.height)).toBe(1600);
  });

  test("rounds to whole pixels and never collapses a thin edge to zero", () => {
    // 4001x1, cap 1600: the short edge scales to ~0.4px, which must floor at 1, not 0.
    const result = targetDimensions(4001, 1, 1600);
    expect(result.width).toBe(1600);
    expect(result.height).toBeGreaterThanOrEqual(1);
  });

  test("treats a non-positive edge as already within the cap", () => {
    expect(targetDimensions(0, 0, 1600)).toEqual({ width: 0, height: 0 });
  });
});
