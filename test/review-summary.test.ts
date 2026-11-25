import { describe, expect, test } from "bun:test";
import { reviewSummaryMessage } from "../src/lib/review-summary";

describe("reviewSummaryMessage", () => {
  test("nothing answered is no toast", () => {
    expect(reviewSummaryMessage(0)).toBeNull();
    expect(reviewSummaryMessage(Number.NaN)).toBeNull();
  });

  test("says how many photos, singular and plural", () => {
    expect(reviewSummaryMessage(1, "en-US")).toBe("1 photo updated");
    expect(reviewSummaryMessage(2, "en-US")).toBe("2 photos updated");
  });

  test("formats big counts", () => {
    expect(reviewSummaryMessage(1200, "en-US")).toBe("1,200 photos updated");
  });
});
