import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { AssetRef, ImageUrlCache } from "../src/lib/image-cache";
import type { Asset, HomeAssistant } from "../src/types";

/** Flushes the fetch → blob → createObjectURL microtask chain before assertions. A 0ms timer,
 * not a guessed duration -- see timeline-feed.test.ts's `settle` for why this is deterministic. */
function settle(): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 0);
  return promise;
}

function fakeHass(): HomeAssistant {
  return {
    states: {},
    entities: {},
    devices: {},
    themes: {},
    language: "en",
    callService: async () => undefined,
    fetchWithAuth: async () => new Response("fake-bytes", { status: 200 }),
  };
}

function asset(id: string): Asset {
  return { id, url: `/api/kibble/entry/media/${id}` };
}

let created: string[] = [];
let revoked: string[] = [];
let nextUrlId = 0;
const realCreate = URL.createObjectURL;
const realRevoke = URL.revokeObjectURL;

beforeEach(() => {
  created = [];
  revoked = [];
  nextUrlId = 0;
  URL.createObjectURL = (_obj: Blob | MediaSource): string => {
    const url = `blob:fake-${nextUrlId++}`;
    created.push(url);
    return url;
  };
  URL.revokeObjectURL = (url: string): void => {
    revoked.push(url);
  };
});

afterEach(() => {
  URL.createObjectURL = realCreate;
  URL.revokeObjectURL = realRevoke;
});

/** Acquires and waits for the asset to resolve (or returns immediately if already cached). */
async function acquireAndWait(cache: ImageUrlCache, hass: HomeAssistant, target: Asset): Promise<string | null> {
  let resolved: string | null | undefined;
  const cached = cache.acquire(hass, target, (url) => {
    resolved = url;
  });
  if (cached !== null) return cached;
  await settle();
  return resolved ?? null;
}

describe("ImageUrlCache.acquire", () => {
  test("returns null synchronously on first acquire, then resolves via onReady", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    let ready: string | null | undefined;
    const sync = cache.acquire(hass, asset("a"), (url) => {
      ready = url;
    });
    expect(sync).toBeNull();
    await settle();
    expect(ready).toBe(created[0]);
  });

  test("a second acquire for the same id returns the cached url synchronously, with no second fetch", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    await acquireAndWait(cache, hass, asset("a"));
    const url = cache.acquire(hass, asset("a"), () => {});
    expect(url).toBe(created[0]);
    expect(created).toHaveLength(1);
  });

  test("concurrent acquires for the same id before it resolves share one fetch and both get notified", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    const results: (string | null)[] = [];
    cache.acquire(hass, asset("a"), (url) => results.push(url));
    cache.acquire(hass, asset("a"), (url) => results.push(url));
    await settle();
    expect(created).toHaveLength(1);
    expect(results).toEqual([created[0]!, created[0]!]);
  });

  test("a failed fetch resolves onReady with null and is not cached", async () => {
    const cache = new ImageUrlCache();
    const hass: HomeAssistant = { ...fakeHass(), fetchWithAuth: async () => new Response(null, { status: 500 }) };
    const first = await acquireAndWait(cache, hass, asset("a"));
    expect(first).toBeNull();
    // A later acquire retries rather than permanently remembering the failure.
    const workingHass = fakeHass();
    const retried = await acquireAndWait(cache, workingHass, asset("a"));
    expect(retried).not.toBeNull();
  });
});

describe("ImageUrlCache.release", () => {
  test("never revokes a url still referenced by another live caller", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    await acquireAndWait(cache, hass, asset("a"));
    cache.acquire(hass, asset("a"), () => {}); // second reference
    cache.release("a"); // drop one of two references
    expect(revoked).toEqual([]);
  });

  test("dropping the last reference makes the entry evictable but does not revoke it immediately", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    await acquireAndWait(cache, hass, asset("a"));
    cache.release("a");
    expect(revoked).toEqual([]);
    // Still cached: re-acquiring the same id needs no second fetch.
    const url = cache.acquire(hass, asset("a"), () => {});
    expect(url).toBe(created[0]);
    expect(created).toHaveLength(1);
  });
});

describe("ImageUrlCache release/acquire race (same-turn swap)", () => {
  test("re-acquiring an id in the same turn as its last release never evicts or re-fetches it", async () => {
    // Mirrors a re-render that swaps one element showing an asset for a replacement showing
    // the very same asset -- the old element's disconnect and the new one's connect both run
    // synchronously in the same DOM patch, so `release` and the replacement's `acquire` land
    // back to back with no `await` between them.
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    const url = await acquireAndWait(cache, hass, asset("a"));
    cache.release("a");
    const replacementUrl = cache.acquire(hass, asset("a"), () => {});
    await settle();
    expect(replacementUrl).toBe(url);
    expect(created).toHaveLength(1);
    expect(revoked).toEqual([]);
  });

  test("an id released with nothing re-acquiring it is still evicted once over cap", async () => {
    // The deferred eviction check must not simply stop evicting altogether -- only a same-turn
    // re-acquire should save an entry.
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    for (let i = 0; i < 205; i += 1) {
      await acquireAndWait(cache, hass, asset(`extra-${i}`));
      cache.release(`extra-${i}`);
      await settle(); // let each entry's deferred eviction check actually run before the next
    }
    expect(revoked.length).toBeGreaterThan(0);
  });
});

