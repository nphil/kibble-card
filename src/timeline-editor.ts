/** Visual editor for `kibble-timeline-card`: the device picker plus an optional label and an
 * optional row limit. Mirrors `editor.ts`'s dual `ha-form`/plain-`<select>` pattern exactly.
 */

import { LitElement, css, html, nothing } from "lit";
import type { HomeAssistant, KibbleTimelineCardConfig } from "./types";

interface SchemaField {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

const SCHEMA: SchemaField[] = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "limit", selector: { number: { min: 1, mode: "box" } } },
];

const FIELD_LABELS: Record<string, string> = {
  device_id: "Kibble device",
  name: "Name (optional)",
  limit: "Rows before \u201cShow more\u201d (optional, default 30)",
};

export class KibbleTimelineCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleTimelineCardConfig | undefined;

  setConfig(config: KibbleTimelineCardConfig): void {
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
          <span>Rows before "Show more" (optional, default 30)</span>
          <input
            type="number"
            min="1"
            .value=${this._config?.limit != null ? String(this._config.limit) : ""}
            @change=${(event: Event) => this._updateLimit((event.target as HTMLInputElement).value)}
          />
        </label>
      </div>
    `;
  }

  private _formValueChanged(event: CustomEvent<{ value: KibbleTimelineCardConfig }>): void {
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

  private _updateLimit(value: string): void {
    if (!this._config) return;
    const parsed = Number(value);
    this._config = { ...this._config, limit: value && Number.isFinite(parsed) ? parsed : undefined };
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

customElements.define("kibble-timeline-card-editor", KibbleTimelineCardEditor);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-timeline-card-editor": KibbleTimelineCardEditor;
  }
}
