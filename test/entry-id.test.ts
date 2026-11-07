import { describe, expect, test } from "bun:test";
import { resolveEntryId } from "../src/lib/entry-id";
import type { DeviceRegistryEntry } from "../src/types";

function device(overrides: Partial<DeviceRegistryEntry> & { id: string }): DeviceRegistryEntry {
  return { name: "Cat Feeder", ...overrides };
}

describe("resolveEntryId", () => {
  test("returns the device's first config entry", () => {
    const devices = { "feeder-1": device({ id: "feeder-1", config_entries: ["entry-abc"] }) };

    expect(resolveEntryId(devices, "feeder-1")).toBe("entry-abc");
  });

  test("prefers config_entry_id (Home Assistant 2026.8+) over the deprecated list", () => {
    const devices = { "feeder-1": device({ id: "feeder-1", config_entry_id: "entry-new", config_entries: ["entry-old"] }) };

    expect(resolveEntryId(devices, "feeder-1")).toBe("entry-new");
  });

  test("reads config_entry_id when the deprecated list is gone", () => {
    const devices = { "feeder-1": device({ id: "feeder-1", config_entry_id: "entry-new" }) };

    expect(resolveEntryId(devices, "feeder-1")).toBe("entry-new");
  });

  test("returns undefined for an unknown device id", () => {
    expect(resolveEntryId({}, "missing")).toBeUndefined();
  });

  test("returns undefined when no device id was given", () => {
    const devices = { "feeder-1": device({ id: "feeder-1", config_entries: ["entry-abc"] }) };

    expect(resolveEntryId(devices, undefined)).toBeUndefined();
  });

  test("returns undefined when the device has no config entries recorded", () => {
    const devices = { "feeder-1": device({ id: "feeder-1", config_entries: [] }) };

    expect(resolveEntryId(devices, "feeder-1")).toBeUndefined();
  });
});
