import { describe, expect, test } from "bun:test";
import { defaultSquareCrop, moveSquareCrop, pinchDistance, resizeSquareCrop, scaleSquareCrop, type ImageSize } from "../src/lib/photo-crop";
import type { NormalizedArea } from "../src/lib/detection-areas";

describe("defaultSquareCrop", () => {
  test("a square photo crops to the whole frame", () => {
    expect(defaultSquareCrop({ width: 800, height: 800 })).toEqual([0, 0, 1, 1]);
  });

  test("a landscape photo centers a square on the wide axis", () => {
    expect(defaultSquareCrop({ width: 1600, height: 800 })).toEqual([0.25, 0, 0.75, 1]);
  });

  test("a portrait photo centers a square on the tall axis", () => {
    expect(defaultSquareCrop({ width: 800, height: 1600 })).toEqual([0, 0.25, 1, 0.75]);
  });

  test("degenerate sizes fall back to the whole frame instead of dividing by zero", () => {
    expect(defaultSquareCrop({ width: 0, height: 0 })).toEqual([0, 0, 1, 1]);
    expect(defaultSquareCrop({ width: Number.NaN, height: 400 })).toEqual([0, 0, 1, 1]);
  });
});

describe("resizeSquareCrop", () => {
  const size: ImageSize = { width: 1000, height: 500 };

  test("dragging a corner keeps the crop square in physical pixels, anchored on the opposite corner", () => {
    const start = defaultSquareCrop(size); // [0.25, 0, 0.75, 1] -- 500x500 physical
    const next = resizeSquareCrop(start, "se", { x: 0.6, y: 0.9 }, size);
    const physicalWidth = (next[2] - next[0]) * size.width;
    const physicalHeight = (next[3] - next[1]) * size.height;
    expect(physicalWidth).toBeCloseTo(physicalHeight, 5);
    expect(next[0]).toBe(start[0]);
    expect(next[1]).toBe(start[1]);
  });

  test("dragging the nw corner anchors on the bottom-right instead", () => {
    const start: NormalizedArea = [0.3, 0.2, 0.7, 0.6];
    const next = resizeSquareCrop(start, "nw", { x: 0.1, y: 0.1 }, size);
    expect(next[2]).toBe(start[2]);
    expect(next[3]).toBe(start[3]);
  });

  test("never grows past the image bounds", () => {
    const start: NormalizedArea = [0.4, 0.4, 0.6, 0.9];
    const next = resizeSquareCrop(start, "se", { x: 5, y: 5 }, size);
    expect(next[2]).toBeLessThanOrEqual(1);
    expect(next[3]).toBeLessThanOrEqual(1);
  });

  test("never shrinks under the minimum fraction of the shorter side", () => {
    const start: NormalizedArea = [0.4, 0.4, 0.6, 0.9];
    const next = resizeSquareCrop(start, "se", { x: 0.4001, y: 0.4001 }, size, 0.1);
    const physicalWidth = (next[2] - next[0]) * size.width;
    expect(physicalWidth).toBeCloseTo(0.1 * Math.min(size.width, size.height), 5);
  });
});

describe("moveSquareCrop", () => {
  test("translates without changing size", () => {
    const crop: NormalizedArea = [0.25, 0, 0.75, 1];
    const next = moveSquareCrop(crop, 0.1, 0);
    expect(next[2] - next[0]).toBeCloseTo(crop[2] - crop[0], 10);
    expect(next[3] - next[1]).toBeCloseTo(crop[3] - crop[1], 10);
  });

  test("stops at the frame edge instead of shrinking", () => {
    const crop: NormalizedArea = [0.25, 0, 0.75, 1];
    const next = moveSquareCrop(crop, 10, 0);
    expect(next[2]).toBeLessThanOrEqual(1);
    expect(next[2] - next[0]).toBeCloseTo(0.5, 10);
  });
});

describe("scaleSquareCrop", () => {
  const size: ImageSize = { width: 1000, height: 1000 };

  test("grows the crop around its own center", () => {
    const crop: NormalizedArea = [0.4, 0.4, 0.6, 0.6];
    const next = scaleSquareCrop(crop, 2, size);
    expect((next[0] + next[2]) / 2).toBeCloseTo(0.5, 10);
    expect((next[1] + next[3]) / 2).toBeCloseTo(0.5, 10);
    expect((next[2] - next[0]) * size.width).toBeCloseTo(400, 5);
  });

  test("shrinks around its own center", () => {
    const crop: NormalizedArea = [0.3, 0.3, 0.7, 0.7]; // 400px
    const next = scaleSquareCrop(crop, 0.5, size);
    expect((next[2] - next[0]) * size.width).toBeCloseTo(200, 5);
  });

  test("never exceeds the image's shorter side", () => {
    const crop: NormalizedArea = [0.4, 0.4, 0.6, 0.6];
    const next = scaleSquareCrop(crop, 100, size);
    expect((next[2] - next[0]) * size.width).toBeLessThanOrEqual(size.width + 1e-6);
  });

  test("slides inside the frame instead of resizing further when centered near an edge", () => {
    const crop: NormalizedArea = [0, 0.4, 0.2, 0.6]; // 200px, flush against the left edge
    const next = scaleSquareCrop(crop, 3, size); // wants 600px, which still fits the frame
    expect((next[2] - next[0]) * size.width).toBeCloseTo(600, 5);
    expect(next[0]).toBeGreaterThanOrEqual(0);
  });

  test("ignores a non-finite or non-positive factor", () => {
    const crop: NormalizedArea = [0.4, 0.4, 0.6, 0.6];
    expect(scaleSquareCrop(crop, 0, size)).toEqual(crop);
    expect(scaleSquareCrop(crop, Number.NaN, size)).toEqual(crop);
  });
});

describe("pinchDistance", () => {
  test("measures straight-line distance between two points", () => {
    expect(pinchDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});
