import { describe, expect, test } from "bun:test";
import { learningCountsDown, learningLine, learningProgress, learningSummary, learningSummaryText, parseLearning, readDismissed, SUMMARY_MAX_AGE_S, writeDismissed } from "../src/lib/learning-status";
import type { SimpleStorage } from "../src/lib/simple-storage";
import type { LearningStatus } from "../src/types";

function status(overrides: Partial<LearningStatus> = {}): LearningStatus {
  return { state: "idle", pending: 0, done: null, total: null, starts_at: null, retry_at: null, started: null, last: null, error: null, ...overrides };
}

const PASS = { finished: 10_000, duration: 95, answers: 14, learned: { Kitty: 5, Pancake: -1 }, renamed: 3, rechecked: 1400 };

describe("parseLearning", () => {
  test("reads a status as it came over the wire and ignores what it does not know", () => {
    expect(parseLearning({ state: "rechecking", pending: 12, done: 340, total: 1400, bogus: 1 })).toEqual(status({ state: "rechecking", pending: 12, done: 340, total: 1400 }));
  });

  test("anything that is not a known state is no status", () => {
    expect(parseLearning({ state: "sleeping" })).toBeNull();
    expect(parseLearning(null)).toBeNull();
    expect(parseLearning("learning")).toBeNull();
  });

  test("a number that is missing or not finite never reaches the screen", () => {
    expect(parseLearning({ state: "learning", pending: Number.NaN, done: "7", total: Number.POSITIVE_INFINITY })).toEqual(status({ state: "learning" }));
  });

  test("the last pass keeps only the cats whose photos changed", () => {
    const parsed = parseLearning({ state: "idle", last: { finished: 100, duration: 5, answers: 3, learned: { Kitty: 2, Pancake: 0, Bad: "x" }, renamed: 1, rechecked: 10 } });
    expect(parsed?.last).toEqual({ finished: 100, duration: 5, answers: 3, learned: { Kitty: 2 }, renamed: 1, rechecked: 10 });
    expect(parseLearning({ state: "idle", last: { finished: "yesterday" } })?.last).toBeNull();
  });
});

describe("learningLine", () => {
  test("rechecking shows a real count", () => {
    expect(learningLine(status({ state: "rechecking", pending: 12, done: 340, total: 1400 }), 0, "en-US")).toBe("12 answers saved, learning 340 of 1,400 visits");
  });

  test("rechecking without a total, or without saved answers, still reads well", () => {
    expect(learningLine(status({ state: "rechecking", pending: 12 }), 0, "en-US")).toBe("12 answers saved, checking your visits again");
    expect(learningLine(status({ state: "rechecking", done: 5, total: 10 }), 0, "en-US")).toBe("Learning 5 of 10 visits");
    expect(learningLine(status({ state: "rechecking", done: 2000, total: 1400 }), 0, "en-US")).toBe("Learning 1,400 of 1,400 visits");
  });

  test("waiting says learning starts when you pause", () => {
    expect(learningLine(status({ state: "waiting", pending: 12 }), 0)).toBe("12 answers saved, learning starts when you pause");
    expect(learningLine(status({ state: "waiting", pending: 1 }), 0)).toBe("1 answer saved, learning starts when you pause");
    expect(learningLine(status({ state: "waiting" }), 0)).toBe("Learning starts when you pause");
  });

  test("learning says so", () => {
    expect(learningLine(status({ state: "learning", pending: 12 }), 0)).toBe("Learning from your answers\u2026");
  });

  test("retrying counts down and reassures", () => {
    expect(learningLine(status({ state: "retrying", retry_at: 1030 }), 1000)).toBe("Something went wrong, trying again in 30 s. Your answers are safe.");
    expect(learningLine(status({ state: "retrying", retry_at: 1089 }), 1000)).toBe("Something went wrong, trying again in 89 s. Your answers are safe.");
    expect(learningLine(status({ state: "retrying", retry_at: 1120 }), 1000)).toBe("Something went wrong, trying again in 2 min. Your answers are safe.");
    expect(learningLine(status({ state: "retrying", retry_at: 990 }), 1000)).toBe("Something went wrong, trying again now. Your answers are safe.");
    expect(learningLine(status({ state: "retrying" }), 1000)).toBe("Something went wrong, trying again soon. Your answers are safe.");
  });

  test("idle, or no status yet, says nothing", () => {
    expect(learningLine(status(), 0)).toBe("");
    expect(learningLine(null, 0)).toBe("");
  });
});

