/** The one answer button every "who is this?" surface uses: the review queue, the event sheet's
 * identity row and the photo viewer. A cat shows its real avatar in its own colour; "Both"
 * shows the cats overlapped; the rest show a glyph. Three visible states, the same everywhere:
 * `neutral`, `suggested` (Kibble's own guess: dashed outline) and `selected` (a person's
 * answer: solid outline, tint and a check). The press feel, focus ring and 48px minimum target
 * live here once.
 *
 * It renders a real `<button>` in its shadow root and delegates focus to it, so the host can
 * be focused, clicked and listened to like a button.
 */

import { LitElement, css, html, nothing } from "lit";
import type { CatSummary, HomeAssistant } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { catColorAt } from "../styles/tokens";
import { mdiIcon, type MdiIconName } from "../lib/mdi-icons";
import "./kibble-avatar";

export type ChoiceState = "neutral" | "suggested" | "selected";
export type ChoiceCat = Pick<CatSummary, "name" | "color" | "avatar">;

export class KibbleChoice extends LitElement {
  static shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static properties = {
    hass: { attribute: false },
    cache: { attribute: false },
    label: { type: String },
    cats: { attribute: false },
    icon: { type: String },
    state: { type: String, reflect: true },
    hint: { type: String },
    caption: { type: String },
    disabled: { type: Boolean, reflect: true },
    busy: { type: Boolean },
    pop: { type: Boolean },
  };

  declare hass: HomeAssistant | undefined;
  declare cache: ImageUrlCache | undefined;
  declare label: string;
  /** The cat this answer names, or several for "Both". Empty for a glyph answer. */
  declare cats: ChoiceCat[];
  /** The glyph for an answer that names no cat. */
  declare icon: MdiIconName | null;
  declare state: ChoiceState;
  /** The key that picks this answer; shown only where a keyboard is likely. */
  declare hint: string | null;
  /** One short extra line, such as the guess's "81%". */
  declare caption: string | null;
  declare disabled: boolean;
  declare busy: boolean;
  /** Plays the check's pop once: set right after a save lands. */
  declare pop: boolean;

  constructor() {
    super();
    this.label = "";
    this.cats = [];
    this.icon = null;
    this.state = "neutral";
    this.hint = null;
    this.caption = null;
    this.disabled = false;
    this.busy = false;
    this.pop = false;
  }

  render() {
    const color = this.cats.length === 1 ? catColorAt(this.cats[0]!.color) : null;
    return html`
      <button type="button" class=${this.state} aria-pressed=${this.state === "selected"} ?disabled=${this.disabled} style=${color ? `--choice-color:${color}` : ""}>
        <span class="picture ${this.cats.length > 1 ? "several" : ""}">
          ${this.cats.length
            ? this.cats.slice(0, 3).map((cat) => html`<kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar>`)
            : html`<span class="glyph">${this.icon ? mdiIcon(this.icon) : nothing}</span>`}
          ${this.busy
            ? html`<span class="badge spinner">${mdiIcon("refresh")}</span>`
            : this.state === "selected"
              ? html`<span class="badge check ${this.pop ? "pop" : ""}">${mdiIcon("check")}</span>`
              : nothing}
        </span>
        <span class="text">
          <span class="label">${this.label}</span>
          ${this.caption ? html`<span class="caption">${this.caption}</span>` : nothing}
        </span>
        ${this.hint ? html`<kbd aria-hidden="true">${this.hint}</kbd>` : nothing}
      </button>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-width: 0;
      /* The button lays itself out from the width its parent gives it (so the parent must give
         one: a grid or flex track): narrow shows the picture above the name, wide beside it. */
      container-type: inline-size;
    }
    button {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: var(--kibble-choice-height, 64px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px;
      border: 2px solid transparent;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      line-height: 1.2;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition:
        transform 90ms ease-out,
        background-color 150ms ease-out,
        border-color 150ms ease-out;
    }
    button:active:not(:disabled) {
      transform: scale(0.96);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @media (hover: hover) {
      button:hover:not(:disabled) {
        background: color-mix(in srgb, var(--choice-color, var(--primary-text-color)) 12%, transparent);
      }
    }
    button.suggested {
      border-style: dashed;
      border-color: var(--choice-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--choice-color, var(--secondary-text-color)) 10%, transparent);
    }
    button.selected {
      border-color: var(--choice-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--choice-color, var(--secondary-text-color)) 20%, transparent);
    }
    .picture {
      position: relative;
      display: flex;
      flex: none;
      --kibble-avatar-size: var(--kibble-choice-picture, 36px);
    }
    .picture.several kibble-avatar + kibble-avatar {
      margin-left: calc(var(--kibble-choice-picture, 36px) * -0.4);
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--ha-dialog-surface-background, var(--ha-card-background, var(--card-background-color, #fff)));
    }
    .glyph {
      width: var(--kibble-choice-picture, 36px);
      height: var(--kibble-choice-picture, 36px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: calc(var(--kibble-choice-picture, 36px) * 0.72);
      color: var(--secondary-text-color);
    }
    .badge {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      box-shadow: 0 0 0 2px var(--ha-dialog-surface-background, var(--ha-card-background, var(--card-background-color, #fff)));
    }
    .badge.spinner {
      background: var(--secondary-text-color);
      color: var(--card-background-color, #fff);
    }
    .text {
      min-width: 0;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .label {
      max-width: 100%;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .caption {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    kbd {
      display: none;
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 18px;
      box-sizing: border-box;
      padding: 1px 4px;
      border-radius: 4px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 24%, transparent);
      font: inherit;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    @container (min-width: 220px) {
      button {
        flex-direction: row;
        justify-content: flex-start;
        gap: 12px;
        padding: 8px 12px;
      }
      .text {
        align-items: flex-start;
        flex: 1;
      }
      kbd {
        position: static;
        flex: none;
      }
    }
    /* A key hint only helps where there is a keyboard: a fine pointer that can hover. */
    @media (hover: hover) and (pointer: fine) {
      kbd {
        display: block;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      .spinner svg {
        animation: kibble-choice-spin 0.9s linear infinite;
      }
      .check.pop {
        animation: kibble-choice-pop 400ms ease;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:active:not(:disabled) {
        transform: none;
      }
    }
    @keyframes kibble-choice-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-choice-pop {
      0% {
        transform: scale(0.4);
      }
      60% {
        transform: scale(1.25);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
}

customElements.define("kibble-choice", KibbleChoice);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-choice": KibbleChoice;
  }
}
