/** Multipart uploads to Kibble's two upload endpoints (`views.py`'s `KibbleUploadTrainingView`/
 * `KibbleUploadAvatarView`): one `file` field per request, authenticated the same way every
 * other authenticated fetch in this card is (`lib/image-cache.ts`'s `_fetch`) -- `hass.
 * fetchWithAuth` when the frontend provides it, falling back to a manual bearer header off
 * `hass.auth`/`hass.hassUrl` for a `hass` shim that doesn't (`lib/image-cache.ts` itself has no
 * such fallback, since a thumbnail that fails to load is recoverable by scrolling past it; a
 * photo the user just chose to upload deserves the extra reach).
 */

import type { HomeAssistant, UploadAvatarResult, UploadTrainingResult } from "../types";

async function authedFetch(hass: HomeAssistant, path: string, body: FormData, signal: AbortSignal): Promise<Response> {
  if (hass.fetchWithAuth) return hass.fetchWithAuth(path, { method: "POST", body, signal });
  const token = hass.auth?.data.access_token;
  if (!token || !hass.hassUrl) throw new Error("Not authenticated.");
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  return fetch(new URL(path, hass.hassUrl), { method: "POST", body, headers, signal });
}

/** Uploads one already-cropped-and-compressed photo as `cat`'s training sample. The response is
 * always well-formed JSON per `views.py`'s own contract; only a transport-level failure (network
 * error, a proxy returning something that isn't JSON at all) throws. */
export async function uploadTrainingPhoto(hass: HomeAssistant, entryId: string, cat: string, blob: Blob, filename: string, signal: AbortSignal): Promise<UploadTrainingResult> {
  const body = new FormData();
  body.append("file", blob, filename);
  const response = await authedFetch(hass, `/api/kibble/${entryId}/upload/training/${encodeURIComponent(cat)}`, body, signal);
  try {
    // Trusted server contract, the same `as T` convention every `kibble/*` WS call in this card
    // already uses for its JSON response (e.g. `kibble-cats-card.ts`'s `_refreshCats`).
    return (await response.json()) as UploadTrainingResult;
  } catch {
    throw new Error(`Upload failed (${response.status}).`);
  }
}

/** Uploads one already-cropped-and-compressed photo as `cat`'s avatar. */
export async function uploadAvatarPhoto(hass: HomeAssistant, entryId: string, cat: string, blob: Blob, filename: string, signal: AbortSignal): Promise<UploadAvatarResult> {
  const body = new FormData();
  body.append("file", blob, filename);
  const response = await authedFetch(hass, `/api/kibble/${entryId}/upload/avatar/${encodeURIComponent(cat)}`, body, signal);
  try {
    return (await response.json()) as UploadAvatarResult;
  } catch {
    throw new Error(`Upload failed (${response.status}).`);
  }
}
