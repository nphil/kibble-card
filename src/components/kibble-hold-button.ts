/** The one big physical-feeling action on the card. `variant="feed"` requires a press-and-hold
 * (the anti-accident lock for a touchscreen a cat can step on); `variant="cancel"` fires on a
 * plain tap, because making an emergency stop harder to reach would be the wrong tradeoff.
 *
 * The hold gesture itself is driven entirely by `lib/hold-progress.ts`'s pure state machine --
 * this file's only job is wiring real pointer/keyboard events and a `requestAnimationFrame` loop
 * to it, and painting what that state means. The visual language is the "sigil seal": a small
 * emblem (a circle, two triangles, eight dots) that draws itself as you hold, a colour that steps
 * through three tiers -- teal, violet, gold -- at the hold's own stage thresholds, rising tension
 * (a glow and a tremble) in the final approach, and on completion a soft flash, the emblem
 * flaring gently, and the pill turning gold with a check. Releasing early drains the fill back
 * out on a fast ease-out, never an instant snap, and never fires anything.
 *
 * Every tier crossing and the completion both also pulse a soft glow that hugs the pill's own
 * rounded silhouette a few pixels past its edge -- the toned-down descendant of what used to be
 * a hard shock ring plus a canvas of flying star/glyph particles. There is no more unclipped
 * canvas: the glow is one small `<span>` painted entirely with a `box-shadow`, coloured by
 * blending the current tier against the theme's own accent colour (`--accent-color` /
 * `--primary-color`) and the pill's own surface via `color-mix`, so it reads as native chrome in
 * both a light and a dark theme rather than a foreign saturated overlay.
 *
 * Only the emblem's rings/triangles/dots need per-frame JS: everything else (the fill wash, the
 * leading edge, the ambient glow, the tension tremble, the shock glow, the completion flash and
 * flare) is a CSS custom property, a class toggle, or a short CSS keyframe -- there is nothing
 * left that paints outside the pill by more than about 8-10px, and nothing that needs the host
 * to reserve large overflow space for it.
 *
 * `variant="cancel"` gets the same raised-pill resting treatment and a native `:active` press
 * sink (it is a tap, not a hold, so there is no charge state to drive it from JS) plus one small
 * scale pulse and a soft themed flash on tap -- deliberately much less than `feed` gets, since an
 * emergency stop should read as simple and certain, not celebratory.
 *
 * Every continuous per-frame paint touches only CSS custom properties, `strokeDashoffset`, and
 * class lists -- nothing here ever reads or writes layout-triggering properties (width/height/
 * offsetX and friends) inside the animation loop. `prefers-reduced-motion` drops every purely
 * decorative *motion* (the emblem's spin, the shock glow's growth keyframe, the tier/completion
 * flash and flare, the tension tremble) but keeps the glow itself: a tier crossing or completion
 * still shows a brief, static (non-animated) glow instead of nothing, alongside the fill level,
 * the discrete colour tiers, the emblem's own progress-drawing, and the checkmark's opacity-only
 * fade -- progress stays fully legible and events are still felt, just calm.
 */

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { HOLD_TO_FEED_MS } from "../styles/tokens";
import {
  DEFAULT_HOLD_CONFIG,
  HOLD_IDLE,
  holdMarkStagesFired,
  holdNearComplete,
  holdNewlyCrossedStages,
  holdPress,
  holdProgress,
  holdRelease,
  holdTick,
  type HoldConfig,
  type HoldState,
} from "../lib/hold-progress";
import { fireHaptic } from "../lib/haptics";
import { mdiIcon } from "../lib/mdi-icons";

/** How long the checkmark stays up after a completed hold before yielding back to whatever
 * label the parent is now passing (by then almost always "Requesting…" -- this is just the
 * floor so a same-tick prop update can't make the checkmark flash for one frame). */
const SETTLE_MS = 600;
/** How long a reduced-motion "static" glow -- shown instead of the keyframe pulse for a tier
 * crossing -- stays lit before clearing itself. There is no keyframe driving it (reduced motion
 * gets the glow with none of the growth), so this timer is the only thing that turns it off. */
