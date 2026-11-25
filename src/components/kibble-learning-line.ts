/** The live learning line: what Kibble is doing with the answers it was given, as it happens.
 * Used by the review queue (the line) and by the cats card (the line plus a short summary of the
 * last finished pass, which can be dismissed and does not come back).
 *
 * The wording and every number come from `lib/learning-status.ts`; the live feed (one shared
 * subscription per entry) is `lib/learning-feed.ts`. This file only draws, and ticks once a
 * second while a retry countdown is on screen. It draws nothing at all when there is nothing to
 * say, and never an error.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant } from "../types";
import { learningFeed, type LearningFeed } from "../lib/learning-feed";
import { learningCountsDown, learningLine, learningProgress, learningSummary, readDismissed, writeDismissed } from "../lib/learning-status";
import { browserStorage } from "../lib/simple-storage";
import { mdiIcon } from "../lib/mdi-icons";

export class KibbleLearningLine extends LitElement {
  static properties = {
    hass: { attribute: false },
    entryId: { type: String },
    /** Also show the summary of the last finished pass (the cats card does; the queue does not). */
    summary: { type: Boolean },
    _dismissed: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  declare summary: boolean;
  private _dismissed = 0;
  private _dismissedFor: string | undefined;
  private _feed: LearningFeed | null = null;
  private _unlisten: (() => void) | null = null;
  private _ticker: ReturnType<typeof setInterval> | undefined;
  /** Whether the last render had nothing to show: the host then hides itself, so it leaves no gap. */
  private _empty = true;

  constructor() {
    super();
    this.summary = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.requestUpdate(); // `willUpdate` listens again after a reattach
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unlisten?.();
    this._unlisten = null;
    this._feed = null;
    clearInterval(this._ticker);
    this._ticker = undefined;
  }

  protected willUpdate(_changed: PropertyValues): void {
    const { hass, entryId } = this;
    if (!hass || !entryId) return;
    const feed = learningFeed(entryId);
    feed.attach(hass);
    if (feed !== this._feed) {
      this._unlisten?.();
      this._feed = feed;
      this._unlisten = feed.listen(() => this.requestUpdate());
    }
    if (this._dismissedFor !== entryId) {
      this._dismissedFor = entryId;
      this._dismissed = readDismissed(browserStorage(), entryId);
    }
  }

  protected updated(): void {
    this.toggleAttribute("hidden", this._empty);
    const status = this._feed?.status ?? null;
    const ticking = learningCountsDown(status, Date.now() / 1000);
    if (ticking && this._ticker === undefined) this._ticker = setInterval(() => this.requestUpdate(), 1000);
    else if (!ticking && this._ticker !== undefined) {
      clearInterval(this._ticker);
      this._ticker = undefined;
    }
  }

  private _dismiss = (finished: number): void => {
    if (!this.entryId) return;
    writeDismissed(browserStorage(), this.entryId, finished);
    this._dismissed = finished;
  };

  render() {
    const status = this._feed?.status ?? null;
    const now = Date.now() / 1000;
    const locale = this.hass?.locale?.language ?? this.hass?.language;
    const line = learningLine(status, now, locale);
    const progress = learningProgress(status);
    const done = this.summary ? learningSummary(status, now, this._dismissed, locale) : null;
    this._empty = !line && !done;
    if (this._empty) return nothing;
    return html`
      ${line
        ? html`<div class="line ${status?.state ?? ""}" role="status" title=${status?.error ?? ""}>
            <span class="dot" aria-hidden="true"></span>
            <span class="text">${line}</span>
            ${progress !== null ? html`<span class="bar" aria-hidden="true"><span style=${`transform:scaleX(${progress})`}></span></span>` : nothing}
          </div>`
        : nothing}
      ${done
        ? html`<div class="done" role="status">
            <span class="check">${mdiIcon("check")}</span>
            <span class="text">${done.text}</span>
            <button type="button" aria-label="Dismiss" @click=${() => this._dismiss(done.finished)}>${mdiIcon("close")}</button>
          </div>`
        : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    .line,
    .done {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      font-size: 13px;
      line-height: 1.3;
      color: var(--secondary-text-color);
    }
    .line + .done {
      margin-top: 8px;
    }
    .text {
      flex: 1;
      min-width: 0;
    }
    .dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
    }
    .line.retrying .dot {
      background: var(--warning-color, #ffa600);
    }
    .bar {
      flex-basis: 100%;
      height: 3px;
      border-radius: 2px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .bar span {
      display: block;
      height: 100%;
      background: var(--primary-color, #03a9f4);
      transform-origin: left center;
      transition: transform 300ms ease-out;
    }
    .done {
      flex-wrap: nowrap;
      align-items: flex-start;
      padding: 8px 4px 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--kibble-feed, #43a96a) 14%, transparent);
    }
    .check {
      flex: none;
      display: flex;
      align-items: center;
      height: 20px;
      color: var(--kibble-feed, #43a96a);
      font-size: 18px;
    }
    .done button {
      flex: none;
      width: 40px;
      height: 40px;
      margin: -8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      font-size: 20px;
      cursor: pointer;
    }
    .done button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
    }
    @media (prefers-reduced-motion: no-preference) {
      .line.waiting .dot,
      .line.learning .dot,
      .line.rechecking .dot {
        animation: kibble-learning-pulse 1.4s ease-in-out infinite;
      }
    }
    @keyframes kibble-learning-pulse {
      50% {
        opacity: 0.35;
      }
    }
  `;
}

customElements.define("kibble-learning-line", KibbleLearningLine);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-learning-line": KibbleLearningLine;
  }
}
