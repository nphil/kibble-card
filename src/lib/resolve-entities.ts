/** Pure entity-role resolution: turn "a Kibble device_id" into the concrete entity_ids the card
 * needs, without the user ever typing an entity id. Matches on `translation_key` first (the
 * stable, name-independent identifier the integration assigns each entity role) and falls back
 * to an entity_id suffix so the card keeps working against older registry snapshots or fixtures
 * that omit translation_key. Disabled registry entries are skipped entirely: they carry no live
 * state, so surfacing them would just produce a control that can never read or write anything.
 */

import type { EntityRegistryEntry } from "../types";

export interface CatPresence {
  entityId: string;
  name: string;
}

export interface KibbleEntities {
  deviceId: string;
  camera?: string;
  feeding?: string;
  eating?: string;
  bowlFill?: string;
  hopperLevel1?: string;
  hopperLevel2?: string;
  desiccantDays?: string;
  schedule?: string;
  scheduleCardState?: string;
  feedButton?: string;
  feedButtonHopper1?: string;
  feedButtonHopper2?: string;
  cancelFeedButton?: string;
  feedAmount?: string;
  feedAmountHopper1?: string;
  feedAmountHopper2?: string;
  cloudSwitch?: string;
  /** `select.<feeder>_stack`: which userland the feeder boots (Petkit stack / LibreFeed). */
  stackSelect?: string;
  cloudConnection?: string;
  nightVisionSwitch?: string;
  statusLedSwitch?: string;
  microphoneSwitch?: string;
  lastSeenPet?: string;
  catPresence: CatPresence[];
  dishBefore?: string;
  dishAfter?: string;
  speaker?: string;
  wifiNetwork?: string;
  lastDetection?: string;
  detectionsToday?: string;
  lastDetectionImage?: string;
  /** `switch.<feeder>_detection_overlay`: draws the feeder's own live detection boxes over the
   * hero's video, gating both the overlay itself and `kibble-live-hero`'s poll of
   * `kibble/vision/last` -- off (or missing, e.g. the vendor stack) means neither happens. */
  detectionOverlaySwitch?: string;
  // The image whose `image_last_updated` timestamp changes on every pending-queue mutation
  // (advances to a new crop, or the current one's status flips once labelled) -- the training
  // inbox and the cats-card watch this to know when to re-read `kibble/faces/pending`, since
  // the diagnostic `sensor.*_pending_faces` count is disabled by default and can't be relied on
  // for that. See resolve-entities.test.ts and DESIGN.md's data-contract section.
  pendingFace?: string;
}

interface RoleRule {
  domain: string;
  translationKeys: string[];
  idSuffixes: string[];
}

type RuleRole = Exclude<keyof KibbleEntities, "deviceId" | "catPresence" | "camera" | "speaker">;

