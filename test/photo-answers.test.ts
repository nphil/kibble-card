import { describe, expect, test } from "bun:test";
import { answerOptions, guessCaption, guessOptionId, NOT_USED_HINT, optionIdForAnswer, photosCheckedLabel, photoTag, tallyAnswers, tallyRows } from "../src/lib/photo-answers";

const two = answerOptions([{ name: "Kitty" }, { name: "Pancake" }]);

describe("answerOptions", () => {
  test("two cats: each cat, Both in this photo, Not a cat, Don't use, numbered 1 to 5", () => {
    expect(two.map((option) => [option.hotkey, option.id, option.text, option.value])).toEqual([
      ["1", "cat:Kitty", "Kitty", "Kitty"],
      ["2", "cat:Pancake", "Pancake", "Pancake"],
      ["3", "both", "Both in this photo", "both"],
      ["4", "not_a_cat", "Not a cat", "not_a_cat"],
      ["5", "skip", "Don\u2019t use", "skip"],
    ]);
  });

  test("Both in this photo exists only with exactly two cats", () => {
    expect(answerOptions([{ name: "Kitty" }]).map((option) => option.id)).toEqual(["cat:Kitty", "not_a_cat", "skip"]);
    expect(answerOptions([{ name: "A" }, { name: "B" }, { name: "C" }]).some((option) => option.id === "both")).toBe(false);
  });

  test("only the two answers that are never used for learning say so", () => {
    expect(two.map((option) => option.hint)).toEqual([null, null, NOT_USED_HINT, null, NOT_USED_HINT]);
  });

  test("number keys stop after nine", () => {
    const many = answerOptions(Array.from({ length: 10 }, (_, index) => ({ name: "Cat" + index })));
    expect(many.map((option) => option.hotkey)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", null, null, null]);
  });
});

describe("the engine's guess", () => {
  test("highlights the matching button, only when it is on the roster", () => {
    expect(guessOptionId({ guess: "Pancake" }, two)).toBe("cat:Pancake");
    expect(guessOptionId({ guess: "not_a_cat" }, two)).toBe("not_a_cat");
    expect(guessOptionId({ guess: "Whiskers" }, two)).toBeNull();
    expect(guessOptionId({ guess: null }, two)).toBeNull();
  });

  test("a saved answer maps back to its button", () => {
    expect(optionIdForAnswer("Kitty")).toBe("cat:Kitty");
    expect(optionIdForAnswer("both")).toBe("both");
    expect(optionIdForAnswer("skip")).toBe("skip");
    expect(optionIdForAnswer("follow")).toBeNull();
    expect(optionIdForAnswer(null)).toBeNull();
  });

  test("the caption is sure, or hedged when the engine is unsure", () => {
    expect(guessCaption({ guess: "Kitty", guess_confidence: 0.9 })).toBe("Looks like Kitty");
    expect(guessCaption({ guess: "Kitty", guess_confidence: 0.4 })).toBe("Maybe Kitty");
    expect(guessCaption({ guess: "Kitty", guess_confidence: null })).toBe("Looks like Kitty");
    expect(guessCaption({ guess: "not_a_cat", guess_confidence: 0.9 })).toBe("Probably not a cat");
    expect(guessCaption({ guess: "not_a_cat", guess_confidence: 0.3 })).toBe("Maybe not a cat");
    expect(guessCaption({ guess: null, guess_confidence: null })).toBeNull();
  });
});

describe("photoTag", () => {
  test("tags the three answers a name does not already say", () => {
    expect(photoTag({ review: "skip", label: null })).toEqual({ kind: "skip", text: "Not used" });
    expect(photoTag({ review: "both", label: null })).toEqual({ kind: "both", text: "Both cats" });
    expect(photoTag({ review: "not_a_cat", label: "not_a_cat" })).toEqual({ kind: "not_a_cat", text: "Not a cat" });
  });

  test("a named or unanswered photo has no tag", () => {
    expect(photoTag({ review: "Kitty", label: "Kitty" })).toBeNull();
    expect(photoTag({ review: null, label: null })).toBeNull();
  });

  test("falls back to what the photo is trained as when there is no answer of its own", () => {
    expect(photoTag({ review: null, label: "skip" })).toEqual({ kind: "skip", text: "Not used" });
  });
});

describe("tallying a sitting", () => {
  const labels = ["Pancake", "Kitty", "Kitty", "both", "not_a_cat", "skip", "skip", "follow"];

  test("sorts answers by what they mean, cats in roster order, undo not counted", () => {
    expect(tallyAnswers(labels, ["Kitty", "Pancake"])).toEqual({
      total: 7,
      named: [
        { cat: "Kitty", count: 2 },
        { cat: "Pancake", count: 1 },
      ],
      both: 1,
      notACat: 1,
      skipped: 2,
    });
  });

  test("a cat that is no longer on the roster still counts, after the roster's cats", () => {
    expect(tallyAnswers(["Whiskers", "Kitty"], ["Kitty"]).named).toEqual([
      { cat: "Kitty", count: 1 },
      { cat: "Whiskers", count: 1 },
    ]);
  });

  test("rows keep named, both, not a cat and not used apart, and leave out what nobody used", () => {
    expect(tallyRows(tallyAnswers(labels, ["Kitty", "Pancake"])).map((row) => [row.kind, row.text, row.count])).toEqual([
      ["cat", "Kitty", 2],
      ["cat", "Pancake", 1],
      ["both", "Both cats", 1],
      ["not_a_cat", "Not a cat", 1],
      ["skip", "Not used", 2],
    ]);
    expect(tallyRows(tallyAnswers(["Kitty"], ["Kitty"]))).toHaveLength(1);
  });

  test("the total reads as a count of photos", () => {
    expect(photosCheckedLabel(1)).toBe("1 photo checked");
    expect(photosCheckedLabel(12)).toBe("12 photos checked");
    expect(photosCheckedLabel(1234, "en-US")).toBe("1,234 photos checked");
  });
});
