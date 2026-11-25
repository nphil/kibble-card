/** The review queue: the one place photos get named. It opens as a native modal dialog (top
 * layer, so no theme can clip it) and shows ONE photo per screen: a big crop, one button per
 * cat, "Both in this photo" when two cats are enrolled, "Not a cat" and "Don't use". One tap,
 * key or swipe answers and moves on; Undo takes the last answer back.
 *
 * An answer never waits for Kibble. It goes into the answer outbox (`lib/answer-sync.ts`), which
 * saves it on this device and delivers it in the background, in order, retrying by itself. The
 * outbox outlives this sheet, so closing it (or reloading the page) loses nothing.
 *
 * The rules (what is shown, advancing, undo, counts) are `lib/photo-queue.ts` and
 * `lib/photo-answers.ts`; the key and swipe mapping is `lib/review-input.ts`; the live learning
 * line is `kibble-learning-line`. This file is the screen and the plumbing around them.
 *
 * A host card renders one instance, passes `hass`, `entryId`, `cats` and its `ImageUrlCache`,
 * and calls `show()`.
 */

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type { Asset, CatSummary, CatsResponse, HomeAssistant, PhotoQueueItem, PhotoQueuePage, Sample } from "../types";
import type { ImageUrlCache } from "../lib/image-cache";
import { ImagePreloader } from "../lib/image-preload";
import { fireHaptic } from "../lib/haptics";
import { mdiIcon } from "../lib/mdi-icons";
import { catSilhouette } from "../lib/brand-shapes";
import { CALL_TIMEOUT_MS, RETRY_SCHEDULE_MS } from "../lib/backoff";
import { WsQuery } from "../lib/ws-query";
import { loadPhotoPage } from "../lib/review-source";
import { answerOutbox, type Delivery, type EntryOutbox } from "../lib/answer-sync";
import { describeDrops, describeWaiting, type OutboxEvent } from "../lib/answer-outbox";
import { answerOptions, guessCaption, guessOptionId, photosCheckedLabel, tallyAnswers, tallyRows, type AnswerOption } from "../lib/photo-answers";
import {
  answerPhoto,
  appendPage,
  createQueue,
  currentPhoto,
  isCaughtUp,
  lastAnswer,
  needsMorePhotos,
  photoCaption,
  photosLeft,
  photosLeftLabel,
  queueAsPage,
  undoLast,
  upcomingPhotos,
  type PhotoQueueState,
} from "../lib/photo-queue";
import { ateOptions, ateQuestionFor, type AteQuestion } from "../lib/who-ate";
import { countOf } from "../lib/format-count";
import { isSidewaysDrag, keyCommand, swipeCommit, swipeOptionId, swipeProgress, type ReviewCommand, type SwipeSide } from "../lib/review-input";
import type { OverlayBox } from "../lib/boxes";
import { catColorAt } from "../styles/tokens";
import { KibbleChoice, type ChoiceCat, type ChoiceState } from "./kibble-choice";
import type { KibbleImage } from "./kibble-image";
import type { AteChosenDetail, KibbleWhoAte } from "./kibble-who-ate";
import "./kibble-image";
import "./kibble-avatar";
import "./kibble-box-overlay";
import "./kibble-learning-line";
import "./kibble-who-ate";

const LEAVE_MS = 260;
const PRELOAD_AHEAD = 3;

type View = "loading" | "error" | "photo" | "ate" | "caught-up";
type LeaveSide = "left" | "right" | "up" | "down";

