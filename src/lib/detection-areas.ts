/** Geometry for the camera's mask editor: ignore-mask rectangles and the bowl zone.
 *
 * Areas are always persisted as intrinsic-image fractions `[x1, y1, x2, y2]` rather than
 * displayed CSS pixels. That keeps them stable as the editor resizes, and matches the vision
 * pipeline's frame-fraction ROI convention (`librefeed/daemon/src/vision.rs`).
 *
 * Rectangles, not polygons: every ROI the daemon understands (`body_exclusion_rois`, `bowl_roi`)
 * is `[x1,y1,x2,y2]`, and the admission pipeline's own math (`rois_intersect`, `roi_iou`, the
 * exclusion centroid test) is written entirely in terms of axis-aligned boxes. Teaching the
 * daemon point-in-polygon masks would touch that pipeline's hot path (per-body, per-frame, on a
 * 92 MB embedded device) and its wire format for a UX gain a fixed one-bowl camera rarely needs
 * -- a handful of rectangles already covers "mask out that window" or "mask out the shelf".
 * Resize handles on a rectangle give most of a polygon editor's directness (drag any edge or
 * corner) at a fraction of the risk, which is why `resizeAreaFromHandle` exists below instead of
 * a vertex list.
 */

export type NormalizedArea = [number, number, number, number];

export interface NormalizedPoint {
  x: number;
  y: number;
}

export function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Convert a pointer coordinate in client pixels to a fraction of the rendered image box. */
export function clientPointToNormalized(
  clientX: number,
  clientY: number,
  imageRect: { left: number; top: number; width: number; height: number },
): NormalizedPoint {
  if (imageRect.width <= 0 || imageRect.height <= 0) return { x: 0, y: 0 };
  return {
    x: clampUnit((clientX - imageRect.left) / imageRect.width),
    y: clampUnit((clientY - imageRect.top) / imageRect.height),
  };
}

/** Turn two normalized drag endpoints into a canonical top-left/bottom-right rectangle. */
export function normalizedAreaFromPoints(start: NormalizedPoint, end: NormalizedPoint): NormalizedArea {
  return [
    Math.min(start.x, end.x),
    Math.min(start.y, end.y),
    Math.max(start.x, end.x),
    Math.max(start.y, end.y),
  ];
}

export function areaWidth(area: NormalizedArea): number {
  return Math.max(0, area[2] - area[0]);
}

export function areaHeight(area: NormalizedArea): number {
  return Math.max(0, area[3] - area[1]);
}

export function isDrawableArea(area: NormalizedArea, minimumFraction = 0.01): boolean {
  return areaWidth(area) >= minimumFraction && areaHeight(area) >= minimumFraction;
}

/** Accept only finite, ordered, unit-bounded wire rectangles. */
export function normalizeWireArea(value: unknown): NormalizedArea | null {
  if (!Array.isArray(value) || value.length !== 4) return null;
  const values = value.map(Number);
  if (values.some((n) => !Number.isFinite(n))) return null;
  const area: NormalizedArea = [values[0]!, values[1]!, values[2]!, values[3]!];
  if (area.some((n) => n < 0 || n > 1) || areaWidth(area) <= 0 || areaHeight(area) <= 0) return null;
  return area;
}

export function normalizeWireAreas(value: unknown): NormalizedArea[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const area = normalizeWireArea(entry);
    return area ? [area] : [];
  });
}

export type HandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

/** Every resize handle, in clockwise order from top-left -- the order the editor renders them. */
export const HANDLE_IDS: readonly HandleId[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

/** Where one resize handle sits on `area`: the four corners, plus each edge's own midpoint. */
export function handlePoint(area: NormalizedArea, handle: HandleId): NormalizedPoint {
  const [x1, y1, x2, y2] = area;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  switch (handle) {
    case "nw":
      return { x: x1, y: y1 };
    case "n":
      return { x: midX, y: y1 };
    case "ne":
      return { x: x2, y: y1 };
    case "e":
      return { x: x2, y: midY };
    case "se":
      return { x: x2, y: y2 };
    case "s":
      return { x: midX, y: y2 };
    case "sw":
      return { x: x1, y: y2 };
    case "w":
      return { x: x1, y: midY };
  }
}

/** How small a mask or the bowl zone may shrink to, in frame fractions -- big enough to stay
 * grabbable at the smallest supported stage width (320px), small enough not to visibly limit a
 * deliberately tight mask over e.g. a light switch. */
export const MIN_AREA_SIZE = 0.02;

/** Drags `handle` to `point`, moving only the edge(s) that handle owns and holding the opposite
 * edge(s) fixed -- the standard resize-handle contract (corner handles move two edges, edge
 * handles move one). Clamped so the moving edge can never cross the opposite fixed edge minus
 * `minSize`: dragging `nw` past `se` stops at the minimum size rather than flipping the
 * rectangle inside out, which would silently reassign which handle is which. Also clamps
 * `point` itself to the unit square first, matching every other wire coordinate here. */
export function resizeAreaFromHandle(
  area: NormalizedArea,
  handle: HandleId,
  point: NormalizedPoint,
  minSize = MIN_AREA_SIZE,
): NormalizedArea {
  let [x1, y1, x2, y2] = area;
  const px = clampUnit(point.x);
  const py = clampUnit(point.y);
  if (handle === "nw" || handle === "w" || handle === "sw") x1 = Math.min(px, x2 - minSize);
  if (handle === "ne" || handle === "e" || handle === "se") x2 = Math.max(px, x1 + minSize);
  if (handle === "nw" || handle === "n" || handle === "ne") y1 = Math.min(py, y2 - minSize);
  if (handle === "sw" || handle === "s" || handle === "se") y2 = Math.max(py, y1 + minSize);
  return [x1, y1, x2, y2];
}

/** Translates `area` by `dx,dy` (normalized fractions), sliding it back inside the unit square
 * if the translation would push it out rather than clipping its size -- dragging (or arrow-key
 * nudging) a mask's body never shrinks it, it just stops at the frame edge. */
export function moveArea(area: NormalizedArea, dx: number, dy: number): NormalizedArea {
  const width = areaWidth(area);
  const height = areaHeight(area);
  const x1 = Math.min(Math.max(area[0] + dx, 0), Math.max(0, 1 - width));
  const y1 = Math.min(Math.max(area[1] + dy, 0), Math.max(0, 1 - height));
  return [x1, y1, x1 + width, y1 + height];
}

/** Mirrors the daemon's own `DEFAULT_BOWL_ROI` (`librefeed/daemon/src/vision.rs`): the
 * bottom-centre third of the frame. Used whenever the feeder hasn't reported a bowl zone yet (a
 * daemon predating the field, or a read that hasn't resolved), so the editor always has a real
 * box to show and edit instead of a degenerate or missing one. Callers combine this with
 * `normalizeWireArea(value) ?? DEFAULT_BOWL_ROI` rather than a dedicated parse function -- one
 * `??` is clearer inline than a named wrapper around it. */
export const DEFAULT_BOWL_ROI: NormalizedArea = [1 / 3, 2 / 3, 2 / 3, 1];
