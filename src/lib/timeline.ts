/** Pure timeline presentation: verb-by-class, feed-row copy, and day-separator grouping. Kept
 * free of hass/WS plumbing so the grouping boundaries (midnight, "Today"/"Yesterday") and the
 * feed sentence assembly are directly unit testable against plain timeline items. `kibble/
 * timeline` already merges detections and feeds server-side, newest first -- this module groups
 * that single merged list into day buckets, it never re-sorts or re-merges two separate lists.
 */

import type { TimelineFeedItem, TimelineItem } from "../types";

/** Never a raw class string, even for a class this card doesn't yet know about -- "was seen" is
 * the honest fallback for anything the agent might add later. */
export function detectionVerb(detectionClass: string): string {
  if (detectionClass === "eat") return "ate";
  if (detectionClass === "visit") return "came by";
  if (detectionClass === "face" || detectionClass === "track") return "identified";
  return "was seen";
}

/** "Fed 5 portions from hopper 1" / "Fed 1 portion" / "Fed" -- `outcome` is never shown: the
 * agent has no failed/cancelled feed variant, so there is nothing honest to report there. */
export function feedSummary(item: Pick<TimelineFeedItem, "amount" | "hopper">): string {
  if (item.amount == null) return "Fed";
  const portionWord = item.amount === 1 ? "portion" : "portions";
  const hopperClause = item.hopper && item.hopper !== "both" ? ` from hopper ${item.hopper}` : "";
  return `Fed ${item.amount} ${portionWord}${hopperClause}`;
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
