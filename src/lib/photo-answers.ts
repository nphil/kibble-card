/** What a person can say about one photo, and how the card words it. Pure, so the buttons the
 * review queue, the event sheet and the photo viewer show are the same everywhere and tested once.
 *
 * Five answers exist, and what each one means for learning is literally true:
 *  - a cat name: the photo teaches Kibble "this is <cat>".
 *  - "Not a cat": the photo teaches Kibble "this is not a cat".
 *  - "Both in this photo" (only with exactly two cats): never used for learning; the visit
 *    records that both cats were there.
 *  - "Don't use": never used for learning, and taken out of it if it was used before.
 *  - undo (`follow`): takes the answer back.
 * "Don't use" and "Not a cat" are different and are never merged.
 */

import type { CatSummary, Sample } from "../types";
import { countOf } from "./format-count";

export type AnswerKind = "cat" | "both" | "not_a_cat" | "skip";

export interface AnswerOption {
  /** `cat:<name>`, `both`, `not_a_cat` or `skip`: unique within one set of options. */
  id: string;
  kind: AnswerKind;
  cat: string | null;
  /** The button text. */
  text: string;
  /** What `kibble/sample/label` is sent for this option. */
  value: string;
  /** A small second line, or `null`. */
  hint: string | null;
  /** The single key that picks this option, or `null` past the ninth. */
  hotkey: string | null;
}

export const NOT_USED_HINT = "Not used for learning";

/** The answer buttons in the order they are shown and numbered: every cat, then "Both in this
 * photo" (only when exactly two cats exist, the one case it can be true), "Not a cat", "Don't
 * use". */
export function answerOptions(cats: readonly Pick<CatSummary, "name">[]): AnswerOption[] {
  const options: Omit<AnswerOption, "hotkey">[] = cats.map((cat) => ({ id: "cat:" + cat.name, kind: "cat", cat: cat.name, text: cat.name, value: cat.name, hint: null }));
  if (cats.length === 2) options.push({ id: "both", kind: "both", cat: null, text: "Both in this photo", value: "both", hint: NOT_USED_HINT });
  options.push({ id: "not_a_cat", kind: "not_a_cat", cat: null, text: "Not a cat", value: "not_a_cat", hint: null });
  options.push({ id: "skip", kind: "skip", cat: null, text: "Don\u2019t use", value: "skip", hint: NOT_USED_HINT });
  return options.map((option, index) => ({ ...option, hotkey: index < 9 ? String(index + 1) : null }));
}

/** The option a saved answer (`Sample.review`, or a label just sent) corresponds to. */
export function optionIdForAnswer(answer: string | null): string | null {
  if (answer === null || answer === "follow") return null;
  return answer === "both" || answer === "not_a_cat" || answer === "skip" ? answer : "cat:" + answer;
}

/** A guess at or above this probability reads "Looks like"; below it, "Maybe". */
export const GUESS_SURE = 0.6;

/** Which option the engine's own guess for this photo points at, so it can be pre-highlighted.
 * `null` when it has no guess, or names a cat that is not on the roster. */
export function guessOptionId(sample: Pick<Sample, "guess">, options: readonly AnswerOption[]): string | null {
  const id = optionIdForAnswer(sample.guess);
  return id !== null && options.some((option) => option.id === id) ? id : null;
}

/** The tiny word on the highlighted button: "Looks like Kitty", or a hedged "Maybe Kitty" when the
 * engine is unsure. `null` when there is no guess to show. */
export function guessCaption(sample: Pick<Sample, "guess" | "guess_confidence">): string | null {
  if (!sample.guess) return null;
  const sure = sample.guess_confidence === null || sample.guess_confidence >= GUESS_SURE;
  if (sample.guess === "not_a_cat") return sure ? "Probably not a cat" : "Maybe not a cat";
  return `${sure ? "Looks like" : "Maybe"} ${sample.guess}`;
}

export interface PhotoTag {
  kind: "skip" | "both" | "not_a_cat";
  text: string;
}

/** The small tag an answered photo wears in the event sheet and the viewer, for the three
 * answers a name does not already say. */
export function photoTag(sample: Pick<Sample, "review" | "label">): PhotoTag | null {
  switch (sample.review ?? sample.label) {
    case "skip":
      return { kind: "skip", text: "Not used" };
    case "both":
      return { kind: "both", text: "Both cats" };
    case "not_a_cat":
      return { kind: "not_a_cat", text: "Not a cat" };
    default:
      return null;
  }
}

// ---- Counts -----------------------------------------------------------------------------------

export interface AnswerTally {
  total: number;
  /** Photos named as a cat, per cat: the roster's order first, then any other name. Only cats
   * with at least one photo. */
  named: { cat: string; count: number }[];
  both: number;
  notACat: number;
  skipped: number;
}

/** Sorts a sitting's answers (the `label` sent for each photo) into what they mean: named per
 * cat, both cats, not a cat, not used. */
export function tallyAnswers(labels: Iterable<string>, cats: readonly string[]): AnswerTally {
  const named = new Map<string, number>();
  const tally: AnswerTally = { total: 0, named: [], both: 0, notACat: 0, skipped: 0 };
  for (const label of labels) {
    if (label === "follow") continue;
    tally.total++;
    if (label === "both") tally.both++;
    else if (label === "not_a_cat") tally.notACat++;
    else if (label === "skip") tally.skipped++;
    else named.set(label, (named.get(label) ?? 0) + 1);
  }
  const order = [...cats, ...[...named.keys()].filter((cat) => !cats.includes(cat))];
  tally.named = order.filter((cat) => named.has(cat)).map((cat) => ({ cat, count: named.get(cat)! }));
  return tally;
}

export interface TallyRow {
  kind: AnswerKind;
  cat: string | null;
  text: string;
  count: number;
}

/** The lines of the end-of-sitting summary: one per cat, then both, not a cat, not used; rows
 * nobody used are left out. */
export function tallyRows(tally: AnswerTally): TallyRow[] {
  const rows: TallyRow[] = tally.named.map(({ cat, count }) => ({ kind: "cat", cat, text: cat, count }));
  if (tally.both > 0) rows.push({ kind: "both", cat: null, text: "Both cats", count: tally.both });
  if (tally.notACat > 0) rows.push({ kind: "not_a_cat", cat: null, text: "Not a cat", count: tally.notACat });
  if (tally.skipped > 0) rows.push({ kind: "skip", cat: null, text: "Not used", count: tally.skipped });
  return rows;
}

/** "1 photo checked", "12 photos checked". */
export function photosCheckedLabel(total: number, locale?: string): string {
  return `${countOf(total, "photo", "photos", locale)} checked`;
}
