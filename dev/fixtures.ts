/** Fixture data for the three review scenarios. Entity ids follow the real integration's
 * `plant_room_cat_feeder_*` curation; values are picked deliberately to exercise the split-bowl
 * path, the cloud-blocked footer color, a graceful-absence case (no Wi-Fi sensor in "idle"), and
 * full unavailability in "unreachable" — except `feed_amount`, which is HA-local (RestoreEntity)
 * state per `number.py` and stays available even when the agent is down.
 */

import type {
  Asset,
  Box,
  CalibrationState,
  CatSummary,
  DeviceRegistryEntry,
  EntityRegistryEntry,
  EventDetail,
  HassEntityState,
  Sample,
  SceneSubject,
  Storage,
  TimelineEvent,
  TrainingSample,
  VisionDetection,
} from "../src/types";

export type ScenarioName = "idle" | "dispensing" | "unreachable";
export type HarnessFixture = "default" | "multicat-a" | "multicat-b" | "multicat-c";

export const DEVICE_ID = "kibble-device-1";
export const ENTRY_ID = "kibble-entry-1";
export const CAMERA_ENTITY_ID = "camera.plant_room_cat_feeder";

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

/** Schedule tables for the harness, picked with `?schedule=`. `divider` (the default) is the
 * live schedule with the hopper divider fitted: hopper 1 = freeze-dried, hopper 2 = kibble, and
 * both feeds are kibble only (0 + 3). `mixed` shows every shape the editor draws: both hoppers,
 * one hopper, a paused feed, an unsorted order. Amounts are portions, `amount_l` = hopper 1. */
export type ScheduleFixtureName = "divider" | "mixed";

export interface ScheduleFixtureEntry {
  id: string;
  time: string;
  amount_l: number;
  amount_r: number;
  enabled: boolean;
}

export const SCHEDULE_FIXTURES: Record<ScheduleFixtureName, ScheduleFixtureEntry[]> = {
  divider: [
    { id: "d1", time: "00:00", amount_l: 0, amount_r: 3, enabled: true },
    { id: "d2", time: "12:00", amount_l: 0, amount_r: 3, enabled: true },
  ],
  mixed: [
    { id: "a1", time: "07:30", amount_l: 2, amount_r: 1, enabled: true },
    { id: "a3", time: "18:00", amount_l: 5, amount_r: 5, enabled: false },
    { id: "a2", time: "12:00", amount_l: 0, amount_r: 3, enabled: true },
  ],
};

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const DEVICE: DeviceRegistryEntry = {
  id: DEVICE_ID,
  name: "Cat Feeder",
  name_by_user: null,
  model: "YumShare Dual 2",
  manufacturer: "Petkit",
  config_entries: [ENTRY_ID],
};

const ENTITY_IDS = {
  camera: CAMERA_ENTITY_ID,
  feeding: "binary_sensor.plant_room_cat_feeder_feeding",
  bowlFill1: "sensor.plant_room_cat_feeder_bowl_fill_1",
  bowlFill2: "sensor.plant_room_cat_feeder_bowl_fill_2",
  hopperLevel1: "sensor.plant_room_cat_feeder_hopper_1_level",
  hopperLevel2: "sensor.plant_room_cat_feeder_hopper_2_level",
  hopperRemaining1: "sensor.plant_room_cat_feeder_hopper_1_remaining",
  hopperRemaining2: "sensor.plant_room_cat_feeder_hopper_2_remaining",
  markFullHopper1: "button.plant_room_cat_feeder_hopper_1_full",
  markFullHopper2: "button.plant_room_cat_feeder_hopper_2_full",
  markFullBoth: "button.plant_room_cat_feeder_hopper_full",
  hopperDivider: "switch.plant_room_cat_feeder_hopper_divider",
  hopperFood1: "text.plant_room_cat_feeder_hopper_1_food",
  hopperFood2: "text.plant_room_cat_feeder_hopper_2_food",
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
  speaker: "media_player.plant_room_cat_feeder_speaker",
  lastSeenPet: "sensor.plant_room_cat_feeder_last_seen_pet",
  wifiNetwork: "sensor.plant_room_cat_feeder_wifi_network",
  lastDetection: "sensor.plant_room_cat_feeder_last_detection",
  detectionsToday: "sensor.plant_room_cat_feeder_detections_today",
  lastDetectionImage: "image.plant_room_cat_feeder_last_detection",
  detectionOverlaySwitch: "switch.plant_room_cat_feeder_detection_overlay",
  dishBefore: "image.plant_room_cat_feeder_dish_before",
  dishAfter: "image.plant_room_cat_feeder_dish_after",
  pendingFace: "image.plant_room_cat_feeder_pending_face",
} as const;

