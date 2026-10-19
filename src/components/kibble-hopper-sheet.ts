/** The hopper detail sheet: opened by tapping either tank tile on the bowl (`kibble-bowl.ts`'s
 * `hopper-detail-requested` event), it shows both hoppers' full state plus the "mark hopper
 * full" actions -- the hardware equivalent of double-pressing the feeder's own side button.
 * Same controlled-overlay contract as every dialog in this repo: the parent owns `open`, this
 * only ever asks to close (`close-requested`). Pressing a "mark full" button presses the
 * matching `button.*_hopper_N_full` entity directly (fire-and-forget, like every other button
 * entity this card presses) and shows a short local confirmation -- there is no daemon
 * round-trip to await, so the confirmation is the only signal the operator gets that the tap
 * landed.
 */

import { LitElement, css, html, nothing, unsafeCSS, type PropertyValues } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { hopperViews, hopperAriaLabel, hopperDisplayName, foodForHopper, type HopperLevel, type HopperRemaining, type HopperView } from "../lib/hopper-status";
import { hopperTank, TANK_STYLES } from "../lib/hopper-glyph";
import { fireHaptic } from "../lib/haptics";
import { mdiIcon } from "../lib/mdi-icons";
import type { HomeAssistant } from "../types";
import type { KibbleEntities } from "../lib/resolve-entities";

/** How long the "Marked full" confirmation stays up before a button reverts to its normal
 * label -- long enough to read, short enough that a second, deliberate mark isn't blocked. */
const CONFIRM_MS = 1100;

type MarkTarget = "1" | "2" | "both";

export class KibbleHopperSheet extends LitElement {
  static properties = {
    hass: { attribute: false },
    entities: { attribute: false },
    open: { type: Boolean, reflect: true },
    hopperLevel1: { attribute: false },
    hopperLevel2: { attribute: false },
    hopperRemaining1: { attribute: false },
    hopperRemaining2: { attribute: false },
    singleHopper: { type: Boolean },
    food1: { type: String },
    food2: { type: String },
    _confirmed: { state: true },
  };

  declare hass: HomeAssistant;
  declare entities: KibbleEntities | undefined;
  declare open: boolean;
  declare hopperLevel1: HopperLevel | null;
  declare hopperLevel2: HopperLevel | null;
  declare hopperRemaining1: HopperRemaining | null;
  declare hopperRemaining2: HopperRemaining | null;
  declare singleHopper: boolean;
  /** The operator's own name for each hopper's food (dual mode only) -- `null` when unnamed. */
  declare food1: string | null;
  declare food2: string | null;
  declare _confirmed: MarkTarget | null;

  private _closeButtonRef = createRef<HTMLButtonElement>();
  private _confirmTimer: number | undefined;

