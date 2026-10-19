/** Pure timeline presentation: title/meta text, thumbnail selection, review-affordance gating,
 * consecutive-event collapsing and day-separator grouping. Kept free of hass/WS plumbing so every
 * boundary (the 5-minute collapse window, midnight, "Today"/"Yesterday") is directly unit
 * testable against plain `TimelineEvent`s. `kibble/timeline` already returns events newest
 * first; this module only collapses and buckets that single list, it never re-sorts it.
 */

import type { Asset, TimelineEvent } from "../types";

/** The fixed square thumbnail for a row: the best body crop, the scene frame when no crop was
 * captured, or `null` for a feed (feed rows always show a neutral icon tile, never a photo, so
 * the amount is what the user reads, not a picture of a bowl) or an event with no evidence at
 * all (spool pressure dropped every asset for this one). */
export function rowThumbAsset(event: Pick<TimelineEvent, "kind" | "thumb" | "scene">): Asset | null {
  if (event.kind === "feed") return null;
  return event.thumb ?? event.scene ?? null;
}

/** Whether a row needs the small "Identify" affordance on its thumbnail: a completed (not open)
 * visit or meal nobody -- engine or person -- has named. Feeds have no identity to assign; an
 * open event is still gathering evidence, so identification waits for it to close. */
export function needsIdentification(event: Pick<TimelineEvent, "kind" | "cat" | "open">): boolean {
  return event.kind !== "feed" && !event.open && event.cat === null;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) return `${remainder} sec`;
  return remainder === 0 ? `${minutes} min` : `${minutes} min ${remainder} sec`;
}

/** An observed meal's length, only once it has actually closed with a real end after its start.
 * `null` for a visit, a feed, an open meal, or any event missing a usable end -- adjacent events
 * are not a clock. */
export function eventDuration(event: Pick<TimelineEvent, "kind" | "start" | "end" | "open">): string | null {
  if (event.kind !== "eat" || event.open || event.end == null || event.end <= event.start) return null;
  return formatDuration(event.end - event.start);
}
/** A together row's union span, including an open lane through the caller's supplied time. */
export function spanDuration(start: number, end: number): string | null {
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return formatDuration(Math.floor(end - start));
}

/** "ate" / "came by" / "is eating" / "is here" -- the verb half of a row's title, kept separate
 * from `eventTitle` so a renderer that tints the cat's own name in its colour can still share
 * the exact same open/closed and eat/visit logic instead of re-deriving it. */
export function catVerb(event: Pick<TimelineEvent, "kind" | "open">): string {
  if (event.open) return event.kind === "eat" ? "is eating" : "is here";
  return event.kind === "eat" ? "ate" : "came by";
}

/** The short row title: names the cat once one is known -- "Pancake ate", "Kitty came by". A row
 * with no cat yet never reaches this function while closed: the card renders its own inline
 * "Who was this?" picker instead (see `needsIdentification`), so "Unknown cat"/"A cat ate"/"A
 * cat came by" are never rendered anywhere. An *open* unidentified event is still gathering
 * evidence -- premature to ask who it is -- so it reads as a live, honest "Someone ..." state
 * instead; this is the only case where `eventTitle` is called with `cat === null`. */
export function eventTitle(event: Pick<TimelineEvent, "kind" | "cat" | "open" | "feed">): string {
  if (event.kind === "feed") return feedTitle(event);
  if (!event.cat) return event.kind === "eat" ? "Someone is eating" : "Someone is here";
  return `${event.cat} ${catVerb(event)}`;
}

function portionWord(n: number): string {
  return `${n} portion${n === 1 ? "" : "s"}`;
}

/** The timeline row's own sentence for a feed -- as specific as the recorded facts allow, and
 * never a hopper word single mode can't have. In order:
 * - no feed detail at all, or the amount itself unknown: "Fed" (an older row, or a cycle the
 *   daemon couldn't confirm even the amount for).
 * - single mode, OR dual with no per-side breakdown (a legacy row that predates per-side
 *   tracking -- `sides` is `[]` there too, but `portions` is still a real total): the bare
 *   total, "Fed 1 portion" / "Fed 3 portions".
 * - dual, one side fired: names its food when the hopper had one, "Fed 2 portions of kibble",
 *   otherwise the hopper number, "Fed 2 portions from hopper 1".
 * - dual, both sides fired and both are named: "Fed 1 kibble and 2 freeze-dried".
 * - dual, both sides fired, not both named: "Fed 1 portion from each hopper" when the amounts
 *   match, otherwise "Fed 2 from hopper 1 and 1 from hopper 2".
 */
