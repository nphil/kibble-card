/** Shared, frame-relative box geometry for live, review and crop overlays. */

import type { Asset, Box } from "../types";

export interface BoxRect {
  left: string;
  top: string;
  width: string;
  height: string;
}

export type OverlayTone = "cat" | "unknown" | "not-cat" | "clutter" | "peer";
export type OverlayEmphasis = "normal" | "selected" | "dim";

export interface OverlayBox {
  key: string;
  box: Box;
  tone: OverlayTone;
  color?: string;
  label?: string;
  avatar?: Asset | null;
  emphasis?: OverlayEmphasis;
  selectable?: boolean;
  subjectSid?: number | null;
  subjectLabel?: string | null;
}

export interface LabelRequest {
  key: string;
  box: Box;
  width: number;
  height?: number;
}

export interface LabelPlacement {
  key: string;
  left: number;
  top: number;
  flipped: boolean;
}

function percent(value: number): string {
  return String(Math.round(value * 10_000) / 100) + "%";
}

/** Convert full-frame fractions to CSS percentages without leaking float noise. */
export function boxRect(box: Box): BoxRect {
  return {
    left: percent(box[0]),
    top: percent(box[1]),
    width: percent(box[2] - box[0]),
    height: percent(box[3] - box[1]),
  };
}

/** Express a full-frame box in the crop's own coordinates, clipping to the crop. */
export function boxInCrop(box: Box, crop: Box): Box | null {
  const cropWidth = crop[2] - crop[0];
  const cropHeight = crop[3] - crop[1];
  if (cropWidth <= 0 || cropHeight <= 0 || box[2] <= box[0] || box[3] <= box[1]) return null;

  const left = Math.max(box[0], crop[0]);
  const top = Math.max(box[1], crop[1]);
  const right = Math.min(box[2], crop[2]);
  const bottom = Math.min(box[3], crop[3]);
  if (right <= left || bottom <= top) return null;

  return [
    (left - crop[0]) / cropWidth,
    (top - crop[1]) / cropHeight,
    (right - crop[0]) / cropWidth,
    (bottom - crop[1]) / cropHeight,
  ];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function overlaps(a: LabelPlacement & { width: number; height: number }, b: LabelPlacement & { width: number; height: number }, gap: number): boolean {
  return a.left < b.left + b.width + gap && a.left + a.width + gap > b.left && a.top < b.top + b.height + gap && a.top + a.height + gap > b.top;
}

/** Place each pill above its box, flip it inside when it would cross the top safe area, then nudge collisions. */
export function placeLabels(labels: readonly LabelRequest[], width: number, height: number, gap = 4, safeTopInset = 0): LabelPlacement[] {
  const safeTop = Math.max(0, safeTopInset);
  const ordered = [...labels].sort((a, b) => (a.box[0] + a.box[2]) - (b.box[0] + b.box[2]));
  const placed: Array<LabelPlacement & { width: number; height: number }> = [];

  for (const label of ordered) {
    const pillHeight = label.height ?? 22;
    const maxLeft = Math.max(0, width - label.width);
    const maxTop = Math.max(0, height - pillHeight);
    const anchorX = label.box[0] * width;
    const boxTop = label.box[1] * height;
    const flipped = boxTop - pillHeight - gap < safeTop;
    const preferredLeft = clamp(anchorX, 0, maxLeft);
    const insideTop = Math.max(boxTop + gap, safeTop);
    const preferredTop = clamp(flipped ? insideTop : boxTop - pillHeight - gap, 0, maxTop);

    const xCandidates = new Set<number>([preferredLeft, 0, maxLeft]);
    for (const prior of placed) {
      xCandidates.add(clamp(prior.left + prior.width + gap, 0, maxLeft));
      xCandidates.add(clamp(prior.left - label.width - gap, 0, maxLeft));
    }
    const xs = [...xCandidates].sort((a, b) => Math.abs(a - preferredLeft) - Math.abs(b - preferredLeft));
    const yCandidates: number[] = [preferredTop];
    const rowStep = pillHeight + gap;
    for (let offset = rowStep; offset <= height; offset += rowStep) {
      const below = preferredTop + offset;
      const above = preferredTop - offset;
      if (below <= maxTop) yCandidates.push(below);
      if (above >= (flipped ? insideTop : safeTop)) yCandidates.push(above);
    }

    let chosen: LabelPlacement & { width: number; height: number } | undefined;
    for (const top of yCandidates) {
      for (const left of xs) {
        const candidate = { key: label.key, left, top, flipped, width: label.width, height: pillHeight };
        if (!placed.some((prior) => overlaps(candidate, prior, gap))) {
          chosen = candidate;
          break;
        }
      }
      if (chosen) break;
    }
    // A valid video/crop frame is much larger than its handful of labels; the fallback only
    // applies to a degenerate host smaller than a pill, where avoiding overlap is impossible.
    placed.push(chosen ?? { key: label.key, left: preferredLeft, top: preferredTop, flipped, width: label.width, height: pillHeight });
  }

  return placed.map(({ key, left, top, flipped }) => ({ key, left, top, flipped }));
}
