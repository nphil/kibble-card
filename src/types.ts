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

/** The slice of HA's real `Connection` a card needs for a push subscription (`kibble/timeline/
 * subscribe`, see `lib/live-signal.ts`). `subscribeMessage` resolves once the subscription is
 * acknowledged and calls `callback` on every subsequent push; its result unsubscribes. */
export interface HomeAssistantConnection {
  subscribeMessage: <T>(callback: (message: T) => void, message: Record<string, unknown>) => Promise<() => Promise<void>>;
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
  /** Present on every real `hass`; optional for the same reason as `fetchWithAuth` above. Only
   * `connection.subscribeMessage` is modelled -- the one method a live-push subscription needs. */
  connection?: HomeAssistantConnection;
  /** Present on every real `hass`, for the same reason as `fetchWithAuth` above -- the bearer-
   * token fallback `lib/upload-client.ts` uses when `fetchWithAuth` itself is unavailable.
   * Everything else keeps using `fetchWithAuth` exclusively, per `lib/image-cache.ts`'s
   * existing convention; only a POST (`fetchWithAuth` covers every GET this card makes) needs
   * the fallback at all. */
  auth?: { data: { access_token: string } };
  hassUrl?: string;
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
  detection_areas_hash?: string;
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

export interface KibbleScheduleCardConfig {
  type: string;
  device_id: string;
}

export interface KibbleTimelineCardConfig {
  type: string;
  device_id: string;
  name?: string;
  /** Rows shown before "Show more"; the WS command itself caps at 100. */
  limit?: number;
  /** Tallest the scrolling rail may get, any CSS length. Default
   * `clamp(360px, calc(100dvh - 200px), 900px)`.
   *
   * The timeline is open-ended -- a busy day of feeds, meals and "show more" grows without
   * bound -- and a dashboard whose first screen is a feeder should not turn into a page you
   * scroll past to reach anything else. The rail scrolls inside itself instead, with the day
   * heading sticky so you always know what you are looking at. `dvh` in the default so a
   * phone gets a proportionate rail rather than a fixed pixel height that swallows its
   * screen; the `clamp` keeps it from ever going so short (a tiny viewport) or so tall (a
   * huge one) that the rail stops reading as a bounded list.
   *
   * Set `none` to opt out and let the card grow with its content, the page's own scroll
   * carrying it instead. */
  max_height?: string;
}

export interface KibbleCatsCardConfig {
  type: string;
  device_id: string;
  name?: string;
}

// ---- `kibble/*` WebSocket payload shapes -- see `kibble` repo's
// `docs/36-ai-pipeline.md#ha-websocket-api-card-contract`, the design of record for this whole
// pipeline. Every command takes `entry_id`; every `ts`/`start`/`end` is unix seconds. ----

/** A detector box, as fractions (0..1) of the FULL camera frame: `[x1, y1, x2, y2]`. The feeder's
 * analysed frame (1280x720) and its scene photos (576x360) are the same 16:9 frame, so a box maps
 * onto a scene photo directly with no letterbox correction (`lib/boxes.ts`). */
export type Box = [number, number, number, number];

/** An authenticated, immutable media reference: `url` is already the full `/api/kibble/<entry>/
 * media/<asset>` path, fetched with `hass.fetchWithAuth` and cached forever by `id` (see
 * `lib/image-cache.ts`) -- the server never reuses an asset id for different bytes. */
export interface Asset {
  id: string;
  url: string;
}

export type TimelineEventKind = "visit" | "eat" | "feed" | "import";

/** `"auto"`: the identity engine named it and nobody has corrected that yet. `"reviewed"`: a
 * person confirmed or corrected the label. `"unknown"`: nobody -- engine or person -- could (or
 * did) name it. `"not_a_cat"`: reviewed as a false detection; such events never appear in
 * `kibble/timeline` but still count against retention. `null` on a `feed`/`import` row, where
 * identity does not apply. */
export type TimelineIdentity = "auto" | "reviewed" | "unknown" | "not_a_cat";

export interface TimelineEvent {
  uid: string;
  kind: TimelineEventKind;
  start: number;
  end: number | null;
  /** True while the feeder still has this track open (no close observed yet); `end` is `null`
   * exactly when this is true. */
  open: boolean;
  /** `null` = unknown or not applicable (a `feed` row). */
  cat: string | null;
  identity: TimelineIdentity | null;
  /** The engine's own probability for `cat`, 0..1 -- only meaningful when `identity === "auto"`;
   * `null` otherwise (a person's review carries no probability, and neither does "unknown"). */
  confidence: number | null;
  /** The best body crop, or `null` when none was captured (spool pressure, or a legacy row). */
  thumb: Asset | null;
  scene: Asset | null;
  before: Asset | null;
  after: Asset | null;
  sample_count: number;
  /** The Scrypted Events Recorder clip backing this session (docs/39-eating-clips.md),
   * `eat` rows only. Present as `null` on any `visit`/`eat` row with no clip linked (yet, or
   * ever -- Scrypted never triggered, or the clip aged out of its own quota); absent entirely
   * on a `feed`/`import` row, which never has one. A split child's own value already resolves
   * through its parent server-side, so `start_ms` here is the ONE shared clip's own start --
   * combine it with this row's own `start` (`lib/clip-offset.ts`) to seek to this cat's own
   * slice of a multi-cat meal. */
  clip?: { start_ms: number; end_ms: number } | null;
  /** Shared by every per-cat row split out of one feeder session (the hidden parent's uid);
   * `null` for a session that was never split. Rows with the same `session` whose time spans
   * overlap were at the feeder together (docs/42-multi-cat.md). */
  session: string | null;
  feed?: TimelineFeedDetail;
}

/** One hopper's contribution to a `feed`-kind row, only present when it actually dispensed
 * more than 0 portions -- a "1"-targeted feed carries just one entry, never a zero-portion
 * placeholder for the side that didn't fire. Always in hopper order. `food` is the name
 * recorded at ingest time (frozen even if the hopper is later renamed or emptied), `null`
 * when it was unnamed then. */
export interface TimelineFeedSide {
  hopper: 1 | 2;
  portions: number;
  food: string | null;
}

/** A `feed`-kind row's detail. `single` is the row's own recorded mode -- the coordinator's
 * *current* mode, for a row old enough to predate this field. In single mode `sides` is
 * always `[]` and `portions` is the one bin's total. In dual mode `sides` names every hopper
 * that actually fired; it is also `[]` on a legacy row that predates per-side tracking, in
 * which case `portions` is still the row's honest total, just without a per-hopper
 * breakdown -- callers must not treat an empty `sides` as "nothing dispensed" the way a
 * missing `feed` or a null `portions` means that. */
export interface TimelineFeedDetail {
  portions: number;
  scheduled: boolean;
  confirmed: boolean;
  single: boolean;
  sides: TimelineFeedSide[];
}

export interface Sample {
  uid: string;
  t: number;
  body: Asset | null;
  face: Asset | null;
  /** The engine's best guess for this one sample and its probability -- `null`/`null` when the
   * sample has no usable signal at all. Distinct from the event-level `confidence`: a session can
   * average several samples that individually disagree. */
  guess: string | null;
  guess_confidence: number | null;
  /** This sample's own override, or `null` to follow whatever the event ends up labelled:
   * a cat name, `"not_a_cat"`, or `"skip"` (left out of training regardless of the event).
   * The raw `samples.review` column -- most rendering wants `label` instead. */
  review: string | null;
  /** The feeder's own per-session animal id: which animal of this session this photo shows.
   * `null` on photos from before multi-cat tracking. */
  sid: number | null;
  /** What the detector actually found for this animal, 0..1 of the full frame; `null` when the
   * feeder sent no box. */
  box: Box | null;
  /** The region of the full frame that this photo's body crop shows, 0..1; map `box`/`peers`
   * into the crop with `lib/boxes.ts`'s `boxInCrop`. `null` when the crop geometry is unknown
   * or untrusted -- then nothing is drawn on the crop. */
  crop: Box | null;
  /** The other animals' boxes in the same camera frame, 0..1 of the full frame. */
  peers: Box[];
  /** Which of the session's cats this photo belongs to (the photo's own person-chosen cat, else
   * the cat its animal was identified as, else the session's main cat); `null` while the
   * session has no cat. Groups the sheet's photo grid when two cats were there. */
  cat: string | null;
  /** What this photo actually, currently teaches: the saved cat name, `"not_a_cat"`, or
   * `"skip"`; `null` when nothing has been saved for it yet (still just `guess`). */
  label: string | null;
}

export interface TrainingSample {
  uid: string;
  cat: string;
  created: number;
  source: "label" | "import" | "upload" | "auto";
  body: Asset | null;
  face: Asset | null;
}

export interface CatSummary {
  name: string;
  /** This cat's stable 0-based slot in the shared four-colour palette (`styles/tokens.ts`'s
   * `catColorAt`) -- not an array position, a persistent identity so a cat's colour never
   * shifts when another cat is added or removed. */
  color: number;
  avatar: Asset | null;
  /** Whether `avatar` was chosen by a person (`kibble/cats/avatar/set`, or an avatar upload)
   * rather than auto-picked (the newest trained photo) -- gates the avatar picker's "Reset"
   * entry, which only makes sense once there is a choice to undo. */
  avatar_custom: boolean;
  training: { total: number; face: number; body: number };
  /** Leave-one-out accuracy, 0..1; `null` under 5 training samples (not enough to measure). */
  accuracy: number | null;
  last_seen: number | null;
  last_meal: number | null;
  meals_today: number;
  present: boolean;
}

export interface Storage {
  used_bytes: number;
  events: number;
  retention_days: number;
  oldest: number | null;
  device_spool: { used_bytes: number; cap_bytes: number } | null;
}

/** `kibble/timeline` and `kibble/review`'s shared page shape (also `kibble/training`, item type
 * substituted -- see `TrainingPage`). */
export interface TimelinePage {
  items: TimelineEvent[];
  cursor: string | null;
  has_more: boolean;
}

/** `kibble/review`'s page shape -- same as `TimelinePage` plus a `total` count across every page,
 * shown next to the paging controls so "24 of 61" is honest rather than guessed. */
export interface ReviewPage {
  items: TimelineEvent[];
  total: number;
  cursor: string | null;
  has_more: boolean;
}

/** One animal visible in the session's scene photo (`kibble/event`'s `scene_subjects`). */
export interface SceneSubject {
  /** 0..1 of the full frame -- the scene photo IS that frame. */
  box: Box;
  /** The feeder's id for this animal within the session; `null` on boxes that cannot be named
   * (older sessions). Only boxes with a `sid` are tappable: `kibble/session/subject`. */
  sid: number | null;
  /** Who this animal is: a cat name, `"not_a_cat"`, or `null` while nobody knows. */
  label: string | null;
  /** Whether a person decided `label`, as opposed to the identity engine. */
  reviewed: boolean;
}

/** One cat that was at the feeder during this session (`kibble/event`'s `cats`). */
export interface SessionCat {
  cat: string;
  /** Counted as a meal for this cat (the session's "ate"), versus only "came by". */
  ate: boolean;
  /** A person confirmed this cat was here; `false` = the identity engine's suggestion. */
  confirmed: boolean;
  /** The engine's probability for an unconfirmed suggestion, else `null`. */
  confidence: number | null;
  /** How many of the session's photos belong to this cat. */
  photos: number;
}

/** `kibble/event`'s response, and the reply of every `kibble/session/*` write: the WHOLE feeder
 * session the requested uid belongs to (any per-cat row of it resolves to the same session). */
export interface EventDetail {
  /** The session as one row: its time span, media (scene, before/after, clip) and `kind`
   * (`eat` when anyone ate). `uid` is the session's own uid: pass it to `kibble/session/*`.
   * Identity lives in `cats`, not in this row's `cat`/`identity`. */
  event: TimelineEvent;
  /** Every photo of the session, in time order. */
  samples: Sample[];
  /** Every animal in `event.scene`'s own frame, left to right; `[]` when the scene carries no
   * box data (older sessions, or an eat-start fallback frame). */
  scene_subjects: SceneSubject[];
  /** Who was here, in display order (eaters first); `[]` = nobody knows yet. A session a person
   * marked "Not a cat" has `event.identity === "not_a_cat"` and `cats: []`. */
  cats: SessionCat[];
  /** The vision judge saw more than one cat in this session's photos (a hint for the person
   * when fewer cats are ticked; never applied on its own). */
  multiple_cats: boolean;
}

/** `kibble/cats`'s response. */
export interface CatsResponse {
  cats: CatSummary[];
  storage: Storage;
}

/** `kibble/training`'s response. */
export interface TrainingPage {
  items: TrainingSample[];
  total: number;
  cursor: string | null;
  has_more: boolean;
}

/** `POST /api/kibble/<entry_id>/upload/training/<cat>`'s response -- always this shape, even on
 * a non-2xx status (413/400/404/507 all still carry it): never a bare HTTP error for a
 * rejection the user needs to see per-file, only for a request wrong at the transport level.
 * `reason` and `sample` are each present only when `status` is `"error"`/`"added"`. */
export interface UploadTrainingResult {
  status: "added" | "duplicate" | "no_cat" | "error";
  message: string;
  reason?: "too_large" | "bad_image" | "not_found" | "disk_full";
  sample?: TrainingSample;
}

/** `POST /api/kibble/<entry_id>/upload/avatar/<cat>`'s response: `avatar` on success, `error`
 * otherwise -- no `no_cat`/duplicate gate for a deliberately chosen avatar photo. */
export interface UploadAvatarResult {
  avatar?: Asset;
  error?: string;
}

// ---- `kibble/vision/last` WebSocket payload (forwards LibreFeed's `GET /vision/last`
// verbatim) -- the feeder's own most recent analysed frame, exactly as its admission stage saw
// it. Every field here may be absent on an older daemon; a consumer (the live hero's detection
// overlay, `lib/boxes.ts`) must degrade quietly rather than assume a full shape. ----

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
  /** The feeder's own per-session animal id for this box, stable frame to frame; `null` for
   * clutter, or an animal seen in only one frame so far. Absent on an older feeder. */
  sid?: number | null;
  /** Home Assistant's name for this animal -- the same cat its timeline row shows -- or `null`
   * while unknown. Absent on an older integration. */
  cat?: string | null;
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
  /** The feeder's own id for the session (track) currently open, `null` when none is. Home
   * Assistant resolves each detection's `sid` against it to fill in `cat`. */
  event_id?: number | null;
  /** Echoes the daemon's own `detection_overlay` config flag. */
  overlay?: boolean;
  /** Echoes `detection_overlay_ignored`: whether to draw the `admitted: false` boxes, which the
   * daemon always sends regardless so `/vision/last` stays a complete diagnostic. */
  overlay_suppressed?: boolean;
}

/** `kibble/vision/areas` returns and accepts the daemon's normalized ignore-mask rectangles as
 * `[x1, y1, x2, y2]`. There is no "include"/focus counterpart: a fixed bowl camera has nothing
 * useful to positively scope, and a hard "outside this box is invisible" gate silently drops
 * real detections with no feedback -- see `kibble-detection-areas-dialog.ts`'s header for the
 * removal rationale (evidence-based, not merely unused). */
export interface VisionAreas {
  exclude: number[][];
}

/** `kibble/vision/bowl` returns and accepts the daemon's `bowl_roi` -- a single `[x1,y1,x2,y2]`
 * zone, separate from `VisionAreas`, that gates eat detection (`bowl_overlap` above) and food-
 * occlusion. Unlike ignore masks this is not a list: the daemon always has exactly one bowl
 * zone (`librefeed/daemon/src/vision.rs`'s `VisionConfig.bowl_roi`, defaulting to the
 * bottom-centre third), editable but never added or removed. */
export interface VisionBowl {
  bowl_roi: number[];
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
