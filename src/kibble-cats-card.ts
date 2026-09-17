/** Training as confirmation: enrolled cats up top, a one-tap inbox of pending face crops below.
 * Each crop already carries what the feeder's own identifier and Kibble's classifier think, so
 * the default gesture is one tap that means "yes" -- everything else (the chooser, per-cat
 * galleries) is the correction path, not the common case. See DESIGN.md for the full rationale.
 *
 * v1 scope note: single-crop confirm/choose/undo and per-cat gallery removal are implemented in
 * full; DESIGN.md's "Select mode" bulk bar (checkbox multi-select, "Confirm all <cat>"/"Label
 * as...") is not yet built -- every crop is handled one at a time. See README.md.
 */

import { LitElement, css, html, nothing } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { CatSample, FaceUploadResult, HomeAssistant, KibbleCatSummary, KibbleCatsCardConfig, PendingFaceCrop, TimelineIdentifiedItem, TimelineItem } from "./types";
import { resolveKibbleEntities, type KibbleEntities } from "./lib/resolve-entities";
import { resolveEntryId } from "./lib/entry-id";
import { WsQuery, watchKey, describeWsError } from "./lib/ws-query";
import { ImageUrlCache, kibbleImageUrl } from "./lib/image-cache";
import { relativeTimeSentence } from "./lib/relative-time";
import { detectionHeadline } from "./lib/timeline";
import { chooseSuggestion } from "./lib/suggestion";
import "./components/kibble-avatar";
import "./components/kibble-crop-dialog";
import "./components/kibble-face-picker";
import "./cats-editor";

const EMPTY_ENTITIES: KibbleEntities = { deviceId: "", catPresence: [] };

