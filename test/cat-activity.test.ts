import { describe, expect, test } from "bun:test";
import { catLastSeenTs } from "../src/lib/cat-activity";

describe("catLastSeenTs", () => {
  test("falls back to last_seen when there are no sightings at all", () => {
    expect(catLastSeenTs(1000, [])).toBe(1000);
  });

  test("prefers a sighting newer than last_seen", () => {
    expect(catLastSeenTs(1000, [500, 2000, 1500])).toBe(2000);
  });

  test("prefers last_seen when it is newer than every sighting", () => {
    expect(catLastSeenTs(3000, [500, 2000])).toBe(3000);
  });

  test("null when neither signal has ever fired -- never a sighting invented from nothing", () => {
    expect(catLastSeenTs(null, [])).toBeNull();
  });

  test("a real sighting still counts even when last_seen itself is null", () => {
    expect(catLastSeenTs(null, [1234])).toBe(1234);
  });
});