export function feedTitle(event: Pick<TimelineEvent, "feed">): string {
  const feed = event.feed;
  if (!feed || feed.portions == null) return "Fed";
  if (feed.single || feed.sides.length === 0) return `Fed ${portionWord(feed.portions)}`;
  if (feed.sides.length === 1) {
    const [side] = feed.sides;
    const clause = side.food ? `of ${side.food}` : `from hopper ${side.hopper}`;
    return `Fed ${portionWord(side.portions)} ${clause}`;
  }
  const [first, second] = feed.sides;
  if (first.food && second.food) {
    return `Fed ${first.portions} ${first.food} and ${second.portions} ${second.food}`;
  }
  if (first.portions === second.portions) {
    return `Fed ${portionWord(first.portions)} from each hopper`;
  }
  return `Fed ${first.portions} from hopper ${first.hopper} and ${second.portions} from hopper ${second.hopper}`;
}

/** The time half of the meta line, in the viewer's own locale/timezone with no leading zero on
 * the hour ("7:58 PM", not "07:58 PM") -- every event carries unix seconds, never a
 * pre-formatted string, so this is the one place clock formatting happens. `locale` is the
 * viewer's own `hass.locale`/`hass.language`; `undefined` falls back to the browser default. */
export function timeLabel(unixSeconds: number, locale?: string): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

/** The evidence photos for a meal or feed's compact inline compare pair -- `null` unless both
 * `before` and `after` were actually captured (never substitute a single photo for a missing
 * side) and the kind is one that has a "before/after the food" concept at all. */
export function compareAssets(event: Pick<TimelineEvent, "kind" | "before" | "after">): { before: Asset; after: Asset } | null {
  if (event.kind !== "eat" && event.kind !== "feed") return null;
  if (!event.before || !event.after) return null;
  return { before: event.before, after: event.after };
}

/** One row in the timeline. Together rows keep every lane so one review action can open the
 * correct event without ever combining labels or counts. */
export interface EventGroup {
  event: TimelineEvent;
  events: TimelineEvent[];
  together?: boolean;
  start?: number;
  end?: number;
}

export const COLLAPSE_WINDOW_SECONDS = 5 * 60;

function joinedNames(names: string[]): string {
  if (names.length < 2) return names[0] ?? "";
  if (names.length === 2) return names[0] + " and " + names[1];
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
}

/** Orders the names shown in a combined row: eaters first, then known cats. */
export function orderTogetherEvents(events: readonly TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((left, right) =>
    Number(right.kind === "eat") - Number(left.kind === "eat") || Number(left.cat === null) - Number(right.cat === null),
  );
}

/** Describes the overlapping session without implying there is a separate unknown-cat lane. */
export function togetherTitle(events: readonly TimelineEvent[]): string {
  const lanes = orderTogetherEvents(events);
  const names = lanes.map((lane) => lane.cat ?? "Who?");
  const sameKind = lanes.every((lane) => lane.kind === lanes[0]?.kind);
  const sameState = lanes.every((lane) => lane.open === lanes[0]?.open);
  if (sameKind && sameState && lanes[0]?.kind !== "feed") {
    const kind = lanes[0]?.kind;
    const verb = lanes[0]?.open ? (kind === "eat" ? "are eating" : "are here") : kind === "eat" ? "ate" : "came by";
    return joinedNames(names) + " " + verb;
  }
  return lanes.map((lane, index) => names[index] + " " + catVerb(lane)).join(", ");
}

/** Collapses overlapping lanes from a shared session first, then preserves the existing
 * consecutive same-cat grouping for every other event. */