  private _keydownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) this._close();
  };

  constructor() {
    super();
    this.open = false;
    this.hopperLevel1 = null;
    this.hopperLevel2 = null;
    this.hopperRemaining1 = null;
    this.hopperRemaining2 = null;
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
    this._confirmed = null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._confirmTimer);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("open") && this.open) {
      clearTimeout(this._confirmTimer);
      this._confirmed = null;
      this._closeButtonRef.value?.focus();
    }
  }

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  };

  private _entityFor(target: MarkTarget): string | undefined {
    if (target === "1") return this.entities?.markFullHopper1;
    if (target === "2") return this.entities?.markFullHopper2;
    return this.entities?.markFullBoth;
  }

  private _markFull(target: MarkTarget): void {
    const entityId = this._entityFor(target);
    if (!entityId) return;
    this.hass.callService("button", "press", {}, { entity_id: entityId });
    clearTimeout(this._confirmTimer);
    this._confirmed = target;
    fireHaptic("success");
    this._confirmTimer = window.setTimeout(() => {
      this._confirmed = null;
      this.requestUpdate();
    }, CONFIRM_MS);
  }

  render() {
    if (!this.open) return nothing;
    const hoppers = hopperViews(this.singleHopper, this.hopperLevel1, this.hopperLevel2, this.hopperRemaining1, this.hopperRemaining2);
    const canMarkAny = Boolean(this.entities?.markFullHopper1 || this.entities?.markFullHopper2 || this.entities?.markFullBoth);

    return html`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.singleHopper ? "Hopper" : "Hoppers"}>
        <div class="sheet" @click=${(event: Event) => event.stopPropagation()}>
          <header>
            <span>${this.singleHopper ? "Hopper" : "Hoppers"}</span>
            <button type="button" class="icon-button" ${ref(this._closeButtonRef)} @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          <div class="body">
            ${hoppers.map((view) => this._renderRow(view, foodForHopper(view.index, this.food1, this.food2)))}
            ${canMarkAny
              ? html`
                  <div class="actions">
                    ${this.singleHopper
                      ? this._renderMarkButton("both", "Mark hopper full", this.entities?.markFullBoth, "primary")
                      : html`
                          ${this._renderMarkButton("1", "Mark hopper 1 full", this.entities?.markFullHopper1)}
                          ${this._renderMarkButton("2", "Mark hopper 2 full", this.entities?.markFullHopper2)}
                          ${this._renderMarkButton("both", "Mark both full", this.entities?.markFullBoth, "primary")}
                        `}
                  </div>
                  <p class="hint">
                    Tip: press the small button on the side of the feeder twice to mark
                    ${this.singleHopper ? "the hopper" : "both hoppers"} full.
                  </p>
                `
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private _renderRow(view: HopperView, food: string | null) {
    const name = hopperDisplayName(view, food);
    const label = hopperAriaLabel(view, food);
    return html`
      <div class="hopper-row" data-tone=${view.tone} aria-label=${label}>
        <span class="hopper-row-glyph">${hopperTank(view)}</span>
        <div class="hopper-row-text">
          <span class="hopper-row-name">${name}</span>
          <span class="hopper-row-word">${view.tone === "unknown" ? "Level unknown" : view.headline}</span>
          ${view.detail ? html`<span class="hopper-row-detail">${view.detail}</span>` : nothing}
        </div>
      </div>
    `;
  }

  private _renderMarkButton(target: MarkTarget, label: string, entityId: string | undefined, variant?: "primary") {
    const confirmed = this._confirmed === target;
    return html`
      <button
        type="button"
        class="mark-button ${variant ?? ""} ${confirmed ? "confirmed" : ""}"
        ?disabled=${!entityId || confirmed}
        @click=${() => this._markFull(target)}
      >
        ${confirmed ? html`<span class="mark-check">${mdiIcon("check")}</span><span>Marked full</span>` : label}
      </button>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 400px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 16px;
      font-weight: 600;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .body {
      padding: 4px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .hopper-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    /* Reuses the hero tile's own material tokens -- the sheet has no bowl of its own to compute
       them from, so it borrows the same theme-derived plastic look via inherited custom
       properties set on :host below. */
    .tank {
      display: block;
      width: 30px;
      height: 40px;
      overflow: visible;
      flex: none;
    }
    ${unsafeCSS(TANK_STYLES)}
    .hopper-row-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }
    .hopper-row-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      /* A food name can run longer than "Hopper N" ever does -- .hopper-row-text above is
         already min-width: 0, the enabler this ellipsis needs inside the flex row. */
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hopper-row-word {
      font-size: 15px;
      font-weight: 700;
    }
    .hopper-row[data-tone="low"] .hopper-row-word {
      color: var(--kibble-amber-dark);
    }
    .hopper-row[data-tone="empty"] .hopper-row-word {
      color: var(--error-color, #db4437);
    }
    .hopper-row-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 4px;
    }
    .mark-button {
      position: relative;
      min-height: 46px;
      border-radius: 10px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: transform 0.12s ease;
    }
    .mark-button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .mark-button.primary {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .mark-button:disabled {
      cursor: default;
    }
    .mark-button:disabled:not(.confirmed) {
      opacity: 0.45;
    }
    .mark-button.confirmed {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      opacity: 1;
      animation: hopper-mark-pulse 700ms ease-out;
    }
    .mark-check {
      display: inline-flex;
      font-size: 16px;
      animation: hopper-check-in 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .hint {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    @media (prefers-reduced-motion: reduce) {
      .mark-button.confirmed {
        animation: none;
      }
      .mark-check {
        animation: none;
      }
    }
    @keyframes hopper-mark-pulse {
      from {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--kibble-feed, #43a96a) 55%, transparent);
      }
      to {
        box-shadow: 0 0 0 12px color-mix(in srgb, var(--kibble-feed, #43a96a) 0%, transparent);
      }
    }
    @keyframes hopper-check-in {
      from {
        transform: scale(0.3);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
}

customElements.define("kibble-hopper-sheet", KibbleHopperSheet);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-hopper-sheet": KibbleHopperSheet;
  }
}
