import { describe, expect, test } from "bun:test";
import {
  BATCH_SIZE,
  answerCurrent,
  answerOptionId,
  answerRequest,
  ateChoices,
  buildReviewItems,
  catAnswer,
  createQueue,
  currentItem,
  dismissGone,
  guessOptionId,
  isBatchBoundary,
  majorityGuess,
  markFailed,
  markSaved,
  markSaving,
  mergeItems,
  nextToSave,
  queueProgress,
  retryFailed,
  reviewOptions,
  reviewPhotos,
  sameAnswer,
  saveCounts,
  severalAnswer,
  summarize,
  trainingGains,
  undoLast,
  upcomingItems,
  type ReviewItem,
  type ReviewQueueState,
} from "../src/lib/review-queue";
import type { Sample, TimelineEvent } from "../src/types";

function row(uid: string, overrides: Partial<TimelineEvent> = {}): TimelineEvent {
  return {
    uid,
    kind: "visit",
    start: 1000,
    end: 1060,
    open: false,
    cat: null,
    identity: "unknown",
    confidence: null,
    thumb: { id: "thumb-" + uid, url: "/media/thumb-" + uid },
    scene: null,
    before: null,
    after: null,
    sample_count: 4,
    session: null,
    ...overrides,
  };
}

function guess(uid: string, cat: string, confidence: number, overrides: Partial<TimelineEvent> = {}): TimelineEvent {
  return row(uid, { cat, identity: "auto", confidence, ...overrides });
}

function sample(uid: string, overrides: Partial<Sample> = {}): Sample {
  return {
    uid,
    t: 0,
    body: { id: "body-" + uid, url: "/media/body-" + uid },
    face: null,
    guess: null,
    guess_confidence: null,
    review: null,
    sid: null,
    box: null,
    crop: null,
    peers: [],
    ...overrides,
  } as Sample;
}

function items(count: number): ReviewItem[] {
  return buildReviewItems(
    Array.from({ length: count }, (_, index) => row("u" + index, { start: 10_000 - index })),
    [],
  );
}

/** Answers the visit on screen and runs its save to completion, like the screen's save pump. */
function answerAndSave(state: ReviewQueueState, cat = "Kitty"): ReviewQueueState {
  let next = answerCurrent(state, catAnswer(cat, false));
  const record = nextToSave(next)!;
  next = markSaving(next, record.key, record.seq);
  return markSaved(next, record.key, record.seq);
}

describe("buildReviewItems", () => {
  test("puts unknown visits first, then unsure guesses, then confident ones, newest first in each", () => {
    const built = buildReviewItems(
      [row("unknown-old", { start: 100 }), row("unknown-new", { start: 200 })],
      [guess("sure", "Pancake", 0.95, { start: 400 }), guess("unsure-old", "Kitty", 0.6, { start: 250 }), guess("unsure-new", "Kitty", 0.7, { start: 300 })],
    );
    expect(built.map((item) => item.key)).toEqual(["unknown-new", "unknown-old", "unsure-new", "unsure-old", "sure"]);
    expect(built.map((item) => item.tier)).toEqual(["unknown", "unknown", "unsure", "unsure", "guess"]);
  });

  test("a visit present in both lists is one item", () => {
    const visit = row("u1");
    expect(buildReviewItems([visit], [visit])).toHaveLength(1);
  });

  test("the per-cat rows of one visit become one item that carries every guess", () => {
    const built = buildReviewItems(
      [],
      [
        guess("s1:Pancake", "Pancake", 0.9, { session: "s1", start: 520, kind: "eat", sample_count: 3 }),
        guess("s1:Kitty", "Kitty", 0.7, { session: "s1", start: 500, sample_count: 5 }),
      ],
    );
    expect(built).toHaveLength(1);
    expect(built[0]).toMatchObject({ key: "s1", guesses: ["Kitty", "Pancake"], confidence: 0.7, tier: "unsure", isMeal: true, photos: 8 });
    expect(built[0]!.event.start).toBe(500);
  });

  test("leaves out visits a person already answered, visits still open, and feeds", () => {
    const built = buildReviewItems(
      [],
      [
        row("reviewed", { identity: "reviewed", cat: "Kitty" }),
        row("not-a-cat", { identity: "not_a_cat" }),
        guess("open", "Kitty", 0.9, { open: true, end: null }),
        row("feed", { kind: "feed", identity: null }),
        guess("half:Kitty", "Kitty", 0.9, { session: "half" }),
        row("half:Pancake", { session: "half", identity: "reviewed", cat: "Pancake" }),
      ],
    );
    expect(built).toEqual([]);
  });

  test("a guessed row without a name counts as unknown", () => {
    const built = buildReviewItems([], [guess("s:Kitty", "Kitty", 0.9, { session: "s" }), row("s:other", { session: "s" })]);
    expect(built[0]).toMatchObject({ tier: "unknown", guesses: ["Kitty"] });
  });
});

