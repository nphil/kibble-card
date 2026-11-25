import type { Timers } from "../src/lib/backoff";
import type { SimpleStorage } from "../src/lib/simple-storage";

/** A clock the test moves by hand: a timer fires only when `advance` passes it, so a whole retry
 * schedule runs in an instant. */
export class FakeClock implements Timers {
  private _time = 0;
  private _next = 1;
  private readonly _pending = new Map<number, { at: number; callback: () => void }>();

  setTimeout(callback: () => void, ms: number): unknown {
    const id = this._next++;
    this._pending.set(id, { at: this._time + ms, callback });
    return id;
  }

  clearTimeout(handle: unknown): void {
    this._pending.delete(handle as number);
  }

  now(): number {
    return this._time;
  }

  /** How many timers are still waiting. */
  get waiting(): number {
    return this._pending.size;
  }

  /** Moves time forward by `ms`, running every timer that comes due on the way, earliest first. */
  advance(ms: number): void {
    const target = this._time + ms;
    for (;;) {
      let nextId: number | null = null;
      for (const [id, timer] of this._pending) {
        if (timer.at <= target && (nextId === null || timer.at < this._pending.get(nextId)!.at)) nextId = id;
      }
      if (nextId === null) break;
      const timer = this._pending.get(nextId)!;
      this._pending.delete(nextId);
      this._time = Math.max(this._time, timer.at);
      timer.callback();
    }
    this._time = target;
  }
}

/** Lets every promise that is ready run to its end. */
export function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** A `localStorage` stand-in that keeps what it is given in memory. */
export function memoryStorage(initial: Record<string, string> = {}): SimpleStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return { data, getItem: (key) => data.get(key) ?? null, setItem: (key, value) => void data.set(key, value) };
}
