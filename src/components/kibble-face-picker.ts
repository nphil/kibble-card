/** The chooser: every enrolled cat plus the two reserved buckets ("Not a cat", "Skip"), for the
 * crop the cats card is currently correcting. A controlled overlay -- the parent owns `open`
 * and which crop is being decided; this only ever reports a choice or asks to close, the same
 * contract `kibble-settings-dialog`/`kibble-lightbox` already use.
 */

import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { HomeAssistant, KibbleCatSummary, PendingFaceCrop } from "../types";
import { ImageUrlCache, kibbleImageUrl } from "../lib/image-cache";
import "./kibble-avatar";
import "./kibble-lightbox";

export class KibbleFacePicker extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    cats: { attribute: false },
    entryId: { type: String },
    crop: { attribute: false },
    _zoomed: { state: true },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare cats: KibbleCatSummary[];
  declare entryId: string | undefined;
  /** The crop this session is deciding, so the sheet can show it large -- `null` only when
   * the parent hasn't (or no longer has) a crop to hand it, i.e. `!open`. */
  declare crop: PendingFaceCrop | null;
  /** Whether the preview photo is showing full-size in `kibble-lightbox`, tapped open from
   * the preview button below the heading. */
  declare _zoomed: boolean;

  private _firstButtonRef = createRef<HTMLButtonElement>();
  private readonly _cache = new ImageUrlCache();
  private _imageUrl: string | null = null;
  private _resolvedPath: string | null = null;

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !this.open) return;
    event.preventDefault();
    // The zoomed preview is a layer on top of the sheet -- close that first, the same
    // "topmost layer first" order a native nested dialog would give Escape.
    if (this._zoomed) {
      this._zoomed = false;
      return;
    }
    this._close();
  };

  constructor() {
    super();
    this.open = false;
    this.cats = [];
    this.crop = null;
    this._zoomed = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    this._cache.dispose();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._firstButtonRef.value?.focus();
    }
  }

  /** Resolves `crop`'s pending-image URL through the shared authenticated-fetch cache, the
   * same pattern `kibble-avatar` uses -- callers just hand this a crop, never plumbing
   * fetch/object-URL bookkeeping themselves. Also resets `_zoomed`: a freshly opened crop
   * should never inherit the previous one's zoom state. */
  protected willUpdate(): void {
    const path = this.entryId && this.crop ? kibbleImageUrl(this.entryId, "pending", this.crop.name) : null;
    if (path === this._resolvedPath) return;
    this._resolvedPath = path;
    this._imageUrl = null;
    this._zoomed = false;
    if (!path || !this.hass) return;
    this._imageUrl = this._cache.get(this.hass, path, (url) => {
      if (this._resolvedPath !== path) return; // superseded by a newer crop/entry
      this._imageUrl = url;
      this.requestUpdate();
    });
  }

  render() {
    if (!this.open) return nothing;
    const crop = this.crop;
    const alt = crop ? `Captured ${new Date(crop.ts * 1000).toLocaleString()}` : "";
    return html`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${(event: Event) => event.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          ${crop
            ? html`
                <button
                  type="button"
                  class="preview"
                  ?disabled=${!this._imageUrl}
                  aria-label=${`View full size. ${alt}`}
                  @click=${() => (this._zoomed = true)}
                >
                  ${this._imageUrl ? html`<img src=${this._imageUrl} alt="" loading="lazy" />` : nothing}
                </button>
              `
            : nothing}
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
      <kibble-lightbox ?open=${this._zoomed} .imageUrl=${this._imageUrl} .alt=${alt} @close-requested=${() => (this._zoomed = false)}></kibble-lightbox>
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
    .preview {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      margin-bottom: 8px;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .preview:disabled {
      cursor: default;
    }
    .preview:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      /* Same reasoning as the cats card's crop/sample grids: a real photo, smooth upscale,
       * never "pixelated". */
      image-rendering: auto;
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
