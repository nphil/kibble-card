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
  /** Hash that opens the bowl-calibration wizard, default `#calibrate`. Needed when the
   * dashboard's settings live in an external pop-up (a Bubble Card, say) rather than in this
   * card's own settings panel: the wizard is inside this element, and a hash is the only
   * handle a card outside it has on it. */
  calibrate_hash?: string;
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
  /** Tallest the scrolling rail may get, any CSS length. Default `min(60vh, 560px)`.
   *
   * The timeline is open-ended -- a busy day of feeds, meals and "show more" grows without
   * bound -- and a dashboard whose first screen is a feeder should not turn into a page you
   * scroll past to reach anything else. The rail scrolls inside itself instead, with the day
   * heading sticky so you always know what you are looking at. `vh` in the default so a phone
   * gets a proportionate rail rather than a fixed pixel height that swallows its screen.
   *
   * Set `none` to opt out and let the card grow with its content. */
  max_height?: string;
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
   * with a visit, `null` when nothing paired nearby at all. Picks "ate" vs "was here" in
   * `lib/timeline.ts#detectionHeadline`; never infer the verb from `image` instead. */
  paired_class: "eat" | "visit" | "face" | null;
  /** Which HTTP image view kind resolves `image`: `track` (a vendor track, paired server-side
   * by ts) or `event` (a labelled face crop's own filename). */
  image_kind: "track" | "event";
  /** Bare token for the HTTP image view's `track` kind (`kibbleImageUrl(entryId, "track",
   * image)`) -- a track carries no filename of its own, so the view resolves the actual paired
   * eat/visit JPEG by ts server-side. `null` when no candidate was found nearby (a fresh
   * identification can self-correct once its eat/visit is polled). */
  image: string | null;
  /** A cat-eating-at-the-bowl before/after pair, bare filenames under the HTTP image view's
   * `event` kind (same as `image`), or absent/`null` on an agent that predates this pair.
   * Optional at both levels -- an agent may send neither, one, or both -- so a consumer always
   * checks for their presence rather than assuming they travel together. See
   * `lib/timeline.ts#comparePairFor`/`resolveThumbnail` for how a row picks between this pair
   * and the plain `image` above. */
  image_before?: string | null;
  image_after?: string | null;
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
  /** See `TimelineIdentifiedItem.image_before`/`image_after` -- the same optional eat
   * before/after pair, absent on an agent that predates it. */
  image_before?: string | null;
  image_after?: string | null;
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
  /** `false` when the feeder dispensed but its MCU never returned a completed record: the
   * food went out, but `amount` is what was commanded rather than what the hardware
   * measured. Absent on rows from an older agent, which are all confirmed. */
  confirmed?: boolean;
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

// ---- `kibble/vision/last` WebSocket payload (forwards LibreFeed's `GET /vision/last`
// verbatim) -- the feeder's own most recent analysed frame, exactly as its admission stage saw
// it. Every field here may be absent on an older daemon; a consumer (the live hero's detection
// overlay, `lib/vision-overlay.ts`) must degrade quietly rather than assume a full shape. ----

/** One raw body box exactly as the object detector reported it, in the analysed frame's own
 * pixel space (`VisionFrame.w`/`h`) -- NOT a fraction, and NOT what the overlay draws (see
 * `VisionDetection` for that). Diagnostic only. */
export interface VisionBody {
  score: number;
  box: [number, number, number, number];
}

/** One de-duplicated detection, in fractions (0..1) of the analysed frame -- this is the array
 * the live hero's overlay actually draws, directly as CSS percentages. `admitted: false` means
 * the clutter memory suppressed it (furniture the detector keeps hallucinating): still sent,
 * and still drawn, just quieter -- showing it is how a user sees why a detection wasn't counted. */
export interface VisionDetection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  score: number;
  admitted: boolean;
}

/** `GET /vision/last`'s body, forwarded verbatim by `kibble/vision/last {entry_id}` as
 * `{frame}`; `frame` is `null` when the agent has not analysed a frame yet (vision off, or
 * media still starting). */
export interface VisionFrame {
  at_ms?: number;
  wall_unix?: number;
  /** Analysed-frame pixel dimensions -- `bodies[].box`'s coordinate space; irrelevant to
   * `detections`, which are already fractions of it. */
  w?: number;
  h?: number;
  bodies?: VisionBody[];
  detections?: VisionDetection[];
  faces?: number;
  has_body?: boolean;
  bowl_overlap?: boolean;
  moved?: boolean;
  /** Whether the pipeline currently believes a real animal (not clutter) is present. */
  verified?: boolean;
  present_frames?: number;
  clutter_regions?: number;
  /** The currently open track's identification, or `null` while unidentified. */
  cat?: string | null;
  cat_score?: number | null;
  /** Echoes the daemon's own `detection_overlay` config flag. */
  overlay?: boolean;
  /** Echoes `detection_overlay_ignored`: whether to draw the `admitted: false` boxes, which the
   * daemon always sends regardless so `/vision/last` stays a complete diagnostic. */
  overlay_suppressed?: boolean;
}

// ---- `kibble/calibration` WebSocket payload (forwards LibreFeed's `GET /calibration`
// verbatim) -- one entry per hopper, at the daemon's own 0-based array position; `null` means
// that hopper has never been calibrated. `kibble/calibration/action` (`begin`/`point`/`full`/
// `inherit`/`clear`) returns this same shape after acting, so the wizard never needs a second
// read just to see what it just did. See `lib/calibration.ts` for the step logic built on
// this, and DESIGN.md's calibration section for the full wire contract. ----

export interface CalibrationPoint {
  /** Portions dispensed since the curve's `begin`, including the initial `0` (empty bowl). */
  portions: number;
  /** The bowl's raw vision score at that portion count -- the same unitless number `bowl_fill`
   * reports live, not a percentage (kibble docs/34; see `lib/calibration.ts`'s header). */
  score: number;
}

/** `"measured"` for a curve captured on this hopper directly; `{inherited_from}` (the *other*
 * hopper's 0-based index) when this curve was copied over via the wizard's "same food in both
 * hoppers" shortcut instead of measured again. */
export type CalibrationSource = "measured" | { inherited_from: 0 | 1 };

export interface CalibrationHopper {
  points: CalibrationPoint[];
  /** The portion count the operator confirmed as "full", or `null` until they do -- a curve
   * with points but no `full_portions` yet is mid-calibration, not finished. */
  full_portions: number | null;
  /** `points.find(p => p.portions === full_portions)?.score`, kept alongside rather than
   * re-derived so a consumer never has to search `points` to know the top of the curve. */
  full_score: number | null;
  /** Unix seconds. */
  measured_at: number;
  source: CalibrationSource;
  note: string;
}

/** `kibble/calibration {entry_id}`'s response. Array position is the daemon's own hopper
 * index (0 = "Hopper 1", 1 = "Hopper 2" in every user-facing string -- the +1 is display-only,
 * never sent back over the wire; confirmed against the integration side of this contract). */
export interface CalibrationState {
  hoppers: [CalibrationHopper | null, CalibrationHopper | null];
}
