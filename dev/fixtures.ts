/** Fixture data for the three review scenarios. Entity ids follow the real integration's
 * `plant_room_cat_feeder_*` curation; values are picked deliberately to exercise the split-bowl
 * path, the cloud-blocked footer color, a graceful-absence case (no Wi-Fi sensor in "idle"), and
 * full unavailability in "unreachable" — except `feed_amount`, which is HA-local (RestoreEntity)
 * state per `number.py` and stays available even when the agent is down.
 */

import type { DeviceRegistryEntry, EntityRegistryEntry, HassEntityState } from "../src/types";

export type ScenarioName = "idle" | "dispensing" | "unreachable";

export const DEVICE_ID = "kibble-device-1";

export interface Fixture {
  device: DeviceRegistryEntry;
  entities: Record<string, EntityRegistryEntry>;
  states: Record<string, HassEntityState>;
}

function entry(entityId: string, translationKey: string): EntityRegistryEntry {
  return { entity_id: entityId, device_id: DEVICE_ID, platform: "kibble", translation_key: translationKey, disabled_by: null };
}

function state(entityId: string, value: string, attributes: Record<string, unknown> = {}, lastChanged?: string): HassEntityState {
  const changed = lastChanged ?? new Date().toISOString();
  return { entity_id: entityId, state: value, attributes, last_changed: changed, last_updated: changed };
}

const SCHEDULE_ENTRIES = [
  { id: "a1", time: "07:30", amount_l: 5, amount_r: 5, enabled: true },
  { id: "a2", time: "12:00", amount_l: 3, amount_r: 3, enabled: true },
  { id: "a3", time: "18:00", amount_l: 5, amount_r: 5, enabled: false },
];

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const DEVICE: DeviceRegistryEntry = {
  id: DEVICE_ID,
  name: "Cat Feeder",
  name_by_user: null,
  model: "YumShare Dual 2",
  manufacturer: "Petkit",
};

const ENTITY_IDS = {
  camera: "camera.plant_room_cat_feeder",
  feeding: "binary_sensor.plant_room_cat_feeder_feeding",
  bowlFill1: "sensor.plant_room_cat_feeder_bowl_fill_1",
  bowlFill2: "sensor.plant_room_cat_feeder_bowl_fill_2",
  desiccantDays: "sensor.plant_room_cat_feeder_desiccant_days",
  schedule: "sensor.plant_room_cat_feeder_schedule",
  feedButton: "button.plant_room_cat_feeder_feed",
  feedButtonHopper1: "button.plant_room_cat_feeder_feed_hopper_1",
  feedButtonHopper2: "button.plant_room_cat_feeder_feed_hopper_2",
  cancelFeedButton: "button.plant_room_cat_feeder_cancel_feed",
  feedAmount: "number.plant_room_cat_feeder_feed_amount",
  feedAmountHopper1: "number.plant_room_cat_feeder_feed_amount_hopper_1",
  feedAmountHopper2: "number.plant_room_cat_feeder_feed_amount_hopper_2",
  cloudSwitch: "switch.plant_room_cat_feeder_petkit_cloud",
  cloudConnection: "sensor.plant_room_cat_feeder_cloud_connection",
  nightVisionSwitch: "switch.plant_room_cat_feeder_night_vision",
  statusLedSwitch: "switch.plant_room_cat_feeder_status_led",
  microphoneSwitch: "switch.plant_room_cat_feeder_microphone",
  volume: "number.plant_room_cat_feeder_volume",
  lastSeenPet: "sensor.plant_room_cat_feeder_last_seen_pet",
  wifiNetwork: "sensor.plant_room_cat_feeder_wifi_network",
} as const;

