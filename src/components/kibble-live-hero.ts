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

  render() {
    const token = this.hass ? findScryptedToken(this.hass) : undefined;
    const canPlay = Boolean(token && this.scryptedId);
    return html`
      <div class="frame">
        ${this._playing ? this._renderVideo() : this._renderStill()}
        <div class="controls">
          ${canPlay
            ? html`<button
                class="chip"
                aria-pressed=${this._playing}
                @click=${this._playing ? this._stop : this._start}
                title=${this._playing ? "Stop live view" : "Start live view"}
              >
                ${this._playing ? mdiIcon("close") : mdiIcon("volumeHigh")}
                <span>${this._playing ? "Stop" : "Live"}</span>
              </button>`
            : nothing}
          ${this._playing
            ? html`<button
                class="chip"
                aria-pressed=${!this._muted}
                @click=${this._toggleMute}
                title=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
              >
                ${mdiIcon(this._muted ? "speaker" : "volumeHigh")}
                <span>${this._muted ? "Sound off" : "Sound on"}</span>
              </button>`
            : nothing}
          ${this._playing && this._live.hasIntercom
            ? html`<button
                class="chip talk"
                data-talking=${this._talking}
                @pointerdown=${this._talkStart}
                @pointerup=${this._talkStop}
                @pointercancel=${this._talkStop}
                @pointerleave=${this._talkStop}
                @keydown=${this._talkKeyDown}
                @keyup=${this._talkStop}
                title="Hold to talk to the feeder"
              >
                ${mdiIcon("microphone")}
                <span>${this._talking ? "Talking…" : "Hold to talk"}</span>
              </button>`
            : nothing}
        </div>
        ${this._live.state === "connecting" ? html`<div class="note">Connecting…</div>` : nothing}
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
    this._playing = true;
    await this.updateComplete;
    const video = this.renderRoot.querySelector<HTMLVideoElement>("#video");
    if (!video) return;
    try {
      await this._live.open({ deviceId: this.scryptedId, token }, video);
    } catch {
      this._playing = false;
    }
  };

  private _stop = (): void => {
    this._live.close();
    this._playing = false;
    this._talking = false;
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

  private _talkStart = async (event: Event): Promise<void> => {
    event.preventDefault();
    if (this._talking) return;
    this._talking = true;
    try {
      await this._live.talk(true);
    } catch {
      this._talking = false;
    }
  };

  private _talkStop = async (): Promise<void> => {
    if (!this._talking) return;
    this._talking = false;
    try {
      await this._live.talk(false);
    } catch {
      // A failed stop is only ever "the session already ended"; nothing left to undo.
    }
  };

  private _talkKeyDown = (event: KeyboardEvent): void => {
    if (event.key === " " || event.key === "Enter") void this._talkStart(event);
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
      gap: 6px;
      min-height: 34px;
      padding: 0 12px;
      border: none;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(2px);
    }
    .chip svg {
      font-size: 16px;
    }
    .chip:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    .chip.talk {
      touch-action: none;
      user-select: none;
    }
    .chip.talk[data-talking="true"] {
      background: var(--kibble-amber, #f2a33c);
      color: var(--kibble-ink-on-amber, #241a07);
    }
    .note {
      position: absolute;
      left: 8px;
      bottom: 50px;
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
