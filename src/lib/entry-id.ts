/** Resolve the Home Assistant config entry a Kibble device belongs to. A Kibble device is
 * created by exactly one config entry -- each feeder is its own integration entry, keyed by the
 * feeder's own serial (see the integration's `entity.py`/`config_flow.py`), and nothing merges
 * two feeders' devices into one entry or attaches a second entry to an existing device. So
 * `config_entries[0]` *is* "the primary entry" for this integration, not a simplification of a
 * real multi-entry ambiguity -- there is exactly one entry to find.
 */

import type { DeviceRegistryEntry } from "../types";

export function resolveEntryId(
  devices: Record<string, DeviceRegistryEntry>,
  deviceId: string | undefined,
): string | undefined {
  if (!deviceId) return undefined;
  return devices[deviceId]?.config_entries?.[0];
}
