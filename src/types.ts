/** Minimal Home Assistant frontend types this card actually uses.
 *
 * Deliberately hand-rolled instead of depending on `home-assistant-frontend`'s types: that
 * package pulls in a large, fast-moving type surface for the handful of shapes this card reads.
 */

export interface HassEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface EntityRegistryEntry {
  entity_id: string;
  device_id: string | null;
  platform?: string;
  translation_key?: string | null;
  unique_id?: string;
  name?: string | null;
  original_name?: string | null;
  disabled_by?: string | null;
  hidden_by?: string | null;
}

export interface DeviceRegistryEntry {
  id: string;
  name: string | null;
  name_by_user?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  identifiers?: Array<[string, string]>;
  config_entries?: string[];
}

export interface HomeAssistant {
  states: Record<string, HassEntityState>;
  entities: Record<string, EntityRegistryEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  themes: { darkMode?: boolean; [key: string]: unknown };
  language: string;
  locale?: { language: string; [key: string]: unknown };
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown>;
  callWS?: (msg: Record<string, unknown>) => Promise<unknown>;
  // Real Home Assistant always provides this (it's how every authenticated HTTP view is
  // fetched from the frontend); optional here only so older hand-rolled `hass` shims and the
  // dev harness's mock stay honest about what they actually implement.
  fetchWithAuth?: (input: string, init?: RequestInit) => Promise<Response>;
}

export interface KibbleCardConfig {
  type: string;
  device_id: string;
  name?: string;
  // Optional Bubble Card pop-up hashes. Unset (the HACS default, card standing alone with no
  // pop-up dashboard): the gear opens the in-card settings dialog and the schedule line
  // expands in place, exactly as before -- the card must stay whole with zero dashboard setup.
  // Set: gear/schedule-line navigate via `window.location.hash` instead, for a dashboard that
  // defines its own `#settings`/`#schedule` pop-ups.
  settings_hash?: string;
  schedule_hash?: string;
  /** Scrypted device id of the feeder camera (Scrypted → camera → "Scrypted NVR Card id", or
   * the number in its device URL). Set it and the hero plays Scrypted's WebRTC stream with
   * push-to-talk; leave it empty and the hero stays a snapshot. Scrypted is the only path to the
   * feeder's audio/video, so there is no second stream to configure. */
  scrypted_id?: string;
}

export interface KibbleTimelineCardConfig {
  type: string;
  device_id: string;
  name?: string;
  /** Rows shown before "Show more"; the WS command itself caps at 100. */
  limit?: number;
}

export interface KibbleCatsCardConfig {
  type: string;
  device_id: string;
  name?: string;
  /** Minimum classifier `guess.score` a pending crop needs before the suggestion chip trusts
   * it over the feeder's own vendor identification. See `lib/suggestion.ts`. */
  confidence?: number;
}

// ---- `kibble/*` WebSocket payload shapes (custom_components/kibble, DESIGN.md "Data
// contracts") -- every `ts` is unix seconds, passed through unconverted from the agent. ----

export interface TimelineDetectionItem {
  kind: "detection";
  ts: number;
  class: string;
  cat: string | null;
  pet_id: number | null;
  vendor_cat: string | null;
  /** Bare filename under the HTTP image view's `event` kind, or `null` if the agent never
   * captured one for this row. */
  image: string | null;
}

export interface TimelineFeedItem {
  kind: "feed";
  ts: number;
  amount: number | null;
  hopper: string | null;
  /** Always `null` today -- the agent has no failed/cancelled feed variant, so there is
   * nothing honest to report here. Never rendered; see `lib/timeline.ts#feedSummary`. */
  outcome: string | null;
  /** Bare filenames under the HTTP image view's `feed` kind. */
  before: string | null;
  after: string | null;
}

export type TimelineItem = TimelineDetectionItem | TimelineFeedItem;

export interface KibbleCatSummary {
  name: string;
  samples: number;
  last_seen: number | null;
  /** Sample filename under the HTTP image view's `sample/{cat}` kind, or `null` before that
   * cat has any labelled sample yet. */
  avatar: string | null;
  vendor_pet_id: number | null;
  color_index: number;
}

export interface FaceGuess {
  cat: string;
  score: number;
}

export interface PendingFaceCrop {
  /** The crop filename -- `label_face`'s `crop_id` and `unlabel_face`'s `name`. */
  name: string;
  ts: number;
  vendor_pet_id: number | null;
  vendor_cat: string | null;
  guess: FaceGuess | null;
}

export interface CatSample {
  name: string;
  ts: number;
}