describe("ImageUrlCache eviction", () => {
  test("only evicts zero-reference entries, never one a live caller still holds", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    // Hold a permanent reference on the very first asset acquired.
    const heldUrl = await acquireAndWait(cache, hass, asset("held"));
    // Fill well past MAX_CACHED_IMAGES (200) with released (zero-ref) entries.
    for (let i = 0; i < 205; i += 1) {
      await acquireAndWait(cache, hass, asset(`extra-${i}`));
      cache.release(`extra-${i}`);
    }
    // The held asset was never revoked...
    expect(revoked).not.toContain(heldUrl);
    // ...while eviction did actually happen among the unreferenced ones.
    expect(revoked.length).toBeGreaterThan(0);
    // Re-acquiring the held asset still needs no new fetch.
    const refetchCountBefore = created.length;
    const url = cache.acquire(hass, asset("held"), () => {});
    expect(url).toBe(heldUrl);
    expect(created).toHaveLength(refetchCountBefore);
  });
});

describe("ImageUrlCache.dispose", () => {
  test("revokes every cached url regardless of reference count", async () => {
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    const url = await acquireAndWait(cache, hass, asset("a"));
    cache.acquire(hass, asset("a"), () => {}); // still referenced
    cache.dispose();
    expect(url).not.toBeNull();
    expect(revoked).toContain(url!);
  });
});

describe("AssetRef", () => {
  test("acquires once and exposes the resolved url", async () => {
    const ref = new AssetRef();
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    let notified = 0;
    ref.sync(hass, cache, asset("a"), () => {
      notified += 1;
    });
    expect(ref.url).toBeNull();
    await settle();
    expect(ref.url).toBe(created[0]);
    expect(notified).toBe(1);
  });

  test("repeated sync calls with the same asset id issue exactly one acquire", async () => {
    const ref = new AssetRef();
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    for (let i = 0; i < 5; i += 1) ref.sync(hass, cache, asset("a"), () => {});
    await settle();
    expect(created).toHaveLength(1);
  });

  test("switching to a different asset releases the old one and acquires the new one", async () => {
    const ref = new AssetRef();
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    ref.sync(hass, cache, asset("a"), () => {});
    await settle();
    const firstUrl = ref.url;
    ref.sync(hass, cache, asset("b"), () => {});
    await settle();
    expect(ref.url).not.toBe(firstUrl);
    // "a" is now unreferenced by anyone -- confirmed indirectly: a fresh cache-wide dispose
    // would revoke it, proving it left AssetRef's hold rather than staying pinned forever.
    cache.dispose();
    expect(firstUrl).not.toBeNull();
    expect(revoked).toContain(firstUrl!);
  });

  test("dispose releases the held reference", async () => {
    const ref = new AssetRef();
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    ref.sync(hass, cache, asset("a"), () => {});
    await settle();
    const url = ref.url;
    ref.dispose();
    // With the reference dropped, the cache is free to revoke it (no other holder).
    cache.dispose();
    expect(url).not.toBeNull();
    expect(revoked).toContain(url!);
  });

  test("clearing the asset to null releases without acquiring anything new", async () => {
    const ref = new AssetRef();
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    ref.sync(hass, cache, asset("a"), () => {});
    await settle();
    ref.sync(hass, cache, null, () => {});
    expect(ref.url).toBeNull();
    expect(created).toHaveLength(1);
  });

  test("a fresh ref remounting on the same asset a just-disposed ref held resolves without a second fetch", async () => {
    // The `kibble-image` bug this guards against: a re-render swaps the element showing an
    // asset for a brand new element instance showing that same asset (a template branch
    // changing shape while the underlying event is unchanged). The old element's `AssetRef`
    // disposes; a fresh `AssetRef` on the new element must still resolve the same, already
    // cached url -- never left permanently unresolved because the swap raced eviction.
    const cache = new ImageUrlCache();
    const hass = fakeHass();
    const oldRef = new AssetRef();
    oldRef.sync(hass, cache, asset("a"), () => {});
    await settle();
    const originalUrl = oldRef.url;
    oldRef.dispose(); // old element disconnects
    const newRef = new AssetRef(); // new element connects, same turn, same asset id
    let notified = 0;
    newRef.sync(hass, cache, asset("a"), () => {
      notified += 1;
    });
    await settle();
    expect(newRef.url).toBe(originalUrl);
    expect(created).toHaveLength(1); // no re-fetch
    expect(revoked).toEqual([]); // never evicted out from under the replacement
    expect(notified).toBe(0); // resolved synchronously from cache, no async notification needed
  });
});
