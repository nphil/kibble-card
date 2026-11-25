/** A minimal reactive WS query: one `hass.callWS` call with loading/data/error state, a manual
 * `refresh()`, and `sync()` to call from a card's `willUpdate` -- refetches when a caller-built
 * watch key changes (including the very first call), which is how every card here re-reads a
 * command when a relevant entity's push-fresh state changes, per DESIGN.md's data contract.
 * Each card owns one instance per query as a private field; this is not a cross-card cache.
 *
 * Opt-in robustness for a screen that must never go blank: `timeoutMs` fails a read that never
 * answers, and `retry` re-runs a failed read by itself on a backoff. A failure while data is
 * already on screen leaves that data in place and raises `reconnecting`, so the screen can say
 * so quietly instead of showing an error.
 */

import type { HomeAssistant } from "../types";
import { realTimers, retryDelay, withTimeout, type Timers } from "./backoff";

export interface WsQueryState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  /** The last read failed while earlier data is still shown, and a retry is on its way. Only a
   * query built with `retry` ever sets it. */
  reconnecting: boolean;
}

export interface WsQueryOptions {
  /** Wait (ms) before each automatic retry of a failed read; the last step repeats. Off when
   * omitted: the query then only re-runs when asked. */
  retry?: readonly number[];
  /** Fail a read that has not answered within this many ms. Off when omitted. */
  timeoutMs?: number;
  /** Injectable for tests. */
  timers?: Timers;
}

const INITIAL_STATE: WsQueryState<never> = { data: null, error: null, loading: false, reconnecting: false };

export class WsQuery<T> {
  private _lastWatched: string | null = null;
  private _requestId = 0;
  private _state: WsQueryState<T> = INITIAL_STATE;
  private _failures = 0;
  private _retryHandle: unknown = null;
  private _lastRun: (() => Promise<T>) | null = null;
  private readonly _onChange: () => void;
  private readonly _options: WsQueryOptions;
  private readonly _timers: Timers;

  constructor(onChange: () => void, options: WsQueryOptions = {}) {
    this._onChange = onChange;
    this._options = options;
    this._timers = options.timers ?? realTimers;
  }

  get state(): WsQueryState<T> {
    return this._state;
  }

  /** Call every `willUpdate`. `watchKey` (see `watchKey()` below) encodes every entity this
   * query cares about; a change refetches, an unchanged key is a no-op so a query never re-runs
   * on every unrelated re-render. */
  sync(watchKey: string, run: () => Promise<T>): void {
    if (watchKey === this._lastWatched) return;
    this._lastWatched = watchKey;
    this.refresh(run);
  }

  /** Force a refetch regardless of the watch key -- a manual retry/refresh action. */
  refresh(run: () => Promise<T>): void {
    this._lastRun = run;
    this._failures = 0;
    this._cancelRetry();
    this._start(run, { error: null, reconnecting: false });
  }

  /** Re-runs the last read right now (a "Retry" button, or the connection coming back). A no-op
   * before the first read. */
  retryNow(): void {
    if (this._lastRun) this.refresh(this._lastRun);
  }

  /** Optimistically rewrites cached `data` in place, without touching `loading`/`error` or
   * starting a new request -- for a mutation whose own response already tells the caller the
   * new truth (an avatar change, say), so the UI reflects it before the next full refetch lands
   * rather than waiting on one. A no-op while there is no data yet to patch. */
  patch(updater: (data: T) => T): void {
    if (this._state.data === null) return;
    this._state = { ...this._state, data: updater(this._state.data) };
    this._onChange();
  }

  /** Stops any pending retry and ignores whatever is still in flight. Call from the owner's
   * `disconnectedCallback`. */
  dispose(): void {
    this._requestId++;
    this._cancelRetry();
  }

  private _start(run: () => Promise<T>, keep: { error: string | null; reconnecting: boolean }): void {
    const requestId = ++this._requestId;
    this._state = { ...this._state, loading: true, ...keep };
    this._onChange();
    let pending: Promise<T>;
    try {
      pending = run();
    } catch (err) {
      pending = Promise.reject(err);
    }
    const timeoutMs = this._options.timeoutMs;
    if (timeoutMs) pending = withTimeout(pending, timeoutMs, this._timers);
    pending.then(
      (data) => {
        if (requestId !== this._requestId) return; // superseded by a newer request
        this._failures = 0;
        this._state = { data, error: null, loading: false, reconnecting: false };
        this._onChange();
      },
      (err: unknown) => {
        if (requestId !== this._requestId) return;
        const retry = this._options.retry;
        this._state = { ...this._state, error: describeWsError(err), loading: false, reconnecting: Boolean(retry) && this._state.data !== null };
        this._onChange();
        if (retry) this._scheduleRetry(run, retry);
      },
    );
  }

  private _scheduleRetry(run: () => Promise<T>, schedule: readonly number[]): void {
    const delay = retryDelay(this._failures++, schedule);
    this._cancelRetry();
    this._retryHandle = this._timers.setTimeout(() => {
      this._retryHandle = null;
      this._start(run, { error: this._state.error, reconnecting: this._state.reconnecting });
    }, delay);
  }

  private _cancelRetry(): void {
    if (this._retryHandle === null) return;
    this._timers.clearTimeout(this._retryHandle);
    this._retryHandle = null;
  }
}

/** Encodes every watched entity's current state string into one key; unresolved (`undefined`)
 * entity ids are skipped rather than poisoning the key with `undefined`, since a role that never
 * resolved (e.g. a diagnostic sensor nobody enabled) simply isn't a signal to watch. */
export function watchKey(hass: HomeAssistant, entityIds: Array<string | undefined>): string {
  return entityIds
    .filter((id): id is string => Boolean(id))
    .map((id) => `${id}=${hass.states[id]?.state ?? ""}`)
    .join("|");
}

/** HA's WS layer rejects with `{code, message}` plain objects, not `Error` instances -- this
 * normalizes both (plus a real `Error`, plus anything stranger) into one sentence to show. */
export function describeWsError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const message = (err as { message: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return "Something went wrong.";
}
