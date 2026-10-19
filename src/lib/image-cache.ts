/** Authenticated, reference-counted object-URL cache for every `Asset` this card shows (crops,
 * scene photos, avatars, before/after pairs). Media is immutable and keyed by `Asset.id` (the
 * server never reuses an id for different bytes, per `types.ts`'s `Asset` doc comment), so once
 * fetched a URL is good forever -- the only question is when it is safe to revoke.
 *
 * The old cache revoked its least-recently-inserted entries purely to stay under a size cap,
 * with no notion of who was still looking at a given URL -- a thumbnail still on screen could
 * have its `src` yanked out from under it the moment a cache-full eviction pass ran, which is
 * exactly the flash bug this rewrite exists to kill. This cache instead tracks a live reference
 * count per asset: `acquire` increments it and never returns a URL a caller doesn't yet hold a
 * reference to revoke later, `release` decrements it, and eviction only ever touches entries at
 * zero references. A URL still rendered anywhere is therefore never revoked, full stop.
 *
 * `AssetRef` below is the ergonomic single-reference holder built on top of `acquire`/`release`
 * -- `components/kibble-image.ts` and the labelling sheet's before/after pair both use it
 * instead of managing the acquire/release bookkeeping themselves.
 */

import type { Asset, HomeAssistant } from "../types";

const MAX_CACHED_IMAGES = 200;

export class ImageUrlCache {
  private readonly _urls = new Map<string, string>();
  private readonly _refs = new Map<string, number>();
  private readonly _pending = new Set<string>();
  private readonly _waiters = new Map<string, Set<(url: string | null) => void>>();

  /** Returns a cached object URL synchronously when already known (and marks it referenced);
   * otherwise starts the fetch (once per id, even under concurrent callers), marks it
   * referenced, and calls `onReady` once it settles. `onReady` receives `null` on failure --
   * callers show a neutral/broken placeholder rather than nothing, so a crop that failed to
   * load once doesn't look like a crop that never existed. A failed fetch is not cached: the
   * next `acquire` for the same id retries.
   *
   * Every `acquire` MUST be matched by exactly one later `release(asset.id)` once the caller
   * stops displaying this asset -- an unreleased reference keeps its blob URL alive forever. */
  acquire(hass: HomeAssistant, asset: Asset, onReady: (url: string | null) => void): string | null {
    const id = asset.id;
    this._refs.set(id, (this._refs.get(id) ?? 0) + 1);
    const cached = this._urls.get(id);
    if (cached !== undefined) return cached;
    const waiters = this._waiters.get(id) ?? new Set();
    waiters.add(onReady);
    this._waiters.set(id, waiters);
    if (!this._pending.has(id)) {
      this._pending.add(id);
      void this._fetch(hass, asset.url).then((url) => {
        this._pending.delete(id);
        const pendingWaiters = this._waiters.get(id);
        this._waiters.delete(id);
        if (url && (this._refs.get(id) ?? 0) > 0) {
          // Still wanted by at least one live consumer -- keep it. An asset every acquirer
          // released before the fetch even settled needs no cache entry at all.
          this._urls.set(id, url);
        } else if (url) {
          URL.revokeObjectURL(url);
        }
        for (const waiter of pendingWaiters ?? []) waiter(url);
      });
    }
    return null;
  }

  /** Drops one reference. Once an id's reference count reaches zero it becomes eligible for
   * eviction, but is not revoked immediately -- it stays cached (and instantly reusable) until
   * the cache actually needs the room, so paging back to a recently-shown asset is still free.
   *
   * The eviction check itself is deferred by one microtask rather than run inline: a re-render
   * that swaps one element showing this asset for a replacement (a template branch changing
   * shape, for instance) disposes the old element and connects the new one within the same
   * synchronous DOM patch, so the replacement's own `acquire` for the very same id normally
   * lands moments later in the same microtask turn. Evicting inline here would let that brief,
   * spurious zero-reference dip win the race and revoke a blob URL its own replacement was
   * about to reuse, leaving that element waiting on a cache entry that no longer exists.
   * Deferring gives any same-turn re-acquire a chance to land first and cancel this check. */
  release(assetId: string): void {
    const next = (this._refs.get(assetId) ?? 0) - 1;
    if (next > 0) {
      this._refs.set(assetId, next);
      return;
    }
    this._refs.delete(assetId);
    queueMicrotask(() => {
      if ((this._refs.get(assetId) ?? 0) > 0) return; // re-acquired before this ran
      this._evictIfOverCap();
    });
  }

  private _evictIfOverCap(): void {
    if (this._urls.size <= MAX_CACHED_IMAGES) return;
    for (const [id, url] of this._urls) {
      if (this._urls.size <= MAX_CACHED_IMAGES) break;
      if ((this._refs.get(id) ?? 0) > 0) continue; // never revoke a URL a live consumer still holds
      this._urls.delete(id);
      URL.revokeObjectURL(url);
    }
  }

  private async _fetch(hass: HomeAssistant, url: string): Promise<string | null> {
    if (!hass.fetchWithAuth) return null;
    try {
      const response = await hass.fetchWithAuth(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  /** Revokes every cached URL regardless of reference count. Call once, from the card (not a
   * per-row component) that owns this cache's whole lifetime, in `disconnectedCallback`. */
  dispose(): void {
    for (const url of this._urls.values()) URL.revokeObjectURL(url);
    this._urls.clear();
    this._refs.clear();
    this._pending.clear();
    this._waiters.clear();
  }
}

/** Holds exactly one live reference on an `ImageUrlCache` at a time. Call `sync` with the
 * latest `hass`/`cache`/`asset` from a component's `willUpdate` (safe to call every render --
 * it is a no-op once the current asset is already acquired and either resolved or still
 * in-flight); read `.url` for the current object URL, `null` while unresolved or absent.
 * `dispose()` once, on disconnect.
 *
 * The one subtlety this exists to get right exactly once: a held reference must be acquired
 * from the cache no more than once, even though `sync` may run many times before the fetch
 * resolves -- tracked here by marking the id "acquired" synchronously, before the fetch even
 * starts, rather than gating on the (still-`null`) resolved URL. */
export class AssetRef {
  private _acquiredId: string | null = null;
  private _cache: ImageUrlCache | null = null;
  private _url: string | null = null;

  get url(): string | null {
    return this._url;
  }

  sync(hass: HomeAssistant | undefined, cache: ImageUrlCache | undefined, asset: Asset | null | undefined, onChange: () => void): void {
    const nextId = asset?.id ?? null;
    if (nextId !== this._acquiredId) {
      this._release();
      this._url = null;
    }
    if (!asset || !hass || !cache || this._acquiredId === asset.id) return;
    this._acquiredId = asset.id;
    this._cache = cache;
    const id = asset.id;
    const url = cache.acquire(hass, asset, (result) => {
      if (this._acquiredId !== id) return; // superseded by a newer asset before the fetch settled
      this._url = result;
      onChange();
    });
    if (url !== null) this._url = url;
  }

  private _release(): void {
    if (this._acquiredId && this._cache) this._cache.release(this._acquiredId);
    this._acquiredId = null;
    this._cache = null;
  }

  dispose(): void {
    this._release();
    this._url = null;
  }
}
