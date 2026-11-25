/** Enrolled cats up top (avatar, when last seen, meals today, how much is trained, how often
 * each is recognized), then one "Check visits" bar that opens the review queue: the single
 * place visits get named, shared with every other Kibble card. Per-cat training photos are
 * hidden behind "View training" so the whole card doesn't render every crop for every cat at
 * once. See `kibble/docs/36-ai-pipeline.md` for the full contract this renders.
 */

import type { CustomCardEntry } from "./kibble-card";
import { LitElement, css, html, nothing } from "lit";
import type { Asset, CatsResponse, HomeAssistant, KibbleCatsCardConfig, TrainingSample } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { WsQuery, describeWsError } from "./lib/ws-query";
import { PagedFeed, type PagedFeedState } from "./lib/paged-feed";
import { ImageUrlCache } from "./lib/image-cache";
import { relativeTimeSentence } from "./lib/relative-time";
import { storageSummary, spoolSummary } from "./lib/storage-summary";
import { onReviewChange } from "./lib/review-bus";
import { mdiIcon } from "./lib/mdi-icons";
import { findCatRecognitionEntityId, readCatRecognition, type LearningState } from "./lib/cat-recognition";
import "./components/kibble-avatar";
import "./components/kibble-image";
import "./components/kibble-review-entry";
import "./components/kibble-add-photos-sheet";
import "./components/kibble-avatar-picker";
import "./cats-editor";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };
const TRAINING_LIMIT = 24;
const DELETE_CONFIRM_WINDOW_MS = 3000;
const LEARNING_LABEL: Record<LearningState, string> = { learning: "still learning", paused: "learning paused", learned: "learned" };

interface ActionError {
  message: string;
  retry: () => void;
}

