import { describe, expect, test } from "bun:test";
import { relativeElapsed, relativeTimeCompact, relativeTimeSentence } from "../src/lib/relative-time";

const base = new Date(2026, 0, 1, 12, 0, 0);

describe("relativeElapsed", () => {
  test("buckets sub-minute gaps as now", () => {
    expect(relativeElapsed(base, new Date(2026, 0, 1, 12, 0, 30))).toEqual({ unit: "now", value: 0 });
  });

  test("buckets minutes under an hour", () => {
    expect(relativeElapsed(base, new Date(2026, 0, 1, 12, 45, 0))).toEqual({ unit: "minutes", value: 45 });
  });

  test("buckets hours under a day", () => {
    expect(relativeElapsed(base, new Date(2026, 0, 1, 14, 0, 0))).toEqual({ unit: "hours", value: 2 });
  });

  test("buckets days at 24h and beyond", () => {
    expect(relativeElapsed(base, new Date(2026, 0, 3, 12, 0, 0))).toEqual({ unit: "days", value: 2 });
  });

  test("never goes negative for a `from` that is after `now`", () => {
    expect(relativeElapsed(base, new Date(2026, 0, 1, 11, 0, 0))).toEqual({ unit: "now", value: 0 });
  });
});

describe("relativeTimeCompact", () => {
  test("matches the hero's existing tight-layout spelling", () => {
    expect(relativeTimeCompact(base, new Date(2026, 0, 1, 12, 0, 30))).toBe("just now");
    expect(relativeTimeCompact(base, new Date(2026, 0, 1, 12, 45, 0))).toBe("45m ago");
    expect(relativeTimeCompact(base, new Date(2026, 0, 1, 14, 0, 0))).toBe("2h ago");
    expect(relativeTimeCompact(base, new Date(2026, 0, 3, 12, 0, 0))).toBe("2d ago");
  });
});

describe("relativeTimeSentence", () => {
  test("spells the same buckets as words a sentence can absorb", () => {
    expect(relativeTimeSentence(base, new Date(2026, 0, 1, 12, 0, 30))).toBe("just now");
    expect(relativeTimeSentence(base, new Date(2026, 0, 1, 12, 45, 0))).toBe("45 min ago");
    expect(relativeTimeSentence(base, new Date(2026, 0, 1, 14, 0, 0))).toBe("2 h ago");
    expect(relativeTimeSentence(base, new Date(2026, 0, 3, 12, 0, 0))).toBe("2 d ago");
  });
});
