/** The one big physical-feeling action on the card. `variant="feed"` requires a press-and-hold
 * (the anti-accident lock for a touchscreen a cat can step on); `variant="cancel"` fires on a
 * plain tap, because making an emergency stop harder to reach would be the wrong tradeoff.
 */

import { LitElement, css, html } from "lit";
import { HOLD_TO_FEED_MS } from "../styles/tokens";

/** How long the completed bar stays full while fading out, before the feed's own animation
 * takes over. Long enough to register as "done", short enough not to delay the dispense. */
const SETTLE_MS = 220;
/** A released hold loses its progress this fast -- brisk, so an accidental touch clears. */
const RETRACT_MS = 160;

export class KibbleHoldButton extends LitElement {
  static properties = {
    label: { type: String },
    variant: { type: String },
    disabled: { type: Boolean },
    holdMs: { type: Number, attribute: "hold-ms" },
  };

  declare label: string;
  declare variant: "feed" | "cancel";
  declare disabled: boolean;
  declare holdMs: number;

  private _holding = false;
  private _holdTimer: number | undefined = undefined;
  /** The fill's own animation, driven here rather than by a CSS class.
   *
   * A class-driven transition cannot express "run to the end, then finish" -- dropping the
   * class at completion transitions the bar BACK to zero, so a completed hold rewound like a
   * cancelled one and read as undoing the very thing it had just committed to. With the
   * animation owned here, completion plays a short settle and the bar is reset with no
   * transition at all, which is what "ends cleanly" means. */
  private _fillAnimation: Animation | null = null;
  /** The bright leading edge, animated alongside the fill and in the same timing so the two
   * never drift apart mid-sweep. */
  private _edgeAnimation: Animation | null = null;