function catSectionId(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/** The cat named by a `#cat=<name>` hash (URL-encoded), else null. */
export function catFromHash(hash: string): string | null {
  const match = /^#cat=(.+)$/.exec(hash);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
const DEFAULT_CONFIDENCE = 0.7;
const UNDO_WINDOW_MS = 5000;
const DELETE_CONFIRM_WINDOW_MS = 3000;

interface UndoAction {
  message: string;
  run: () => void;
}

export class KibbleCatsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _hiddenCrops: { state: true },
    _pickerCrop: { state: true },
    _undo: { state: true },
    _addName: { state: true },
    _addBusy: { state: true },
    _addError: { state: true },
    _actionError: { state: true },
    _openMenuFor: { state: true },
    _deleteConfirmFor: { state: true },
    _uploadQueue: { state: true },
    _uploadQueueTotal: { state: true },
    _uploadCat: { state: true },
    _uploadBusy: { state: true },
    _uploadError: { state: true },
    _uploadNotice: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: KibbleCatsCardConfig | undefined;
  declare _hiddenCrops: Set<string>;
  declare _pickerCrop: PendingFaceCrop | null;
  declare _undo: UndoAction | null;
  declare _addName: string;
  declare _addBusy: boolean;
  declare _addError: string | null;
  declare _actionError: { message: string; retry: () => void } | null;
  /** Which cat's kebab menu is currently open, or `null`. At most one at a time. */
  declare _openMenuFor: string | null;
  /** Which cat's "Delete cat\u2026" button is armed for a second tap, or `null`. */
  declare _deleteConfirmFor: string | null;
  /** Photos still queued for the crop dialog, front is the one currently shown. */
  declare _uploadQueue: File[];
  /** Size of the batch `_uploadQueue` started from, for the dialog's "Photo X of Y". */
  declare _uploadQueueTotal: number;
  /** The cat `_uploadQueue`'s photos are being added to, or `null` when no batch is active. */
  declare _uploadCat: string | null;
  declare _uploadBusy: boolean;
  declare _uploadError: string | null;
  declare _uploadNotice: string | null;

  private _entities: KibbleEntities = EMPTY_ENTITIES;
  private _entryId: string | undefined;
  // See `kibble-card.ts`'s identical fields: avoids recomputing entity-role resolution on
  // every `hass` tick (which is most of them, system-wide) when the registries didn't move.
  private _resolvedEntities: HomeAssistant["entities"] | undefined;
  private _resolvedDevices: HomeAssistant["devices"] | undefined;
  private _resolvedDeviceId: string | undefined;
  private _catsQuery = new WsQuery<{ cats: KibbleCatSummary[] }>(() => this.requestUpdate());
  private _pendingQuery = new WsQuery<{ crops: PendingFaceCrop[] }>(() => this.requestUpdate());
  private _sampleQueries = new Map<string, WsQuery<{ samples: CatSample[] }>>();
  /** The same identified rows the timeline shows -- a "sighting" here means exactly what
   * "Kitty was here" means there, so the two never disagree about how often a cat came by. */
  private _timelineQuery = new WsQuery<{ items: TimelineItem[] }>(() => this.requestUpdate());
  private _imageCache = new ImageUrlCache();
  private _lastPendingData: { crops: PendingFaceCrop[] } | null = null;
  private _undoTimer: number | undefined;
  private _pickerTrigger: HTMLElement | null = null;
  private _deleteConfirmTimer: number | undefined;
  private _fileInputRef = createRef<HTMLInputElement>();

  constructor() {
    super();
    this._hiddenCrops = new Set();
    this._pickerCrop = null;
    this._undo = null;
    this._addName = "";
    this._addBusy = false;
    this._addError = null;
    this._actionError = null;
    this._openMenuFor = null;
    this._deleteConfirmFor = null;
    this._uploadQueue = [];
    this._uploadQueueTotal = 0;
    this._uploadCat = null;
    this._uploadBusy = false;
    this._uploadError = null;
    this._uploadNotice = null;
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
    window.addEventListener("location-changed", this._onLocationChanged);
    window.addEventListener("hashchange", this._onLocationChanged);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("location-changed", this._onLocationChanged);
    window.removeEventListener("hashchange", this._onLocationChanged);
    this._imageCache.dispose();
    clearTimeout(this._undoTimer);
    clearTimeout(this._deleteConfirmTimer);
  }

  private _confidence(): number {
    return this._config?.confidence ?? DEFAULT_CONFIDENCE;
  }

  /** `/cat-feeder/cats#cat=Pancake` (what the feeder view's cat tiles navigate to) lands on
   * that cat's section: scrolled into view and briefly lit, once its gallery has rendered. */
  private _scrolledTo: string | null = null;

  private _onLocationChanged = (): void => {
    this._scrolledTo = null;
    this.requestUpdate();
  };

  protected updated(): void {
    const target = catFromHash(window.location.hash);
    if (!target || this._scrolledTo === target) return;
    const section = this.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(catSectionId(target))}`);
    if (!section) return;
    this._scrolledTo = target;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.classList.add("lit");
    setTimeout(() => section.classList.remove("lit"), 2400);
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
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      const key = watchKey(this.hass, [this._entities.pendingFace, this._entities.lastSeenPet]);
      this._catsQuery.sync(key, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as { cats: KibbleCatSummary[] }));
      this._pendingQuery.sync(key, () => callWS({ type: "kibble/faces/pending", entry_id: entryId }).then((r) => r as { crops: PendingFaceCrop[] }));
      this._timelineQuery.sync(key, () => callWS({ type: "kibble/timeline", entry_id: entryId, include_visits: false }).then((r) => r as { items: TimelineItem[] }));
      for (const cat of this._catsQuery.state.data?.cats ?? []) {
        if (this._sampleQueries.has(cat.name)) continue;
        const query = new WsQuery<{ samples: CatSample[] }>(() => this.requestUpdate());
        this._sampleQueries.set(cat.name, query);
      }
      // Samples only actually change on a label/unlabel/upload/delete -- every card-driven one
      // of those already calls `_refreshAll()` directly. `pendingFace` (not `lastSeenPet`) is
      // the one push signal worth resyncing on top of that: it also catches another session's
      // edit, without every enrolled cat's full sample list refetching on every bare detection
      // (`lastSeenPet` changes on *any* cat seen at the bowl, labelled or not).
      const samplesKey = watchKey(this.hass, [this._entities.pendingFace]);
      for (const [name, query] of this._sampleQueries) {
        query.sync(samplesKey, () => callWS({ type: "kibble/faces/samples", entry_id: entryId, cat: name }).then((r) => r as { samples: CatSample[] }));
      }
    }
    // Fresh server data supersedes any optimistic hide -- clear once a new fetch result lands.
    if (this._pendingQuery.state.data !== this._lastPendingData) {
      this._lastPendingData = this._pendingQuery.state.data;
      this._hiddenCrops = new Set();
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const cats = this._catsQuery.state.data?.cats ?? [];
    const allCrops = this._pendingQuery.state.data?.crops ?? [];
    const crops = allCrops.filter((crop) => !this._hiddenCrops.has(crop.name));
    const catNames = new Set(cats.map((cat) => cat.name));
    const presentNames = new Set(
      this._entities.catPresence.filter((p) => this.hass.states[p.entityId]?.state === "on").map((p) => p.name),
    );
    const uploadFile = this._uploadQueue[0] ?? null;
    const uploadIndex = this._uploadQueueTotal - this._uploadQueue.length;

    return html`
      <ha-card>
        <div class="container">
          ${this._config.name ? html`<div class="label">${this._config.name}</div>` : nothing}
          ${this._actionError ? this._renderActionError() : nothing}
          ${this._uploadNotice ? this._renderUploadNotice() : nothing}
          <section class="header">
            ${cats.length === 0 ? html`<p class="empty">No cats yet. Add one to start training.</p>` : html`<div class="cat-list">${cats.map((cat) => this._renderCatHeader(cat, presentNames.has(cat.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${crops.length === 1 ? "1 to review" : `${crops.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error ? this._renderPendingError() : nothing}
            ${crops.length === 0 && !this._pendingQuery.state.error
              ? html`<p class="empty">Nothing to review. New crops arrive when the feeder identifies a cat in view.</p>`
              : html`<div class="crop-grid" @keydown=${this._onGridKeydown}>${crops.map((crop) => this._renderCrop(crop, catNames))}</div>`}
          </section>
          ${cats.map((cat) => this._renderGallery(cat))}
        </div>
      </ha-card>
      ${this._undo ? this._renderUndo(this._undo) : nothing}
      <kibble-face-picker
        ?open=${this._pickerCrop !== null}
        .hass=${this.hass}
        .cats=${cats}
        .entryId=${this._entryId}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
      <input type="file" accept="image/*" multiple class="visually-hidden" ${ref(this._fileInputRef)} @change=${this._onFilesChosen} />
      <kibble-crop-dialog
        ?open=${uploadFile !== null}
        .file=${uploadFile}
        .catName=${this._uploadCat}
        .queueIndex=${uploadIndex}
        .queueTotal=${this._uploadQueueTotal}
        .busy=${this._uploadBusy}
        .error=${this._uploadError}
        @use-crop=${this._onUseCrop}
        @close-requested=${this._onCropDialogClosed}
      ></kibble-crop-dialog>
    `;
  }

  private _renderCatHeader(cat: KibbleCatSummary, present: boolean) {
    const seen = cat.last_seen != null ? `seen ${relativeTimeSentence(new Date(cat.last_seen * 1000), new Date())}` : "not seen yet";
    return html`
      <div class="cat">
        <kibble-avatar
          class=${present ? "present" : ""}
          .hass=${this.hass}
          .name=${cat.name}
          .colorIndex=${cat.color_index}
          .entryId=${this._entryId}
          .sampleName=${cat.avatar}
        ></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${cat.name}</span>
          <span class="cat-meta">${cat.samples === 1 ? "1 sample" : `${cat.samples} samples`}, ${seen}</span>
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-expanded=${this._openMenuFor === cat.name}
            aria-label=${`Options for ${cat.name}`}
            @click=${() => this._toggleCatMenu(cat.name)}
          >
            &#8942;
          </button>
          ${this._openMenuFor === cat.name ? this._renderCatMenu(cat) : nothing}
        </div>
      </div>
    `;
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
    if (!name || !this._entities.deviceId) return;
    this._addBusy = true;
    this._addError = null;
    try {
      await this.hass.callService("kibble", "add_cat", { device_id: this._entities.deviceId, name });
      this._addName = "";
      this._refreshCats();
    } catch (err) {
      this._addError = describeWsError(err);
    } finally {
      this._addBusy = false;
    }
  }

  private _renderCatMenu(cat: KibbleCatSummary) {
    const confirming = this._deleteConfirmFor === cat.name;
    return html`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${() => this._startAddPhotos(cat.name)}>Add photos</button>
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

  /** A menu dismisses itself once focus genuinely leaves its trigger+popover -- no backdrop
   * element, no global listener, just the same "did focus move outside this container" check a
   * native disclosure widget uses. */
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

  /** Tap-twice confirm, the same window/pattern `kibble-settings-dialog`'s cloud toggle uses --
   * deleting a cat is destructive (it drops every labelled sample and the classifier model) so
   * it needs a second, deliberate tap rather than a single accidental one. */
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
    }, DELETE_CONFIRM_WINDOW_MS) as unknown as number;
  }

  private _deleteCat(name: string): void {
    const request = this._callWS<unknown>("kibble/cats/delete", { name });
    if (!request) return;
    request
      .then(() => {
        this._sampleQueries.delete(name);
        this._refreshCats();
      })
      .catch((err: unknown) => {
        this._actionError = { message: `Couldn't delete ${name}. ${describeWsError(err)}`, retry: () => this._deleteCat(name) };
      });
  }

  private _startAddPhotos(name: string): void {
    this._openMenuFor = null;
    this._uploadCat = name;
    this._fileInputRef.value?.click();
  }

  /** Starts (or restarts) the crop-dialog queue from a freshly chosen file list -- one dialog
   * per photo, front of the queue first; `input.value` is cleared so choosing the exact same
   * file(s) again still fires `change`. */
  private _onFilesChosen = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files).filter((file) => file.type.startsWith("image/")) : [];
    input.value = "";
    if (files.length === 0) return;
    this._uploadQueue = files;
    this._uploadQueueTotal = files.length;
    this._uploadError = null;
  };

  private _onUseCrop = (event: CustomEvent<{ blob: Blob }>): void => {
    const cat = this._uploadCat;
    if (!cat) return;
    this._uploadBusy = true;
    this._uploadError = null;
    this._blobToBase64(event.detail.blob)
      .then((jpegB64) => {
        const request = this._callWS<FaceUploadResult>("kibble/faces/upload", { cat, jpeg_b64: jpegB64 });
        if (!request) throw new Error("Not connected.");
        return request;
      })
      .then((result) => {
        this._uploadBusy = false;
        if (result.low_quality) this._uploadNotice = "The model isn't confident this is a face.";
        this._advanceUploadQueue();
        this._refreshAll();
      })
      .catch((err: unknown) => {
        this._uploadBusy = false;
        this._uploadError = describeWsError(err);
      });
  };

  /** Closing the dialog without uploading skips just the current photo -- the rest of the batch
   * still runs, matching "Skip" rather than aborting everything queued after it. */
  private _onCropDialogClosed = (): void => {
    this._advanceUploadQueue();
  };

  private _advanceUploadQueue(): void {
    this._uploadQueue = this._uploadQueue.slice(1);
    this._uploadError = null;
    if (this._uploadQueue.length === 0) {
      this._uploadCat = null;
      this._uploadQueueTotal = 0;
    }
  }

  /** Pure base64, no `data:` URL prefix -- the integration base64-decodes this straight into
   * the raw JPEG bytes `POST /faces/upload` expects. */
  private _blobToBase64(blob: Blob): Promise<string> {
    return blob.arrayBuffer().then((buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
      return btoa(binary);
    });
  }

  /** Shared `entry_id`-injecting wrapper for the three cat-management commands this card calls
   * over WS directly (delete cat, upload a sample, delete an uploaded sample) -- `null` when
   * the connection or entry isn't resolved yet, the same guard every WS call site here already
   * repeats individually. */
  private _callWS<T>(type: string, payload: Record<string, unknown>): Promise<T> | null {
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) return null;
    return callWS({ type, entry_id: entryId, ...payload }).then((r) => r as T);
  }

  private _renderUploadNotice() {
    return html`
      <div class="notice">
        <span>${this._uploadNotice}</span>
        <button
          type="button"
          aria-label="Dismiss"
          @click=${() => {
            this._uploadNotice = null;
          }}
        >
          &times;
        </button>
      </div>
    `;
  }

  private _renderCrop(crop: PendingFaceCrop, catNames: ReadonlySet<string>) {
    const suggestion = chooseSuggestion(crop, this._confidence(), catNames);
    const path = this._entryId ? kibbleImageUrl(this._entryId, "pending", crop.name) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    return html`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!url}
          aria-label=${suggestion ? `Confirm ${suggestion.cat}` : "Choose a cat for this crop"}
          @click=${() => this._onCropTap(crop, suggestion)}
        >
          ${url ? html`<img src=${url} alt="" loading="lazy" />` : nothing}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${(e: Event) => this._openPicker(crop, e)}>&#8942;</button>
        <div class="chip ${suggestion ? `chip-${suggestion.source}` : "chip-empty"}">
          ${suggestion ? html`${suggestion.cat}<span class="mark">${suggestion.source === "classifier" ? "AI" : "ID"}</span>` : "Tap to choose"}
        </div>
      </div>
    `;
  }

  private _onGridKeydown(event: KeyboardEvent): void {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const grid = event.currentTarget as HTMLElement;
    const buttons = [...grid.querySelectorAll<HTMLButtonElement>(".crop-thumb")];
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = buttons[(currentIndex + delta + buttons.length) % buttons.length];
    next?.focus();
  }

  private _onCropTap(crop: PendingFaceCrop, suggestion: ReturnType<typeof chooseSuggestion>): void {
    if (!suggestion) {
      this._pickerCrop = crop;
      return;
    }
    this._confirm(crop, suggestion.cat);
  }

  private _openPicker(crop: PendingFaceCrop, event: Event): void {
    this._pickerTrigger = event.currentTarget as HTMLElement;
    this._pickerCrop = crop;
  }

  private _closePicker = (): void => {
    this._pickerCrop = null;
    this._pickerTrigger?.focus();
    this._pickerTrigger = null;
  };

  private _onPickerChoice = (event: CustomEvent<{ cat: string }>): void => {
    const crop = this._pickerCrop;
    this._pickerCrop = null;
    if (crop) this._confirm(crop, event.detail.cat);
  };

  private _confirm(crop: PendingFaceCrop, cat: string): void {
    if (!this._entities.deviceId) return;
    const deviceId = this._entities.deviceId;
    this._hiddenCrops = new Set(this._hiddenCrops).add(crop.name);
    const displayCat = cat === "not_a_cat" ? "Not a cat" : cat === "other" ? "Skip" : cat;
    this.hass
      .callService("kibble", "label_face", { device_id: deviceId, crop_id: crop.name, cat })
      .then(() => {
        this._refreshAll();
        this._setUndo({
          message: `Labelled as ${displayCat}. `,
          run: () => {
            this.hass.callService("kibble", "unlabel_face", { device_id: deviceId, cat, name: crop.name }).then(() => this._refreshAll());
          },
        });
      })
      .catch((err: unknown) => {
        const next = new Set(this._hiddenCrops);
        next.delete(crop.name);
        this._hiddenCrops = next;
        this._actionError = { message: `Couldn't label this crop. ${describeWsError(err)}`, retry: () => this._confirm(crop, cat) };
      });
  }

  private _setUndo(action: UndoAction): void {
    clearTimeout(this._undoTimer);
    this._undo = action;
    this._undoTimer = setTimeout(() => {
      this._undo = null;
    }, UNDO_WINDOW_MS) as unknown as number;
  }

  private _renderUndo(action: UndoAction) {
    return html`
      <div class="undo-bar" role="status">
        <span>${action.message}</span>
        <button
          type="button"
          @click=${() => {
            clearTimeout(this._undoTimer);
            this._undo = null;
            action.run();
          }}
        >
          Undo
        </button>
      </div>
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

  private _renderPendingError() {
    const message = this._pendingQuery.state.error;
    if (!message) return nothing;
    return html`
      <div class="error">
        <span>Couldn't load the review queue. ${message}</span>
        <button type="button" @click=${() => this._refreshPending()}>Try again</button>
      </div>
    `;
  }

  /** Per cat: the feeder's own captures first ("Sightings", newest first, each with when it
   * happened -- this is exactly what the "last here" on the feeder view counts, so tapping that
   * tile lands here and finds the same evidence), then the reference photos someone uploaded. */
  private _renderGallery(cat: KibbleCatSummary) {
    const query = this._sampleQueries.get(cat.name);
    const samples = (query?.state.data?.samples ?? []).slice().sort((a, b) => b.ts - a.ts);
    const sightings = (this._timelineQuery.state.data?.items ?? []).filter(
      (item): item is TimelineIdentifiedItem => item.kind === "identified" && item.cat === cat.name,
    );
    if (samples.length === 0 && cat.samples === 0 && sightings.length === 0) return nothing;
    const now = new Date();
    return html`
      <section class="gallery" id=${catSectionId(cat.name)}>
        <div class="gallery-header">
          <kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color_index} .entryId=${this._entryId} .sampleName=${cat.avatar}></kibble-avatar>
          <span class="gallery-name">${cat.name}</span>
          <span class="gallery-sub">${sightings.length === 0 ? "No sightings yet" : sightings.length === 1 ? "1 sighting" : `${sightings.length} sightings`}</span>
        </div>
        ${sightings.length > 0
          ? html`<div class="gallery-grid">${sightings.map((item) => this._renderSighting(item, now))}</div>`
          : nothing}
        ${samples.length > 0
          ? html`<div class="gallery-sub">${samples.length === 1 ? "1 training photo" : `${samples.length} training photos`}</div>
              <div class="gallery-grid">${samples.map((sample) => this._renderSample(cat.name, sample, null))}</div>`
          : nothing}
      </section>
    `;
  }

  /** One identified visit, with the live image from that moment when the feeder kept one
   * (a vendor `track` pairs with the nearest visit/eat frame; a labelled face crop is its own
   * image) -- the same picture the timeline row shows. */
  private _renderSighting(item: TimelineIdentifiedItem, now: Date) {
    const when = relativeTimeSentence(new Date(item.ts * 1000), now);
    const path = item.image && this._entryId ? kibbleImageUrl(this._entryId, item.image_kind, item.image) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    const title = `${detectionHeadline(item)}, ${new Date(item.ts * 1000).toLocaleString()}`;
    return html`
      <div class="sample sighting" title=${title}>
        ${url ? html`<img src=${url} alt="" loading="lazy" />` : html`<kibble-avatar .hass=${this.hass} .name=${null} .colorIndex=${null} .entryId=${this._entryId} .sampleName=${null}></kibble-avatar>`}
        <span class="caption">${item.paired_class === "eat" ? "ate · " : ""}${when}</span>
      </div>
    `;
  }

  private _renderSample(catName: string, sample: CatSample, caption: string | null) {
    const path = this._entryId ? kibbleImageUrl(this._entryId, `sample/${catName}`, sample.name) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    return html`
      <div class="sample">
        ${url ? html`<img src=${url} alt="" loading="lazy" title=${new Date(sample.ts * 1000).toLocaleString()} />` : nothing}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${catName}`} @click=${() => this._removeSample(catName, sample)}>
          ${"\u00d7"}
        </button>
        ${caption ? html`<span class="caption">${caption}</span>` : nothing}
      </div>
    `;
  }

  /** `upload-*` samples came in through `kibble/faces/upload`, never through the pending-crop
   * inbox -- unlabelling would try to move a name `GET /faces/pending` never produced, so
   * removing one goes through the dedicated `kibble/faces/delete_sample` command instead. */
  private _removeSample(cat: string, sample: CatSample): void {
    if (sample.name.startsWith("upload-")) {
      const request = this._callWS<unknown>("kibble/faces/delete_sample", { cat, name: sample.name });
      if (!request) return;
      request.then(() => this._refreshAll()).catch((err: unknown) => {
        this._actionError = { message: `Couldn't remove this sample. ${describeWsError(err)}`, retry: () => this._removeSample(cat, sample) };
      });
      return;
    }
    if (!this._entities.deviceId) return;
    const deviceId = this._entities.deviceId;
    this.hass
      .callService("kibble", "unlabel_face", { device_id: deviceId, cat, name: sample.name })
      .then(() => this._refreshAll())
      .catch((err: unknown) => {
        this._actionError = { message: `Couldn't remove this sample. ${describeWsError(err)}`, retry: () => this._removeSample(cat, sample) };
      });
  }

  private _refreshCats(): void {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r) => r as { cats: KibbleCatSummary[] }));
  }

  private _refreshPending(): void {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    this._pendingQuery.refresh(() => callWS({ type: "kibble/faces/pending", entry_id: entryId }).then((r) => r as { crops: PendingFaceCrop[] }));
  }

  private _refreshAll(): void {
    this._refreshCats();
    this._refreshPending();
    if (this.hass?.callWS && this._entryId) {
      const callWS = this.hass.callWS;
      const entryId = this._entryId;
      this._timelineQuery.refresh(() => callWS({ type: "kibble/timeline", entry_id: entryId, include_visits: false }).then((r) => r as { items: TimelineItem[] }));
    }
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    for (const [name, query] of this._sampleQueries) {
      query.refresh(() => callWS({ type: "kibble/faces/samples", entry_id: entryId, cat: name }).then((r) => r as { samples: CatSample[] }));
    }
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
    .notice {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-caption);
    }
    .notice button {
      flex: 0 0 auto;
      border: none;
      background: none;
      color: inherit;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      min-width: 32px;
      min-height: 32px;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 40px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
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
      min-width: 160px;
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
    .menu button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
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
    .inbox {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .inbox-heading {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .crop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .crop {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .crop-thumb {
      width: 100%;
      aspect-ratio: 1;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .crop-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .crop-thumb:focus-visible,
    .chooser:focus-visible,
    .remove:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible,
    .undo-bar button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chooser {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      cursor: pointer;
      line-height: 1;
      font-size: 14px;
    }
    .chip {
      font-size: 11px;
      text-align: center;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .chip-classifier {
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }
    .chip-vendor {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .mark {
      font-size: 9px;
      font-weight: 700;
      padding: 0 4px;
      border-radius: 4px;
      background: color-mix(in srgb, currentColor 16%, transparent);
    }
    .undo-bar {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 999px;
      background: #222;
      color: #fff;
      font-size: var(--kibble-text-body);
      z-index: 10;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .undo-bar button {
      border: none;
      background: none;
      color: #8ecbff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .undo-bar {
        animation: kibble-undo-in 150ms ease-out;
      }
    }
    @keyframes kibble-undo-in {
      from {
        opacity: 0;
        transform: translate(-50%, 8px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .gallery {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
      scroll-margin-top: 16px;
    }
    .gallery-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      outline: 2px solid transparent;
      outline-offset: 4px;
      transition: outline-color 600ms ease;
    }
    .gallery.lit .gallery-header {
      outline-color: var(--kibble-amber, #f2a33c);
    }
    .gallery-name {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .gallery-sub {
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
    }
    .sample.sighting kibble-avatar {
      display: block;
      width: 100%;
      height: 100%;
      --kibble-avatar-size: 56px;
    }
    .sample .caption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1px 3px;
      font-size: 10px;
      line-height: 1.2;
      color: #fff;
      background: rgba(0, 0, 0, 0.55);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 0 0 8px 8px;
    }
    .gallery-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sample {
      position: relative;
      width: 56px;
      height: 56px;
    }
    .sample img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
    }
    @container (max-width: 360px) {
      .crop-grid {
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      }
    }
  `;
}

customElements.define("kibble-cats-card", KibbleCatsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-cats-card",
  name: "Kibble Cats",
  description: "Enrolled cats -- delete or add training photos -- plus a one-tap inbox for the feeder's own face crops.",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "kibble-cats-card": KibbleCatsCard;
  }
}
