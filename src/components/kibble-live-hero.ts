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
import type { HomeAssistant } from "../types";
import { ScryptedLive, findScryptedToken } from "../lib/scrypted-live";
import { mdiIcon } from "../lib/mdi-icons";
import { RECONNECT_BASE_MS, nextReconnectDelay } from "../lib/reconnect";

/** No `timeupdate` for this long while `_playing` counts as a dead stream. */
const STALL_MS = 8000;
/** How often the stall check runs; cheap enough to just always be ticking. */
const STALL_CHECK_INTERVAL_MS = 2000;
/** A tab hidden this long stops the stream outright instead of just weathering a possible stall. */
const HIDDEN_PAUSE_MS = 60000;

export class KibbleLiveHero extends LitElement {
  static properties = {
    hass: { attribute: false },
    cameraEntity: { attribute: false },
    scryptedId: { attribute: false },
    _playing: { state: true },
    _talking: { state: true },
    _muted: { state: true },
    _reconnecting: { state: true },
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

  declare hass: HomeAssistant;
  declare cameraEntity: string | undefined;
  /** Scrypted device id of the feeder camera, from the card config. */
  declare scryptedId: string | undefined;
  declare private _playing: boolean;
  declare private _talking: boolean;
  declare private _muted: boolean;
  /** True from the moment a dead session is torn down until a fresh one starts playing. */
  declare private _reconnecting: boolean;
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
    this._tick = 0;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    this._stallCheckInterval = setInterval(this._checkStall, STALL_CHECK_INTERVAL_MS) as unknown as number;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    clearInterval(this._stallCheckInterval);
    this._stallCheckInterval = undefined;
    this._stop();
  }

  /** The stream starts on its own as soon as the card knows where to get it; the still stays
   * underneath until the first frame paints, so the hand-over is seamless. A session that turns
   * out to be dead (peer connection disconnected/failed/closed) reroutes through the same
   * reconnect path a stall does, instead of leaving a frozen or blank video up forever. */
  updated(): void {
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
      <div class="frame">
        ${this._renderStill()}
        ${this._playing ? this._renderVideo() : nothing}
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
  `;
}

customElements.define("kibble-live-hero", KibbleLiveHero);
