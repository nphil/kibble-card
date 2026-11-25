/** The live learning status for one Kibble entry (`kibble/learning/subscribe`), shared by every
 * card that shows it: the review queue and the cats card open ONE subscription between them and
 * drop it when the last of them goes away.
 *
 * Home Assistant re-registers a live subscription by itself when its socket comes back, and
 * Kibble answers a fresh one with the current status, so the feed only has to start over when it
 * never got a subscription in the first place (it was offline at the time). An integration too
 * old to know the command is answered with `unknown_command`; that means "no learning line",
 * never an error on screen.
 */

import type { HomeAssistant, HomeAssistantConnection, LearningStatus } from "../types";
import { errorCode, realTimers, retryDelay, type Timers } from "./backoff";
import { parseLearning } from "./learning-status";

export class LearningFeed {
  private _connection: HomeAssistantConnection | undefined;
  private _connected = true;
  private _status: LearningStatus | null = null;
  private _unsupported = false;
  /** Bumped whenever a subscription attempt starts or everything stops, so a late answer from an
   * attempt that is no longer wanted can tell and clean up after itself. */
  private _generation = 0;
  private _subscribing = false;
  private _unsubscribe: (() => Promise<void>) | null = null;
  private _failures = 0;
  private _retryHandle: unknown = null;
  private readonly _listeners = new Set<() => void>();

  constructor(
    private readonly _entryId: string,
    private readonly _timers: Timers = realTimers,
  ) {}

  /** The newest status, or `null` before the first one arrives (or when Kibble is too old to
   * report one). */
  get status(): LearningStatus | null {
    return this._status;
  }

  /** Call from every `willUpdate` with the latest `hass`. */
  attach(hass: Pick<HomeAssistant, "connection" | "connected">): void {
    const connected = hass.connected !== false;
    const reconnected = connected && !this._connected;
    this._connected = connected;
    if (hass.connection !== this._connection) {
      this._connection = hass.connection;
      this._stop();
    }
    if (reconnected) this._failures = 0;
    if (this._listeners.size > 0 && (reconnected || !this._unsubscribe)) this._connect();
  }

  /** Calls `listener` whenever the status changes; the first listener opens the subscription and
   * the last one to leave closes it. Returns the way out. */
  listen(listener: () => void): () => void {
    this._listeners.add(listener);
    if (this._listeners.size === 1) this._connect();
    return () => {
      this._listeners.delete(listener);
      if (this._listeners.size === 0) this._stop();
    };
  }

  private _set(status: LearningStatus | null): void {
    this._status = status;
    for (const listener of [...this._listeners]) listener();
  }

  private _connect(): void {
    const connection = this._connection;
    if (!connection || this._unsubscribe || this._subscribing || this._unsupported || this._listeners.size === 0) return;
    this._cancelRetry();
    const generation = ++this._generation;
    this._subscribing = true;
    let subscribing: Promise<() => Promise<void>>;
    try {
      subscribing = connection.subscribeMessage<{ learning?: unknown }>(
        (message) => {
          const status = parseLearning(message?.learning);
          if (generation === this._generation && status) this._set(status);
        },
        { type: "kibble/learning/subscribe", entry_id: this._entryId },
      );
    } catch (err) {
      subscribing = Promise.reject(err);
    }
    subscribing.then(
      (unsubscribe) => {
        if (generation !== this._generation) {
          void unsubscribe().catch(() => {});
          return;
        }
        this._subscribing = false;
        this._unsubscribe = unsubscribe;
        this._failures = 0;
      },
      (err: unknown) => {
        if (generation !== this._generation) return;
        this._subscribing = false;
        if (errorCode(err) === "unknown_command") {
          this._unsupported = true;
          this._set(null);
          return;
        }
        this._retryHandle = this._timers.setTimeout(() => {
          this._retryHandle = null;
          this._connect();
        }, retryDelay(this._failures++));
      },
    );
  }

  private _stop(): void {
    this._generation++;
    this._subscribing = false;
    this._cancelRetry();
    const unsubscribe = this._unsubscribe;
    this._unsubscribe = null;
    if (unsubscribe) void unsubscribe().catch(() => {});
    this._status = null;
  }

  private _cancelRetry(): void {
    if (this._retryHandle === null) return;
    this._timers.clearTimeout(this._retryHandle);
    this._retryHandle = null;
  }
}

const feeds = new Map<string, LearningFeed>();

/** The one feed for `entryId`. */
export function learningFeed(entryId: string): LearningFeed {
  let feed = feeds.get(entryId);
  if (!feed) {
    feed = new LearningFeed(entryId);
    feeds.set(entryId, feed);
  }
  return feed;
}
