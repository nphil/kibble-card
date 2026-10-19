import { describe, expect, test } from "bun:test";
import { confirmAction, draftChipState, draftFrom, groupSessionPhotos, nameDraftSubject, placeNamePicker, sessionTitle, toggleDraftCat, toggleDraftNotACat } from "../src/lib/session-label";
import type { Box, Sample, SessionCat } from "../src/types";

const KITTY: SessionCat = { cat: "Kitty", ate: true, confirmed: false, confidence: 0.82, photos: 3 };
const PANCAKE: SessionCat = { cat: "Pancake", ate: true, confirmed: true, confidence: null, photos: 1 };

function sample(uid: string, cat: string | null): Sample {
  return {
    uid, t: 0, body: null, face: null, guess: null, guess_confidence: null, review: null,
    sid: null, box: null, crop: null, peers: [], cat, label: null,
  };
}

describe("who was here draft", () => {
  test("the engine's suggestion starts ticked, so the everyday case is one tap", () => {
    const draft = draftFrom([KITTY], "auto");
    expect(draftChipState(draft, [KITTY], "Kitty")).toBe("suggested");
    expect(confirmAction(draft, [KITTY], "auto")).toMatchObject({ kind: "save", text: "Confirm Kitty", request: { cats: [{ cat: "Kitty", ate: true }] } });
  });

  test("tapping a second cat adds it and keeps the suggestion (both were here)", () => {
    const draft = toggleDraftCat(draftFrom([KITTY], "auto"), "Pancake", true);
    expect(draft.cats.map((cat) => cat.cat)).toEqual(["Kitty", "Pancake"]);
    expect(confirmAction(draft, [KITTY], "auto")).toMatchObject({ text: "Confirm Kitty and Pancake" });
  });

  test("a correction is untick then tick, and nothing is ever replaced behind the person's back", () => {
    const draft = toggleDraftCat(toggleDraftCat(draftFrom([KITTY], "auto"), "Kitty", true), "Pancake", true);
    expect(draft.cats.map((cat) => cat.cat)).toEqual(["Pancake"]);
  });

  test("an empty answer cannot be confirmed; an unchanged confirmed answer is just Done", () => {
    expect(confirmAction(toggleDraftCat(draftFrom([PANCAKE], "reviewed"), "Pancake", true), [PANCAKE], "reviewed").kind).toBe("blocked");
    expect(confirmAction(draftFrom([PANCAKE], "reviewed"), [PANCAKE], "reviewed")).toEqual({ kind: "close", text: "Done" });
  });

  test("Not a cat is exclusive both ways", () => {
    const notCat = toggleDraftNotACat(draftFrom([KITTY], "auto"));
    expect(notCat).toMatchObject({ notACat: true, cats: [] });
    expect(toggleDraftCat(notCat, "Kitty", true)).toMatchObject({ notACat: false, cats: [{ cat: "Kitty" }] });
    expect(confirmAction(notCat, [KITTY], "auto")).toMatchObject({ text: "Confirm not a cat", request: { verdict: "not_a_cat" } });
  });

  test("naming a box ticks that cat and is saved with the answer", () => {
    const draft = nameDraftSubject(draftFrom([KITTY], "auto"), 2, "Pancake", true);
    expect(draft.cats.map((cat) => cat.cat)).toEqual(["Kitty", "Pancake"]);
    expect(confirmAction(draft, [KITTY], "auto")).toMatchObject({ request: { subjects: [{ sid: 2, label: "Pancake" }] } });
    expect(nameDraftSubject(draftFrom([KITTY], "auto"), 2, "not_a_cat", true).cats.map((cat) => cat.cat)).toEqual(["Kitty"]);
  });

  test("a cat added to a visit starts as came by, to a meal as ate", () => {
    expect(toggleDraftCat(draftFrom([], "unknown"), "Kitty", false).cats[0]).toEqual({ cat: "Kitty", ate: false });
    expect(toggleDraftCat(draftFrom([], "unknown"), "Kitty", true).cats[0]).toEqual({ cat: "Kitty", ate: true });
  });
});

describe("session title", () => {
  test("reads the whole set and preserves each cat's meal or visit status", () => {
    expect(sessionTitle([{ cat: "Kitty", ate: true }, { cat: "Pancake", ate: true }], { identity: "reviewed", open: false })).toBe("Kitty and Pancake ate");
    expect(sessionTitle([{ cat: "Kitty", ate: true }, { cat: "Pancake", ate: false }], { identity: "reviewed", open: false })).toBe("Kitty ate, Pancake came by");
  });

  test("shows an honest empty or not-a-cat answer and a live title", () => {
    expect(sessionTitle([], { identity: "unknown", open: false })).toBe("Who was this?");
    expect(sessionTitle([], { identity: "not_a_cat", open: false })).toBe("Not a cat");
    expect(sessionTitle([{ cat: "Kitty", ate: true }], { identity: "auto", open: true })).toBe("Kitty is eating");
  });
});

describe("scene name picker placement", () => {
  const box: Box = [0.25, 0.25, 0.5, 0.5];

  test("opens below the box and remains inside the photo", () => {
    const placed = placeNamePicker(box, 576, 360, 230, 120);
    expect(placed).toEqual({ left: 101, top: 188, flipped: false });
    expect(placed.left).toBeGreaterThanOrEqual(0);
    expect(placed.left + 230).toBeLessThanOrEqual(576);
    expect(placed.top + 120).toBeLessThanOrEqual(360);
  });

  test("flips above near the bottom and clamps at photo edges", () => {
    const placed = placeNamePicker([0.9, 0.86, 1, 0.98], 320, 200, 280, 100);
    expect(placed.flipped).toBe(true);
    expect(placed.left).toBe(32);
    expect(placed.top).toBe(64);
    expect(placed.left + 280).toBeLessThanOrEqual(320);
    expect(placed.top + 100).toBeLessThanOrEqual(200);
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
