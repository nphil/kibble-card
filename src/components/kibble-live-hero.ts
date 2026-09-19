/** The card's hero: a still snapshot by default, a real low-latency WebRTC stream plus
 * push-to-talk once tapped.
 *
 * Everything audio/video comes from Scrypted (one source of truth for the feeder's streams): the
 * WebRTC session is negotiated through the HA Scrypted integration's authenticated proxy, so the
 * feeder itself is never opened a second time and the mic path is Scrypted's own intercom — the
 * same one HomeKit uses. `lib/scrypted-live.ts` owns the protocol; this component owns the UI:
 *
 * - Idle: HA's `hui-image` snapshot, a "Live" affordance, no network cost beyond the snapshot.
 * - Playing: the video element, muted by default (browsers refuse autoplay with sound) with a
 *   speaker toggle, and a hold-to-talk mic button when Scrypted reports the camera has Intercom.
 * - Tapping the picture expands it: the SAME frame (still, video, controls) becomes a
 *   full-viewport overlay -- the video element is never re-created, so the WebRTC session and
 *   its decoder just carry on at the bigger size -- with a close chip and a fullscreen chip
 *   (the Fullscreen API on the frame; iOS Safari only allows fullscreen on the video element
 *   itself, so that path is used there). Esc, the backdrop and leaving fullscreen all close.
 * - Talk is press-and-hold on purpose (pointer/touch/keyboard all supported): the feeder's
 *   speaker session lasts exactly as long as the button is held, which is also what keeps it from
 *   colliding with the Petkit app's own talkback.
 *
 * Robustness: a WebRTC session can go quiet without Scrypted ever telling us (a Wi-Fi hiccup, a
 * throttled background tab, Scrypted itself restarting) so three independent signals all feed
 * the same reconnect path (`_beginReconnect`): the peer connection reporting
 * disconnected/failed/closed (`ScryptedLive`'s own `state === "error"`), the `<video>` going
 * `STALL_MS` without a `timeupdate`, and coming back from a hidden tab to find either. While
 * reconnecting the video is torn down so the still snapshot underneath shows through, with a
 * small icon-only badge -- never a wall of retry text over a picture of the room. A tab hidden
 * past `HIDDEN_PAUSE_MS` stops the stream outright (no point decoding video nobody can see) and
 * restarts fresh, backoff reset, on the next visible tick.
 */

import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant, VisionDetection, VisionFrame } from "../types";
import { ScryptedLive, findScryptedToken } from "../lib/scrypted-live";
import { mdiIcon } from "../lib/mdi-icons";
import { RECONNECT_BASE_MS, nextReconnectDelay } from "../lib/reconnect";
import { WsQuery } from "../lib/ws-query";
import { catLabelText, detectionRect, labelFlipsInside, largestAdmittedDetection } from "../lib/vision-overlay";

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

