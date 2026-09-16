/** The chooser: every enrolled cat plus the two reserved buckets ("Not a cat", "Skip"), for the
 * crop the cats card is currently correcting. A controlled overlay -- the parent owns `open`
 * and which crop is being decided; this only ever reports a choice or asks to close, the same
 * contract `kibble-settings-dialog`/`kibble-lightbox` already use.
 */

import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { HomeAssistant, KibbleCatSummary } from "../types";
import "./kibble-avatar";

export class KibbleFacePicker extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    cats: { attribute: false },
    entryId: { type: String },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare cats: KibbleCatSummary[];
  declare entryId: string | undefined;

  private _firstButtonRef = createRef<HTMLButtonElement>();

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this._close();
    }
  };

  constructor() {
    super();
    this.open = false;
    this.cats = [];
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._firstButtonRef.value?.focus();
    }
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${(event: Event) => event.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          <div class="rows">
            ${this.cats.map(
              (cat, index) => html`
                <button type="button" class="row" ${index === 0 ? ref(this._firstButtonRef) : nothing} @click=${() => this._choose(cat.name)}>
                  <kibble-avatar
                    .hass=${this.hass}
                    .name=${cat.name}
                    .colorIndex=${cat.color_index}
                    .entryId=${this.entryId}
                    .sampleName=${cat.avatar}
                  ></kibble-avatar>
                  <span>${cat.name}</span>
                </button>
              `,
            )}
            <button type="button" class="row" ${this.cats.length === 0 ? ref(this._firstButtonRef) : nothing} @click=${() => this._choose("not_a_cat")}>
              <kibble-avatar .name=${null}></kibble-avatar>
              <span>Not a cat</span>
            </button>
            <button type="button" class="row" @click=${() => this._choose("other")}>
              <kibble-avatar .name=${null}></kibble-avatar>
              <span>Skip</span>
            </button>
          </div>
          <button type="button" class="cancel" @click=${this._close}>Cancel</button>
        </div>
      </div>
    `;
  }

  private _choose(cat: string): void {
    this.dispatchEvent(new CustomEvent("choice", { detail: { cat }, bubbles: true, composed: true }));
  }

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  };

  static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
      }
    }
    .sheet {
      width: 100%;
      max-width: 360px;
      max-height: 80vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      padding: 16px;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    .heading {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      padding-bottom: 8px;
    }
    .rows {
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 4px;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
      border-radius: 8px;
    }
    .row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .row:focus-visible,
    .cancel:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    kibble-avatar {
      --kibble-avatar-size: 32px;
    }
    .cancel {
      width: 100%;
      margin-top: 8px;
      min-height: 44px;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
  `;
}

customElements.define("kibble-face-picker", KibbleFacePicker);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-face-picker": KibbleFacePicker;
  }
}