interface Leaving {
  photo: PhotoQueueItem;
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

/** The picture the person judges: the body crop, else the face. */
function photoImage(sample: Sample): Asset | null {
  return sample.body ?? sample.face;
}

export class KibbleReviewQueue extends LitElement {
  static properties = {
    hass: { attribute: false },
    entryId: { type: String },
    cats: { attribute: false },
    cache: { attribute: false },
    _open: { state: true },
    _queue: { state: true },
    _ateQueue: { state: true },
    _scene: { state: true },
    _leaving: { state: true },
    _imageFailed: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare entryId: string | undefined;
  /** The roster as the host card knows it; the queue reads its own copy when this is empty. */
  declare cats: CatSummary[];
  declare cache: ImageUrlCache | undefined;

  private _open = false;
  private _queue: PhotoQueueState | null = null;
  /** "Who ate?" questions raised by delivered answers, oldest first; the first one is on screen. */
  private _ateQueue: AteQuestion[] = [];
  private _scene = false;
  private _leaving: Leaving | null = null;
  private _imageFailed = false;

  private readonly _first = this._makeQuery<PhotoQueuePage>();
  private _more = this._makeQuery<PhotoQueuePage>();
  private readonly _rosterQuery = this._makeQuery<CatsResponse>();
  private _foldedFirst: PhotoQueuePage | null = null;
  private _foldedMore: PhotoQueuePage | null = null;
  /** The cursor the next page was last asked for, so a failing read retries by itself instead of
   * being asked again on every render. */
  private _requestedCursor: string | null | undefined;
  /** Visits already asked "who ate?" in this sitting. */
  private readonly _asked = new Set<string>();
  private _outbox: EntryOutbox | null = null;
  private _unsubscribeOutbox: (() => void) | null = null;
  private readonly _preloader = new ImagePreloader();
  private _connected = true;
  private _leaveTimer: ReturnType<typeof setTimeout> | undefined;
  private _swipe: Swipe | null = null;
  private _focusedKey: string | null = null;

  constructor() {
    super();
    this.cats = [];
  }

  private _makeQuery<T>(): WsQuery<T> {
    return new WsQuery<T>(() => this.requestUpdate(), { retry: RETRY_SCHEDULE_MS, timeoutMs: CALL_TIMEOUT_MS });
  }

  // ---- Public API ---------------------------------------------------------------------------

  /** Opens the queue. What was left unanswered last time shows at once while Kibble is asked for
   * the up-to-date list, so a slow Kibble never means a blank sheet. */
  show(): void {
    if (this._open) return;
    this._open = true;
    this._scene = false;
    this._imageFailed = false;
    this._ateQueue = [];
    this._asked.clear();
    const kept = this._queue ? queueAsPage(this._queue) : null;
    this._queue = kept && kept.items.length > 0 ? createQueue(kept, this._hidden()) : null;
    this._more.dispose();
    this._more = this._makeQuery<PhotoQueuePage>();
    this._foldedMore = null;
    this._requestedCursor = undefined;
    if (this._rosterQuery.state.data === null) this._rosterQuery.retryNow(); // a read cut short by leaving the page
    this._loadFirst();
  }

  // ---- Lifecycle ----------------------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    this.requestUpdate(); // `willUpdate` joins the outbox again after a reattach
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._leaveTimer);
    this._unsubscribeOutbox?.();
    this._unsubscribeOutbox = null;
    this._outbox = null;
    this._first.dispose();
    this._more.dispose();
    this._rosterQuery.dispose();
    this._preloader.dispose();
  }

