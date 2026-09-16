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
