/** Explicit-page (next/previous) reader for `kibble/review` and `kibble/training`, which share
 * one response shape: `{items, total, cursor, has_more}`. Unlike `TimelineFeed`'s "Show more"
 * append, both of these render one page at a time -- a review grid or a per-cat training grid is
 * a task queue you page through, not a rail you scroll. The WS cursor is forward-only and
 * opaque, so a "Previous" needs its own client-side history: `_cursors[i]` records the cursor
 * that produced page `i`, letting `previous()` re-request an earlier page without the server
 * ever needing to support backward cursors itself.
 */

import { describeWsError } from "./ws-query";

export interface PagedFeedState<T> {
  items: T[] | null;
  total: number;
  pageIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  loading: boolean;
  error: string | null;
}

export interface PagedHass {
  callWS?: (message: Record<string, unknown>) => Promise<unknown>;
}

interface PagedResponse<T> {
  items: T[];
  total: number;
  cursor: string | null;
  has_more: boolean;
}

const INITIAL_STATE: PagedFeedState<never> = {
  items: null, total: 0, pageIndex: 0, hasNext: false, hasPrevious: false, loading: false, error: null,
};

export class PagedFeed<T> {
  state: PagedFeedState<T> = INITIAL_STATE;
  private _cursors: (string | null)[] = [null];
  /** Identifies the current filters (entry + every param besides paging); a change restarts at
   * page 0 and resets the cursor history built for the old filters. */
  private _key: string | null = null;
  private _generation = 0;

  constructor(private readonly _type: string, private readonly _onChange: () => void) {}

  /** Resets to page 0 when `key` changes (e.g. the entry, or which cat a training grid shows).
   * Safe to call on every card update. */
  sync(hass: PagedHass | undefined, key: string | null, params: Record<string, unknown>, limit: number): void {
    if (key === this._key) return;
    this._key = key;
    this._cursors = [null];
    if (!hass?.callWS || !key) {
      this.state = INITIAL_STATE;
      return;
    }
    void this._load(hass, params, limit, 0, ++this._generation);
  }

  /** Re-reads the current page in place (e.g. after a label changes what it contains). */
  refresh(hass: PagedHass | undefined, params: Record<string, unknown>, limit: number): void {
    if (!hass?.callWS || !this._key) return;
    void this._load(hass, params, limit, this.state.pageIndex, ++this._generation);
  }

  next(hass: PagedHass | undefined, params: Record<string, unknown>, limit: number): void {
    if (!hass?.callWS || this.state.loading || !this.state.hasNext) return;
    void this._load(hass, params, limit, this.state.pageIndex + 1, this._generation);
  }

  previous(hass: PagedHass | undefined, params: Record<string, unknown>, limit: number): void {
    if (!hass?.callWS || this.state.loading || this.state.pageIndex === 0) return;
    void this._load(hass, params, limit, this.state.pageIndex - 1, this._generation);
  }

  /** Drops every item matching `predicate` from the current page, decrementing `total` to
   * match -- used after a review-queue item is labelled and so stops belonging to the queue,
   * without waiting on a full page refetch. */
  removeItem(predicate: (item: T) => boolean): void {
    const items = this.state.items;
    if (!items) return;
    const kept = items.filter((item) => !predicate(item));
    if (kept.length === items.length) return;
    this.state = { ...this.state, items: kept, total: Math.max(0, this.state.total - (items.length - kept.length)) };
    this._onChange();
  }

  private async _load(hass: PagedHass, params: Record<string, unknown>, limit: number, pageIndex: number, generation: number): Promise<void> {
    this.state = { ...this.state, loading: true, error: null };
    this._onChange();
    try {
      const cursor = this._cursors[pageIndex] ?? null;
      const message = { type: this._type, limit, ...params, ...(cursor ? { cursor } : {}) };
      const result = (await hass.callWS!(message)) as PagedResponse<T>;
      if (generation !== this._generation) return;
      this._cursors[pageIndex + 1] = result.cursor;
      this.state = {
        items: result.items, total: result.total, pageIndex,
        hasNext: result.has_more, hasPrevious: pageIndex > 0,
        loading: false, error: null,
      };
    } catch (err) {
      if (generation !== this._generation) return;
      this.state = { ...this.state, loading: false, error: describeWsError(err) };
    }
    this._onChange();
  }

  dispose(): void {
    this._generation += 1;
  }
}
