/** A cat's round avatar: crops to a circle once its avatar photo loads, showing a monogram in
 * the cat's palette color until then -- and forever, for a cat with no labelled sample yet, per
 * DESIGN.md: "training is what makes the faces appear." With no name at all (an unidentified "a
 * cat" row), it falls back to the brand's own cat silhouette on a neutral surface instead of a
 * bare "?", reusing the same mark `kibble-bowl` already shows for the same case. Delegates the
 * authenticated fetch itself to `<kibble-image>` -- every call site just hands this a name,
 * colour and `Asset`, and a shared `ImageUrlCache` when one call site's photo might already be
 * cached elsewhere (a cat tile and a review tile can show the very same avatar).
 */

import { LitElement, css, html } from "lit";
import type { Asset, HomeAssistant } from "../types";
import { ImageUrlCache } from "../lib/image-cache";
import { catSilhouette } from "../lib/brand-shapes";
import { catColorAt } from "../styles/tokens";
import { fallbackCatColor } from "../lib/cat-colors";
import "./kibble-image";

export class KibbleAvatar extends LitElement {
  static properties = {
    hass: { attribute: false },
    name: { type: String },
    colorIndex: { type: Number, attribute: "color-index" },
    asset: { attribute: false },
    cache: { attribute: false },
  };

  declare hass: HomeAssistant | undefined;
  /** `null` renders the neutral silhouette (an unidentified cat), not a monogram. */
  declare name: string | null;
  /** `null` when the roster hasn't resolved this cat's real color yet; falls back to a stable
   * hash of `name` so a monogram doesn't flicker between colors while data streams in. */
  declare colorIndex: number | null;
  declare asset: Asset | null;
  /** Optional shared cache -- pass the owning card's own `ImageUrlCache` so an avatar already
   * fetched elsewhere on the same card (a review tile, say) never refetches here. Falls back to
   * a private instance so a standalone avatar (the hero's status line) still works on its own. */
  declare cache: ImageUrlCache | undefined;

  private readonly _ownCache = new ImageUrlCache();

  constructor() {
    super();
    this.name = null;
    this.colorIndex = null;
    this.asset = null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ownCache.dispose();
  }

  render() {
    if (!this.name) {
      return html`<div class="avatar neutral">${catSilhouette()}</div>`;
    }
    const color = this.colorIndex != null ? catColorAt(this.colorIndex) : fallbackCatColor(this.name);
    return html`
      <div class="avatar" style="--kibble-avatar-color: ${color}">
        ${this.asset
          ? html`<kibble-image rounded .hass=${this.hass} .asset=${this.asset} .cache=${this.cache ?? this._ownCache} alt=""></kibble-image>`
          : html`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: var(--kibble-avatar-size, 40px);
      height: var(--kibble-avatar-size, 40px);
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--kibble-avatar-color, var(--primary-color, #03a9f4)) 22%, var(--card-background-color, #fff));
      color: var(--kibble-avatar-color, var(--primary-color, #03a9f4));
      flex: none;
    }
    .avatar.neutral {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .avatar.neutral svg {
      width: 62%;
      height: 62%;
    }
    kibble-image {
      width: 100%;
      height: 100%;
    }
    .monogram {
      font-size: calc(var(--kibble-avatar-size, 40px) * 0.42);
      font-weight: 700;
      line-height: 1;
      user-select: none;
    }
  `;
}

customElements.define("kibble-avatar", KibbleAvatar);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-avatar": KibbleAvatar;
  }
}
