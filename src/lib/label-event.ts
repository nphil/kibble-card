/** The one WS call every whole-event labelling action goes through: `kibble/label`. A thin,
 * injectable wrapper kept free of card state -- the caller still owns optimistic state,
 * busy/error, and refresh, exactly like every other WS action in these cards; this just gets
 * the request shape right in one place instead of three. Which samples actually get trained
 * is per-sample now (`kibble/sample/label`'s own `review` column on each one -- follow, skip,
 * or an override), so this call never selects samples of its own; see `sample-label.ts` for
 * the single-photo counterpart.
 */

import type { HomeAssistant, TimelineEvent } from "../types";

export interface LabelRequest {
  uids: string[];
  /** A cat name, `"not_a_cat"`, or `"unknown"` (reviewed as genuinely undecidable). */
  label: string;
}

export async function labelEvents(hass: Pick<HomeAssistant, "callWS">, entryId: string, request: LabelRequest): Promise<TimelineEvent[]> {
  if (!hass.callWS) throw new Error("Not connected.");
  const result = (await hass.callWS({
    type: "kibble/label",
    entry_id: entryId,
    uids: request.uids,
    label: request.label,
  })) as { events: TimelineEvent[] };
  return result.events;
}
