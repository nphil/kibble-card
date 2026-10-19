import { describe, expect, test } from "bun:test";
import { effectivePourSource } from "../src/lib/pour";

describe("effectivePourSource", () => {
  test("a card-initiated feed always wins, in either hopper mode", () => {
    expect(effectivePourSource("1", false)).toBe("1");
    expect(effectivePourSource("2", false)).toBe("2");
    expect(effectivePourSource("both", false)).toBe("both");
    expect(effectivePourSource("1", true)).toBe("1");
  });

  test("no card-initiated source falls back to hopper 1 alone in single mode", () => {
    expect(effectivePourSource(null, true)).toBe("1");
  });

  test("no card-initiated source falls back to both mixed in dual mode", () => {
    expect(effectivePourSource(null, false)).toBe("both");
  });
});
