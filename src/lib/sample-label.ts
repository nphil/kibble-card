/** The one WS call a single-photo correction goes through: `kibble/sample/label`. Mirrors
 * `label-event.ts`'s shape exactly -- a thin, injectable wrapper kept free of card state; the
 * caller still owns which tile is busy, any error, and splicing the returned sample back into
 * whatever `Sample[]` it is showing (the labelling sheet's own `samples` prop, refreshed by its
 * parent card exactly like every other WS action here).
 */

import type { HomeAssistant, Sample } from "../types";

export interface SampleLabelRequest {
  sampleUid: string;
  /** A cat name, `"not_a_cat"`, `"skip"`, or `"follow"` (clears a previous override). */
  label: string;
}

export async function labelSample(hass: Pick<HomeAssistant, "callWS">, entryId: string, request: SampleLabelRequest): Promise<Sample> {
  if (!hass.callWS) throw new Error("Not connected.");
  const result = (await hass.callWS({
    type: "kibble/sample/label",
    entry_id: entryId,
    sample_uid: request.sampleUid,
    label: request.label,
  })) as { sample: Sample };
  return result.sample;
}
