/** How the card words Kibble's background learning (`kibble/learning/subscribe`): a live line
 * while it works, and a short summary once a pass has finished. Pure, so every state, every
 * missing field and the thousands separators are tested without a screen.
 *
 * The person sees progress, never a "busy" message: waiting, learning, rechecking (with a real
 * count) and retrying (with a countdown, and "your answers are safe"). Numbers are never NaN or
 * undefined, whatever the server sent.
 */

import type { LearningPhase, LearningStatus } from "../types";
import { countOf, formatCount } from "./format-count";
import type { SimpleStorage } from "./simple-storage";

const PHASES: readonly LearningPhase[] = ["idle", "waiting", "learning", "rechecking", "retrying"];

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseLast(value: unknown): LearningStatus["last"] {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const finished = finite(raw.finished);
  if (finished === null) return null;
  const learned: Record<string, number> = {};
  if (raw.learned && typeof raw.learned === "object") {
    for (const [cat, change] of Object.entries(raw.learned)) {
      const whole = finite(change);
      if (whole !== null && Math.round(whole) !== 0) learned[cat] = Math.round(whole);
    }
  }
  return {
    finished,
    duration: Math.max(0, finite(raw.duration) ?? 0),
    answers: Math.max(0, finite(raw.answers) ?? 0),
    learned,
    renamed: Math.max(0, finite(raw.renamed) ?? 0),
    rechecked: Math.max(0, finite(raw.rechecked) ?? 0),
  };
}

/** Reads one status as it came over the wire. Anything that is not a known state is ignored, and
 * every number that is missing or not finite becomes `null` (or 0 for counts), so the screen
 * never has to guard against a bad value. */
export function parseLearning(value: unknown): LearningStatus | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const state = PHASES.find((phase) => phase === raw.state);
  if (!state) return null;
  return {
    state,
    pending: Math.max(0, finite(raw.pending) ?? 0),
    done: finite(raw.done),
    total: finite(raw.total),
    starts_at: finite(raw.starts_at),
    retry_at: finite(raw.retry_at),
    started: finite(raw.started),
    last: parseLast(raw.last),
    error: typeof raw.error === "string" && raw.error ? raw.error : null,
  };
}

/** "3 min", "45 s": how long until a retry. */
function waitLabel(seconds: number): string {
  return seconds < 90 ? `${seconds} s` : `${Math.ceil(seconds / 60)} min`;
}

/** The live line, or "" when there is nothing to say (idle, or no status yet). */
export function learningLine(status: LearningStatus | null, nowSeconds: number, locale?: string): string {
  if (!status) return "";
  const saved = status.pending > 0 ? `${countOf(status.pending, "answer", "answers", locale)} saved` : null;
  switch (status.state) {
    case "waiting":
      return saved ? `${saved}, learning starts when you pause` : "Learning starts when you pause";
    case "learning":
      return "Learning from your answers\u2026";
    case "rechecking": {
      const total = status.total !== null && status.total > 0 ? Math.round(status.total) : null;
      const done = Math.min(Math.max(0, Math.round(status.done ?? 0)), total ?? 0);
      const progress = total === null ? "checking your visits again" : `learning ${formatCount(done, locale)} of ${formatCount(total, locale)} visits`;
      return saved ? `${saved}, ${progress}` : progress.charAt(0).toUpperCase() + progress.slice(1);
    }
    case "retrying": {
      const left = status.retry_at === null ? null : Math.ceil(status.retry_at - nowSeconds);
      const when = left === null ? "soon" : left <= 0 ? "now" : `in ${waitLabel(left)}`;
      return `Something went wrong, trying again ${when}. Your answers are safe.`;
    }
    default:
      return "";
  }
}

/** How far a recheck has got, 0..1, for a progress bar; `null` when there is nothing to measure. */
export function learningProgress(status: LearningStatus | null): number | null {
  if (!status || status.state !== "rechecking" || status.total === null || status.total <= 0) return null;
  return Math.min(1, Math.max(0, (status.done ?? 0) / status.total));
}

/** True while the line counts down to a retry, so the screen knows to tick once a second. */
export function learningCountsDown(status: LearningStatus | null, nowSeconds: number): boolean {
  return status?.state === "retrying" && status.retry_at !== null && status.retry_at > nowSeconds;
}

// ---- The summary of a finished pass -----------------------------------------------------------

/** A finished pass older than this is not news any more. */
export const SUMMARY_MAX_AGE_S = 6 * 60 * 60;

type FinishedPass = NonNullable<LearningStatus["last"]>;

/** "Kibble learned from your answers: Kitty +5 photos, Pancake -1 photo. 14 visits got a new
 * name." or, when nothing moved, "Kibble checked your answers. Nothing changed." */
export function learningSummaryText(last: FinishedPass, locale?: string): string {
  const parts = Object.entries(last.learned)
    .filter(([, change]) => change !== 0)
    .sort(([nameA, a], [nameB, b]) => Math.abs(b) - Math.abs(a) || nameA.localeCompare(nameB))
    .map(([cat, change]) => `${cat} ${change > 0 ? "+" : "-"}${countOf(Math.abs(change), "photo", "photos", locale)}`);
  const renamed = last.renamed > 0 ? `${countOf(last.renamed, "visit", "visits", locale)} got a new name.` : "";
  if (parts.length > 0) return ["Kibble learned from your answers: " + parts.join(", ") + ".", renamed].filter(Boolean).join(" ");
  return ["Kibble checked your answers.", renamed || "Nothing changed."].join(" ");
}

export interface LearningSummary {
  /** When the pass finished (unix seconds): what a dismissal remembers. */
  finished: number;
  text: string;
}

/** The summary to show, or `null`: no pass yet, it learned from no answers, it is old news, or
 * the person already dismissed it (`dismissedFinished` is the newest pass they closed). */
export function learningSummary(status: LearningStatus | null, nowSeconds: number, dismissedFinished: number, locale?: string): LearningSummary | null {
  const last = status?.last;
  if (!last || last.answers <= 0) return null;
  if (last.finished <= dismissedFinished || nowSeconds - last.finished > SUMMARY_MAX_AGE_S) return null;
  return { finished: last.finished, text: learningSummaryText(last, locale) };
}

// ---- Remembering a dismissal ------------------------------------------------------------------

function dismissedKey(entryId: string): string {
  return `kibble:learning-dismissed:${entryId}`;
}

/** The `finished` time of the newest summary this person closed for `entryId`; 0 when none. */
export function readDismissed(storage: SimpleStorage | null, entryId: string): number {
  try {
    const stored = Number(storage?.getItem(dismissedKey(entryId)));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return 0;
  }
}

export function writeDismissed(storage: SimpleStorage | null, entryId: string, finished: number): void {
  try {
    storage?.setItem(dismissedKey(entryId), String(finished));
  } catch {
    // Storage blocked: the summary may show again after a reload, which is harmless.
  }
}
