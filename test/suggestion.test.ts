import { describe, expect, test } from "bun:test";
import { chooseSuggestion } from "../src/lib/suggestion";

const ROSTER = new Set(["Pancake", "Kitty"]);

describe("chooseSuggestion", () => {
  test("prefers the classifier's guess once it clears the confidence bar", () => {
    const crop = { guess: { cat: "Pancake", score: 0.83 }, vendor_cat: "Kitty" };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toEqual({ cat: "Pancake", source: "classifier" });
  });

  test("treats a guess exactly at the threshold as confident", () => {
    const crop = { guess: { cat: "Pancake", score: 0.7 }, vendor_cat: null };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toEqual({ cat: "Pancake", source: "classifier" });
  });

  test("falls back to the vendor identification when the guess misses the bar", () => {
    const crop = { guess: { cat: "Pancake", score: 0.4 }, vendor_cat: "Kitty" };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toEqual({ cat: "Kitty", source: "vendor" });
  });

  test("falls back to the vendor identification when there is no guess at all", () => {
    const crop = { guess: null, vendor_cat: "Kitty" };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toEqual({ cat: "Kitty", source: "vendor" });
  });

  test("offers nothing when neither the guess nor a vendor match exist", () => {
    const crop = { guess: null, vendor_cat: null };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toBeNull();
  });

  test("offers nothing when the guess misses and there is no vendor match either", () => {
    const crop = { guess: { cat: "Pancake", score: 0.1 }, vendor_cat: null };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toBeNull();
  });

  test("falls through to the vendor identification when a confident guess names a deleted cat", () => {
    const crop = { guess: { cat: "Ghost", score: 0.95 }, vendor_cat: "Kitty" };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toEqual({ cat: "Kitty", source: "vendor" });
  });

  test("offers nothing when both the guess and the vendor identification name deleted cats", () => {
    const crop = { guess: { cat: "Ghost", score: 0.95 }, vendor_cat: "AlsoGone" };

    expect(chooseSuggestion(crop, 0.7, ROSTER)).toBeNull();
  });
});