export class KibbleCatsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _addName: { state: true },
    _addBusy: { state: true },
    _addError: { state: true },
    _actionError: { state: true },
    _openMenuFor: { state: true },
    _deleteConfirmFor: { state: true },
    _expandedTraining: { state: true },
    _addPhotosOpen: { state: true },
    _addPhotosCat: { state: true },
    _addPhotosFiles: { state: true },
    _avatarPickerCat: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCatsCardConfig | undefined;
  declare _addName: string;
  declare _addBusy: boolean;
  declare _addError: string | null;
  declare _actionError: ActionError | null;
  /** Which cat's kebab menu is currently open, or `null`. At most one at a time. */
  declare _openMenuFor: string | null;
  /** Which cat's "Delete cat…" button is armed for a second tap, or `null`. */
  declare _deleteConfirmFor: string | null;
  /** Which cat's training-photo grid is expanded below the roster, or `null` (none). At most
   * one at a time -- keeps the default view to the roster and the review queue only. */
  declare _expandedTraining: string | null;
  declare _addPhotosOpen: boolean;
  /** Which cat's "Add photos" flow is in progress, or `null`. Set the instant the hidden file
   * input is triggered, read again once it resolves with the chosen files. */
  declare _addPhotosCat: string | null;
  declare _addPhotosFiles: File[];
  /** Which cat's avatar picker is open, or `null`. */
  declare _avatarPickerCat: string | null;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  private _resolvedEntities: HomeAssistant["entities"] | undefined;
  private _resolvedDevices: HomeAssistant["devices"] | undefined;
  private _resolvedDeviceId: string | undefined;
  private _catsQuery = new WsQuery<CatsResponse>(() => this.requestUpdate());
  private _trainingFeeds = new Map<string, PagedFeed<TrainingSample>>();
  private _imageCache = new ImageUrlCache();
  private _deleteConfirmTimer: ReturnType<typeof setTimeout> | undefined;
  private _stopReviewListening: (() => void) | null = null;

  constructor() {
    super();
    this._addName = "";
    this._addBusy = false;
    this._addError = null;
    this._actionError = null;
    this._openMenuFor = null;
    this._deleteConfirmFor = null;
    this._expandedTraining = null;
    this._addPhotosOpen = false;
    this._addPhotosCat = null;
    this._addPhotosFiles = [];
    this._avatarPickerCat = null;
  }

  setConfig(config: KibbleCatsCardConfig): void {
    if (!config.device_id) {
      throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 8;
  }

  static getStubConfig(hass: HomeAssistant): KibbleCatsCardConfig {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-cats-card", device_id: kibbleEntity?.device_id ?? "" };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("kibble-cats-card-editor");
  }

  connectedCallback(): void {
    super.connectedCallback();
    // A visit named anywhere on the page changes the photo counts shown here.
    this._stopReviewListening = onReviewChange(
      () => this._entryId,
      () => {
        this._refreshCats();
        const cat = this._expandedTraining;
        if (cat) this._trainingFeed(cat).refresh(this.hass, { entry_id: this._entryId, cat }, TRAINING_LIMIT);
      },
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopReviewListening?.();
    this._stopReviewListening = null;
    this._imageCache.dispose();
    for (const feed of this._trainingFeeds.values()) feed.dispose();
    clearTimeout(this._deleteConfirmTimer);
  }

  protected willUpdate(): void {
    const deviceId = this._config?.device_id;
    if (
      this.hass &&
      deviceId &&
      (this.hass.entities !== this._resolvedEntities || this.hass.devices !== this._resolvedDevices || deviceId !== this._resolvedDeviceId)
    ) {
      this._resolvedEntities = this.hass.entities;
      this._resolvedDevices = this.hass.devices;
      this._resolvedDeviceId = deviceId;
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, deviceId);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, deviceId);
    }
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (this.hass && entryId && callWS) {
      this._catsQuery.sync(entryId, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as CatsResponse));
      if (this._expandedTraining) {
        const cat = this._expandedTraining;
        this._trainingFeed(cat).sync(this.hass, `${entryId}:${cat}`, { entry_id: entryId, cat }, TRAINING_LIMIT);
      }
    }
  }

  private _trainingFeed(catName: string): PagedFeed<TrainingSample> {
    let feed = this._trainingFeeds.get(catName);
    if (!feed) {
      feed = new PagedFeed<TrainingSample>("kibble/training", () => this.requestUpdate());
      this._trainingFeeds.set(catName, feed);
    }
    return feed;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const cats = this._catsQuery.state.data?.cats ?? [];
    const storage = this._catsQuery.state.data?.storage ?? null;
    const spoolLine = storage ? spoolSummary(storage.device_spool) : null;

    return html`
      <ha-card>
        <div class="container">
          ${this._config.name ? html`<div class="label">${this._config.name}</div>` : nothing}
          ${this._actionError ? this._renderActionError() : nothing}
          <section class="roster">
            ${cats.length === 0 ? html`<p class="empty">No cats yet. Add one to start training.</p>` : html`<div class="cat-list">${cats.map((cat) => this._renderCatTile(cat))}</div>`}
            ${this._renderAddCat()}
          </section>
          ${this._expandedTraining ? this._renderTrainingPanel(this._expandedTraining) : nothing}
          ${cats.length > 0
            ? html`<kibble-review-entry .hass=${this.hass} .entryId=${this._entryId} .cats=${cats} .cache=${this._imageCache} .revision=${this._catsQuery.state.data}></kibble-review-entry>`
            : nothing}
          ${storage
            ? html`
                <p class="storage-line">
                  <span>${storageSummary(storage)}</span>
                  ${spoolLine ? html`<span class="quiet">${spoolLine}</span>` : nothing}
                </p>
              `
            : nothing}
        </div>
      </ha-card>
      <input type="file" class="add-photos-file-input" multiple accept="image/*" hidden @change=${(e: Event) => this._onAddPhotosChosen(e)} />
      <kibble-add-photos-sheet
        ?open=${this._addPhotosOpen}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cat=${this._addPhotosCat ?? undefined}
        .files=${this._addPhotosFiles}
        @close-requested=${() => this._closeAddPhotos()}
      ></kibble-add-photos-sheet>
      <kibble-avatar-picker
        ?open=${this._avatarPickerCat !== null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cat=${cats.find((c) => c.name === this._avatarPickerCat) ?? null}
        @close-requested=${() => this._closeAvatarPicker()}
        @avatar-changed=${this._onAvatarChanged}
      ></kibble-avatar-picker>
    `;
  }

  private _renderActionError() {
    const error = this._actionError;
    if (!error) return nothing;
    return html`
      <div class="error">
        <span>${error.message}</span>
        <button
          type="button"
          @click=${() => {
            this._actionError = null;
            error.retry();
          }}
        >
          Try again
        </button>
      </div>
    `;
  }

  private _renderCatTile(cat: CatsResponse["cats"][number]) {
    const now = new Date();
    const seen = cat.last_seen != null ? `Seen ${relativeTimeSentence(new Date(cat.last_seen * 1000), now)}` : "Not seen yet";
    const meals = `${cat.meals_today} ${cat.meals_today === 1 ? "meal" : "meals"} today`;
    const trained = cat.training.total === 0 ? "Not trained yet" : `${cat.training.total} ${cat.training.total === 1 ? "photo" : "photos"} trained`;
    const deviceId = this._config?.device_id;
    const recognitionEntityId = this.hass && deviceId ? findCatRecognitionEntityId(this.hass.entities ?? {}, deviceId, cat.name) : undefined;
    const recognition = this.hass ? readCatRecognition(this.hass, recognitionEntityId) : null;
    return html`
      <div class="cat-tile">
        <kibble-avatar class=${cat.present ? "present" : ""} .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this._imageCache}></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${cat.name}</span>
          <span class="cat-meta">${seen}, ${meals}</span>
          <span class="cat-meta quiet">${trained}</span>
          ${recognition
            ? html`
                <div class="learning-row">
                  <span class="learning-track" aria-hidden="true"><span class="learning-fill" style="width:${recognition.percent}%"></span></span>
                </div>
                <span class="learning-state">${recognition.percent}% recognized, ${LEARNING_LABEL[recognition.state]}</span>
              `
            : nothing}
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-label=${`Options for ${cat.name}`}
            @click=${() => this._toggleCatMenu(cat.name)}
          >
            ${mdiIcon("dotsVertical")}
          </button>
          ${this._openMenuFor === cat.name ? this._renderCatMenu(cat) : nothing}
        </div>
      </div>
    `;
  }

  private _renderCatMenu(cat: CatsResponse["cats"][number]) {
    const confirming = this._deleteConfirmFor === cat.name;
    const expanded = this._expandedTraining === cat.name;
    return html`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${() => this._openAvatarPicker(cat.name)}>Change picture</button>
        <button type="button" role="menuitem" @click=${() => this._toggleTraining(cat.name)}>${expanded ? "Hide training photos" : `View training (${cat.training.total})`}</button>
        <button type="button" role="menuitem" class="danger ${confirming ? "confirming" : ""}" @click=${() => this._onDeleteCatClick(cat.name)}>
          ${confirming ? "Tap again to delete" : "Delete cat\u2026"}
        </button>
      </div>
    `;
  }

  private _toggleCatMenu(name: string): void {
    this._openMenuFor = this._openMenuFor === name ? null : name;
  }

  private _closeCatMenu(): void {
    this._openMenuFor = null;
    clearTimeout(this._deleteConfirmTimer);
    this._deleteConfirmFor = null;
  }

  private _onCatMenuFocusOut = (event: FocusEvent): void => {
    const container = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;
    if (!next || !container.contains(next)) this._closeCatMenu();
  };

  private _onCatMenuKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    const trigger = (event.currentTarget as HTMLElement).querySelector<HTMLButtonElement>(".cat-menu-trigger");
    this._closeCatMenu();
    trigger?.focus();
  };

  private _toggleTraining(name: string): void {
    this._openMenuFor = null;
    this._expandedTraining = this._expandedTraining === name ? null : name;
  }

  private _openAvatarPicker(name: string): void {
    this._openMenuFor = null;
    this._avatarPickerCat = name;
  }

  private _closeAvatarPicker(): void {
    this._avatarPickerCat = null;
    this._refreshCats();
  }

  /** Patches the just-changed cat's `avatar`/`avatar_custom` into the cached roster immediately
   * -- `_closeAvatarPicker`'s own `_refreshCats()` still follows right behind for full
   * consistency, but the tile updates the instant the picker reports success rather than
   * waiting on that round trip. */
  private _onAvatarChanged = (event: CustomEvent<{ cat: string; avatar: Asset | null; avatarCustom: boolean }>): void => {
    const { cat, avatar, avatarCustom } = event.detail;
    this._catsQuery.patch((data) => ({ ...data, cats: data.cats.map((c) => (c.name === cat ? { ...c, avatar, avatar_custom: avatarCustom } : c)) }));
  };

  /** Tap-twice confirm, the same window/pattern `kibble-settings-dialog`'s cloud toggle uses --
   * deleting a cat is destructive (drops every labelled sample and the classifier model) so it
   * needs a second, deliberate tap rather than a single accidental one. */
  private _onDeleteCatClick(name: string): void {
    if (this._deleteConfirmFor === name) {
      clearTimeout(this._deleteConfirmTimer);
      this._deleteConfirmFor = null;
      this._openMenuFor = null;
      this._deleteCat(name);
      return;
    }
    this._deleteConfirmFor = name;
    this._deleteConfirmTimer = setTimeout(() => {
      this._deleteConfirmFor = null;
      this.requestUpdate();
    }, DELETE_CONFIRM_WINDOW_MS);
  }

  private _deleteCat(name: string): void {
    const request = this._callWS<unknown>("kibble/cats/delete", { name });
    if (!request) return;
    request
      .then(() => {
        this._trainingFeeds.delete(name);
        if (this._expandedTraining === name) this._expandedTraining = null;
        this._refreshCats();
      })
      .catch((err: unknown) => {
        this._actionError = { message: `Couldn't delete ${name}. ${describeWsError(err)}`, retry: () => this._deleteCat(name) };
      });
  }

  private _renderAddCat() {
    return html`
      <form class="add-cat" @submit=${this._onAddCatSubmit}>
        <input
          type="text"
          placeholder="Add a cat"
          aria-label="New cat's name"
          .value=${this._addName}
          ?disabled=${this._addBusy}
          @input=${(event: Event) => {
            this._addName = (event.target as HTMLInputElement).value;
          }}
        />
        <button type="submit" ?disabled=${this._addBusy || !this._addName.trim()}>Add a cat</button>
        ${this._addError ? html`<span class="inline-error">${this._addError}</span>` : nothing}
      </form>
    `;
  }

  private async _onAddCatSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const name = this._addName.trim();
    const request = name ? this._callWS<unknown>("kibble/cats/add", { name }) : null;
    if (!request) return;
    this._addBusy = true;
    this._addError = null;
    try {
      await request;
      this._addName = "";
      this._refreshCats();
    } catch (err) {
      this._addError = describeWsError(err);
    } finally {
      this._addBusy = false;
    }
  }

  private _renderTrainingPanel(catName: string) {
    const feed = this._trainingFeed(catName);
    const state = feed.state;
    return html`
      <section class="training">
        <div class="training-heading">
          <span>${catName}\u2019s training photos${state.items !== null ? ` (${state.total})` : ""}</span>
          <button type="button" class="icon-button" aria-label="Close training photos" @click=${() => this._toggleTraining(catName)}>${mdiIcon("close")}</button>
        </div>
        <div class="training-actions">
          <button type="button" class="add-photos-button" @click=${() => this._openAddPhotos(catName)}>Add photos</button>
        </div>
        ${state.error ? this._renderPagedError(state.error, () => feed.refresh(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT)) : nothing}
        ${state.items && state.items.length === 0 ? html`<p class="empty">No training photos yet.</p>` : nothing}
        <div class="training-grid">${(state.items ?? []).map((sample) => this._renderTrainingTile(catName, sample))}</div>
        ${this._renderPager(state, TRAINING_LIMIT, () => feed.previous(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT), () => feed.next(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT))}
      </section>
    `;
  }

  private _renderTrainingTile(catName: string, sample: TrainingSample) {
    const captured = new Date(sample.created * 1000).toLocaleDateString();
    return html`
      <div class="training-tile">
        <span class="training-crops">
          ${sample.body ? html`<kibble-image .hass=${this.hass} .asset=${sample.body} .cache=${this._imageCache} alt=""></kibble-image>` : nothing}
          ${sample.face ? html`<kibble-image .hass=${this.hass} .asset=${sample.face} .cache=${this._imageCache} alt=""></kibble-image>` : nothing}
        </span>
        <button type="button" class="remove" aria-label=${`Remove this training photo of ${catName}, added ${captured}`} @click=${() => this._removeTraining(catName, sample.uid)}>
          ${mdiIcon("close")}
        </button>
      </div>
    `;
  }

  private _removeTraining(catName: string, uid: string): void {
    const request = this._callWS<{ removed: number }>("kibble/training/remove", { uids: [uid] });
    if (!request) return;
    request
      .then(() => {
        this._trainingFeed(catName).refresh(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT);
        this._refreshCats();
      })
      .catch((err: unknown) => {
        this._actionError = { message: `Couldn't remove this photo. ${describeWsError(err)}`, retry: () => this._removeTraining(catName, uid) };
      });
  }

  private _openAddPhotos(catName: string): void {
    this._addPhotosCat = catName;
    this.renderRoot.querySelector<HTMLInputElement>(".add-photos-file-input")?.click();
  }

  private _onAddPhotosChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? [...input.files] : [];
    input.value = "";
    if (files.length === 0) return;
    this._addPhotosFiles = files;
    this._addPhotosOpen = true;
  }

  private _closeAddPhotos(): void {
    this._addPhotosOpen = false;
    const catName = this._addPhotosCat;
    this._refreshCats();
    if (catName && this._expandedTraining === catName) {
      this._trainingFeed(catName).refresh(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT);
    }
  }

  private _renderPager(state: PagedFeedState<unknown>, limit: number, onPrevious: () => void, onNext: () => void) {
    if (state.items === null || (!state.hasNext && !state.hasPrevious)) return nothing;
    const start = state.pageIndex * limit + 1;
    const end = state.pageIndex * limit + state.items.length;
    return html`
      <div class="pager">
        <button type="button" ?disabled=${!state.hasPrevious || state.loading} @click=${onPrevious}>Previous</button>
        <span>${start}\u2013${end} of ${state.total}</span>
        <button type="button" ?disabled=${!state.hasNext || state.loading} @click=${onNext}>Next</button>
      </div>
    `;
  }

  private _renderPagedError(message: string, retry: () => void) {
    return html`
      <div class="error">
        <span>${message}</span>
        <button type="button" @click=${retry}>Try again</button>
      </div>
    `;
  }

  private _refreshCats(): void {
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) return;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as CatsResponse));
  }

  /** Shared `entry_id`-injecting wrapper for the WS commands this card calls directly (delete
   * cat, add cat, remove a training sample) -- `null` when the connection or entry isn't
   * resolved yet, the same guard every WS call site here already repeats individually. */
  private _callWS<T>(type: string, payload: Record<string, unknown>): Promise<T> | null {
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) return null;
    return callWS({ type, entry_id: entryId, ...payload }).then((r) => r as T);
  }

  static styles = css`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    ha-card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      overflow: hidden;
    }
    .container {
      container-type: inline-size;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .label {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button,
    .inline-error {
      font-size: var(--kibble-text-caption);
    }
    .error button {
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .roster {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat-tile {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 44px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.35;
    }
    .cat-name {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .cat-meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .cat-meta.quiet {
      opacity: 0.85;
    }
    .learning-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
    }
    .learning-track {
      flex: 1 1 auto;
      max-width: 96px;
      height: 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      overflow: hidden;
    }
    .learning-fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--kibble-feed, #43a96a);
    }
    .learning-state {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .cat-menu {
      position: relative;
      margin-left: auto;
    }
    .cat-menu-trigger {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
    }
    .cat-menu-trigger:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 5;
      margin-top: 4px;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      border-radius: 10px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: var(--ha-card-box-shadow, 0 4px 16px rgba(0, 0, 0, 0.25));
    }
    .menu button {
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: var(--kibble-text-body);
      text-align: left;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      min-height: 40px;
    }
    .menu button:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .menu .danger {
      color: var(--error-color, #db4437);
    }
    .menu .danger.confirming {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    .cat-menu-trigger:focus-visible,
    .menu button:focus-visible,
    .icon-button:focus-visible,
    .select-toggle:focus-visible,
    .review-thumb:focus-visible,
    .chip:focus-visible,
    .pager button:focus-visible,
    .remove:focus-visible,
    .add-photos-button:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .add-cat {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .add-cat input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
      font-size: var(--kibble-text-body);
    }
    .add-cat button {
      min-height: 40px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      padding: 0 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .add-cat button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .inline-error {
      color: var(--error-color, #db4437);
    }
    .training {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color);
    }
    .training-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .training-actions {
      display: flex;
    }
    .add-photos-button {
      min-height: 48px;
      padding: 0 16px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .icon-button {
      width: 48px;
      height: 48px;
      font-size: 20px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .training-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .training-tile {
      position: relative;
    }
    .training-crops {
      display: flex;
      gap: 2px;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .remove {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    /* The round button is small on the photo; this keeps its tap target at 44px. */
    .remove::after {
      content: "";
      position: absolute;
      inset: -8px;
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .pager button {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 0 14px;
      min-height: 36px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .pager button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .storage-line {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .storage-line .quiet {
      opacity: 0.75;
    }
    @container (max-width: 360px) {
      .training-grid,
      .review-grid {
        grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
      }
    }
  `;
}

customElements.define("kibble-cats-card", KibbleCatsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-cats-card",
  name: "Kibble Cats",
  description: "Enrolled cats, presence, and the review queue for whatever the feeder couldn't name.",
  preview: true,
});

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
  interface HTMLElementTagNameMap {
    "kibble-cats-card": KibbleCatsCard;
  }
}
