/** Authenticated JPEG loading for `GET /api/kibble/{entry_id}/image/{kind}/{name}`, which needs
 * the same auth header every other HA HTTP call uses -- a plain `<img src>` can't attach that,
 * so every crop/sample/thumbnail is fetched with `hass.fetchWithAuth` and shown from an object
 * URL instead. Bounded LRU-ish cache keyed by request path (names are unique per capture per
 * DESIGN.md, so the same path never needs a second fetch): oldest entries are revoked once the
 * cache would grow past `MAX_CACHED_IMAGES`, so a long dashboard session cycling through
 * hundreds of pending crops doesn't leak blob URLs forever.
 */

import type { HomeAssistant } from "../types";

const MAX_CACHED_IMAGES = 200;

/** Builds the HTTP image view's path. `kind` is `event`, `feed`, `pending`, or `sample/{cat}`;
 * every dynamic segment is percent-encoded independently since cat names and filenames can
 * contain spaces or other characters a raw path segment can't. */
export function kibbleImageUrl(entryId: string, kind: string, name: string): string {
  const kindPath = kind
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/api/kibble/${encodeURIComponent(entryId)}/image/${kindPath}/${encodeURIComponent(name)}`;
}

export class ImageUrlCache {
  private readonly _urls = new Map<string, string>();
  private readonly _pending = new Map<string, Promise<void>>();

  /** Returns a cached object URL synchronously when already known; otherwise starts the fetch
   * (once per path, even under concurrent callers) and calls `onReady` when it settles.
   * `onReady` receives `null` on failure -- callers show a broken-image fallback rather than
   * nothing, so a crop that failed to load once doesn't look like a crop that never existed. */
  get(hass: HomeAssistant, path: string, onReady: (url: string | null) => void): string | null {
    const cached = this._urls.get(path);
    if (cached) {
      // Re-insert to mark it most-recently-used for the eviction order below.
      this._urls.delete(path);
      this._urls.set(path, cached);
      return cached;
    }
    const pending = this._pending.get(path);
    if (pending) {
      pending.then(() => onReady(this._urls.get(path) ?? null));
      return null;
    }
    const request = this._fetch(hass, path).then((url) => {
      this._pending.delete(path);
      if (url) this._remember(path, url);
      onReady(url);
    });
    this._pending.set(path, request);
    return null;
  }

  private async _fetch(hass: HomeAssistant, path: string): Promise<string | null> {
    if (!hass.fetchWithAuth) return null;
    try {
      const response = await hass.fetchWithAuth(path);
      if (!response.ok) return null;
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  private _remember(path: string, url: string): void {
    this._urls.set(path, url);
    while (this._urls.size > MAX_CACHED_IMAGES) {
      const oldestPath = this._urls.keys().next().value;
      if (oldestPath === undefined) break;
      const oldestUrl = this._urls.get(oldestPath);
      this._urls.delete(oldestPath);
      if (oldestUrl) URL.revokeObjectURL(oldestUrl);
    }
  }

  /** Revoke every cached URL. Call from `disconnectedCallback`. */
  dispose(): void {
    for (const url of this._urls.values()) URL.revokeObjectURL(url);
    this._urls.clear();
    this._pending.clear();
  }
}
