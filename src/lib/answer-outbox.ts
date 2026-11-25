/** Where every answer goes first, so a tap is never lost. The screen records the answer here and
 * moves on at once; this sends it in the background, in order, and keeps trying until Kibble
 * has it. It survives closing the sheet, leaving the page and a reload, because the waiting
 * answers live in storage and are replayed the next time the card starts.
 *
 * Pure and unit-testable: storage, timers and the sender are all injected. The rules:
 *  - One answer per photo (or per visit's "who ate"): a newer answer replaces an older unsent
 *    one, so the server only ever hears the last word.
 *  - Sent one at a time, oldest first. A failed answer waits out its own backoff (1 s, 2 s,
 *    5 s, 10 s, then 30 s) while the others go on, so one stuck answer cannot hold the rest.
 *  - `not_found` and `agent_rejected` are final: the answer is dropped and reported once.
 *    Anything else (a timeout, a lost connection, a server hiccup) is kept and retried.
 *  - The server treats a repeated answer as a no-op, so re-sending after an unclear failure is
 *    always safe.
 */

import { errorCode, realTimers, retryDelay, RETRY_SCHEDULE_MS, type Timers } from "./backoff";
import type { SimpleStorage } from "./simple-storage";

export type Answer =
  | { kind: "photo"; sampleUid: string; /** A cat name, `both`, `not_a_cat`, `skip` or `follow`. */ label: string }
  | { kind: "ate"; visitUid: string; ate: string[] };

export interface OutboxEntry {
  id: string;
  seq: number;
  answer: Answer;
}

export type DropReason = "not_found" | "agent_rejected";

export type OutboxEvent<R = unknown> =
  | { type: "change" }
  | { type: "delivered"; answer: Answer; result: R }
  | { type: "dropped"; answer: Answer; reason: DropReason };

export interface OutboxOptions<R = unknown> {
  /** Storage key; see `outboxKey`. */
  key: string;
  /** `null` keeps the waiting answers in memory only (storage unavailable). */
  storage: SimpleStorage | null;
  send: (answer: Answer) => Promise<R>;
  timers?: Timers;
  /** Backoff steps in ms; defaults to the shared schedule. */
  schedule?: readonly number[];
}

const STORAGE_VERSION = 1;
const TERMINAL: readonly string[] = ["not_found", "agent_rejected"];

export function outboxKey(entryId: string): string {
  return `kibble:outbox:${entryId}`;
}

/** What makes two answers "the same question": the newest one wins. */
export function answerId(answer: Answer): string {
  return answer.kind === "photo" ? `photo:${answer.sampleUid}` : `ate:${answer.visitUid}`;
}

/** The server's final "no": retrying can never help. */
export function terminalReason(err: unknown): DropReason | null {
  const code = errorCode(err);
  return code !== null && TERMINAL.includes(code) ? (code as DropReason) : null;
}

function isAnswer(value: unknown): value is Answer {
  if (!value || typeof value !== "object") return false;
  const answer = value as Record<string, unknown>;
  if (answer.kind === "photo") return typeof answer.sampleUid === "string" && typeof answer.label === "string";
  if (answer.kind === "ate") return typeof answer.visitUid === "string" && Array.isArray(answer.ate) && answer.ate.length > 0 && answer.ate.every((name) => typeof name === "string");
  return false;
}

/** Reads the saved answers back, ignoring anything that is not exactly what was written. */
function parseEntries(raw: string | null): OutboxEntry[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!parsed || typeof parsed !== "object") return [];
  const saved = parsed as { v?: unknown; entries?: unknown };
  if (saved.v !== STORAGE_VERSION || !Array.isArray(saved.entries)) return [];
  const newest = new Map<string, OutboxEntry>();
  for (const item of saved.entries as unknown[]) {
    if (!item || typeof item !== "object") continue;
    const { seq, answer } = item as { seq?: unknown; answer?: unknown };
    if (typeof seq !== "number" || !Number.isFinite(seq) || !isAnswer(answer)) continue;
    const id = answerId(answer);
    const known = newest.get(id);
    if (!known || known.seq < seq) newest.set(id, { id, seq, answer });
  }
  return [...newest.values()].sort((a, b) => a.seq - b.seq);
}

export class AnswerOutbox<R = unknown> {
  private _entries: OutboxEntry[];
  private _seq: number;
  /** Failures so far, and when the next try is due, per queued answer (by `seq`). Memory only:
   * after a reload every answer is due at once. */
  private readonly _tries = new Map<number, { failures: number; retryAt: number }>();
  private _inFlight: OutboxEntry | null = null;
  private _timer: unknown = null;
  private _disposed = false;
  private _drops: { answer: Answer; reason: DropReason }[] = [];
  private readonly _listeners = new Set<(event: OutboxEvent<R>) => void>();
  private readonly _options: OutboxOptions<R>;
  private readonly _timers: Timers;

  constructor(options: OutboxOptions<R>) {
    this._options = options;
    this._timers = options.timers ?? realTimers;
    let raw: string | null = null;
    try {
      raw = options.storage?.getItem(options.key) ?? null;
    } catch {
      raw = null;
    }
    this._entries = parseEntries(raw);
    this._seq = this._entries.reduce((highest, entry) => Math.max(highest, entry.seq), 0);
  }

  /** Starts sending whatever an earlier visit to the page left behind. */
  start(): void {
    this._pump();
  }

  get size(): number {
    return this._entries.length;
  }

  get entries(): readonly OutboxEntry[] {
    return this._entries;
  }

  /** Answers the server refused for good, until someone has seen them (`clearDrops`). Kept in
   * memory for this page only: they are a notice, not work to do. */
  get drops(): readonly { answer: Answer; reason: DropReason }[] {
    return this._drops;
  }

