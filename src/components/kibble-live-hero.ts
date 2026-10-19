/** The card's hero: a still snapshot by default, real low-latency video plus push-to-talk once
 * tapped -- Scrypted's own WebRTC when it's configured and reachable, HA's own camera stream
 * when it isn't.
 *
 * Two video transports, one UI, one decision (`lib/video-source.ts`'s `pickVideoSource`). When
 * the card's `scrypted_id` is configured AND the HA Scrypted integration is actually reporting a
 * live proxy token (`findScryptedToken`), video comes through Scrypted's own WebRTC negotiation
 * (`lib/scrypted-live.ts`) -- one source of truth for the feeder's streams, the same intercom
 * HomeKit uses, the feeder never opened a second time. Otherwise, as long as the integration
 * exposes a camera entity, video comes from HA's own `<ha-camera-stream>` (the element the stock
 * Picture Glance/Picture Entity cards use for `camera_view: live`) bound straight to that entity
 * -- HLS or WebRTC, whichever HA's `stream` integration negotiates, no Scrypted required at all.
 * Scrypted is an optimisation this card takes when it can, exactly like the integration's own
 * camera entity treats it (`custom_components/kibble/camera.py`'s module docstring) -- never a
 * dependency of either.
 *
 * - Idle: HA's `hui-image` snapshot, a "Live" affordance, no network cost beyond the snapshot.
 * - Playing: the video layer (Scrypted's `<video>`, or HA's `<ha-camera-stream>`), muted by
 *   default (browsers refuse autoplay with sound) with a speaker toggle, and -- Scrypted only --
 *   a hold-to-talk mic button when Scrypted reports the camera has Intercom. HA's own camera
 *   stream has no talkback channel to offer, so the fallback path never renders that button
 *   rather than rendering one that would just sit there broken.
 * - Tapping the picture expands it: the SAME frame (still, video, controls) becomes a
 *   full-viewport overlay -- the video layer is never re-created, so whichever transport is live
 *   just carries on at the bigger size -- with a close chip and a fullscreen chip (the
 *   Fullscreen API on the frame; iOS Safari only allows fullscreen on a `<video>` element itself,
 *   which is why `_toggleFullscreen` falls back to Scrypted's own `<video>` there -- `ha-camera-
 *   stream`'s players sit two shadow roots down with no equivalent element to reach for, so that
 *   one shim is Scrypted-only).
 * - Talk is press-and-hold on purpose (pointer/touch/keyboard all supported): the feeder's
 *   speaker session lasts exactly as long as the button is held, which is also what keeps it from
 *   colliding with the Petkit app's own talkback.
 *
 * Robustness, Scrypted only: a WebRTC session can go quiet without Scrypted ever telling us (a
 * Wi-Fi hiccup, a throttled background tab, Scrypted itself restarting) so three independent
 * signals all feed the same reconnect path (`_beginReconnect`): the peer connection reporting
 * disconnected/failed/closed (`ScryptedLive`'s own `state === "error"`), the `<video>` going
 * `STALL_MS` without a `timeupdate`, and coming back from a hidden tab to find either. While
 * reconnecting the video is torn down so the still snapshot underneath shows through, with a
 * small icon-only badge -- never a wall of retry text over a picture of the room. A tab hidden
 * past `HIDDEN_PAUSE_MS` stops the stream outright (no point decoding video nobody can see) and
 * restarts fresh, backoff reset, on the next visible tick. None of this runs against the
 * HA-camera fallback: `<ha-camera-stream>`'s own players (`ha-hls-player`/`ha-web-rtc-player`)
 * already reconnect and pause-on-hidden themselves, so every one of these signals checks
 * `_videoSource()` first -- running them against the wrong transport would fight a session that
 * was never opened, or loop `_start()` forever against a `scryptedId` that was never configured.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { CatSummary, HomeAssistant, VisionDetection, VisionFrame } from "../types";
import { ScryptedLive, findScryptedToken } from "../lib/scrypted-live";
import { pickVideoSource, type VideoSource } from "../lib/video-source";
import { mdiIcon } from "../lib/mdi-icons";
import { RECONNECT_BASE_MS, nextReconnectDelay } from "../lib/reconnect";
import { WsQuery } from "../lib/ws-query";
import { fallbackCatColor } from "../lib/cat-colors";
import { catColorAt } from "../styles/tokens";
import type { OverlayBox } from "../lib/boxes";
import type { ImageUrlCache } from "../lib/image-cache";
import { HIDDEN, IDLE_MS, VISIBLE, onIdleTimeout, revealOnFirstTap, shouldArmTimer, type OverlayIdleState } from "../lib/overlay-idle";

/** No `timeupdate` for this long while `_playing` counts as a dead stream. */
const STALL_MS = 8000;
/** How often the stall check runs; cheap enough to just always be ticking. */
const STALL_CHECK_INTERVAL_MS = 2000;
/** A tab hidden this long stops the stream outright instead of just weathering a possible stall. */
const HIDDEN_PAUSE_MS = 60000;
/** How often the hero asks the feeder what it currently sees, while the overlay switch is on
 * and the stream is actually playing. The daemon only re-analyses at 0.5 Hz (`GET
 * /vision/last`'s own cadence) -- polling faster would just re-read the same frame -- but this
 * stays close enough to feel live without adding a second live-push channel just for a
 * diagnostic overlay. */
const VISION_POLL_MS = 1000;
/** Mirrors librefeedd's `speaker::CALL_COOLDOWN` exactly (`librefeed/daemon/src/speaker.rs`) --
 * how long the button stays disabled after a press, matching the daemon's own authoritative
 * per-call debounce so the UI is never re-enabled before a repeat press would actually work. */
const CALL_COOLDOWN_MS = 10000;
/** Roughly the feed cue's own playback length (`speaker::FEED_CUE_WAV`'s ~1.02s asset) -- purely
 * for the button's brief sound-wave pulse; the daemon remains the one authority on whether the
 * cue actually played. */
