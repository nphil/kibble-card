/** Exponential backoff schedule for `kibble-live-hero`'s automatic reconnect: 1s, 2s, 4s, ...
 * capped at 30s, so a feeder that drops its stream (Wi-Fi hiccup, Scrypted restart) is retried
 * quickly at first without hammering the WebRTC signalling endpoint once it stays down. Kept
 * free of DOM/timer plumbing so the schedule itself is directly unit testable.
 */

export const RECONNECT_BASE_MS = 1000;
export const RECONNECT_MAX_MS = 30000;

/** The delay the *next* attempt should use, given the delay just used (`current`). Doubles each
 * time, capped at `RECONNECT_MAX_MS`. */
export function nextReconnectDelay(current: number): number {
  return Math.min(current * 2, RECONNECT_MAX_MS);
}