describe("progress and countdown", () => {
  test("a recheck's progress is a fraction, and only a recheck has one", () => {
    expect(learningProgress(status({ state: "rechecking", done: 350, total: 1400 }))).toBe(0.25);
    expect(learningProgress(status({ state: "rechecking", done: 2000, total: 1400 }))).toBe(1);
    expect(learningProgress(status({ state: "rechecking", done: 5, total: 0 }))).toBeNull();
    expect(learningProgress(status({ state: "learning", done: 5, total: 10 }))).toBeNull();
    expect(learningProgress(null)).toBeNull();
  });

  test("the screen ticks only while a retry is still in the future", () => {
    expect(learningCountsDown(status({ state: "retrying", retry_at: 1030 }), 1000)).toBe(true);
    expect(learningCountsDown(status({ state: "retrying", retry_at: 990 }), 1000)).toBe(false);
    expect(learningCountsDown(status({ state: "learning", retry_at: 1030 }), 1000)).toBe(false);
    expect(learningCountsDown(null, 1000)).toBe(false);
  });
});

describe("the summary of a finished pass", () => {
  test("names what each cat gained or lost, biggest change first", () => {
    expect(learningSummaryText(PASS, "en-US")).toBe("Kibble learned from your answers: Kitty +5 photos, Pancake -1 photo. 3 visits got a new name.");
  });

  test("says so when nothing moved", () => {
    expect(learningSummaryText({ ...PASS, learned: {}, renamed: 0 }, "en-US")).toBe("Kibble checked your answers. Nothing changed.");
    expect(learningSummaryText({ ...PASS, learned: {}, renamed: 2 }, "en-US")).toBe("Kibble checked your answers. 2 visits got a new name.");
  });

  test("shows for a fresh pass that learned from answers", () => {
    expect(learningSummary(status({ last: PASS }), PASS.finished + 60, 0, "en-US")).toEqual({ finished: PASS.finished, text: learningSummaryText(PASS, "en-US") });
  });

  test("stays quiet when there is no pass, nothing was learned, it is old news, or it was dismissed", () => {
    expect(learningSummary(null, PASS.finished, 0)).toBeNull();
    expect(learningSummary(status(), PASS.finished, 0)).toBeNull();
    expect(learningSummary(status({ last: { ...PASS, answers: 0 } }), PASS.finished + 60, 0)).toBeNull();
    expect(learningSummary(status({ last: PASS }), PASS.finished + SUMMARY_MAX_AGE_S + 1, 0)).toBeNull();
    expect(learningSummary(status({ last: PASS }), PASS.finished + 60, PASS.finished)).toBeNull();
  });
});

describe("remembering a dismissal", () => {
  function memoryStorage(): SimpleStorage {
    const data = new Map<string, string>();
    return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => void data.set(key, value) };
  }

  test("a dismissal is remembered per entry", () => {
    const storage = memoryStorage();
    expect(readDismissed(storage, "entry-1")).toBe(0);
    writeDismissed(storage, "entry-1", 123);
    expect(readDismissed(storage, "entry-1")).toBe(123);
    expect(readDismissed(storage, "entry-2")).toBe(0);
  });

  test("blocked storage never throws", () => {
    const blocked: SimpleStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readDismissed(blocked, "entry-1")).toBe(0);
    expect(() => writeDismissed(blocked, "entry-1", 5)).not.toThrow();
    expect(readDismissed(null, "entry-1")).toBe(0);
    expect(() => writeDismissed(null, "entry-1", 5)).not.toThrow();
  });
});
