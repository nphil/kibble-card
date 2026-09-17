/** Pure timeline presentation: headline text, visit filtering, feed-row copy, and day-separator
 * grouping. Kept free of hass/WS plumbing so the grouping boundaries (midnight, "Today"/
 * "Yesterday"), the "hide bare visits" rule and the feed sentence assembly are directly unit
 * testable against plain timeline items. `kibble/timeline` already merges identifications,
 * visits, eats and feed cycles server-side, newest first -- this module only groups that single
 * merged list into day buckets and decides what each row says, it never re-sorts or re-merges.
 */

import type { TimelineFeedItem, TimelineIdentifiedItem, TimelineEatItem, TimelineItem, TimelineVisitItem } from "../types";

/** The row headline for every non-feed kind. Never a raw class string: an "identified" row
 * always names the cat the integration resolved (falling back to its own literal "Unknown cat"
 * upstream, never here), an "eat" with nobody identified nearby reads as "A cat ate", and a
 * (normally hidden) "visit" reads as "A cat came by" -- the same honest, ungoessed copy this
 * card has always used for a detection with no name attached. */
export function detectionHeadline(item: TimelineIdentifiedItem | TimelineEatItem | TimelineVisitItem): string {
  if (item.kind === "identified") {
    if (item.paired_class === "eat") return `${item.cat} ate`;
    if (item.paired_class === "face") return `${item.cat} was here`;
    return `${item.cat} was at the bowl`;
  }
  if (item.kind === "eat") return "A cat ate";
  return "A cat came by";
}

/** Drops bare "visit" rows unless `showVisits` is set. `kibble/timeline`'s own `include_visits`
 * parameter should already keep these out of the response by default -- this is the card's own
 * belt-and-suspenders guard (and what makes the "hide visits" rule directly unit testable
 * without a mock WS connection), not a substitute for asking the server to skip the work. */
export function filterVisits(items: TimelineItem[], showVisits: boolean): TimelineItem[] {
  if (showVisits) return items;
  return items.filter((item) => item.kind !== "visit");
}

export interface FeedSummary {
  /** "Fed 5 portions from hopper 1" / "Fed 1 portion" / "Fed" -- `outcome` is never shown: the
   * agent has no failed/cancelled feed variant, so there is nothing honest to report there. */
  headline: string;
  /** True for a scheduler-fired cycle (`!manual`) -- the caller renders this as a quiet,
   * secondary tag alongside `headline` rather than folding it into the same sentence, so it
   * reads as a subtle detail rather than a competing headline. */
  scheduled: boolean;
}

export function feedSummary(item: Pick<TimelineFeedItem, "amount" | "hopper" | "manual">): FeedSummary {
  const scheduled = !item.manual;
  if (item.amount == null) return { headline: "Fed", scheduled };
  const portionWord = item.amount === 1 ? "portion" : "portions";
  const hopperClause = item.hopper && item.hopper !== "both" ? ` from hopper ${item.hopper}` : "";
  return { headline: `Fed ${item.amount} ${portionWord}${hopperClause}`, scheduled };
}

export interface TimelineDay {
  label: string;
  items: TimelineItem[];
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dayLabel(date: Date, now: Date): string {
  if (dayKey(date) === dayKey(now)) return "Today";
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (dayKey(date) === dayKey(yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

/** Groups an already newest-first `items` list into calendar-day buckets in local time,
 * labelling today/yesterday by name and everything older with a weekday and date. `now` is
 * passed in (not read internally) so "today" is exercised directly in tests with no fake clock.
 */
export function groupByDay(items: TimelineItem[], now: Date): TimelineDay[] {
  const days: TimelineDay[] = [];
  let currentKey: string | null = null;
  for (const item of items) {
    const date = new Date(item.ts * 1000);
    const key = dayKey(date);
    if (key !== currentKey) {
      currentKey = key;
      days.push({ label: dayLabel(date, now), items: [] });
    }
    days[days.length - 1]!.items.push(item);
  }
  return days;
}