function registryFor(includeWifi: boolean): Record<string, EntityRegistryEntry> {
  const registry: Record<string, EntityRegistryEntry> = {
    [ENTITY_IDS.camera]: entry(ENTITY_IDS.camera, ""),
    [ENTITY_IDS.feeding]: entry(ENTITY_IDS.feeding, "feeding"),
    [ENTITY_IDS.bowlFill1]: entry(ENTITY_IDS.bowlFill1, "bowl_fill_1"),
    [ENTITY_IDS.bowlFill2]: entry(ENTITY_IDS.bowlFill2, "bowl_fill_2"),
    [ENTITY_IDS.hopperLevel1]: entry(ENTITY_IDS.hopperLevel1, "hopper_1_level"),
    [ENTITY_IDS.hopperLevel2]: entry(ENTITY_IDS.hopperLevel2, "hopper_2_level"),
    [ENTITY_IDS.hopperRemaining1]: entry(ENTITY_IDS.hopperRemaining1, "hopper_1_remaining"),
    [ENTITY_IDS.hopperRemaining2]: entry(ENTITY_IDS.hopperRemaining2, "hopper_2_remaining"),
    [ENTITY_IDS.markFullHopper1]: entry(ENTITY_IDS.markFullHopper1, "hopper_1_full"),
    [ENTITY_IDS.markFullHopper2]: entry(ENTITY_IDS.markFullHopper2, "hopper_2_full"),
    [ENTITY_IDS.markFullBoth]: entry(ENTITY_IDS.markFullBoth, "hopper_full"),
    [ENTITY_IDS.hopperDivider]: entry(ENTITY_IDS.hopperDivider, "hopper_divider"),
    [ENTITY_IDS.hopperFood1]: entry(ENTITY_IDS.hopperFood1, "hopper_1_food"),
    [ENTITY_IDS.hopperFood2]: entry(ENTITY_IDS.hopperFood2, "hopper_2_food"),
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
    [ENTITY_IDS.speaker]: entry(ENTITY_IDS.speaker, "speaker"),
    [ENTITY_IDS.lastSeenPet]: entry(ENTITY_IDS.lastSeenPet, "last_seen_pet"),
    [ENTITY_IDS.lastDetection]: entry(ENTITY_IDS.lastDetection, "last_detection"),
    [ENTITY_IDS.detectionsToday]: entry(ENTITY_IDS.detectionsToday, "detections_today"),
    [ENTITY_IDS.lastDetectionImage]: entry(ENTITY_IDS.lastDetectionImage, "last_detection"),
    [ENTITY_IDS.detectionOverlaySwitch]: entry(ENTITY_IDS.detectionOverlaySwitch, "detection_overlay"),
    [ENTITY_IDS.dishBefore]: entry(ENTITY_IDS.dishBefore, "dish_before"),
    [ENTITY_IDS.dishAfter]: entry(ENTITY_IDS.dishAfter, "dish_after"),
    [ENTITY_IDS.pendingFace]: entry(ENTITY_IDS.pendingFace, "pending_face"),
  };
  if (includeWifi) {
    registry[ENTITY_IDS.wifiNetwork] = entry(ENTITY_IDS.wifiNetwork, "wifi_network");
  }
  for (const name of Object.keys(CAT_RECOGNITION)) {
    registry[catRecognitionEntityId(name)] = catRecognitionEntry(name);
  }
  return registry;
}

export function scheduleState(entries: ScheduleFixtureEntry[] = SCHEDULE_FIXTURES.divider): HassEntityState {
  const enabledCount = entries.filter((e) => e.enabled).length;
  return state(ENTITY_IDS.schedule, String(entries.length), {
    entries,
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
    // Hopper 1: capacity learned a while back, comfortably stocked -- exercises the richest
    // "About N left" display. Hopper 2: marked full recently but capacity not learned yet --
    // exercises the "Filled Nd ago" display, both alongside the plain point sensor.
    [ENTITY_IDS.hopperLevel1]: state(ENTITY_IDS.hopperLevel1, "ok"),
    [ENTITY_IDS.hopperLevel2]: state(ENTITY_IDS.hopperLevel2, "ok"),
    [ENTITY_IDS.hopperRemaining1]: state(ENTITY_IDS.hopperRemaining1, "14", {
      full_at: minutesAgo(5 * 24 * 60),
      portions_since_full: 26,
      full_to_low: 40,
    }),
    [ENTITY_IDS.hopperRemaining2]: state(ENTITY_IDS.hopperRemaining2, "unknown", {
      full_at: minutesAgo(2 * 24 * 60),
      portions_since_full: 9,
      full_to_low: null,
    }),
    // Divider fitted: dual mode, each side named -- the common case a screenshot session
    // should land on by default.
    [ENTITY_IDS.hopperDivider]: state(ENTITY_IDS.hopperDivider, "on"),
    [ENTITY_IDS.hopperFood1]: state(ENTITY_IDS.hopperFood1, "Freeze-dried"),
    [ENTITY_IDS.hopperFood2]: state(ENTITY_IDS.hopperFood2, "Kibble"),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "12", { unit_of_measurement: "d" }),
    [ENTITY_IDS.schedule]: scheduleState(),
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "2", { min: 0, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "2", { min: 0, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "on"),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "connected"),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "off"),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "on"),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "on"),
    [ENTITY_IDS.speaker]: state(ENTITY_IDS.speaker, "idle", { volume_level: 0.6 }),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Kitty", { score: 0.94 }, minutesAgo(126)),
    // An unidentified visit: Kibble saw a cat but did not match it to Kitty or Pancake, so the
    // row shows the class ("Seen") and never a guessed name.
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, minutesAgo(14), { class: "visit" }),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "16", {
      by_class: { visit: 16 },
      capped: false,
    }),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, minutesAgo(14), {
      entity_picture: "./camera-frame.svg",
    }),
    [ENTITY_IDS.detectionOverlaySwitch]: state(ENTITY_IDS.detectionOverlaySwitch, "on"),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, minutesAgo(390), { entity_picture: "./dish-before.svg" }),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, minutesAgo(390), { entity_picture: "./dish-after.svg" }),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, minutesAgo(6), { status: "pending" }),
  };
  for (const name of Object.keys(CAT_RECOGNITION)) {
    states[catRecognitionEntityId(name)] = catRecognitionState(name);
  }
  return { device: DEVICE, entities: registryFor(false), states };
}

