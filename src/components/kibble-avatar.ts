/** A cat's round avatar: crops to a circle once its designated sample photo loads, showing a
 * monogram in the cat's palette color until then -- and forever, for a cat with no labelled
 * sample yet, per DESIGN.md: "training is what makes the faces appear." With no name at all (an
 * unidentified "a cat" row), it falls back to the brand's own cat silhouette on a neutral
 * surface instead of a bare "?", reusing the same mark `kibble-bowl` already shows for the same
 * case. Owns its own authenticated fetch (`hass.fetchWithAuth`) and object-URL cache so every
 * call site (hero overlay, timeline rows, the cats header) just hands it a name/color/sample and
 * gets a working image, never plumbing fetch/object-URL bookkeeping itself.
 */

import { LitElement, css, html } from "lit";
import type { HomeAssistant } from "../types";
import { ImageUrlCache, kibbleImageUrl } from "../lib/image-cache";
import { catSilhouette } from "../lib/brand-shapes";
import { catColorAt } from "../styles/tokens";
import { fallbackCatColor } from "../lib/cat-colors";

export class KibbleAvatar extends LitElement {
  static properties = {
    hass: { attribute: false },
    name: { type: String },
    colorIndex: { type: Number, attribute: "color-index" },
    entryId: { type: String, attribute: "entry-id" },
    sampleName: { type: String, attribute: "sample-name" },
  };

  declare hass: HomeAssistant | undefined;
  /** `null` renders the neutral silhouette (an unidentified cat), not a monogram. */
  declare name: string | null;
  /** `null` when the roster hasn't resolved this cat's real color yet; falls back to a stable
   * hash of `name` so a monogram doesn't flicker between colors while data streams in. */
  declare colorIndex: number | null;
  declare entryId: string | undefined;
  declare sampleName: string | null;

  private readonly _cache = new ImageUrlCache();
  private _imageUrl: string | null = null;
  private _resolvedPath: string | null = null;

  constructor() {
    super();
    this.name = null;
    this.colorIndex = null;
    this.sampleName = null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cache.dispose();
  }

  protected willUpdate(): void {
    const path = this.entryId && this.name && this.sampleName ? kibbleImageUrl(this.entryId, `sample/${this.name}`, this.sampleName) : null;
    if (path === this._resolvedPath) return;
    this._resolvedPath = path;
    this._imageUrl = null;
    if (!path || !this.hass) return;
    this._imageUrl = this._cache.get(this.hass, path, (url) => {
      if (this._resolvedPath !== path) return; // superseded by a newer name/sample/entry
      this._imageUrl = url;
      this.requestUpdate();
    });
  }

  render() {
    if (!this.name) {
      return html`<div class="avatar neutral">${catSilhouette()}</div>`;
    }
    const color = this.colorIndex != null ? catColorAt(this.colorIndex) : fallbackCatColor(this.name);
    return html`
      <div class="avatar" style="--kibble-avatar-color: ${color}">
        ${this._imageUrl
          ? html`<img src=${this._imageUrl} alt="" />`
          : html`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: var(--kibble-avatar-size, 32px);
      height: var(--kibble-avatar-size, 32px);
      flex: 0 0 auto;
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: var(--kibble-avatar-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar.neutral {
      background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent);
      color: var(--secondary-text-color);
      padding: 18%;
      box-sizing: border-box;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .monogram {
      color: #fff;
      font-weight: 600;
      font-size: calc(var(--kibble-avatar-size, 32px) * 0.42);
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
