import { describe, expect, test } from "bun:test";
import { reconcileSamplesForEventLabel } from "../src/lib/sample-caption";

function fakeSample(overrides: Partial<{ review: string | null; label: string | null }> = {}) {
  return {
    uid: "e1-s1", t: 0, body: null, face: null,
    guess: null, guess_confidence: null,
    review: overrides.review ?? null, label: overrides.label ?? null,
    sid: null, box: null, crop: null, peers: [], cat: null,
  };
}

describe("reconcileSamplesForEventLabel", () => {
  test("a sample with no override follows the new event label", () => {
    const samples = [fakeSample({ review: null, label: null })];
    expect(reconcileSamplesForEventLabel(samples, "Kitty")).toEqual([{ ...samples[0], label: "Kitty" }]);
  });

  test("a skipped sample stays skipped regardless of the new label", () => {
    const samples = [fakeSample({ review: "skip", label: "skip" })];
    const result = reconcileSamplesForEventLabel(samples, "Kitty");
    expect(result).toEqual(samples);
    expect(result).toBe(samples); // no change -- same reference
  });

  test("a per-photo override is left exactly alone, even for a different cat", () => {
    const samples = [fakeSample({ review: "Pancake", label: "Pancake" })];
    const result = reconcileSamplesForEventLabel(samples, "Kitty");
    expect(result).toEqual(samples);
    expect(result).toBe(samples);
  });

  test("unknown (Can't tell) never touches any sample's label", () => {
    const samples = [fakeSample({ review: null, label: "Kitty" })];
    const result = reconcileSamplesForEventLabel(samples, "unknown");
    expect(result).toBe(samples);
  });

  test("mixed follow and override samples: only the follower moves", () => {
    const follower = fakeSample({ review: null, label: null });
    const override = { ...fakeSample({ review: "not_a_cat", label: "not_a_cat" }), uid: "e1-s2" };
    const [followerResult, overrideResult] = reconcileSamplesForEventLabel([follower, override], "Kitty");
    expect(followerResult).toEqual({ ...follower, label: "Kitty" });
    expect(overrideResult).toBe(override);
  });
});
