import { describe, expect, test } from "bun:test";
import { announceReviewChange, onReviewChange } from "../src/lib/review-bus";

describe("review bus", () => {
  test("tells every listener for that feeder, and only that feeder", () => {
    const heard: string[] = [];
    const stopA = onReviewChange(() => "entry-a", () => heard.push("a1"));
    const stopA2 = onReviewChange(() => "entry-a", () => heard.push("a2"));
    const stopB = onReviewChange(() => "entry-b", () => heard.push("b"));
    announceReviewChange("entry-a");
    expect(heard).toEqual(["a1", "a2"]);
    stopA();
    stopA2();
    stopB();
  });

  test("reads the feeder at the time of the change, not at subscribe time", () => {
    let entryId: string | undefined;
    let heard = 0;
    const stop = onReviewChange(() => entryId, () => heard++);
    announceReviewChange("entry-a");
    entryId = "entry-a";
    announceReviewChange("entry-a");
    expect(heard).toBe(1);
    stop();
  });

  test("stops after unsubscribe", () => {
    let heard = 0;
    const stop = onReviewChange(() => "entry-a", () => heard++);
    stop();
    announceReviewChange("entry-a");
    expect(heard).toBe(0);
  });
});
