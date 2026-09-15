/** The one big physical-feeling action on the card. `variant="feed"` requires a press-and-hold
 * (the anti-accident lock for a touchscreen a cat can step on); `variant="cancel"` fires on a
 * plain tap, because making an emergency stop harder to reach would be the wrong tradeoff.
 */

import { LitElement, css, html } from "lit";
import { HOLD_TO_FEED_MS } from "../styles/tokens";

export class KibbleHoldButton extends LitElement {
  static properties = {
    label: { type: String },
    variant: { type: String },
    disabled: { type: Boolean },
    holdMs: { type: Number, attribute: "hold-ms" },
  };

  declare label: string;
  declare variant: "feed" | "cancel";
  declare disabled: boolean;
  declare holdMs: number;

  private _holding = false;
  private _holdTimer: number | undefined = undefined;

  constructor() {
    super();
    this.label = "Hold to feed";
    this.variant = "feed";
    this.disabled = false;
    this.holdMs = HOLD_TO_FEED_MS;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._holdTimer);
  }

  render() {
    return html`
      <button
        type="button"
        class="button ${this.variant} ${this._holding ? "holding" : ""}"
        ?disabled=${this.disabled}
        style=${this.variant === "feed" ? `--hold-ms: ${this.holdMs}ms` : ""}
        @pointerdown=${this.variant === "feed" ? this._startHold : undefined}
        @pointerup=${this.variant === "feed" ? this._cancelHold : undefined}
        @pointerleave=${this.variant === "feed" ? this._cancelHold : undefined}
        @pointercancel=${this.variant === "feed" ? this._cancelHold : undefined}
        @click=${this.variant === "cancel" ? this._tapActivate : undefined}
      >
        ${this.variant === "feed" ? html`<span class="fill"></span>` : ""}
        <span class="label">${this.label}</span>
      </button>
    `;
  }

  private _startHold = (event: PointerEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    this._holding = true;
    this.requestUpdate();
    clearTimeout(this._holdTimer);
    this._holdTimer = setTimeout(() => {
      this._holding = false;
      this.requestUpdate();
      this._activate();
    }, this.holdMs);
  };

  private _cancelHold = (): void => {
    clearTimeout(this._holdTimer);
    if (this._holding) {
      this._holding = false;
      this.requestUpdate();
    }
  };

  private _tapActivate(): void {
    if (this.disabled) return;
    this._activate();
  }

  private _activate(): void {
    this.dispatchEvent(new CustomEvent("activate", { bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: block;
    }
    .button {
      position: relative;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border: none;
      border-radius: calc(var(--ha-card-border-radius, 12px) * 0.8);
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .button.cancel {
      background: transparent;
      border: 2px solid var(--kibble-amber-dark);
      color: var(--kibble-amber-dark);
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-text-color);
      outline-offset: 2px;
    }
    .fill {
      position: absolute;
      inset: 0;
      background: var(--kibble-amber-dark);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 150ms ease-out;
    }
    .button.holding .fill {
      transform: scaleX(1);
      transition: transform var(--hold-ms, 600ms) linear;
    }
    .label {
      position: relative;
      z-index: 1;
    }
  `;
}

customElements.define("kibble-hold-button", KibbleHoldButton);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-hold-button": KibbleHoldButton;
  }
}