function buildDispensing(): Fixture {
  const states: Record<string, HassEntityState> = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "streaming", { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "on", {}, minutesAgo(0)),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "40", { unit_of_measurement: "%" }),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "71", { unit_of_measurement: "%" }),
    // Hopper 1: the point sensor has since tripped to "low", right around when capacity would
    // have been learned -- exercises "the real sensor always wins" against a fresh estimate.
    // Hopper 2: just topped off, almost nothing dispensed since.
    [ENTITY_IDS.hopperLevel1]: state(ENTITY_IDS.hopperLevel1, "low"),
    [ENTITY_IDS.hopperLevel2]: state(ENTITY_IDS.hopperLevel2, "ok"),
    [ENTITY_IDS.hopperRemaining1]: state(ENTITY_IDS.hopperRemaining1, "unknown", {
      full_at: minutesAgo(6 * 60),
      portions_since_full: 22,
      full_to_low: 24,
    }),
    [ENTITY_IDS.hopperRemaining2]: state(ENTITY_IDS.hopperRemaining2, "38", {
      full_at: minutesAgo(60),
      portions_since_full: 2,
      full_to_low: 40,
    }),
    // Divider fitted, but nobody has named either side yet -- exercises the "Hopper N"
    // fallback everywhere the idle scenario instead shows a food name.
    [ENTITY_IDS.hopperDivider]: state(ENTITY_IDS.hopperDivider, "on"),
    [ENTITY_IDS.hopperFood1]: state(ENTITY_IDS.hopperFood1, ""),
    [ENTITY_IDS.hopperFood2]: state(ENTITY_IDS.hopperFood2, ""),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "3", { unit_of_measurement: "d" }),
    [ENTITY_IDS.schedule]: scheduleState(),
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "5", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "3", { min: 0, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "3", { min: 0, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "off"),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "blocked"),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "off"),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "on"),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "on"),
    [ENTITY_IDS.speaker]: state(ENTITY_IDS.speaker, "idle", { volume_level: 0.4 }),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Pancake", { score: 0.88 }, minutesAgo(1)),
    // Mid-dispense: the cat that tripped the detection is still at the bowl.
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, minutesAgo(1), {
      class: "eat",
      cat: "Pancake",
    }),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "9", { by_class: { visit: 7, eat: 2 } }),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, minutesAgo(1), {
      entity_picture: "./camera-frame.svg",
    }),
    [ENTITY_IDS.detectionOverlaySwitch]: state(ENTITY_IDS.detectionOverlaySwitch, "on"),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, minutesAgo(1), { entity_picture: "./dish-before.svg" }),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, minutesAgo(1), { entity_picture: "./dish-after.svg" }),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, minutesAgo(1), { status: "pending" }),
    [ENTITY_IDS.wifiNetwork]: state(ENTITY_IDS.wifiNetwork, "Good (-52 dBm)"),
  };
  for (const name of Object.keys(CAT_RECOGNITION)) {
    states[catRecognitionEntityId(name)] = catRecognitionState(name);
  }
  return { device: DEVICE, entities: registryFor(true), states };
}

function buildUnreachable(): Fixture {
  const states: Record<string, HassEntityState> = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "unavailable", {}),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "unavailable", {}),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "unavailable", {}),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "unavailable", {}),
    [ENTITY_IDS.hopperLevel1]: state(ENTITY_IDS.hopperLevel1, "unavailable", {}),
    [ENTITY_IDS.hopperLevel2]: state(ENTITY_IDS.hopperLevel2, "unavailable", {}),
    [ENTITY_IDS.hopperRemaining1]: state(ENTITY_IDS.hopperRemaining1, "unavailable", {}),
    [ENTITY_IDS.hopperRemaining2]: state(ENTITY_IDS.hopperRemaining2, "unavailable", {}),
    [ENTITY_IDS.hopperDivider]: state(ENTITY_IDS.hopperDivider, "unavailable", {}),
    [ENTITY_IDS.hopperFood1]: state(ENTITY_IDS.hopperFood1, "unavailable", {}),
    [ENTITY_IDS.hopperFood2]: state(ENTITY_IDS.hopperFood2, "unavailable", {}),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "unavailable", {}),
    [ENTITY_IDS.schedule]: state(ENTITY_IDS.schedule, "unavailable", {}),
    // HA-local (RestoreEntity) state, not device-backed — stays available per number.py.
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "2", { min: 0, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "2", { min: 0, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "unavailable", {}),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "unavailable", {}),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "unavailable", {}),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "unavailable", {}),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "unavailable", {}),
    [ENTITY_IDS.speaker]: state(ENTITY_IDS.speaker, "unavailable", {}),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "unavailable", {}),
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, "unavailable", {}),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "unavailable", {}),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, "unavailable", {}),
    [ENTITY_IDS.detectionOverlaySwitch]: state(ENTITY_IDS.detectionOverlaySwitch, "unavailable", {}),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, "unavailable", {}),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, "unavailable", {}),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, "unavailable", {}),
  };
  for (const name of Object.keys(CAT_RECOGNITION)) {
    states[catRecognitionEntityId(name)] = catRecognitionState(name);
  }
  return { device: DEVICE, entities: registryFor(false), states };
}

