/** Session-level review rules shared by the sheet and its host cards. Kept pure where possible so
 * the multi-cat decisions, title, photo ownership and on-photo picker placement can be tested
 * without Home Assistant or DOM state.
 */

import type { Box, EventDetail, HomeAssistant, Sample, SessionCat, TimelineEvent } from "../types";

export type SessionVerdict = "not_a_cat" | "unknown";
export type SessionChipState = "confirmed" | "suggested" | "neutral";

export interface SessionCatChoice {
  cat: string;
  ate: boolean;
}

export interface SessionLabelRequest {
  uid: string;
  cats?: SessionCatChoice[];
  verdict?: SessionVerdict;
  /** Names given to individual boxes on the scene photo, saved right after the answer. */
  subjects?: { sid: number; label: string }[];
}

/** The sheet's unsaved answer: nothing here is sent until the person presses Confirm, so every
 * tap is freely reversible and a tap only ever does one visible thing to one cat. */
export interface SessionDraft {
  cats: SessionCatChoice[];
  notACat: boolean;
  /** Box names chosen on the scene photo, by feeder subject id. */
  subjects: Record<number, string>;
}

/** The draft a freshly opened sheet starts from: exactly what the session says now, the
 * identity engine's suggestions included (pre-ticked, so the everyday case is one tap). */
export function draftFrom(cats: readonly SessionCat[], identity: TimelineEvent["identity"]): SessionDraft {
  return { cats: cats.map(({ cat, ate }) => ({ cat, ate })), notACat: identity === "not_a_cat", subjects: {} };
}

/** A cat chip tap: ticks the cat if unticked, unticks it if ticked. Nothing else changes, so
 * "Pancake was here too" and "it was Pancake, not Kitty" are both obvious, never a surprise. */
export function toggleDraftCat(draft: SessionDraft, name: string, isMeal: boolean): SessionDraft {
  const present = draft.cats.some((cat) => cat.cat === name);
  return {
    ...draft,
    notACat: false,
    cats: present ? draft.cats.filter((cat) => cat.cat !== name) : [...draft.cats, { cat: name, ate: isMeal }],
  };
}

/** "Not a cat" is exclusive: ticking it clears every cat; tapping it again unticks it. */
export function toggleDraftNotACat(draft: SessionDraft): SessionDraft {
  return draft.notACat ? { ...draft, notACat: false } : { ...draft, notACat: true, cats: [] };
}

export function setDraftAte(draft: SessionDraft, name: string, ate: boolean): SessionDraft {
  return { ...draft, cats: draft.cats.map((cat) => cat.cat === name ? { ...cat, ate } : cat) };
}

/** Naming one box on the photo. A cat name also ticks that cat, since it was clearly here. */
export function nameDraftSubject(draft: SessionDraft, sid: number, label: string, isMeal: boolean): SessionDraft {
  const subjects = { ...draft.subjects, [sid]: label };
  if (label === "not_a_cat" || draft.cats.some((cat) => cat.cat === label)) return { ...draft, subjects };
  return { ...draft, subjects, notACat: false, cats: [...draft.cats, { cat: label, ate: isMeal }] };
}

/** How one roster chip looks: ticked by a person (or already confirmed), ticked only because
 * the engine suggested it and nobody has touched it (dashed), or not ticked. */
export function draftChipState(draft: SessionDraft, saved: readonly SessionCat[], name: string): SessionChipState {
  if (!draft.cats.some((cat) => cat.cat === name)) return "neutral";
  const savedCat = saved.find((cat) => cat.cat === name);
  return savedCat && !savedCat.confirmed ? "suggested" : "confirmed";
}

export type ConfirmAction =
  | { kind: "close"; text: string }
  | { kind: "save"; text: string; request: Omit<SessionLabelRequest, "uid"> }
  | { kind: "blocked"; text: string };

/** The sheet's one primary button. "Done" only when there is truly nothing to save. */
export function confirmAction(draft: SessionDraft, saved: readonly SessionCat[], identity: TimelineEvent["identity"]): ConfirmAction {
  const subjects = Object.entries(draft.subjects).map(([sid, label]) => ({ sid: Number(sid), label }));
  const extra = subjects.length ? { subjects } : {};
  if (draft.notACat) {
    if (identity === "not_a_cat" && !subjects.length) return { kind: "close", text: "Done" };
    return { kind: "save", text: "Confirm not a cat", request: { verdict: "not_a_cat", ...extra } };
  }
  if (draft.cats.length === 0) return { kind: "blocked", text: "Pick who was here" };
  const unchanged = identity !== "not_a_cat"
    && saved.length === draft.cats.length
    && saved.every((cat) => cat.confirmed && draft.cats.some((d) => d.cat === cat.cat && d.ate === cat.ate))
    && !subjects.length;
  if (unchanged) return { kind: "close", text: "Done" };
  return { kind: "save", text: "Confirm " + joinNames(draft.cats.map((cat) => cat.cat)), request: { cats: draft.cats.map((cat) => ({ ...cat })), ...extra } };
}

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return names[0] + " and " + names[1];
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
}

