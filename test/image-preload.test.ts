import { describe, expect, test } from "bun:test";
import { ImagePreloader, type PreloadCache } from "../src/lib/image-preload";
import type { Asset, HomeAssistant } from "../src/types";

const hass = { states: {}, entities: {}, devices: {}, themes: {}, language: "en", callService: async () => undefined } as HomeAssistant;

function asset(id: string): Asset {
  return { id, url: "/media/" + id };
}

function fakeCache(): PreloadCache & { held: Map<string, number>; log: string[] } {
  const held = new Map<string, number>();
  const log: string[] = [];
  return {
    held,
    log,
    acquire(_hass, target) {
      held.set(target.id, (held.get(target.id) ?? 0) + 1);
      log.push("acquire " + target.id);
      return null;
    },
    release(id) {
      held.set(id, (held.get(id) ?? 0) - 1);
      log.push("release " + id);
    },
  };
}

describe("ImagePreloader", () => {
  test("holds one reference per wanted photo, however often it is asked", () => {
    const cache = fakeCache();
    const preloader = new ImagePreloader();
    preloader.sync(hass, cache, [asset("a"), asset("b"), asset("a"), null, undefined]);
    preloader.sync(hass, cache, [asset("a"), asset("b")]);
    expect(cache.log).toEqual(["acquire a", "acquire b"]);
  });

  test("releases what is no longer wanted and acquires what is new", () => {
    const cache = fakeCache();
    const preloader = new ImagePreloader();
    preloader.sync(hass, cache, [asset("a"), asset("b")]);
    preloader.sync(hass, cache, [asset("b"), asset("c")]);
    expect([...cache.held]).toEqual([
      ["a", 0],
      ["b", 1],
      ["c", 1],
    ]);
  });

  test("dispose releases everything exactly once", () => {
    const cache = fakeCache();
    const preloader = new ImagePreloader();
    preloader.sync(hass, cache, [asset("a"), asset("b")]);
    preloader.dispose();
    preloader.dispose();
    expect([...cache.held.values()]).toEqual([0, 0]);
  });

  test("losing Home Assistant or the cache lets go of every photo", () => {
    const cache = fakeCache();
    const preloader = new ImagePreloader();
    preloader.sync(hass, cache, [asset("a")]);
    preloader.sync(undefined, cache, [asset("a")]);
    expect(cache.held.get("a")).toBe(0);
  });

  test("a replaced cache gets the references, the old one gives them back", () => {
    const first = fakeCache();
    const second = fakeCache();
    const preloader = new ImagePreloader();
    preloader.sync(hass, first, [asset("a")]);
    preloader.sync(hass, second, [asset("a")]);
    expect(first.held.get("a")).toBe(0);
    expect(second.held.get("a")).toBe(1);
  });
});
