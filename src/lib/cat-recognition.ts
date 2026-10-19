/** Resolves and reads a cat's `sensor.<device>_<cat>_recognition` entity -- the per-cat
 * recognition percentage and learning state live only here, never on `kibble/cats`'s own
 * response (that WS command carries `avatar`/`avatar_custom`/`training`/`accuracy`, but the
 * confidence-weighted rolling score and its `learning`/`paused`/`learned` state are computed by
 * `autolearn.recognition_score`/`learning_state` and surfaced through `sensor.py`'s
 * `KibbleCatRecognitionSensor` alone -- see that entity's own docstring). Deliberately its own
 * small resolver rather than a new `resolveKibbleEntities` role: that function's roster is
 * fixed per device, one entity per role, while a recognition sensor is one per *cat* and needs
 * matching by name, the same shape `isCatPresenceEntry`/`catDisplayName` already solve there,
 * just keyed the other direction (name -> entity, not entity -> name).
 *
 * Matching: the entity's own `unique_id` is always `f"{serial}_cat_recognition_{slug}"`
 * (`entity.py`'s `KibbleEntity.unique_id`, `sensor.py`'s `super().__init__(coordinator,
 * f"cat_recognition_{slugify(cat_name)}")`) -- `slug` is HA's own `slugify(cat_name)`, which
 * this module approximates closely enough for the plain ASCII names a cat actually has.
 */

import type { EntityRegistryEntry, HassEntityState, HomeAssistant } from "../types";

export type LearningState = "learning" | "paused" | "learned";

export interface CatRecognition {
  /** 0-100, straight from the sensor's own state. */
  percent: number;
  state: LearningState;
}

const RECOGNITION_TRANSLATION_KEY = "cat_recognition";
const VALID_LEARNING_STATES: Record<string, LearningState> = { learning: "learning", paused: "paused", learned: "learned" };

/** A close approximation of Home Assistant's own `slugify`: lowercase ASCII, every run of
 * anything else collapsed to one underscore, no leading/trailing underscore. Real cat names are
 * plain words, so this never needs HA's fuller transliteration table to match correctly. */
function slugifyCatName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Finds `catName`'s recognition sensor among `entities` (a device's full registry slice, e.g.
 * `hass.entities`) -- `undefined` if the roster hasn't created it yet (a brand new cat) or the
 * registry snapshot is missing `unique_id` (older fixture, disabled entity). */
export function findCatRecognitionEntityId(entities: Record<string, EntityRegistryEntry>, deviceId: string, catName: string): string | undefined {
  const suffix = `cat_recognition_${slugifyCatName(catName)}`;
  for (const entry of Object.values(entities)) {
    if (entry.device_id !== deviceId || entry.disabled_by) continue;
    if (!entry.entity_id.startsWith("sensor.")) continue;
    if (entry.translation_key !== RECOGNITION_TRANSLATION_KEY) continue;
    if (entry.unique_id ? entry.unique_id.endsWith(suffix) : entry.entity_id.endsWith(`_${suffix}`)) return entry.entity_id;
  }
  return undefined;
}

/** Reads `entityId`'s current value as `{percent, state}`, or `null` while the entity doesn't
 * exist yet or hasn't reported (`unknown`/`unavailable`) -- the tile shows nothing rather than a
 * fabricated 0% for a cat whose sensor genuinely has no reading yet. */
export function readCatRecognition(hass: HomeAssistant, entityId: string | undefined): CatRecognition | null {
  if (!entityId) return null;
  const state: HassEntityState | undefined = hass.states[entityId];
  if (!state || state.state === "unknown" || state.state === "unavailable") return null;
  const percent = Number(state.state);
  if (!Number.isFinite(percent)) return null;
  const learningState = VALID_LEARNING_STATES[String(state.attributes.learning_state)] ?? "learning";
  return { percent: Math.max(0, Math.min(100, percent)), state: learningState };
}