  /** The notice was read. */
  clearDrops(): void {
    if (this._drops.length === 0) return;
    this._drops = [];
    this._emit({ type: "change" });
  }

  /** The label waiting to be sent for a photo, or `undefined`. A waiting `follow` counts: the
   * photo is back to unanswered. */
  pendingLabel(sampleUid: string): string | undefined {
    const entry = this._entries.find((candidate) => candidate.id === `photo:${sampleUid}`);
    return entry && entry.answer.kind === "photo" ? entry.answer.label : undefined;
  }

  /** Every photo with an answer waiting to be sent, to its label. */
  pendingPhotoLabels(): Map<string, string> {
    const labels = new Map<string, string>();
    for (const entry of this._entries) if (entry.answer.kind === "photo") labels.set(entry.answer.sampleUid, entry.answer.label);
    return labels;
  }

  subscribe(listener: (event: OutboxEvent<R>) => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /** Records an answer and starts sending it. The newest answer for the same photo (or visit)
   * replaces an older one that has not been acknowledged. */
  enqueue(answer: Answer): void {
    const id = answerId(answer);
    this._entries = [...this._entries.filter((entry) => entry.id !== id), { id, seq: ++this._seq, answer }];
    this._persist();
    this._emit({ type: "change" });
    this._pump();
  }

  /** "Send now": forgets every backoff and tries again immediately. Nothing waiting, nothing to do. */
  sendNow(): void {
    if (this._entries.length === 0) return;
    this._tries.clear();
    this._emit({ type: "change" });
    this._pump();
  }

  dispose(): void {
    this._disposed = true;
    this._cancelTimer();
    this._listeners.clear();
  }

  private _emit(event: OutboxEvent<R>): void {
    for (const listener of [...this._listeners]) listener(event);
  }

  private _persist(): void {
    try {
      this._options.storage?.setItem(this._options.key, JSON.stringify({ v: STORAGE_VERSION, entries: this._entries.map(({ seq, answer }) => ({ seq, answer })) }));
    } catch {
      // Storage full or blocked: the answers still wait in memory.
    }
  }

  private _cancelTimer(): void {
    if (this._timer === null) return;
    this._timers.clearTimeout(this._timer);
    this._timer = null;
  }

  private _pump(): void {
    if (this._inFlight || this._disposed) return;
    this._cancelTimer();
    const now = this._timers.now();
    let due: OutboxEntry | null = null;
    let wakeAt = Infinity;
    for (const entry of this._entries) {
      const retryAt = this._tries.get(entry.seq)?.retryAt ?? 0;
      if (retryAt <= now) {
        due = entry;
        break;
      }
      wakeAt = Math.min(wakeAt, retryAt);
    }
    if (!due) {
      if (wakeAt < Infinity) this._timer = this._timers.setTimeout(() => this._pump(), Math.max(0, wakeAt - now));
      return;
    }
    const entry = due;
    this._inFlight = entry;
    let sending: Promise<R>;
    try {
      sending = this._options.send(entry.answer);
    } catch (err) {
      sending = Promise.reject(err);
    }
    sending.then(
      (result) => this._settled(entry, { ok: true, result }),
      (err: unknown) => this._settled(entry, { ok: false, err }),
    );
  }

  private _settled(entry: OutboxEntry, outcome: { ok: true; result: R } | { ok: false; err: unknown }): void {
    this._inFlight = null;
    if (this._disposed) return;
    // A newer answer for the same photo may have replaced this one while it was on its way: its
    // result describes an answer nobody wants any more, and the newer one is still queued.
    if (this._entries.some((candidate) => candidate.seq === entry.seq)) {
      if (outcome.ok) {
        this._remove(entry);
        this._emit({ type: "delivered", answer: entry.answer, result: outcome.result });
      } else {
        const reason = terminalReason(outcome.err);
        if (reason) {
          this._remove(entry);
          this._drops = [...this._drops, { answer: entry.answer, reason }];
          this._emit({ type: "dropped", answer: entry.answer, reason });
        } else {
          const failures = (this._tries.get(entry.seq)?.failures ?? 0) + 1;
          this._tries.set(entry.seq, { failures, retryAt: this._timers.now() + retryDelay(failures - 1, this._options.schedule ?? RETRY_SCHEDULE_MS) });
        }
      }
      this._emit({ type: "change" });
    }
    this._pump();
  }

  private _remove(entry: OutboxEntry): void {
    this._entries = this._entries.filter((candidate) => candidate.seq !== entry.seq);
    this._tries.delete(entry.seq);
    this._persist();
  }
}

/** The status line for answers that have not reached Kibble yet; empty when none wait. */
export function describeWaiting(count: number): string {
  if (!(count > 0)) return "";
  return count === 1 ? "1 answer waiting to send" : `${count} answers waiting to send`;
}

/** One calm sentence for answers the server refused for good. Empty when there are none. */
export function describeDrops(drops: readonly { answer: Answer; reason: DropReason }[]): string {
  if (drops.length === 0) return "";
  const many = drops.length > 1;
  const reasons = new Set(drops.map(({ answer, reason }) => (reason === "agent_rejected" ? "rejected" : answer.kind === "ate" ? "visit" : "photo")));
  const head = many ? `${drops.length} answers could not be saved` : "1 answer could not be saved";
  if (reasons.size !== 1) return head;
  const only = [...reasons][0];
  if (only === "rejected") return `${head}: Kibble did not accept ${many ? "them" : "it"}`;
  if (only === "visit") return `${head}: ${many ? "those visits no longer exist" : "that visit no longer exists"}`;
  return `${head}: ${many ? "those photos no longer exist" : "that photo no longer exists"}`;
}
