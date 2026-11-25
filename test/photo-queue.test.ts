import { describe, expect, test } from "bun:test";
import {
  answerPhoto,
  appendPage,
  createQueue,
  currentPhoto,
  isCaughtUp,
  lastAnswer,
  needsMorePhotos,
  photoCaption,
  photosLeft,
  photosLeftLabel,
  queueAsPage,
  undoLast,
  upcomingPhotos,
} from "../src/lib/photo-queue";
import type { PhotoQueueItem, PhotoQueuePage, Sample } from "../src/types";

function item(uid: string, kind: "eat" | "visit" = "visit", start = 1_700_000_000): PhotoQueueItem {
  const sample: Sample = { uid, t: start, body: null, face: null, guess: null, guess_confidence: null, review: null, label: null, sid: null, box: null, crop: null, peers: [], cat: null };
  return { sample, visit: { uid: "visit-" + uid, start, kind, scene: null, in_scene: false } };
}

function page(uids: string[], overrides: Partial<PhotoQueuePage> = {}): PhotoQueuePage {
  return { items: uids.map((uid) => item(uid)), remaining: uids.length, visits: 1, cursor: null, has_more: false, ...overrides };
}

const nothingWaiting: ReadonlySet<string> = new Set();

function uids(items: PhotoQueueItem[]): string[] {
  return items.map((entry) => entry.sample.uid);
}

describe("one photo at a time", () => {
  test("starts on the first photo, in the server's order", () => {
    const state = createQueue(page(["a", "b", "c"]), nothingWaiting);
    expect(currentPhoto(state)?.sample.uid).toBe("a");
    expect(uids(upcomingPhotos(state, 2))).toEqual(["b", "c"]);
    expect(photosLeft(state)).toBe(3);
  });

  test("photos whose answer is still waiting to be sent are left out, and the count follows", () => {
    const state = createQueue(page(["a", "b", "c"]), new Set(["a"]));
    expect(uids(state.items)).toEqual(["b", "c"]);
    expect(photosLeft(state)).toBe(2);
  });

  test("an answer moves on to the next photo and counts one fewer", () => {
    const state = answerPhoto(createQueue(page(["a", "b", "c"]), nothingWaiting), "Kitty");
    expect(currentPhoto(state)?.sample.uid).toBe("b");
    expect(photosLeft(state)).toBe(2);
    expect(lastAnswer(state)).toEqual({ uid: "a", label: "Kitty" });
  });

  test("undo brings the last photo back as the current one", () => {
    const answered = answerPhoto(createQueue(page(["a", "b", "c"]), nothingWaiting), "skip");
    const undone = undoLast(answered);
    expect(currentPhoto(undone)?.sample.uid).toBe("a");
    expect(photosLeft(undone)).toBe(3);
    expect(lastAnswer(undone)).toBeNull();
  });

  test("undo with nothing answered changes nothing", () => {
    const state = createQueue(page(["a"]), nothingWaiting);
    expect(undoLast(state)).toBe(state);
  });

  test("the count never reads zero while a photo is on screen", () => {
    expect(photosLeft(createQueue(page(["a"], { remaining: 0 }), nothingWaiting))).toBe(1);
  });
});

describe("pages", () => {
  test("all caught up only when nothing is on screen and no page is left", () => {
    const last = answerPhoto(createQueue(page(["a"]), nothingWaiting), "Kitty");
    expect(isCaughtUp(last)).toBe(true);
    const more = answerPhoto(createQueue(page(["a"], { has_more: true, cursor: "next" }), nothingWaiting), "Kitty");
    expect(isCaughtUp(more)).toBe(false);
    expect(needsMorePhotos(more)).toBe(true);
  });

  test("the next page is asked for once few photos are left", () => {
    let state = createQueue(page(["a", "b", "c", "d", "e", "f", "g", "h"], { has_more: true, cursor: "next" }), nothingWaiting);
    expect(needsMorePhotos(state)).toBe(false);
    for (let index = 0; index < 4; index++) state = answerPhoto(state, "Kitty");
    expect(needsMorePhotos(state)).toBe(true);
  });

  test("a later page goes behind, skipping photos already loaded or waiting to be sent", () => {
    const first = createQueue(page(["a", "b"], { remaining: 5, has_more: true, cursor: "next" }), nothingWaiting);
    const second = appendPage(first, page(["b", "c", "d"], { remaining: 5, cursor: null }), new Set(["c"]));
    expect(uids(second.items)).toEqual(["a", "b", "d"]);
    expect(second.remaining).toBe(4);
    expect(second.hasMore).toBe(false);
  });

  test("a page that says more follow but names no cursor cannot be followed", () => {
    expect(createQueue(page(["a"], { has_more: true, cursor: null }), nothingWaiting).hasMore).toBe(false);
  });

  test("what is left, in page form, leaves out the photos answered in the sitting", () => {
    const state = answerPhoto(createQueue(page(["a", "b", "c"], { has_more: true, cursor: "next" }), nothingWaiting), "Kitty");
    const kept = queueAsPage(state);
    expect(uids(kept.items)).toEqual(["b", "c"]);
    expect(kept).toMatchObject({ remaining: 2, cursor: "next", has_more: true });
  });
});

describe("words", () => {
  test("photos left reads as a count with the noun to match", () => {
    expect(photosLeftLabel(1)).toBe("1 photo left");
    expect(photosLeftLabel(47)).toBe("47 photos left");
    expect(photosLeftLabel(1234, "en-US")).toBe("1,234 photos left");
  });

  test("the caption says when and whether it was a meal, and nothing about groups", () => {
    const start = new Date(2026, 10, 11, 13, 5).getTime() / 1000;
    const now = new Date(2026, 10, 20, 9, 0);
    expect(photoCaption({ start, kind: "eat" }, now, "en-US")).toMatch(/^Nov 11, 1:05\s+PM, meal$/);
    expect(photoCaption({ start, kind: "visit" }, now, "en-US")).toMatch(/^Nov 11, 1:05\s+PM, visit$/);
  });
});
