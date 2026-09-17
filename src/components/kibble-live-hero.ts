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
 */

import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant } from "../types";
import { ScryptedLive, findScryptedToken } from "../lib/scrypted-live";
import { mdiIcon } from "../lib/mdi-icons";

export class KibbleLiveHero extends LitElement {
  static properties = {
    hass: { attribute: false },
    cameraEntity: { attribute: false },
    scryptedId: { attribute: false },
    _playing: { state: true },
    _talking: { state: true },
    _muted: { state: true },
    _tick: { state: true },
  };

  private _starting = false;
  private _retry?: ReturnType<typeof setTimeout>;

  declare hass: HomeAssistant;
  declare cameraEntity: string | undefined;
  /** Scrypted device id of the feeder camera, from the card config. */
  declare scryptedId: string | undefined;
  declare private _playing: boolean;
  declare private _talking: boolean;
  declare private _muted: boolean;
  declare private _tick: number;

  private _live = new ScryptedLive(() => {
    this._tick = (this._tick ?? 0) + 1;
  });

  constructor() {
    super();
    this._playing = false;
    this._talking = false;
    this._muted = true;
    this._tick = 0;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stop();
  }

  /** The stream starts on its own as soon as the card knows where to get it; the still stays
   * underneath until the first frame paints, so the hand-over is seamless. */
  updated(): void {
    if (this._playing || this._starting) return;
    if (!this.hass || !this.scryptedId || !findScryptedToken(this.hass)) return;
    void this._start();
  }

  render() {
    return html`
      <div class="frame">
        ${this._renderStill()}
        ${this._playing ? this._renderVideo() : nothing}
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
        ${this._live.state === "error" ? html`<div class="note error">${this._live.error}</div>` : nothing}
      </div>
    `;
  }

  private _renderVideo() {
    return html`<video id="video" autoplay playsinline ?muted=${this._muted} @loadedmetadata=${this._applyMute}></video>`;
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
    await this.updateComplete;
    const video = this.renderRoot.querySelector<HTMLVideoElement>("#video");
    if (!video) {
      this._starting = false;
      return;
    }
    try {
      await this._live.open({ deviceId: this.scryptedId, token }, video);
    } catch {
      this._playing = false;
      this._retry = setTimeout(() => {
        this._starting = false;
        this.requestUpdate();
      }, 15000);
      return;
    }
    this._starting = false;
  };

  private _stop = (): void => {
    clearTimeout(this._retry);
    this._live.close();
    this._playing = false;
    this._talking = false;
    this._starting = false;
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