describe("answers", () => {
  const two = [{ name: "Kitty" }, { name: "Pancake" }];

  test("two cats get Both, and every option has its number key", () => {
    expect(reviewOptions(two).map((option) => [option.id, option.label, option.hotkey])).toEqual([
      ["cat:Kitty", "Kitty", "1"],
      ["cat:Pancake", "Pancake", "2"],
      ["several", "Both", "3"],
      ["not_a_cat", "Not a cat", "4"],
      ["unknown", "Can\u2019t tell", "5"],
    ]);
  });

  test("one cat has no Both, three or more read More than one", () => {
    expect(reviewOptions([{ name: "Kitty" }]).map((option) => option.id)).toEqual(["cat:Kitty", "not_a_cat", "unknown"]);
    expect(reviewOptions([...two, { name: "Miso" }]).find((option) => option.kind === "several")?.label).toBe("More than one");
  });

  test("the guess points at its own button, or Both for two guesses", () => {
    const options = reviewOptions(two);
    expect(guessOptionId([], options)).toBeNull();
    expect(guessOptionId(["Pancake"], options)).toBe("cat:Pancake");
    expect(guessOptionId(["Kitty", "Pancake"], options)).toBe("several");
    expect(guessOptionId(["Removed cat"], options)).toBeNull();
  });

  test("a cat answer marks a meal as eaten and a visit as not", () => {
    const item = { event: row("u1") };
    expect(answerRequest(item, catAnswer("Kitty", true))).toEqual({ uid: "u1", cats: [{ cat: "Kitty", ate: true }] });
    expect(answerRequest(item, catAnswer("Kitty", false))).toEqual({ uid: "u1", cats: [{ cat: "Kitty", ate: false }] });
  });

  test("both cats on a meal record who ate; on a visit nobody did", () => {
    expect(severalAnswer(["Kitty", "Pancake"], ["Pancake"], true)).toEqual({
      kind: "cats",
      cats: [
        { cat: "Kitty", ate: false },
        { cat: "Pancake", ate: true },
      ],
    });
    expect(severalAnswer(["Kitty", "Pancake"], ["Pancake"], false)).toEqual({
      kind: "cats",
      cats: [
        { cat: "Kitty", ate: false },
        { cat: "Pancake", ate: false },
      ],
    });
  });

  test("who ate offers everyone, then each cat alone", () => {
    expect(ateChoices(["Kitty", "Pancake"])).toEqual([
      { id: "all", label: "Both", ate: ["Kitty", "Pancake"] },
      { id: "cat:Kitty", label: "Kitty", ate: ["Kitty"] },
      { id: "cat:Pancake", label: "Pancake", ate: ["Pancake"] },
    ]);
    expect(ateChoices(["A", "B", "C"])[0]!.label).toBe("All");
  });

  test("not a cat and can't tell are sent as verdicts", () => {
    const item = { event: row("u1") };
    expect(answerRequest(item, { kind: "not_a_cat" })).toEqual({ uid: "u1", verdict: "not_a_cat" });
    expect(answerRequest(item, { kind: "unknown" })).toEqual({ uid: "u1", verdict: "unknown" });
  });

  test("answers compare by content, not order", () => {
    expect(sameAnswer(severalAnswer(["Kitty", "Pancake"], [], false), severalAnswer(["Pancake", "Kitty"], [], false))).toBe(true);
    expect(sameAnswer(catAnswer("Kitty", true), catAnswer("Kitty", false))).toBe(false);
    expect(sameAnswer({ kind: "unknown" }, { kind: "not_a_cat" })).toBe(false);
    expect(sameAnswer({ kind: "unknown" }, { kind: "unknown" })).toBe(true);
  });

  test("a saved answer maps back to its button", () => {
    expect(answerOptionId(catAnswer("Kitty", false))).toBe("cat:Kitty");
    expect(answerOptionId(severalAnswer(["Kitty", "Pancake"], [], false))).toBe("several");
    expect(answerOptionId({ kind: "not_a_cat" })).toBe("not_a_cat");
  });
});

