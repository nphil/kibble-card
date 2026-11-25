/** "Who ate? 1:05 PM": the one follow-up question left after photo answers, asked when two cats
 * were at a meal and the feeder's own data cannot say who ate. One button per cat plus "Both"
 * (when there are exactly two). It only asks; whoever hosts it sends the answer. The review
 * queue shows it as a screen of its own, straight after the answer that raised it; the event
 * sheet shows it inline on a meal that still needs it.
 *
 * Taps in the first moments after it appears are ignored: it can pop up while a finger is on its
 * way to the next photo's button, and that tap must not answer this question by accident.
 */

import { LitElement, css, html, nothing } from "lit";
import type { CatSummary, HomeAssistant } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { visitWhenLabel } from "../lib/timeline";
import { ateOptions, type AteOption, type AteQuestion } from "../lib/who-ate";
import type { ChoiceCat } from "./kibble-choice";
import "./kibble-choice";

export const INPUT_GUARD_MS = 350;

export interface AteChosenDetail {
  visitUid: string;
  ate: string[];
}

export class KibbleWhoAte extends LitElement {
  static properties = {
    hass: { attribute: false },
    cache: { attribute: false },
    question: { attribute: false },
    roster: { attribute: false },
    hotkeys: { type: Boolean },
    skippable: { type: Boolean },
  };

  declare hass: HomeAssistant | undefined;
  declare cache: ImageUrlCache | undefined;
  declare question: AteQuestion | null;
  /** The enrolled cats, for their colours and faces. */
  declare roster: CatSummary[];
  /** Show the 1, 2, 3 keys on the buttons (the queue handles the keys themselves). */
  declare hotkeys: boolean;
  /** Offer "Not now" (the queue); the event sheet leaves the question standing instead. */
  declare skippable: boolean;
  private _readyAt = 0;

  constructor() {
    super();
    this.question = null;
    this.roster = [];
    this.hotkeys = false;
    this.skippable = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._readyAt = performance.now() + INPUT_GUARD_MS;
  }

  /** Picks the button at `index`: what its number key does. */
  choose(index: number): void {
    const question = this.question;
    const option = question ? ateOptions(question.cats)[index] : undefined;
    if (question && option) this._choose(question, option);
  }

  private _choiceCat(name: string, index: number): ChoiceCat {
    return this.roster.find((cat) => cat.name === name) ?? { name, color: index, avatar: null };
  }

  private _choose(question: AteQuestion, option: AteOption): void {
    if (performance.now() < this._readyAt) return;
    const detail: AteChosenDetail = { visitUid: question.visitUid, ate: option.ate };
    this.dispatchEvent(new CustomEvent("ate-chosen", { detail, bubbles: true, composed: true }));
  }

  private _skip = (): void => {
    if (performance.now() < this._readyAt) return;
    this.dispatchEvent(new CustomEvent("ate-skipped", { bubbles: true, composed: true }));
  };

  render() {
    const question = this.question;
    if (!question) return nothing;
    const locale = this.hass?.locale?.language ?? this.hass?.language;
    const when = visitWhenLabel(question.start, new Date(), locale);
    return html`
      <section aria-labelledby="ask">
        <h3 id="ask">Who ate? <span class="when">${when}</span></h3>
        <div class="options">
          ${ateOptions(question.cats).map((option, index) => {
            const cats = option.ate.map((name) => this._choiceCat(name, question.cats.indexOf(name)));
            return html`<kibble-choice
              .hass=${this.hass}
              .cache=${this.cache}
              .label=${option.text}
              .cats=${cats}
              .hint=${this.hotkeys ? String(index + 1) : null}
              @click=${() => this._choose(question, option)}
            ></kibble-choice>`;
          })}
        </div>
        ${this.skippable ? html`<button type="button" class="later" @click=${this._skip}>Not now</button>` : nothing}
      </section>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
    }
    .when {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 400;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
    }
    .later {
      align-self: flex-start;
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .later:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-who-ate", KibbleWhoAte);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-who-ate": KibbleWhoAte;
  }
}
