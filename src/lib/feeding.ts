/** Pure feeder-status derivation and its display text. Kept free of hass/entity plumbing so the
 * unavailable/dispensing/idle boundary can be unit tested against plain state strings. */

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

/** Minutes-precision relative-time label ("Fed 2h ago"). `from`/`now` are both real Dates so the
 * rounding boundaries are exercised directly in tests, no fake timers required. */
export function relativeTime(from: Date, now: Date): string {
  const diffMinutes = Math.floor(Math.max(0, now.getTime() - from.getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/** The single status line shown with the bowl: never a raw state string, always the interface's
 * own voice. */
export function statusText(status: FeederStatus, lastFedRelative: string | null): string {
  if (status === "unreachable") return "Feeder unreachable \u2014 check that kibbled is running";
  if (status === "dispensing") return "Dispensing\u2026";
  return lastFedRelative ? `Fed ${lastFedRelative}` : "Ready to feed";
}