describe("photos and photo guesses", () => {
  test("the best crop comes first and no photo is listed twice", () => {
    const event = { thumb: { id: "body-a", url: "/media/body-a" } };
    const photos = reviewPhotos(event, [sample("b"), sample("a"), sample("c", { body: null, face: { id: "face-c", url: "/media/face-c" } }), sample("d", { body: null })]);
    expect(photos.map((photo) => photo.id)).toEqual(["body-a", "body-b", "face-c"]);
  });

  test("shows just the best crop until the other photos have loaded", () => {
    expect(reviewPhotos({ thumb: { id: "t", url: "/t" } }, null).map((photo) => photo.id)).toEqual(["t"]);
    expect(reviewPhotos({ thumb: null }, null)).toEqual([]);
  });

  test("a clear majority of photo guesses becomes the visit's guess", () => {
    const samples = [
      sample("a", { guess: "Kitty", guess_confidence: 0.9 }),
      sample("b", { guess: "Kitty", guess_confidence: 0.8 }),
      sample("c", { guess: "Pancake", guess_confidence: 0.3 }),
    ];
    const result = majorityGuess(samples, ["Kitty", "Pancake"]);
    expect(result?.cat).toBe("Kitty");
    expect(result?.confidence).toBeCloseTo(0.85, 2);
  });

  test("an even split, or guesses for cats that are gone, give no guess", () => {
    const split = [sample("a", { guess: "Kitty", guess_confidence: 0.5 }), sample("b", { guess: "Pancake", guess_confidence: 0.5 })];
    expect(majorityGuess(split, ["Kitty", "Pancake"])).toBeNull();
    expect(majorityGuess([sample("a", { guess: "Ghost", guess_confidence: 0.9 })], ["Kitty"])).toBeNull();
    expect(majorityGuess([], ["Kitty"])).toBeNull();
  });
});