export class KibbleLiveHero extends LitElement {
  static properties = {
    hass: { attribute: false },
    cameraEntity: { attribute: false },
    scryptedId: { attribute: false },
    entryId: { attribute: false },
    overlayEntity: { attribute: false },
    _playing: { state: true },
    _talking: { state: true },
    _muted: { state: true },
    _reconnecting: { state: true },
    _expanded: { state: true },
    _fullscreen: { state: true },
    _tick: { state: true },
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
  /** Set once a long-hidden tab has stopped the stream, so the tab coming visible again knows
   * to restart from scratch (backoff reset) instead of treating it as a stall recovery. */
  private _hiddenPaused = false;
  /** The feeder's own most recent detection frame, polled while the overlay gate is open (see
   * `_syncVisionPolling`) -- a private field, not a reactive property, since `WsQuery` drives
   * its own `requestUpdate` on change, exactly like `kibble-card.ts`'s `_catsQuery`. */
  private _visionQuery = new WsQuery<{ frame: VisionFrame | null }>(() => this.requestUpdate());
  private _visionTimer: number | undefined;

  declare hass: HomeAssistant;
  declare cameraEntity: string | undefined;
  /** Scrypted device id of the feeder camera, from the card config. */
  declare scryptedId: string | undefined;
  /** HA config-entry id, for the `kibble/vision/last` WS call's `entry_id`. */
  declare entryId: string | undefined;
  /** `switch.<feeder>_detection_overlay`'s entity id; off or missing means no overlay, ever. */
  declare overlayEntity: string | undefined;
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

  private _live = new ScryptedLive(() => {
    this._tick = (this._tick ?? 0) + 1;
  });

  constructor() {
    super();
    this._playing = false;
    this._talking = false;
    this._muted = true;
    this._reconnecting = false;
    this._expanded = false;
    this._fullscreen = false;
    this._tick = 0;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    document.addEventListener("fullscreenchange", this._onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", this._onFullscreenChange);
    this._stallCheckInterval = setInterval(this._checkStall, STALL_CHECK_INTERVAL_MS) as unknown as number;
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
    this._stop();
  }

  /** The stream starts on its own as soon as the card knows where to get it; the still stays
   * underneath until the first frame paints, so the hand-over is seamless. A session that turns
   * out to be dead (peer connection disconnected/failed/closed) reroutes through the same
   * reconnect path a stall does, instead of leaving a frozen or blank video up forever. */
  updated(): void {
    this._syncVisionPolling();
    if (this._live.state === "error" && this._playing) {
      this._beginReconnect();
      return;
    }
    if (this._playing || this._starting || this._reconnecting || this._hiddenPaused) return;
    if (!this.hass || !this.scryptedId || !findScryptedToken(this.hass)) return;
    void this._start();
  }

  render() {
    return html`
      ${this._expanded ? html`<div class="backdrop" @click=${this._collapse}></div>` : nothing}
      <div class="frame ${this._expanded ? "expanded" : ""}" id="frame" @click=${this._onFrameClick}>
        ${this._renderStill()}
        ${this._playing ? this._renderVideo() : nothing}
        ${this._playing ? this._renderDetections() : nothing}
        ${this._expanded
          ? html`<div class="topbar">
              <button class="chip" aria-label=${this._fullscreen ? "Leave fullscreen" : "Fullscreen"} title=${this._fullscreen ? "Leave fullscreen" : "Fullscreen"} @click=${this._toggleFullscreen}>
                ${mdiIcon(this._fullscreen ? "fullscreenExit" : "fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${mdiIcon("close")}</button>
            </div>`
          : nothing}
        ${this._reconnecting
          ? html`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${mdiIcon("refresh")}</div>`
          : nothing}
        <div class="controls">
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
          ${this._playing && this._live.hasIntercom
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
        </div>
        ${this._live.state === "error" && !this._reconnecting ? html`<div class="note error">${this._live.error}</div>` : nothing}
      </div>
    `;
  }

  private _renderVideo() {
    return html`<video
      id="video"
      autoplay
      playsinline
      ?muted=${this._muted}
      @loadedmetadata=${this._applyMute}
      @timeupdate=${this._onTimeUpdate}
    ></video>`;
  }

  private _renderStill() {
    if (!this.cameraEntity) return html`<div class="placeholder">No camera on this device</div>`;
    if (customElements.get("hui-image")) {
      return html`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;
    }
    const src = this.hass.states[this.cameraEntity]?.attributes.entity_picture;
    return typeof src === "string"
      ? html`<img src=${src} alt="The feeder's camera" />`
      : html`<div class="placeholder">Camera unavailable</div>`;
  }

  /** The feeder's own detection boxes for the frame it most recently analysed. `admitted`
   * boxes get the accent treatment; everything else (clutter memory's furniture) is drawn
   * quieter, never omitted -- that is the whole point of shipping them. The identified cat's
   * name labels whichever admitted box is largest. */
  private _renderDetections() {
    const frame = this._visionQuery.state.data?.frame;
    const detections = frame?.detections;
    if (!this._overlayOn() || !detections || detections.length === 0) return nothing;
    const cat = frame.cat;
    const labelBox = cat ? largestAdmittedDetection(detections) : null;
    return html`
      <div class="detections" aria-hidden="true">
        ${detections.map((detection) => this._renderDetectionBox(detection))}
        ${labelBox && cat ? this._renderCatLabel(labelBox, cat, frame.cat_score ?? null) : nothing}
      </div>
    `;
  }

  private _renderDetectionBox(detection: VisionDetection) {
    const rect = detectionRect(detection);
    const style = `left:${rect.left};top:${rect.top};width:${rect.width};height:${rect.height};`;
    return html`<div class="det-box ${detection.admitted ? "" : "quiet"}" style=${style}></div>`;
  }

  private _renderCatLabel(box: VisionDetection, cat: string, catScore: number | null) {
    const rect = detectionRect(box);
    return html`<div class="det-label ${labelFlipsInside(box) ? "flip" : ""}" style="left:${rect.left};top:${rect.top};">
      ${catLabelText(cat, catScore)}
    </div>`;
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
   * reconnecting guards make it a no-op the rest of the time. */
  private _checkStall = (): void => {
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

  private _onVisibilityChange = (): void => {
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

  /** A tap on the picture itself expands; taps on the chips are their own buttons and never
   * bubble here as "the picture" (they stop propagation). */
  private _onFrameClick = (e: Event): void => {
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

  private _toggleMute = (): void => {
    this._muted = !this._muted;
    this._applyMute();
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
    const next = !this._talking;
    this._talking = next;
    try {
      await this._live.talk(next);
    } catch {
      // Opening failed, or the stop found the session already gone: reflect the real state.
      if (next) this._talking = false;
    }
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
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
    .frame.expanded video,
    .frame.expanded img,
    .frame.expanded hui-image {
      object-fit: contain;
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
    hui-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    video {
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
      overflow: hidden;
      pointer-events: none;
    }
    .det-box {
      position: absolute;
      border: 2px solid var(--kibble-amber, #f2a33c);
      border-radius: 3px;
      transition: left 250ms ease, top 250ms ease, width 250ms ease, height 250ms ease;
    }
    .det-box.quiet {
      border: 1px dashed rgba(255, 255, 255, 0.45);
      opacity: 0.6;
    }
    .det-label {
      position: absolute;
      transform: translateY(calc(-100% - 4px));
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: left 250ms ease, top 250ms ease;
    }
    .det-label.flip {
      transform: translateY(4px);
    }
  `;
}

customElements.define("kibble-live-hero", KibbleLiveHero);
