/** A fixed-box, lazy, never-flashing authenticated photo. Reserves its box immediately via plain
 * CSS (the caller sizes the host; this element always fills it at `width:100%;height:100%`), so
 * there is never a layout jump between "no image yet" and "image loaded". Stays a neutral
 * placeholder until an `IntersectionObserver` says it is actually on screen, so a 24-tile review
 * grid or a long timeline never fires dozens of authenticated fetches for rows nobody has
 * scrolled to yet. Holds a live reference on the shared `ImageUrlCache` (via `AssetRef`) for
 * exactly as long as it is connected and showing this asset -- acquired once visible, released
 * on disconnect or on every asset change -- which is what makes a URL still on screen anywhere
 * immune to eviction.
 *
 * `hass` changing identity (which happens on almost every Home Assistant state tick, system-wide)
 * is never itself a reason to refetch: only `asset?.id` changing drives a new acquire.
 */

import { LitElement, css, html, type PropertyValues } from "lit";
import type { Asset, HomeAssistant } from "../types";
import { AssetRef, type ImageUrlCache } from "../lib/image-cache";

export class KibbleImage extends LitElement {
  static properties = {
    hass: { attribute: false },
    asset: { attribute: false },
    cache: { attribute: false },
    alt: { type: String },
    rounded: { type: Boolean },
    fit: { type: String },
  };

  declare hass: HomeAssistant | undefined;
  declare asset: Asset | null | undefined;
  declare cache: ImageUrlCache | undefined;
  declare alt: string;
  declare rounded: boolean;
  declare fit: "cover" | "contain";

  private readonly _ref = new AssetRef();
  private _visible = false;
  private _observer: IntersectionObserver | null = null;

  constructor() {
    super();
    this.alt = "";
    this.rounded = false;
    this.fit = "cover";
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._visible = false;
    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this._markVisible();
      },
      { rootMargin: "200px" },
    );
    this._observer.observe(this);
    // A freshly connected element -- most often one that just replaced a same-position element
    // of a different shape in a re-render (a row's picker swapping for its labelled layout,
    // say) -- is very often already on screen the instant it connects. The observer's own
    // notification for that case has no guaranteed delivery time once inserted mid-update, so
    // wait one paint and measure directly: a real guarantee that does not share whatever made
    // the observer late, rather than a second thing hoping the same clock works out.
    requestAnimationFrame(() => {
      if (this._visible || !this.isConnected) return;
      const rect = this.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const nearViewport = rect.width > 0 && rect.height > 0 && rect.bottom > -200 && rect.top < viewportHeight + 200;
      if (nearViewport) this._markVisible();
    });
  }

  private _markVisible(): void {
    if (this._visible) return;
    this._visible = true;
    this._sync();
    // A cache hit resolves the url synchronously inside `sync` without firing its change
    // callback, and this runs after the first render, so render again to show it.
    this.requestUpdate();
    // `_sync` already made this the element's one and only acquire for its current asset
    // (`AssetRef` guards against re-acquiring the same id) -- nothing left to watch for.
    this._observer?.disconnect();
    this._observer = null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
    this._ref.dispose();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("asset") || changed.has("cache") || changed.has("hass")) this._sync();
  }

  private _sync(): void {
    if (!this._visible) return;
    this._ref.sync(this.hass, this.cache, this.asset, () => this.requestUpdate());
  }

  render() {
    const url = this._ref.url;
    return html`
      <div class="box ${this.rounded ? "rounded" : ""}">
        ${url ? html`<img src=${url} alt=${this.alt} loading="lazy" style="object-fit:${this.fit}" />` : html`<div class="placeholder"></div>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .box.rounded {
      border-radius: 50%;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    @media (prefers-reduced-motion: no-preference) {
      img {
        animation: kibble-image-in 180ms ease-out;
      }
    }
    @keyframes kibble-image-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .placeholder {
      width: 100%;
      height: 100%;
    }
  `;
}

customElements.define("kibble-image", KibbleImage);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-image": KibbleImage;
  }
}