describe("queue state", () => {
  test("starts on the visit that was tapped, by session key or row uid", () => {
    const list = items(3);
    expect(currentItem(createQueue(list))!.key).toBe("u0");
    expect(currentItem(createQueue(list, "u2"))!.key).toBe("u2");
    const split = buildReviewItems([], [guess("s9:Kitty", "Kitty", 0.5, { session: "s9" }), guess("x", "Kitty", 0.5, { start: 5000 })]);
    expect(currentItem(createQueue(split, "s9:Kitty"))!.key).toBe("s9");
    expect(currentItem(createQueue(list, "missing"))!.key).toBe("u0");
  });

  test("answering moves on and queues exactly one save", () => {
    let state = answerCurrent(createQueue(items(3)), catAnswer("Kitty", false));
    expect(currentItem(state)!.key).toBe("u1");
    expect(state.streak).toBe(1);
    const record = nextToSave(state)!;
    expect(record).toMatchObject({ key: "u0", status: "queued", attempts: 0 });
    state = markSaving(state, record.key, record.seq);
    expect(nextToSave(state)).toBeNull();
    state = markSaved(state, record.key, record.seq);
    expect(state.records.u0!.status).toBe("saved");
    expect(nextToSave(state)).toBeNull();
  });

  test("only one save is in flight at a time, oldest answer first", () => {
    let state = createQueue(items(3));
    state = answerCurrent(state, catAnswer("Kitty", false));
    state = answerCurrent(state, catAnswer("Pancake", false));
    const first = nextToSave(state)!;
    expect(first.key).toBe("u0");
    state = markSaving(state, first.key, first.seq);
    expect(nextToSave(state)).toBeNull();
    state = markSaved(state, first.key, first.seq);
    expect(nextToSave(state)!.key).toBe("u1");
  });

  test("undo before the save was sent cancels it", () => {
    let state = answerCurrent(createQueue(items(2)), catAnswer("Kitty", false));
    state = undoLast(state);
    expect(currentItem(state)!.key).toBe("u0");
    expect(state.records.u0).toBeUndefined();
    expect(nextToSave(state)).toBeNull();
    expect(state.streak).toBe(0);
  });

  test("undo after a save keeps the saved answer until a different one replaces it", () => {
    let state = answerAndSave(createQueue(items(2)));
    state = undoLast(state);
    expect(currentItem(state)!.key).toBe("u0");
    expect(state.records.u0!.status).toBe("saved");

    const same = answerCurrent(state, catAnswer("Kitty", false));
    expect(nextToSave(same)).toBeNull();
    expect(currentItem(same)!.key).toBe("u1");

    const changed = answerCurrent(state, catAnswer("Pancake", false));
    expect(nextToSave(changed)).toMatchObject({ key: "u0", answer: catAnswer("Pancake", false) });
  });

  test("a result for an answer that was since replaced is ignored", () => {
    let state = answerCurrent(createQueue(items(2)), catAnswer("Kitty", false));
    const first = nextToSave(state)!;
    state = markSaving(state, first.key, first.seq);
    state = undoLast(state);
    state = answerCurrent(state, catAnswer("Pancake", false));
    state = markSaved(state, first.key, first.seq);
    expect(state.records.u0).toMatchObject({ status: "queued", answer: catAnswer("Pancake", false) });
    expect(nextToSave(state)!.seq).toBeGreaterThan(first.seq);
  });

  test("undo with nothing answered does nothing", () => {
    const state = createQueue(items(2));
    expect(undoLast(state)).toBe(state);
  });

  test("a failed save waits, is counted, and goes again on retry", () => {
    let state = answerCurrent(createQueue(items(2)), catAnswer("Kitty", false));
    const record = nextToSave(state)!;
    state = markSaving(state, record.key, record.seq);
    state = markFailed(state, record.key, record.seq, "offline");
    expect(saveCounts(state)).toEqual({ pending: 0, failed: 1, gone: 0 });
    expect(nextToSave(state)).toBeNull();
    state = retryFailed(state);
    expect(saveCounts(state)).toEqual({ pending: 1, failed: 0, gone: 0 });
    const again = nextToSave(state)!;
    expect(again.seq).toBe(record.seq);
    state = markSaving(state, again.key, again.seq);
    expect(state.records.u0!.attempts).toBe(2);
  });

  test("a failed save does not block the answers behind it", () => {
    let state = createQueue(items(3));
    state = answerCurrent(state, catAnswer("Kitty", false));
    state = answerCurrent(state, catAnswer("Kitty", false));
    const first = nextToSave(state)!;
    state = markFailed(markSaving(state, first.key, first.seq), first.key, first.seq, "boom");
    expect(nextToSave(state)!.key).toBe("u1");
  });

  test("a visit that no longer exists is never retried and can be dismissed", () => {
    let state = answerCurrent(createQueue(items(2)), catAnswer("Kitty", false));
    const record = nextToSave(state)!;
    state = markFailed(markSaving(state, record.key, record.seq), record.key, record.seq, "gone", true);
    expect(saveCounts(state)).toEqual({ pending: 0, failed: 0, gone: 1 });
    expect(retryFailed(state)).toBe(state);
    state = dismissGone(state);
    expect(state.records.u0).toBeUndefined();
    expect(state.history).toEqual([]);
  });

  test("re-answering a failed visit with the same answer sends it again", () => {
    let state = answerCurrent(createQueue(items(2)), catAnswer("Kitty", false));
    const record = nextToSave(state)!;
    state = markFailed(markSaving(state, record.key, record.seq), record.key, record.seq, "boom");
    state = answerCurrent(undoLast(state), catAnswer("Kitty", false));
    expect(nextToSave(state)).toMatchObject({ key: "u0", status: "queued" });
  });

  test("upcoming visits skip the ones already answered", () => {
    let state = createQueue(items(4), "u2");
    expect(upcomingItems(state, 2).map((item) => item.key)).toEqual(["u0", "u1"]);
    state = answerCurrent(state, catAnswer("Kitty", false));
    expect(upcomingItems(state, 5).map((item) => item.key)).toEqual(["u1", "u3"]);
  });
});

