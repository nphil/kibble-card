/** Visual editor: one required field (the Kibble device) and one optional one (a display name).
 * Every other entity id is resolved from the device at render time — the user never types one.
 * Uses HA's own `ha-form` when it's registered (every real dashboard); falls back to a plain
 * `<select>` built from the device/entity registries so the editor still works standalone.
 */

import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant, KibbleCardConfig } from "./types";

interface SchemaField {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

const SCHEMA: SchemaField[] = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "scrypted_id", selector: { text: {} } },
  { name: "settings_hash", selector: { text: {} } },
  { name: "schedule_hash", selector: { text: {} } },
];

const FIELD_LABELS: Record<string, string> = {
  device_id: "Kibble device",
  name: "Name (optional)",
  scrypted_id: "Scrypted camera id (live view + talk)",
  settings_hash: "Settings pop-up hash (optional)",
  schedule_hash: "Schedule handled by dashboard (optional hash)",
};

export class KibbleCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCardConfig | undefined;

  setConfig(config: KibbleCardConfig): void {
    this._config = config;
  }

  render() {
    if (!this._config) return nothing;
    if (customElements.get("ha-form")) {
      return html`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `;
    }
    return this._renderFallback();
  }

  private _computeLabel = (field: SchemaField): string => FIELD_LABELS[field.name] ?? field.name;

  private _renderFallback() {
    const entities = Object.values(this.hass?.entities ?? {});
    const devices = Object.values(this.hass?.devices ?? {}).filter((device) =>
      entities.some((entity) => entity.device_id === device.id && entity.platform === "kibble"),
    );
    return html`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${(event: Event) => this._updateDeviceId((event.target as HTMLSelectElement).value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${devices.map(
              (device) => html`<option value=${device.id} ?selected=${device.id === this._config?.device_id}>${device.name_by_user ?? device.name}</option>`,
            )}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name ?? ""}
            @change=${(event: Event) => this._updateName((event.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          <span>Settings pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#settings"
            .value=${this._config?.settings_hash ?? ""}
            @change=${(event: Event) => this._updateSettingsHash((event.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          <span>Schedule pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#schedule"
            .value=${this._config?.schedule_hash ?? ""}
            @change=${(event: Event) => this._updateScheduleHash((event.target as HTMLInputElement).value)}
          />
        </label>
      </div>
    `;
  }

  private _formValueChanged(event: CustomEvent<{ value: KibbleCardConfig }>): void {
    this._config = event.detail.value;
    this._fireConfigChanged();
  }

  private _updateDeviceId(value: string): void {
    if (!this._config) return;
    this._config = { ...this._config, device_id: value };
    this._fireConfigChanged();
  }

  private _updateName(value: string): void {
    if (!this._config) return;
    this._config = { ...this._config, name: value || undefined };
    this._fireConfigChanged();
  }

  private _updateSettingsHash(value: string): void {
    if (!this._config) return;
    this._config = { ...this._config, settings_hash: value || undefined };
    this._fireConfigChanged();
  }

  private _updateScheduleHash(value: string): void {
    if (!this._config) return;
    this._config = { ...this._config, schedule_hash: value || undefined };
    this._fireConfigChanged();
  }

  private _fireConfigChanged(): void {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  static styles = css`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
  `;
}

customElements.define("kibble-card-editor", KibbleCardEditor);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-card-editor": KibbleCardEditor;
  }
}