const STATIC_GLOW_MS = 260;
/** Same idea for completion's static glow: lingers a little longer so it is still visible
 * alongside the checkmark settling in, rather than winking out before the user has registered
 * the hold finished. */
const STATIC_GLOW_COMPLETE_MS = 450;
/** The emblem's inset from the button's own left/top/bottom edges, in CSS px -- mirrored in
 * `static styles` (`.emblem { left: ... }`) so the two can never drift apart. */
const EMBLEM_INSET_PX = 6;

/** The sigil's three discrete tiers -- teal, violet, gold -- stepped through at
 * `DEFAULT_HOLD_CONFIG.stageThresholds`. Drives the fill, the leading edge, the emblem, and (
 * blended toward the theme's own accent colour) the soft glow that hugs the pill on a tier
 * crossing or completion. This button no longer renders food at all (that lives entirely in
 * `kibble-bowl.ts` now). */
const TIER_COLORS = ["#34d3c3", "#9b87f5", "#f7c948"] as const;

/** Standard cubic ease-out: fast at the start, settling in gently -- the drain's own curve, not
 * `hold-progress.ts`'s (that module hands back the raw linear countdown; easing it is a
 * presentation choice this file owns, not the state machine's business). */
function easeOutCubic(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

export class KibbleHoldButton extends LitElement {
  static properties = {
    label: { type: String },
    variant: { type: String },
    disabled: { type: Boolean },
    holdMs: { type: Number, attribute: "hold-ms" },
    pending: { type: Boolean },
  };

  declare label: string;
  declare variant: "feed" | "cancel";
  declare disabled: boolean;
  declare holdMs: number;
  /** True while the parent is waiting for the real feeder to confirm a request this button's
   * own hold already completed locally -- see `lib/feed-request.ts`. Draws a slow, gentle
   * breathing pulse on the emblem so the pill reads as "still working on it" rather than dead,
   * without claiming progress it cannot honestly show (there is nothing to charge toward: the
   * hold already finished). Meaningful for `variant="feed"` only; the parent is expected to
   * pair it with `disabled` so a fresh hold cannot start mid-request. */
  declare pending: boolean;

  private _holdState: HoldState = HOLD_IDLE;
  private _config: HoldConfig = DEFAULT_HOLD_CONFIG;
  private _pointerId: number | null = null;
  private _rafId: number | null = null;
  private _lastFrameMs = 0;
  private _reducedMotion = false;
  private _completed = false;
  private _settleTimer: number | undefined;
  private _staticGlowTimer: number | undefined;

  private _buttonRef = createRef<HTMLButtonElement>();
  private _tapFlashRef = createRef<HTMLSpanElement>();
  private _shockRef = createRef<HTMLSpanElement>();
  private _ringRef = createRef<SVGCircleElement>();
  private _triangle1Ref = createRef<SVGPolygonElement>();
  private _triangle2Ref = createRef<SVGPolygonElement>();
  private _dotRefs: Ref<SVGCircleElement>[] = Array.from({ length: 8 }, () => createRef<SVGCircleElement>());

  constructor() {
    super();
    this.label = "Hold to feed";
    this.variant = "feed";
    this.disabled = false;
    this.holdMs = HOLD_TO_FEED_MS;
    this.pending = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopChargeLoop();
    clearTimeout(this._settleTimer);
    clearTimeout(this._staticGlowTimer);
    this._holdState = HOLD_IDLE;
    this._pointerId = null;
  }

  protected firstUpdated(): void {
    this._paintProgress(0);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("disabled") && this.disabled) this._release();
    if (changed.has("holdMs")) this._config = { ...DEFAULT_HOLD_CONFIG, durationMs: this._duration() };
  }

  private _duration(): number {
    return Number.isFinite(this.holdMs) && this.holdMs > 0 ? this.holdMs : HOLD_TO_FEED_MS;
  }

  private _prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }

  private _emblemTemplate() {
    const dots = this._dotRefs.map((dotRef, index) => {
      const angle = (index / this._dotRefs.length) * Math.PI * 2;
      const cx = (24 + Math.cos(angle) * 21).toFixed(2);
      const cy = (24 + Math.sin(angle) * 21).toFixed(2);
      return svg`<circle ${ref(dotRef)} class="dot" cx=${cx} cy=${cy} r="1.8"></circle>`;
    });
    return svg`
      <svg viewBox="0 0 48 48">
        <circle class="ring-static" cx="24" cy="24" r="21"></circle>
        <g class="spin">
          <circle ${ref(this._ringRef)} class="stroke" cx="24" cy="24" r="21" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle>
          <g class="dots">${dots}</g>
        </g>
        <g class="spin2">
          <polygon ${ref(this._triangle1Ref)} class="stroke" points="24,8 37.9,32 10.1,32" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></polygon>
          <polygon ${ref(this._triangle2Ref)} class="stroke" points="24,40 10.1,16 37.9,16" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></polygon>
        </g>
        <circle class="core" cx="24" cy="24" r="3"></circle>
      </svg>
    `;
  }

  render() {
    const isFeed = this.variant === "feed";
    const phase = this._holdState.phase;
    const classes = [
      "button",
      isFeed ? "feed" : "cancel",
      phase === "charging" ? "holding" : "",
      this._completed ? "completed" : "",
      isFeed && this.pending ? "pending" : "",
      this._reducedMotion ? "reduced-motion" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const accessibleLabel = phase === "charging" ? `${this.label}. Keep holding to continue.` : this.label;

    return html`
      <div class="frame">
        <button
          type="button"
          ${ref(this._buttonRef)}
          class=${classes}
          aria-label=${accessibleLabel}
          ?disabled=${this.disabled}
          @pointerdown=${isFeed ? this._onPointerDown : undefined}
          @pointerup=${isFeed ? this._onPointerUp : undefined}
          @pointerleave=${isFeed ? this._onPointerUp : undefined}
          @pointercancel=${isFeed ? this._onPointerUp : undefined}
          @lostpointercapture=${isFeed ? this._onPointerUp : undefined}
          @keydown=${isFeed ? this._onKeyDown : undefined}
          @keyup=${isFeed ? this._onKeyUp : undefined}
          @blur=${isFeed ? this._onBlur : undefined}
          @click=${isFeed ? undefined : this._tapActivate}
          @contextmenu=${this._suppressOsGesture}
          @selectstart=${this._suppressOsGesture}
          @dragstart=${this._suppressOsGesture}
        >
          ${isFeed
            ? html`
                <span class="clip"><span class="fill"></span><span class="edge"></span></span>
                <span class="emblem">${this._emblemTemplate()}</span>
                <span class="shock" ${ref(this._shockRef)} aria-hidden="true"></span>
                <span class="flash" aria-hidden="true"></span>
                <span class="label">
                  <span class="label-text">${this.label}</span>
                  <span class="label-check" aria-hidden="true">${mdiIcon("check")}</span>
                </span>
              `
            : html`<span class="tap-flash" ${ref(this._tapFlashRef)} aria-hidden="true"></span>
                <span class="label"><span class="label-text">${this.label}</span></span>`}
        </button>
      </div>
    `;
  }

  // ---- Press / release entry points (pointer and keyboard share the same core) ----

  private _onPointerDown = (event: PointerEvent): void => {
    if (this.disabled || this._holdState.phase === "charging") return;
    event.preventDefault();
    const button = event.currentTarget as HTMLButtonElement;
    try {
      button.setPointerCapture(event.pointerId);
      this._pointerId = event.pointerId;
    } catch {
      // Pointer capture is optional (e.g. a synthetic event in a test harness).
    }
    this._begin();
  };

  private _onPointerUp = (event: PointerEvent): void => {
    if (this._pointerId !== null && event.pointerId !== this._pointerId) return;
    this._release();
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== " " && event.key !== "Enter") return;
    if (event.repeat) return; // OS key-repeat must not restart/redouble the charge
    if (this.disabled || this._holdState.phase === "charging") return;
    event.preventDefault();
    this._begin();
  };

  private _onKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== " " && event.key !== "Enter") return;
    this._release();
  };

  private _onBlur = (): void => {
    this._release();
  };

  private _begin(): void {
    this._reducedMotion = this._prefersReducedMotion();
    this._config = { ...DEFAULT_HOLD_CONFIG, durationMs: this._duration() };
    this._holdState = holdPress();
    this._completed = false;
    clearTimeout(this._settleTimer);
    this.requestUpdate();
    this._paintProgress(0);
    this._lastFrameMs = performance.now();
    this._stopChargeLoop();
    this._rafId = requestAnimationFrame(this._chargeFrame);
  }

  private _release(): void {
    this._releasePointerCapture();
    this._pointerId = null;
    if (this._holdState.phase !== "charging") return;
    this._holdState = holdRelease(this._holdState, this._config);
    this.requestUpdate();
    // The frame loop is already running (started by `_begin`); draining is handled by the same
    // `_chargeFrame` loop via `holdTick`, so there is nothing further to kick off here.
  }

  private _releasePointerCapture(): void {
    const id = this._pointerId;
    const button = this._buttonRef.value;
    if (id === null || !button) return;
    try {
      if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
    } catch {
      // Capture can already be gone after pointercancel or a detached render.
    }
  }

  /** Cancels the browser's own long-press handling so the gesture belongs to this button. */
  private _suppressOsGesture = (event: Event): void => {
    event.preventDefault();
  };

  private _tapActivate = (): void => {
    if (this.disabled) return;
    if (!this._prefersReducedMotion()) this._playTapPulse();
    this._activate();
  };

  private _playTapPulse(): void {
    const button = this._buttonRef.value;
    const flash = this._tapFlashRef.value;
    button?.classList.remove("tap-pulse");
    flash?.classList.remove("flash-pulse");
    // Force a reflow so re-adding the classes restarts both keyframes even for a rapid second
    // tap before the first pulse finished.
    void button?.offsetWidth;
    button?.classList.add("tap-pulse");
    flash?.classList.add("flash-pulse");
  }

  private _activate(): void {
    this.dispatchEvent(new CustomEvent("activate", { bubbles: true, composed: true }));
  }

  // ---- The charge/drain animation loop ----

  private _stopChargeLoop(): void {
    if (this._rafId != null) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  /** 0..1 fill to actually paint. Charging/idle/completed pass `holdProgress` straight through;
   * draining eases it (fast start, gentle settle) so a cancelled hold reads as a deliberate
   * release, not a value simply snapping to zero. */
  private _displayProgress(): number {
    const raw = holdProgress(this._holdState, this._config);
    if (this._holdState.phase !== "draining" || this._config.drainMs <= 0) return raw;
    const releaseProgress = this._holdState.releaseProgress;
    if (releaseProgress <= 0) return 0;
    const drained = Math.min(1, this._holdState.elapsedMs / this._config.drainMs);
    return releaseProgress * (1 - easeOutCubic(drained));
  }

  /** Which of the three tiers (teal/violet/gold) the current progress has reached. */
  private _tierColor(progress: number): string {
    let index = 0;
    for (const threshold of this._config.stageThresholds) {
      if (progress >= threshold) index += 1;
    }
    return TIER_COLORS[Math.min(index, TIER_COLORS.length - 1)]!;
  }

  private _chargeFrame = (nowMs: number): void => {
    const deltaMs = Math.min(48, nowMs - this._lastFrameMs);
    this._lastFrameMs = nowMs;
    const previousPhase = this._holdState.phase;
    this._holdState = holdTick(this._holdState, deltaMs, this._config);

    const crossed = holdNewlyCrossedStages(this._holdState, this._config);
    if (crossed.length > 0) {
      this._holdState = holdMarkStagesFired(this._holdState, crossed);
      this._onStagesCrossed();
    }

    this._paintProgress(this._displayProgress());

    if (previousPhase !== "completed" && this._holdState.phase === "completed") {
      this._onCompleted();
      return;
    }
    if (this._holdState.phase === "charging" || this._holdState.phase === "draining") {
      this._rafId = requestAnimationFrame(this._chargeFrame);
    } else {
      this._rafId = null;
      this.requestUpdate();
    }
  };

  /** Writes the current progress straight to the DOM: the pill's `--p`/`--c` custom properties
   * (drive the CSS fill wash, edge line, and ambient glow), the emblem's ring/triangle
   * `strokeDashoffset` (the "drawing itself" effect), its eight dots lighting up in turn, and
   * the tension tremble class. Called every animation frame plus a couple of fixed points
   * (press start, settle) so the emblem is never left mid-frame. */
  private _paintProgress(rawProgress: number): void {
    const button = this._buttonRef.value;
    if (!button) return;
    const progress = Math.max(0, Math.min(1, rawProgress));
    const tierColor = this._tierColor(progress);
    button.style.setProperty("--p", progress.toFixed(4));
    button.style.setProperty("--c", tierColor);
    const trembling = holdNearComplete(this._holdState, this._config) && !this._reducedMotion;
    button.classList.toggle("tense", trembling);

    const segment = (from: number, to: number) => Math.max(0, Math.min(1, (progress - from) / (to - from)));
    const dashOffset = (drawn: number) => (100 - drawn * 100).toFixed(2);
    this._ringRef.value?.setAttribute("stroke-dashoffset", dashOffset(segment(0, 0.45)));
    this._triangle1Ref.value?.setAttribute("stroke-dashoffset", dashOffset(segment(0.3, 0.7)));
    this._triangle2Ref.value?.setAttribute("stroke-dashoffset", dashOffset(segment(0.6, 0.95)));
    this._dotRefs.forEach((dotRef, index) => {
      dotRef.value?.classList.toggle("lit", progress >= (index + 1) / (this._dotRefs.length + 1));
    });
  }

  private _onStagesCrossed(): void {
    fireHaptic("light");
    this._pulseShock(false);
  }

  /** Retriggers the shock glow's CSS animation (or, under reduced motion, its static
   * equivalent) via a forced reflow, so a fresh pulse -- another tier, or completion right on
   * the heels of the third tier -- always restarts from scratch instead of being a no-op
   * because the class was already present. `intense` is completion's slightly brighter,
   * longer-lingering variant of the same glow; everything else (colour, duration under full
   * motion) is shared with a tier crossing's own pulse. */
  private _pulseShock(intense: boolean): void {
    const shock = this._shockRef.value;
    if (!shock) return;
    clearTimeout(this._staticGlowTimer);
    shock.classList.remove("go", "static");
    shock.classList.toggle("complete", intense);
    void shock.offsetWidth;
    if (this._reducedMotion) {
      shock.classList.add("static");
      this._staticGlowTimer = window.setTimeout(
        () => shock.classList.remove("static", "complete"),
        intense ? STATIC_GLOW_COMPLETE_MS : STATIC_GLOW_MS,
      );
      return;
    }
    shock.classList.add("go");
  }

  private _onCompleted(): void {
    this._releasePointerCapture();
    this._pointerId = null;
    this._completed = true;
    this.requestUpdate();
    fireHaptic("success");
    this._pulseShock(true);
    this._activate();
    this._settleTimer = window.setTimeout(() => {
      this._completed = false;
      this._holdState = HOLD_IDLE;
      this._paintProgress(0);
      this.requestUpdate();
    }, SETTLE_MS);
  }

  static styles = css`
    :host {
      display: block;
      /* The pill sits on the card, not floating free of it: base/edge/text all derive from the
       * card's own theme variables, mixed so the pill reads as slightly raised in both a dark
       * and a light theme rather than only working for the one it was tuned against. */
      --kibble-pill-surface: var(--ha-card-background, var(--card-background-color, #1e2533));
      --kibble-pill-ink: var(--primary-text-color, #eef2f7);
      --kibble-pill-edge: var(--divider-color, color-mix(in srgb, var(--kibble-pill-ink) 16%, transparent));
    }
    .frame {
      position: relative;
      display: block;
    }
    .button {
      position: relative;
      z-index: 1;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      isolation: isolate;
      /* Not clipped: the shock glow and the emblem's completion flare both need to bloom a few
       * pixels past the pill's own rounded edge. Only .clip (the fill + edge line) is cropped. */
      overflow: visible;
      cursor: pointer;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      outline: none;
      font: inherit;
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      background: color-mix(in srgb, var(--kibble-pill-surface) 92%, var(--kibble-pill-ink) 8%);
      border: 1px solid var(--kibble-pill-edge);
      color: var(--kibble-pill-ink);
      --kibble-glow: color-mix(
        in srgb,
        color-mix(in srgb, var(--c, #34d3c3) 60%, var(--accent-color, var(--primary-color, #34d3c3)) 40%) 82%,
        var(--kibble-pill-surface) 18%
      );
      box-shadow:
        0 1px 0 0 rgba(255, 255, 255, 0.14) inset,
        0 3px 10px 0 rgba(0, 0, 0, 0.16),
        0 0 calc(var(--p, 0) * 9px) color-mix(in srgb, var(--kibble-glow) calc(var(--p, 0) * 45%), transparent);
      transition: transform 140ms cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 200ms ease, background 160ms ease, color 160ms ease;
    }
    .button.holding {
      transform: scale(0.975);
    }
    .button.tense {
      animation: kibble-seal-tense 80ms linear infinite;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .button.completed {
      background: linear-gradient(135deg, #f2c14e, #f6da8a);
      border-color: transparent;
      color: #2a1d00;
      animation: kibble-seal-pop 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .clip {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden;
    }
    .fill {
      position: absolute;
      inset: 0;
      transform-origin: left;
      transform: scaleX(var(--p, 0));
      background: linear-gradient(90deg, color-mix(in srgb, var(--c, #34d3c3) 16%, transparent), color-mix(in srgb, var(--c, #34d3c3) 46%, transparent));
    }
    .button.completed .fill {
      background: transparent;
    }
    .edge {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(var(--p, 0) * 100% - 1px);
      width: 3px;
      background: var(--c, #34d3c3);
      box-shadow: 0 0 9px 2px var(--c, #34d3c3);
      opacity: calc(min(0.85, var(--p, 0) * 6));
    }
    .button.completed .edge {
      opacity: 0;
    }
    .emblem {
      position: absolute;
      left: ${EMBLEM_INSET_PX}px;
      top: 50%;
      transform: translateY(-50%);
      width: calc(var(--kibble-feed-button-height, 56px) - ${EMBLEM_INSET_PX * 2}px);
      height: calc(var(--kibble-feed-button-height, 56px) - ${EMBLEM_INSET_PX * 2}px);
      z-index: 2;
      pointer-events: none;
    }
    .emblem svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .ring-static {
      fill: none;
      stroke: currentColor;
      stroke-opacity: 0.16;
      stroke-width: 1.5;
    }
    .stroke {
      fill: none;
      stroke: var(--c, #34d3c3);
      stroke-width: 1.8;
      filter: drop-shadow(0 0 1.8px var(--c, #34d3c3));
    }
    .spin {
      transform-origin: 24px 24px;
      animation: kibble-seal-spin 8s linear infinite;
    }
    .spin2 {
      transform-origin: 24px 24px;
      animation: kibble-seal-spin 5s linear infinite reverse;
    }
    .button.holding .spin {
      animation-duration: 1.6s;
    }
    .button.holding .spin2 {
      animation-duration: 1.2s;
    }
    .dots .dot {
      fill: color-mix(in srgb, currentColor 22%, transparent);
      transition: fill 140ms ease;
    }
    .dots .dot.lit {
      fill: currentColor;
    }
    .core {
      fill: var(--c, #34d3c3);
    }
    .button.completed .emblem {
      animation: kibble-seal-flare 700ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .button.pending .emblem {
      animation: kibble-seal-pulse 1.8s ease-in-out infinite;
    }
    .shock {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      box-shadow: 0 0 0 0 transparent;
      pointer-events: none;
    }
    .shock.go {
      animation: kibble-seal-shock 560ms cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    .shock.go.complete {
      animation-name: kibble-seal-shock-complete;
    }
    .shock.static {
      opacity: 0.3;
      box-shadow: 0 0 6px 2px var(--kibble-glow, #34d3c3);
    }
    .shock.static.complete {
      opacity: 0.4;
      box-shadow: 0 0 7px 2px var(--kibble-glow, #34d3c3);
    }
    .flash {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: color-mix(in srgb, var(--kibble-glow, #f7c948) 70%, white 30%);
      opacity: 0;
      pointer-events: none;
      z-index: 3;
    }
    .button.completed .flash {
      animation: kibble-seal-flash 480ms ease-out;
    }
    .button.cancel {
      --kibble-glow: color-mix(in srgb, var(--accent-color, var(--primary-color, #34d3c3)) 78%, var(--kibble-pill-surface) 22%);
      transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 140ms ease;
    }
    .button.cancel:active {
      transform: scale(0.97);
    }
    .tap-flash {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: color-mix(in srgb, var(--kibble-glow, var(--primary-color, #34d3c3)) 65%, white 25%);
      opacity: 0;
      pointer-events: none;
    }
    .tap-flash.flash-pulse {
      animation: kibble-tap-flash 260ms ease-out;
    }
    .button.tap-pulse {
      animation: kibble-tap-pulse 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .label {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 100%;
      user-select: none;
      -webkit-user-select: none;
      pointer-events: none;
    }
    /* Nudged right of true-centre by the emblem's own footprint, so the text optically balances
     * against it instead of sitting dead-centre and crowding it. Cancel has no emblem. */
    .button.feed .label {
      padding-left: calc(${EMBLEM_INSET_PX}px + (var(--kibble-feed-button-height, 56px) - ${EMBLEM_INSET_PX * 2}px) + 8px);
    }
    .label-text {
      transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .label-check {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35em;
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .button.completed .label-text {
      opacity: 0;
      transform: scale(0.85);
    }
    .button.completed .label-check {
      opacity: 1;
      transform: scale(1);
    }
    @media (prefers-reduced-motion: reduce) {
      .button {
        transition: box-shadow 160ms ease, background 160ms ease, color 160ms ease;
      }
      .button.holding,
      .button.cancel:active {
        transform: none;
      }
      .button.tense,
      .spin,
      .spin2,
      .button.completed,
      .button.completed .emblem,
      .button.pending .emblem,
      .shock.go,
      .button.completed .flash,
      .tap-flash.flash-pulse,
      .button.tap-pulse {
        animation: none;
      }
      .label-text,
      .label-check {
        transition: opacity 180ms ease;
        transform: none !important;
      }
    }
    @keyframes kibble-seal-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-seal-tense {
      0% {
        translate: 0 0;
      }
      25% {
        translate: -1px 0.5px;
      }
      50% {
        translate: 1px -0.5px;
      }
      75% {
        translate: -0.5px -0.5px;
      }
      100% {
        translate: 0 0;
      }
    }
    @keyframes kibble-seal-shock {
      0% {
        opacity: 0.35;
        box-shadow: 0 0 0 0 var(--kibble-glow, #34d3c3);
      }
      60% {
        opacity: 0.28;
        box-shadow: 0 0 5px 1px var(--kibble-glow, #34d3c3);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 7px 2px var(--kibble-glow, #34d3c3);
      }
    }
    @keyframes kibble-seal-shock-complete {
      0% {
        opacity: 0.48;
        box-shadow: 0 0 1px 0 var(--kibble-glow, #f7c948);
      }
      55% {
        opacity: 0.4;
        box-shadow: 0 0 5px 2px var(--kibble-glow, #f7c948);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 6px 3px var(--kibble-glow, #f7c948);
      }
    }
    @keyframes kibble-seal-flash {
      0% {
        opacity: 0.32;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes kibble-seal-flare {
      0% {
        transform: translateY(-50%) scale(1);
      }
      40% {
        transform: translateY(-50%) scale(1.2);
      }
      100% {
        transform: translateY(-50%) scale(1);
      }
    }
    @keyframes kibble-seal-pulse {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.92;
      }
    }
    @keyframes kibble-seal-pop {
      0% {
        transform: scale(0.975);
      }
      45% {
        transform: scale(1.045);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-tap-pulse {
      0% {
        transform: scale(1);
      }
      40% {
        transform: scale(1.035);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-tap-flash {
      0% {
        opacity: 0;
      }
      30% {
        opacity: 0.16;
      }
      100% {
        opacity: 0;
      }
    }
  `;
}

customElements.define("kibble-hold-button", KibbleHoldButton);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-hold-button": KibbleHoldButton;
  }
}
