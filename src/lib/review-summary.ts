/** Builds the ONE toast a labelling-sheet session ends with (ux-spec.md section A.8): every
 * event label and every per-photo correction that actually saved while the sheet was open,
 * reduced to one calm sentence -- "Saved: Pancake ate at 12:00 PM, 2 photos updated" -- never a
 * toast per tap. Pure and DOM-free so the exact wording is directly unit testable; shared by
 * `kibble-timeline-card` and `kibble-cats-card` so the two parents can never drift apart on it.
 */

import type { TimelineEvent } from "../types";
import { catVerb, timeLabel } from "./timeline";

/** One successful `kibble/label` save recorded during the session, keyed by the caller as
 * `uid -> latest entry` (a grouped row's pager can label more than one event before the sheet
 * closes; relabelling the SAME event again -- changing your mind -- must show only its final
 * result, not both). `"unknown"` (Can't tell/Not sure) is a legitimate save server-side but
 * carries no reportable fact -- callers may still record it here; it is simply skipped when the
 * sentence is built. */
export interface ReviewedEventLabel {
  uid: string;
  /** The event exactly as the server returned it after the label landed -- `start`/`kind`/`cat`
   * all reflect the saved result, never the optimistic guess. */
  event: Pick<TimelineEvent, "kind" | "open" | "start">;
  /** The label actually sent: a cat name, `"not_a_cat"`, or `"unknown"`. Carried separately from
   * `event.cat` so a `"not_a_cat"` save (whose `event.cat` is `null`) still renders correctly. */
  label: string;
}

export interface ReviewSummaryInput {
  /** Every event label saved this session, oldest first; a repeated uid is deduped to its
   * latest entry while keeping its first-seen position, so paging back and re-labelling the
   * same event reads as one line, not two. */
  events: ReviewedEventLabel[];
  /** Distinct photos corrected this session via the photo viewer -- a count, not a list: the
   * sentence only ever says how many, never which. */
  photosUpdated: number;
}

function eventFragment(entry: ReviewedEventLabel, locale: string | undefined): string | null {
  if (entry.label === "unknown") return null; // nothing decided -- nothing to report
  if (entry.label === "not_a_cat") return "Not a cat";
  return `${entry.label} ${catVerb(entry.event)} at ${timeLabel(entry.event.start, locale)}`;
}

function photosFragment(count: number): string | null {
  if (count <= 0) return null;
  return `${count} photo${count === 1 ? "" : "s"} updated`;
}

/** `null` when nothing was actually saved (an empty session, or one that only ever sent
 * `"unknown"`) -- callers show no toast at all in that case rather than an empty "Saved:". */
export function reviewSummaryMessage(input: ReviewSummaryInput, locale?: string): string | null {
  const latestByUid = new Map<string, ReviewedEventLabel>();
  for (const entry of input.events) latestByUid.set(entry.uid, entry);
  const fragments: string[] = [];
  for (const entry of latestByUid.values()) {
    const fragment = eventFragment(entry, locale);
    if (fragment) fragments.push(fragment);
  }
  const photos = photosFragment(input.photosUpdated);
  if (photos) fragments.push(photos);
  if (fragments.length === 0) return null;
  return `Saved: ${fragments.join(", ")}`;
}