/** Live sheet title from the session cats. */
export function sessionTitle(cats: readonly Pick<SessionCat, "cat" | "ate">[], event: Pick<TimelineEvent, "identity" | "open">): string {
  if (event.identity === "not_a_cat") return "Not a cat";
  if (cats.length === 0) return "Who was this?";
  const groups = new Map<string, string[]>();
  for (const cat of cats) {
    const verb = event.open ? (cat.ate ? "is eating" : "is here") : (cat.ate ? "ate" : "came by");
    const names = groups.get(verb) ?? [];
    names.push(cat.cat);
    groups.set(verb, names);
  }
  return [...groups].map(([verb, names]) => joinNames(names) + " " + verb).join(", ");
}

export interface NamePickerPlacement {
  left: number;
  top: number;
  flipped: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Places the subject-name picker below its box, or above it near the photo's bottom edge.
 * Coordinates are local pixels inside the photo. The returned rectangle stays inside the frame.
 */
export function placeNamePicker(
  box: Box,
  frameWidth: number,
  frameHeight: number,
  pickerWidth: number,
  pickerHeight: number,
  gap = 8,
  inset = 8,
): NamePickerPlacement {
  if (!(frameWidth > 0) || !(frameHeight > 0)) return { left: 0, top: 0, flipped: false };
  const safeInset = Math.max(0, Math.min(inset, frameWidth / 2, frameHeight / 2));
  const width = Math.min(Math.max(0, pickerWidth), Math.max(0, frameWidth - safeInset * 2));
  const height = Math.min(Math.max(0, pickerHeight), Math.max(0, frameHeight - safeInset * 2));
  const maxLeft = frameWidth - safeInset - width;
  const maxTop = frameHeight - safeInset - height;
  const anchorX = ((box[0] + box[2]) / 2) * frameWidth;
  const left = clamp(anchorX - width / 2, safeInset, maxLeft);
  const below = box[3] * frameHeight + gap;
  const above = box[1] * frameHeight - gap - height;
  const canFitBelow = below <= maxTop;
  const canFitAbove = above >= safeInset;
  const flipped = !canFitBelow && canFitAbove;
  return { left, top: clamp(flipped ? above : below, safeInset, maxTop), flipped };
}

export interface SessionPhotoSection {
  cat: string;
  samples: Sample[];
}

/** Groups every photo into a session cat section. Photos with no selected cat, or with a stale
 * cat name, follow the main part: most explicitly-owned photos, with the first cat winning ties.
 */
export function groupSessionPhotos(samples: readonly Sample[], cats: readonly SessionCat[]): SessionPhotoSection[] {
  if (cats.length < 2) return [];
  const sections = cats.map((cat) => ({ cat: cat.cat, samples: [] as Sample[] }));
  const byName = new Map(sections.map((section) => [section.cat, section]));
  const unassigned: Sample[] = [];
  for (const sample of samples) {
    const section = sample.cat ? byName.get(sample.cat) : undefined;
    if (section) section.samples.push(sample);
    else unassigned.push(sample);
  }
  if (unassigned.length > 0) {
    const main = sections.reduce((best, section) => section.samples.length > best.samples.length ? section : best);
    main.samples.push(...unassigned);
  }
  return sections;
}

/** Saves the sheet's whole answer: who was here (or a verdict), then any box names chosen on the
 * scene photo, in that order, and returns the session's refreshed detail after the last write. */
export async function labelSession(hass: Pick<HomeAssistant, "callWS">, entryId: string, request: SessionLabelRequest): Promise<EventDetail> {
  const callWS = hass.callWS;
  if (!callWS) throw new Error("Not connected.");
  let detail = await callWS({
    type: "kibble/session/label",
    entry_id: entryId,
    uid: request.uid,
    ...(request.cats ? { cats: request.cats } : {}),
    ...(request.verdict ? { verdict: request.verdict } : {}),
  }) as EventDetail;
  for (const subject of request.subjects ?? []) {
    detail = await callWS({ type: "kibble/session/subject", entry_id: entryId, uid: detail.event.uid, sid: subject.sid, label: subject.label }) as EventDetail;
  }
  return detail;
}
