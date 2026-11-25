/** Keeps a small, changing set of photos warm in an `ImageUrlCache`: the next few visits of the
 * review queue, so stepping forward never waits on the network. `sync` acquires what is newly
 * wanted and releases what no longer is, holding exactly one cache reference per asset.
 */

import type { Asset, HomeAssistant } from "../types";

export interface PreloadCache {
  acquire(hass: HomeAssistant, asset: Asset, onReady: (url: string | null) => void): string | null;
  release(assetId: string): void;
}

export class ImagePreloader {
  private readonly _held = new Map<string, PreloadCache>();

  sync(hass: HomeAssistant | undefined, cache: PreloadCache | undefined, assets: readonly (Asset | null | undefined)[]): void {
    const wanted = new Map<string, Asset>();
    if (hass && cache) {
      for (const asset of assets) {
        if (asset) wanted.set(asset.id, asset);
      }
    }
    for (const [id, heldCache] of this._held) {
      if (wanted.has(id) && heldCache === cache) continue;
      heldCache.release(id);
      this._held.delete(id);
    }
    for (const [id, asset] of wanted) {
      if (this._held.has(id)) continue;
      this._held.set(id, cache!);
      cache!.acquire(hass!, asset, () => {});
    }
  }

  dispose(): void {
    for (const [id, cache] of this._held) cache.release(id);
    this._held.clear();
  }
}
