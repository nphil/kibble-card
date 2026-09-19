import { describe, expect, test } from "bun:test";
import { catLabelText, detectionRect, LABEL_FLIP_THRESHOLD, labelFlipsInside, largestAdmittedDetection } from "../src/lib/vision-overlay";
import type { VisionDetection } from "../src/types";

function detection(overrides: Partial<VisionDetection> = {}): VisionDetection {
  return { x1: 0, y1: 0, x2: 1, y2: 1, score: 0.9, admitted: true, ...overrides };
}

describe("detectionRect", () => {
  test("converts a real GET /vision/last box to percentages of the video's own box", () => {
    const rect = detectionRect({ x1: 0.0875, y1: 0, x2: 0.6586, y2: 0.5014 });

    expect(rect).toEqual({ left: "8.75%", top: "0%", width: "57.11%", height: "50.14%" });
  });

  test("width/height are the span between the two edges, not x2/y2 themselves", () => {
    const rect = detectionRect({ x1: 0.7, y1: 0.3, x2: 0.95, y2: 0.6 });

    expect(rect.width).toBe("25%");
    expect(rect.height).toBe("30%");
  });

  test("rounds cleanly instead of leaking float noise into the style value", () => {
    const rect = detectionRect({ x1: 1 / 3, y1: 0, x2: 2 / 3, y2: 1 });

    expect(rect.left).toBe("33.33%");
    expect(rect.width).toBe("33.33%");
  });
});

describe("largestAdmittedDetection", () => {
  test("null when there are no detections at all", () => {
    expect(largestAdmittedDetection([])).toBeNull();
  });

  test("null when nothing is admitted, however big", () => {
    const clutter = detection({ x1: 0, y1: 0, x2: 0.9, y2: 0.9, admitted: false });

    expect(largestAdmittedDetection([clutter])).toBeNull();
  });

  test("ignores a bigger non-admitted box in favor of the only admitted one", () => {
    const clutter = detection({ x1: 0, y1: 0, x2: 0.9, y2: 0.9, admitted: false });
    const cat = detection({ x1: 0.4, y1: 0.4, x2: 0.6, y2: 0.6, admitted: true });

    expect(largestAdmittedDetection([clutter, cat])).toBe(cat);
  });

  test("picks the larger of two admitted boxes by area", () => {
    const small = detection({ x1: 0, y1: 0, x2: 0.2, y2: 0.2, admitted: true });
    const big = detection({ x1: 0, y1: 0, x2: 0.5, y2: 0.6, admitted: true });

    expect(largestAdmittedDetection([small, big])).toBe(big);
  });
});

describe("labelFlipsInside", () => {
  test("flips when the box's top edge sits exactly on the frame's own top", () => {
    expect(labelFlipsInside({ y1: 0 })).toBe(true);
  });

  test("flips at the threshold boundary itself (inclusive)", () => {
    expect(labelFlipsInside({ y1: LABEL_FLIP_THRESHOLD })).toBe(true);
  });

  test("does not flip just past the threshold", () => {
    expect(labelFlipsInside({ y1: LABEL_FLIP_THRESHOLD + 0.001 })).toBe(false);
  });

  test("does not flip for a box with real room above it", () => {
    expect(labelFlipsInside({ y1: 0.3 })).toBe(false);
  });
});

describe("catLabelText", () => {
  test("just the name when the feeder sent no score", () => {
    expect(catLabelText("Pancake", null)).toBe("Pancake");
    expect(catLabelText("Pancake", undefined)).toBe("Pancake");
  });

  test("name plus rounded confidence when a score is set", () => {
    expect(catLabelText("Pancake", 0.71)).toBe("Pancake 71%");
  });

  test("rounds the score correctly at the boundary instead of truncating", () => {
    expect(catLabelText("Pancake", 0.7149)).toBe("Pancake 71%");
    expect(catLabelText("Pancake", 0.7151)).toBe("Pancake 72%");
  });
});