const CALL_CUE_PULSE_MS = 1100;
/** `.hero`'s box always keeps the real stream's aspect ratio (see `_reportMediaAspect`), but
 * clamped to this range -- wide enough for any plausible camera (16:9, a letterboxed 4:3, even
 * a doorbell's tall 3:4) without ever letting a corrupt metadata read squash the hero to a
 * sliver or inflate it into a near-square block that eats the whole card. */
const MIN_HERO_ASPECT = 1.0;
const MAX_HERO_ASPECT = 2.4;
/** Top inset reserved for the card's overlaid status chip and settings control. */
const LIVE_HERO_CHROME_SAFE_TOP = 8 + 48 + 8;

export class KibbleLiveHero extends LitElement {
  static properties = {
    hass: { attribute: false },
    cameraEntity: { attribute: false },
    cats: { attribute: false },
    cache: { attribute: false },
    scryptedId: { attribute: false },
    entryId: { attribute: false },
    overlayEntity: { attribute: false },
    callCatsEntity: { attribute: false },
    externalPin: { attribute: false },
    _playing: { state: true },
    _talking: { state: true },
    _muted: { state: true },
    _reconnecting: { state: true },
    _expanded: { state: true },
    _fullscreen: { state: true },
    _tick: { state: true },
    _callingCats: { state: true },
    _pulsingCue: { state: true },
    _overlayIdle: { state: true },
    _controlsFocusVisible: { state: true },
  };
  private _starting = false;
  /** Pending backoff timer between a torn-down session and the next `_start()` attempt. */
  private _reconnectTimer: number | undefined;
  /** Delay the *next* scheduled attempt will use; doubles (capped) after each failure, resets
   * on a clean connect. */
  private _backoffMs = RECONNECT_BASE_MS;
  /** `performance.now()` of the last `timeupdate`, or of starting a fresh attempt -- the stall
   * check measures staleness against this rather than against wall-clock connect time. */
  private _lastProgress = 0;
  private _stallCheckInterval: number | undefined;
  private _hiddenTimer: number | undefined;
  /** Clears `_callingCats` (the button's full cooldown window). */
  private _cooldownTimer: number | undefined;
  /** Clears `_pulsingCue` (the brief sound-wave animation, shorter than the cooldown itself). */
  private _pulseTimer: number | undefined;
  /** Fades the overlay controls back out after `IDLE_MS` of no activity; cleared/re-armed by
   * `_armIdleTimer`, never allowed to run while `_idlePinned()`. */
  private _idleTimer: number | undefined;
  /** Set once a long-hidden tab has stopped the stream, so the tab coming visible again knows
   * to restart from scratch (backoff reset) instead of treating it as a stall recovery. */
  private _hiddenPaused = false;
  /** The feeder's own most recent detection frame, polled while the overlay gate is open (see
   * `_syncVisionPolling`) -- a private field, not a reactive property, since `WsQuery` drives
   * its own `requestUpdate` on change, exactly like `kibble-card.ts`'s `_catsQuery`. */
  private _visionQuery = new WsQuery<{ frame: VisionFrame | null }>(() => this.requestUpdate());
  private _visionTimer: number | undefined;
  /** Last aspect ratio (width/height) reported via `media-aspect-changed`, so a repeat
   * `loadedmetadata`/`load` firing with the same size (Scrypted can refire it on reconnect)
   * never dispatches a redundant event or nudges `kibble-card.ts` into an extra style write. */
  private _reportedAspect: number | undefined;
  /** The `<img>` currently being watched for its `load` event inside `hui-image`'s own shadow
   * root (`_syncStillAspectWatch`) -- `null` once nothing has been found yet, or `hui-image`
   * is not in use (this component's own fallback `<img>` is bound directly in the render
   * template instead and needs no such tracking). */
  private _watchedStillImg: HTMLImageElement | null = null;

  declare hass: HomeAssistant;
  declare cameraEntity: string | undefined;
  declare cats: CatSummary[];
  declare cache: ImageUrlCache | undefined;
  declare scryptedId: string | undefined;
  /** HA config-entry id, for the `kibble/vision/last` WS call's `entry_id`. */
  declare entryId: string | undefined;
  /** `switch.<feeder>_detection_overlay`'s entity id; off or missing means no overlay, ever. */
  declare overlayEntity: string | undefined;
  /** `button.<feeder>_call_cats`'s entity id; missing or unavailable hides the button entirely
   * (`_callCatsAvailable`). */
  declare callCatsEntity: string | undefined;
  /** Set by `kibble-card.ts` while its settings dialog (opened from the `.gear-button` chrome
   * that overlaps this component from *outside* its shadow DOM) is open -- one more pin
   * condition alongside the internal ones in `_idlePinned`, so the overlay controls never fade
   * out from under a popup this component has no other way to know about. */
  declare externalPin: boolean | undefined;
  /** Live video is actually showing, whichever transport is providing it -- Scrypted's `<video>`
   * or HA's own `<ha-camera-stream>`. Gates the mute button, the detection overlay, and vision
   * polling identically either way; only the Scrypted-specific reconnect/stall/hidden-pause
   * logic additionally checks `_videoSource()` before acting on it. */
  declare private _playing: boolean;
  declare private _talking: boolean;
  declare private _muted: boolean;
  /** True from the moment a dead session is torn down until a fresh one starts playing. */
  declare private _reconnecting: boolean;
  /** The frame is a full-viewport overlay (tap to enter; Esc/backdrop/close chip to leave). */
  declare private _expanded: boolean;
  /** Native fullscreen is active on the frame (or the video, on iOS). */
  declare private _fullscreen: boolean;
  declare private _tick: number;
  /** True for the button's whole cooldown window (`CALL_COOLDOWN_MS`) from the moment it is
   * pressed -- disables it and matches the daemon's own per-call debounce
   * (`speaker::CALL_COOLDOWN`), so the button never looks pressable before a repeat press would
   * actually work. */
  declare private _callingCats: boolean;
  /** True only for the cue's own rough playback length (`CALL_CUE_PULSE_MS`), a strict subset of
   * `_callingCats`'s longer cooldown window -- drives the brief sound-wave pulse only, never the
   * disabled state itself. */
  declare private _pulsingCue: boolean;
  /** Whether the overlay controls (mute/talk/call-cats, and the expanded topbar's fullscreen/
   * close chips) are currently shown -- see `lib/overlay-idle.ts` for the state machine and
   * `_idlePinned`/`_armIdleTimer` for how this component drives it. */
  declare private _overlayIdle: OverlayIdleState;
  /** True while a control inside `.controls`/`.topbar` holds keyboard-style focus
   * (`:focus-visible`) -- a pin condition (`_idlePinned`), set/cleared by `_onFrameFocusIn`/
   * `_onFrameFocusOut`, distinct from a plain mouse-click focus, which must not itself block the
   * fade. */
  declare private _controlsFocusVisible: boolean;

