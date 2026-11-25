import { describe, expect, test } from "bun:test";
import { groupSessionPhotos, sessionTitle } from "../src/lib/session-label";
import type { Sample, SessionCat } from "../src/types";

function sample(uid: string, cat: string | null): Sample {
  return { uid, t: 0, body: null, face: null, guess: null, guess_confidence: null, review: null, sid: null, box: null, crop: null, peers: [], cat, label: null };
}

describe("session title", () => {
  test("reads the whole set and preserves each cat's meal or visit status", () => {
    expect(sessionTitle([{ cat: "Kitty", ate: true }, { cat: "Pancake", ate: true }], { identity: "reviewed", open: false })).toBe("Kitty and Pancake ate");
    expect(sessionTitle([{ cat: "Kitty", ate: true }, { cat: "Pancake", ate: false }], { identity: "reviewed", open: false })).toBe("Kitty ate, Pancake came by");
  });

  test("shows an honest empty or not-a-cat answer and a live title", () => {
    expect(sessionTitle([], { identity: "unknown", open: false })).toBe("Who was here?");
    expect(sessionTitle([], { identity: "not_a_cat", open: false })).toBe("Not a cat");
    expect(sessionTitle([{ cat: "Kitty", ate: true }], { identity: "auto", open: true })).toBe("Kitty is eating");
  });
});

describe("session photo sections", () => {
  const cats: SessionCat[] = [
    { cat: "Kitty", ate: true, confirmed: true, confidence: null, photos: 2 },
    { cat: "Pancake", ate: false, confirmed: true, confidence: null, photos: 1 },
  ];

  test("groups by cat and sends unassigned or stale photos to the main part", () => {
    const sections = groupSessionPhotos([sample("k1", "Kitty"), sample("p1", "Pancake"), sample("k2", "Kitty"), sample("lost", null)], cats);
    expect(sections.map(({ cat, samples }) => [cat, samples.map((item) => item.uid)])).toEqual([
      ["Kitty", ["k1", "k2", "lost"]],
      ["Pancake", ["p1"]],
    ]);
  });

  test("keeps the first listed cat as the main part on a tie and uses one grid for one cat", () => {
    const tied = groupSessionPhotos([sample("unknown", null)], cats);
    expect(tied.map((section) => section.samples.map((item) => item.uid))).toEqual([["unknown"], []]);
    expect(groupSessionPhotos([sample("only", "Kitty")], [cats[0]!])).toEqual([]);
  });
});
