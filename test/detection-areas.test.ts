import { describe, expect, test } from "bun:test";
import {
  DEFAULT_BOWL_ROI,
  HANDLE_IDS,
  clientPointToNormalized,
  handlePoint,
  isDrawableArea,
  moveArea,
  normalizedAreaFromPoints,
  normalizeWireArea,
  normalizeWireAreas,
  resizeAreaFromHandle,
  type NormalizedArea,
} from "../src/lib/detection-areas";

describe("detection-area geometry", () => {
  test("maps client coordinates to the rendered image fractions", () => {
    expect(clientPointToNormalized(300, 250, { left: 100, top: 50, width: 400, height: 200 })).toEqual({ x: 0.5, y: 1 });
  });

  test("clamps pointer coordinates at the image edges", () => {
    expect(clientPointToNormalized(20, 500, { left: 100, top: 100, width: 400, height: 200 })).toEqual({ x: 0, y: 1 });
  });

  test("canonicalizes a drag in any direction to x1,y1,x2,y2", () => {
    expect(normalizedAreaFromPoints({ x: 0.8, y: 0.7 }, { x: 0.2, y: 0.1 })).toEqual([0.2, 0.1, 0.8, 0.7]);
  });

  test("rejects degenerate drawn regions and malformed wire values", () => {
    expect(isDrawableArea([0.2, 0.2, 0.2, 0.8])).toBe(false);
    expect(normalizeWireAreas([[0, 0, 0.5, 0.5], [0, -0.1, 1, 1], [0, 0, 0, 1], [0.1, 0.1]])).toEqual([[0, 0, 0.5, 0.5]]);
  });
});

describe("handlePoint", () => {
  const area: NormalizedArea = [0.2, 0.3, 0.6, 0.9];

  test("corners sit exactly on the rectangle's own corners", () => {
    expect(handlePoint(area, "nw")).toEqual({ x: 0.2, y: 0.3 });
    expect(handlePoint(area, "se")).toEqual({ x: 0.6, y: 0.9 });
  });

  test("edge handles sit at the midpoint of their own edge", () => {
    expect(handlePoint(area, "n")).toEqual({ x: 0.4, y: 0.3 });
    expect(handlePoint(area, "e")).toEqual({ x: 0.6, y: 0.6 });
  });

  test("every declared handle id resolves to a point", () => {
    for (const handle of HANDLE_IDS) {
      const point = handlePoint(area, handle);
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
    }
  });
});

describe("resizeAreaFromHandle", () => {
  const area: NormalizedArea = [0.2, 0.2, 0.6, 0.6];
  // Normalized fractions carry ordinary float noise (0.6 - 0.05 !== 0.55 exactly); rounding to
  // 6 decimals keeps assertions about the intended geometry instead of IEEE-754 rounding.
  const rounded = (a: NormalizedArea): NormalizedArea => a.map((n) => Math.round(n * 1e6) / 1e6) as NormalizedArea;

  test("a corner handle moves both of its own edges, leaving the opposite corner fixed", () => {
    expect(resizeAreaFromHandle(area, "se", { x: 0.9, y: 0.8 })).toEqual([0.2, 0.2, 0.9, 0.8]);
  });

  test("an edge handle moves only its own axis", () => {
    expect(resizeAreaFromHandle(area, "n", { x: 0.5, y: 0.05 })).toEqual([0.2, 0.05, 0.6, 0.6]);
    expect(resizeAreaFromHandle(area, "e", { x: 0.95, y: 0.5 })).toEqual([0.2, 0.2, 0.95, 0.6]);
  });

  test("dragging a handle past the opposite edge clamps at the minimum size instead of flipping", () => {
    expect(rounded(resizeAreaFromHandle(area, "nw", { x: 0.9, y: 0.9 }, 0.05))).toEqual([0.55, 0.55, 0.6, 0.6]);
  });

  test("clamps the drag point to the unit square first", () => {
    expect(resizeAreaFromHandle(area, "se", { x: 1.4, y: -0.3 })).toEqual([0.2, 0.2, 1, 0.2 + 0.02]);
  });
});

describe("moveArea", () => {
  test("translates by dx,dy", () => {
    expect(moveArea([0.2, 0.2, 0.4, 0.3], 0.1, 0.05).map((n) => Math.round(n * 1e6) / 1e6)).toEqual([0.3, 0.25, 0.5, 0.35]);
  });

  test("stops at the frame edge instead of shrinking the box", () => {
    expect(moveArea([0.8, 0.1, 1, 0.3], 0.5, 0)).toEqual([0.8, 0.1, 1, 0.3]);
    expect(moveArea([0, 0.1, 0.2, 0.3], -0.5, 0)).toEqual([0, 0.1, 0.2, 0.3]);
  });

  test("negative nudges move toward the origin the same way", () => {
    expect(moveArea([0.4, 0.4, 0.5, 0.5], -0.1, -0.1).map((n) => Math.round(n * 1e6) / 1e6)).toEqual([0.3, 0.3, 0.4, 0.4]);
  });
});

describe("bowl roi wire parsing", () => {
  test("a valid wire rectangle is used as-is", () => {
    expect(normalizeWireArea([0.1, 0.6, 0.5, 1]) ?? DEFAULT_BOWL_ROI).toEqual([0.1, 0.6, 0.5, 1]);
  });

  test("a missing or malformed value falls back to the daemon's own default", () => {
    expect(normalizeWireArea(undefined) ?? DEFAULT_BOWL_ROI).toEqual(DEFAULT_BOWL_ROI);
    expect(normalizeWireArea([0.1, 0.1]) ?? DEFAULT_BOWL_ROI).toEqual(DEFAULT_BOWL_ROI);
  });

  test("the default is the bottom-centre third, matching vision.rs's DEFAULT_BOWL_ROI", () => {
    expect(DEFAULT_BOWL_ROI).toEqual([1 / 3, 2 / 3, 2 / 3, 1]);
  });
});
