import { describe, expect, test } from "bun:test";
import { fallbackCatColor } from "../src/lib/cat-colors";
import { CAT_PALETTE, catColorAt } from "../src/styles/tokens";

describe("catColorAt", () => {
  test("indexes straight into the palette", () => {
    expect(catColorAt(0)).toBe(CAT_PALETTE[0]);
    expect(catColorAt(3)).toBe(CAT_PALETTE[3]);
  });

  test("wraps around once the index exceeds the palette", () => {
    expect(catColorAt(4)).toBe(CAT_PALETTE[0]);
    expect(catColorAt(5)).toBe(CAT_PALETTE[1]);
  });

  test("wraps negative indices into range rather than returning undefined", () => {
    expect(catColorAt(-1)).toBe(CAT_PALETTE[CAT_PALETTE.length - 1]);
  });
});

describe("fallbackCatColor", () => {
  test("is deterministic for the same name", () => {
    expect(fallbackCatColor("Pancake")).toBe(fallbackCatColor("Pancake"));
  });

  test("always returns a color from the real palette", () => {
    expect(CAT_PALETTE as readonly string[]).toContain(fallbackCatColor("Whiskers"));
  });

  test("distinguishes at least some different names", () => {
    const colors = new Set(["Pancake", "Kitty", "Mochi", "Biscuit", "Mittens"].map(fallbackCatColor));
    expect(colors.size).toBeGreaterThan(1);
  });
});
