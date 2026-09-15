/** A big +/- stepper: the compact alternative to the segmented picker, used wherever a full
 * six-segment row (1-5 + more) genuinely does not fit — Nitin's brief allows either "big +/- or
 * a horizontal segmented picker," not one exclusively, so this is a legitimate second face of
 * the same amount control, not a smaller/lesser one. Every target stays >=48px.
 */

import { LitElement, css, html } from "lit";

export class KibbleStepper extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean },
  };

  declare value: number;
  declare min: number;
  declare max: number;
  declare step: number;
  declare disabled: boolean;

  constructor() {
    super();
    this.value = 1;
    this.min = 1;
    this.max = 20;
    this.step = 1;
    this.disabled = false;
  }

  render() {
    return html`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled || this.value <= this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled || this.value >= this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `;
  }

  private _decrement(): void {
    this._emit(Math.max(this.min, this.value - this.step));
  }

  private _increment(): void {
    this._emit(Math.min(this.max, this.value + this.step));
  }

  private _emit(value: number): void {
    this.dispatchEvent(new CustomEvent("value-selected", { detail: { value }, bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: block;
    }
    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .step-btn {
      width: var(--kibble-touch-target, 48px);
      height: var(--kibble-touch-target, 48px);
      border-radius: 50%;
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      flex: none;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .step-btn:focus-visible {
      outline: 2px solid var(--kibble-amber-dark);
      outline-offset: 2px;
    }
    .value {
      min-width: 1.6em;
      text-align: center;
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
    }
  `;
}

customElements.define("kibble-stepper", KibbleStepper);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-stepper": KibbleStepper;
  }
}
