/** Horizontal segmented picker: up to five pill segments comfortably fit ~264px, inside a
 * ~300px desktop two-column right rail. Two faces of the hero share this one component instead
 * of two near-identical implementations: the 1-5 portion amount (`kibble-card`'s
 * `.picker-full`; 6-20 lives in the settings gear panel instead) and, in dual-hopper mode,
 * which side a feed targets ("Both" / hopper 1 / hopper 2, labelled with its food name once
 * one is set). No local state: the caller always owns `value` and supplies `options`, so the
 * picker can never drift from whatever entity or selection state it mirrors.
 */

import { LitElement, css, html } from "lit";

export interface SegmentOption {
  value: string;
  label: string;
}

export class KibbleSegmentedPicker extends LitElement {
  static properties = {
    value: { type: String },
    options: { attribute: false },
    groupLabel: { type: String, attribute: "group-label" },
    disabled: { type: Boolean },
    /** Segments size to their own label instead of splitting the row evenly -- for the hopper
     * choice, where "Both" and a long food name have no business being the same width. Unset
     * (the portion amount's plain digits) keeps the original equal-width segments. */
    contentFit: { type: Boolean, attribute: "content-fit" },
  };

  declare value: string;
  declare options: SegmentOption[];
  /** The `role="radiogroup"`'s accessible name -- the caller always supplies one, since a
   * generic default would be wrong for at least one of this component's two uses. */
  declare groupLabel: string;
  declare disabled: boolean;
  declare contentFit: boolean;

  constructor() {
    super();
    this.value = "";
    this.options = [];
    this.groupLabel = "";
    this.disabled = false;
    this.contentFit = false;
  }

  render() {
    return html`
      <div class="segments" role="radiogroup" aria-label=${this.groupLabel}>
        ${this.options.map(
          (option) => html`
            <button
              type="button"
              role="radio"
              aria-checked=${option.value === this.value}
              class="segment ${option.value === this.value ? "selected" : ""}"
              ?disabled=${this.disabled}
              @click=${() => this._select(option.value)}
            >
              <span class="segment-label">${option.label}</span>
            </button>
          `,
        )}
      </div>
    `;
  }

  private _select(value: string): void {
    this.dispatchEvent(new CustomEvent("option-selected", { detail: { value }, bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
    }
    .segments {
      display: flex;
      gap: 6px;
    }
    .segment {
      flex: 1 1 0;
      min-width: var(--kibble-touch-target, 48px);
      min-height: var(--kibble-touch-target, 48px);
      /* Pill radius and a soft translucent surface instead of a 2px outline: the convention
         Mushroom/Bubble-style dashboards settled on, and it stops a row of five segments
         reading as a table of boxes. */
      border-radius: 999px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.1;
      overflow: hidden;
      padding: 0 4px;
      box-sizing: border-box;
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease;
    }
    /* Segments size to their own label (a caller opts in for variable-length text, e.g. the
       hopper choice's "Both" vs. a food name) instead of splitting the row evenly -- "Both"
       stays narrow, a long food name gets the room it actually needs. Falls back to a smaller
       label size before ever truncating, since a name silently getting cut off is worse than a
       slightly smaller one staying whole. */
    :host([content-fit]) .segment {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0 14px;
    }
    @container (max-width: 300px) {
      :host([content-fit]) .segment-label {
        font-size: 13px;
      }
    }
    /* A text label (the hopper choice's "Both"/food names) can run longer than a single
       portion digit ever does -- truncated with an ellipsis rather than wrapping or blowing
       out the pill's fixed touch-target width. */
    .segment-label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Press feedback -- the small tactile detail that makes a touch panel feel native. */
    .segment:active:not(:disabled) {
      transform: scale(0.96);
    }
    .segment.selected {
      /* The selected portion belongs to the feed action, not to the food, so it carries the
         action colour -- an amber pill above a green button read as two unrelated controls.
         Fallback hex matches styles/tokens.ts's KIBBLE_FEED/KIBBLE_INK_ON_FEED: this picker
         is also used standalone (dev/parts.html) outside kibble-card's own :host scope,
         which is the only place these custom properties are otherwise ever set. */
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .segment:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .segment:focus-visible {
      outline: 2px solid var(--kibble-feed-dark, #2f8551);
      outline-offset: 2px;
    }
  `;
}

customElements.define("kibble-segmented-picker", KibbleSegmentedPicker);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-segmented-picker": KibbleSegmentedPicker;
  }
}
