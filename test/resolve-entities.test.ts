import { describe, expect, test } from "bun:test";
import { resolveKibbleEntities } from "../src/lib/resolve-entities";
import type { EntityRegistryEntry } from "../src/types";

function entry(overrides: Partial<EntityRegistryEntry> & { entity_id: string }): EntityRegistryEntry {
  return { device_id: "feeder-1", disabled_by: null, ...overrides };
}

function byId(entries: EntityRegistryEntry[]): Record<string, EntityRegistryEntry> {
  return Object.fromEntries(entries.map((e) => [e.entity_id, e]));
}

describe("resolveKibbleEntities", () => {
  test("resolves core roles by translation_key, ignoring other devices", () => {
    const registry = byId([
      entry({ entity_id: "camera.plant_room_cat_feeder", translation_key: null }),
      entry({ entity_id: "binary_sensor.plant_room_cat_feeder_feeding", translation_key: "feeding" }),
      entry({ entity_id: "sensor.plant_room_cat_feeder_bowl_fill_1", translation_key: "bowl_fill_1" }),
      entry({ entity_id: "button.plant_room_cat_feeder_feed", translation_key: "feed" }),
      // Same translation_key, different device — must not leak in.
      entry({
        entity_id: "button.other_feeder_feed",
        translation_key: "feed",
        device_id: "feeder-2",
      }),
    ]);

    const result = resolveKibbleEntities(registry, "feeder-1");

    expect(result.camera).toBe("camera.plant_room_cat_feeder");
    expect(result.feeding).toBe("binary_sensor.plant_room_cat_feeder_feeding");
    expect(result.bowlFill1).toBe("sensor.plant_room_cat_feeder_bowl_fill_1");
    expect(result.feedButton).toBe("button.plant_room_cat_feeder_feed");
  });

  test("resolves the singular pending-face image without matching the plural diagnostic sensor", () => {
    const registry = byId([
      entry({ entity_id: "image.plant_room_cat_feeder_pending_face", translation_key: "pending_face" }),
      entry({ entity_id: "sensor.plant_room_cat_feeder_pending_faces", translation_key: "pending_faces" }),
    ]);

    const result = resolveKibbleEntities(registry, "feeder-1");

    expect(result.pendingFace).toBe("image.plant_room_cat_feeder_pending_face");
  });

  test("falls back to entity_id suffix when translation_key is missing", () => {
    const registry = byId([
      entry({ entity_id: "number.plant_room_cat_feeder_feed_amount", translation_key: null }),
      entry({ entity_id: "switch.plant_room_cat_feeder_night_vision", translation_key: null }),
    ]);

    const result = resolveKibbleEntities(registry, "feeder-1");

    expect(result.feedAmount).toBe("number.plant_room_cat_feeder_feed_amount");
    expect(result.nightVisionSwitch).toBe("switch.plant_room_cat_feeder_night_vision");
  });

  test("skips disabled registry entries entirely", () => {
    const registry = byId([
      entry({
        entity_id: "switch.plant_room_cat_feeder_microphone",
        translation_key: "microphone",
        disabled_by: "integration",
      }),
    ]);

    const result = resolveKibbleEntities(registry, "feeder-1");

    expect(result.microphoneSwitch).toBeUndefined();
  });

  test("collects per-cat presence sensors with derived names, sorted, distinct from unknown-pet detection", () => {
    const registry = byId([
      entry({
        entity_id: "binary_sensor.plant_room_cat_feeder_mochi_present",
        translation_key: "present",
        original_name: "Mochi Present",
      }),
      entry({
        entity_id: "binary_sensor.plant_room_cat_feeder_biscuit_present",
        translation_key: "present",
      }),
      entry({
        entity_id: "binary_sensor.plant_room_cat_feeder_unknown_pet_detected",
        translation_key: "unknown_pet_detected",
      }),
    ]);

    const result = resolveKibbleEntities(registry, "feeder-1");

    expect(result.catPresence).toEqual([
      { entityId: "binary_sensor.plant_room_cat_feeder_biscuit_present", name: "Biscuit" },
      { entityId: "binary_sensor.plant_room_cat_feeder_mochi_present", name: "Mochi" },
    ]);
  });

  test("returns an otherwise-empty result for a device with no matching entities", () => {
    const result = resolveKibbleEntities({}, "feeder-1");

    expect(result.deviceId).toBe("feeder-1");
    expect(result.camera).toBeUndefined();
    expect(result.catPresence).toEqual([]);
  });
});
