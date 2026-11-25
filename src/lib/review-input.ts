/** How keys and swipes become review-queue commands. Pure, so the mapping the on-screen hints
 * promise is exactly the mapping that is tested. */

import type { AnswerOption } from "./photo-answers";

export type ReviewCommand =
  | { type: "answer"; optionId: string }
  | { type: "undo" }
  | { type: "scene" };

export interface KeyPress {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  /** True while a key is held down: never answers, so a resting finger cannot name ten visits. */
  repeat?: boolean;
}

/** Number keys pick the option that shows that number, Z / Backspace / Ctrl+Z undo, S or the up
 * and down arrows flip between the close-up and the whole picture. Anything else is left for the
 * browser. */
export function keyCommand(press: KeyPress, options: readonly Pick<AnswerOption, "id" | "hotkey">[]): ReviewCommand | null {
  if (press.altKey) return null;
  const key = press.key.length === 1 ? press.key.toLowerCase() : press.key;
  if (press.ctrlKey || press.metaKey) return key === "z" && !press.repeat ? { type: "undo" } : null;
  if (press.repeat) return null;
  if (key === "z" || key === "u" || key === "Backspace") return { type: "undo" };
  if (key === "s" || key === "ArrowUp" || key === "ArrowDown") return { type: "scene" };
  const option = options.find((candidate) => candidate.hotkey === key);
  return option ? { type: "answer", optionId: option.id } : null;
}

export type SwipeSide = "left" | "right";

/** A drag is undecided until it has moved this far. */
export const SWIPE_LOCK_PX = 10;
/** A quick flick commits even when it is short, in px per ms. */
export const SWIPE_FLICK_VELOCITY = 0.5;
const SWIPE_FLICK_MIN_PX = 24;

/** `true` once a drag is clearly sideways, `false` once it is clearly a scroll, `null` while
 * it is still too short to tell. */
export function isSidewaysDrag(dx: number, dy: number): boolean | null {
  if (Math.abs(dx) < SWIPE_LOCK_PX && Math.abs(dy) < SWIPE_LOCK_PX) return null;
  return Math.abs(dx) > Math.abs(dy) * 1.2;
}

/** How far a card must travel to commit: a quarter of its width, kept between a thumb-sized
 * nudge and a comfortable reach. */
export function swipeCommitDistance(width: number): number {
  return Math.min(140, Math.max(64, width * 0.25));
}

export interface SwipeProgress {
  side: SwipeSide | null;
  /** 0 at rest, 1 once letting go would commit. */
  progress: number;
}

export function swipeProgress(dx: number, width: number): SwipeProgress {
  if (dx === 0) return { side: null, progress: 0 };
  return { side: dx < 0 ? "left" : "right", progress: Math.min(1, Math.abs(dx) / swipeCommitDistance(width)) };
}

/** Which side a released drag commits to, or `null` when the card should spring back. */
export function swipeCommit(dx: number, velocity: number, width: number): SwipeSide | null {
  const side: SwipeSide = dx < 0 ? "left" : "right";
  if (Math.abs(dx) >= swipeCommitDistance(width)) return side;
  const flicked = Math.abs(velocity) >= SWIPE_FLICK_VELOCITY && Math.abs(dx) >= SWIPE_FLICK_MIN_PX && Math.sign(velocity) === Math.sign(dx);
  return flicked ? side : null;
}

/** Swiping answers only when there are exactly two cats: left is the first, right the second,
 * matching where their buttons sit. With any other roster a swipe means nothing, so it can
 * never be read two ways. */
export function swipeOptionId(side: SwipeSide, options: readonly Pick<AnswerOption, "id" | "kind">[]): string | null {
  const cats = options.filter((option) => option.kind === "cat");
  if (cats.length !== 2) return null;
  return (side === "left" ? cats[0] : cats[1])!.id;
}
