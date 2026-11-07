/** Resolve the Home Assistant config entry a Kibble device belongs to. A device belongs to
 * exactly one config entry (Home Assistant 2026.8+ serializes it as `config_entry_id`). The old
 * `config_entries` list, which Home Assistant keeps until 2027.8 and which holds the same single
 * id, is only read when `config_entry_id` is absent.
 */

import type { DeviceRegistryEntry } from "../types";

export function resolveEntryId(
  devices: Record<string, DeviceRegistryEntry>,
  deviceId: string | undefined,
): string | undefined {
  if (!deviceId) return undefined;
  const device = devices[deviceId];
  return device?.config_entry_id ?? device?.config_entries?.[0];
}