export function groupConsecutive(events: readonly TimelineEvent[], now = Date.now() / 1000): EventGroup[] {
  const sessions = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    if (event.session === null || event.session === undefined) continue;
    const lanes = sessions.get(event.session) ?? [];
    lanes.push(event);
    sessions.set(event.session, lanes);
  }

  const togetherByUid = new Map<string, EventGroup>();
  for (const lanes of sessions.values()) {
    const ordered = [...lanes].sort((left, right) => left.start - right.start);
    let cluster: TimelineEvent[] = [];
    let clusterEnd = Number.NEGATIVE_INFINITY;
    const saveCluster = (): void => {
      if (cluster.length > 1) {
        const members = new Set(cluster.map((event) => event.uid));
        const rowEvents = events.filter((event) => members.has(event.uid));
        const start = Math.min(...rowEvents.map((event) => event.start));
        const end = Math.max(...rowEvents.map((event) => Math.max(event.start, event.end ?? now)));
        const group: EventGroup = { event: rowEvents[0]!, events: rowEvents, together: true, start, end };
        for (const event of rowEvents) togetherByUid.set(event.uid, group);
      }
      cluster = [];
      clusterEnd = Number.NEGATIVE_INFINITY;
    };
    for (const event of ordered) {
      const eventEnd = Math.max(event.start, event.end ?? now);
      if (cluster.length > 0 && event.start > clusterEnd) saveCluster();
      cluster.push(event);
      clusterEnd = Math.max(clusterEnd, eventEnd);
    }
    saveCluster();
  }

  const groups: EventGroup[] = [];
  const emitted = new Set<EventGroup>();
  for (const event of events) {
    const together = togetherByUid.get(event.uid);
    if (together) {
      if (!emitted.has(together)) {
        emitted.add(together);
        groups.push(together);
      }
      continue;
    }
    const last = groups[groups.length - 1];
    if (last && !last.together && last.event.kind === event.kind && last.event.cat === event.cat && last.event.start - event.start <= COLLAPSE_WINDOW_SECONDS) {
      last.events.push(event);
      continue;
    }
    groups.push({ event, events: [event] });
  }
  return groups.sort((left, right) => (right.start ?? right.event.start) - (left.start ?? left.event.start));
}

/** "2 visits" / "3 meals" / "2 feeds" -- a collapsed row's count, read as a plain noun phrase
 * rather than a bare "×2": the noun names what actually repeated. */
export function groupCountLabel(kind: TimelineEvent["kind"], count: number): string {
  const noun = kind === "eat" ? "meal" : kind === "feed" ? "feed" : "visit";
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export interface TimelineDay {
  label: string;
  groups: EventGroup[];
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

/** Buckets already newest-first, already-collapsed groups into calendar-day buckets in local
 * time (keyed by each group's representative event start), labelling today/yesterday by name
 * and everything older with a weekday and date. `now` is passed in (not read internally) so
 * "today" is exercised directly in tests with no fake clock. */
export function groupByDay(groups: readonly EventGroup[], now: Date): TimelineDay[] {
  const days: TimelineDay[] = [];
  let currentKey: string | null = null;
  for (const group of groups) {
    const date = new Date((group.start ?? group.event.start) * 1000);
    const key = dayKey(date);
    if (key !== currentKey) {
      currentKey = key;
      days.push({ label: dayLabel(date, now), groups: [] });
    }
    days[days.length - 1]!.groups.push(group);
  }
  return days;
}

/** The scrolling rail's default height cap -- see `KibbleTimelineCardConfig.max_height`'s own
 * doc for the reasoning; kept as a named constant so `railStyle` and its tests both refer to
 * the exact same value instead of a magic string repeated in two places. */
export const DEFAULT_RAIL_MAX_HEIGHT = "clamp(360px, calc(100dvh - 200px), 900px)";

/** The scrolling rail's height cap as an inline style. Unset means the default cap above --
 * a bounded, internally-scrolling rail is the default layout, so a busy day never turns the
 * whole dashboard into a page you scroll past to reach anything else. Only an explicit `none`
 * opts out, letting the card grow with its content and the page's own scroll carry it. */
export function railStyle(maxHeight: string | undefined): string {
  const value = (maxHeight ?? "").trim();
  if (value === "none") return "";
  return `max-height:${value || DEFAULT_RAIL_MAX_HEIGHT}`;
}
