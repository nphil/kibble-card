import { describe, expect, test } from "bun:test";
import { describeWsError, watchKey } from "../src/lib/ws-query";
import type { HomeAssistant } from "../src/types";

function hassWithStates(states: Record<string, string>): HomeAssistant {
  const entries = Object.fromEntries(
    Object.entries(states).map(([entityId, state]) => [
      entityId,
      { entity_id: entityId, state, attributes: {}, last_changed: "", last_updated: "" },
    ]),
  );
  return {
    states: entries,
    entities: {},
    devices: {},
    themes: {},
    language: "en",
    callService: async () => undefined,
  };
}

describe("watchKey", () => {
  test("changes when a watched entity's state changes", () => {
    const before = watchKey(hassWithStates({ "image.pending_face": "2026-01-01T00:00:00Z" }), ["image.pending_face"]);
    const after = watchKey(hassWithStates({ "image.pending_face": "2026-01-01T00:05:00Z" }), ["image.pending_face"]);

    expect(before).not.toBe(after);
  });

  test("is stable when nothing watched changes", () => {
    const hass = hassWithStates({ "sensor.last_seen_pet": "Pancake" });

    expect(watchKey(hass, ["sensor.last_seen_pet"])).toBe(watchKey(hass, ["sensor.last_seen_pet"]));
  });

  test("skips unresolved entity ids instead of poisoning the key with undefined", () => {
    const hass = hassWithStates({ "sensor.last_detection": "2026-01-01T00:00:00Z" });

    expect(watchKey(hass, ["sensor.last_detection", undefined])).toBe(watchKey(hass, ["sensor.last_detection"]));
  });
});

describe("describeWsError", () => {
  test("uses a real Error's message", () => {
    expect(describeWsError(new Error("boom"))).toBe("boom");
  });

  test("uses a plain {code, message} rejection's message, HA's own WS error shape", () => {
    expect(describeWsError({ code: "not_found", message: "Entry not found" })).toBe("Entry not found");
  });

  test("falls back to a generic sentence for anything else", () => {
    expect(describeWsError("nope")).toBe("Something went wrong.");
    expect(describeWsError(undefined)).toBe("Something went wrong.");
  });
});