function registryFor(includeWifi: boolean): Record<string, EntityRegistryEntry> {
  const registry: Record<string, EntityRegistryEntry> = {
    [ENTITY_IDS.camera]: entry(ENTITY_IDS.camera, ""),
    [ENTITY_IDS.feeding]: entry(ENTITY_IDS.feeding, "feeding"),
    [ENTITY_IDS.bowlFill1]: entry(ENTITY_IDS.bowlFill1, "bowl_fill_1"),
    [ENTITY_IDS.bowlFill2]: entry(ENTITY_IDS.bowlFill2, "bowl_fill_2"),
    [ENTITY_IDS.desiccantDays]: entry(ENTITY_IDS.desiccantDays, "desiccant_days"),
    [ENTITY_IDS.schedule]: entry(ENTITY_IDS.schedule, "schedule"),
    [ENTITY_IDS.feedButton]: entry(ENTITY_IDS.feedButton, "feed"),
    [ENTITY_IDS.feedButtonHopper1]: entry(ENTITY_IDS.feedButtonHopper1, "feed_hopper_1"),
    [ENTITY_IDS.feedButtonHopper2]: entry(ENTITY_IDS.feedButtonHopper2, "feed_hopper_2"),
    [ENTITY_IDS.cancelFeedButton]: entry(ENTITY_IDS.cancelFeedButton, "cancel_feed"),
    [ENTITY_IDS.feedAmount]: entry(ENTITY_IDS.feedAmount, "feed_amount"),
    [ENTITY_IDS.feedAmountHopper1]: entry(ENTITY_IDS.feedAmountHopper1, "feed_amount_hopper_1"),
    [ENTITY_IDS.feedAmountHopper2]: entry(ENTITY_IDS.feedAmountHopper2, "feed_amount_hopper_2"),
    [ENTITY_IDS.cloudSwitch]: entry(ENTITY_IDS.cloudSwitch, "cloud"),
    [ENTITY_IDS.cloudConnection]: entry(ENTITY_IDS.cloudConnection, "cloud_connection"),
    [ENTITY_IDS.nightVisionSwitch]: entry(ENTITY_IDS.nightVisionSwitch, "night"),
    [ENTITY_IDS.statusLedSwitch]: entry(ENTITY_IDS.statusLedSwitch, "light"),
    [ENTITY_IDS.microphoneSwitch]: entry(ENTITY_IDS.microphoneSwitch, "microphone"),
    [ENTITY_IDS.volume]: entry(ENTITY_IDS.volume, "volume"),
    [ENTITY_IDS.lastSeenPet]: entry(ENTITY_IDS.lastSeenPet, "last_seen_pet"),
  };
  if (includeWifi) {
    registry[ENTITY_IDS.wifiNetwork] = entry(ENTITY_IDS.wifiNetwork, "wifi_network");
  }
  return registry;
}

function scheduleState(): HassEntityState {
  const enabledCount = SCHEDULE_ENTRIES.filter((e) => e.enabled).length;
  return state(ENTITY_IDS.schedule, String(SCHEDULE_ENTRIES.length), {
    entries: SCHEDULE_ENTRIES,
    last_modified: minutesAgo(180),
    friendly_name: `${enabledCount} scheduled`,
  });
}

function buildIdle(): Fixture {
  const states: Record<string, HassEntityState> = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "streaming", { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "off", {}, minutesAgo(126)),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "62", { unit_of_measurement: "%" }),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "65", { unit_of_measurement: "%" }),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "12", { unit_of_measurement: "d" }),
    [ENTITY_IDS.schedule]: scheduleState(),
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "on"),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "connected"),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "off"),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "on"),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "on"),
    [ENTITY_IDS.volume]: state(ENTITY_IDS.volume, "6", { min: 0, max: 9, step: 1 }),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Kitty", { score: 0.94 }, minutesAgo(126)),
  };
  return { device: DEVICE, entities: registryFor(false), states };
}

function buildDispensing(): Fixture {
  const states: Record<string, HassEntityState> = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "streaming", { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "on", {}, minutesAgo(0)),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "40", { unit_of_measurement: "%" }),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "71", { unit_of_measurement: "%" }),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "3", { unit_of_measurement: "d" }),
    [ENTITY_IDS.schedule]: scheduleState(),
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "5", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "off"),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "blocked"),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "off"),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "on"),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "on"),
    [ENTITY_IDS.volume]: state(ENTITY_IDS.volume, "6", { min: 0, max: 9, step: 1 }),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Pancake", { score: 0.88 }, minutesAgo(1)),
    [ENTITY_IDS.wifiNetwork]: state(ENTITY_IDS.wifiNetwork, "Good (-52 dBm)"),
  };
  return { device: DEVICE, entities: registryFor(true), states };
}

function buildUnreachable(): Fixture {
  const states: Record<string, HassEntityState> = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "unavailable", {}),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "unavailable", {}),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "unavailable", {}),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "unavailable", {}),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "unavailable", {}),
    [ENTITY_IDS.schedule]: state(ENTITY_IDS.schedule, "unavailable", {}),
    // HA-local (RestoreEntity) state, not device-backed — stays available per number.py.
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "unavailable", {}),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "unavailable", {}),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "unavailable", {}),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "unavailable", {}),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "unavailable", {}),
    [ENTITY_IDS.volume]: state(ENTITY_IDS.volume, "unavailable", {}),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "unavailable", {}),
  };
  return { device: DEVICE, entities: registryFor(false), states };
}

export function buildFixture(scenario: ScenarioName): Fixture {
  if (scenario === "idle") return buildIdle();
  if (scenario === "dispensing") return buildDispensing();
  return buildUnreachable();
}
