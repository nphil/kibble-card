import { describe, expect, test } from "bun:test";
import { allowedCalibrationEvents, canReviewFull, detectScoreRegression, nextCalibrationStep } from "../src/lib/calibration";

describe("nextCalibrationStep", () => {
  test("walks the whole flow in order", () => {
    expect(nextCalibrationStep("choose-hopper", "start")).toBe("confirm-empty");
    expect(nextCalibrationStep("confirm-empty", "empty-confirmed")).toBe("collecting");
    expect(nextCalibrationStep("collecting", "review-full")).toBe("mark-full");
    expect(nextCalibrationStep("mark-full", "full-marked")).toBe("offer-inherit");
    expect(nextCalibrationStep("offer-inherit", "inherit-resolved")).toBe("done");
    expect(nextCalibrationStep("done", "restart")).toBe("choose-hopper");
  });

  test("capturing a point loops back to the same collecting step", () => {
    expect(nextCalibrationStep("collecting", "capture")).toBe("collecting");
  });

  test("an event that isn't legal from the current step is a no-op, not a skip", () => {
    expect(nextCalibrationStep("choose-hopper", "capture")).toBe("choose-hopper");
    expect(nextCalibrationStep("collecting", "start")).toBe("collecting");
    expect(nextCalibrationStep("mark-full", "capture")).toBe("mark-full");
    expect(nextCalibrationStep("mark-full", "empty-confirmed")).toBe("mark-full");
    expect(nextCalibrationStep("done", "capture")).toBe("done");
  });

  test("offer-inherit only resolves forward, it doesn't reopen collecting", () => {
    expect(nextCalibrationStep("offer-inherit", "capture")).toBe("offer-inherit");
    expect(nextCalibrationStep("offer-inherit", "restart")).toBe("offer-inherit");
  });
});

describe("allowedCalibrationEvents", () => {
  test("names exactly what each step accepts", () => {
    expect(allowedCalibrationEvents("choose-hopper")).toEqual(["start"]);
    expect(allowedCalibrationEvents("confirm-empty")).toEqual(["empty-confirmed"]);
    expect(allowedCalibrationEvents("collecting")).toEqual(["capture", "review-full"]);
    expect(allowedCalibrationEvents("mark-full")).toEqual(["full-marked"]);
    expect(allowedCalibrationEvents("offer-inherit")).toEqual(["inherit-resolved"]);
    expect(allowedCalibrationEvents("done")).toEqual(["restart"]);
  });
});

describe("canReviewFull", () => {
  test("the empty-bowl point alone is never enough to mark full", () => {
    expect(canReviewFull([])).toBe(false);
    expect(canReviewFull([{ portions: 0, score: 3 }])).toBe(false);
  });

  test("one dispensed portion is enough to start reviewing", () => {
    expect(canReviewFull([{ portions: 0, score: 3 }, { portions: 1, score: 18 }])).toBe(true);
  });
});

describe("detectScoreRegression", () => {
  test("nothing to compare against yet", () => {
    expect(detectScoreRegression([], { portions: 0, score: 3 })).toBeNull();
  });

  test("a rising curve never warns", () => {
    const points = [{ portions: 0, score: 3 }, { portions: 1, score: 18 }];
    expect(detectScoreRegression(points, { portions: 2, score: 25 })).toBeNull();
  });

  test("an unchanged score is not a regression -- only strictly lower counts", () => {
    const points = [{ portions: 0, score: 3 }, { portions: 1, score: 18 }];
    expect(detectScoreRegression(points, { portions: 2, score: 18 })).toBeNull();
  });

  test("names the specific step that broke, not just 'it went down'", () => {
    const points = [{ portions: 0, score: 3 }, { portions: 1, score: 18 }, { portions: 2, score: 30 }];
    expect(detectScoreRegression(points, { portions: 3, score: 22 })).toEqual({
      previousPortions: 2,
      previousScore: 30,
      newScore: 22,
    });
  });
});