  private _live = new ScryptedLive(() => {
    this._tick = (this._tick ?? 0) + 1;
  });

  constructor() {
    super();
    this.cats = [];
    this._playing = false;
    this._talking = false;
    this._muted = true;
    this._reconnecting = false;
    this._expanded = false;
    this._fullscreen = false;
    this._tick = 0;
    this._callingCats = false;
    this._pulsingCue = false;
    this._overlayIdle = VISIBLE;
    this._controlsFocusVisible = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    document.addEventListener("fullscreenchange", this._onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", this._onFullscreenChange);
    this._stallCheckInterval = setInterval(this._checkStall, STALL_CHECK_INTERVAL_MS) as unknown as number;
    this._armIdleTimer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    document.removeEventListener("fullscreenchange", this._onFullscreenChange);
    document.removeEventListener("webkitfullscreenchange", this._onFullscreenChange);
    document.removeEventListener("keydown", this._onKeyDown);
    clearInterval(this._stallCheckInterval);
    this._stallCheckInterval = undefined;
    clearInterval(this._visionTimer);
    this._visionTimer = undefined;
    clearTimeout(this._cooldownTimer);
    this._cooldownTimer = undefined;
    clearTimeout(this._pulseTimer);
    this._pulseTimer = undefined;
    clearTimeout(this._idleTimer);
    this._idleTimer = undefined;
    this._stop();
  }

  /** Which transport (if any) currently has what it needs to show live video -- computed fresh
   * from the current props on every call rather than cached, since it must never drift from
   * `hass`/`scryptedId`/`cameraEntity` for even one render or one reconnect-timer tick. */
  private _videoSource(): VideoSource {
    if (!this.hass) return { kind: "none" };
    return pickVideoSource(this.scryptedId, findScryptedToken(this.hass), this.cameraEntity);
  }

  /** The stream starts on its own as soon as the card knows where to get it, whichever transport
   * that is; the still stays underneath until the first frame paints, so the hand-over is
   * seamless either way. Only Scrypted needs an explicit start/stop dance here: a session that
   * turns out to be dead (peer connection disconnected/failed/closed) reroutes through the same
   * reconnect path a stall does, instead of leaving a frozen or blank video up forever.
   * `<ha-camera-stream>` is simply handed to `render()` and manages its own connect/reconnect
   * lifecycle, so this method's only job for that path is to flip `_playing` to match whether
   * there is a camera entity to show -- tearing down a still-live (or still-reconnecting)
   * Scrypted session first if the source just switched away from it, so the two transports can
   * never both be mid-session at once. */
  updated(changedProperties: PropertyValues): void {
    this._syncVisionPolling();
    this._syncStillAspectWatch();
    if (changedProperties.has("_talking") || changedProperties.has("_pulsingCue") || changedProperties.has("_controlsFocusVisible") || changedProperties.has("externalPin")) {
      this._syncIdlePin();
    }
    const source = this._videoSource();
    if (source.kind !== "scrypted") {
      // Only `_starting`/`_reconnecting`/`_hiddenPaused`/a non-idle `_live` mean there is an
      // actual Scrypted session to tear down -- `_playing` alone does NOT: it is also exactly
      // what a *stable* ha-camera source looks like on every render after the first, and
      // calling `_stop()` on that steady state reset it to `false` only to be set straight
      // back to `true` two lines down, which -- since each of those two assignments is a real
      // change from Lit's point of view -- scheduled another `updated()` pass forever (this is
      // the actual cause of "mounting a real camera hangs Chromium": a genuine infinite render
      // loop, not a slow one). Dropping `_playing` from this check leaves the teardown exactly
      // where it is still needed (switching away from a live/connecting/erroring Scrypted
      // session) while making steady-state ha-camera a true no-op, matching `<ha-camera-
      // stream>` managing its own connect/reconnect lifecycle once handed the entity.
      if (this._starting || this._reconnecting || this._hiddenPaused || this._live.state !== "idle") {
        this._stop();
      }
      this._playing = source.kind === "ha-camera";
      return;
    }
    if (this._live.state === "error" && this._playing) {
      this._beginReconnect();
      return;
    }
    if (this._playing || this._starting || this._reconnecting || this._hiddenPaused) return;
    void this._start();
  }

  render() {
    const source = this._videoSource();
    return html`
      ${this._expanded ? html`<div class="backdrop" @click=${this._collapse}></div>` : nothing}
      <div
        class="frame ${this._expanded ? "expanded" : ""}"
        id="frame"
        @click=${this._onFrameClick}
        @pointermove=${this._onOverlayActivity}
        @pointerenter=${this._onOverlayActivity}
        @wheel=${this._onOverlayActivity}
        @focusin=${this._onFrameFocusIn}
        @focusout=${this._onFrameFocusOut}
      >
        ${this._renderStill()}
        ${this._playing ? this._renderVideo(source) : nothing}
        ${this._playing ? this._renderDetections() : nothing}
        ${this._expanded
          ? html`<div class="topbar ${this._overlayIdle.visible ? "" : "idle-hidden"}">
              <button class="chip" aria-label=${this._fullscreen ? "Leave fullscreen" : "Fullscreen"} title=${this._fullscreen ? "Leave fullscreen" : "Fullscreen"} @click=${this._toggleFullscreen}>
                ${mdiIcon(this._fullscreen ? "fullscreenExit" : "fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${mdiIcon("close")}</button>
            </div>`
          : nothing}
        ${source.kind === "scrypted" && this._reconnecting
          ? html`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${mdiIcon("refresh")}</div>`
          : nothing}
        <div class="controls ${this._overlayIdle.visible ? "" : "idle-hidden"}">
          ${this._playing
            ? html`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
                title=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${mdiIcon(this._muted ? "volumeOff" : "volumeHigh")}
              </button>`
            : nothing}
          ${this._playing && source.kind === "scrypted" && this._live.hasIntercom
            ? html`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking ? "Stop talking to the feeder" : "Talk to the feeder"}
                title=${this._talking ? "Stop talking to the feeder" : "Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${mdiIcon(this._talking ? "microphone" : "microphoneOff")}
              </button>`
            : nothing}
          ${this._callCatsAvailable()
            ? html`<button
                class="chip call-cats ${this._pulsingCue ? "pulsing" : ""}"
                aria-label="Call the cats"
                title="Call the cats"
                ?disabled=${this._callingCats}
                @click=${this._callCats}
              >
                ${mdiIcon("cat")}
              </button>`
            : nothing}
        </div>
        ${source.kind === "scrypted" && this._live.state === "error" && !this._reconnecting
          ? html`<div class="note error">${this._live.error}</div>`
          : nothing}
      </div>
    `;
  }

  /** The live layer -- Scrypted's own `<video>` (its `srcObject` is wired up imperatively by
   * `ScryptedLive.open`, not through a template binding) or HA's `<ha-camera-stream>` bound
   * straight to the camera entity's own state object -- whichever `source` says is active.
   * `static styles` positions both by tag name into the exact box `<video>` has always had
   * (`position:absolute;inset:0`), so the detection overlay and the expand/fullscreen chips work
   * unchanged either way. No `id="video"` on the HA element: `_applyMute` and
   * `_toggleFullscreen`'s `#video` lookups assume a real `<video>` (to set `.muted`/call
   * `.play()`/`.webkitEnterFullscreen()`), true only for Scrypted's element -- giving
   * `<ha-camera-stream>` the same id would hand those two a wrong-shaped element instead of the
   * clean miss they already handle. */
  private _renderVideo(source: VideoSource) {
    if (source.kind === "scrypted") {
      return html`<video
        id="video"
        autoplay
        playsinline
        ?muted=${this._muted}
        @loadedmetadata=${this._onScryptedLoadedMetadata}
        @timeupdate=${this._onTimeUpdate}
      ></video>`;
    }
    if (source.kind === "ha-camera" && customElements.get("ha-camera-stream")) {
      return html`<ha-camera-stream
        .hass=${this.hass}
        .stateObj=${this.hass.states[source.entityId]}
        .fitMode=${"contain"}
        .muted=${this._muted}
      ></ha-camera-stream>`;
    }
    return nothing;
  }

  private _renderStill() {
    if (!this.cameraEntity) return html`<div class="placeholder">No camera on this device</div>`;
    if (customElements.get("hui-image")) {
      return html`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;
    }
    const src = this.hass.states[this.cameraEntity]?.attributes.entity_picture;
    return typeof src === "string"
      ? html`<img src=${src} alt="The feeder's camera" @load=${this._onStillImgLoad} />`
      : html`<div class="placeholder">Camera unavailable</div>`;
  }

  /** Reports the media's real width/height ratio once known -- Scrypted's `<video>` on
   * `loadedmetadata`, or the snapshot `<img>`'s natural size once it loads (`hui-image`'s own
   * internal `<img>`, reached through its shadow root, or this component's own fallback `<img>`
   * when `hui-image` is not registered) -- so `kibble-card.ts` can size `.hero` to the stream's
   * true aspect instead of a guessed default. Degenerate readings (a `0x0` metadata event, an
   * image that has not actually finished loading) are dropped; everything else is clamped to a
   * sane range so a corrupt frame can never squash the hero to a sliver or blow it up past
   * anything a camera stream plausibly is. Also set directly on this element's own
   * `--kibble-hero-aspect` (its `:host` rule below reads that same variable), so a standalone
   * `<kibble-live-hero>` -- the dev harness, `dev/parts.html` -- sizes itself correctly too, not
   * only `.hero` after the event bubbles up to `kibble-card.ts`. */
  private _reportMediaAspect(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
    const ratio = Math.min(MAX_HERO_ASPECT, Math.max(MIN_HERO_ASPECT, width / height));
    if (this._reportedAspect !== undefined && Math.abs(this._reportedAspect - ratio) < 0.001) return;
    this._reportedAspect = ratio;
    this.style.setProperty("--kibble-hero-aspect", String(ratio));
    this.dispatchEvent(new CustomEvent("media-aspect-changed", { detail: { ratio }, bubbles: true, composed: true }));
  }

  private _onScryptedLoadedMetadata = (): void => {
    this._applyMute();
    const video = this.renderRoot.querySelector<HTMLVideoElement>("#video");
    if (video) this._reportMediaAspect(video.videoWidth, video.videoHeight);
  };

  private _onStillImgLoad = (e: Event): void => {
    const img = e.target as HTMLImageElement;
    this._reportMediaAspect(img.naturalWidth, img.naturalHeight);
  };

  /** `hui-image` renders its own `<img>` inside ITS OWN shadow root -- reached only through
   * that boundary, and only best-effort: a future HA version restructuring it, or a closed
   * shadow root, just leaves the default aspect standing, never a thrown error. Re-checked on
   * every `updated()` (cheap: two `querySelector`s) rather than once, since `hui-image` mounts
   * its own `<img>` on its own render cycle, not necessarily by the time this component's
   * first render has committed. */
  private _syncStillAspectWatch(): void {
    const host = this.renderRoot.querySelector("hui-image");
    const img = (host?.shadowRoot?.querySelector("img") as HTMLImageElement | null) ?? null;
    if (img === this._watchedStillImg) return;
    if (this._watchedStillImg) this._watchedStillImg.removeEventListener("load", this._onStillImgLoad);
    this._watchedStillImg = img;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) this._reportMediaAspect(img.naturalWidth, img.naturalHeight);
    img.addEventListener("load", this._onStillImgLoad, { once: true });
  }

  /** Render each detector box independently. Rejected clutter stays quiet and opt-in, while
   * named detections use their own roster color and avatar. */
  private _renderDetections() {
    const frame = this._visionQuery.state.data?.frame;
    if (!this._overlayOn() || !frame?.detections) return nothing;
    // Older daemons without the switch echo keep the previous visible-clutter behavior.
    const showIgnored = frame.overlay_suppressed ?? true;
    const detections = frame.detections.filter((detection) => detection.admitted || showIgnored);
    if (detections.length === 0) return nothing;
    const boxes: OverlayBox[] = detections.map((detection, index): OverlayBox => {
      const name = detection.cat || null;
      const cat = name ? this.cats?.find((candidate) => candidate.name === name) : undefined;
      const named = detection.admitted && name !== null;
      return {
        key: `vision-${detection.sid ?? "unmatched"}-${index}`,
        box: [detection.x1, detection.y1, detection.x2, detection.y2],
        tone: detection.admitted ? (named ? "cat" : "unknown") : "clutter",
        color: named ? (cat ? catColorAt(cat.color) : fallbackCatColor(name)) : undefined,
        label: named ? name : undefined,
        avatar: cat?.avatar ?? null,
      };
    });
    return html`<kibble-box-overlay class="detections" .boxes=${boxes} .hass=${this.hass} .cache=${this.cache} .labelSafeTop=${LIVE_HERO_CHROME_SAFE_TOP}></kibble-box-overlay>`;
  }

  private _start = async (): Promise<void> => {
    const token = findScryptedToken(this.hass);
    if (!token || !this.scryptedId) return;
    this._starting = true;
    this._playing = true;
    this._lastProgress = performance.now();
    await this.updateComplete;
    const video = this.renderRoot.querySelector<HTMLVideoElement>("#video");
    if (!video) {
      this._starting = false;
      return;
    }
    try {
      await this._live.open({ deviceId: this.scryptedId, token }, video);
      this._reconnecting = false;
      this._backoffMs = RECONNECT_BASE_MS;
    } catch {
      this._beginReconnect();
      return;
    } finally {
      this._starting = false;
    }
  };

  /** Tears down whatever's left of a dead session and schedules the next attempt on the
   * exponential backoff (`lib/reconnect.ts`), capped at 30s. Idempotent against being called
   * again while an attempt is already pending -- a second stall/error signal arriving before the
   * backoff timer fires doesn't reset or duplicate it. */
  private _beginReconnect(): void {
    this._playing = false;
    this._reconnecting = true;
    this._talking = false;
    this._live.close();
    if (this._reconnectTimer !== undefined) return;
    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = undefined;
      void this._start();
    }, this._backoffMs) as unknown as number;
    this._backoffMs = nextReconnectDelay(this._backoffMs);
  }

  private _onTimeUpdate = (): void => {
    this._lastProgress = performance.now();
  };

  /** Runs on a fixed interval the whole time the element is connected -- cheaper and simpler
   * than starting/stopping a timer around every play/reconnect transition, and the playing/
   * reconnecting guards make it a no-op the rest of the time. Scrypted-only: `_lastProgress` is
   * only ever advanced by Scrypted's `<video>`'s `timeupdate` (`_onTimeUpdate`), so judging
   * staleness against it while the HA-camera fallback is active would just be judging silence
   * nothing ever promised to break -- `<ha-camera-stream>`'s own players watch themselves. */
  private _checkStall = (): void => {
    if (this._videoSource().kind !== "scrypted") return;
    // A hidden tab throttles media and timers alike; its silence is not a dead stream. The
    // visibility handler re-checks freshness the moment the tab is seen again.
    if (!this._playing || this._reconnecting || document.hidden) return;
    if (performance.now() - this._lastProgress > STALL_MS) this._beginReconnect();
  };

  /** The detection-overlay switch's own state -- an unresolved/missing entity (an older
   * integration, or the vendor stack, which has no vision pipeline at all) reads as off, same
   * as the switch itself being off. */
  private _overlayOn(): boolean {
    const id = this.overlayEntity;
    return id !== undefined && this.hass?.states[id]?.state === "on";
  }

  private _pollVision = (): void => {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    this._visionQuery.refresh(() =>
      callWS({ type: "kibble/vision/last", entry_id: entryId }).then((result) => result as { frame: VisionFrame | null }),
    );
  };

  /** Starts or stops the vision poll to match its three gates -- actually playing (not just a
   * still), the overlay switch on, and somewhere to ask -- every time the element updates. An
   * idle dashboard (still showing, overlay off, or torn down) never hits the feeder for this at
   * all: this is a battery-powered-adjacent embedded device. */
  private _syncVisionPolling(): void {
    const shouldPoll = this._playing && this._overlayOn() && Boolean(this.entryId) && Boolean(this.hass?.callWS);
    const isPolling = this._visionTimer !== undefined;
    if (shouldPoll === isPolling) return;
    if (!shouldPoll) {
      this._stopVisionPolling();
      return;
    }
    this._pollVision();
    this._visionTimer = setInterval(this._pollVision, VISION_POLL_MS) as unknown as number;
  }

  private _stopVisionPolling(): void {
    clearInterval(this._visionTimer);
    this._visionTimer = undefined;
    // A fresh instance, not just idle -- the overlay must vanish the moment its gate closes,
    // never keep showing the last thing the feeder saw.
    this._visionQuery = new WsQuery(() => this.requestUpdate());
  }

  /** Scrypted-only: `ha-hls-player`/`ha-web-rtc-player` (inside `<ha-camera-stream>`) already
   * listen for this same event and pause/resume themselves, so running this logic against the
   * HA-camera fallback too would either fight them or, worse, tear the element down and rebuild
   * it on every hidden spell for no reason. */
  private _onVisibilityChange = (): void => {
    if (this._videoSource().kind !== "scrypted") return;
    if (document.hidden) {
      clearTimeout(this._hiddenTimer);
      this._hiddenTimer = setTimeout(this._pauseForHidden, HIDDEN_PAUSE_MS) as unknown as number;
      return;
    }
    clearTimeout(this._hiddenTimer);
    this._hiddenTimer = undefined;
    if (this._hiddenPaused) {
      // Stopped outright while hidden -- resume fresh, same as a first mount.
      this._hiddenPaused = false;
      this._backoffMs = RECONNECT_BASE_MS;
      this.requestUpdate();
      return;
    }
    // Was still "playing" through a shorter hidden spell: the video was throttled, not
    // necessarily dead. Give it a fresh STALL_MS to prove itself before the checker judges.
    if (this._playing) this._lastProgress = performance.now();
  };

  /** A tab hidden past `HIDDEN_PAUSE_MS` stops decoding video nobody can see -- saves CPU and
   * the feeder's own bandwidth. `_onVisibilityChange` restarts it, backoff reset, once visible. */
  private _pauseForHidden = (): void => {
    this._hiddenTimer = undefined;
    // Guards a narrow race: the source can switch away from Scrypted while this timer, armed
    // for Scrypted, is still pending.
    if (this._videoSource().kind !== "scrypted") return;
    if (!this._playing && !this._reconnecting) return;
    this._hiddenPaused = true;
    this._reconnecting = false;
    clearTimeout(this._reconnectTimer);
    this._reconnectTimer = undefined;
    this._live.close();
    this._playing = false;
    this._talking = false;
  };

  private _stop = (): void => {
    clearTimeout(this._reconnectTimer);
    this._reconnectTimer = undefined;
    clearTimeout(this._hiddenTimer);
    this._hiddenTimer = undefined;
    this._live.close();
    this._playing = false;
    this._talking = false;
    this._starting = false;
    this._reconnecting = false;
    this._hiddenPaused = false;
    this._backoffMs = RECONNECT_BASE_MS;
  };

  /** A tap on the picture itself expands (or, while the overlay controls are faded out, only
   * reveals them -- the standard "first tap just reveals" mobile video-player convention,
   * `lib/overlay-idle.ts`'s `revealOnFirstTap`). Taps on the chips are their own buttons and
   * never bubble here as "the picture" while visible (they stop propagation) -- while hidden
   * they cannot be tapped at all (`pointer-events: none` in `.idle-hidden`), so this never has
   * to tell "a chip tap" apart from "a bare video tap" for the reveal-only case. */
  private _onFrameClick = (e: Event): void => {
    if (!this._overlayIdle.visible) {
      this._applyOverlayIdle(revealOnFirstTap(this._overlayIdle).state);
      this._armIdleTimer();
      e.stopPropagation();
      return;
    }
    this._onOverlayActivity();
    if ((e.target as HTMLElement).closest?.(".chip")) {
      e.stopPropagation();
      return;
    }
    if (!this._expanded) this._expand();
  };

  private _expand(): void {
    this._expanded = true;
    document.addEventListener("keydown", this._onKeyDown);
  }

  private _collapse = (e?: Event): void => {
    e?.stopPropagation();
    this._onOverlayActivity();
    document.removeEventListener("keydown", this._onKeyDown);
    if (this._fullscreen) {
      void (document.exitFullscreen?.() ?? Promise.resolve()).catch(() => undefined);
    }
    this._expanded = false;
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") this._collapse();
  };

  /** Fullscreen goes on the frame so the chips stay usable; iOS Safari refuses everything but
   * the video element, which is why `webkitEnterFullscreen` on the video is the fallback. */
  private _toggleFullscreen = async (e: Event): Promise<void> => {
    e.stopPropagation();
    this._onOverlayActivity();
    if (this._fullscreen) {
      await (document.exitFullscreen?.() ?? Promise.resolve()).catch(() => undefined);
      return;
    }
    const frame = this.renderRoot.querySelector<HTMLElement>("#frame");
    const video = this.renderRoot.querySelector<HTMLVideoElement & { webkitEnterFullscreen?: () => void }>("#video");
    try {
      if (frame?.requestFullscreen) await frame.requestFullscreen();
      else if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch {
      // Denied (no user gesture, embedded frame policy): the overlay is still the big view.
    }
  };

  /** `document.fullscreenElement` is retargeted to the outermost shadow host (here the card),
   * so it is checked through this element's own shadow root first, and otherwise by walking
   * the host chain up from here -- either way "our frame is the one in fullscreen". */
  private _onFullscreenChange = (): void => {
    const root = this.renderRoot as ShadowRoot & { webkitFullscreenElement?: Element | null };
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    const inner = root.fullscreenElement ?? root.webkitFullscreenElement ?? null;
    const outer = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    let onHostChain = false;
    for (let n: Node | null = this; n && outer; n = (n as ShadowRoot).host ?? n.parentNode) {
      if (n === outer) {
        onHostChain = true;
        break;
      }
    }
    this._fullscreen = inner !== null || onHostChain;
  };

  /** Scrypted's raw `<video>` needs the imperative re-kick in `_applyMute` (see its own
   * comment); `<ha-camera-stream>`'s `.muted` binding in `_renderVideo` is a normal Lit
   * property, so its own next render already carries the new value with no DOM poke needed. */
  private _toggleMute = (): void => {
    this._onOverlayActivity();
    this._muted = !this._muted;
    if (this._videoSource().kind === "scrypted") this._applyMute();
  };

  /** The `muted` attribute alone is unreliable once the element already has a stream, so the
   * property is set directly and play is re-kicked (unmuting counts as a fresh gesture). */
  private _applyMute = (): void => {
    const video = this.renderRoot.querySelector<HTMLVideoElement>("#video");
    if (!video) return;
    video.muted = this._muted;
    void video.play().catch(() => undefined);
  };

  private _toggleTalk = async (): Promise<void> => {
    this._onOverlayActivity();
    const next = !this._talking;
    this._talking = next;
    try {
      await this._live.talk(next);
    } catch {
      // Opening failed, or the stop found the session already gone: reflect the real state.
      if (next) this._talking = false;
    }
  };

  /** Missing entity (an older integration, no LibreFeed daemon) or unavailable (feeder
   * unreachable, or running the vendor stack -- `KibbleCallCatsButton.available` in the
   * integration) both hide the button outright, same convention `_overlayOn` uses for the
   * detection-overlay switch. Not gated by `_playing`: calling the cats needs no live video. */
  private _callCatsAvailable(): boolean {
    const id = this.callCatsEntity;
    return id !== undefined && this.hass?.states[id]?.state !== "unavailable";
  }

  /** Fire-and-forget `button.press` on the entity, exactly how any other card presses a button
   * entity -- the agent's own `POST /cue` debounce/cooldown (`speaker::CALL_COOLDOWN`) is the
   * real authority; `_callingCats`/`_pulsingCue` are only this button's own optimistic local
   * reflection of that, so it never looks pressable before a repeat press would actually work.
   * A rejected call (the agent's own cooldown, or a genuine failure) already raises its own
   * translated Home Assistant notification -- nothing further to show here. */
  private _callCats = (e: Event): void => {
    e.stopPropagation();
    this._onOverlayActivity();
    if (this._callingCats || !this.callCatsEntity) return;
    const entityId = this.callCatsEntity;
    this._callingCats = true;
    this._pulsingCue = true;
    this._cooldownTimer = setTimeout(() => {
      this._callingCats = false;
    }, CALL_COOLDOWN_MS) as unknown as number;
    this._pulseTimer = setTimeout(() => {
      this._pulsingCue = false;
    }, CALL_CUE_PULSE_MS) as unknown as number;
    void this.hass.callService("button", "press", { entity_id: entityId }).catch(() => undefined);
  };

  // ---- Idle overlay (video-player-style auto-hide, lib/overlay-idle.ts) --------------------

  /** Any interaction that should reveal the controls and restart the idle timer: pointer move/
   * enter or wheel over the frame (bound directly in `render()`), or a real control's own click/
   * focus handler calling this explicitly so it works the same whether or not that handler also
   * stops the click from bubbling to `_onFrameClick`. */
  private _onOverlayActivity = (): void => {
    this._applyOverlayIdle(VISIBLE);
    this._armIdleTimer();
  };

  /** Keyboard `Tab` landing on a control inside the frame reveals it (same as any other
   * activity) and, if it's a keyboard-style focus (`:focus-visible`, not a mouse-click focus),
   * pins the controls open for as long as that focus lasts -- see `_idlePinned`. */
  private _onFrameFocusIn = (e: FocusEvent): void => {
    this._onOverlayActivity();
    const target = e.target as HTMLElement;
    this._controlsFocusVisible = typeof target.matches === "function" && target.matches(":focus-visible");
  };

  /** Clears the focus-visible pin only once focus actually leaves the frame entirely -- moving
   * from one control to another inside it re-pins via that control's own `focusin` instead. */
  private _onFrameFocusOut = (e: FocusEvent): void => {
    const next = e.relatedTarget as Node | null;
    const frame = this.renderRoot.querySelector("#frame");
    if (!next || !frame?.contains(next)) {
      this._controlsFocusVisible = false;
    }
  };

  /** Public hook for chrome that overlaps this component's video from *outside* its own shadow
   * DOM (`kibble-card.ts`'s `.gear-button`, absolutely positioned over the hero) -- lets an
   * external click/focus on that chrome count as activity too, exactly like an internal one. */
  notifyActivity(): void {
    this._onOverlayActivity();
  }

  /** The one place `_overlayIdle` is ever reassigned -- dispatches `overlay-idle-changed`
   * (bubbling, composed) whenever visibility actually transitions, so chrome outside this
   * component's shadow DOM (`kibble-card.ts`'s `.gear-button`) can fade in step without needing
   * to poll this component's own state. */
  private _applyOverlayIdle(next: OverlayIdleState): void {
    const changed = next.visible !== this._overlayIdle.visible;
    this._overlayIdle = next;
    if (changed) {
      this.dispatchEvent(new CustomEvent<{ visible: boolean }>("overlay-idle-changed", { detail: { visible: next.visible }, bubbles: true, composed: true }));
    }
  }

  /** Everything that must keep the overlay controls on screen regardless of the idle timer:
   * active talkback, the call-cats cooldown pulse, keyboard focus inside the controls, or (from
   * outside this component entirely) `kibble-card.ts`'s settings popup being open. */
  private _idlePinned(): boolean {
    return this._talking || this._pulsingCue || this._controlsFocusVisible || Boolean(this.externalPin);
  }

  /** Cancels/re-arms the idle timer to match the current pin state -- called from `updated()`
   * whenever anything `_idlePinned()` reads changes. A pin starting always reveals immediately
   * (it must never race a timeout already in flight); a pin ending is treated like fresh
   * activity, restarting the full `IDLE_MS` window rather than resuming a partially-elapsed one. */
  private _syncIdlePin(): void {
    if (this._idlePinned()) {
      clearTimeout(this._idleTimer);
      this._idleTimer = undefined;
      if (!this._overlayIdle.visible) this._applyOverlayIdle(VISIBLE);
      return;
    }
    if (this._idleTimer === undefined) this._armIdleTimer();
  }

  private _armIdleTimer(): void {
    clearTimeout(this._idleTimer);
    this._idleTimer = undefined;
    if (!shouldArmTimer(this._overlayIdle, this._idlePinned())) return;
    this._idleTimer = setTimeout(this._onIdleTimerFired, IDLE_MS) as unknown as number;
  }

  private _onIdleTimerFired = (): void => {
    this._idleTimer = undefined;
    this._applyOverlayIdle(onIdleTimeout(this._overlayIdle, this._idlePinned()));
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
      /* The frame inside is absolutely positioned, so this element has no intrinsic size and
         takes its height from its parent. In the stacked (phone) layout nothing supplies one,
         and a hero with no loaded frame collapsed to ~60 px -- measured on a 390x844 viewport
         -- then jumped to full height the moment the stream arrived. The ratio reserves the
         space up front, and is always the media's own real ratio once _reportMediaAspect
         learns it (set directly on this host's own --kibble-hero-aspect custom property;
         kibble-card.ts sets the same variable on .hero from the bubbled media-aspect-changed
         event, so the two stay in lockstep even though .hero -- not this element's own
         aspect-ratio -- is what actually sizes the video once this is nested inside the card).
         Where a parent does set a height (the wide layout, where the side column drives the
         row) that height still wins: aspect-ratio only fills in a dimension nothing else has
         decided. */
      aspect-ratio: var(--kibble-hero-aspect, 16 / 9);
      position: relative;
    }
    .frame {
      position: absolute;
      inset: 0;
      background: #101010;
      cursor: zoom-in;
    }
    .frame.expanded {
      position: fixed;
      inset: 0;
      z-index: 1001; /* above HA's app header (z-index 4) and dialogs' scrim */
      cursor: default;
      background: #000;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.85);
    }
    .topbar {
      position: absolute;
      top: max(8px, env(safe-area-inset-top));
      right: max(8px, env(safe-area-inset-right));
      display: flex;
      gap: 6px;
      pointer-events: none;
    }
    .topbar .chip {
      pointer-events: auto;
    }
    video,
    img,
    hui-image,
    ha-camera-stream {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain; /* never cropped, inline or expanded; ha-camera-stream ignores this on its own host -- its .fitMode in _renderVideo carries the same "contain" instead */
    }
    video,
    ha-camera-stream {
      position: absolute;
      inset: 0;
    }
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #bbb;
      font-size: 14px;
    }
    .controls {
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
      pointer-events: none;
    }
    .frame.expanded .controls {
      bottom: max(12px, env(safe-area-inset-bottom));
      right: max(12px, env(safe-area-inset-right));
    }
    /* Video-player-style auto-hide (lib/overlay-idle.ts): no transition property outside the
       no-preference query, so a reduced-motion user's browser snaps the final opacity/position
       instantly instead of animating it, matching .reconnect svg's spin and
       .chip.call-cats.pulsing's rings just below. */
    @media (prefers-reduced-motion: no-preference) {
      .controls,
      .topbar {
        transition: opacity 200ms ease, transform 200ms ease;
      }
    }
    .controls.idle-hidden {
      opacity: 0;
      transform: translateY(6px);
    }
    .topbar.idle-hidden {
      opacity: 0;
      transform: translateY(-6px);
    }
    .controls.idle-hidden .chip,
    .topbar.idle-hidden .chip {
      pointer-events: none;
    }
    .chip {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      cursor: pointer;
      backdrop-filter: blur(2px);
      transition: background 120ms ease, color 120ms ease;
    }
    .chip svg {
      font-size: 20px;
    }
    .chip:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    .chip.talk {
      user-select: none;
    }
    .chip.talk[aria-pressed="true"] {
      background: var(--kibble-amber, #f2a33c);
      color: var(--kibble-ink-on-amber, #241a07);
    }
    .chip.call-cats {
      position: relative;
    }
    .chip.call-cats:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .chip.call-cats.pulsing::before,
    .chip.call-cats.pulsing::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--kibble-amber, #f2a33c);
      opacity: 0;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .chip.call-cats.pulsing::before {
        animation: kibble-cue-pulse 1.1s ease-out;
      }
      .chip.call-cats.pulsing::after {
        animation: kibble-cue-pulse 1.1s ease-out 0.25s;
      }
    }
    @keyframes kibble-cue-pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      100% {
        transform: scale(1.9);
        opacity: 0;
      }
    }
    .reconnect {
      position: absolute;
      top: 8px;
      left: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      pointer-events: none;
    }
    .reconnect svg {
      font-size: 16px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .reconnect svg {
        animation: kibble-reconnect-spin 1.1s linear infinite;
      }
    }
    @keyframes kibble-reconnect-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .note {
      position: absolute;
      left: 8px;
      bottom: 54px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 12px;
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .note.error {
      color: var(--error-color, #ff8a80);
    }
    .detections {
      position: absolute;
      inset: 0;
    }
  `;
}

customElements.define("kibble-live-hero", KibbleLiveHero);
