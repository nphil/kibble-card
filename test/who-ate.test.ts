import { describe, expect, test } from "bun:test";
import { ateOptions, ateQuestionFor } from "../src/lib/who-ate";
import type { VisitResult } from "../src/types";

function visit(overrides: Partial<VisitResult> = {}): VisitResult {
  return { uid: "v1", kind: "eat", cats: [{ cat: "Kitty", ate: false }, { cat: "Pancake", ate: false }], needs_ate: true, ...overrides };
}

describe("ateQuestionFor", () => {
  test("asks about a two-cat meal the server says is unsettled", () => {
    expect(ateQuestionFor(visit(), 1_700_000_000, new Set())).toEqual({ visitUid: "v1", cats: ["Kitty", "Pancake"], start: 1_700_000_000 });
  });

  test("never asks when the server does not say it needs an answer", () => {
    expect(ateQuestionFor(visit({ needs_ate: false }), 1_700_000_000, new Set())).toBeNull();
  });

  test("asks about one visit only once in a sitting", () => {
    expect(ateQuestionFor(visit(), 1_700_000_000, new Set(["v1"]))).toBeNull();
  });

  test("needs two cats to choose between", () => {
    expect(ateQuestionFor(visit({ cats: [{ cat: "Kitty", ate: false }] }), 1_700_000_000, new Set())).toBeNull();
  });
});

describe("ateOptions", () => {
  test("two cats: one button each, plus Both", () => {
    expect(ateOptions(["Kitty", "Pancake"]).map((option) => [option.text, option.ate])).toEqual([
      ["Kitty", ["Kitty"]],
      ["Pancake", ["Pancake"]],
      ["Both", ["Kitty", "Pancake"]],
    ]);
  });

  test("any other number of cats has no Both button", () => {
    expect(ateOptions(["A", "B", "C"]).map((option) => option.text)).toEqual(["A", "B", "C"]);
  });
});
