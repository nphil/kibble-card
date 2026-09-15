/** Horizontal 1-5 portion picker plus a "more" segment for anything outside that range. Fires
 * `portion-selected` with the chosen amount, or `more-requested` when the amount lives outside
 * 1-5 and the user wants the fuller control in settings. No local state: the caller always owns
 * `value` (bound straight to `number.feed_amount`), so the picker can't drift from the entity.
 */

import { LitElement, css, html } from "lit";

const QUICK_VALUES = [1, 2, 3, 4, 5];

export class KibbleSegmentedPicker extends LitElement {
  static properties = {
    value: { type: Number },
    disabled: { type: Boolean },
  };

  declare value: number;
  declare disabled: boolean;

  constructor() {
    super();
    this.value = 1;
    this.disabled = false;
  }

  render() {
    const isQuickValue = QUICK_VALUES.includes(this.value);
    return html`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${QUICK_VALUES.map(
          (portion) => html`
            <button
              type="button"
              role="radio"
              aria-checked=${portion === this.value}
              class="segment ${portion === this.value ? "selected" : ""}"
              ?disabled=${this.disabled}
              @click=${() => this._select(portion)}
            >
              ${portion}
            </button>
          `,
        )}
        <button
          type="button"
          role="radio"
          aria-checked=${!isQuickValue}
          class="segment more ${!isQuickValue ? "selected" : ""}"
          ?disabled=${this.disabled}
          @click=${this._requestMore}
        >
          ${isQuickValue ? "More" : html`${this.value}<small>more</small>`}
        </button>
      </div>
    `;
  }

  private _select(portion: number): void {
    this.dispatchEvent(new CustomEvent("portion-selected", { detail: { value: portion }, bubbles: true, composed: true }));
  }

  private _requestMore(): void {
    this.dispatchEvent(new CustomEvent("more-requested", { bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: block;
    }
    .segments {
      display: flex;
      gap: 6px;
    }
    .segment {
      flex: 1 1 0;
      min-width: var(--kibble-touch-target, 48px);
      min-height: var(--kibble-touch-target, 48px);
      border-radius: calc(var(--ha-card-border-radius, 12px) * 0.6);
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.1;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }
    .segment.more {
      flex: 1.3 1 0;
      font-size: calc(var(--kibble-segment-size, 16px) * 0.85);
    }
    .segment small {
      font-size: 0.55em;
      font-weight: 500;
      text-transform: lowercase;
    }
    .segment.selected {
      background: var(--kibble-amber);
      border-color: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
    }
    .segment:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .segment:focus-visible {
      outline: 2px solid var(--kibble-amber-dark);
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-segmented-picker", KibbleSegmentedPicker);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-segmented-picker": KibbleSegmentedPicker;
  }
}
