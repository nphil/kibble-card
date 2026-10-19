/** Bounded-concurrency uploader for a batch of photos: one item per chosen file, each moving
 * through `queued -> compressing -> uploading -> {added, duplicate, no_cat, error, canceled}`.
 * Concurrency is fixed at construction (2 by default), matching the backend's own "one request
 * per file, never a big multi-file request" design (`views.py`'s `KibbleUploadTrainingView`) --
 * a bounded pool keeps a batch of 40 phone photos from opening 40 requests at once without
 * serializing them one at a time either.
 *
 * `compress`/`upload` are injected so this is the one place the state machine itself needs
 * testing -- no real canvas or network required, see `test/upload-queue.test.ts`. Each item gets
 * its own `AbortController`; `cancelPending` aborts every not-yet-settled item's signal and
 * marks a still-`queued` item `canceled` outright (it never got a controller to abort).
 */

export type UploadItemStatus = "queued" | "compressing" | "uploading" | "added" | "duplicate" | "no_cat" | "error" | "canceled";

export interface UploadItemState {
  id: string;
  status: UploadItemStatus;
  message: string | null;
}

export interface UploadOutcome {
  status: "added" | "duplicate" | "no_cat" | "error";
  message?: string | null;
}

export interface UploadQueueHandlers {
  /** Client-side crop/downscale -- resolves to the bytes `upload` should send. Rejects (or
   * leaves its returned promise pending past an abort) only for a genuine failure; a signal
   * abort should reject with `DOMException("...", "AbortError")` so the queue can tell a
   * cancellation apart from a real compression failure. */
  compress: (id: string, signal: AbortSignal) => Promise<Blob>;
  /** The actual network request. Resolve with the server's own verdict -- a well-formed
   * `{status: "error", ...}` response is a *resolved* `UploadOutcome`, not a rejection; reject
   * only for a transport-level failure (network error, no parseable body). */
  upload: (id: string, blob: Blob, signal: AbortSignal) => Promise<UploadOutcome>;
}

const DEFAULT_CONCURRENCY = 2;
const ACTIVE_STATUSES: Record<UploadItemStatus, boolean> = {
  queued: true,
  compressing: true,
  uploading: true,
  added: false,
  duplicate: false,
  no_cat: false,
  error: false,
  canceled: false,
};
export const SETTLED_STATUSES: Record<UploadItemStatus, boolean> = {
  queued: false,
  compressing: false,
  uploading: false,
  added: true,
  duplicate: true,
  no_cat: true,
  error: true,
  canceled: true,
};

export interface UploadTally {
  added: number;
  duplicate: number;
  no_cat: number;
  error: number;
  canceled: number;
}

export class UploadQueue {
  private readonly _items = new Map<string, UploadItemState>();
  private readonly _order: string[] = [];
  private readonly _controllers = new Map<string, AbortController>();
  private _active = 0;
  private _disposed = false;

  constructor(
    private readonly _handlers: UploadQueueHandlers,
    private readonly _onChange: () => void,
    private readonly _concurrency: number = DEFAULT_CONCURRENCY,
  ) {}

  get items(): UploadItemState[] {
    return this._order.map((id) => this._items.get(id)!);
  }

  get(id: string): UploadItemState | undefined {
    return this._items.get(id);
  }

  /** Adds `ids` in `queued` state. Does not itself start uploading -- call `start()` once the
   * user commits to the batch ("Add N photos"), so choosing photos never begins a network
   * request. Safe to call more than once; an id already known is left exactly as it is. */
  enqueue(ids: string[]): void {
    let changed = false;
    for (const id of ids) {
      if (this._items.has(id)) continue;
      this._items.set(id, { id, status: "queued", message: null });
      this._order.push(id);
      changed = true;
    }
    if (changed) this._onChange();
  }

  /** Starts pulling `queued` items into the pool, up to the configured concurrency. Idempotent:
   * calling it again while already running just tops the pool back up, a no-op if it's full. */
  start(): void {
    this._pump();
  }

  /** Moves a settled `error` item back to `queued` and resumes the pool. A no-op for any other
   * status (already running, or already a terminal non-error outcome). */
  retry(id: string): void {
    const item = this._items.get(id);
    if (!item || item.status !== "error") return;
    this._items.set(id, { id, status: "queued", message: null });
    this._onChange();
    this._pump();
  }

  /** Stops the batch: a still-`queued` item never starts (marked `canceled` directly); a
   * `compressing`/`uploading` item's `AbortSignal` fires, and it settles `canceled` itself once
   * `_run`'s rejection handler observes the abort. Items already settled are untouched. */
  cancelPending(): void {
    let changed = false;
    for (const id of this._order) {
      const item = this._items.get(id)!;
      if (!ACTIVE_STATUSES[item.status]) continue;
      if (item.status === "queued") {
        this._items.set(id, { id, status: "canceled", message: null });
        changed = true;
      } else {
        this._controllers.get(id)?.abort();
      }
    }
    if (changed) this._onChange();
  }

  get allSettled(): boolean {
    return this._order.length > 0 && this._order.every((id) => SETTLED_STATUSES[this._items.get(id)!.status]);
  }

  tally(): UploadTally {
    const out: UploadTally = { added: 0, duplicate: 0, no_cat: 0, error: 0, canceled: 0 };
    for (const item of this._items.values()) {
      if (item.status in out) out[item.status as keyof UploadTally] += 1;
    }
    return out;
  }

  /** Aborts every in-flight item and stops the pool from starting new work -- call once the
   * owning component is done with this queue (closing the sheet). */
  dispose(): void {
    this._disposed = true;
    for (const controller of this._controllers.values()) controller.abort();
  }

  private _pump(): void {
    if (this._disposed) return;
    while (this._active < this._concurrency) {
      const next = this._order.find((id) => this._items.get(id)?.status === "queued");
      if (!next) return;
      this._run(next);
    }
  }

  private _run(id: string): void {
    const controller = new AbortController();
    this._controllers.set(id, controller);
    this._active++;
    this._set(id, "compressing", null);
    this._handlers
      .compress(id, controller.signal)
      .then((blob) => {
        this._set(id, "uploading", null);
        return this._handlers.upload(id, blob, controller.signal);
      })
      .then((outcome) => {
        this._set(id, outcome.status, outcome.message ?? null);
      })
      .catch((err: unknown) => {
        const aborted = controller.signal.aborted || (err instanceof DOMException && err.name === "AbortError");
        this._set(id, aborted ? "canceled" : "error", aborted ? null : err instanceof Error ? err.message : "Couldn't upload this photo.");
      })
      .finally(() => {
        this._controllers.delete(id);
        this._active--;
        this._pump();
      });
  }

  private _set(id: string, status: UploadItemStatus, message: string | null): void {
    if (!this._items.has(id)) return;
    this._items.set(id, { id, status, message });
    this._onChange();
  }
}
