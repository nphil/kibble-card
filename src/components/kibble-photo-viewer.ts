/** The full-screen (phone) / large centred (wide) layer a photo-grid tile opens onto: one big
 * body crop at a time, `object-fit: contain` so nothing is ever cropped, a small round face-crop
 * inset when the sample has one, a "3 / 12" counter, and the same five answers the review queue
 * gives one photo: each enrolled cat, "Both in this photo" (only with two cats), "Not a cat" and
 * "Don't use". The photo's own answer is filled in; with none yet, Kibble's guess gets the dashed
 * "suggested" outline. "Undo" takes the answer back, so the photo follows its visit again. An
 * answer pulses a check on its button, then moves to the next photo after ~350ms (it stays put
 * on the last one): one photo, one decision, repeatable without a trip back to the grid.
 *
 * Fully self-contained as a dialog: owns its own Escape (closes just this layer, via
 * `viewer-close-requested` -- never the sheet's own `close-requested`), its own Tab focus trap
 * scoped to its own `renderRoot`, and its own ArrowLeft/ArrowRight + swipe navigation. The
 * parent sheet's global keydown handler defers to this component entirely while `open`, so the
 * two never fight over the same keystroke.
 *
 * Never touches a WS call itself: `sample-answer-requested` bubbles (composed, so it crosses this
 * element's own shadow boundary and the sheet's) straight up to the card that owns the answer
 * outbox, which saves it and hands back the updated `samples`.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { CatSummary, HomeAssistant, Sample } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { catColorAt } from "../styles/tokens";
import { fallbackCatColor } from "../lib/cat-colors";
import { boxInCrop, type OverlayBox } from "../lib/boxes";
import { mdiIcon } from "../lib/mdi-icons";
import { answerOptions, guessCaption, guessOptionId, optionIdForAnswer, photoTag } from "../lib/photo-answers";
import "./kibble-image";
import "./kibble-choice";
import "./kibble-box-overlay";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const AUTO_ADVANCE_MS = 350;
const SAVED_PULSE_MS = 700;
const SWIPE_MIN_PX = 48;

export class KibblePhotoViewer extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    cache: { attribute: false },
    cats: { attribute: false },
    samples: { attribute: false },
    initialIndex: { type: Number },
    showBoxes: { type: Boolean },
    _index: { state: true },
    _pulse: { state: true },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare cache: ImageUrlCache | undefined;
  declare cats: CatSummary[];
  declare samples: Sample[];
  /** Which photo to open on -- read once, the instant `open` flips true. */
  declare initialIndex: number;
  declare showBoxes: boolean;

  private _index = 0;
  /** The answer just given (photo uid and button id): that button pulses a check for a moment. */
  private _pulse: { uid: string; optionId: string } | null = null;
  private _pulseTimer: ReturnType<typeof setTimeout> | undefined;
  private _advanceTimer: ReturnType<typeof setTimeout> | undefined;
  private _closeRef = createRef<HTMLButtonElement>();
  private _touchStartX = 0;
  private _touchStartY = 0;

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      this._requestClose();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this._go(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this._go(1);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...this.renderRoot.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
    if (focusable.length === 0) {
      event.preventDefault();
      this._closeRef.value?.focus();
      return;
    }
    const active = this.renderRoot.querySelector<HTMLElement>(":focus");
    const currentIndex = active ? focusable.indexOf(active) : -1;
    const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
      event.preventDefault();
      (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
    }
  };

  constructor() {
    super();
    this.open = false;
    this.cats = [];
    this.samples = [];
    this.initialIndex = 0;
    this.showBoxes = true;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._pulseTimer);
    clearTimeout(this._advanceTimer);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._index = this.initialIndex;
      this._pulse = null;
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) this._closeRef.value?.focus();
  }

  private _go(delta: number): void {
    const next = this._index + delta;
    if (next < 0 || next >= this.samples.length) return;
    this._index = next;
    this._pulse = null;
  }

  private _requestClose = (): void => {
    this.dispatchEvent(new CustomEvent("viewer-close-requested", { bubbles: true, composed: true }));
  };

  private _onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  };

  private _onTouchEnd = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - this._touchStartX;
    const dy = touch.clientY - this._touchStartY;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    this._go(dx < 0 ? 1 : -1);
  };

  private _catColor(name: string): string {
    const cat = this.cats.find((c) => c.name === name);
    return cat ? catColorAt(cat.color) : fallbackCatColor(name);
  }

  private _photoOverlayBoxes(sample: Sample): OverlayBox[] {
    if (!sample.body || !sample.box || !sample.crop) return [];
    const ownBox = boxInCrop(sample.box, sample.crop);
    if (!ownBox) return [];
    const name = sample.label ?? sample.guess;
    const named = name !== null && name !== "not_a_cat" && name !== "skip" && name !== "both" ? name : null;
    const tone = named ? "cat" : name === "not_a_cat" ? "not-cat" : "unknown";
    const cat = named ? this.cats.find((candidate) => candidate.name === named) : null;
    return [
      { key: "sample:" + sample.uid, box: ownBox, tone, label: named ?? (tone === "not-cat" ? "Not a cat" : "Who?"), color: named ? this._catColor(named) : undefined, avatar: cat?.avatar ?? null },
      ...sample.peers.flatMap((peer, index) => {
        const box = boxInCrop(peer, sample.crop!);
        return box ? [{ key: "peer:" + sample.uid + ":" + index, box, tone: "peer" as const }] : [];
      }),
    ];
  }

  private _requestBoxesVisibility = (): void => {
    this.dispatchEvent(new CustomEvent("boxes-visibility-requested", { detail: { visible: !this.showBoxes }, bubbles: true, composed: true }));
  };

  render() {
    if (!this.open) return nothing;
    const sample = this.samples[this._index];
    if (!sample) return nothing;
    const total = this.samples.length;
    const image = sample.body ?? sample.face;
    const faceInset = sample.body && sample.face ? sample.face : null;
    const tag = photoTag(sample);
    return html`
      <div class="scrim" role="dialog" aria-modal="true" aria-label=${`Photo ${this._index + 1} of ${total}`} @click=${this._requestClose}>
        <div class="panel" @click=${(e: Event) => e.stopPropagation()} @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
          <div class="panel-top">
            <span class="counter">${this._index + 1} / ${total}</span>
            <button type="button" class="close" ${ref(this._closeRef)} aria-label="Close photo" @click=${this._requestClose}>${mdiIcon("close")}</button>
          </div>
          <div class="stage">
            ${image
              ? html`<div class="image-frame"><kibble-image .hass=${this.hass} .asset=${image} .cache=${this.cache} alt="" fit="contain"></kibble-image>${sample.body && this.showBoxes ? html`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(sample)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>` : nothing}</div>`
              : nothing}
            ${tag ? html`<span class="tag">${tag.text}</span>` : nothing}
            ${sample.body && sample.box && sample.crop ? html`<button type="button" class="box-toggle" aria-pressed=${this.showBoxes} aria-label=${this.showBoxes ? "Hide boxes" : "Show boxes"} @click=${this._requestBoxesVisibility}>${mdiIcon(this.showBoxes ? "eye" : "eyeOff")}</button>` : nothing}
            ${faceInset ? html`<span class="face-inset"><kibble-image .hass=${this.hass} .asset=${faceInset} .cache=${this.cache} alt="" rounded></kibble-image></span>` : nothing}
            <button type="button" class="nav prev" aria-label="Previous photo" ?disabled=${this._index === 0} @click=${() => this._go(-1)}>
              <span class="chevron chevron-left">${mdiIcon("chevronDown")}</span>
            </button>
            <button type="button" class="nav next" aria-label="Next photo" ?disabled=${this._index === total - 1} @click=${() => this._go(1)}>
              <span class="chevron chevron-right">${mdiIcon("chevronDown")}</span>
            </button>
          </div>
          ${this._renderAnswers(sample)}
        </div>
      </div>
    `;
  }

  private _renderAnswers(sample: Sample) {
    const options = answerOptions(this.cats);
    const answered = optionIdForAnswer(sample.review);
    const guessed = sample.review === null ? guessOptionId(sample, options) : null;
    return html`
      <div class="answers">
        <div class="chip-row" role="group" aria-label="Who is in this photo?">
          ${options.map((option) => {
            const state = option.id === answered ? "selected" : option.id === guessed ? "suggested" : "neutral";
            const cats = option.kind === "cat" ? this.cats.filter((cat) => cat.name === option.cat) : option.kind === "both" ? this.cats : [];
            return html`<kibble-choice
              .hass=${this.hass}
              .cache=${this.cache}
              .label=${option.text}
              .cats=${cats}
              .icon=${option.kind === "not_a_cat" ? "cancel" : option.kind === "skip" ? "eyeOff" : null}
              .state=${state}
              .caption=${state === "suggested" ? guessCaption(sample) : option.hint}
              .pop=${this._pulse?.uid === sample.uid && this._pulse.optionId === option.id}
              @click=${() => this._answer(sample, option.value, option.id)}
            ></kibble-choice>`;
          })}
        </div>
        ${sample.review !== null ? html`<button type="button" class="undo" @click=${() => this._answer(sample, "follow", null)}>${mdiIcon("undo")}<span>Undo</span></button>` : nothing}
      </div>
    `;
  }

  /** One tap: the answer goes up to the card that saves it, the chosen button pulses a check, and
   * the viewer moves on to the next photo. Undo stays on the photo it takes back. */
  private _answer(sample: Sample, label: string, optionId: string | null): void {
    this.dispatchEvent(new CustomEvent("sample-answer-requested", { detail: { sampleUid: sample.uid, label }, bubbles: true, composed: true }));
    clearTimeout(this._pulseTimer);
    clearTimeout(this._advanceTimer);
    if (optionId === null) {
      this._pulse = null;
      return;
    }
    this._pulse = { uid: sample.uid, optionId };
    this._pulseTimer = setTimeout(() => {
      this._pulse = null;
    }, SAVED_PULSE_MS);
    this._advanceTimer = setTimeout(() => {
      if (this._index < this.samples.length - 1) this._go(1);
    }, AUTO_ADVANCE_MS);
  }
  static styles = css`
    :host {
      display: contents;
    }
    .scrim {
      position: fixed;
      inset: 0;
      z-index: 1100;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: stretch;
      justify-content: center;
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .scrim {
        align-items: center;
        padding: 24px;
      }
    }
    .panel {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      background: #000;
      overflow: hidden;
    }
    @media (min-width: 600px) {
      .panel {
        width: min(720px, 92vw);
        max-height: min(760px, 92vh);
        border-radius: 16px;
      }
    }
    .panel-top {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: max(12px, env(safe-area-inset-top)) 12px 8px;
    }
    .counter {
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      color: rgba(255, 255, 255, 0.75);
    }
    .close {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .stage {
      position: relative;
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
    }
    .stage kibble-image {
      width: 100%;
      height: 100%;
    }
    .image-frame {
      position: relative;
      flex: 0 1 auto;
      width: min(100%, 62vh);
      max-height: 100%;
      aspect-ratio: 1;
    }
    .image-frame kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box-toggle {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 8;
      top: 8px;
      right: 20px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      font: inherit;
      cursor: pointer;
      backdrop-filter: blur(8px);
    }
    .box-toggle svg {
      width: 22px;
      height: 22px;
    }
    .face-inset {
      position: absolute;
      left: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    .face-inset kibble-image {
      width: 100%;
      height: 100%;
    }
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
    }
    .nav:disabled {
      opacity: 0.25;
      cursor: default;
    }
    .nav.prev {
      left: 12px;
    }
    .nav.next {
      right: 12px;
    }
    .chevron-left {
      display: inline-flex;
      transform: rotate(90deg);
    }
    .chevron-right {
      display: inline-flex;
      transform: rotate(-90deg);
    }
    /* The answers sit on their own solid HA-theme surface, distinct from the black photo
     * chrome above (image on top, flexing; answers beneath, never overlapping), so the shared
     * answer buttons read the same here as everywhere else in light and dark. */
    .answers {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding-bottom: max(8px, env(safe-area-inset-bottom));
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .chip-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 12px 12px 4px;
    }
    .chip-row kibble-choice {
      flex: 1 1 0;
      min-width: 96px;
    }
    .undo {
      align-self: flex-start;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 0 12px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .undo:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .tag {
      position: absolute;
      z-index: 8;
      top: 8px;
      left: 16px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
    }
    .box-toggle:focus-visible,
    .close:focus-visible,
    .nav:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-photo-viewer", KibblePhotoViewer);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-photo-viewer": KibblePhotoViewer;
  }
}
