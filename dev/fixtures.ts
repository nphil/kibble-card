/** Fixture data for the three review scenarios. Entity ids follow the real integration's
 * `plant_room_cat_feeder_*` curation; values are picked deliberately to exercise the split-bowl
 * path, the cloud-blocked footer color, a graceful-absence case (no Wi-Fi sensor in "idle"), and
 * full unavailability in "unreachable" — except `feed_amount`, which is HA-local (RestoreEntity)
 * state per `number.py` and stays available even when the agent is down.
 */

import type {
  CatSample,
  DeviceRegistryEntry,
  EntityRegistryEntry,
  HassEntityState,
  KibbleCatSummary,
  PendingFaceCrop,
  TimelineItem,
} from "../src/types";

export type ScenarioName = "idle" | "dispensing" | "unreachable";

export const DEVICE_ID = "kibble-device-1";
export const ENTRY_ID = "kibble-entry-1";

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
  config_entries: [ENTRY_ID],
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
  lastDetection: "sensor.plant_room_cat_feeder_last_detection",
  detectionsToday: "sensor.plant_room_cat_feeder_detections_today",
  lastDetectionImage: "image.plant_room_cat_feeder_last_detection",
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
    [ENTITY_IDS.lastDetection]: entry(ENTITY_IDS.lastDetection, "last_detection"),
    [ENTITY_IDS.detectionsToday]: entry(ENTITY_IDS.detectionsToday, "detections_today"),
    [ENTITY_IDS.lastDetectionImage]: entry(ENTITY_IDS.lastDetectionImage, "last_detection"),
    [ENTITY_IDS.dishBefore]: entry(ENTITY_IDS.dishBefore, "dish_before"),
    [ENTITY_IDS.dishAfter]: entry(ENTITY_IDS.dishAfter, "dish_after"),
    [ENTITY_IDS.pendingFace]: entry(ENTITY_IDS.pendingFace, "pending_face"),
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
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, minutesAgo(390), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, minutesAgo(390), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, minutesAgo(6), { status: "pending" }),
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
    // Mid-dispense: the cat that tripped the detection is still at the bowl.
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, minutesAgo(1), {
      class: "eat",
      cat: "Pancake",
    }),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "9", { by_class: { visit: 7, eat: 2 } }),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, minutesAgo(1), {
      entity_picture: "./camera-frame.svg",
    }),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, minutesAgo(1), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, minutesAgo(1), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, minutesAgo(1), { status: "pending" }),
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
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, "unavailable", {}),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "unavailable", {}),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, "unavailable", {}),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, "unavailable", {}),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, "unavailable", {}),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, "unavailable", {}),
  };
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

export const CATS: KibbleCatSummary[] = [
  { name: "Kitty", samples: 12, last_seen: secondsAgo(126), avatar: "1789500000-kitty.jpg", vendor_pet_id: 101321480, color_index: 0 },
  { name: "Pancake", samples: 9, last_seen: secondsAgo(1), avatar: "1789500600-pancake.jpg", vendor_pet_id: 101321488, color_index: 1 },
];

/** 14 pending crops, oldest first (the agent's own `GET /faces/pending` order -- "newest
 * last"), deliberately mixed: classifier-confident, classifier-vs-vendor disagreement, vendor-
 * only, and a few with no signal at all so the "tap opens the picker instead" path has
 * something to exercise. */
