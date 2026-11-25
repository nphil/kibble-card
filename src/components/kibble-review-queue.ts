/** The review queue: the one place visits get named. It opens as a native modal dialog (top
 * layer, so no theme can clip it), shows one visit per screen with its best photo, and takes
 * one tap, key or swipe per answer. The answer shows at once; saving happens behind it, one
 * request at a time, with a visible retry when one fails.
 *
 * The rules (ordering, answers, undo, the save line) are `lib/review-queue.ts`; the key and
 * swipe mapping is `lib/review-input.ts`. This file is the screen and the plumbing around them.
 *
 * A host card renders one instance, passes `hass`, `entryId`, `cats` and its `ImageUrlCache`,
 * and calls `show()` (optionally with the uid of the visit to start on). Every saved answer is
 * announced on `lib/review-bus.ts` so every Kibble card on the page refreshes.
 */

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { repeat } from "lit/directives/repeat.js";
import type { Asset, CatSummary, CatsResponse, EventDetail, HomeAssistant } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { ImagePreloader } from "../lib/image-preload";
import { fireHaptic } from "../lib/haptics";
import { mdiIcon } from "../lib/mdi-icons";
import { catSilhouette } from "../lib/brand-shapes";
import { labelSession } from "../lib/session-label";
import { describeWsError } from "../lib/ws-query";
import { visitWhenLabel } from "../lib/timeline";
import { nextReconnectDelay } from "../lib/reconnect";
import { announceReviewChange } from "../lib/review-bus";
import { loadTimelineVisits, loadUnknownVisits } from "../lib/review-source";
import { isSidewaysDrag, keyCommand, swipeCommit, swipeOptionId, swipeProgress, type ReviewCommand, type SwipeSide } from "../lib/review-input";
import {
  answerCurrent,
  answerOptionId,
  answerRequest,
  ateChoices,
  buildReviewItems,
  catAnswer,
  createQueue,
  currentItem,
  dismissGone,
  guessOptionId,
  isBatchBoundary,
  majorityGuess,
  markFailed,
  markSaved,
  markSaving,
  mergeItems,
  nextToSave,
  queueProgress,
  retryFailed,
  reviewOptions,
  reviewPhotos,
  saveCounts,
  severalAnswer,
  summarize,
  trainingGains,
  undoLast,
  upcomingItems,
  type ReviewAnswer,
  type ReviewItem,
  type ReviewOption,
  type ReviewQueueState,
} from "../lib/review-queue";
import { catColorAt } from "../styles/tokens";
import { KibbleChoice, type ChoiceCat, type ChoiceState } from "./kibble-choice";
import type { KibbleImage } from "./kibble-image";
import "./kibble-image";
import "./kibble-avatar";

const LEAVE_MS = 260;
const ANNOUNCE_DELAY_MS = 600;
const SAVE_TIMEOUT_MS = 20_000;
const FIRST_RETRY_MS = 2000;
const PRELOAD_AHEAD = 3;
const DETAIL_AHEAD = 2;
/** When to re-read the cats' photo counts for the summary: the server retrains in the
 * background, so the real gain lands a few seconds after the last answer. */
const GAIN_READ_DELAYS_MS = [0, 3000, 9000];

type Phase = "loading" | "error" | "ready";
type Stage = "review" | "batch" | "summary";
type View = Phase | Stage | "empty";
type LeaveSide = "left" | "right" | "up" | "down";

interface FollowUp {
  /** `pick`: choose which cats (three or more in the roster). `ate`: choose who ate. */
  mode: "pick" | "ate";
  cats: string[];
}

interface Leaving {
  item: ReviewItem;
  side: LeaveSide;
  label: string;
  cats: ChoiceCat[];
}

interface Swipe {
  id: number;
  x: number;
  y: number;
  lastX: number;
  lastT: number;
  velocity: number;
  sideways: boolean | null;
  armed: SwipeSide | null;
  el: HTMLElement;
  width: number;
}

