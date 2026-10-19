/** Reads bounded, newest-first pages from `kibble/timeline` and keeps them fresh via
 * `kibble/timeline/subscribe`. Explicit "Show more" navigation keeps the journal usable at a
 * 90-day retention without pretending a client-side slice is a history limit; the opaque cursor
 * keeps equal-timestamp events stable across page boundaries. A live-push change snaps the list
 * back to a fresh page 1 (the doc's own words: "client refetches") rather than trying to splice
 * a partial update into however many older pages the user has already loaded -- simple and
 * correct beats a merge that can silently drift from what the server actually has.
 */

import type { TimelineEvent, TimelinePage } from "../types";
import { describeWsError } from "./ws-query";
import { LiveSignal, type SubscribeCapableHass as LiveSignalHass } from "./live-signal";

/** The paged history state the card renders. `error` is a message, never an object. */
export interface TimelineFeedState {
  items: TimelineEvent[] | null;
  loading: boolean;
  loadingMore: boolean;
  cursor: string | null;
  hasMore: boolean;
  error: string | null;
}

/** Narrow on purpose: the whole `hass` object changes on every system state tick. */
export interface SubscribeCapableHass extends LiveSignalHass {
  callWS?: (message: Record<string, unknown>) => Promise<unknown>;
}

export class TimelineFeed {
  state: TimelineFeedState = {
    items: null, loading: false, loadingMore: false, cursor: null, hasMore: false, error: null,
  };
  /** Identifies current filters; a change restarts at the newest page. */
  private _key: string | null = null;
  /** Guards against an older request resolving over a newer filter or card instance. */
  private _generation = 0;
  private readonly _live: LiveSignal;
  private _lastHass: SubscribeCapableHass | undefined;
  private _lastEntryId: string | undefined;
  private _lastLimit = 30;

  constructor(private readonly _onChange: () => void) {
    this._live = new LiveSignal(() => this._onLiveChange());
  }

  /** Loads the newest page when its filter changes, and keeps the live subscription pointed at
   * the current entry. Safe to call on every card update. */
  sync(hass: SubscribeCapableHass | undefined, entryId: string | undefined, limit: number): void {
    this._lastHass = hass;
    this._lastEntryId = entryId;
    this._lastLimit = limit;
    this._live.sync(hass, entryId);
    const key = entryId ? `${entryId}:${limit}` : null;
    if (key === this._key) return;
    this._key = key;
    if (!hass?.callWS || !entryId) return;
    void this._readPage(hass, entryId, limit, null, ++this._generation, true);
  }

  /** Appends one older page. No-op while a request is outstanding or history is exhausted. */
  loadMore(hass: SubscribeCapableHass | undefined, entryId: string | undefined, limit: number): void {
    if (!hass?.callWS || !entryId || this.state.loading || this.state.loadingMore || !this.state.hasMore) return;
    void this._readPage(hass, entryId, limit, this.state.cursor, this._generation, false);
  }

  /** Re-reads the newest page. */
  refresh(hass: SubscribeCapableHass | undefined, entryId: string | undefined, limit: number): void {
    if (!hass?.callWS || !entryId) return;
    void this._readPage(hass, entryId, limit, null, ++this._generation, true);
  }

  /** Splices a freshly labelled event back into the loaded pages in place, by uid -- a no-op
   * if that uid isn't currently loaded (it scrolled past "Show more", or hasn't loaded yet).
   * The caller decides whether a label should instead call `removeItem` (a row labelled
   * `not_a_cat` stops matching what `kibble/timeline` would return). */
  replaceItem(uid: string, updated: TimelineEvent): void {
    const items = this.state.items;
    if (!items) return;
    const index = items.findIndex((item) => item.uid === uid);
    if (index === -1) return;
    const next = items.slice();
    next[index] = updated;
    this.state = { ...this.state, items: next };
    this._onChange();
  }

  removeItem(uid: string): void {
    const items = this.state.items;
    if (!items) return;
    if (!items.some((item) => item.uid === uid)) return;
    this.state = { ...this.state, items: items.filter((item) => item.uid !== uid) };
    this._onChange();
  }

  /** Restores a prior `items` snapshot wholesale -- the rollback half of an optimistic label:
   * the card snapshots `state.items` before mutating rows for instant feedback, then calls this
   * with that snapshot if the server call fails, undoing any mix of `replaceItem`/`removeItem`
   * calls in one step regardless of how many rows were touched. */
  restoreItems(items: TimelineEvent[] | null): void {
    this.state = { ...this.state, items };
    this._onChange();
  }

  private _onLiveChange(): void {
    this.refresh(this._lastHass, this._lastEntryId, this._lastLimit);
  }

  private async _readPage(
    hass: SubscribeCapableHass,
    entryId: string,
    limit: number,
    cursor: string | null,
    generation: number,
    replace: boolean,
  ): Promise<void> {
    this.state = replace ? { ...this.state, loading: true, error: null } : { ...this.state, loadingMore: true, error: null };
    this._onChange();
    try {
      const result = (await hass.callWS!({
        type: "kibble/timeline",
        entry_id: entryId,
        limit,
        ...(cursor ? { cursor } : {}),
      })) as TimelinePage;
      if (generation !== this._generation) return;
      const items = replace ? result.items : [...(this.state.items ?? []), ...result.items];
      this.state = { items, loading: false, loadingMore: false, cursor: result.cursor, hasMore: result.has_more, error: null };
    } catch (err) {
      if (generation !== this._generation) return;
      this.state = { ...this.state, loading: false, loadingMore: false, error: describeWsError(err) };
    }
    this._onChange();
  }

  /** Invalidates in-flight requests and drops the live subscription. */
  dispose(): void {
    this._generation += 1;
    this._live.dispose();
  }
}
