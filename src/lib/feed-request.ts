/** Pure state machine for what the hero's Hold button shows between "the request was sent" and
 * "the feeder is actually dispensing" -- the two are not the same instant. `kibble.feed`
 * resolving only means Home Assistant accepted the service call, not that the MCU has begun
 * turning the auger; the daemon still has to relay the command and the `feeding` binary sensor
 * still has to flip. This machine models exactly that gap so the pill can read "Requesting…"
 * honestly instead of jumping straight to "Feeding" on a request that might still fail silently.
 *
 * Kept free of the timer/entity-watching plumbing (`kibble-card.ts` owns the interval that
 * calls `feedRequestTick` and the `willUpdate` comparison that calls
 * `feedRequestFeedingChanged`) so the requesting -> feeding -> idle handoff, and its timeout,
 * are directly unit testable against plain booleans and elapsed milliseconds.
 *
 * This machine starts only once the network call has already resolved -- `kibble-card.ts`'s own
 * `sending`/network-error handling covers the call itself (a rejected promise never reaches
 * `feedRequestSubmitted`) and is unchanged by this module.
 */

export type FeedRequestPhase = "idle" | "requesting" | "feeding" | "timeout";

export interface FeedRequestState {
  phase: FeedRequestPhase;
  elapsedMs: number;
}

export const FEED_REQUEST_IDLE: FeedRequestState = { phase: "idle", elapsedMs: 0 };

export interface FeedRequestConfig {
  /** How long to wait for the `feeding` entity to turn on before giving up. */
  timeoutMs: number;
}

/** The feeder acks over its own link well under a second in every observed case; 10 s leaves
 * generous headroom for a slow round trip without leaving the pill reading "Requesting…" for a
 * mistaken eternity when something really has gone wrong. */
export const DEFAULT_FEED_REQUEST_CONFIG: FeedRequestConfig = { timeoutMs: 10_000 };

/** The service call resolved: start waiting for the feeder to confirm it. Safe to call from any
 * phase -- a fresh request always restarts the wait from zero, discarding whatever the machine
 * was doing before (an abandoned prior wait, a lingering timeout). */
export function feedRequestSubmitted(): FeedRequestState {
  return { phase: "requesting", elapsedMs: 0 };
}

/** Advances the clock by `deltaMs`. A no-op outside `requesting`: `idle` and `timeout` are
 * resting states with nothing to advance, and `feeding` only ever ends when the entity itself
 * says so (`feedRequestFeedingChanged`), never on a clock. Reaching `config.timeoutMs` settles
 * into `timeout`, clamped there rather than overshooting past it -- mirrors `hold-progress.ts`'s
 * own settle-at-the-boundary shape. */
export function feedRequestTick(state: FeedRequestState, deltaMs: number, config: FeedRequestConfig): FeedRequestState {
  if (state.phase !== "requesting") return state;
  const elapsedMs = state.elapsedMs + deltaMs;
  if (elapsedMs >= config.timeoutMs) return { phase: "timeout", elapsedMs: config.timeoutMs };
  return { phase: "requesting", elapsedMs };
}

/** The real `feeding` entity's own state, read every render. Turning on always lands on
 * `feeding` regardless of the machine's current phase -- a scheduled feed, a feed started from
 * the feeder's own physical button, or one fired from another dashboard never passes through
 * this card's `requesting` phase at all, but the pill must still show reality once the entity
 * says dispensing has started. Turning off only matters coming from `feeding` itself; every
 * other phase already reads as not-feeding and is left alone (in particular, a stray "off"
 * confirmation must never cut a live `requesting`/`timeout` wait short). */
export function feedRequestFeedingChanged(state: FeedRequestState, feeding: boolean): FeedRequestState {
  if (feeding) return { phase: "feeding", elapsedMs: 0 };
  if (state.phase === "feeding") return FEED_REQUEST_IDLE;
  return state;
}

/** Explicit reset back to rest -- used once a `timeout` message has been shown for its own
 * display window, or whenever the surrounding request state needs to force the machine back to
 * idle (the network call itself failing is handled by `kibble-card.ts` before this machine is
 * ever entered, but a fresh hold press must still be able to clear a stale `timeout`). */
export function feedRequestReset(): FeedRequestState {
  return FEED_REQUEST_IDLE;
}
