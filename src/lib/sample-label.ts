/** The two WS calls an answer goes through: `kibble/sample/label` (one photo) and
 * `kibble/session/ate` (who ate, for a visit). Thin, injectable wrappers kept free of card state;
 * `answer-sync.ts` decides when they run, and the outbox in front of them makes sure an answer
 * is never lost. Both are idempotent on the server, so repeating one is always safe.
 */

import type { HomeAssistant, SampleLabelResult, VisitResult } from "../types";

export interface SampleLabelRequest {
  sampleUid: string;
  /** A cat name, `"both"`, `"not_a_cat"`, `"skip"` (never used for learning), or `"follow"`
   * (takes the photo's answer back). */
  label: string;
}

export interface AteRequest {
  /** The visit's own uid (`VisitResult.uid`). */
  visitUid: string;
  /** The cats that ate. */
  ate: readonly string[];
}

export async function labelSample(hass: Pick<HomeAssistant, "callWS">, entryId: string, request: SampleLabelRequest): Promise<SampleLabelResult> {
  if (!hass.callWS) throw new Error("Not connected.");
  return (await hass.callWS({
    type: "kibble/sample/label",
    entry_id: entryId,
    sample_uid: request.sampleUid,
    label: request.label,
  })) as SampleLabelResult;
}

export async function labelAte(hass: Pick<HomeAssistant, "callWS">, entryId: string, request: AteRequest): Promise<VisitResult> {
  if (!hass.callWS) throw new Error("Not connected.");
  const result = (await hass.callWS({
    type: "kibble/session/ate",
    entry_id: entryId,
    uid: request.visitUid,
    ate: [...request.ate],
  })) as { visit: VisitResult };
  return result.visit;
}