  constructor() {
    super();
    this.label = "Hold to feed";
    this.variant = "feed";
    this.disabled = false;
    this.holdMs = HOLD_TO_FEED_MS;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._holdTimer);
  }

  render() {
    return html`
      <button
        type="button"
        class="button ${this.variant} ${this._holding ? "holding" : ""}"
        ?disabled=${this.disabled}
        style=${this.variant === "feed" ? `--hold-ms: ${this.holdMs}ms` : ""}
        @pointerdown=${this.variant === "feed" ? this._startHold : undefined}
        @pointerup=${this.variant === "feed" ? this._cancelHold : undefined}
        @pointerleave=${this.variant === "feed" ? this._cancelHold : undefined}
        @pointercancel=${this.variant === "feed" ? this._cancelHold : undefined}
        @click=${this.variant === "cancel" ? this._tapActivate : undefined}
      >
        ${this.variant === "feed" ? html`<span class="fill"><span class="edge"></span></span>` : ""}
        <span class="label">${this.label}</span>
      </button>
    `;
  }

  private get _fill(): HTMLElement | null {
    return this.renderRoot?.querySelector?.(".fill") ?? null;
  }

  private _startHold = (event: PointerEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    this._holding = true;
    this.requestUpdate();
    clearTimeout(this._holdTimer);

    const fill = this._fill;
    const edge = this.renderRoot?.querySelector?.(".edge") as HTMLElement | null;
    this._fillAnimation?.cancel();
    this._edgeAnimation?.cancel();
    if (fill?.animate) {
      // The edge travels the button's real width in pixels: a percentage translate would be
      // a percentage of the 3 px edge itself, which goes nowhere.
      const width = fill.getBoundingClientRect().width;
      if (edge?.animate && width > 0) {
        this._edgeAnimation = edge.animate(
          [{ transform: "translateX(0)" }, { transform: `translateX(${width}px)` }],
          { duration: this.holdMs, easing: "linear", fill: "forwards" },
        );
      }
      // The bar IS the timer as far as the eye is concerned, so it runs for exactly holdMs
      // and linearly -- an eased progress bar lies about how much longer you must hold.
      this._fillAnimation = fill.animate(
        [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }],
        { duration: this.holdMs, easing: "linear", fill: "forwards" },
      );
    }
    this._holdTimer = setTimeout(() => this._complete(), this.holdMs) as unknown as number;
  };

  /** The hold reached the end: settle the bar, reset it, and start the feed. */
  private _complete(): void {
    this._holding = false;
    this.requestUpdate();
    this._edgeAnimation?.cancel();
    this._edgeAnimation = null;
    const fill = this._fill;
    if (fill?.animate) {
      // Full-width and fading, never rewinding: the bar completed, it was not cancelled.
      const settle = fill.animate(
        [
          { clipPath: "inset(0 0% 0 0)", opacity: 1, filter: "brightness(1)" },
          { clipPath: "inset(0 0% 0 0)", opacity: 0, filter: "brightness(1.25)" },
        ],
        { duration: SETTLE_MS, easing: "ease-out", fill: "forwards" },
      );
      this._fillAnimation = settle;
      settle.finished
        .then(() => {
          // Back to a clean zero with no transition, so the next hold starts from empty
          // rather than sliding back from wherever this one left it.
          settle.cancel();
          this._fillAnimation?.cancel();
          this._fillAnimation = null;
        })
        .catch(() => {
          /* cancelled by a new hold; that hold owns the bar now */
        });
    }
    this._activate();
  }

  private _cancelHold = (): void => {
    clearTimeout(this._holdTimer);
    if (!this._holding) return;
    this._holding = false;
    this.requestUpdate();
    const fill = this._fill;
    const from = this._fillAnimation;
    this._fillAnimation = null;
    if (!fill?.animate) {
      from?.cancel();
      return;
    }
    // Retract from wherever the finger let go, quickly -- a released hold should visibly
    // lose its progress, which is the opposite of the completion above.
    const reached = getComputedStyle(fill).clipPath;
    from?.cancel();
    this._edgeAnimation?.cancel();
    this._edgeAnimation = null;
    const retract = fill.animate(
      [{ clipPath: reached && reached !== "none" ? reached : "inset(0 0% 0 0)" }, { clipPath: "inset(0 100% 0 0)" }],
      { duration: RETRACT_MS, easing: "ease-out", fill: "forwards" },
    );
    retract.finished.then(() => retract.cancel()).catch(() => {});
  };

  private _tapActivate(): void {
    if (this.disabled) return;
    this._activate();
  }

  private _activate(): void {
    this.dispatchEvent(new CustomEvent("activate", { bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: block;
    }
    .button {
      position: relative;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border: none;
      /* Fully rounded: the primary action should read as one confident pill, matching the
         segmented picker above it. */
      border-radius: 999px;
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      transition: transform 0.08s ease, box-shadow 0.15s ease;
      box-shadow: 0 1px 2px color-mix(in srgb, var(--kibble-amber-dark) 35%, transparent);
    }
    .button:active:not(:disabled) {
      transform: scale(0.985);
      box-shadow: none;
    }
    .button.cancel {
      background: color-mix(in srgb, var(--kibble-amber-dark) 12%, transparent);
      color: var(--kibble-amber-dark);
      box-shadow: none;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-text-color);
      outline-offset: 2px;
    }
    /* No transition and no class-driven keyframes: the component animates this element
       directly so completion and cancellation can differ (settle vs retract). A CSS
       transition here would fight those animations for the same property. */
    /* Clipped rather than scaled: a scaled fill stretches whatever rides on it, and the
       leading edge below has to keep its width to read as an edge. No CSS transition here --
       the component animates this element directly so a completed hold can settle while a
       released one retracts. */
    .fill {
      position: absolute;
      inset: 0;
      clip-path: inset(0 100% 0 0);
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--kibble-amber-dark) 88%, #000) 0%,
        var(--kibble-amber-dark) 55%,
        color-mix(in srgb, var(--kibble-amber-dark) 82%, #fff) 100%
      );
    }
    /* The bright line at the head of the sweep -- the detail that makes it read as filling
       rather than as a block changing size. Anchored left and moved by the component in step
       with the clip: the clip hides this element's own right edge until the sweep completes,
       so pinning it to the right made the glow appear only in the final frame, i.e. never. */
    .edge {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 3px;
      transform: translateX(0);
      background: color-mix(in srgb, #fff 70%, var(--kibble-amber));
      box-shadow: 0 0 10px 2px color-mix(in srgb, #fff 45%, var(--kibble-amber));
    }
    .label {
      position: relative;
      z-index: 1;
    }
  `;
}

customElements.define("kibble-hold-button", KibbleHoldButton);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-hold-button": KibbleHoldButton;
  }
}
