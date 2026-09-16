/** A minimal reactive WS query: one `hass.callWS` call with loading/data/error state, a manual
 * `refresh()`, and `sync()` to call from a card's `willUpdate` -- refetches when a caller-built
 * watch key changes (including the very first call), which is how every card here re-reads a
 * command when a relevant entity's push-fresh state changes, per DESIGN.md's data contract.
 * Each card owns one instance per query as a private field; this is not a cross-card cache.
 */

import type { HomeAssistant } from "../types";

export interface WsQueryState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const INITIAL_STATE: WsQueryState<never> = { data: null, error: null, loading: false };

export class WsQuery<T> {
  private _lastWatched: string | null = null;
  private _requestId = 0;
  private _state: WsQueryState<T> = INITIAL_STATE;
  private readonly _onChange: () => void;

  constructor(onChange: () => void) {
    this._onChange = onChange;
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
    const requestId = ++this._requestId;
    this._state = { ...this._state, loading: true, error: null };
    this._onChange();
    run().then(
      (data) => {
        if (requestId !== this._requestId) return; // superseded by a newer request
        this._state = { data, error: null, loading: false };
        this._onChange();
      },
      (err: unknown) => {
        if (requestId !== this._requestId) return;
        this._state = { ...this._state, error: describeWsError(err), loading: false };
        this._onChange();
      },
    );
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
