/** Builds the ONE toast an event sheet ends with: how many photos were answered while it was open,
 * as a single calm sentence, never a toast per tap. Pure and DOM-free so the exact wording is
 * directly unit testable.
 */

import { countOf } from "./format-count";

/** `null` when nothing was answered, so no toast shows at all. */
export function reviewSummaryMessage(photosUpdated: number, locale?: string): string | null {
  if (!(photosUpdated > 0)) return null;
  return `${countOf(photosUpdated, "photo", "photos", locale)} updated`;
}
