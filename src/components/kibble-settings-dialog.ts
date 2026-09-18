/** Everything secondary lives here, behind the header gear: per-hopper feed (the wear-leveling /
 * jam-workaround case), the device toggles, volume, cloud (with a tap-twice confirm since it
 * opens/closes an external pathway), Wi-Fi/desiccant detail, before/after dish photos when the
 * integration ships them, the speaker, and the link out to the device page. A controlled overlay:
 * the parent owns `open`, this dialog only ever asks to close.
 */

import { LitElement, css, html, nothing } from "lit";
import type { KibbleEntities } from "../lib/resolve-entities";
import { mdiIcon, type MdiIconName } from "../lib/mdi-icons";
import type { HomeAssistant } from "../types";
import "./kibble-hold-button";
import "./kibble-before-after";

const CLOUD_CONFIRM_WINDOW_MS = 3000;

interface NumberAttrs {
  value: number;
  min: number;
  max: number;
  step: number;
}

function numberAttrs(hass: HomeAssistant, entityId: string | undefined): NumberAttrs | null {
  if (!entityId) return null;
  const state = hass.states[entityId];
  if (!state) return null;
  const value = Number(state.state);
  if (Number.isNaN(value)) return null;
  return {
    value,
    min: Number(state.attributes.min ?? 1),
    max: Number(state.attributes.max ?? 20),
    step: Number(state.attributes.step ?? 1),
  };
}

