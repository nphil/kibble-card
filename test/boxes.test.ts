import { describe, expect, test } from "bun:test";
import { boxInCrop, boxRect, placeLabels } from "../src/lib/boxes";
import type { Box } from "../src/types";

describe("boxRect", () => {
  test("converts the box edges and spans to rounded CSS percentages", () => {
    expect(boxRect([0.0875, 0, 0.6586, 0.5014])).toEqual({ left: "8.75%", top: "0%", width: "57.11%", height: "50.14%" });
  });

  test("does not leak float noise from thirds", () => {
    expect(boxRect([1 / 3, 0, 2 / 3, 1]).width).toBe("33.33%");
  });
});

describe("boxInCrop", () => {
  test("maps a box inside the crop to crop-relative fractions", () => {
    const actual = boxInCrop([0.3, 0.25, 0.5, 0.65], [0.2, 0.1, 0.6, 0.7]);
    expect(actual).not.toBeNull();
    expect(actual?.[0]).toBeCloseTo(0.25);
    expect(actual?.[1]).toBeCloseTo(0.25);
    expect(actual?.[2]).toBeCloseTo(0.75);
    expect(actual?.[3]).toBeCloseTo(0.9166667);
  });

  test("clips a partially overlapping box to the crop boundaries", () => {
    const actual = boxInCrop([0.1, 0.2, 0.5, 0.8], [0.2, 0.3, 0.4, 0.7]);
    expect(actual).toEqual([0, 0, 1, 1]);
  });

  test("returns null when a box is fully outside the crop", () => {
    expect(boxInCrop([0.7, 0.1, 0.9, 0.4], [0.1, 0.2, 0.6, 0.8])).toBeNull();
  });

  test("stretches crop coordinates independently on each axis", () => {
    const actual = boxInCrop([0.3, 0.3, 0.7, 0.5], [0.1, 0.2, 0.9, 0.6]);
    expect(actual).not.toBeNull();
    for (const [index, expected] of [0.25, 0.25, 0.75, 0.75].entries()) expect(actual?.[index]).toBeCloseTo(expected);
  });
});

describe("placeLabels", () => {
  test("flips a pill inside the box when there is no room above", () => {
    const placement = placeLabels([{ key: "cat", box: [0.2, 0, 0.6, 0.7], width: 72 }], 300, 180)[0]!;
    expect(placement.flipped).toBe(true);
    expect(placement.top).toBe(4);
  });

  test("flips labels that would enter the live hero chrome band", () => {
    const placement = placeLabels([{ key: "cat", box: [0.2, 0.45, 0.6, 0.8], width: 72 }], 300, 180, 4, 64)[0]!;
    expect(placement.flipped).toBe(true);
    expect(placement.top).toBe(85);
  });

  test("keeps a flipped label inside the box below the chrome band", () => {
    const placement = placeLabels([{ key: "cat", box: [0.2, 0.22, 0.6, 0.8], width: 72 }], 300, 180, 4, 64)[0]!;
    expect(placement.flipped).toBe(true);
    expect(placement.top).toBe(64);
  });

  test("nudges two pills on nearby boxes so they never overlap", () => {
    const boxes: Array<{ key: string; box: Box; width: number }> = [
      { key: "kitty", box: [0.24, 0.09, 0.36, 0.5], width: 84 },
      { key: "pancake", box: [0.36, 0.12, 0.48, 0.5], width: 92 },
    ];
    const placements = placeLabels(boxes, 390, 220);
    const byKey = Object.fromEntries(placements.map((placement) => [placement.key, placement]));
    const left = byKey.kitty!;
    const right = byKey.pancake!;
    const overlapX = left.left < right.left + boxes[1]!.width && right.left < left.left + boxes[0]!.width;
    const overlapY = left.top < right.top + 22 && right.top < left.top + 22;
    expect(overlapX && overlapY).toBe(false);
  });
});