describe("a queue that changes underneath", () => {
  test("keeps the visit on screen and everything before it, refreshes what is behind", () => {
    let state = answerAndSave(createQueue(items(4)));
    const fresh = buildReviewItems([row("new", { start: 20_000 }), row("u1", { start: 9999 }), row("u3", { start: 9997 })], []);
    state = mergeItems(state, fresh);
    expect(state.items.map((item) => item.key)).toEqual(["u0", "u1", "new", "u3"]);
    expect(currentItem(state)!.key).toBe("u1");
  });

  test("a finished sitting picks up newly arrived visits", () => {
    let state = answerAndSave(createQueue(items(1)));
    expect(currentItem(state)).toBeNull();
    state = mergeItems(state, buildReviewItems([row("late", { start: 30_000 })], []));
    expect(currentItem(state)!.key).toBe("late");
  });

  test("an answered visit that the server still lists is not asked twice", () => {
    let state = answerCurrent(createQueue(items(2)), catAnswer("Kitty", false));
    state = mergeItems(state, items(2));
    expect(state.items.map((item) => item.key)).toEqual(["u0", "u1"]);
    expect(queueProgress(state)).toMatchObject({ done: 1, remaining: 1 });
  });
});

describe("progress and summary", () => {
  test("counts inside a batch of twenty and pauses at the boundary", () => {
    let state = createQueue(items(BATCH_SIZE + 5));
    expect(queueProgress(state)).toEqual({ done: 0, remaining: 25, batchDone: 0, batchSize: 20 });
    for (let index = 0; index < BATCH_SIZE - 1; index++) state = answerCurrent(state, catAnswer("Kitty", false));
    expect(isBatchBoundary(state)).toBe(false);
    state = answerCurrent(state, catAnswer("Kitty", false));
    expect(isBatchBoundary(state)).toBe(true);
    expect(queueProgress(state)).toEqual({ done: 20, remaining: 5, batchDone: 0, batchSize: 5 });
  });

  test("the last answer of the whole queue is the end, not a batch pause", () => {
    let state = createQueue(items(BATCH_SIZE));
    for (let index = 0; index < BATCH_SIZE; index++) state = answerCurrent(state, catAnswer("Kitty", false));
    expect(isBatchBoundary(state)).toBe(false);
    expect(currentItem(state)).toBeNull();
  });

  test("a short queue is one short batch", () => {
    expect(queueProgress(createQueue(items(3)))).toEqual({ done: 0, remaining: 3, batchDone: 0, batchSize: 3 });
  });

  test("the summary counts standing answers per cat and photos from single-cat visits", () => {
    let state = createQueue(items(5));
    state = answerCurrent(state, catAnswer("Kitty", false));
    state = answerCurrent(state, severalAnswer(["Kitty", "Pancake"], [], false));
    state = answerCurrent(state, { kind: "not_a_cat" });
    state = answerCurrent(state, { kind: "unknown" });
    state = answerCurrent(state, catAnswer("Pancake", false));
    state = undoLast(state);
    expect(summarize(state, ["Kitty", "Pancake"])).toEqual({
      total: 4,
      cats: [
        { cat: "Kitty", visits: 2, photos: 4 },
        { cat: "Pancake", visits: 1, photos: 0 },
      ],
      notACat: 1,
      cantTell: 1,
    });
  });

  test("training gains are the real change per cat and never negative", () => {
    const before = [
      { name: "Kitty", training: { total: 100, face: 40, body: 60 } },
      { name: "Pancake", training: { total: 80, face: 30, body: 50 } },
    ];
    const after = [
      { name: "Kitty", training: { total: 112, face: 44, body: 68 } },
      { name: "Pancake", training: { total: 78, face: 30, body: 48 } },
      { name: "Miso", training: { total: 3, face: 1, body: 2 } },
    ];
    expect(trainingGains(before, after)).toEqual({ Kitty: 12, Pancake: 0, Miso: 3 });
  });
});
