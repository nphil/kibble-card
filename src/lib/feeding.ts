/** Pure feeder-status derivation and its display text. Kept free of hass/entity plumbing so the
 * unavailable/dispensing/idle boundary can be unit tested against plain state strings. Relative-
 * time formatting itself lives in `relative-time.ts` (shared with the sentence-form presentation
 * other cards use); import `relativeTimeCompact` from there directly. */

export type FeederStatus = "idle" | "dispensing" | "unreachable";

/** `coreStates` is every essential sensor's raw HA state string (feeding, both bowl-fill
 * sensors, schedule — whatever the device actually resolved). They share one coordinator, so in
 * practice they go unavailable together; requiring *all* of them down (rather than any one) is
 * what keeps a single odd sensor from reading as a whole-feeder outage. */
export function deriveFeederStatus(
  coreStates: Array<string | undefined>,
  feedingState: string | undefined,
): FeederStatus {
  const isDown = (state: string | undefined) => state === undefined || state === "unavailable" || state === "unknown";
  if (coreStates.length === 0 || coreStates.every(isDown)) {
    return "unreachable";
  }
  return feedingState === "on" ? "dispensing" : "idle";
}

/** The single status line shown with the bowl: never a raw state string, always the interface's
 * own voice. */
export function statusText(status: FeederStatus, lastFedRelative: string | null): string {
  if (status === "unreachable") return "Feeder unreachable \u2014 check that kibbled is running";
  if (status === "dispensing") return "Dispensing\u2026";
  return lastFedRelative ? `Fed ${lastFedRelative}` : "Ready to feed";
}
