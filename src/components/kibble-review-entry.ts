/** The one way into the review queue, the same control on every Kibble card: a "Check visits"
 * button with the number of visits Kibble could not name. It owns the queue dialog too, so a
 * card only places this element and, to start at one particular visit, calls `open(uid)`.
 *
 * `variant="bar"` is the full-width row for a card body; `variant="chip"` is the small pill for
 * the live video, shown only while something is waiting.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { CatSummary, HomeAssistant } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { mdiIcon } from "../lib/mdi-icons";
import { onReviewChange } from "../lib/review-bus";
import { loadUnknownCount } from "../lib/review-source";
import "./kibble-review-queue";

export class KibbleReviewEntry extends LitElement {
  static properties = {
    hass: { attribute: false },
    entryId: { type: String },
    cats: { attribute: false },
    cache: { attribute: false },
    variant: { type: String, reflect: true },
    revision: { attribute: false },
    _count: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  declare cats: CatSummary[];
  declare cache: ImageUrlCache | undefined;
  declare variant: "bar" | "chip";
  /** Any value that changes when the host card's own data changes (a live push, a refresh):
   * the count is read again whenever it does. */
  declare revision: unknown;

  private _count: number | null = null;
  private _countedEntry: string | undefined;
  private _generation = 0;
  private _stopListening: (() => void) | null = null;

  constructor() {
    super();
    this.cats = [];
    this.variant = "bar";
  }

  /** Opens the queue; `startUid` is the visit to show first. */
  open(startUid?: string | null): void {
    this.renderRoot.querySelector("kibble-review-queue")?.show(startUid);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._stopListening = onReviewChange(
      () => this.entryId,
      () => this._loadCount(),
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopListening?.();
    this._stopListening = null;
    this._generation++;
  }

  protected willUpdate(changed: PropertyValues): void {
    const ready = Boolean(this.hass?.callWS && this.entryId);
    if (ready && (this.entryId !== this._countedEntry || changed.has("revision"))) this._loadCount();
  }

  private _loadCount = (): void => {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    this._countedEntry = entryId;
    const generation = ++this._generation;
    loadUnknownCount(callWS, entryId).then(
      (count) => {
        if (generation === this._generation) this._count = count;
      },
      () => {}, // the button still opens the queue; only the number is missing
    );
  };

  render() {
    const count = this._count ?? 0;
    const label = count > 0 ? `Check visits, ${count} ${count === 1 ? "needs" : "need"} a name` : "Check visits";
    return html`
      ${this.variant === "chip"
        ? count > 0
          ? html`<button type="button" class="chip" aria-label=${label} @click=${() => this.open()}>${mdiIcon("helpCircle")}<span>${count} to check</span></button>`
          : nothing
        : html`<button type="button" class="bar" aria-label=${label} @click=${() => this.open()}>
            <span class="bar-glyph">${mdiIcon("helpCircle")}</span>
            <span class="bar-label">Check visits</span>
            ${count > 0 ? html`<span class="badge">${count}</span>` : nothing}
            <span class="bar-chevron">${mdiIcon("chevronRight")}</span>
          </button>`}
      <kibble-review-queue .hass=${this.hass} .entryId=${this.entryId} .cats=${this.cats} .cache=${this.cache} @review-closed=${this._loadCount}></kibble-review-queue>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    :host([variant="chip"]) {
      display: contents;
    }
    button {
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 90ms ease-out;
    }
    button:active {
      transform: scale(0.97);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .bar {
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 8px 8px 12px;
      border: 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      font-size: 14px;
      text-align: left;
    }
    .bar-glyph {
      display: flex;
      font-size: 24px;
      color: var(--secondary-text-color);
    }
    .bar-label {
      flex: 1;
      min-width: 0;
      font-weight: 500;
    }
    .badge {
      min-width: 24px;
      box-sizing: border-box;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .bar-chevron {
      display: flex;
      font-size: 24px;
      color: var(--secondary-text-color);
    }
    .chip {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px 6px 8px;
      border: 0;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: inherit;
      font-weight: 500;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .chip svg {
      font-size: 18px;
    }
    /* The pill is small on the video; this keeps its tap target at 44px. */
    .chip::after {
      content: "";
      position: absolute;
      inset: -8px -4px;
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:active {
        transform: none;
      }
    }
  `;
}

customElements.define("kibble-review-entry", KibbleReviewEntry);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-review-entry": KibbleReviewEntry;
  }
}