  protected willUpdate(changed: PropertyValues): void {
    const { hass, entryId } = this;
    if (hass && entryId) {
      this._joinOutbox(answerOutbox(hass, entryId));
      if (changed.has("hass")) this._noticeConnection(hass.connected !== false);
    }
    if (!this._open) return;
    this._loadRoster();
    this._foldPages();
    this._prefetch();
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

  // ---- Answers on their way -----------------------------------------------------------------

  private _joinOutbox(outbox: EntryOutbox): void {
    if (outbox === this._outbox) return;
    this._unsubscribeOutbox?.();
    this._outbox = outbox;
    this._unsubscribeOutbox = outbox.subscribe((event) => this._onOutbox(event));
  }

  private _onOutbox(event: OutboxEvent<Delivery>): void {
    if (event.type === "change") this.requestUpdate();
    else if (event.type === "delivered") this._delivered(event.result);
  }

  /** Photos whose answer is waiting to be sent: they count as answered. A waiting "undo" does not. */
  private _hidden(): Set<string> {
    const hidden = new Set<string>();
    for (const [uid, label] of this._outbox?.pendingPhotoLabels() ?? []) if (label !== "follow") hidden.add(uid);
    return hidden;
  }

  /** Kibble accepted an answer. If it says two cats were at a meal and nobody can tell who ate,
   * ask once, right away, while the person still remembers. */
  private _delivered(result: Delivery): void {
    if (result.kind !== "photo" || !this._open || !this._queue) return;
    const uid = result.sample.uid;
    const item = this._queue.items.find((candidate) => candidate.sample.uid === uid);
    if (!item || !this._queue.answers.has(uid)) return; // not answered in this sitting, or taken back since
    const question = ateQuestionFor(result.visit, item.visit.start, this._asked);
    if (!question) return;
    this._asked.add(question.visitUid);
    this._ateQueue = [...this._ateQueue, question];
  }

  // ---- Loading ------------------------------------------------------------------------------

  private _call(message: Record<string, unknown>): Promise<unknown> {
    const callWS = this.hass?.callWS;
    return callWS ? callWS(message) : Promise.reject(new Error("Not connected."));
  }

  private _fetchPage(cursor: string | null): Promise<PhotoQueuePage> {
    const entryId = this.entryId;
    if (!this.hass?.callWS || !entryId) return Promise.reject(new Error("Not connected."));
    return loadPhotoPage((message) => this._call(message), entryId, cursor);
  }

  private _loadFirst = (): void => {
    this._first.refresh(() => this._fetchPage(null));
  };

  private _loadRoster(): void {
    const entryId = this.entryId;
    if (this.cats.length > 0 || !entryId || !this.hass?.callWS) return;
    this._rosterQuery.sync(entryId, () => this._call({ type: "kibble/cats", entry_id: entryId }) as Promise<CatsResponse>);
  }

  /** Folds pages that just arrived into the sitting. The first page replaces what was kept from
   * last time unless something was already answered here; later pages only add. */
  private _foldPages(): void {
    const first = this._first.state.data;
    if (first && first !== this._foldedFirst) {
      this._foldedFirst = first;
      this._requestedCursor = undefined;
      const fresh = !this._queue || this._queue.history.length === 0;
      this._queue = fresh ? createQueue(first, this._hidden()) : appendPage(this._queue!, first, this._hidden());
    }
    const more = this._more.state.data;
    if (more && more !== this._foldedMore) {
      this._foldedMore = more;
      if (this._queue) this._queue = appendPage(this._queue, more, this._hidden());
    }
  }

  /** Asks for the next page while a few photos are still left to show, so advancing never waits. */
  private _prefetch(): void {
    const queue = this._queue;
    if (!queue || !needsMorePhotos(queue) || !this.hass?.callWS || !this.entryId) return;
    const cursor = queue.cursor;
    if (this._requestedCursor === cursor || this._more.state.loading) return;
    this._requestedCursor = cursor;
    this._more.refresh(() => this._fetchPage(cursor));
  }

  /** The connection to Home Assistant came back: whatever was failing is tried again now. */
  private _noticeConnection(connected: boolean): void {
    if (connected && !this._connected && this._open) {
      for (const query of [this._first, this._more, this._rosterQuery]) if (query.state.error !== null) query.retryNow();
    }
    this._connected = connected;
  }

  /** Keeps the next few pictures (and this one's whole scene) warm so stepping forward never waits. */
  private _warmUp(): void {
    const queue = this._queue;
    const photo = queue && this._view() === "photo" ? currentPhoto(queue) : null;
    if (!queue || !photo) {
      this._preloader.sync(undefined, undefined, []);
      return;
    }
    this._preloader.sync(this.hass, this.cache, [photoImage(photo.sample), photo.visit.scene, ...upcomingPhotos(queue, PRELOAD_AHEAD).map((next) => photoImage(next.sample))]);
  }

  private _roster(): CatSummary[] {
    return this.cats.length ? this.cats : (this._rosterQuery.state.data?.cats ?? []);
  }

  private _options(): AnswerOption[] {
    return answerOptions(this._roster());
  }

  private _rosterPending(): boolean {
    return this.cats.length === 0 && this._rosterQuery.state.data === null;
  }

  /** Something is wrong with reading, but a screen of photos is up: say so quietly, retry alone. */
  private _reconnecting(): boolean {
    return this._queue !== null && (this._first.state.error !== null || this._more.state.error !== null);
  }

  // ---- Answers ------------------------------------------------------------------------------

  private _choose(optionId: string, swipeSide?: SwipeSide): void {
    const queue = this._queue;
    const photo = queue ? currentPhoto(queue) : null;
    const outbox = this._outbox;
    if (!queue || !photo || !outbox || this._view() !== "photo") return;
    const roster = this._roster();
    const option = this._options().find((candidate) => candidate.id === optionId);
    if (!option) return;
    const named = option.kind === "cat" ? roster.filter((cat) => cat.name === option.cat) : option.kind === "both" ? roster : [];
    let side: LeaveSide = option.kind === "cat" || option.kind === "both" ? "up" : "down";
    if (option.kind === "cat" && roster.length === 2) side = roster[0]?.name === option.cat ? "left" : "right";
    outbox.enqueue({ kind: "photo", sampleUid: photo.sample.uid, label: option.value });
    this._leaving = { photo, side: swipeSide ?? side, label: option.kind === "both" ? "Both cats" : option.kind === "skip" ? "Not used" : option.text, cats: named };
    clearTimeout(this._leaveTimer);
    this._leaveTimer = setTimeout(() => {
      this._leaving = null;
    }, LEAVE_MS);
    this._queue = answerPhoto(queue, option.value);
    this._scene = false;
    this._imageFailed = false;
    fireHaptic(isCaughtUp(this._queue) ? "success" : "light");
  }

  private _undo = (): void => {
    const queue = this._queue;
    const last = queue ? lastAnswer(queue) : null;
    if (!queue || !last || !this._outbox) return;
    clearTimeout(this._leaveTimer);
    this._leaving = null;
    this._outbox.enqueue({ kind: "photo", sampleUid: last.uid, label: "follow" });
    const visitUid = queue.items.find((item) => item.sample.uid === last.uid)?.visit.uid;
    if (visitUid) {
      this._asked.delete(visitUid); // a different answer may raise the question again
      this._ateQueue = this._ateQueue.filter((question) => question.visitUid !== visitUid);
    }
    this._queue = undoLast(queue);
    this._scene = false;
    this._imageFailed = false;
    fireHaptic("light");
  };

  private _onAteChosen = (event: CustomEvent<AteChosenDetail>): void => {
    const { visitUid, ate } = event.detail;
    this._outbox?.enqueue({ kind: "ate", visitUid, ate });
    this._ateQueue = this._ateQueue.filter((question) => question.visitUid !== visitUid);
    fireHaptic("success");
  };

  private _onAteSkipped = (): void => {
    this._ateQueue = this._ateQueue.slice(1);
  };

  // ---- Closing ------------------------------------------------------------------------------

  private _close = (): void => {
    if (!this._open) return;
    this._open = false;
    clearTimeout(this._leaveTimer);
    this._leaving = null;
    this._first.dispose();
    this._more.dispose();
    const answered = this._queue?.history.length ?? 0;
    const waiting = this._outbox?.size ?? 0;
    if (waiting > 0) {
      const message = `${describeWaiting(waiting)}. Kibble keeps trying.`;
      this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
    }
    this.dispatchEvent(new CustomEvent("review-closed", { detail: { answered }, bubbles: true, composed: true }));
  };

  private _onCancel = (event: Event): void => {
    event.preventDefault(); // Escape: step back out of the whole picture or a question first, then close
    if (this._ateQueue.length > 0) this._onAteSkipped();
    else if (this._scene) this._scene = false;
    else this._close();
  };

  private _onFrameClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) this._close();
  };

  // ---- Keys ---------------------------------------------------------------------------------

  private _onKeydown = (event: KeyboardEvent): void => {
    // Nothing typed here should reach Home Assistant's own page shortcuts.
    event.stopPropagation();
    if (event.key === "Escape" || event.key === "Tab" || event.key === "Enter" || event.key === " ") return;
    const view = this._view();
    if (view === "ate") {
      const question = this._ateQueue[0];
      const options = question ? ateOptions(question.cats).map((option, index) => ({ id: option.id, hotkey: String(index + 1) })) : [];
      const command = keyCommand(event, options);
      if (command?.type !== "answer") return;
      event.preventDefault();
      this.renderRoot.querySelector<KibbleWhoAte>("kibble-who-ate")?.choose(options.findIndex((option) => option.id === command.optionId));
      return;
    }
    if (view !== "photo") return;
    const command = keyCommand(event, this._options());
    if (!command) return;
    event.preventDefault();
    this._run(command);
  };

  private _run(command: ReviewCommand): void {
    if (command.type === "undo") this._undo();
    else if (command.type === "scene") this._toggleScene();
    else this._choose(command.optionId);
  }

  /** Puts keyboard focus on Kibble's guess when a new photo appears, so Enter agrees with it; with
   * no guess, focus rests on the answer group and Enter does nothing. A just-created answer button
   * has nothing to focus until its own first render, so that is waited for. */
  private async _moveFocus(): Promise<void> {
    const photo = this._queue ? currentPhoto(this._queue) : null;
    const key = this._view() + ":" + (photo?.sample.uid ?? "") + ":" + (this._ateQueue[0]?.visitUid ?? "");
    if (key === this._focusedKey) return;
    this._focusedKey = key;
    const marked = this.renderRoot.querySelector<HTMLElement>("[data-autofocus]");
    const target = marked ?? this.renderRoot.querySelector<HTMLElement>(".answers");
    if (target instanceof KibbleChoice) await target.updateComplete;
    if (key === this._focusedKey) target?.focus({ preventScroll: true });
  }

  // ---- The whole picture --------------------------------------------------------------------

  private _toggleScene = (): void => {
    const photo = this._queue ? currentPhoto(this._queue) : null;
    if (!photo?.visit.scene) return;
    this._scene = !this._scene;
    this._imageFailed = false;
  };

  /** This photo's animal marked in the whole picture, the others dimmed. Nothing is drawn when
   * the photo's box does not point into this picture. */
  private _sceneBoxes(photo: PhotoQueueItem): OverlayBox[] {
    const { sample, visit } = photo;
    if (!visit.in_scene || !sample.box) return [];
    const boxes: OverlayBox[] = sample.peers.map((box, index) => ({ key: `peer-${index}`, box, tone: "peer", emphasis: "dim" }));
    boxes.push({ key: "this", box: sample.box, tone: "cat", emphasis: "selected", color: "var(--primary-color, #03a9f4)" });
    return boxes;
  }

  private _retryImage = (): void => {
    this._imageFailed = false;
    this.renderRoot.querySelector<KibbleImage>(".card.current kibble-image")?.retry();
  };

  // ---- Swipe --------------------------------------------------------------------------------

  /** Swiping left or right means the first or second cat: only meaningful with exactly two. */
  private _swipeEnabled(): boolean {
    return this._view() === "photo" && !this._scene && this._roster().length === 2;
  }

  private _onPointerDown = (event: PointerEvent): void => {
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

  // ---- Render -------------------------------------------------------------------------------

  private _view(): View {
    const queue = this._queue;
    if (!queue || this._rosterPending()) {
      const failed = (queue === null && this._first.state.error !== null) || (this._rosterPending() && this._rosterQuery.state.error !== null);
      return failed ? "error" : "loading";
    }
    if (this._ateQueue.length > 0) return "ate";
    if (currentPhoto(queue)) return "photo";
    return isCaughtUp(queue) ? "caught-up" : "loading";
  }

  render() {
    return html`
      <dialog aria-label="Check photos" @cancel=${this._onCancel} @keydown=${this._onKeydown}>
        ${this._open ? this._renderFrame() : nothing}
      </dialog>
    `;
  }

  private _renderFrame() {
    const view = this._view();
    const queue = this._queue;
    const photo = queue && view === "photo" ? currentPhoto(queue) : null;
    return html`
      <div class="frame" @click=${this._onFrameClick}>
        <div class="panel view-${view}">
          ${this._renderTop(view, queue)}
          <div class="stage">${this._renderStage(view, queue, photo)}</div>
          <div class="answers" tabindex="-1" role="group" aria-label=${view === "ate" ? "Who ate?" : "Who is in this photo?"}>${this._renderAnswers(view, photo)}</div>
          ${this._renderFooter(view, queue)}
          <p class="sr-only" aria-live="polite">${photo ? this._spoken(photo) : ""}</p>
        </div>
      </div>
    `;
  }

  private _locale(): string | undefined {
    return this.hass?.locale?.language ?? this.hass?.language;
  }

  private _spoken(photo: PhotoQueueItem): string {
    const guess = guessCaption(photo.sample);
    return `Photo, ${photoCaption(photo.visit, new Date(), this._locale())}.${guess ? " " + guess + "." : ""}`;
  }

  private _renderTop(view: View, queue: PhotoQueueState | null) {
    const left = queue && view === "photo" ? photosLeftLabel(photosLeft(queue), this._locale()) : null;
    return html`
      <header class="top">
        <div class="head">
          <div class="titles">
            <h2 class="title">Check photos</h2>
            ${left ? html`<span class="count">${left}</span>` : nothing}
          </div>
          <button type="button" class="icon-btn" aria-label="Close" @click=${this._close}>${mdiIcon("close")}</button>
        </div>
        ${this._renderNotices()}
      </header>
    `;
  }

  /** Quiet lines about what is happening behind the screen. Each shows only when it applies. */
  private _renderNotices() {
    const outbox = this._outbox;
    const waiting = outbox?.size ?? 0;
    const drops = outbox?.drops ?? [];
    return html`
      <div class="notices">
        ${drops.length > 0
          ? html`<div class="notice" role="status"><span class="notice-text">${describeDrops(drops)}</span><button type="button" class="pill-btn" @click=${() => outbox?.clearDrops()}>OK</button></div>`
          : nothing}
        ${waiting > 0
          ? html`<div class="notice" role="status"><span class="notice-text">${describeWaiting(waiting)}</span><button type="button" class="pill-btn" @click=${() => outbox?.sendNow()}>Send now</button></div>`
          : nothing}
        ${this._reconnecting() ? html`<div class="notice quiet" role="status"><span class="spin">${mdiIcon("refresh")}</span><span class="notice-text">Reconnecting\u2026</span></div>` : nothing}
        <kibble-learning-line .hass=${this.hass} .entryId=${this.entryId}></kibble-learning-line>
      </div>
    `;
  }

  private _renderStage(view: View, queue: PhotoQueueState | null, photo: PhotoQueueItem | null) {
    if (view === "loading") {
      return html`<div class="card placeholder" aria-label="Loading photos"></div><p class="when">Loading photos\u2026</p>`;
    }
    if (view === "error") {
      return html`<div class="result"><span class="result-glyph muted">${mdiIcon("cloudAlert")}</span><p class="result-line">Couldn\u2019t load photos. Trying again\u2026</p></div>`;
    }
    if (view === "ate") return html`<div class="result ask">${this._renderAte()}</div>`;
    if (view === "caught-up" && queue) return this._renderCaughtUp(queue);
    if (!queue || !photo) return nothing;
    const deck: { photo: PhotoQueueItem; role: "leaving" | "current" | "next" }[] = [];
    if (this._leaving && this._leaving.photo.sample.uid !== photo.sample.uid) deck.push({ photo: this._leaving.photo, role: "leaving" });
    deck.push({ photo, role: "current" });
    const next = upcomingPhotos(queue, 1)[0];
    if (next && !deck.some((entry) => entry.photo.sample.uid === next.sample.uid)) deck.push({ photo: next, role: "next" });
    return html`
      <div class="deck">${repeat(deck, (entry) => entry.photo.sample.uid, (entry) => this._renderCard(entry.photo, entry.role))}</div>
      <div class="meta">
        <p class="when">${photoCaption(photo.visit, new Date(), this._locale())}</p>
        ${photo.visit.scene
          ? html`<button type="button" class="scene-btn" aria-pressed=${this._scene} @click=${this._toggleScene}>${mdiIcon(this._scene ? "arrowCollapse" : "arrowExpand")}<span>${this._scene ? "Back to close-up" : "See whole picture"}</span></button>`
          : nothing}
      </div>
    `;
  }

  private _renderCard(photo: PhotoQueueItem, role: "leaving" | "current" | "next") {
    const crop = photoImage(photo.sample);
    if (role !== "current") {
      const leaving = role === "leaving" ? this._leaving : null;
      return html`
        <div class="card ${role} ${leaving ? "to-" + leaving.side : ""}" aria-hidden="true">
          ${this._renderPhoto(crop, "")}
          ${leaving ? html`<span class="stamp shown">${this._renderStampBody(leaving.cats, leaving.label)}</span>` : nothing}
        </div>
      `;
    }
    const roster = this._roster();
    const swipe = this._swipeEnabled();
    const first = roster[0];
    const second = roster[1];
    return html`
      <div
        class="card current ${swipe ? "swipeable" : ""}"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @image-failed=${() => {
          this._imageFailed = true;
        }}
      >
        ${this._scene ? this._renderScene(photo) : this._renderPhoto(crop, photoCaption(photo.visit, new Date(), this._locale()))}
        ${this._imageFailed
          ? html`<div class="photo-error">${mdiIcon("imageBroken")}<span>Photo didn\u2019t load</span><button type="button" class="pill-btn" @click=${this._retryImage}>Retry</button></div>`
          : nothing}
        ${swipe && first && second
          ? html`
              <span class="stamp left">${this._renderStampBody([first], first.name)}</span>
              <span class="stamp right">${this._renderStampBody([second], second.name)}</span>
              <span class="swipe-hint left" aria-hidden="true">${mdiIcon("chevronLeft")}<kibble-avatar .hass=${this.hass} .name=${first.name} .colorIndex=${first.color} .asset=${first.avatar} .cache=${this.cache}></kibble-avatar></span>
              <span class="swipe-hint right" aria-hidden="true"><kibble-avatar .hass=${this.hass} .name=${second.name} .colorIndex=${second.color} .asset=${second.avatar} .cache=${this.cache}></kibble-avatar>${mdiIcon("chevronRight")}</span>
            `
          : nothing}
      </div>
    `;
  }

  private _renderPhoto(asset: Asset | null | undefined, alt: string) {
    if (!asset) return html`<span class="no-photo">${catSilhouette()}</span>`;
    return html`<kibble-image eager fit="contain" .hass=${this.hass} .cache=${this.cache} .asset=${asset} alt=${alt}></kibble-image>`;
  }

  private _renderScene(photo: PhotoQueueItem) {
    return html`
      <div class="scene">
        <div class="scene-frame">
          ${this._renderPhoto(photo.visit.scene, "The whole picture")}
          <kibble-box-overlay .boxes=${this._sceneBoxes(photo)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>
        </div>
      </div>
    `;
  }

  private _renderStampBody(cats: ChoiceCat[], label: string) {
    return html`
      <span class="stamp-body ${cats.length ? "" : "bare"}" style=${cats.length === 1 ? `--stamp-color:${catColorAt(cats[0]!.color)}` : ""}>
        ${cats.map((cat) => html`<kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar>`)}
        <span>${label}</span>
      </span>
    `;
  }

  private _renderAte() {
    return html`<kibble-who-ate
      .hass=${this.hass}
      .cache=${this.cache}
      .question=${this._ateQueue[0] ?? null}
      .roster=${this._roster()}
      hotkeys
      skippable
      @ate-chosen=${this._onAteChosen}
      @ate-skipped=${this._onAteSkipped}
    ></kibble-who-ate>`;
  }

  /** Everything is answered: say so calmly, and show what this sitting did. */
  private _renderCaughtUp(queue: PhotoQueueState) {
    const roster = this._roster();
    const tally = tallyAnswers(queue.answers.values(), roster.map((cat) => cat.name));
    const rows = tallyRows(tally);
    return html`
      <div class="result">
        <span class="result-glyph done">${mdiIcon("check")}</span>
        <p class="result-big">All caught up</p>
        <p class="result-line">${tally.total > 0 ? photosCheckedLabel(tally.total, this._locale()) : "Every photo has an answer."}</p>
        ${rows.length
          ? html`<ul class="tallies">
              ${rows.map((row) => {
                const cat = row.kind === "cat" ? roster.find((candidate) => candidate.name === row.cat) : undefined;
                return html`
                  <li class="tally ${row.kind}" style=${cat ? `--tally-color:${catColorAt(cat.color)}` : ""}>
                    ${row.kind === "cat"
                      ? html`<kibble-avatar .hass=${this.hass} .name=${row.text} .colorIndex=${cat?.color ?? null} .asset=${cat?.avatar ?? null} .cache=${this.cache}></kibble-avatar>`
                      : row.kind === "both"
                        ? html`<span class="tally-glyph pair">${roster.slice(0, 2).map((pair) => html`<kibble-avatar .hass=${this.hass} .name=${pair.name} .colorIndex=${pair.color} .asset=${pair.avatar} .cache=${this.cache}></kibble-avatar>`)}</span>`
                        : html`<span class="tally-glyph">${mdiIcon(row.kind === "not_a_cat" ? "cancel" : "eyeOff")}</span>`}
                    <span class="tally-text"><span class="tally-name">${row.text}</span><span class="tally-sub">${countOf(row.count, "photo", "photos", this._locale())}</span></span>
                  </li>
                `;
              })}
            </ul>`
          : nothing}
      </div>
    `;
  }

  private _renderAnswers(view: View, photo: PhotoQueueItem | null): TemplateResult | typeof nothing {
    if (view === "error") return html`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${this._loadFirst}>Retry</button></div>`;
    if (view === "caught-up") return html`<div class="actions"><button type="button" class="primary-btn" data-autofocus @click=${this._close}>Done</button></div>`;
    if (view !== "photo" || !photo) return nothing;
    const roster = this._roster();
    const options = this._options();
    const guessId = guessOptionId(photo.sample, options);
    const choice = (option: AnswerOption) => {
      const state: ChoiceState = option.id === guessId ? "suggested" : "neutral";
      const cats = option.kind === "cat" ? roster.filter((cat) => cat.name === option.cat) : option.kind === "both" ? roster : [];
      return html`<kibble-choice
        .hass=${this.hass}
        .cache=${this.cache}
        .label=${option.text}
        .cats=${cats}
        .icon=${option.kind === "not_a_cat" ? "cancel" : option.kind === "skip" ? "eyeOff" : null}
        .state=${state}
        .hint=${option.hotkey}
        .caption=${state === "suggested" ? guessCaption(photo.sample) : option.hint}
        ?data-autofocus=${state === "suggested"}
        @click=${() => this._choose(option.id)}
      ></kibble-choice>`;
    };
    return html`
      <div class="answer-row cats">${options.filter((option) => option.kind === "cat").map(choice)}</div>
      <div class="answer-row others">${options.filter((option) => option.kind !== "cat").map(choice)}</div>
    `;
  }

  private _renderFooter(view: View, queue: PhotoQueueState | null) {
    if (view !== "photo" && view !== "caught-up") return nothing;
    const canUndo = queue !== null && lastAnswer(queue) !== null;
    return html`
      <footer class="footer">
        <button type="button" class="plain-btn undo" ?disabled=${!canUndo} @click=${this._undo}>${mdiIcon("undo")}<span>Undo</span><kbd aria-hidden="true">Z</kbd></button>
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
      min-width: 0;
    }
    .head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
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
    .notices {
      display: flex;
      flex-direction: column;
    }
    .notices > * {
      margin-top: 6px;
    }
    .notice {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 36px;
      font-size: 13px;
      line-height: 1.3;
      color: var(--secondary-text-color);
    }
    .notice-text {
      flex: 1;
      min-width: 0;
    }
    .notice.quiet {
      min-height: 0;
    }
    .notice .spin {
      display: inline-flex;
      font-size: 16px;
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

    /* ---- Stage ---- */
    .stage {
      grid-area: stage;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      z-index: 3;
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
    /* The whole camera picture, framed the way the event sheet frames it (16:10) so the boxes
       it draws land on the right animals. */
    .scene {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      container-type: size;
      background: #000;
    }
    .scene-frame {
      position: relative;
      width: min(100cqw, 160cqh);
      aspect-ratio: 1.6;
    }
    .meta {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 48px;
    }
    .when {
      margin: 0;
      min-width: 0;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .scene-btn {
      flex: none;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .scene-btn svg {
      font-size: 20px;
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
    .stamp-body.bare {
      padding-left: 16px;
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

    /* ---- Result cards (all caught up, a question, an error) ---- */
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
    .result.ask {
      align-items: stretch;
      justify-content: flex-end;
      text-align: left;
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
    .result-big {
      margin: 0;
      font-size: 34px;
      font-weight: 500;
      line-height: 1.1;
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
    .tally-glyph {
      width: 48px;
      height: 48px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: var(--secondary-text-color);
    }
    .tally-glyph.pair {
      --kibble-avatar-size: 32px;
    }
    .tally-glyph.pair kibble-avatar + kibble-avatar {
      margin-left: -12px;
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
      grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
      gap: 8px;
    }
    .answer-row.others {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    /* "Don't use" sits alone on the last row when the answers before it are an odd number. */
    .answer-row.others > :last-child:nth-child(odd) {
      grid-column: 1 / -1;
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
    .pill-btn {
      flex: none;
      min-height: 36px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
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

    /* A screen with nothing in its footer gives the row back (the two-pane layout below keeps its own). */
    @container review (max-width: 699px) {
      .panel.view-loading,
      .panel.view-error,
      .panel.view-ate {
        grid-template-rows: auto minmax(0, 1fr) auto;
        grid-template-areas: "top" "stage" "answers";
      }
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
      .answer-row,
      .answer-row.others {
        grid-template-columns: minmax(0, 1fr);
      }
      .answer-row.others > :last-child:nth-child(odd) {
        grid-column: auto;
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
      /* Too short for five stacked answers: back to rows, so none scrolls away. */
      .answer-row {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }
      .answer-row.others {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .answer-row.others > :last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
      .title {
        font-size: 16px;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .card.placeholder {
        animation: kibble-review-pulse 1.2s ease-in-out infinite alternate;
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
      .notice .spin svg {
        animation: kibble-review-spin 0.9s linear infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card,
      .icon-btn,
      .primary-btn,
      .plain-btn {
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
      .plain-btn:active:not(:disabled) {
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
