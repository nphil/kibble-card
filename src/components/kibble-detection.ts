/** The feeder's most recent onboard-AI detection, as one quiet row: a small thumbnail of the
 * crop, when it happened, and how many detections there have been today.
 *
 * Deliberately a *row*, not a panel. The bowl is the card's primary object and the feed button is
 * its primary action; a detection is context, so it reads at footer weight and never competes.
 * It renders nothing at all when the feeder has never detected anything, rather than showing an
 * empty frame — an absent row is quieter than a blank one.
 *
 * The `cat` name is shown only when Kibble's own classifier actually identified someone. The
 * vendor's confidence score and pet id live in a private queue we cannot read (see the agent's
 * docs/24-onboard-ai.md), so nothing here invents one.
 */

import { LitElement, css, html, nothing } from "lit";

export class KibbleDetection extends LitElement {
  static properties = {
    imageUrl: { type: String },
    when: { type: String },
    detectionClass: { type: String },
    catName: { type: String },
    todayCount: { type: Number },
  };

  /** Absolute URL for the crop, already tokenised by Home Assistant (`entity_picture`). */
  declare imageUrl: string | null;
  /** Human-readable relative time, e.g. "2m ago". */
  declare when: string | null;
  /** The vendor's own class for this detection: `visit`, `eat` or `face`. */
  declare detectionClass: string | null;
  /** Kibble's identification, when it has one. */
  declare catName: string | null;
  /** Detections recorded since local midnight. */
  declare todayCount: number | null;

  constructor() {
    super();
    this.imageUrl = null;
    this.when = null;
    this.detectionClass = null;
    this.catName = null;
    this.todayCount = null;
  }

  render() {
    if (!this.when && !this.imageUrl) return nothing;
    // `visit` is the common case and reads oddly as a bare noun, so it becomes "Seen".
    const classLabel =
      this.detectionClass === "eat"
        ? "Eating"
        : this.detectionClass === "face"
          ? "Face seen"
          : this.detectionClass === "visit"
            ? "Seen"
            : "Detected";
    return html`
      <div class="row" role="group" aria-label="Last detection">
        ${this.imageUrl
          ? html`<img class="thumb" src=${this.imageUrl} alt="Most recent detection" loading="lazy" />`
          : html`<div class="thumb thumb--empty" aria-hidden="true"></div>`}
        <div class="text">
          <span class="primary">${this.catName ?? classLabel}</span>
          <span class="secondary">${this.when ?? ""}</span>
        </div>
        ${this.todayCount !== null && this.todayCount > 0
          ? html`<span class="count" title="Detections today">${this.todayCount}</span>`
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
    }
    .thumb {
      width: 44px;
      height: 44px;
      flex: 0 0 auto;
      object-fit: cover;
      /* Squircle, not a circle: this is a photo crop, and a circle would clip the cat. */
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .thumb--empty {
      opacity: 0.6;
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.2;
    }
    .primary {
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .secondary {
      font-size: var(--kibble-footer-size, 12px);
      color: var(--secondary-text-color);
    }
    .count {
      margin-left: auto;
      font-size: var(--kibble-footer-size, 12px);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      padding: 3px 10px;
      border-radius: 999px;
      /* Soft surface rather than an outline, matching the picker segments. */
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
  `;
}

customElements.define("kibble-detection", KibbleDetection);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-detection": KibbleDetection;
  }
}