const RULES: Record<RuleRole, RoleRule> = {
  feeding: { domain: "binary_sensor", translationKeys: ["feeding"], idSuffixes: ["_feeding"] },
  eating: { domain: "binary_sensor", translationKeys: ["eating"], idSuffixes: ["_eating"] },
  bowlFill: { domain: "sensor", translationKeys: ["bowl_fill", "bowl_fill_1"], idSuffixes: ["_bowl_fill", "_bowl_fill_1", "_bowl_fill_hopper_1"] },
  hopperLevel1: { domain: "sensor", translationKeys: ["hopper_1_level"], idSuffixes: ["_hopper_1_level"] },
  hopperLevel2: { domain: "sensor", translationKeys: ["hopper_2_level"], idSuffixes: ["_hopper_2_level"] },
  desiccantDays: { domain: "sensor", translationKeys: ["desiccant_days", "desiccant_left"], idSuffixes: ["_desiccant_days", "_desiccant_left"] },
  schedule: { domain: "sensor", translationKeys: ["schedule"], idSuffixes: ["_schedule"] },
  scheduleCardState: { domain: "sensor", translationKeys: ["schedule_card_state"], idSuffixes: ["_schedule_card_state"] },
  feedButton: { domain: "button", translationKeys: ["feed"], idSuffixes: ["_feed"] },
  feedButtonHopper1: { domain: "button", translationKeys: ["feed_hopper_1"], idSuffixes: ["_feed_hopper_1"] },
  feedButtonHopper2: { domain: "button", translationKeys: ["feed_hopper_2"], idSuffixes: ["_feed_hopper_2"] },
  cancelFeedButton: { domain: "button", translationKeys: ["cancel_feed"], idSuffixes: ["_cancel_feed"] },
  feedAmount: { domain: "number", translationKeys: ["feed_amount"], idSuffixes: ["_feed_amount"] },
  feedAmountHopper1: { domain: "number", translationKeys: ["feed_amount_hopper_1"], idSuffixes: ["_feed_amount_hopper_1"] },
  feedAmountHopper2: { domain: "number", translationKeys: ["feed_amount_hopper_2"], idSuffixes: ["_feed_amount_hopper_2"] },
  cloudSwitch: { domain: "switch", translationKeys: ["cloud", "petkit_cloud"], idSuffixes: ["_cloud", "_petkit_cloud"] },
  stackSelect: { domain: "select", translationKeys: ["stack"], idSuffixes: ["_stack"] },
  cloudConnection: { domain: "sensor", translationKeys: ["cloud_connection"], idSuffixes: ["_cloud_connection"] },
  nightVisionSwitch: { domain: "switch", translationKeys: ["night", "night_vision"], idSuffixes: ["_night", "_night_vision"] },
  statusLedSwitch: { domain: "switch", translationKeys: ["light", "status_led"], idSuffixes: ["_light", "_status_led"] },
  microphoneSwitch: { domain: "switch", translationKeys: ["microphone"], idSuffixes: ["_microphone"] },
  lastSeenPet: { domain: "sensor", translationKeys: ["last_seen_pet"], idSuffixes: ["_last_seen_pet"] },
  dishBefore: { domain: "image", translationKeys: ["dish_before"], idSuffixes: ["_dish_before"] },
  dishAfter: { domain: "image", translationKeys: ["dish_after"], idSuffixes: ["_dish_after"] },
  wifiNetwork: { domain: "sensor", translationKeys: ["wifi_network", "wifi", "rssi"], idSuffixes: ["_wifi_network", "_wifi", "_rssi"] },
  lastDetection: { domain: "sensor", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  detectionsToday: { domain: "sensor", translationKeys: ["detections_today"], idSuffixes: ["_detections_today"] },
  lastDetectionImage: { domain: "image", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  detectionOverlaySwitch: { domain: "switch", translationKeys: ["detection_overlay"], idSuffixes: ["_detection_overlay"] },
  pendingFace: { domain: "image", translationKeys: ["pending_face"], idSuffixes: ["_pending_face"] },
};

function domainOf(entityId: string): string {
  return entityId.slice(0, entityId.indexOf("."));
}

function objectIdOf(entityId: string): string {
  return entityId.slice(entityId.indexOf(".") + 1);
}

function matchesRule(entry: EntityRegistryEntry, rule: RoleRule): boolean {
  if (domainOf(entry.entity_id) !== rule.domain) return false;
  if (entry.translation_key && rule.translationKeys.includes(entry.translation_key)) return true;
  const objectId = objectIdOf(entry.entity_id);
  return rule.idSuffixes.some((suffix) => objectId.endsWith(suffix));
}

function catDisplayName(entry: EntityRegistryEntry): string {
  const raw = entry.name ?? entry.original_name;
  if (raw) {
    return raw.replace(/\s+present$/i, "").trim() || raw;
  }
  const objectId = objectIdOf(entry.entity_id);
  const slug = objectId.replace(/_present$/, "");
  const lastWord = slug.split("_").filter(Boolean).pop();
  if (!lastWord) return "Cat";
  return lastWord[0]!.toUpperCase() + lastWord.slice(1);
}

function isCatPresenceEntry(entry: EntityRegistryEntry): boolean {
  if (domainOf(entry.entity_id) !== "binary_sensor") return false;
  if (entry.translation_key === "present" || entry.translation_key?.endsWith("_present")) return true;
  return objectIdOf(entry.entity_id).endsWith("_present");
}

/** Resolve every Kibble entity role for one device from the entity registry alone. `entities`
 * is the full registry map (as HA's frontend exposes on `hass.entities`), keyed by entity_id.
 */
export function resolveKibbleEntities(
  entities: Record<string, EntityRegistryEntry>,
  deviceId: string,
): KibbleEntities {
  const result: KibbleEntities = { deviceId, catPresence: [] };
  const forDevice = Object.values(entities).filter(
    (e) => e.device_id === deviceId && !e.disabled_by,
  );

  for (const entry of forDevice) {
    if (domainOf(entry.entity_id) === "camera" && !result.camera) {
      result.camera = entry.entity_id;
      continue;
    }
    if (domainOf(entry.entity_id) === "media_player" && !result.speaker) {
      result.speaker = entry.entity_id;
      continue;
    }
    if (isCatPresenceEntry(entry)) {
      result.catPresence.push({ entityId: entry.entity_id, name: catDisplayName(entry) });
      continue;
    }
    for (const roleEntry of Object.entries(RULES) as Array<[RuleRole, RoleRule]>) {
      const [role, rule] = roleEntry;
      if (result[role]) continue;
      if (matchesRule(entry, rule)) {
        result[role] = entry.entity_id;
        break;
      }
    }
  }

  result.catPresence.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
