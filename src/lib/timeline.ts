/** Pure timeline presentation: headline text, visit filtering, feed-row copy, and day-separator
 * grouping. Kept free of hass/WS plumbing so the grouping boundaries (midnight, "Today"/
 * "Yesterday"), the "hide bare visits" rule and the feed sentence assembly are directly unit
 * testable against plain timeline items. `kibble/timeline` already merges identifications,
 * visits, eats and feed cycles server-side, newest first -- this module only groups that single
 * merged list into day buckets and decides what each row says, it never re-sorts or re-merges.
 */

import type { TimelineFeedItem, TimelineIdentifiedItem, TimelineEatItem, TimelineItem, TimelineVisitItem } from "../types";

export interface ComparePairRefs {
  before: string | null;
  after: string | null;
}

/** Whether a row carries the new before/after eat-compare pair the device may attach
 * alongside (or instead of) its plain `image` -- see `KibbleTimelineCard`'s doc comment and
 * `types.ts`'s `image_before`/`image_after` fields. `null` when neither side is present, so a
 * row from an agent that predates the pair (or an identification/eat with nothing paired)
 * renders exactly as it always has. */
export function comparePairFor(item: Pick<TimelineIdentifiedItem, "image_before" | "image_after"> | Pick<TimelineEatItem, "image_before" | "image_after">): ComparePairRefs | null {
  const before = item.image_before ?? null;
  const after = item.image_after ?? null;
  if (!before && !after) return null;
  return { before, after };
}

/** A feed row's own before/after dish pair -- unlike the eat-compare pair above, `before`/
 * `after` are never optional on `TimelineFeedItem` (every agent has always sent both keys,
 * `null` or not), so this only ever needs the same "both missing reads as no pair" rule, not
 * `??`'s optional-key handling. `null` for a feed cycle that captured neither photo (an older
 * agent, or a cycle Kibble couldn't snapshot) -- the row must say so, never render an empty
 * compare tile in its place; see `KibbleTimelineCard#_renderFeed`. */
export function feedPhotos(item: Pick<TimelineFeedItem, "before" | "after">): ComparePairRefs | null {
  if (!item.before && !item.after) return null;
  return { before: item.before, after: item.after };
}

export interface RowThumbnail {
  name: string;
  kind: string;
}

/** The single filename+kind to show as a row's *collapsed* thumbnail: the plain `image` (with
 * its own `imageKind`) when present, so a row the device hasn't upgraded yet -- or that has
 * nothing paired at all -- looks exactly as it always has. Only once `image` is `null` does a
 * compare pair's `after` (post-eat, the more telling half) or `before` stand in, always read
 * back via the `event` image kind the pair itself uses. `null` when there is nothing to show at
 * all. */
export function resolveThumbnail(image: string | null, imageKind: string, pair: ComparePairRefs | null): RowThumbnail | null {
  if (image) return { name: image, kind: imageKind };
  const name = pair?.after ?? pair?.before ?? null;
  return name ? { name, kind: "event" } : null;
}

/** The row headline for every non-feed kind. Never a raw class string: an "identified" row
 * always names the cat the integration resolved (falling back to its own literal "Unknown cat"
 * upstream, never here), an "eat" with nobody identified nearby reads as "A cat ate", and a
 * (normally hidden) "visit" reads as "A cat came by" -- the same honest, ungoessed copy this
 * card has always used for a detection with no name attached. */
export function detectionHeadline(item: TimelineIdentifiedItem | TimelineEatItem | TimelineVisitItem): string {
  // Only the vendor's `eat` detection means the cat was actually at the bowl eating; a
  // `visit`/`face`/unpaired identification is just "seen in view" -- the camera sees the whole
  // room, and "at the bowl" for a cat walking past was a lie.
  if (item.kind === "identified") return item.paired_class === "eat" ? `${item.cat} ate` : `${item.cat} was here`;
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
  /** True when the feeder's MCU never confirmed the dispense (`confirmed: false`): the food
   * went out, but the amount in `headline` is what was asked for rather than what the
   * hardware measured. Rendered as a quiet tag next to `scheduled`, for the same reason --
   * the row is real, one number on it is second-hand. */
  unconfirmed: boolean;
}

export function feedSummary(item: Pick<TimelineFeedItem, "amount" | "hopper" | "manual" | "confirmed">): FeedSummary {
  const scheduled = !item.manual;
  const unconfirmed = item.confirmed === false;
  if (item.amount == null) return { headline: "Fed", scheduled, unconfirmed };
  const portionWord = item.amount === 1 ? "portion" : "portions";
  const hopperClause = item.hopper && item.hopper !== "both" ? ` from hopper ${item.hopper}` : "";
  return { headline: `Fed ${item.amount} ${portionWord}${hopperClause}`, scheduled, unconfirmed };
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

/** The scrolling rail's height cap as an inline style.
 *
 * `none` (or an empty setting) means the caller wants the old unbounded behaviour, which is
 * expressed as no `max-height` at all rather than a huge one -- a large cap still creates a
 * scroll container, and a nested scroller the user never asked for is worse than a long page.
 *
 * The default mixes a viewport unit with a pixel ceiling: `60vh` keeps a phone's rail
 * proportionate to its screen, and the 560 px ceiling stops a desktop monitor from handing
 * the timeline half a metre of glass. */
export function railStyle(maxHeight: string | undefined): string {
  const value = (maxHeight ?? "").trim();
  if (value === "none") return "";
  return `max-height:${value || "min(60vh, 560px)"}`;
}
