/** Wraps one `kibble/timeline/subscribe` WebSocket subscription: the integration pushes
 * `{changed: true}` on every timeline-affecting mutation (a new visit or meal, a label, a
 * retention sweep) so a card can refetch whatever it currently has open near-instantly instead
 * of polling. `TimelineFeed`, the review grid and the cats roster each own one instance.
 *
 * A `hass` with no `connection` (the dev harness, or a hand-rolled shim) simply never gets a
 * live signal -- callers still work from their own explicit refresh calls after every action,
 * just without the push.
 */

export interface SubscribeCapableHass {
  connection?: {
    subscribeMessage: <T>(callback: (message: T) => void, message: Record<string, unknown>) => Promise<() => Promise<void>>;
  };
}

export class LiveSignal {
  private _entryId: string | undefined;
  private _unsubscribe: (() => Promise<void>) | null = null;
  private _subscribing = false;

  constructor(private readonly _onChanged: () => void) {}

  /** Call on every `willUpdate`; only (re)subscribes when `entryId` actually changes. */
  sync(hass: SubscribeCapableHass | undefined, entryId: string | undefined): void {
    if (entryId === this._entryId) return;
    this._entryId = entryId;
    void this._resubscribe(hass, entryId);
  }

  private async _resubscribe(hass: SubscribeCapableHass | undefined, entryId: string | undefined): Promise<void> {
    const previous = this._unsubscribe;
    this._unsubscribe = null;
    if (previous) await previous().catch(() => {});
    if (!hass?.connection || !entryId || this._subscribing) return;
    this._subscribing = true;
    try {
      const unsubscribe = await hass.connection.subscribeMessage<{ changed: boolean }>(
        () => {
          if (this._entryId === entryId) this._onChanged();
        },
        { type: "kibble/timeline/subscribe", entry_id: entryId },
      );
      this._subscribing = false;
      if (this._entryId !== entryId) {
        void unsubscribe().catch(() => {});
        return;
      }
      this._unsubscribe = unsubscribe;
    } catch {
      // No live connection available right now -- explicit refreshes still keep the card correct.
      this._subscribing = false;
    }
  }

  dispose(): void {
    const unsubscribe = this._unsubscribe;
    this._unsubscribe = null;
    this._entryId = undefined;
    if (unsubscribe) void unsubscribe().catch(() => {});
  }
}
