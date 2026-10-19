/** The full-screen (phone) / large centred (wide) layer a photo-grid tile opens onto: one big
 * body crop at a time, `object-fit: contain` so nothing is ever cropped, a small round face-crop
 * inset when the sample has one, a "3 / 12" counter, and one chip row that corrects THIS one
 * photo -- every enrolled cat, "Not a cat", "Don't use" -- highlighted exactly like
 * `kibble-label-sheet`'s own identity row (a confirmed override gets the solid-fill check style,
 * a photo simply following the event's own confirmed cat gets the dashed "suggested" style, per
 * ux-spec.md section A.6). Choosing the event's own already-confirmed cat sends `"follow"`
 * (clears any override) instead of redundantly re-saving that same cat as one; anything else
 * saves the explicit label. A successful save pulses a check on the chip, then auto-advances to
 * the next photo after ~350ms (stays put on the last one) -- the whole reason this lives as its
 * own layer rather than inline in the grid: one photo, one decision, one quiet confirmation,
 * repeatable without a re-tap back into the grid every time.
 *
 * Fully self-contained as a dialog: owns its own Escape (closes just this layer, via
 * `viewer-close-requested` -- never the sheet's own `close-requested`), its own Tab focus trap
 * scoped to its own `renderRoot`, and its own ArrowLeft/ArrowRight + swipe navigation. The
 * parent sheet's global keydown handler defers to this component entirely while `open`, so the
 * two never fight over the same keystroke.
 *
 * Never touches a WS call itself: `sample-label-requested` bubbles (composed, so it crosses this
 * element's own shadow boundary and the sheet's) straight up to whichever parent card already
 * owns that request, exactly like every other action in this card set.
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { CatSummary, HomeAssistant, Sample, TimelineEvent } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { catColorAt } from "../styles/tokens";
import { fallbackCatColor } from "../lib/cat-colors";
import { boxInCrop, type OverlayBox } from "../lib/boxes";
import { mdiIcon } from "../lib/mdi-icons";
import "./kibble-image";
import "./kibble-avatar";
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

type ChipState = "confirmed" | "suggested" | "neutral";

export class KibblePhotoViewer extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    hass: { attribute: false },
    cache: { attribute: false },
    cats: { attribute: false },
    samples: { attribute: false },
    initialIndex: { type: Number },
    event: { attribute: false },
    busyUid: { attribute: false },
    error: { type: String },
    showBoxes: { type: Boolean },
    _index: { state: true },
    _justSavedUid: { state: true },
  };

  declare open: boolean;
  declare hass: HomeAssistant | undefined;
  declare cache: ImageUrlCache | undefined;
  declare cats: CatSummary[];
  declare samples: Sample[];
  /** Which photo to open on -- read once, the instant `open` flips true. */
  declare initialIndex: number;
  /** The sheet's own event summary -- only its `identity`/`cat` matter here, for the
   * follow-vs-override choice. */
  declare event: TimelineEvent | null;
  /** The one sample uid currently mid-save, or `null` -- shared with the grid, sourced from the
   * same parent state every other save in this sheet already uses. */
  declare busyUid: string | null;
  declare error: string | null;
  declare showBoxes: boolean;

  private _index = 0;
  /** Which chip choice is mid-save for the CURRENT photo, or `null` -- distinct from `busyUid`
   * (a sample uid) so the spinner lands on the exact tapped option, not just "some chip". */
  private _pendingOption: string | null = null;
  private _justSavedUid: string | null = null;
  private _justSavedTimer: ReturnType<typeof setTimeout> | undefined;
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
    this.event = null;
    this.busyUid = null;
    this.error = null;
    this.showBoxes = true;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._justSavedTimer);
    clearTimeout(this._advanceTimer);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      this._index = this.initialIndex;
      this._justSavedUid = null;
      this._pendingOption = null;
    }
    if (changed.has("busyUid")) {
      const previous = changed.get("busyUid") as string | null | undefined;
      this._pendingOption = null; // the spinner stops the instant a save settles, success or not
      if (previous && this.busyUid === null && !this.error && this.samples[this._index]?.uid === previous) {
        this._flashSaved(previous);
      }
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) this._closeRef.value?.focus();
  }

  private _flashSaved(uid: string): void {
    clearTimeout(this._justSavedTimer);
    this._justSavedUid = uid;
    this._justSavedTimer = setTimeout(() => {
      this._justSavedUid = null;
    }, SAVED_PULSE_MS);
    clearTimeout(this._advanceTimer);
    this._advanceTimer = setTimeout(() => {
      if (this._index < this.samples.length - 1) this._go(1);
    }, AUTO_ADVANCE_MS);
  }

  private _go(delta: number): void {
    const next = this._index + delta;
    if (next < 0 || next >= this.samples.length) return;
    this._index = next;
    this._justSavedUid = null;
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
    const tone = name === "not_a_cat" ? "not-cat" : name && name !== "skip" ? "cat" : "unknown";
    const cat = tone === "cat" ? this.cats.find((candidate) => candidate.name === name) : null;
    return [
      { key: "sample:" + sample.uid, box: ownBox, tone, label: name && name !== "not_a_cat" && name !== "skip" ? name : tone === "not-cat" ? "Not a cat" : "Who?", color: name && name !== "not_a_cat" && name !== "skip" ? this._catColor(name) : undefined, avatar: cat?.avatar ?? null },
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
    const busy = this.busyUid !== null;
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
            ${sample.body && sample.box && sample.crop ? html`<button type="button" class="box-toggle" aria-pressed=${this.showBoxes} aria-label=${this.showBoxes ? "Hide boxes" : "Show boxes"} @click=${this._requestBoxesVisibility}>${mdiIcon(this.showBoxes ? "eye" : "eyeOff")}</button>` : nothing}
            ${faceInset ? html`<span class="face-inset"><kibble-image .hass=${this.hass} .asset=${faceInset} .cache=${this.cache} alt="" rounded></kibble-image></span>` : nothing}
            <button type="button" class="nav prev" aria-label="Previous photo" ?disabled=${this._index === 0} @click=${() => this._go(-1)}>
              <span class="chevron chevron-left">${mdiIcon("chevronDown")}</span>
            </button>
            <button type="button" class="nav next" aria-label="Next photo" ?disabled=${this._index === total - 1} @click=${() => this._go(1)}>
              <span class="chevron chevron-right">${mdiIcon("chevronDown")}</span>
            </button>
          </div>
          <div class="chip-row" role="group" aria-label="Who is this, in this photo">
            ${this.cats.map((cat) => this._renderChoice(cat.name, cat, sample, busy))}
            ${this._renderChoice("not_a_cat", null, sample, busy)}
            ${this._renderChoice("skip", null, sample, busy)}
          </div>
          ${this.error ? html`<p class="viewer-error">${this.error}</p>` : nothing}
        </div>
      </div>
    `;
  }

  private _choiceState(option: string, sample: Sample): ChipState {
    if (option === "skip") return sample.review === "skip" ? "confirmed" : "neutral";
    if (sample.review !== null) return sample.review === option ? "confirmed" : "neutral";
    if (sample.label === option) return "suggested";
    return "neutral";
  }

  private _renderChoice(option: string, cat: CatSummary | null, sample: Sample, rowBusy: boolean) {
    const state = this._choiceState(option, sample);
    const pending = rowBusy && this.busyUid === sample.uid && this._pendingOption === option;
    const justSaved = this._justSavedUid === sample.uid && state === "confirmed";
    const label = cat ? cat.name : option === "skip" ? "Don\u2019t use" : "Not a cat";
    return html`
      <button
        type="button"
        class="choice choice-${state}"
        aria-pressed=${state === "confirmed"}
        style=${cat ? `--chip-color:${this._catColor(cat.name)}` : ""}
        ?disabled=${rowBusy}
        @click=${() => this._choose(option, sample)}
      >
        <span class="choice-glyph">
          ${option === "skip"
            ? mdiIcon("eyeOff")
            : cat
              ? html`<kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar>`
              : html`<kibble-avatar .name=${null}></kibble-avatar>`}
          ${pending
            ? html`<span class="choice-spinner">${mdiIcon("refresh")}</span>`
            : state === "confirmed"
              ? html`<span class="choice-check ${justSaved ? "just-saved" : ""}">${mdiIcon("check")}</span>`
              : nothing}
        </span>
        <span class="choice-label">${label}</span>
      </button>
    `;
  }

  private _choose(option: string, sample: Sample): void {
    const follows = this.event?.identity === "reviewed" && this.event.cat === option;
    this._pendingOption = option;
    this.dispatchEvent(
      new CustomEvent("sample-label-requested", { detail: { sampleUid: sample.uid, label: follows ? "follow" : option }, bubbles: true, composed: true }),
    );
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
      font-size: 13px;
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
    /* The chip row is its own solid HA-theme surface, deliberately distinct from the black
     * photo-viewing chrome above it (image on top, flexing; chips beneath, never overlapping)
     * -- the theme tokens are what keep the labels legible in both light and dark, exactly like
     * every other chip in this card set, rather than a fixed light-on-dark scheme that only
     * worked against a black backdrop. */
    .chip-row {
      flex-shrink: 0;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 10px 12px max(10px, env(safe-area-inset-bottom));
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .choice {
      flex: 1 1 0;
      min-width: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px 2px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 11px;
      cursor: pointer;
      min-height: 44px;
    }
    .choice:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .choice-suggested {
      border-style: dashed;
      border-color: var(--chip-color, var(--secondary-text-color));
      background: none;
    }
    .choice-confirmed {
      border-color: var(--chip-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--chip-color, var(--secondary-text-color)) 18%, transparent);
    }
    .choice-glyph {
      position: relative;
      width: 30px;
      height: 30px;
    }
    .choice-glyph kibble-avatar {
      --kibble-avatar-size: 30px;
    }
    .choice-glyph > svg {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      color: var(--secondary-text-color);
      padding: 6px;
      box-sizing: border-box;
    }
    .choice-check,
    .choice-spinner {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .choice-spinner {
      background: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      color: #fff;
    }
    @media (prefers-reduced-motion: no-preference) {
      .choice-spinner svg {
        animation: kibble-viewer-spin 0.9s linear infinite;
      }
      .choice-check.just-saved {
        animation: kibble-viewer-pop 400ms ease;
      }
    }
    @keyframes kibble-viewer-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-viewer-pop {
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
    .choice-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .viewer-error {
      flex-shrink: 0;
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.25);
      color: #ffb4ac;
      font-size: 13px;
    }
    .box-toggle:focus-visible,
    .close:focus-visible,
    .nav:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
    .choice:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
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
