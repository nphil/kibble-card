import { describe, expect, test } from "bun:test";
import { isSidewaysDrag, keyCommand, swipeCommit, swipeCommitDistance, swipeOptionId, swipeProgress } from "../src/lib/review-input";
import { reviewOptions } from "../src/lib/review-queue";

const options = reviewOptions([{ name: "Kitty" }, { name: "Pancake" }]);

describe("keyCommand", () => {
  test("number keys pick the option with that number", () => {
    expect(keyCommand({ key: "1" }, options)).toEqual({ type: "answer", optionId: "cat:Kitty" });
    expect(keyCommand({ key: "3" }, options)).toEqual({ type: "answer", optionId: "several" });
    expect(keyCommand({ key: "5" }, options)).toEqual({ type: "answer", optionId: "unknown" });
    expect(keyCommand({ key: "6" }, options)).toBeNull();
  });

  test("Z, U, Backspace and Ctrl+Z undo", () => {
    for (const key of ["z", "Z", "u", "Backspace"]) expect(keyCommand({ key }, options)).toEqual({ type: "undo" });
    expect(keyCommand({ key: "z", ctrlKey: true }, options)).toEqual({ type: "undo" });
    expect(keyCommand({ key: "z", metaKey: true }, options)).toEqual({ type: "undo" });
  });

  test("arrows browse photos, S and up/down flip to the whole scene", () => {
    expect(keyCommand({ key: "ArrowLeft" }, options)).toEqual({ type: "photo", delta: -1 });
    expect(keyCommand({ key: "ArrowRight" }, options)).toEqual({ type: "photo", delta: 1 });
    expect(keyCommand({ key: "s" }, options)).toEqual({ type: "scene" });
    expect(keyCommand({ key: "ArrowUp" }, options)).toEqual({ type: "scene" });
  });

  test("a held key never answers or undoes, but still browses photos", () => {
    expect(keyCommand({ key: "1", repeat: true }, options)).toBeNull();
    expect(keyCommand({ key: "z", repeat: true }, options)).toBeNull();
    expect(keyCommand({ key: "z", ctrlKey: true, repeat: true }, options)).toBeNull();
    expect(keyCommand({ key: "ArrowRight", repeat: true }, options)).toEqual({ type: "photo", delta: 1 });
  });

  test("browser shortcuts and unrelated keys are left alone", () => {
    expect(keyCommand({ key: "1", ctrlKey: true }, options)).toBeNull();
    expect(keyCommand({ key: "1", altKey: true }, options)).toBeNull();
    expect(keyCommand({ key: "Tab" }, options)).toBeNull();
    expect(keyCommand({ key: "Enter" }, options)).toBeNull();
  });
});

describe("swipes", () => {
  test("a drag is undecided until it has moved, then sideways or a scroll", () => {
    expect(isSidewaysDrag(4, 3)).toBeNull();
    expect(isSidewaysDrag(30, 5)).toBe(true);
    expect(isSidewaysDrag(-30, 5)).toBe(true);
    expect(isSidewaysDrag(8, 30)).toBe(false);
    expect(isSidewaysDrag(20, 20)).toBe(false);
  });

  test("commit distance is a quarter of the card, within thumb-sized limits", () => {
    expect(swipeCommitDistance(360)).toBe(90);
    expect(swipeCommitDistance(120)).toBe(64);
    expect(swipeCommitDistance(1200)).toBe(140);
  });

  test("progress reaches 1 exactly at the commit distance", () => {
    expect(swipeProgress(0, 360)).toEqual({ side: null, progress: 0 });
    expect(swipeProgress(-45, 360)).toEqual({ side: "left", progress: 0.5 });
    expect(swipeProgress(200, 360)).toEqual({ side: "right", progress: 1 });
  });

  test("letting go commits past the distance or on a quick flick the same way", () => {
    expect(swipeCommit(-95, 0, 360)).toBe("left");
    expect(swipeCommit(95, 0, 360)).toBe("right");
    expect(swipeCommit(40, 0.1, 360)).toBeNull();
    expect(swipeCommit(40, 0.8, 360)).toBe("right");
    expect(swipeCommit(40, -0.8, 360)).toBeNull();
    expect(swipeCommit(10, 0.9, 360)).toBeNull();
  });

  test("swiping names a cat only when there are exactly two", () => {
    expect(swipeOptionId("left", options)).toBe("cat:Kitty");
    expect(swipeOptionId("right", options)).toBe("cat:Pancake");
    expect(swipeOptionId("left", reviewOptions([{ name: "Kitty" }]))).toBeNull();
    expect(swipeOptionId("right", reviewOptions([{ name: "A" }, { name: "B" }, { name: "C" }]))).toBeNull();
  });
});
