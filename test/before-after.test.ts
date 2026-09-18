import { describe, expect, test } from "bun:test";
import {
  clampWipePosition,
  resolveCompareSides,
  WIPE_DEFAULT,
  WIPE_MAX,
  WIPE_MIN,
  wipePositionForKey,
  wipePositionForPointer,
} from "../src/lib/before-after";

describe("resolveCompareSides", () => {
  test("both photos present is a real compare pair", () => {
    expect(resolveCompareSides("before.jpg", "after.jpg")).toEqual({ before: "before.jpg", after: "after.jpg", hasPair: true });
  });

  test("only one side present is never a pair, whichever side it is", () => {
    expect(resolveCompareSides("before.jpg", null)).toEqual({ before: "before.jpg", after: null, hasPair: false });
    expect(resolveCompareSides(undefined, "after.jpg")).toEqual({ before: null, after: "after.jpg", hasPair: false });
  });

  test("neither side present is neither a pair nor a lone photo", () => {
    expect(resolveCompareSides(null, undefined)).toEqual({ before: null, after: null, hasPair: false });
  });

  test("treats an empty string the same as missing, never as a real src", () => {
    expect(resolveCompareSides("", "after.jpg")).toEqual({ before: null, after: "after.jpg", hasPair: false });
  });
});

describe("clampWipePosition", () => {
  test("clamps to the 0-100 range", () => {
    expect(clampWipePosition(-10)).toBe(WIPE_MIN);
    expect(clampWipePosition(150)).toBe(WIPE_MAX);
    expect(clampWipePosition(42)).toBe(42);
  });

  test("NaN reads back as the default centre, never a stuck handle", () => {
    expect(clampWipePosition(NaN)).toBe(WIPE_DEFAULT);
  });
});

describe("wipePositionForKey", () => {
  test("ArrowRight/ArrowUp nudge toward before, ArrowLeft/ArrowDown nudge toward after", () => {
    expect(wipePositionForKey(50, "ArrowRight")).toBe(55);
    expect(wipePositionForKey(50, "ArrowUp")).toBe(55);
    expect(wipePositionForKey(50, "ArrowLeft")).toBe(45);
    expect(wipePositionForKey(50, "ArrowDown")).toBe(45);
  });

  test("clamps at the edges instead of overshooting", () => {
    expect(wipePositionForKey(98, "ArrowRight")).toBe(WIPE_MAX);
    expect(wipePositionForKey(2, "ArrowLeft")).toBe(WIPE_MIN);
  });

  test("Home and End jump straight to the ends of the range", () => {
    expect(wipePositionForKey(50, "Home")).toBe(WIPE_MIN);
    expect(wipePositionForKey(50, "End")).toBe(WIPE_MAX);
  });

  test("any other key is ignored, distinguishable from a same-value move", () => {
    expect(wipePositionForKey(50, "Enter")).toBeNull();
    expect(wipePositionForKey(50, "a")).toBeNull();
  });
});

describe("wipePositionForPointer", () => {
  test("maps a clientX across the frame's rect to a 0-100 percentage", () => {
    const rect = { left: 100, width: 200 };
    expect(wipePositionForPointer(100, rect)).toBe(0);
    expect(wipePositionForPointer(300, rect)).toBe(100);
    expect(wipePositionForPointer(200, rect)).toBe(50);
  });

  test("clamps a pointer that has dragged outside the frame", () => {
    const rect = { left: 100, width: 200 };
    expect(wipePositionForPointer(0, rect)).toBe(WIPE_MIN);
    expect(wipePositionForPointer(1000, rect)).toBe(WIPE_MAX);
  });

  test("a zero-width rect (measured before layout) reads as the default centre", () => {
    expect(wipePositionForPointer(150, { left: 100, width: 0 })).toBe(WIPE_DEFAULT);
  });
});
