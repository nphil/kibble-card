import { describe, expect, test } from "bun:test";
import { reviewSummaryMessage, type ReviewedEventLabel } from "../src/lib/review-summary";

const NOON = new Date();
NOON.setHours(12, 0, 0, 0);
const NOON_S = Math.floor(NOON.getTime() / 1000);

function eatLabel(uid: string, cat: string, start = NOON_S): ReviewedEventLabel {
  return { uid, label: cat, event: { kind: "eat", open: false, start } };
}

describe("reviewSummaryMessage", () => {
  test("nothing saved at all is no toast", () => {
    expect(reviewSummaryMessage({ events: [], photosUpdated: 0 })).toBeNull();
  });

  test("a single cat label names the cat, the verb and the time", () => {
    expect(reviewSummaryMessage({ events: [eatLabel("e1", "Pancake")], photosUpdated: 0 }, "en-US")).toBe("Saved: Pancake ate at 12:00 PM");
  });

  test("a visit uses its own verb", () => {
    const visit: ReviewedEventLabel = { uid: "e1", label: "Kitty", event: { kind: "visit", open: false, start: NOON_S } };
    expect(reviewSummaryMessage({ events: [visit], photosUpdated: 0 }, "en-US")).toBe("Saved: Kitty came by at 12:00 PM");
  });

  test("not_a_cat carries no time -- just the fact", () => {
    const entry: ReviewedEventLabel = { uid: "e1", label: "not_a_cat", event: { kind: "visit", open: false, start: NOON_S } };
    expect(reviewSummaryMessage({ events: [entry], photosUpdated: 0 })).toBe("Saved: Not a cat");
  });

  test("unknown (Can't tell/Not sure) reports nothing on its own", () => {
    const entry: ReviewedEventLabel = { uid: "e1", label: "unknown", event: { kind: "eat", open: false, start: NOON_S } };
    expect(reviewSummaryMessage({ events: [entry], photosUpdated: 0 })).toBeNull();
  });

  test("unknown alongside a real photo update still reports the photos", () => {
    const entry: ReviewedEventLabel = { uid: "e1", label: "unknown", event: { kind: "eat", open: false, start: NOON_S } };
    expect(reviewSummaryMessage({ events: [entry], photosUpdated: 1 })).toBe("Saved: 1 photo updated");
  });

  test("photos alone, singular vs plural", () => {
    expect(reviewSummaryMessage({ events: [], photosUpdated: 1 })).toBe("Saved: 1 photo updated");
    expect(reviewSummaryMessage({ events: [], photosUpdated: 2 })).toBe("Saved: 2 photos updated");
  });

  test("an event label plus photo corrections combine on one line", () => {
    expect(reviewSummaryMessage({ events: [eatLabel("e1", "Pancake")], photosUpdated: 2 }, "en-US")).toBe("Saved: Pancake ate at 12:00 PM, 2 photos updated");
  });

  test("two different events labelled via the pager both show, in order", () => {
    const events = [eatLabel("e1", "Pancake", NOON_S), eatLabel("e2", "Kitty", NOON_S + 300)];
    expect(reviewSummaryMessage({ events, photosUpdated: 0 }, "en-US")).toBe("Saved: Pancake ate at 12:00 PM, Kitty ate at 12:05 PM");
  });

  test("relabelling the same event shows only its final result, at its first position", () => {
    const events = [eatLabel("e1", "Pancake"), eatLabel("e2", "Kitty", NOON_S + 300), eatLabel("e1", "Whiskers")];
    expect(reviewSummaryMessage({ events, photosUpdated: 0 }, "en-US")).toBe("Saved: Whiskers ate at 12:00 PM, Kitty ate at 12:05 PM");
  });
});