export class KibbleSettingsDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    entities: { attribute: false },
    open: { type: Boolean, reflect: true },
  };

  declare hass: HomeAssistant;
  declare entities: KibbleEntities;
  declare open: boolean;

  private _cloudConfirmArmed = false;
  private _cloudConfirmTimer: number | undefined = undefined;
  private _stackConfirmArmed = false;
  private _stackConfirmTimer: number | undefined = undefined;

  constructor() {
    super();
    this.open = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._cloudConfirmTimer);
    clearTimeout(this._stackConfirmTimer);
  }

  render() {
    if (!this.open) return nothing;
    const e = this.entities;
    return html`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1 || e.feedButtonHopper2 ? this._renderHopperSection() : nothing}
          ${e.feedAmount ? this._renderMoreAmountSection() : nothing}
          ${this._renderToggles()}
          ${e.volume ? this._renderVolume() : nothing}
          ${e.cloudSwitch ? this._renderCloud() : nothing}
          ${e.stackSelect ? this._renderStack() : nothing}
          ${e.wifiNetwork ? this._renderWifi() : nothing}
          ${e.dishBefore || e.dishAfter ? this._renderDishPhotos() : nothing}
          ${e.speaker ? this._renderSpeaker() : nothing}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${mdiIcon("openInNew")}
          </button>
        </div>
      </div>
    `;
  }

  private _renderMoreAmountSection() {
    const attrs = numberAttrs(this.hass, this.entities.feedAmount);
    if (!attrs) return nothing;
    return html`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount!, attrs)}
      </section>
    `;
  }

  private _renderHopperSection() {
    const { feedAmountHopper1, feedAmountHopper2, feedButtonHopper1, feedButtonHopper2 } = this.entities;
    return html`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte. This feeder's firmware spins both augers anyway, so
          expect roughly double into the bowl until a hopper divider is fitted.
        </p>
        <div class="hoppers">
          ${feedAmountHopper1
            ? html`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(feedAmountHopper1, numberAttrs(this.hass, feedAmountHopper1))}
                  ${feedButtonHopper1
                    ? html`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(feedButtonHopper1)}></kibble-hold-button>`
                    : nothing}
                </div>
              `
            : nothing}
          ${feedAmountHopper2
            ? html`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(feedAmountHopper2, numberAttrs(this.hass, feedAmountHopper2))}
                  ${feedButtonHopper2
                    ? html`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(feedButtonHopper2)}></kibble-hold-button>`
                    : nothing}
                </div>
              `
            : nothing}
        </div>
      </section>
    `;
  }

  private _renderStepper(entityId: string, attrs: NumberAttrs | null) {
    if (!attrs) return nothing;
    return html`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${attrs.value <= attrs.min} @click=${() => this._setNumber(entityId, Math.max(attrs.min, attrs.value - attrs.step))}>
          &minus;
        </button>
        <span class="step-value">${attrs.value}</span>
        <button type="button" class="step-btn" ?disabled=${attrs.value >= attrs.max} @click=${() => this._setNumber(entityId, Math.min(attrs.max, attrs.value + attrs.step))}>
          &plus;
        </button>
      </div>
    `;
  }

  private _renderToggles() {
    const candidates: Array<{ id: string | undefined; icon: MdiIconName; label: string }> = [
      { id: this.entities.nightVisionSwitch, icon: "weatherNight", label: "Night vision" },
      { id: this.entities.statusLedSwitch, icon: "ledOn", label: "Status LED" },
      { id: this.entities.microphoneSwitch, icon: "microphone", label: "Microphone" },
    ];
    const rows = candidates.filter(
      (row): row is { id: string; icon: MdiIconName; label: string } => row.id !== undefined,
    );
    if (rows.length === 0) return nothing;
    return html`
      <section>
        <h3>Device</h3>
        ${rows.map((row) => this._renderToggleRow(row.id, row.icon, row.label))}
      </section>
    `;
  }

  private _renderToggleRow(entityId: string, icon: MdiIconName, label: string) {
    const state = this.hass.states[entityId];
    const on = state?.state === "on";
    const unavailable = !state || state.state === "unavailable";
    return html`
      <button type="button" class="toggle-row" ?disabled=${unavailable} @click=${() => this._toggleSwitch(entityId)}>
        <span class="toggle-icon">${mdiIcon(icon)}</span>
        <span class="toggle-label">${label}</span>
        <span class="toggle-pill ${on ? "on" : ""}"><span class="toggle-knob"></span></span>
      </button>
    `;
  }

  private _renderVolume() {
    const attrs = numberAttrs(this.hass, this.entities.volume);
    if (!attrs) return nothing;
    return html`
      <section>
        <h3>Volume</h3>
        <input
          type="range"
          min=${attrs.min}
          max=${attrs.max}
          step=${attrs.step}
          .value=${String(attrs.value)}
          @change=${(ev: Event) => this._setNumber(this.entities.volume!, Number((ev.target as HTMLInputElement).value))}
        />
      </section>
    `;
  }

  private _renderCloud() {
    const state = this.hass.states[this.entities.cloudSwitch!];
    const on = state?.state === "on";
    const connection = this.entities.cloudConnection ? this.hass.states[this.entities.cloudConnection]?.state : undefined;
    return html`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${connection ? `Connection: ${connection}` : "Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed ? "confirming" : ""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed ? `Tap again to turn ${on ? "off" : "on"}` : on ? "On \u2014 tap to turn off" : "Off \u2014 tap to turn on"}
        </button>
      </section>
    `;
  }

  private _renderWifi() {
    const state = this.hass.states[this.entities.wifiNetwork!];
    return html`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${state ? state.state : "Unavailable"}</p>
      </section>
    `;
  }

  private _renderDishPhotos() {
    const before = this.entities.dishBefore ? this.hass.states[this.entities.dishBefore] : undefined;
    const after = this.entities.dishAfter ? this.hass.states[this.entities.dishAfter] : undefined;
    const beforeAvailable = before && before.state !== "unavailable";
    const afterAvailable = after && after.state !== "unavailable";
    if (!beforeAvailable && !afterAvailable) return nothing;
    return html`
      <section>
        <h3>Last feed</h3>
        <kibble-before-after
          .beforeSrc=${beforeAvailable ? String(before!.attributes.entity_picture ?? "") : null}
          .afterSrc=${afterAvailable ? String(after!.attributes.entity_picture ?? "") : null}
          aspect="1.333"
        ></kibble-before-after>
      </section>
    `;
  }

  private _renderSpeaker() {
    const state = this.hass.states[this.entities.speaker!];
    if (!state) return nothing;
    const volume = typeof state.attributes.volume_level === "number" ? state.attributes.volume_level : 0.5;
    return html`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${state.state}</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          .value=${String(volume)}
          @change=${(ev: Event) =>
            this.hass.callService("media_player", "volume_set", { volume_level: Number((ev.target as HTMLInputElement).value) }, { entity_id: this.entities.speaker! })}
        />
      </section>
    `;
  }

  private _pressButton(entityId: string): void {
    this.hass.callService("button", "press", {}, { entity_id: entityId });
  }

  private _toggleSwitch(entityId: string): void {
    this.hass.callService("switch", "toggle", {}, { entity_id: entityId });
  }

  private _setNumber(entityId: string, value: number): void {
    this.hass.callService("number", "set_value", { value }, { entity_id: entityId });
  }

  /** Which userland the feeder boots. Switching reboots it (~40 s offline), so it takes the
   *  same tap-twice confirm as the cloud toggle. The entity is unavailable on agents that
   *  predate it, in which case the section is simply absent. */
  private _renderStack() {
    const state = this.hass.states[this.entities.stackSelect!];
    if (!state || state.state === "unavailable") return nothing;
    const running = state.state;
    const other = running === "librefeed" ? "vendor" : "librefeed";
    const label = (v: string) => (v === "librefeed" ? "LibreFeed" : "Petkit stack");
    return html`
      <section>
        <h3>Stack</h3>
        <p class="hint">Running ${label(running)}. Switching reboots the feeder; it is back in about a minute.</p>
        <button type="button" class="cloud-toggle ${this._stackConfirmArmed ? "confirming" : ""}" @click=${this._onStackClick}>
          ${this._stackConfirmArmed ? `Tap again to boot ${label(other)}` : `Switch to ${label(other)}`}
        </button>
      </section>
    `;
  }

  private _onStackClick(): void {
    const state = this.hass.states[this.entities.stackSelect!];
    const other = state?.state === "librefeed" ? "vendor" : "librefeed";
    if (this._stackConfirmArmed) {
      clearTimeout(this._stackConfirmTimer);
      this._stackConfirmArmed = false;
      void this.hass.callService("select", "select_option", { entity_id: this.entities.stackSelect, option: other });
      this.requestUpdate();
      return;
    }
    this._stackConfirmArmed = true;
    this.requestUpdate();
    this._stackConfirmTimer = setTimeout(() => {
      this._stackConfirmArmed = false;
      this.requestUpdate();
    }, CLOUD_CONFIRM_WINDOW_MS);
  }

  private _onCloudToggleClick(): void {
    if (this._cloudConfirmArmed) {
      clearTimeout(this._cloudConfirmTimer);
      this._cloudConfirmArmed = false;
      this._toggleSwitch(this.entities.cloudSwitch!);
      this.requestUpdate();
      return;
    }
    this._cloudConfirmArmed = true;
    this.requestUpdate();
    this._cloudConfirmTimer = setTimeout(() => {
      this._cloudConfirmArmed = false;
      this.requestUpdate();
    }, CLOUD_CONFIRM_WINDOW_MS);
  }

  private _openDevicePage(): void {
    const deviceId = this.entities.deviceId;
    history.pushState(null, "", `/config/devices/device/${deviceId}`);
    window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
    this._close();
  }

  private _onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") this._close();
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }

  static styles = css`
    /* When closed, render() returns nothing -- but the HOST still exists, and a host with
       position: fixed and inset: 0 is a full-viewport box that keeps receiving pointer events.
       Without this rule an invisible empty overlay sits on top of Home Assistant and silently
       eats every click on the page (sidebar included) for as long as the card is on a
       dashboard. The open property reflects to an attribute, so the closed state is styleable. */
    :host(:not([open])) {
      display: none;
    }
    :host {
      position: fixed;
      inset: 0;
      z-index: 100;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .panel {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: min(380px, 100vw);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.3));
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      position: sticky;
      top: 0;
      background: inherit;
    }
    h2 {
      margin: 0;
      font-size: 20px;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 48px;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .body {
      padding: 8px 16px 24px;
      display: flex;
      flex-direction: column;
    }
    section {
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    h3 {
      margin: 0 0 8px;
      font-size: 15px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .hint {
      margin: 0 0 10px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .hoppers {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .hopper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hopper-label {
      font-weight: 600;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .step-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: 22px;
      cursor: pointer;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .step-value {
      min-width: 2.5em;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .toggle-row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      background: none;
      border: none;
      color: var(--primary-text-color);
      font: inherit;
      padding: 10px 0;
      min-height: 48px;
      cursor: pointer;
    }
    .toggle-row:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .toggle-icon {
      font-size: 20px;
      color: var(--secondary-text-color);
    }
    .toggle-label {
      flex: 1;
      text-align: left;
    }
    .toggle-pill {
      width: 42px;
      height: 24px;
      border-radius: 12px;
      background: var(--divider-color);
      position: relative;
      transition: background-color 0.15s ease;
    }
    .toggle-pill.on {
      background: var(--kibble-amber);
    }
    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--ha-card-background, white);
      transition: transform 0.15s ease;
    }
    .toggle-pill.on .toggle-knob {
      transform: translateX(18px);
    }
    input[type="range"] {
      width: 100%;
      accent-color: var(--kibble-amber);
    }
    .cloud-toggle {
      width: 100%;
      min-height: 48px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .cloud-toggle.confirming {
      border-color: var(--kibble-amber-dark);
      color: var(--kibble-amber-dark);
    }
    .device-link {
      margin-top: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 0;
      align-self: flex-start;
    }
  `;
}

customElements.define("kibble-settings-dialog", KibbleSettingsDialog);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-settings-dialog": KibbleSettingsDialog;
  }
}
