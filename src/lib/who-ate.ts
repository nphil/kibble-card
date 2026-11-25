/** The one follow-up question left after photo answers: when two cats were at a meal and the
 * feeder's own data cannot say who ate. Kibble says so in the answer it sends back
 * (`VisitResult.needs_ate`); the card then asks once, on a single screen, and never asks in the
 * single-cat flow. Pure so the trigger and the buttons can be tested.
 */

import type { VisitResult } from "../types";

export interface AteQuestion {
  /** The visit the answer belongs to (`kibble/session/ate`'s `uid`). */
  visitUid: string;
  /** The cats the photo answers named, in Kibble's order. */
  cats: string[];
  /** When the visit started, unix seconds: shown so the question is about one meal. */
  start: number;
}

/** The question to ask after a photo answer came back, or `null`: nothing is open, the visit
 * was already asked about in this sitting, or there are not two cats to choose between. */
export function ateQuestionFor(visit: VisitResult, start: number, asked: ReadonlySet<string>): AteQuestion | null {
  if (!visit.needs_ate || asked.has(visit.uid)) return null;
  const cats = visit.cats.map((entry) => entry.cat);
  return cats.length >= 2 ? { visitUid: visit.uid, cats, start } : null;
}

export interface AteOption {
  id: string;
  text: string;
  /** The cats that ate if this button is tapped. */
  ate: string[];
}

/** One button per cat, plus "Both" when there are exactly two. */
export function ateOptions(cats: readonly string[]): AteOption[] {
  const options: AteOption[] = cats.map((cat) => ({ id: "ate:" + cat, text: cat, ate: [cat] }));
  if (cats.length === 2) options.push({ id: "ate:both", text: "Both", ate: [...cats] });
  return options;
}
