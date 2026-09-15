/** Reusable geometry lifted directly from `brand/icon.svg` so the card's status art reads as the
 * same family as the integration's own icon, not a new invention. Two shapes only, per the
 * brief: the cat's head + ears (for the presence silhouette) and the rounded-square kibble piece
 * (for bowl texture and the feed-drop animation) — both traced from the brand source's own path
 * data, at its own proportions.
 */

import { svg, type SVGTemplateResult } from "lit";

/** `brand/icon.svg`'s head circle + both ear paths, nothing else (no eyes/muzzle/whiskers) — a
 * silhouette, not a face. Renders in `currentColor` so it inherits the theme's text color. */
export function catSilhouette(): SVGTemplateResult {
  return svg`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `;
}

/** `brand/icon.svg`'s own kibble-piece motif: a rounded square at a 1/4-side corner radius: one
 * `<rect>` a caller positions/sizes/rotates with a `transform`. */
export function kibblePiece(x: number, y: number, size: number, rotationDeg: number): SVGTemplateResult {
  const r = size / 4;
  const cx = x + size / 2;
  const cy = y + size / 2;
  return svg`<rect x=${x} y=${y} width=${size} height=${size} rx=${r} transform="rotate(${rotationDeg} ${cx} ${cy})" />`;
}