export function buildFixture(scenario: ScenarioName): Fixture {
  if (scenario === "idle") return buildIdle();
  if (scenario === "dispensing") return buildDispensing();
  return buildUnreachable();
}

// ---- `kibble/*` WS fixture data, for kibble-timeline-card and kibble-cats-card. Shares the
// same device/entry above -- all three cards in the harness point at one feeder. ----

function secondsAgo(minutes: number): number {
  return Math.floor(Date.now() / 1000) - minutes * 60;
}

/** Unix seconds for a specific local time today (or `daysAgo` days before today) -- lets the
 * timeline fixture read as "a day's worth of activity at plausible hours" instead of a run of
 * evenly-spaced offsets from "now". */
function localTime(hour: number, minute: number, daysAgo = 0): number {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function assetFor(id: string): Asset {
  return { id, url: `/api/kibble/${ENTRY_ID}/media/${id}` };
}

function makeSamples(uidPrefix: string, start: number, count: number, opts: { faceEvery?: number; guess?: string | null } = {}): Sample[] {
  const faceEvery = opts.faceEvery ?? 1;
  return Array.from({ length: count }, (_, i) => {
    const sUid = `${uidPrefix}-s${i + 1}`;
    return {
      uid: sUid,
      t: start + i * 20,
      body: assetFor(`${sUid}-body`),
      face: (i + 1) % faceEvery === 0 ? assetFor(`${sUid}-face`) : null,
      guess: opts.guess ?? null,
      guess_confidence: opts.guess ? 0.55 + (i % 4) * 0.08 : null,
      review: null,
      cat: null,
      sid: null,
      box: null,
      crop: null,
      peers: [],
      label: null,
    };
  });
}

interface EventFixture {
  event: TimelineEvent;
  samples: Sample[];
}

/** A visit or an eat -- `cat: null` (the default) makes it an unidentified row so the timeline's
 * inline "Who was this?" picker and the cats card's review queue both have something real to
 * work through; `noEvidence: true` drops thumb/scene/samples entirely (spool pressure dropped
 * every asset for this one), exercising the neutral-icon fallback. */
function visitOrEat(
  kind: "visit" | "eat",
  uidSuffix: string,
  start: number,
  opts: {
    end?: number;
    open?: boolean;
    cat?: string | null;
    identity?: TimelineEvent["identity"];
    confidence?: number | null;
    sampleCount?: number;
    faceEvery?: number;
    guess?: string | null;
    compare?: boolean;
    noEvidence?: boolean;
    /** Links a Scrypted eating clip (docs/39-eating-clips.md) to this session -- only
     * meaningful for a CLOSED `eat` row (`open: false`, `end` set): the recorder's own
     * pre/post-roll (~10s before, ~15s after) is synthesised around `[start, end]`, matching
     * the real recorder's typical padding. */
    clip?: boolean;
  } = {},
): EventFixture {
  const uidStr = `${ENTRY_ID}-${uidSuffix}`;
  const open = opts.open ?? false;
  const sampleCount = opts.noEvidence ? 0 : (opts.sampleCount ?? 3);
  const samples = sampleCount > 0 ? makeSamples(uidStr, start, sampleCount, { faceEvery: opts.faceEvery, guess: opts.guess }) : [];
  const compare = opts.compare ?? false;
  const end = open ? null : (opts.end ?? start);
  const event: TimelineEvent = {
    uid: uidStr,
    kind,
    start,
    end,
    open,
    cat: opts.cat ?? null,
    identity: opts.identity ?? (opts.cat ? "auto" : "unknown"),
    confidence: opts.confidence ?? (opts.cat ? 0.88 : null),
    thumb: samples[0]?.body ?? null,
    scene: opts.noEvidence ? null : assetFor(`${uidStr}-scene`),
    before: compare ? assetFor(`${uidStr}-before`) : null,
    after: compare ? assetFor(`${uidStr}-after`) : null,
    sample_count: sampleCount,
    clip: opts.clip && end !== null ? { start_ms: (start - 10) * 1000, end_ms: (end + 15) * 1000 } : null,
    session: null,
  };
  return { event, samples };
}

/** A feed row in the new per-side shape: `sides` lists only hoppers that actually dispensed,
 * in hopper order; omit it (or pass `[]`) for single mode or a legacy no-breakdown row, where
 * `portions` alone is the bin's honest total. */
function feedEvent(
  uidSuffix: string,
  start: number,
  opts: {
    portions: number;
    single: boolean;
    sides?: Array<{ hopper: 1 | 2; portions: number; food: string | null }>;
    scheduled: boolean;
    confirmed?: boolean;
    compare?: boolean;
  },
): EventFixture {
  const uidStr = `${ENTRY_ID}-${uidSuffix}`;
  const compare = opts.compare ?? true;
  const event: TimelineEvent = {
    uid: uidStr,
    kind: "feed",
    start,
    end: start,
    open: false,
    cat: null,
    identity: null,
    confidence: null,
    thumb: null,
    scene: null,
    before: compare ? assetFor(`${uidStr}-before`) : null,
    after: compare ? assetFor(`${uidStr}-after`) : null,
    sample_count: 0,
    session: null,
    feed: { portions: opts.portions, scheduled: opts.scheduled, confirmed: opts.confirmed ?? true, single: opts.single, sides: opts.sides ?? [] },
  };
  return { event, samples: [] };
}

/** One day's worth of activity (plus a few "yesterday" rows for day-grouping), newest first,
 * deliberately mixed: an *open* meal in progress, a meal with a before/after pair, a meal
 * without one, two consecutive Pancake visits three minutes apart (collapses into one row with
 * a ×2 badge), an unidentified meal with a body-only guess (Pancake-style, exercising the
 * timeline's inline picker), a visit with no evidence captured at all, and four feeds that walk
 * every wording case: dual mode with both sides named, dual with only one side (scheduled),
 * dual with neither side named, and a single-bin (divider out) feed. `e1209` also carries a
 * Scrypted eating clip -- the timeline row badge, and the review sheet's poster/video swap. */
const FIXTURES: EventFixture[] = [
  visitOrEat("eat", "e1210", localTime(19, 58), { open: true, cat: "Pancake", confidence: 0.79, sampleCount: 2, faceEvery: 3 }),
  // 14 samples, some with face crops (faceEvery 3) -- the sheet's photo grid pages behind a
  // "+N" tile past 12, and the clip poster/play swap both exercise a real multi-sample event.
  visitOrEat("eat", "e1209", localTime(19, 20), { end: localTime(19, 26), cat: "Kitty", confidence: 0.95, sampleCount: 14, faceEvery: 3, compare: true, guess: "Kitty", clip: true }),
  // Already confirmed (Kitty); mock-hass.ts overrides two of its samples to Pancake and skips
  // one, so the sheet's photo grid shows real exception badges, not just followers.
  visitOrEat("eat", "e1208", localTime(12, 10), { end: localTime(12, 16), cat: "Kitty", identity: "reviewed", confidence: null, sampleCount: 8 }),
  // Three consecutive Whiskers meals, each a few minutes apart -- collapses into one grouped
  // timeline row with a "3 meals" badge, so the sheet's own header pager has something real to
  // page through.
  visitOrEat("eat", "e1194", localTime(18, 40), { end: localTime(18, 41), cat: "Whiskers", confidence: 0.72, sampleCount: 3, faceEvery: 2 }),
  visitOrEat("eat", "e1193", localTime(18, 38), { end: localTime(18, 39), cat: "Whiskers", confidence: 0.69, sampleCount: 2 }),
  visitOrEat("eat", "e1192", localTime(18, 36), { end: localTime(18, 37), cat: "Whiskers", confidence: 0.75, sampleCount: 2, faceEvery: 2 }),
  // Like the real e1494: a closed eat with a before/after pair but no scene frame and no
  // samples at all (spool pressure dropped everything else) -- the sheet's media stage has to
  // fall back to the compare tile itself, never a grey placeholder.
  visitOrEat("eat", "e1494", localTime(6, 50), { end: localTime(6, 58), cat: "Pancake", confidence: 0.62, noEvidence: true, compare: true }),
  visitOrEat("visit", "e1207", localTime(9, 45), { cat: "Kitty", confidence: 0.86, sampleCount: 2 }),
  visitOrEat("visit", "e1206", localTime(15, 50), { cat: "Pancake", confidence: 0.77, sampleCount: 2, faceEvery: 4 }),
  visitOrEat("visit", "e1205", localTime(15, 47), { cat: "Pancake", confidence: 0.74, sampleCount: 2, faceEvery: 4 }),
  visitOrEat("eat", "e1204", localTime(17, 22), { sampleCount: 3, faceEvery: 3, guess: "Pancake" }),
  visitOrEat("visit", "e1203", localTime(7, 10), { noEvidence: true }),
  visitOrEat("visit", "e1202", localTime(8, 5), { cat: "Whiskers", confidence: 0.68, sampleCount: 2 }),
  // Dual, both sides fired, both named -- "Fed 1 kibble and 2 freeze-dried".
  feedEvent("f1201", localTime(12, 0), {
    portions: 3,
    single: false,
    sides: [
      { hopper: 1, portions: 1, food: "kibble" },
      { hopper: 2, portions: 2, food: "freeze-dried" },
    ],
    scheduled: false,
  }),
  // Dual, one side only, named -- "Fed 5 portions of kibble".
  feedEvent("f1200", localTime(7, 30), { portions: 5, single: false, sides: [{ hopper: 1, portions: 5, food: "kibble" }], scheduled: true }),
  visitOrEat("eat", "e1199", localTime(19, 10, 1), { end: localTime(19, 16, 1), cat: "Pancake", confidence: 0.81, sampleCount: 3, compare: true }),
  // Dual, both sides fired, neither named -- "Fed 2 from hopper 1 and 1 from hopper 2".
  feedEvent("f1196", localTime(16, 30), {
    portions: 3,
    single: false,
    sides: [
      { hopper: 1, portions: 2, food: null },
      { hopper: 2, portions: 1, food: null },
    ],
    scheduled: false,
  }),
  // Single bin (divider out) -- "Fed 5 portions", never a hopper word.
  feedEvent("f1198", localTime(7, 30, 1), { portions: 5, single: true, scheduled: true }),
  visitOrEat("visit", "e1197", localTime(7, 10, 1), { sampleCount: 2 }),
];

export const TIMELINE_EVENTS: TimelineEvent[] = FIXTURES.map((f) => f.event);

// ---- `kibble/review` extra fixture data: `import`-kind events from the one-off migration
// (docs/36-ai-pipeline.md's "Migration" step 3) -- never shown in the timeline, always in the
// review queue, giving the cats card's paged grid more than one page (24/page) to actually
// page through. ----
function importEvent(index: number): EventFixture {
  const uidStr = `${ENTRY_ID}-i${2000 + index}`;
  const start = secondsAgo(4000 + index * 12);
  const sUid = `${uidStr}-s1`;
  const guess = index % 5 === 0 ? "Kitty" : index % 5 === 1 ? "Pancake" : null;
  const sample: Sample = {
    uid: sUid,
    t: start,
    body: null,
    face: assetFor(`${sUid}-face`),
    guess,
    guess_confidence: guess ? 0.4 + (index % 6) * 0.07 : null,
      review: null,
      cat: null,
    sid: null,
    box: null,
    crop: null,
    peers: [],
    label: null,
  };
  const event: TimelineEvent = {
    uid: uidStr,
    kind: "import",
    start,
    end: start,
    open: false,
    cat: null,
    identity: "unknown",
    confidence: null,
    thumb: sample.face,
    scene: null,
    before: null,
    after: null,
    sample_count: 1,
    session: null,
  };
  return { event, samples: [sample] };
}

const IMPORT_FIXTURES: EventFixture[] = Array.from({ length: 26 }, (_, i) => importEvent(i));

export const REVIEW_EVENTS: TimelineEvent[] = [
  ...FIXTURES.filter((f) => f.event.kind !== "feed" && f.event.cat === null).map((f) => f.event),
  ...IMPORT_FIXTURES.map((f) => f.event),
];

export const EVENT_SAMPLES: Record<string, Sample[]> = Object.fromEntries([...FIXTURES, ...IMPORT_FIXTURES].map((f) => [f.event.uid, f.samples]));

const MULTICAT_SCENE = assetFor("e1713-scene-1");
const KITTY_BOX: Box = [0.24, 0.09, 0.36, 0.5];
const PANCAKE_BOX: Box = [0.36, 0.12, 0.48, 0.5];
const KITTY_CROP: Box = [0.14583333333333334, 0.04722222222222222, 0.4548611111111111, 0.5416666666666666];
const PANCAKE_CROP: Box = [0.2760416666666667, 0.08055555555555556, 0.5625, 0.5388888888888889];

function multiCatEvent(uidSuffix: string, session: string, cat: string | null, sid: number, box: Box, peer: Box, crop: Box, start: number, end: number): EventFixture {
  const uid = `${ENTRY_ID}-${uidSuffix}`;
  const samples: Sample[] = [1, 2].map((index) => {
    const sampleUid = `${uid}-s${index}`;
    return {
      uid: sampleUid,
      t: start + index * 20,
      body: assetFor(`${sampleUid}-body`),
      face: null,
      guess: cat,
      guess_confidence: cat ? 0.91 : null,
      review: null,
      cat: null,
      sid,
      box: [...box] as Box,
      crop: [...crop] as Box,
      peers: [[...peer] as Box],
      label: null,
    };
  });
  return {
    event: {
      uid,
      kind: "eat",
      start,
      end,
      open: false,
      cat,
      identity: cat ? "auto" : "unknown",
      confidence: cat ? 0.91 : null,
      thumb: samples[0].body,
      scene: MULTICAT_SCENE,
      before: null,
      after: null,
      sample_count: samples.length,
      clip: null,
      session,
    },
    samples,
  };
}

const knownSession = `${ENTRY_ID}-session-e1713`;
const unknownSession = `${ENTRY_ID}-session-e1712`;
const kittyStart = secondsAgo(12);
const pancakeStart = secondsAgo(11);
const kitty = multiCatEvent("e1713-kitty", knownSession, "Kitty", 1, KITTY_BOX, PANCAKE_BOX, KITTY_CROP, kittyStart, secondsAgo(6));
const pancake = multiCatEvent("e1713-pancake", knownSession, "Pancake", 2, PANCAKE_BOX, KITTY_BOX, PANCAKE_CROP, pancakeStart, secondsAgo(5));
const unknownKitty = multiCatEvent("e1712-kitty", unknownSession, "Kitty", 1, KITTY_BOX, PANCAKE_BOX, KITTY_CROP, secondsAgo(30), secondsAgo(25));
const unknownLane = multiCatEvent("e1712-unknown", unknownSession, null, 2, PANCAKE_BOX, KITTY_BOX, PANCAKE_CROP, secondsAgo(29), secondsAgo(24));
const knownSubjects: SceneSubject[] = [
  { box: KITTY_BOX, sid: 1, label: "Kitty", reviewed: false },
  { box: PANCAKE_BOX, sid: 2, label: "Pancake", reviewed: false },
];
const e2060Uid = ENTRY_ID + "-e2060";
const E2060_KITTY_BOX: Box = [0.16171876, 0.1875, 0.3875, 0.58194447];
const E2060_JUNK_BOX: Box = [0.13359375, 0.39305556, 0.21484375, 0.5152778];
const e2060Event: TimelineEvent = { ...unknownKitty.event, uid: e2060Uid, start: secondsAgo(220), end: secondsAgo(10), session: ENTRY_ID + "-e2060-session", kind: "eat", sample_count: 42, scene: assetFor("e2060-scene-1"), cat: "Kitty", identity: "auto", confidence: 0.7 };
const e2060Samples: Sample[] = Array.from({ length: 42 }, (_, index) => {
  const original = unknownKitty.samples[index % unknownKitty.samples.length]!;
  const uid = e2060Uid + "-s" + (index + 1);
  return { ...original, uid, t: e2060Event.start + index * 4, body: assetFor(uid + "-body"), sid: 1, box: E2060_KITTY_BOX, cat: "Kitty" };
});
const e2060Subjects: SceneSubject[] = [
  { box: E2060_KITTY_BOX, sid: 1, label: "Kitty", reviewed: false },
  { box: E2060_JUNK_BOX, sid: 2, label: null, reviewed: false },
];
const singleUid = ENTRY_ID + "-single-kitty";
const singleEvent: TimelineEvent = { ...unknownKitty.event, uid: singleUid, start: secondsAgo(80), end: secondsAgo(5), session: ENTRY_ID + "-single-session", sample_count: 3 };
const singleSamples: Sample[] = [0, 1, 2].map((index) => ({ ...unknownKitty.samples[index % 2]!, uid: singleUid + "-s" + (index + 1), t: secondsAgo(80) + index * 8, cat: null }));
const knownCats = [{ cat: "Kitty", ate: true, confirmed: true, confidence: null, photos: 2 }, { cat: "Pancake", ate: false, confirmed: true, confidence: null, photos: 2 }];
pancake.event.kind = "visit";
export const MULTICAT_FIXTURES: Record<Exclude<HarnessFixture, "default">, { events: TimelineEvent[]; samples: Record<string, Sample[]>; details: Record<string, Pick<EventDetail, "scene_subjects" | "cats">>; sceneId: string }> = {
  "multicat-a": { events: [e2060Event], samples: { [e2060Uid]: e2060Samples }, details: { [e2060Uid]: { scene_subjects: e2060Subjects, cats: [{ cat: "Kitty", ate: true, confirmed: false, confidence: 0.7, photos: 42 }] } }, sceneId: "e2060-scene-1" },
  "multicat-b": { events: [kitty.event, pancake.event], samples: { [kitty.event.uid]: kitty.samples, [pancake.event.uid]: pancake.samples }, details: { [kitty.event.uid]: { scene_subjects: knownSubjects, cats: knownCats }, [pancake.event.uid]: { scene_subjects: knownSubjects, cats: knownCats } }, sceneId: "multicat-scene" },
  "multicat-c": { events: [singleEvent], samples: { [singleUid]: singleSamples }, details: { [singleUid]: { scene_subjects: [{ box: KITTY_BOX, sid: 1, label: "Kitty", reviewed: false }], cats: [{ cat: "Kitty", ate: true, confirmed: false, confidence: 0.7, photos: 3 }] } }, sceneId: "multicat-scene" },
};

export const MULTICAT_LIVE_DETECTIONS: VisionDetection[] = [
  { x1: 0.24, y1: 0.09, x2: 0.36, y2: 0.5, score: 0.96, admitted: true, sid: 1, cat: "Kitty" },
  { x1: 0.36, y1: 0.12, x2: 0.48, y2: 0.5, score: 0.94, admitted: true, sid: 2, cat: "Pancake" },
  { x1: 0.68, y1: 0.2, x2: 0.88, y2: 0.7, score: 0.82, admitted: true, sid: 3, cat: null },
  { x1: 0.8, y1: 0.72, x2: 0.96, y2: 0.96, score: 0.41, admitted: false, sid: null },
];

export const CATS: CatSummary[] = [
  { name: "Kitty", color: 0, avatar: assetFor("kitty-avatar"), avatar_custom: true, training: { total: 152, face: 138, body: 14 }, accuracy: 0.96, last_seen: localTime(19, 20), last_meal: localTime(19, 20), meals_today: 2, present: false },
  { name: "Pancake", color: 1, avatar: assetFor("pancake-avatar"), avatar_custom: false, training: { total: 24, face: 6, body: 18 }, accuracy: 0.81, last_seen: localTime(19, 58), last_meal: localTime(19, 58), meals_today: 1, present: true },
  // No trained accuracy yet (under 5 samples) and no avatar photo -- training is what makes the
  // face appear, per DESIGN.md.
  { name: "Whiskers", color: 2, avatar: null, avatar_custom: false, training: { total: 3, face: 3, body: 0 }, accuracy: null, last_seen: localTime(8, 5), last_meal: null, meals_today: 0, present: false },
];

// ---- Per-cat recognition sensor fixture data (`sensor.<device>_<cat>_recognition`) -- the WS
// `kibble/cats` response never carries this (see `lib/cat-recognition.ts`'s header for why);
// only the sensor does, one entity per roster cat, matching the real integration's own
// `translation_key: "cat_recognition"` + `unique_id: f"{serial}_cat_recognition_{slug}"`
// scheme so `findCatRecognitionEntityId` resolves these exactly like a live registry. Percent
// and learning state are this mock's own scripted values (the real backend derives them from
// review history the harness doesn't simulate) -- picked to exercise all three learning states
// across the three fixture cats: Kitty is done training, Pancake is the one Nitin is actively
// uploading more photos of, Whiskers is paused.
const CAT_RECOGNITION: Record<string, { percent: number; learningState: "learning" | "paused" | "learned"; uploads: number }> = {
  Kitty: { percent: 94, learningState: "learned", uploads: 3 },
  Pancake: { percent: 68, learningState: "learning", uploads: 9 },
  Whiskers: { percent: 35, learningState: "paused", uploads: 0 },
};

function catRecognitionEntityId(catName: string): string {
  return `sensor.plant_room_cat_feeder_${catName.toLowerCase()}_recognition`;
}

function catRecognitionEntry(catName: string): EntityRegistryEntry {
  return {
    entity_id: catRecognitionEntityId(catName),
    device_id: DEVICE_ID,
    platform: "kibble",
    translation_key: "cat_recognition",
    unique_id: `demo-serial_cat_recognition_${catName.toLowerCase()}`,
    disabled_by: null,
  };
}

function catRecognitionState(catName: string): HassEntityState {
  const info = CAT_RECOGNITION[catName]!;
  const roster = CATS.find((cat) => cat.name === catName);
  return state(catRecognitionEntityId(catName), String(info.percent), {
    training_samples: roster?.training.total ?? 0,
    uploads: info.uploads,
    basis: roster?.accuracy != null ? "reviews" : "estimate",
    learning_state: info.learningState,
  });
}

function trainingSample(cat: string, index: number, faceEvery: number): TrainingSample {
  const id = `${cat.toLowerCase()}-t${index}`;
  return {
    uid: id,
    cat,
    created: secondsAgo(5000 + index * 35),
    source: index < 6 ? "import" : "label",
    body: assetFor(`${id}-body`),
    face: (index + 1) % faceEvery === 0 ? assetFor(`${id}-face`) : null,
  };
}

export const TRAINING_BY_CAT: Record<string, TrainingSample[]> = {
  Kitty: Array.from({ length: 152 }, (_, i) => trainingSample("Kitty", i, 1)),
  // Pancake is black -- her face rarely detects, so most of her training photos are body-only.
  Pancake: Array.from({ length: 24 }, (_, i) => trainingSample("Pancake", i, 5)),
  Whiskers: Array.from({ length: 3 }, (_, i) => trainingSample("Whiskers", i, 1)),
};

export const STORAGE_FIXTURE: Storage = {
  used_bytes: Math.round(184.3 * 1024 * 1024),
  events: TIMELINE_EVENTS.length + IMPORT_FIXTURES.length + 380,
  retention_days: 14,
  oldest: secondsAgo(60 * 24 * 14),
  device_spool: { used_bytes: Math.round(2.1 * 1024 * 1024), cap_bytes: 8 * 1024 * 1024 },
};

// ---- `kibble/calibration` WS fixture data -- Hopper 1 (index 0) starts never calibrated so
// the harness can walk the whole begin/collect/mark-full/offer-inherit flow; Hopper 2 (index 1)
// starts already measured and finished so the "choose hopper" step's other status wordings
// (measured, with a date and a note) and the recalibrate/clear entry points have something to
// show without any clicking first. ----
export const INITIAL_CALIBRATION: CalibrationState = {
  hoppers: [
    null,
    {
      points: [
        { portions: 0, score: 0.03 },
        { portions: 1, score: 0.19 },
        { portions: 2, score: 0.37 },
        { portions: 3, score: 0.52 },
      ],
      full_portions: 3,
      full_score: 0.52,
      measured_at: secondsAgo(60 * 24 * 3),
      source: "measured",
      note: "Dry kibble, both hoppers",
    },
  ],
};
