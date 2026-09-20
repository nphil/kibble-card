import type { TimelineItem } from "../types";

/** The subscription's own state, as a card renders it. `error` is a message, never an object,
 * so a render path never has to know what threw. */
export interface TimelineFeedState {
  items: TimelineItem[] | null;
  loading: boolean;
  error: string | null;
}

/** What the card needs from `hass` to subscribe. Narrow on purpose: the whole `hass` object is
 * replaced on every state tick system-wide, and depending on a slice of it that actually
 * matters is what keeps this from resubscribing constantly. */
export interface SubscribeCapableHass {
  connection?: {
    subscribeMessage?: (
      callback: (message: { items?: TimelineItem[] }) => void,
      message: Record<string, unknown>,
    ) => Promise<() => void | Promise<void>>;
  };
  callWS?: (message: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Keeps a live `kibble/timeline/subscribe` open, so rows appear when they exist rather than
 * when some watched entity happens to change.
 *
 * The card previously re-fetched whenever one of three entity states moved. That inference
 * broke in the ordinary case: a feed's photos land ~30 s after the dispense, by which point
 * nothing watched moves again, so the row said "no photo for this feed" until the page was
 * reloaded by hand.
 *
 * Falls back to a one-shot `kibble/timeline` when the subscription is unavailable -- an older
 * integration alongside a newer card answers `unknown_command`, and a timeline frozen at
 * "loading" would be a worse regression than the staleness this replaces.
 *
 * Not a Lit controller: it owns no rendering, and keeping it a plain object makes the
 * resubscribe policy (the interesting part) testable without a DOM.
 */
export class TimelineFeed {
  state: TimelineFeedState = { items: null, loading: false, error: null };
  /** Identifies the current subscription's parameters; a change means resubscribe. */
  private _key: string | null = null;
  private _unsubscribe: (() => void | Promise<void>) | null = null;
  /** Incremented per subscribe attempt so a late resolution from a superseded attempt cannot
   * install its unsubscribe handle (or its rows) over a newer one. */
  private _generation = 0;

  constructor(private readonly _onChange: () => void) {}

  /** Opens (or re-opens) the subscription when `entryId`/`includeVisits` change. Safe to call
   * on every update: identical parameters are a no-op, which is the common case by far. */
  sync(hass: SubscribeCapableHass | undefined, entryId: string | undefined, includeVisits: boolean): void {
    if (!hass || !entryId) return;
    const key = `${entryId}|${includeVisits}`;
    if (key === this._key) return;
    this._key = key;
    this._close();

    const generation = ++this._generation;
    this.state = { ...this.state, loading: true, error: null };
    const message = { type: "kibble/timeline/subscribe", entry_id: entryId, include_visits: includeVisits };

    const subscribe = hass.connection?.subscribeMessage;
    if (!subscribe) {
      void this._fallback(hass, entryId, includeVisits, generation);
      return;
    }
    subscribe.call(
      hass.connection,
      (event) => {
        if (generation !== this._generation) return;
        this.state = { items: event.items ?? [], loading: false, error: null };
        this._onChange();
      },
      message,
    ).then(
      (unsub) => {
        if (generation !== this._generation) {
          void unsub();
          return;
        }
        this._unsubscribe = unsub;
      },
      () => {
        if (generation !== this._generation) return;
        void this._fallback(hass, entryId, includeVisits, generation);
      },
    );
  }

  /** One-shot read for an integration too old to stream. */
  private async _fallback(
    hass: SubscribeCapableHass,
    entryId: string,
    includeVisits: boolean,
    generation: number,
  ): Promise<void> {
    const callWS = hass.callWS;
    if (!callWS) return;
    try {
      const result = (await callWS({
        type: "kibble/timeline",
        entry_id: entryId,
        include_visits: includeVisits,
      })) as { items: TimelineItem[] };
      if (generation !== this._generation) return;
      this.state = { items: result.items ?? [], loading: false, error: null };
    } catch (error) {
      if (generation !== this._generation) return;
      this.state = { items: null, loading: false, error: error instanceof Error ? error.message : String(error) };
    }
    this._onChange();
  }

  /** Re-reads now, keeping the current rows on screen while it does. The retry button's path;
   * a live subscription needs no polling. */
  refresh(hass: SubscribeCapableHass | undefined, entryId: string | undefined, includeVisits: boolean): void {
    if (!hass || !entryId) return;
    this._key = null;
    this.sync(hass, entryId, includeVisits);
  }

  /** Drops the subscription. The card calls this on disconnect: a subscription outliving its
   * card would keep the integration rebuilding rows for a listener nobody can see. */
  dispose(): void {
    this._generation += 1;
    this._key = null;
    this._close();
  }

  private _close(): void {
    const unsub = this._unsubscribe;
    this._unsubscribe = null;
    if (unsub) void unsub();
  }
}