export const PENDING_CROPS: PendingFaceCrop[] = [
  { name: `${secondsAgo(340)}-101321480.jpg`, ts: secondsAgo(340), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Kitty", score: 0.91 } },
  { name: `${secondsAgo(325)}-101321488.jpg`, ts: secondsAgo(325), vendor_pet_id: 101321488, vendor_cat: "Pancake", guess: { cat: "Pancake", score: 0.85 } },
  { name: `${secondsAgo(310)}-101321480.jpg`, ts: secondsAgo(310), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Kitty", score: 0.88 } },
  // Disagreement: the classifier isn't confident, and the feeder's own vendor id says Kitty --
  // the suggestion chip should defer to the vendor id here, not the low-confidence guess.
  { name: `${secondsAgo(295)}-101321480.jpg`, ts: secondsAgo(295), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Pancake", score: 0.45 } },
  { name: `${secondsAgo(280)}-101321488.jpg`, ts: secondsAgo(280), vendor_pet_id: 101321488, vendor_cat: "Pancake", guess: null },
  { name: `${secondsAgo(265)}-101321480.jpg`, ts: secondsAgo(265), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: null },
  // No classifier guess and no vendor match at all -- tapping this one has nothing to confirm.
  { name: `${secondsAgo(250)}-unknown.jpg`, ts: secondsAgo(250), vendor_pet_id: null, vendor_cat: null, guess: null },
  { name: `${secondsAgo(235)}-101321480.jpg`, ts: secondsAgo(235), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Kitty", score: 0.73 } },
  // Below the confidence bar with no vendor match to fall back to: also no suggestion.
  { name: `${secondsAgo(220)}-101321480.jpg`, ts: secondsAgo(220), vendor_pet_id: 101321480, vendor_cat: null, guess: { cat: "Kitty", score: 0.3 } },
  { name: `${secondsAgo(205)}-101321488.jpg`, ts: secondsAgo(205), vendor_pet_id: 101321488, vendor_cat: "Pancake", guess: { cat: "Pancake", score: 0.95 } },
  { name: `${secondsAgo(190)}-unknown.jpg`, ts: secondsAgo(190), vendor_pet_id: null, vendor_cat: null, guess: null },
  // Exactly at the default confidence threshold -- still counts as confident.
  { name: `${secondsAgo(175)}-101321480.jpg`, ts: secondsAgo(175), vendor_pet_id: 101321480, vendor_cat: null, guess: { cat: "Kitty", score: 0.7 } },
  { name: `${secondsAgo(160)}-101321480.jpg`, ts: secondsAgo(160), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: null },
  // Just below threshold with no vendor match either.
  { name: `${secondsAgo(6)}-101321488.jpg`, ts: secondsAgo(6), vendor_pet_id: 101321488, vendor_cat: null, guess: { cat: "Pancake", score: 0.68 } },
];

function samplesFor(catName: string, count: number, startMinutesAgo: number): CatSample[] {
  return Array.from({ length: count }, (_, i) => {
    const ts = secondsAgo(startMinutesAgo + i * 720);
    return { name: `${ts}-${catName.toLowerCase()}.jpg`, ts };
  });
}

export const SAMPLES_BY_CAT: Record<string, CatSample[]> = {
  Kitty: samplesFor("Kitty", 12, 200),
  Pancake: samplesFor("Pancake", 9, 400),
};

/** One day of merged detections + feeds, newest first (per DESIGN.md's data contract), plus a
 * couple of "yesterday" rows so day-separator grouping has more than one bucket to show. */
export const TIMELINE_ITEMS: TimelineItem[] = [
  { kind: "detection", ts: localTime(18, 4), class: "eat", cat: "Pancake", pet_id: 101321488, vendor_cat: "Pancake", image: `${localTime(18, 4)}-event.jpg` },
  { kind: "detection", ts: localTime(17, 22), class: "visit", cat: "Pancake", pet_id: 101321488, vendor_cat: "Pancake", image: `${localTime(17, 22)}-event.jpg` },
  { kind: "detection", ts: localTime(15, 50), class: "visit", cat: null, pet_id: null, vendor_cat: null, image: `${localTime(15, 50)}-event.jpg` },
  { kind: "detection", ts: localTime(12, 10), class: "eat", cat: "Kitty", pet_id: 101321480, vendor_cat: "Kitty", image: `${localTime(12, 10)}-event.jpg` },
  {
    kind: "feed",
    ts: localTime(12, 0),
    amount: 3,
    hopper: "both",
    outcome: null,
    before: `${localTime(12, 0)}-before.jpg`,
    after: `${localTime(12, 0)}-after.jpg`,
  },
  { kind: "detection", ts: localTime(9, 45), class: "track", cat: "Kitty", pet_id: 101321480, vendor_cat: "Kitty", image: null },
  { kind: "detection", ts: localTime(8, 5), class: "face", cat: null, pet_id: null, vendor_cat: null, image: `${localTime(8, 5)}-event.jpg` },
  {
    kind: "feed",
    ts: localTime(7, 30),
    amount: 5,
    hopper: "both",
    outcome: null,
    before: `${localTime(7, 30)}-before.jpg`,
    after: `${localTime(7, 30)}-after.jpg`,
  },
  { kind: "detection", ts: localTime(7, 28), class: "eat", cat: "Kitty", pet_id: 101321480, vendor_cat: "Kitty", image: `${localTime(7, 28)}-event.jpg` },
  { kind: "detection", ts: localTime(19, 10, 1), class: "eat", cat: "Pancake", pet_id: 101321488, vendor_cat: "Pancake", image: `${localTime(19, 10, 1)}-event.jpg` },
  {
    kind: "feed",
    ts: localTime(18, 0, 1),
    amount: 5,
    hopper: "1",
    outcome: null,
    before: `${localTime(18, 0, 1)}-before.jpg`,
    after: `${localTime(18, 0, 1)}-after.jpg`,
  },
  { kind: "detection", ts: localTime(12, 15, 1), class: "eat", cat: "Kitty", pet_id: 101321480, vendor_cat: "Kitty", image: `${localTime(12, 15, 1)}-event.jpg` },
  {
    kind: "feed",
    ts: localTime(7, 30, 1),
    amount: null,
    hopper: null,
    outcome: null,
    before: null,
    after: null,
  },
];
