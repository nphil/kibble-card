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
  // Optional Bubble Card pop-up hash for the gear: unset (the HACS default) opens the in-card
  // settings dialog; set, the gear navigates to that dashboard pop-up instead.
  settings_hash?: string;
  // Set when the dashboard has its own schedule surface (a `#schedule` pop-up, a schedule
  // section): the hero then omits its "Next feed" line entirely instead of duplicating it.
  // Unset, the line expands in place with the embedded schedule editor.
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
  /** Also show bare "a cat came by" visit rows (passed to `kibble/timeline` as
   * `include_visits`). Off by default -- an unnamed visit with no feed or identification
   * nearby is noise; see `lib/timeline.ts#filterVisits`. */
  show_visits?: boolean;
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

export interface TimelineIdentifiedItem {
  kind: "identified";
  ts: number;
  /** Resolved via the integration's `vendor_pet_ids` option; the literal fallback name "Unknown
   * cat" when the feeder's vendor id isn't mapped to one yet. Never null -- this row always
   * names *someone*, unlike a bare "detection" row ever did. */
  cat: string;
  /** Which class the live image (if any) came from -- `"eat"` when this identification paired
   * with a real eat detection (food actually left the bowl), `"visit"` when it only paired
   * with a visit, `null` when nothing paired nearby at all. Picks "ate" vs "was at the bowl" in
   * `lib/timeline.ts#detectionHeadline`; never infer the verb from `image` instead. */
  paired_class: "eat" | "visit" | null;
  /** Bare token for the HTTP image view's `track` kind (`kibbleImageUrl(entryId, "track",
   * image)`) -- a track carries no filename of its own, so the view resolves the actual paired
   * eat/visit JPEG by ts server-side. `null` when no candidate was found nearby (a fresh
   * identification can self-correct once its eat/visit is polled). */
  image: string | null;
}

export interface TimelineVisitItem {
  kind: "visit";
  ts: number;
  /** Bare filename under the HTTP image view's `event` kind, or `null`. Only present in a
   * `kibble/timeline` response when the card requested `include_visits: true` -- see
   * `lib/timeline.ts#filterVisits` and `KibbleTimelineCardConfig.show_visits`. */
  image: string | null;
}

export interface TimelineEatItem {
  kind: "eat";
  ts: number;
  /** Bare filename under the HTTP image view's `event` kind, or `null`. An "eat" only ever
   * appears unpaired like this when no `track` identification landed nearby -- a named
   * identification absorbs its eat's image into `TimelineIdentifiedItem` instead. */
  image: string | null;
}

export interface TimelineFeedItem {
  kind: "feed";
  ts: number;
  amount: number | null;
  hopper: string | null;
  /** `false` for a scheduler-fired cycle, `true` for one associated with a manual `POST /feed`
   * (or the `feed` service) -- drives the quiet "(scheduled)" tag; see
   * `lib/timeline.ts#feedSummary`. */
  manual: boolean;
  /** Bare filenames under the HTTP image view's `feed` kind. */
  before: string | null;
  after: string | null;
}

export type TimelineItem = TimelineIdentifiedItem | TimelineVisitItem | TimelineEatItem | TimelineFeedItem;

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

/** `POST /faces/upload`'s response shape, passed through verbatim by `kibble/faces/upload`. */
export interface FaceUploadResult {
  name: string;
  samples: number;
  low_quality?: boolean;
}
