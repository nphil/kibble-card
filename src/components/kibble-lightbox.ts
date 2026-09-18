/** A single full-viewport image overlay. Escape or a backdrop click both request a close; the
 * timeline card (not this component) owns returning focus to whichever thumbnail opened it,
 * since only the card knows which trigger to restore -- this element only ever asks to close,
 * the same controlled-overlay contract `kibble-settings-dialog` already uses. Renders nothing
 * at all while closed, so (unlike a CSS-hidden overlay) it never sits over the page eating
 * clicks.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { mdiIcon } from "../lib/mdi-icons";
import "./kibble-before-after";

export class KibbleLightbox extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    imageUrl: { type: String },
    alt: { type: String },
    beforeUrl: { type: String },
    afterUrl: { type: String },
    beforeLabel: { type: String },
    afterLabel: { type: String },
  };

  declare open: boolean;
  declare imageUrl: string | null;
  declare alt: string;
  /** When either is set, the frame renders a `kibble-before-after` compare tile instead of a
   * plain `<img>` -- the same controlled-overlay chrome (backdrop, Escape, focus return) with a
   * different centrepiece, so a timeline row's eat-compare pair reuses this dialog rather than
   * inventing a second one. */
  declare beforeUrl: string | null;
  declare afterUrl: string | null;
  declare beforeLabel: string;
  declare afterLabel: string;

  private _closeButtonRef = createRef<HTMLButtonElement>();

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      this._close();
    }
  };

  constructor() {
    super();
    this.open = false;
    this.imageUrl = null;
    this.alt = "";
    this.beforeUrl = null;
    this.afterUrl = null;
    this.beforeLabel = "Before";
    this.afterLabel = "After";
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
      this._closeButtonRef.value?.focus();
    }
  }

  render() {
    if (!this.open) return nothing;
    const isCompare = Boolean(this.beforeUrl || this.afterUrl);
    return html`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.alt || "Photo"}>
        <div class="frame ${isCompare ? "compare" : ""}" @click=${(event: Event) => event.stopPropagation()}>
          ${isCompare
            ? html`
                <kibble-before-after
                  .beforeSrc=${this.beforeUrl}
                  .afterSrc=${this.afterUrl}
                  .beforeLabel=${this.beforeLabel}
                  .afterLabel=${this.afterLabel}
                  .caption=${this.alt}
                ></kibble-before-after>
              `
            : this.imageUrl
              ? html`<img src=${this.imageUrl} alt=${this.alt} />`
              : nothing}
          <button type="button" class="close" aria-label="Close" ${ref(this._closeButtonRef)} @click=${this._close}>
            ${mdiIcon("close")}
          </button>
        </div>
      </div>
    `;
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
      background: rgba(0, 0, 0, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 32px;
      box-sizing: border-box;
    }
    .frame {
      position: relative;
      max-width: min(90vw, 720px);
      max-height: 90vh;
    }
    .frame.compare {
      width: min(90vw, 720px);
    }
    img {
      display: block;
      max-width: 100%;
      max-height: 90vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .close {
      position: absolute;
      top: -16px;
      right: -16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: #fff;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    .close:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .backdrop {
        animation: kibble-lightbox-fade 120ms ease-out;
      }
    }
    @keyframes kibble-lightbox-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
}

customElements.define("kibble-lightbox", KibbleLightbox);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-lightbox": KibbleLightbox;
  }
}
