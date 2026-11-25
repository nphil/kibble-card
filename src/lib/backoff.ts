/** The retry plumbing every "keep trying until it works" piece shares: injectable timers (so a
 * test can run a whole retry schedule without waiting), the one backoff schedule, and a
 * client-side timeout so a request that never answers cannot freeze a screen.
 */

export interface Timers {
  setTimeout(callback: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
  /** Milliseconds since the epoch. */
  now(): number;
}

export const realTimers: Timers = {
  setTimeout: (callback, ms) => globalThis.setTimeout(callback, ms),
  clearTimeout: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>),
  now: () => Date.now(),
};

/** Wait before retry 1, 2, 3, ...; the last step repeats forever. */
export const RETRY_SCHEDULE_MS: readonly number[] = [1000, 2000, 5000, 10_000, 30_000];

/** A read or write that has not answered after this long counts as failed (and is retried). */
export const CALL_TIMEOUT_MS = 15_000;

/** How long to wait before the retry that follows `failures` failures in a row (0 = none yet,
 * so the first retry). */
export function retryDelay(failures: number, schedule: readonly number[] = RETRY_SCHEDULE_MS): number {
  const index = Math.min(Math.max(0, Math.floor(failures)), schedule.length - 1);
  return schedule[index]!;
}

/** The `code` Home Assistant's WebSocket layer rejects with (`{ code, message }`), or `null`
 * for anything that carries none (a plain `Error`, a lost connection). */
export function errorCode(err: unknown): string | null {
  return err && typeof err === "object" && "code" in err && typeof err.code === "string" ? err.code : null;
}

/** Rejects with `{ code: "timeout", message }` when `promise` has not settled after `ms`. The
 * late answer, if it ever comes, is ignored: callers must be safe to repeat. */
export function withTimeout<T>(promise: Promise<T>, ms: number, timers: Timers = realTimers): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const handle = timers.setTimeout(() => reject({ code: "timeout", message: "Kibble took too long to answer." }), ms);
    promise.then(
      (value) => {
        timers.clearTimeout(handle);
        resolve(value);
      },
      (err: unknown) => {
        timers.clearTimeout(handle);
        reject(err);
      },
    );
  });
}
