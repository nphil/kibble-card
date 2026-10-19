/** Client-side image intake for every upload path (training photos, cat avatars): downscales
 * and re-encodes before the request ever leaves the browser, so a 20-50 MB phone photo becomes
 * a manageable upload instead of a failed or painfully slow one. The backend
 * (`media_processing.py`) independently re-validates and re-processes everything this produces
 * -- this is a courtesy to the network and slow devices, never the source of truth.
 *
 * EXIF orientation: `createImageBitmap(file, {imageOrientation: "from-image"})` applies it
 * during decode on every browser that supports the option; a plain `<img>` + canvas fallback
 * (older Safari, some in-app webviews) relies on the `<img>` element's own EXIF-aware layout
 * instead. True HEIC/HEIF that neither path can decode is passed through unchanged -- the
 * backend's optional `pillow-heif` decoder handles it, or rejects that one file with a clear
 * per-file message (`media_processing.py`'s `UploadRejected`).
 *
 * `crop`, wherever a caller supplies one, is an image-fraction `[x1,y1,x2,y2]` against the
 * *oriented* (post-EXIF) pixel box -- the same space `lib/photo-crop.ts` computes in and
 * `<kibble-crop-editor>` edits -- so a crop drawn against the upright preview lines up with the
 * upright bytes this module ultimately encodes.
 */

import type { NormalizedArea } from "./detection-areas";

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;
const FULL_FRAME: NormalizedArea = [0, 0, 1, 1];

/** Pure: the output size for one source image, downscaling only (never enlarging) so its
 * longer edge is at most `maxEdge`. Exported for direct testing -- everything below this that
 * actually touches `createImageBitmap`/canvas needs a real browser and is not unit tested. */
export function targetDimensions(width: number, height: number, maxEdge: number = MAX_EDGE): { width: number; height: number } {
  const edge = Math.max(width, height);
  if (edge <= 0 || edge <= maxEdge) return { width, height };
  const scale = maxEdge / edge;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

async function decodeViaBitmap(file: File): Promise<ImageBitmap | null> {
  if (typeof createImageBitmap !== "function") return null;
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
}

async function decodeViaImageElement(file: File): Promise<HTMLImageElement | null> {
  if (typeof Image === "undefined" || typeof URL === "undefined") return null;
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode failed"));
      img.src = url;
    });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** `file`'s decoded, EXIF-oriented pixel dimensions, or `null` if it can't be decoded in this
 * browser (true HEIC with no OS-level support, most likely) -- the crop editor needs this
 * before it can show a default square crop or convert a drag into image fractions. */
export async function imageNaturalSize(file: File): Promise<{ width: number; height: number } | null> {
  const source = (await decodeViaBitmap(file)) ?? (await decodeViaImageElement(file));
  if (!source) return null;
  try {
    const { width, height } = "naturalWidth" in source ? { width: source.naturalWidth, height: source.naturalHeight } : { width: source.width, height: source.height };
    return width > 0 && height > 0 ? { width, height } : null;
  } finally {
    if ("close" in source) source.close();
  }
}

/** Crops to `crop` (an image-fraction `[x1,y1,x2,y2]`, default the whole photo), downscales and
 * re-encodes the result as a JPEG `Blob` for upload. Falls back through `createImageBitmap` ->
 * `<img>` + canvas -> the original `file` unchanged (both decode paths failed, most likely true
 * HEIC without OS-level support) -- a crop is then simply not applied, since there is no pixel
 * data left to apply it to. Never throws: any failure along the way just returns the original
 * file, letting the backend's own independent validation be the one place that ever actually
 * rejects an upload. */
export async function prepareUpload(file: File, crop: NormalizedArea = FULL_FRAME, maxEdge: number = MAX_EDGE): Promise<Blob> {
  const source = (await decodeViaBitmap(file)) ?? (await decodeViaImageElement(file));
  if (!source) return file;
  try {
    const { width, height } = "naturalWidth" in source ? { width: source.naturalWidth, height: source.naturalHeight } : { width: source.width, height: source.height };
    if (width <= 0 || height <= 0) return file;
    const [x1, y1, x2, y2] = crop;
    const sx = Math.min(width - 1, Math.max(0, Math.round(x1 * width)));
    const sy = Math.min(height - 1, Math.max(0, Math.round(y1 * height)));
    const sw = Math.max(1, Math.round((x2 - x1) * width));
    const sh = Math.max(1, Math.round((y2 - y1) * height));
    const { width: outWidth, height: outHeight } = targetDimensions(sw, sh, maxEdge);
    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(source as CanvasImageSource, sx, sy, sw, sh, 0, 0, outWidth, outHeight);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    return blob ?? file;
  } catch {
    return file;
  } finally {
    if ("close" in source) source.close();
  }
}

/** The filename an upload's `FormData` should carry -- always `.jpg` once `prepareUpload`
 * actually re-encoded it (a `Blob`, not the original `File`); the original name (whatever
 * extension) when it fell through unchanged, so the backend's own HEIC sniff still has a
 * meaningful name to log even though it never affects how bytes are validated. */
export function uploadFilename(original: File, prepared: Blob): string {
  if (prepared === original) return original.name;
  const base = original.name.replace(/\.[^./\\]+$/, "");
  return `${base || "photo"}.jpg`;
}
