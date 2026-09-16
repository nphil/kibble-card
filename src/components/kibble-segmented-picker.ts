/** Horizontal 1-5 portion picker. Five 48px segments fit in ~264px, comfortably inside a
 * ~300px desktop two-column right rail -- no "more" segment competing for that width; 6-20
 * lives in the settings gear panel instead. No local state: the caller always owns `value`
 * (bound straight to `number.feed_amount`), so the picker can't drift from the entity.
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
      </div>
    `;
  }

  private _select(portion: number): void {
    this.dispatchEvent(new CustomEvent("portion-selected", { detail: { value: portion }, bubbles: true, composed: true }));
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
      /* Pill radius and a soft translucent surface instead of a 2px outline: the convention
         Mushroom/Bubble-style dashboards settled on, and it stops a row of five segments
         reading as a table of boxes. */
      border-radius: 999px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
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
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease;
    }
    /* Press feedback -- the small tactile detail that makes a touch panel feel native. */
    .segment:active:not(:disabled) {
      transform: scale(0.96);
    }
    .segment.selected {
      background: var(--kibble-amber);
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