export class KibbleReviewQueue extends LitElement {
  static properties = {
    hass: { attribute: false },
    entryId: { type: String },
    cats: { attribute: false },
    cache: { attribute: false },
    _open: { state: true },
    _phase: { state: true },
    _loadError: { state: true },
    _queue: { state: true },
    _stage: { state: true },
    _follow: { state: true },
    _photoIndex: { state: true },
    _scene: { state: true },
    _leaving: { state: true },
    _gains: { state: true },
    _imageFailed: { state: true },
    _ownCats: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  /** The roster as the host card knows it; the queue reads its own copy when this is empty. */
  declare cats: CatSummary[];
  declare cache: ImageUrlCache | undefined;

  private _open = false;
  private _phase: Phase = "loading";
  private _loadError: string | null = null;
  private _queue: ReviewQueueState | null = null;
  private _stage: Stage = "review";
  private _follow: FollowUp | null = null;
  private _photoIndex = 0;
  private _scene = false;
  private _leaving: Leaving | null = null;
  private _gains: Record<string, number> | null = null;
  private _imageFailed = false;
  private _ownCats: CatSummary[] = [];

  private _catsBefore: CatSummary[] | null = null;
  private readonly _details = new Map<string, EventDetail>();
  private readonly _detailsAsked = new Set<string>();
  private readonly _preloader = new ImagePreloader();
  private _generation = 0;
  private _leaveTimer: ReturnType<typeof setTimeout> | undefined;
  private _announceTimer: ReturnType<typeof setTimeout> | undefined;
  private _retryTimer: ReturnType<typeof setTimeout> | undefined;
  private _gainTimers: ReturnType<typeof setTimeout>[] = [];
  private _retryDelay = FIRST_RETRY_MS;
  private _connected = true;
  private _swipe: Swipe | null = null;
  private _dragged = false;
  private _focusedKey: string | null = null;

  constructor() {
    super();
    this.cats = [];
  }

  // ---- Public API ---------------------------------------------------------------------------

  /** Opens the queue. `startUid` is the visit to show first (a row the person tapped). */
  show(startUid?: string | null): void {
    if (this._open) return;
    this._open = true;
    this._stage = "review";
    this._follow = null;
    this._resetPhoto();
    this._gains = null;
    if (this._queue && this._unsaved() > 0) {
      // An earlier sitting left answers unsent: keep them, try again, and refresh what is left.
      this._queue = retryFailed(this._queue);
      this._phase = "ready";
      this._pump();
      void this._reload();
      return;
    }
    this._queue = null;
    this._details.clear();
    this._detailsAsked.clear();
    void this._load(startUid ?? null);
  }

  // ---- Lifecycle ----------------------------------------------------------------------------

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._leaveTimer);
    clearTimeout(this._announceTimer);
    clearTimeout(this._retryTimer);
    this._clearGainTimers();
    this._preloader.dispose();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!changed.has("hass")) return;
    const connected = this.hass?.connected !== false;
    if (connected && !this._connected && this._queue) {
      this._queue = retryFailed(this._queue);
      queueMicrotask(() => this._pump());
    }
    this._connected = connected;
  }

  protected updated(): void {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog && this._open && !dialog.open) dialog.showModal();
    if (dialog && !this._open && dialog.open) dialog.close();
    if (!this._open) {
      this._preloader.sync(undefined, undefined, []);
      return;
    }
    this._warmUp();
    void this._moveFocus();
  }

  // ---- Loading ------------------------------------------------------------------------------

  private async _load(startUid: string | null): Promise<void> {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    const generation = ++this._generation;
    this._loadError = null;
    if (!callWS || !entryId) {
      this._phase = "error";
      this._loadError = "Not connected.";
      return;
    }
    this._phase = "loading";
    void this._readCats(true);
    try {
      const unknown = await loadUnknownVisits(callWS, entryId);
      if (generation !== this._generation) return;
      const first = buildReviewItems(unknown.items, []);
      const startIsHere = !startUid || first.some((item) => item.key === startUid || item.event.uid === startUid);
      if (first.length > 0 && startIsHere) {
        this._queue = createQueue(first, startUid);
        this._phase = "ready";
      }
      const timeline = await loadTimelineVisits(callWS, entryId);
      if (generation !== this._generation) return;
      const all = buildReviewItems(unknown.items, timeline);
      this._queue = this._queue ? mergeItems(this._queue, all) : createQueue(all, startUid);
      this._phase = "ready";
    } catch (err) {
      if (generation !== this._generation) return;
      if (this._queue) {
        this._phase = "ready"; // the unknown visits loaded; carry on with those
      } else {
        this._phase = "error";
        this._loadError = describeWsError(err);
      }
    }
  }

  /** Re-reads the work list and folds it into the sitting in progress. */
  private async _reload(): Promise<void> {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    const generation = this._generation;
    try {
      const [unknown, timeline] = await Promise.all([loadUnknownVisits(callWS, entryId), loadTimelineVisits(callWS, entryId)]);
      if (generation !== this._generation || !this._queue) return;
      this._queue = mergeItems(this._queue, buildReviewItems(unknown.items, timeline));
    } catch {
      // The list on screen is still valid; the next reload gets another chance.
    }
  }

  private async _readCats(first: boolean): Promise<void> {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    const generation = this._generation;
    try {
      const response = (await callWS({ type: "kibble/cats", entry_id: entryId })) as CatsResponse;
      if (generation !== this._generation) return;
      this._ownCats = response.cats;
      if (first) this._catsBefore = response.cats;
      else if (this._catsBefore) this._gains = trainingGains(this._catsBefore, response.cats);
    } catch {
      // The summary simply shows visit counts without photo gains.
    }
  }

  private _roster(): CatSummary[] {
    return this.cats.length ? this.cats : this._ownCats;
  }

  private _options(): ReviewOption[] {
    return reviewOptions(this._roster());
  }

  /** Fetches the photo lists of the visit on screen and the next few, and keeps their pictures
   * warm so stepping forward never waits. */
  private _warmUp(): void {
    const queue = this._queue;
    const hass = this.hass;
    const entryId = this.entryId;
    const item = queue ? currentItem(queue) : null;
    if (!queue || !item || !hass?.callWS || !entryId) {
      this._preloader.sync(undefined, undefined, []);
      return;
    }
    const upcoming = upcomingItems(queue, PRELOAD_AHEAD);
    for (const wanted of [item, ...upcoming.slice(0, DETAIL_AHEAD)]) {
      if (this._detailsAsked.has(wanted.key)) continue;
      this._detailsAsked.add(wanted.key);
      const generation = this._generation;
      hass.callWS({ type: "kibble/event", entry_id: entryId, uid: wanted.event.uid }).then(
        (detail) => {
          if (generation !== this._generation) return;
          this._details.set(wanted.key, detail as EventDetail);
          this.requestUpdate();
        },
        () => {}, // browsing falls back to the one best photo
      );
    }
    const photos = reviewPhotos(item.event, this._details.get(item.key)?.samples ?? null);
    this._preloader.sync(hass, this.cache, [
      item.event.scene,
      ...photos.slice(0, 6),
      ...upcoming.map((next) => next.event.thumb ?? next.event.scene),
    ]);
  }

  // ---- Answers ------------------------------------------------------------------------------

  private _resetPhoto(): void {
    this._photoIndex = 0;
    this._scene = false;
    this._imageFailed = false;
  }

  private _choose(optionId: string, swipeSide?: SwipeSide): void {
    const queue = this._queue;
    const item = queue ? currentItem(queue) : null;
    if (!queue || !item || this._view() !== "review") return;
    const options = this._options();
    const option = options.find((candidate) => candidate.id === optionId);
    if (!option) return;
    const roster = this._roster();
    if (option.kind === "cat") {
      const index = roster.findIndex((cat) => cat.name === option.cat);
      const side: LeaveSide = swipeSide ?? (roster.length === 2 ? (index === 0 ? "left" : "right") : "up");
      this._commit(item, catAnswer(option.cat!, item.isMeal), side, option.label, roster.filter((cat) => cat.name === option.cat));
      return;
    }
    if (option.kind === "several") {
      const names = roster.map((cat) => cat.name);
      if (names.length > 2) this._follow = { mode: "pick", cats: [] };
      else if (item.isMeal) this._follow = { mode: "ate", cats: names };
      else this._commit(item, severalAnswer(names, [], false), "up", option.label, roster);
      return;
    }
    this._commit(item, { kind: option.kind }, "down", option.label, []);
  }

  private _togglePicked(name: string): void {
    const follow = this._follow;
    if (!follow || follow.mode !== "pick") return;
    const cats = follow.cats.includes(name) ? follow.cats.filter((cat) => cat !== name) : [...follow.cats, name];
    this._follow = { mode: "pick", cats };
  }

  private _finishPick(): void {
    const follow = this._follow;
    const item = this._queue ? currentItem(this._queue) : null;
    if (!follow || !item || follow.cats.length < 2) return;
    const roster = this._roster();
    const cats = roster.filter((cat) => follow.cats.includes(cat.name));
    if (item.isMeal) this._follow = { mode: "ate", cats: cats.map((cat) => cat.name) };
    else this._commit(item, severalAnswer(cats.map((cat) => cat.name), [], false), "up", "More than one", cats);
  }

  private _chooseAte(ate: string[]): void {
    const follow = this._follow;
    const item = this._queue ? currentItem(this._queue) : null;
    if (!follow || follow.mode !== "ate" || !item) return;
    const cats = this._roster().filter((cat) => follow.cats.includes(cat.name));
    this._commit(item, severalAnswer(follow.cats, ate, true), "up", follow.cats.length === 2 ? "Both" : "More than one", cats);
  }

  private _commit(item: ReviewItem, answer: ReviewAnswer, side: LeaveSide, label: string, cats: ChoiceCat[]): void {
    const queue = this._queue;
    if (!queue) return;
    this._leaving = { item, side, label, cats };
    clearTimeout(this._leaveTimer);
    this._leaveTimer = setTimeout(() => {
      this._leaving = null;
    }, LEAVE_MS);
    this._queue = answerCurrent(queue, answer);
    this._follow = null;
    this._resetPhoto();
    if (isBatchBoundary(this._queue)) {
      this._stage = "batch";
      fireHaptic("success");
      void this._reload();
    } else if (!currentItem(this._queue)) {
      this._enterSummary();
    } else {
      fireHaptic("light");
    }
    this._pump();
  }

  private _undo = (): void => {
    if (this._follow) {
      this._follow = null;
      return;
    }
    const queue = this._queue;
    if (!queue || queue.history.length === 0) return;
    clearTimeout(this._leaveTimer);
    this._leaving = null;
    this._queue = undoLast(queue);
    this._stage = "review";
    this._clearGainTimers();
    this._resetPhoto();
    fireHaptic("light");
  };

  private _keepGoing = (): void => {
    this._stage = "review";
    this._clearGainTimers();
  };

  private _enterSummary = (): void => {
    this._stage = "summary";
    this._follow = null;
    fireHaptic("success");
    this._clearGainTimers();
    this._gainTimers = GAIN_READ_DELAYS_MS.map((delay) => setTimeout(() => void this._readCats(false), delay));
  };

  private _clearGainTimers(): void {
    for (const timer of this._gainTimers) clearTimeout(timer);
    this._gainTimers = [];
  }

  // ---- Saving -------------------------------------------------------------------------------

  private _unsaved(): number {
    if (!this._queue) return 0;
    const counts = saveCounts(this._queue);
    return counts.pending + counts.failed;
  }

  /** Sends the next waiting answer, if nothing is in flight. Called after every change. */
  private _pump(): void {
    const queue = this._queue;
    const hass = this.hass;
    const entryId = this.entryId;
    if (!queue || !hass?.callWS || !entryId) return;
    const record = nextToSave(queue);
    const item = record ? queue.items.find((candidate) => candidate.key === record.key) : undefined;
    if (!record || !item) return;
    const { key, seq } = record;
    this._queue = markSaving(queue, key, seq);
    // Exactly one of three things ends an attempt: saved, refused, or no reply in time (a
    // request in flight when the connection drops never reports back).
    let settled = false;
    const settle = (err: unknown, saved: boolean): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (saved) {
        if (this._queue) this._queue = markSaved(this._queue, key, seq);
        this._retryDelay = FIRST_RETRY_MS;
        this._scheduleAnnounce();
      } else {
        const gone = typeof err === "object" && err !== null && "code" in err && err.code === "not_found";
        if (this._queue) this._queue = markFailed(this._queue, key, seq, describeWsError(err), gone);
        if (!gone) this._scheduleRetry();
      }
      this._pump();
    };
    const timeout = setTimeout(() => settle(new Error("Timed out."), false), SAVE_TIMEOUT_MS);
    labelSession(hass, entryId, answerRequest(item, record.answer)).then(
      () => settle(null, true),
      (err: unknown) => settle(err, false),
    );
  }

  private _scheduleRetry(): void {
    if (this._retryTimer !== undefined) return;
    this._retryTimer = setTimeout(() => {
      this._retryTimer = undefined;
      this._retryDelay = nextReconnectDelay(this._retryDelay);
      this._retryNow();
    }, this._retryDelay);
  }

  private _retryNow = (): void => {
    if (!this._queue) return;
    this._queue = retryFailed(this._queue);
    this._pump();
  };

  private _dismissGone = (): void => {
    if (this._queue) this._queue = dismissGone(this._queue);
  };

  /** Tells the other cards something was named, shortly after the last save of a burst. */
  private _scheduleAnnounce(): void {
    clearTimeout(this._announceTimer);
    this._announceTimer = setTimeout(() => this._announce(), ANNOUNCE_DELAY_MS);
  }

  private _announce(): void {
    clearTimeout(this._announceTimer);
    this._announceTimer = undefined;
    if (this.entryId) announceReviewChange(this.entryId);
  }

  // ---- Closing ------------------------------------------------------------------------------

  private _close = (): void => {
    if (!this._open) return;
    this._open = false;
    this._follow = null;
    this._clearGainTimers();
    clearTimeout(this._leaveTimer);
    this._leaving = null;
    const queue = this._queue;
    const answered = queue?.history.length ?? 0;
    const counts = queue ? saveCounts(queue) : { pending: 0, failed: 0, gone: 0 };
    if (answered > 0) this._announce();
    if (counts.failed > 0) {
      const message = counts.failed === 1 ? "1 answer is not saved yet. Open Check visits to try again." : `${counts.failed} answers are not saved yet. Open Check visits to try again.`;
      this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
    }
    if (counts.pending + counts.failed === 0) {
      this._queue = null;
      this._generation++;
    }
    this.dispatchEvent(new CustomEvent("review-closed", { detail: { answered }, bubbles: true, composed: true }));
  };

  private _onCancel = (event: Event): void => {
    event.preventDefault(); // Escape: step out of a follow-up first, then close through `_close`
    if (this._follow) this._follow = null;
    else this._close();
  };

  private _onFrameClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) this._close();
  };

  // ---- Keys ---------------------------------------------------------------------------------

  private _keyOptions(): Pick<ReviewOption, "id" | "hotkey">[] {
    const follow = this._follow;
    if (!follow) return this._options();
    if (follow.mode === "ate") return ateChoices(follow.cats).map((choice, index) => ({ id: "ate:" + choice.id, hotkey: String(index + 1) }));
    return this._roster().map((cat, index) => ({ id: "pick:" + cat.name, hotkey: index < 9 ? String(index + 1) : null }));
  }

  private _onKeydown = (event: KeyboardEvent): void => {
    // Nothing typed here should reach Home Assistant's own page shortcuts.
    event.stopPropagation();
    if (event.key === "Escape" || event.key === "Tab" || event.key === "Enter" || event.key === " ") return;
    if (this._view() !== "review") return;
    const command = keyCommand(event, this._keyOptions());
    if (!command) return;
    event.preventDefault();
    this._run(command);
  };

  private _run(command: ReviewCommand): void {
    if (command.type === "undo") this._undo();
    else if (command.type === "scene") this._toggleScene();
    else if (command.type === "photo") this._stepPhoto(command.delta);
    else if (command.optionId.startsWith("ate:")) {
      const choice = ateChoices(this._follow?.cats ?? []).find((candidate) => "ate:" + candidate.id === command.optionId);
      if (choice) this._chooseAte(choice.ate);
    } else if (command.optionId.startsWith("pick:")) this._togglePicked(command.optionId.slice(5));
    else this._choose(command.optionId);
  }

  /** Puts keyboard focus on Kibble's guess (or the earlier answer) when a new visit appears, so
   * Enter agrees with it; with no guess, focus rests on the answer group and Enter does nothing.
   * A guess read from the photos arrives a moment after the visit does: focus follows it only
   * if it is still resting on the group. A just-created answer button has nothing to focus
   * until its own first render, so that is waited for. */
  private async _moveFocus(): Promise<void> {
    const queue = this._queue;
    const item = queue ? currentItem(queue) : null;
    const key = this._view() + ":" + (item?.key ?? "") + ":" + (this._follow?.mode ?? "");
    const marked = this.renderRoot.querySelector<HTMLElement>("[data-autofocus]");
    const answers = this.renderRoot.querySelector<HTMLElement>(".answers");
    const guessArrived = marked !== null && answers !== null && this.shadowRoot?.activeElement === answers;
    if (key === this._focusedKey && !guessArrived) return;
    this._focusedKey = key;
    const target = marked ?? answers;
    if (target instanceof KibbleChoice) await target.updateComplete;
    if (key === this._focusedKey) target?.focus({ preventScroll: true });
  }

  // ---- Photos -------------------------------------------------------------------------------

  private _photosFor(item: ReviewItem): Asset[] {
    return reviewPhotos(item.event, this._details.get(item.key)?.samples ?? null);
  }

  private _toggleScene = (): void => {
    const item = this._queue ? currentItem(this._queue) : null;
    if (!item?.event.scene) return;
    this._scene = !this._scene;
    this._imageFailed = false;
  };

  private _stepPhoto(delta: number): void {
    const item = this._queue ? currentItem(this._queue) : null;
    if (!item) return;
    const count = this._photosFor(item).length;
    if (count < 2) return;
    this._showPhoto((this._photoIndex + delta + count) % count);
  }

  private _showPhoto(index: number): void {
    this._photoIndex = index;
    this._scene = false;
    this._imageFailed = false;
  }

  private _retryImage = (): void => {
    this._imageFailed = false;
    this.renderRoot.querySelector<KibbleImage>(".card.current kibble-image")?.retry();
  };

  // ---- Swipe --------------------------------------------------------------------------------

  private _swipeEnabled(): boolean {
    return this._view() === "review" && !this._follow && this._roster().length === 2;
  }

  private _onPointerDown = (event: PointerEvent): void => {
    this._dragged = false;
    if (event.button !== 0 || !this._swipeEnabled()) return;
    if (event.composedPath().some((node) => node instanceof HTMLButtonElement)) return;
    const el = event.currentTarget as HTMLElement;
    this._swipe = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastT: event.timeStamp, velocity: 0, sideways: null, armed: null, el, width: el.offsetWidth };
  };

  private _onPointerMove = (event: PointerEvent): void => {
    const swipe = this._swipe;
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    if (swipe.sideways === null) {
      swipe.sideways = isSidewaysDrag(dx, event.clientY - swipe.y);
      if (swipe.sideways === false) {
        this._swipe = null;
        return;
      }
      if (swipe.sideways === null) return;
      swipe.el.setPointerCapture(swipe.id);
      swipe.el.classList.add("dragging");
      this._dragged = true;
    }
    const elapsed = event.timeStamp - swipe.lastT;
    if (elapsed > 0) swipe.velocity = (event.clientX - swipe.lastX) / elapsed;
    swipe.lastX = event.clientX;
    swipe.lastT = event.timeStamp;
    const progress = swipeProgress(dx, swipe.width);
    swipe.el.style.setProperty("--dx", `${dx}px`);
    swipe.el.style.setProperty("--tilt", `${(dx / swipe.width) * 10}deg`);
    swipe.el.style.setProperty("--swipe", String(progress.progress));
    swipe.el.dataset.side = progress.side ?? "";
    const armed = progress.progress >= 1 ? progress.side : null;
    if (armed !== swipe.armed) {
      swipe.armed = armed;
      swipe.el.toggleAttribute("data-armed", armed !== null);
      if (armed) fireHaptic("light");
    }
  };

  private _onPointerUp = (event: PointerEvent): void => {
    const swipe = this._swipe;
    this._swipe = null;
    if (!swipe || event.pointerId !== swipe.id || !swipe.sideways) return;
    swipe.el.classList.remove("dragging");
    const cancelled = event.type === "pointercancel";
    const side = cancelled ? null : swipeCommit(event.clientX - swipe.x, swipe.velocity, swipe.width);
    const optionId = side ? swipeOptionId(side, this._options()) : null;
    if (side && optionId) {
      this._choose(optionId, side); // the card keeps `--dx` so it leaves from where it was let go
      return;
    }
    swipe.el.style.removeProperty("--dx");
    swipe.el.style.removeProperty("--tilt");
    swipe.el.style.removeProperty("--swipe");
    swipe.el.removeAttribute("data-armed");
    delete swipe.el.dataset.side;
  };

  private _onCardClick = (event: MouseEvent): void => {
    if (this._dragged) {
      this._dragged = false;
      return;
    }
    if (event.composedPath().some((node) => node instanceof HTMLButtonElement)) return;
    this._toggleScene();
  };

  // ---- Render -------------------------------------------------------------------------------

  private _view(): View {
    const queue = this._queue;
    if (this._phase !== "ready" || !queue) return this._phase === "ready" ? "loading" : this._phase;
    if (this._stage !== "review") return this._stage;
    if (currentItem(queue)) return "review";
    return queue.history.length > 0 ? "summary" : "empty";
  }

  render() {
    return html`
      <dialog aria-label="Check visits" @cancel=${this._onCancel} @keydown=${this._onKeydown}>
        ${this._open ? this._renderFrame() : nothing}
      </dialog>
    `;
  }

  private _renderFrame() {
    const view = this._view();
    const queue = this._queue;
    const item = queue ? currentItem(queue) : null;
    return html`
      <div class="frame" @click=${this._onFrameClick}>
        <div class="panel view-${view}">
          ${this._renderTop(view, queue)}
          <div class="stage">${this._renderStage(view, queue, item)}</div>
          <div class="answers" tabindex="-1" role="group" aria-label=${this._title(view, queue)}>${this._renderAnswers(view, queue, item)}</div>
          ${this._renderFooter(view, queue)}
          <p class="sr-only" aria-live="polite">${view === "review" && item ? this._spoken(item) : ""}</p>
        </div>
      </div>
    `;
  }

  private _title(view: View, queue: ReviewQueueState | null): string {
    if (view === "review") return this._follow?.mode === "ate" ? "Who ate?" : "Who was here?";
    if (view === "batch") return "Batch done";
    if (view === "summary") return queue && queueProgress(queue).remaining > 0 ? "Done for now" : "All caught up";
    if (view === "empty") return "Nothing to check";
    return "Check visits";
  }

  private _renderTop(view: View, queue: ReviewQueueState | null) {
    const progress = queue && (view === "review" || view === "batch") ? queueProgress(queue) : null;
    const batchFull = view === "batch";
    const shown = progress ? (batchFull ? progress.batchSize : Math.min(progress.batchDone + 1, progress.batchSize)) : 0;
    const later = progress ? progress.remaining - (progress.batchSize - progress.batchDone) : 0;
    const fraction = progress ? (batchFull ? 1 : progress.batchDone / Math.max(1, progress.batchSize)) : 0;
    const streak = queue?.streak ?? 0;
    return html`
      <header class="top">
        <div class="titles">
          <h2 class="title">${this._title(view, queue)}</h2>
          ${progress && view === "review"
            ? html`<span class="count">${shown} of ${progress.batchSize}</span>${later > 0 ? html`<span class="later">${later} more after</span>` : nothing}`
            : nothing}
        </div>
        ${streak >= 3 && view === "review" ? keyed(streak, html`<span class="streak" aria-label=${`${streak} in a row`}>${mdiIcon("flash")}${streak}</span>`) : nothing}
        <button type="button" class="icon-btn" aria-label="Close" @click=${this._close}>${mdiIcon("close")}</button>
        ${progress
          ? html`<div class="bar" role="progressbar" aria-label="This batch" aria-valuemin="0" aria-valuemax=${progress.batchSize} aria-valuenow=${batchFull ? progress.batchSize : progress.batchDone}>
              <span style=${`transform:scaleX(${fraction})`}></span>
            </div>`
          : nothing}
      </header>
    `;
  }

  private _renderStage(view: View, queue: ReviewQueueState | null, item: ReviewItem | null) {
    if (view === "loading") return html`<div class="card placeholder" aria-label="Loading"></div>`;
    if (view === "error") return html`<div class="result"><span class="result-glyph muted">${mdiIcon("cloudAlert")}</span><p class="result-line">${this._loadError ?? "Couldn\u2019t load visits."}</p></div>`;
    if (view === "empty") return html`<div class="result"><span class="result-glyph muted cat">${catSilhouette()}</span><p class="result-line">Every visit has a name.</p></div>`;
    if (!queue) return nothing;
    if (view === "batch" || view === "summary") return this._renderResult(view, queue);
    const deck: { item: ReviewItem; role: "leaving" | "current" | "next" }[] = [];
    if (this._leaving && this._leaving.item.key !== item?.key) deck.push({ item: this._leaving.item, role: "leaving" });
    if (item) deck.push({ item, role: "current" });
    const next = upcomingItems(queue, 1)[0];
    if (next && !deck.some((entry) => entry.item.key === next.key)) deck.push({ item: next, role: "next" });
    return html`
      <div class="deck">${repeat(deck, (entry) => entry.item.key, (entry) => this._renderCard(entry.item, entry.role))}</div>
      ${item ? this._renderStrip(item) : nothing}
    `;
  }

  private _renderCard(item: ReviewItem, role: "leaving" | "current" | "next") {
    const locale = this.hass?.locale?.language ?? this.hass?.language;
    const when = visitWhenLabel(item.event.start, new Date(), locale);
    if (role !== "current") {
      const leaving = role === "leaving" ? this._leaving : null;
      return html`
        <div class="card ${role} ${leaving ? "to-" + leaving.side : ""}" aria-hidden="true">
          ${this._renderPhoto(item.event.thumb ?? item.event.scene, "")}
          ${leaving ? html`<span class="stamp shown">${this._renderStampBody(leaving.cats, leaving.label)}</span>` : nothing}
        </div>
      `;
    }
    const photos = this._photosFor(item);
    const asset = this._scene ? item.event.scene : (photos[this._photoIndex] ?? photos[0] ?? item.event.scene);
    const roster = this._roster();
    const swipe = this._swipeEnabled();
    return html`
      <div
        class="card current ${swipe ? "swipeable" : ""}"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onCardClick}
        @image-failed=${() => { this._imageFailed = true; }}
      >
        ${this._renderPhoto(asset, `${item.isMeal ? "Meal" : "Visit"}, ${when}`)}
        ${this._imageFailed
          ? html`<div class="photo-error">${mdiIcon("imageBroken")}<span>Photo didn\u2019t load</span><button type="button" class="pill-btn" @click=${this._retryImage}>Retry</button></div>`
          : nothing}
        <div class="chips">
          <span class="chip">${when}</span>
          <span class="chip">${item.isMeal ? "Meal" : "Visit"}</span>
        </div>
        ${item.event.scene
          ? html`<button type="button" class="icon-btn on-photo scene-btn" aria-pressed=${this._scene} aria-label=${this._scene ? "Show close-up" : "Show whole scene"} @click=${this._toggleScene}>${mdiIcon(this._scene ? "arrowCollapse" : "arrowExpand")}</button>`
          : nothing}
        ${swipe
          ? html`
              <span class="stamp left">${this._renderStampBody([roster[0]!], roster[0]!.name)}</span>
              <span class="stamp right">${this._renderStampBody([roster[1]!], roster[1]!.name)}</span>
              <span class="swipe-hint left" aria-hidden="true">${mdiIcon("chevronLeft")}<kibble-avatar .hass=${this.hass} .name=${roster[0]!.name} .colorIndex=${roster[0]!.color} .asset=${roster[0]!.avatar} .cache=${this.cache}></kibble-avatar></span>
              <span class="swipe-hint right" aria-hidden="true"><kibble-avatar .hass=${this.hass} .name=${roster[1]!.name} .colorIndex=${roster[1]!.color} .asset=${roster[1]!.avatar} .cache=${this.cache}></kibble-avatar>${mdiIcon("chevronRight")}</span>
            `
          : nothing}
      </div>
    `;
  }

  private _renderPhoto(asset: Asset | null | undefined, alt: string) {
    if (!asset) return html`<span class="no-photo">${catSilhouette()}</span>`;
    return html`<kibble-image eager fit="contain" .hass=${this.hass} .cache=${this.cache} .asset=${asset} alt=${alt}></kibble-image>`;
  }

  private _renderStampBody(cats: ChoiceCat[], label: string) {
    return html`
      <span class="stamp-body" style=${cats.length === 1 ? `--stamp-color:${catColorAt(cats[0]!.color)}` : ""}>
        ${cats.map((cat) => html`<kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar>`)}
        <span>${label}</span>
      </span>
    `;
  }

  /** The visit's other photos, one tap each, without leaving the visit. */
  private _renderStrip(item: ReviewItem) {
    const photos = this._photosFor(item);
    if (photos.length < 2) return nothing;
    return html`
      <div class="strip" role="group" aria-label="Photos of this visit">
        ${photos.map(
          (photo, index) => html`
            <button type="button" class="strip-btn" aria-pressed=${!this._scene && index === this._photoIndex} aria-label=${`Photo ${index + 1} of ${photos.length}`} @click=${() => this._showPhoto(index)}>
              <kibble-image .hass=${this.hass} .cache=${this.cache} .asset=${photo} alt=""></kibble-image>
            </button>
          `,
        )}
      </div>
    `;
  }

  private _renderResult(view: "batch" | "summary", queue: ReviewQueueState) {
    const roster = this._roster();
    const summary = summarize(queue, roster.map((cat) => cat.name));
    const progress = queueProgress(queue);
    const named = summary.cats.filter((tally) => tally.visits > 0);
    return html`
      <div class="result">
        <span class="result-glyph done">${mdiIcon("check")}</span>
        <p class="result-big">${summary.total} ${summary.total === 1 ? "visit" : "visits"} done</p>
        ${view === "batch" ? html`<p class="result-line">${progress.remaining} to go</p>` : nothing}
        ${named.length
          ? html`<ul class="tallies">
              ${named.map((tally) => {
                const cat = roster.find((candidate) => candidate.name === tally.cat);
                const gain = view === "summary" ? (this._gains?.[tally.cat] ?? 0) : 0;
                return html`
                  <li class="tally" style=${cat ? `--tally-color:${catColorAt(cat.color)}` : ""}>
                    <kibble-avatar .hass=${this.hass} .name=${tally.cat} .colorIndex=${cat?.color ?? null} .asset=${cat?.avatar ?? null} .cache=${this.cache}></kibble-avatar>
                    <span class="tally-text"><span class="tally-name">${tally.cat}</span><span class="tally-sub">${tally.visits} ${tally.visits === 1 ? "visit" : "visits"}</span></span>
                    ${gain > 0 ? keyed(gain, html`<span class="tally-gain"><strong>+${gain}</strong><span>photos learned</span></span>`) : nothing}
                  </li>
                `;
              })}
            </ul>`
          : nothing}
        ${summary.notACat + summary.cantTell > 0
          ? html`<p class="result-others">
              ${summary.notACat > 0 ? html`<span class="chip">${mdiIcon("cancel")}${summary.notACat} not a cat</span>` : nothing}
              ${summary.cantTell > 0 ? html`<span class="chip">${mdiIcon("helpCircle")}${summary.cantTell} can\u2019t tell</span>` : nothing}
            </p>`
          : nothing}
      </div>
    `;
  }

  private _renderAnswers(view: View, queue: ReviewQueueState | null, item: ReviewItem | null): TemplateResult | typeof nothing {
    if (view === "loading") return nothing;
    if (view === "error") return html`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${() => void this._load(null)}>Try again</button></div>`;
    if (view === "empty") return html`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${this._close}>Done</button></div>`;
    if (view === "batch") {
      return html`<div class="actions">
        <button type="button" class="primary-btn" data-autofocus @click=${this._keepGoing}>Keep going</button>
        <button type="button" class="plain-btn" @click=${this._enterSummary}>Stop here</button>
      </div>`;
    }
    if (view === "summary") {
      const more = queue ? queueProgress(queue).remaining > 0 : false;
      return html`<div class="actions">
        ${more ? html`<button type="button" class="plain-btn" @click=${this._keepGoing}>Keep going</button>` : nothing}
        <button type="button" class="primary-btn" data-autofocus @click=${this._close}>Done</button>
      </div>`;
    }
    if (!queue || !item) return nothing;
    const roster = this._roster();
    const follow = this._follow;
    if (follow?.mode === "ate") {
      const cats = roster.filter((cat) => follow.cats.includes(cat.name));
      const saved = this._details.get(item.key)?.cats.filter((cat) => cat.ate).map((cat) => cat.cat) ?? [];
      return html`<div class="answer-row">
        ${ateChoices(follow.cats).map((choice, index) => {
          const guessed = saved.length > 0 && saved.length === choice.ate.length && choice.ate.every((cat) => saved.includes(cat));
          return html`<kibble-choice
            .hass=${this.hass}
            .cache=${this.cache}
            .label=${choice.label}
            .cats=${cats.filter((cat) => choice.ate.includes(cat.name))}
            .state=${guessed ? "suggested" : "neutral"}
            .hint=${String(index + 1)}
            @click=${() => this._chooseAte(choice.ate)}
          ></kibble-choice>`;
        })}
      </div>`;
    }
    if (follow?.mode === "pick") {
      return html`
        <div class="answer-row">
          ${roster.map(
            (cat, index) => html`<kibble-choice
              .hass=${this.hass}
              .cache=${this.cache}
              .label=${cat.name}
              .cats=${[cat]}
              .state=${follow.cats.includes(cat.name) ? "selected" : "neutral"}
              .hint=${index < 9 ? String(index + 1) : null}
              @click=${() => this._togglePicked(cat.name)}
            ></kibble-choice>`,
          )}
        </div>
        <div class="actions"><button type="button" class="primary-btn" ?disabled=${follow.cats.length < 2} @click=${() => this._finishPick()}>Next</button></div>
      `;
    }
    const options = this._options();
    const guess = this._guessFor(item, options);
    const earlier = queue.records[item.key];
    const earlierId = earlier ? answerOptionId(earlier.answer) : null;
    const choice = (option: ReviewOption) => {
      const state: ChoiceState = option.id === earlierId ? "selected" : !earlierId && option.id === guess.optionId ? "suggested" : "neutral";
      const cats = option.kind === "cat" ? roster.filter((cat) => cat.name === option.cat) : option.kind === "several" ? roster : [];
      return html`<kibble-choice
        .hass=${this.hass}
        .cache=${this.cache}
        .label=${option.label}
        .cats=${cats}
        .icon=${option.kind === "not_a_cat" ? "cancel" : option.kind === "unknown" ? "helpCircle" : null}
        .state=${state}
        .hint=${option.hotkey}
        .caption=${state === "suggested" ? guess.caption : state === "selected" ? "Your answer" : null}
        ?data-autofocus=${state !== "neutral"}
        @click=${() => this._choose(option.id)}
      ></kibble-choice>`;
    };
    return html`
      <div class="answer-row cats">${options.filter((option) => option.kind === "cat").map(choice)}</div>
      <div class="answer-row">${options.filter((option) => option.kind !== "cat").map(choice)}</div>
    `;
  }

  private _guessFor(item: ReviewItem, options: readonly ReviewOption[]): { optionId: string | null; caption: string | null } {
    if (item.guesses.length > 0) {
      const percent = item.confidence !== null ? ` ${Math.round(item.confidence * 100)}%` : "";
      return { optionId: guessOptionId(item.guesses, options), caption: "Guess" + percent };
    }
    const samples = this._details.get(item.key)?.samples;
    const majority = samples ? majorityGuess(samples, this._roster().map((cat) => cat.name)) : null;
    return majority ? { optionId: "cat:" + majority.cat, caption: "Guess" } : { optionId: null, caption: null };
  }

  private _spoken(item: ReviewItem): string {
    const locale = this.hass?.locale?.language ?? this.hass?.language;
    const guess = item.guesses.length ? ` Kibble guesses ${item.guesses.join(" and ")}.` : "";
    return `${item.isMeal ? "Meal" : "Visit"}, ${visitWhenLabel(item.event.start, new Date(), locale)}.${guess}`;
  }

  private _renderFooter(view: View, queue: ReviewQueueState | null) {
    const counts = queue ? saveCounts(queue) : { pending: 0, failed: 0, gone: 0 };
    const canUndo = Boolean(this._follow) || (queue !== null && queue.history.length > 0);
    const showUndo = view === "review" || view === "batch" || view === "summary";
    const offline = this.hass?.connected === false;
    return html`
      <footer class="footer">
        ${showUndo
          ? html`<button type="button" class="plain-btn undo" ?disabled=${!canUndo} @click=${this._undo}>${mdiIcon("undo")}<span>${this._follow ? "Back" : "Undo"}</span><kbd aria-hidden="true">Z</kbd></button>`
          : html`<span></span>`}
        <div class="status" role="status">
          ${counts.failed > 0
            ? html`<span class="status-text error">${mdiIcon("cloudAlert")}${counts.failed} not saved</span><button type="button" class="pill-btn" @click=${this._retryNow}>Retry</button>`
            : counts.gone > 0
              ? html`<span class="status-text">${counts.gone === 1 ? "1 visit no longer exists" : `${counts.gone} visits no longer exist`}</span><button type="button" class="pill-btn" @click=${this._dismissGone}>OK</button>`
              : offline
                ? html`<span class="status-text">${mdiIcon("cloudAlert")}Offline</span>`
                : counts.pending > 0
                  ? html`<span class="status-text saving" aria-label="Saving">${mdiIcon("refresh")}${counts.pending > 3 ? counts.pending : nothing}</span>`
                  : queue && queue.history.length > 0
                    ? html`<span class="status-text" aria-label="All saved">${mdiIcon("cloudCheck")}</span>`
                    : nothing}
        </div>
      </footer>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }
    dialog {
      inset: 0;
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      overflow: hidden;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }
    .frame {
      container: review / size;
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }
    .panel {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr) auto auto;
      grid-template-areas: "top" "stage" "answers" "footer";
      gap: 12px;
      padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
      background: var(--ha-dialog-surface-background, var(--ha-card-background, var(--card-background-color, #fff)));
      --kibble-choice-height: 64px;
    }
    .top {
      grid-area: top;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 8px;
    }
    .titles {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      column-gap: 12px;
      min-width: 0;
    }
    .title {
      margin: 0;
      font-size: 22px;
      font-weight: 500;
      line-height: 1.2;
    }
    .count {
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .later {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .streak {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 4px 8px 4px 4px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
    }
    .bar {
      grid-column: 1 / -1;
      height: 4px;
      border-radius: 2px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .bar span {
      display: block;
      height: 100%;
      border-radius: 2px;
      background: var(--primary-color, #03a9f4);
      transform-origin: left center;
      transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .icon-btn {
      width: 48px;
      height: 48px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--primary-text-color);
      font-size: 24px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 90ms ease-out;
    }
    .icon-btn:active {
      transform: scale(0.92);
    }
    .icon-btn.on-photo {
      position: absolute;
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
    }
    .scene-btn {
      top: 8px;
      right: 8px;
    }

    /* ---- Stage ---- */
    .stage {
      grid-area: stage;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .deck {
      position: relative;
      flex: 1;
      min-height: 0;
    }
    .card {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 12px);
      background: color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color, #fff));
      transition:
        transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 220ms ease-out;
    }
    .card.placeholder {
      position: relative;
      flex: 1;
    }
    .card.next {
      z-index: 1;
      transform: translateY(8px) scale(0.95);
      opacity: 0.5;
    }
    .card.current {
      z-index: 2;
      transform: translate3d(var(--dx, 0px), 0, 0) rotate(var(--tilt, 0deg));
      cursor: pointer;
    }
    .card.swipeable {
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }
    /* The photo never takes the pointer itself: a mouse drag on an <img> would start the
       browser's own image drag and cancel the swipe. */
    .card kibble-image {
      pointer-events: none;
    }
    .card.dragging {
      transition: none;
      cursor: grabbing;
    }
    .card.leaving {
      z-index: 3;
      pointer-events: none;
      animation: kibble-review-leave-up ${LEAVE_MS}ms ease-in forwards;
    }
    .card.leaving.to-left {
      animation-name: kibble-review-leave-left;
    }
    .card.leaving.to-right {
      animation-name: kibble-review-leave-right;
    }
    .card.leaving.to-down {
      animation-name: kibble-review-leave-down;
    }
    @keyframes kibble-review-leave-left {
      from {
        transform: translate3d(var(--dx, 0px), 0, 0) rotate(var(--tilt, 0deg));
        opacity: 1;
      }
      to {
        transform: translate3d(-110%, 0, 0) rotate(-12deg);
        opacity: 0;
      }
    }
    @keyframes kibble-review-leave-right {
      from {
        transform: translate3d(var(--dx, 0px), 0, 0) rotate(var(--tilt, 0deg));
        opacity: 1;
      }
      to {
        transform: translate3d(110%, 0, 0) rotate(12deg);
        opacity: 0;
      }
    }
    @keyframes kibble-review-leave-up {
      to {
        transform: translate3d(0, -24%, 0) scale(0.92);
        opacity: 0;
      }
    }
    @keyframes kibble-review-leave-down {
      to {
        transform: translate3d(0, 16%, 0) scale(0.92);
        opacity: 0;
      }
    }
    .no-photo {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 24%, transparent);
    }
    .no-photo svg {
      width: 96px;
      height: 96px;
    }
    .photo-error {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 14px;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color, #fff));
    }
    .photo-error svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
      opacity: 0.6;
    }
    .chips {
      position: absolute;
      left: 8px;
      bottom: 8px;
      display: flex;
      gap: 4px;
      pointer-events: none;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      line-height: 16px;
      font-variant-numeric: tabular-nums;
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
      color: var(--primary-text-color);
    }
    .chip svg {
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .stamp {
      position: absolute;
      top: 16px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
    }
    .stamp.shown {
      opacity: 1;
    }
    .card[data-side="left"] .stamp.left,
    .card[data-side="right"] .stamp.right {
      opacity: var(--swipe, 0);
    }
    .stamp-body {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px 6px 6px;
      border-radius: 999px;
      border: 2px solid var(--stamp-color, var(--secondary-text-color));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 500;
      --kibble-avatar-size: 36px;
    }
    .stamp-body kibble-avatar + kibble-avatar {
      margin-left: -20px;
    }
    .card[data-armed] .stamp-body {
      background: color-mix(in srgb, var(--stamp-color, var(--secondary-text-color)) 24%, var(--card-background-color, #fff));
    }
    .swipe-hint {
      display: none;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      align-items: center;
      padding: 4px;
      border-radius: 999px;
      font-size: 20px;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--card-background-color, #fff) 86%, transparent);
      pointer-events: none;
      --kibble-avatar-size: 28px;
    }
    .swipe-hint.left {
      left: 8px;
    }
    .swipe-hint.right {
      right: 8px;
    }
    /* The swipe hint is for fingers; with a mouse the buttons and keys are the way in. */
    @media (pointer: coarse) {
      .swipe-hint {
        display: inline-flex;
      }
      .card.dragging .swipe-hint {
        opacity: 0;
      }
    }
    .strip {
      flex: none;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 2px;
      scrollbar-width: none;
    }
    .strip-btn {
      flex: none;
      width: 48px;
      height: 48px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      overflow: hidden;
      background: none;
      cursor: pointer;
      opacity: 0.6;
      transition:
        opacity 150ms ease-out,
        transform 90ms ease-out;
    }
    .strip-btn[aria-pressed="true"] {
      opacity: 1;
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 0;
    }
    .strip-btn:active {
      transform: scale(0.94);
    }

    /* ---- Result cards (batch, summary, empty, error) ---- */
    .result {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
    }
    .result-glyph {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    .result-glyph.done {
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .result-glyph.muted {
      color: color-mix(in srgb, var(--primary-text-color) 32%, transparent);
    }
    .result-glyph.cat svg {
      width: 56px;
      height: 56px;
    }
    .result-big {
      margin: 0;
      font-size: 34px;
      font-weight: 500;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
    .result-line {
      margin: 0;
      font-size: 16px;
      color: var(--secondary-text-color);
    }
    .tallies {
      list-style: none;
      margin: 12px 0 0;
      padding: 0;
      width: min(100%, 420px);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .tally {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      text-align: left;
      background: color-mix(in srgb, var(--tally-color, var(--primary-text-color)) 10%, transparent);
      --kibble-avatar-size: 48px;
    }
    .tally-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tally-name {
      font-size: 16px;
      font-weight: 500;
    }
    .tally-sub {
      font-size: 14px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .tally-gain {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .tally-gain strong {
      font-size: 22px;
      font-weight: 500;
      line-height: 1.1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .result-others {
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }
    .result-others .chip {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    /* ---- Answers ---- */
    .answers {
      grid-area: answers;
      display: flex;
      flex-direction: column;
      gap: 8px;
      outline: none;
    }
    .answer-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
      gap: 8px;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .primary-btn,
    .plain-btn {
      min-height: 56px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 24px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 90ms ease-out;
    }
    .primary-btn {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .plain-btn {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
    }
    .primary-btn:active:not(:disabled),
    .plain-btn:active:not(:disabled) {
      transform: scale(0.97);
    }
    .primary-btn:disabled,
    .plain-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }

    /* ---- Footer ---- */
    .footer {
      grid-area: footer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 48px;
    }
    .plain-btn.undo {
      min-height: 48px;
      padding: 0 16px 0 12px;
      font-size: 14px;
      background: none;
    }
    .plain-btn.undo svg {
      font-size: 20px;
    }
    kbd {
      display: none;
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
    @media (hover: hover) and (pointer: fine) {
      kbd {
        display: inline-block;
      }
    }
    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
    }
    .status-text {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .status-text svg {
      font-size: 20px;
    }
    .status-text.error {
      color: var(--error-color, #db4437);
    }
    .pill-btn {
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    /* ---- Two panes: tablet and desktop ---- */
    @container review (min-width: 700px) {
      .panel {
        width: min(1200px, 100cqw - 48px);
        height: min(840px, 100cqh - 48px);
        border-radius: var(--ha-dialog-border-radius, var(--ha-card-border-radius, 12px));
        grid-template-columns: minmax(0, 1fr) clamp(280px, 32cqw, 380px);
        grid-template-rows: auto minmax(0, 1fr) auto;
        grid-template-areas: "stage top" "stage answers" "stage footer";
        column-gap: 16px;
        padding: 16px;
        --kibble-choice-height: 56px;
      }
      .answers {
        overflow-y: auto;
        align-content: start;
        padding: 2px;
      }
      .answer-row {
        grid-template-columns: minmax(0, 1fr);
      }
      .titles {
        flex-direction: column;
        align-items: flex-start;
        row-gap: 2px;
      }
    }
    @container review (min-width: 700px) and (max-height: 520px) {
      .panel {
        width: 100%;
        height: 100%;
        border-radius: 0;
        padding: max(8px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
        gap: 8px;
        --kibble-choice-height: 60px;
      }
      /* Too short for five stacked answers: back to the phone's two rows, so none scrolls away. */
      .answer-row {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }
      .title {
        font-size: 16px;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .card.placeholder {
        animation: kibble-review-pulse 1.2s ease-in-out infinite alternate;
      }
      .streak {
        animation: kibble-review-bump 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .result-glyph.done {
        animation: kibble-review-pop 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .tally {
        animation: kibble-review-rise 220ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
      }
      .tally:nth-child(2) {
        animation-delay: 60ms;
      }
      .tally:nth-child(3) {
        animation-delay: 120ms;
      }
      .tally-gain {
        animation: kibble-review-bump 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .status-text.saving svg {
        animation: kibble-review-spin 0.9s linear infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card,
      .bar span,
      .icon-btn,
      .primary-btn,
      .plain-btn,
      .strip-btn {
        transition: opacity 120ms linear;
      }
      .card.current,
      .card.next {
        transform: none;
      }
      .card.next {
        opacity: 0;
      }
      .card.leaving,
      .card.leaving.to-left,
      .card.leaving.to-right,
      .card.leaving.to-down {
        animation: kibble-review-fade 120ms linear forwards;
      }
      .icon-btn:active,
      .primary-btn:active:not(:disabled),
      .plain-btn:active:not(:disabled),
      .strip-btn:active {
        transform: none;
      }
    }
    @keyframes kibble-review-fade {
      to {
        opacity: 0;
      }
    }
    @keyframes kibble-review-pulse {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes kibble-review-bump {
      from {
        transform: scale(0.8);
        opacity: 0.4;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    @keyframes kibble-review-pop {
      0% {
        transform: scale(0.4);
        opacity: 0;
      }
      60% {
        transform: scale(1.12);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-review-rise {
      from {
        transform: translateY(8px);
        opacity: 0;
      }
      to {
        transform: none;
        opacity: 1;
      }
    }
    @keyframes kibble-review-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
}

customElements.define("kibble-review-queue", KibbleReviewQueue);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-review-queue": KibbleReviewQueue;
  }
}
