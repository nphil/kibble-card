/** A minimal but honest `hass` stand-in: real `states`/`entities`/`devices` maps built from the
 * fixtures, a `callService` that logs every call (and mutates state for the handful of device
 * services a screenshot/interaction session might actually trigger) instead of a silent no-op,
 * plus `callWS`/`fetchWithAuth` for the timeline/cats cards' `kibble/*` WS commands and
 * authenticated image loading.
 *
 * `callWS`'s `kibble/label`, `kibble/cats/add`, `kibble/cats/delete` and `kibble/training/
 * remove` share one mutable store seeded from the fixtures: labelling an event in the harness
 * really does move it out of the review queue and add its samples to that cat's training set,
 * exactly like the real integration's fast DB update followed by a background retrain.
 *
 * `onChange`: real Home Assistant always hands a card a *new* `hass` object reference on every
 * state change (its frontend store is immutable-update-all-the-way-down), which is what makes a
 * plain `willUpdate(changed) { changed.has("hass") }` check work as a change signal. This mock
 * mutates its `states` map in place for realism (see `resolve-entities.ts`'s callers reading
 * `hass.states[id]`), which by itself is invisible to Lit's reactivity -- `onChange` is the
 * hook `dev/app.ts` uses to re-assign `element.hass = { ...hass }` (a fresh top-level reference
 * over the same, already-mutated, nested data) after every mutation, so the harness behaves
 * like the real frontend instead of silently going stale after the first click.
 */

import type { Asset, CalibrationHopper, CalibrationState, CatSummary, HomeAssistant, Sample, Storage, TimelineEvent, TrainingSample } from "../src/types";
import { resolveKibbleEntities } from "../src/lib/resolve-entities";
import { buildFixture, CAMERA_ENTITY_ID, CATS, DEVICE_ID, ENTRY_ID, EVENT_SAMPLES, INITIAL_CALIBRATION, MULTICAT_FIXTURES, MULTICAT_LIVE_DETECTIONS, REVIEW_EVENTS, STORAGE_FIXTURE, TIMELINE_EVENTS, TRAINING_BY_CAT, type HarnessFixture, type ScenarioName } from "./fixtures";

/** Deep-enough clone for `CalibrationState`: every mutating action hands the caller a fresh
 * snapshot rather than the live mutable record, matching the daemon's own "every action
 * returns the full object" contract -- a caller holding onto a stale reference should never
 * see it change out from under them. */
function cloneCalibration(state: CalibrationState): CalibrationState {
  const cloneHopper = (hopper: CalibrationHopper | null): CalibrationHopper | null => (hopper ? { ...hopper, points: hopper.points.map((point) => ({ ...point })) } : null);
  return { hoppers: [cloneHopper(state.hoppers[0]), cloneHopper(state.hoppers[1])] };
}

/** No real vision model in the harness -- a fixed, always-rising curve per hopper so capturing
 * a reading during a demo behaves like a normal calibration (real capture reads the daemon's
 * live score instead). Units match the daemon's own 0.0-1.0 scale, same as a real curve. */
function mockBowlScore(portions: number): number {
  return Math.min(0.95, 0.03 + portions * 0.18);
}

/** Deterministic outcome cycle for mock training uploads -- a fixed pattern gives a batch of
 * chosen photos a realistic mix of results (mostly added, one duplicate, one not-a-cat, one
 * error) without any real image analysis, so a screenshot session sees the same believable mix
 * every time regardless of which files were actually chosen. */
const TRAINING_UPLOAD_OUTCOMES = ["added", "added", "duplicate", "no_cat", "added", "error", "added", "added"] as const;

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}

export { DEVICE_ID, ENTRY_ID };

declare global {
  interface Window {
    /** Every `callService` the mock received, in order -- what a harness session (or a
     * screenshot script) reads to confirm which service a click dispatched. */
    __kibbleCalls?: { domain: string; service: string; data: Record<string, unknown>; target?: Record<string, unknown> }[];
  }
}

export function createMockHass(scenario: ScenarioName, onChange?: () => void, harnessFixture: HarnessFixture = "default"): HomeAssistant {
  const fixture = buildFixture(scenario);
  const activeMultiFixture = harnessFixture === "default" ? null : MULTICAT_FIXTURES[harnessFixture];
  const states = { ...fixture.states };
  if (activeMultiFixture) {
    const camera = states[CAMERA_ENTITY_ID]!;
    states[CAMERA_ENTITY_ID] = { ...camera, attributes: { ...camera.attributes, entity_picture: `./${activeMultiFixture.sceneId}.jpg` } };
  }
  const resolved = resolveKibbleEntities(fixture.entities, fixture.device.id);

  const cats: CatSummary[] = CATS.map((cat) => ({ ...cat }));
  const timelineEvents = activeMultiFixture?.events ?? TIMELINE_EVENTS;
  const events: TimelineEvent[] = [...timelineEvents, ...REVIEW_EVENTS.filter((event) => event.kind === "import")].map((event) => ({ ...event }));
  const sampleFixtures = { ...EVENT_SAMPLES, ...(activeMultiFixture?.samples ?? {}) };
  const eventSamples: Record<string, Sample[]> = Object.fromEntries(Object.entries(sampleFixtures).map(([uid, samples]) => [uid, samples.map((sample) => ({ ...sample }))]));
  const trainingByCat: Record<string, TrainingSample[]> = Object.fromEntries(Object.entries(TRAINING_BY_CAT).map(([cat, samples]) => [cat, [...samples]]));
  /** Per-photo override (`kibble/sample/label`'s own `review`, mirrored here) and the cat/
   * `not_a_cat` a sample is *currently* trained as (mirrors the real `training` table) -- both
   * keyed by sample uid, both absent by default ("follow the event, not trained yet"). Seeded
   * once below so the harness opens with one already-reviewed event (`e1208`, confirmed
   * Kitty) showing real per-photo exceptions: two samples overridden to Pancake, one skipped,
   * the rest following Kitty -- exactly the "confirmed meal with overridden photos" scenario
   * the sheet's photo grid badges exist to make trustworthy. The followers are seeded directly
   * here (not via `setTrained` below) so they carry no side effect on Kitty's own training
   * gallery/count -- the static `CATS` fixture above already accounts for those on its own. */
  const sampleReview: Record<string, string> = {
    [`${ENTRY_ID}-e1208-s1`]: "Pancake",
    [`${ENTRY_ID}-e1208-s2`]: "Pancake",
    [`${ENTRY_ID}-e1208-s3`]: "skip",
  };
  const subjectReviewSources = new Set<string>();
  const sampleTrainedAs: Record<string, string> = {
    [`${ENTRY_ID}-e1208-s1`]: "Pancake",
    [`${ENTRY_ID}-e1208-s2`]: "Pancake",
    [`${ENTRY_ID}-e1208-s4`]: "Kitty",
    [`${ENTRY_ID}-e1208-s5`]: "Kitty",
    [`${ENTRY_ID}-e1208-s6`]: "Kitty",
    [`${ENTRY_ID}-e1208-s7`]: "Kitty",
    [`${ENTRY_ID}-e1208-s8`]: "Kitty",
  };
  const storage: Storage = { ...STORAGE_FIXTURE };
  const calibration: CalibrationState = cloneCalibration(INITIAL_CALIBRATION);
  // Upload mocks: how many `upload/training`/`upload/avatar` POSTs this instance has served,
  // driving `TRAINING_UPLOAD_OUTCOMES` and giving every uploaded asset its own unique id.
  let trainingUploadCalls = 0;
  let avatarUploadCalls = 0;

  function findEvent(uid: string): TimelineEvent | undefined {
    return events.find((event) => event.uid === uid) ?? events.find((event) => event.session === uid);
  }

  function sampleLabelOf(uid: string): string | null {
    const review = sampleReview[uid] ?? null;
    return review === "skip" ? "skip" : (sampleTrainedAs[uid] ?? null);
  }

  function withSampleState(sample: Sample): Sample {
    return { ...sample, review: sampleReview[sample.uid] ?? null, label: sampleLabelOf(sample.uid) };
  }

  function bumpTrainingCount(cat: string, sample: Pick<Sample, "body" | "face">, delta: number): void {
    const rosterEntry = cats.find((c) => c.name === cat);
    if (!rosterEntry) return; // "not_a_cat" has no roster row to bump
    rosterEntry.training = {
      total: Math.max(0, rosterEntry.training.total + delta),
      face: Math.max(0, rosterEntry.training.face + (sample.face ? delta : 0)),
      body: Math.max(0, rosterEntry.training.body + (sample.body ? delta : 0)),
    };
  }

  function addToGallery(cat: string, sample: Sample): void {
    const gallery = trainingByCat[cat] ?? (trainingByCat[cat] = []);
    gallery.push({ uid: `${sample.uid}-train`, cat, created: sample.t, source: "label", body: sample.body, face: sample.face });
    bumpTrainingCount(cat, sample, 1);
  }

  function removeFromGallery(cat: string, sampleUid: string): void {
    const gallery = trainingByCat[cat];
    if (!gallery) return;
    const index = gallery.findIndex((row) => row.uid === `${sampleUid}-train`);
    if (index === -1) return;
    const [removed] = gallery.splice(index, 1);
    bumpTrainingCount(cat, removed, -1);
  }

  /** Mirrors `store.add_upload_training`: a new `source: "upload"` row, newest-first, counted
   * against the cat's training total exactly like a labelled sample would be. */
  function addUploadTraining(cat: string, callIndex: number): TrainingSample {
    const assetId = `${ENTRY_ID}-upload-${callIndex}-body`;
    const sample: TrainingSample = {
      uid: `${ENTRY_ID}-upload-${callIndex}`,
      cat,
      created: Math.floor(Date.now() / 1000),
      source: "upload",
      body: { id: assetId, url: `/api/kibble/${ENTRY_ID}/media/${assetId}` },
      face: null,
    };
    const gallery = trainingByCat[cat] ?? (trainingByCat[cat] = []);
    gallery.push(sample);
    bumpTrainingCount(cat, sample, 1);
    return sample;
  }

  /** The cat's newest trained photo -- mirrors `store`'s avatar auto-pick fallback once a
   * custom override is cleared. `null` for a cat with no training photos at all yet. */
  function autoPickAvatar(cat: string): Asset | null {
    const gallery = trainingByCat[cat] ?? [];
    const newest = gallery.reduce<TrainingSample | null>((best, row) => (!best || row.created > best.created ? row : best), null);
    return newest ? (newest.body ?? newest.face) : null;
  }

  /** Makes one sample's mock training state match `cat` -- mirrors the real store's
   * `_reconcile_sample_training`: `null` removes it (a no-op if it wasn't trained); moving to
   * a different cat drops the old gallery row first, the same "move, don't duplicate" contract
   * the real deterministic `<uid>-train` training uid gives for free. */
  function setTrained(sample: Sample, cat: string | null): void {
    const previous = sampleTrainedAs[sample.uid] ?? null;
    if (previous === cat) return;
    if (previous) removeFromGallery(previous, sample.uid);
    if (cat) addToGallery(cat, sample);
    if (cat) sampleTrainedAs[sample.uid] = cat;
    else delete sampleTrainedAs[sample.uid];
  }

  /** What a "follow" sample of `event` should train as: the event's own cat/`not_a_cat`, but
   * only once it has actually been reviewed (mirrors the real store's `_event_training_target`
   * -- an "auto" guess nobody confirmed, or a null identity, trains nothing). */
  function eventTrainingTarget(event: TimelineEvent | undefined): string | null {
    if (!event) return null;
    if (event.identity === "reviewed" && event.cat) return event.cat;
    if (event.identity === "not_a_cat") return "not_a_cat";
    return null;
  }

  /** Mirrors the real `kibble/label`: marks each uid reviewed with `label`, then reconciles
   * every one of its samples' mock training state to match -- a sample with no override of its
   * own follows `label`, a skip stays untrained, and an existing override is left exactly
   * alone, the same rule `reconcile_event_training` applies server-side. Never touches
   * training at all for `"unknown"`, matching the real store. */
  function applyLabel(uids: string[], label: string): TimelineEvent[] {
    const updated: TimelineEvent[] = [];
    for (const uid of uids) {
      const event = findEvent(uid);
      if (!event) continue;
      const cat = label === "not_a_cat" || label === "unknown" ? null : label;
      event.cat = cat;
      event.identity = label === "not_a_cat" ? "not_a_cat" : label === "unknown" ? "unknown" : "reviewed";
      event.confidence = null;
      updated.push(event);
      if (label === "unknown") continue;
      for (const sample of eventSamples[uid] ?? []) {
        const review = sampleReview[sample.uid] ?? null;
        if (review === "skip") setTrained(sample, null);
        else if (review === null) setTrained(sample, label);
        // else: an override -- already reflects itself, untouched by relabelling.
      }
    }
    return updated;
  }

  function paginate<T>(items: T[], limit: number, cursor: unknown): { items: T[]; cursor: string | null; has_more: boolean } {
    const offset = typeof cursor === "string" ? Number(cursor) || 0 : 0;
    const page = items.slice(offset, offset + limit);
    const nextOffset = offset + page.length;
    return { items: page, cursor: nextOffset < items.length ? String(nextOffset) : null, has_more: nextOffset < items.length };
  }

  function notify(): void {
    hass.states = { ...states };
    onChange?.();
  }

  /** Mirrors what a real "mark hopper full" press does to the daemon's own state: the point
   * sensor reads "ok" again immediately, and the `remaining` sensor resets its fill clock --
   * `portions_since_full` back to zero, `full_at` to now. `full_to_low` is untouched: capacity
   * is only ever learned by later draining down to the low sensor, never by a full mark itself,
   * so a hopper that has never been through that cycle stays "unknown" even right after being
   * topped off. */
  function markHopperFull(index: 0 | 1): void {
    const levelId = index === 0 ? resolved.hopperLevel1 : resolved.hopperLevel2;
    const remainingId = index === 0 ? resolved.hopperRemaining1 : resolved.hopperRemaining2;
    if (levelId && states[levelId]) {
      states[levelId] = { ...states[levelId]!, state: "ok" };
    }
    if (remainingId && states[remainingId]) {
      const fullToLow = states[remainingId]!.attributes.full_to_low;
      const learned = typeof fullToLow === "number" ? fullToLow : null;
      states[remainingId] = {
        ...states[remainingId]!,
        state: learned != null ? String(learned) : "unknown",
        attributes: { ...states[remainingId]!.attributes, full_at: new Date().toISOString(), portions_since_full: 0 },
      };
    }
  }

  /** Mirrors the integration's schedule services against the schedule sensor's `entries`, so an
   * add/edit/remove/toggle in the harness shows up in the list like it would for real. Times
   * arrive as "HH:MM:SS" and are stored "HH:MM", as the real sensor reports them. */
  function applyScheduleService(service: string, data: Record<string, unknown>): void {
    const id = resolved.schedule;
    if (!id || !states[id]) return;
    type Row = { id: string; time: string; amount_l: number; amount_r: number; enabled: boolean };
    const current = (states[id]!.attributes.entries as Row[] | undefined) ?? [];
    const fromData = (row: Record<string, unknown>, rowId: string): Row => ({
      id: rowId,
      time: String(row.time ?? "00:00:00").slice(0, 5),
      amount_l: Number(row.hopper1_g ?? 0),
      amount_r: Number(row.hopper2_g ?? 0),
      enabled: row.enabled !== false,
    });
    let next: Row[] | null = null;
    if (service === "schedule_add") next = [...current, fromData(data, `m${++scheduleIdCounter}`)];
    if (service === "schedule_remove") next = current.filter((row) => row.id !== data.entry_id);
    if (service === "schedule_set_enabled") next = current.map((row) => (row.id === data.entry_id ? { ...row, enabled: data.enabled === true } : row));
    if (service === "schedule_set") {
      const rows = (data.entries as Record<string, unknown>[] | undefined) ?? [];
      next = rows.map((row) => fromData(row, typeof row.entry_id === "string" ? row.entry_id : `m${++scheduleIdCounter}`));
    }
    if (!next) return;
    states[id] = { ...states[id]!, state: String(next.length), attributes: { ...states[id]!.attributes, entries: next } };
    notify();
  }

  let scheduleIdCounter = 0;

  const hass: HomeAssistant = {
    states,
    entities: fixture.entities,
    devices: { [fixture.device.id]: fixture.device },
    themes: {},
    language: "en",
    callService: async (domain, service, data, target) => {
      // eslint-disable-next-line no-console
      console.log("[mock hass] callService", { domain, service, data, target });
      (window.__kibbleCalls ??= []).push({ domain, service, data: structuredClone(data ?? {}), target });
      if (domain === "kibble" && service.startsWith("schedule_")) applyScheduleService(service, data ?? {});
      const entityId = (target?.entity_id as string | undefined) ?? undefined;
      if (domain === "number" && service === "set_value" && entityId && states[entityId]) {
        states[entityId] = { ...states[entityId]!, state: String(data?.value ?? "") };
        notify();
      }
      if (domain === "text" && service === "set_value" && entityId && states[entityId]) {
        states[entityId] = { ...states[entityId]!, state: String(data?.value ?? "") };
        notify();
      }
      if (domain === "switch" && service === "toggle" && entityId && states[entityId]) {
        const next = states[entityId]!.state === "on" ? "off" : "on";
        states[entityId] = { ...states[entityId]!, state: next };
        notify();
      }
      if (domain === "button" && service === "press" && entityId) {
        if (entityId === resolved.markFullHopper1 || entityId === resolved.markFullBoth) markHopperFull(0);
        if (entityId === resolved.markFullHopper2 || entityId === resolved.markFullBoth) markHopperFull(1);
        notify();
      }
      return undefined;
    },
    callWS: async (msg) => {
      const type = msg.type as string | undefined;
      if (type === "auth/sign_path") {
        // No real Home Assistant auth in the harness -- rewrites the clip proxy path straight
        // to the locally served clip fixture (`dev/clip-fixture.mp4`, docs/39-eating-clips.md)
        // so the review sheet's `<video>` has something real to load and seek.
        const path = msg.path as string | undefined;
        return { path: path?.includes("/clip/") ? "/clip-fixture.mp4" : path };
      }
      if (type === "kibble/timeline") {
        const pool = events.filter((event) => event.kind !== "import").slice().sort((a, b) => b.start - a.start);
        return paginate(pool, Math.max(1, Number(msg.limit) || 25), msg.cursor);
      }
      if (type === "kibble/event") {
        const uid = msg.uid as string | undefined;
        const event = uid ? findEvent(uid) : undefined;
        if (!event) throw { code: "not_found", message: `Unknown event ${String(uid)}` };
        const sessionEvents = event.session ? events.filter((member) => member.session === event.session) : [event];
        const sessionStarts = sessionEvents.map((member) => member.start);
        const sessionEnds = sessionEvents.map((member) => member.end).filter((end): end is number => end !== null);
        const samples = sessionEvents.flatMap((member) => (member ? eventSamples[member.uid] ?? [] : []).map((sample) => ({ ...withSampleState(sample), cat: sample.cat ?? member!.cat })));
        const details = activeMultiFixture?.details[event.uid];
        const cats = details?.cats ?? (event.cat ? [{ cat: event.cat, ate: event.kind === "eat", confirmed: event.identity === "reviewed", confidence: event.identity === "auto" ? event.confidence : null, photos: samples.filter((sample) => sample.cat === event.cat).length }] : []);
        const open = sessionEvents.some((member) => member.open);
        const detailEvent: TimelineEvent = {
          ...event,
          uid: event.session ?? event.uid,
          start: Math.min(...sessionStarts),
          end: open || sessionEnds.length === 0 ? null : Math.max(...sessionEnds),
          open,
          kind: sessionEvents.some((member) => member.kind === "eat") ? "eat" : "visit",
          cat: cats.length === 1 ? cats[0]!.cat : null,
          identity: cats.length > 0 ? cats.every((cat) => cat.confirmed) ? "reviewed" : "auto" : event.identity,
          confidence: cats.length === 1 ? cats[0]!.confidence : null,
          sample_count: samples.length,
        };
        return { event: detailEvent, samples, scene_subjects: details?.scene_subjects.map((subject) => ({ ...subject, box: [...subject.box] })) ?? [], cats: cats.map((cat) => ({ ...cat })), multiple_cats: (details?.scene_subjects.length ?? 0) >= 2 };
      }
      if (type === "kibble/session/label") {
        const uid = msg.uid as string | undefined;
        const event = uid ? findEvent(uid) : undefined;
        if (!event) throw { code: "not_found", message: `Unknown event ${String(uid)}` };
        const details = activeMultiFixture?.details[event.uid];
        const sessionEvents = event.session ? events.filter((member) => member.session === event.session) : [event];
        const sessionSamples = sessionEvents.flatMap((member) => eventSamples[member.uid] ?? []);
        const verdict = msg.verdict as string | undefined;
        const requestedCats = Array.isArray(msg.cats) ? msg.cats as { cat: string; ate: boolean }[] : null;
        if (verdict === "not_a_cat" || verdict === "unknown") {
          applyLabel(sessionEvents.map((member) => member.uid), verdict);
          for (const sample of sessionSamples) {
            if (sampleReview[sample.uid] == null) sample.cat = null;
          }
          if (details) {
            details.cats.splice(0);
            for (const subject of details.scene_subjects) {
              subject.label = verdict === "not_a_cat" ? "not_a_cat" : null;
              subject.reviewed = verdict === "not_a_cat";
            }
          }
        } else if (requestedCats?.length) {
          for (const member of sessionEvents) {
            const selected = requestedCats.find((cat) => cat.cat === member.cat) ?? (requestedCats.length === 1 ? requestedCats[0] : undefined);
            if (selected) {
              member.cat = selected.cat;
              member.kind = selected.ate ? "eat" : "visit";
            } else if (requestedCats.length > 1 && member.cat && !requestedCats.some((cat) => cat.cat === member.cat)) {
              member.cat = null;
              member.kind = "visit";
            }
            member.identity = "reviewed";
            member.confidence = null;
          }
          for (const sample of sessionSamples) {
            if (sampleReview[sample.uid] != null) continue;
            if (requestedCats.length === 1) sample.cat = requestedCats[0]!.cat;
            else if (sample.cat && !requestedCats.some((cat) => cat.cat === sample.cat)) sample.cat = null;
          }
          if (details) details.cats.splice(0, details.cats.length, ...requestedCats.map((cat) => ({ ...cat, confirmed: true, confidence: null, photos: sessionSamples.filter((sample) => sample.cat === cat.cat).length })));
        } else {
          throw { code: "agent_rejected", message: "Nothing to label" };
        }
        notify();
        return await hass.callWS!({ type: "kibble/event", uid });
      }
      if (type === "kibble/session/subject") {
        const uid = msg.uid as string | undefined;
        const sid = msg.sid as number | undefined;
        const label = msg.label as string | undefined;
        const event = uid ? findEvent(uid) : undefined;
        if (!event || sid == null || !label) throw { code: "agent_rejected", message: "Nothing to label" };
        const details = activeMultiFixture?.details[event.uid];
        const sessionEvents = event.session ? events.filter((member) => member.session === event.session) : [event];
        const sessionSamples = sessionEvents.flatMap((member) => eventSamples[member.uid] ?? []);
        const subject = details?.scene_subjects.find((candidate) => candidate.sid === sid);
        const oldLabel = subject?.label ?? null;
        if (subject) {
          subject.label = label === "follow" ? null : label;
          subject.reviewed = label !== "follow";
        }
        const subjectSamples = sessionSamples.flatMap((sample) => sample.sid === sid ? [{ sample, member: sessionEvents.find((member) => (eventSamples[member.uid] ?? []).includes(sample)) ?? event }] : []);
        for (const { sample, member } of subjectSamples) {
          if (sampleReview[sample.uid] != null && !subjectReviewSources.has(sample.uid)) continue;
          if (label === "follow") {
            delete sampleReview[sample.uid];
            subjectReviewSources.delete(sample.uid);
            sample.cat = member.cat;
            setTrained(sample, eventTrainingTarget(member));
          } else {
            sampleReview[sample.uid] = label;
            subjectReviewSources.add(sample.uid);
            sample.cat = label === "not_a_cat" ? null : label;
            setTrained(sample, label === "not_a_cat" ? null : label);
          }
        }
        if (details) {
          if (label !== "follow" && oldLabel && oldLabel !== "not_a_cat" && !details.scene_subjects.some((candidate) => candidate.label === oldLabel)) {
            details.cats.splice(0, details.cats.length, ...details.cats.filter((cat) => cat.cat !== oldLabel));
          }
          if (label !== "not_a_cat" && label !== "follow") {
            const current = details.cats.find((cat) => cat.cat === label);
            const photos = sessionSamples.filter((sample) => sample.cat === label).length;
            if (current) { current.confirmed = true; current.confidence = null; current.photos = photos; }
            else details.cats.push({ cat: label, ate: sessionEvents.some((member) => member.kind === "eat"), confirmed: true, confidence: null, photos });
          }
          for (const cat of details.cats) cat.photos = sessionSamples.filter((sample) => sample.cat === cat.cat).length;
        }
        notify();
        return await hass.callWS!({ type: "kibble/event", uid });
      }
      if (type === "kibble/label") {
        const uids = Array.isArray(msg.uids) ? (msg.uids as string[]) : [];
        const label = msg.label as string | undefined;
        if (!label || uids.length === 0) throw { code: "agent_rejected", message: "Nothing to label" };
        const updated = applyLabel(uids, label);
        notify();
        return { events: updated.map((event) => ({ ...event })) };
      }
      if (type === "kibble/sample/label") {
        const sampleUid = msg.sample_uid as string | undefined;
        const label = msg.label as string | undefined;
        if (!sampleUid || !label) throw { code: "agent_rejected", message: "Nothing to label" };
        const owner = Object.entries(eventSamples).find(([, list]) => list.some((sample) => sample.uid === sampleUid));
        if (!owner) throw { code: "not_found", message: `Unknown sample ${sampleUid}` };
        const [eventUid, list] = owner;
        const sample = list.find((item) => item.uid === sampleUid);
        if (!sample) throw { code: "not_found", message: `Unknown sample ${sampleUid}` };
        if (label !== "not_a_cat" && label !== "skip" && label !== "follow" && !cats.some((cat) => cat.name === label)) {
          throw { code: "agent_rejected", message: `Unknown cat ${label}` };
        }
        const oldCat = sample.cat;
        const event = findEvent(eventUid);
        const sessionEvents = event?.session ? events.filter((member) => member.session === event.session) : event ? [event] : [];
        const sessionSamples = sessionEvents.flatMap((member) => eventSamples[member.uid] ?? []);
        if (label === "follow") {
          delete sampleReview[sampleUid];
          subjectReviewSources.delete(sampleUid);
          sample.cat = event?.cat ?? null;
          setTrained(sample, eventTrainingTarget(event));
        } else if (label === "skip") {
          sampleReview[sampleUid] = "skip";
          subjectReviewSources.delete(sampleUid);
          sample.cat = null;
          setTrained(sample, null);
        } else {
          sampleReview[sampleUid] = label;
          subjectReviewSources.delete(sampleUid);
          sample.cat = label === "not_a_cat" ? null : label;
          setTrained(sample, label);
        }
        const details = event ? activeMultiFixture?.details[event.uid] : undefined;
        if (details) {
          if (oldCat && oldCat !== sample.cat && !sessionSamples.some((item) => item !== sample && item.cat === oldCat) && !details.scene_subjects.some((subject) => subject.label === oldCat)) {
            details.cats.splice(0, details.cats.length, ...details.cats.filter((cat) => cat.cat !== oldCat));
          }
          if (sample.cat && sample.cat !== "not_a_cat") {
            const current = details.cats.find((cat) => cat.cat === sample.cat);
            const photos = sessionSamples.filter((item) => item.cat === sample.cat).length;
            if (current) { current.confirmed = true; current.confidence = null; current.photos = photos; }
            else details.cats.push({ cat: sample.cat, ate: sessionEvents.some((member) => member.kind === "eat"), confirmed: true, confidence: null, photos });
          }
          for (const cat of details.cats) cat.photos = sessionSamples.filter((item) => item.cat === cat.cat).length;
        }
        notify();
        return { sample: withSampleState(sample) };
      }
      if (type === "kibble/cats") {
        return { cats: cats.map((cat) => ({ ...cat })), storage: { ...storage } };
      }
      if (type === "kibble/vision/last") {
        // One stable default diagnostic frame plus a dedicated multi-cat live example.
        return {
          frame: {
            at_ms: Date.now(),
            wall_unix: Math.floor(Date.now() / 1000),
            w: 1280,
            h: 720,
            detections: activeMultiFixture ? MULTICAT_LIVE_DETECTIONS : [
              { x1: 0.0875, y1: 0, x2: 0.6586, y2: 0.5014, score: 0.968, admitted: true },
              { x1: 0.78, y1: 0.62, x2: 0.97, y2: 0.95, score: 0.41, admitted: false },
            ],
            verified: true,
            overlay: true,
          },
        };
      }
      if (type === "kibble/cats/add") {
        const name = msg.name as string | undefined;
        if (name && !cats.some((cat) => cat.name === name)) {
          cats.push({ name, color: cats.length, avatar: null, avatar_custom: false, training: { total: 0, face: 0, body: 0 }, accuracy: null, last_seen: null, last_meal: null, meals_today: 0, present: false });
          notify();
        }
        return {};
      }
      if (type === "kibble/cats/delete") {
        const name = msg.name as string | undefined;
        const index = name ? cats.findIndex((cat) => cat.name === name) : -1;
        if (!name || index === -1) throw { code: "not_found", message: `Unknown cat ${String(name)}` };
        cats.splice(index, 1);
        delete trainingByCat[name];
        notify();
        return {};
      }
      if (type === "kibble/cats/avatar/set") {
        const name = msg.cat as string | undefined;
        const assetId = msg.asset_id as string | undefined;
        const rosterEntry = name ? cats.find((cat) => cat.name === name) : undefined;
        if (!rosterEntry || !assetId) throw { code: "not_found", message: "Unknown cat or photo" };
        rosterEntry.avatar = { id: assetId, url: `/api/kibble/${ENTRY_ID}/media/${assetId}` };
        rosterEntry.avatar_custom = true;
        notify();
        return { avatar: rosterEntry.avatar };
      }
      if (type === "kibble/cats/avatar/clear") {
        const name = msg.cat as string | undefined;
        const rosterEntry = name ? cats.find((cat) => cat.name === name) : undefined;
        if (!rosterEntry) throw { code: "not_found", message: "Unknown cat" };
        rosterEntry.avatar = autoPickAvatar(rosterEntry.name);
        rosterEntry.avatar_custom = false;
        notify();
        return { avatar: rosterEntry.avatar };
      }
      if (type === "kibble/review") {
        const pool = events.filter((event) => event.identity === "unknown" && event.cat === null).slice().sort((a, b) => b.start - a.start);
        const page = paginate(pool, Math.max(1, Number(msg.limit) || 24), msg.cursor);
        return { ...page, total: pool.length };
      }
      if (type === "kibble/training") {
        const cat = msg.cat as string | undefined;
        const pool = (cat ? trainingByCat[cat] ?? [] : []).slice().sort((a, b) => b.created - a.created);
        const page = paginate(pool, Math.max(1, Number(msg.limit) || 24), msg.cursor);
        return { ...page, total: pool.length };
      }
      if (type === "kibble/training/remove") {
        const uids = Array.isArray(msg.uids) ? (msg.uids as string[]) : [];
        let removed = 0;
        for (const [cat, gallery] of Object.entries(trainingByCat)) {
          const kept = gallery.filter((sample) => !uids.includes(sample.uid));
          const delta = gallery.length - kept.length;
          if (delta === 0) continue;
          trainingByCat[cat] = kept;
          removed += delta;
          const rosterEntry = cats.find((c) => c.name === cat);
          if (rosterEntry) rosterEntry.training = { ...rosterEntry.training, total: Math.max(0, rosterEntry.training.total - delta) };
        }
        notify();
        return { removed };
      }
      if (type === "kibble/calibration") {
        return cloneCalibration(calibration);
      }
      if (type === "kibble/calibration/action") {
        const hopper = msg.hopper;
        if (hopper !== 0 && hopper !== 1) throw { code: "agent_rejected", message: `Invalid hopper ${String(hopper)}` };
        const action = msg.action as string | undefined;
        if (action === "begin") {
          calibration.hoppers[hopper] = {
            points: [],
            full_portions: null,
            full_score: null,
            measured_at: Math.floor(Date.now() / 1000),
            source: "measured",
            note: (msg.note as string | undefined) ?? "",
          };
          notify();
          return cloneCalibration(calibration);
        }
        const existing = calibration.hoppers[hopper];
        if (action === "point") {
          if (!existing) throw { code: "agent_rejected", message: "Calibration not started" };
          const portions = msg.portions as number;
          existing.points = [...existing.points.filter((point) => point.portions !== portions), { portions, score: mockBowlScore(portions) }].sort(
            (a, b) => a.portions - b.portions,
          );
          notify();
          return cloneCalibration(calibration);
        }
        if (action === "full") {
          if (!existing) throw { code: "agent_rejected", message: "Calibration not started" };
          const portions = msg.portions as number;
          const point = existing.points.find((p) => p.portions === portions);
          if (!point) throw { code: "agent_rejected", message: `No point recorded at ${portions} portions` };
          existing.full_portions = portions;
          existing.full_score = point.score;
          notify();
          return cloneCalibration(calibration);
        }
        if (action === "inherit") {
          const from = msg.from;
          if (from !== 0 && from !== 1) throw { code: "agent_rejected", message: `Invalid source hopper ${String(from)}` };
          const source = calibration.hoppers[from];
          if (!source) throw { code: "agent_rejected", message: "Nothing to inherit from" };
          calibration.hoppers[hopper] = { ...source, points: source.points.map((point) => ({ ...point })), source: { inherited_from: from }, measured_at: Math.floor(Date.now() / 1000) };
          notify();
          return cloneCalibration(calibration);
        }
        if (action === "clear") {
          calibration.hoppers[hopper] = null;
          notify();
          return cloneCalibration(calibration);
        }
        throw { code: "agent_rejected", message: `Unknown action: ${String(action)}` };
      }
      throw { code: "unknown_command", message: `Unknown command: ${String(type)}` };
    },
    fetchWithAuth: async (input, init) => {
      const path = typeof input === "string" ? input : "";
      const method = (init?.method ?? "GET").toUpperCase();
      const trainingMatch = method === "POST" ? /\/upload\/training\/([^/?]+)$/.exec(path) : null;
      if (trainingMatch) {
        const cat = decodeURIComponent(trainingMatch[1]!);
        if (!cats.some((c) => c.name === cat)) {
          return jsonResponse({ status: "error", reason: "not_found", message: "Unknown cat." }, 404);
        }
        const callIndex = trainingUploadCalls++;
        const outcome = TRAINING_UPLOAD_OUTCOMES[callIndex % TRAINING_UPLOAD_OUTCOMES.length];
        if (outcome === "duplicate") return jsonResponse({ status: "duplicate", message: "This looks like a photo already in training." });
        if (outcome === "no_cat") return jsonResponse({ status: "no_cat", message: "No cat found in this photo." });
        if (outcome === "error") return jsonResponse({ status: "error", reason: "bad_image", message: "That file couldn't be read." }, 400);
        const sample = addUploadTraining(cat, callIndex);
        notify();
        return jsonResponse({ status: "added", message: "Added.", sample });
      }
      const avatarMatch = method === "POST" ? /\/upload\/avatar\/([^/?]+)$/.exec(path) : null;
      if (avatarMatch) {
        const cat = decodeURIComponent(avatarMatch[1]!);
        const rosterEntry = cats.find((c) => c.name === cat);
        if (!rosterEntry) return jsonResponse({ error: "Unknown cat." }, 404);
        const assetId = `${ENTRY_ID}-avatar-upload-${avatarUploadCalls++}-avatar`;
        rosterEntry.avatar = { id: assetId, url: `/api/kibble/${ENTRY_ID}/media/${assetId}` };
        rosterEntry.avatar_custom = true;
        notify();
        return jsonResponse({ avatar: rosterEntry.avatar });
      }
      if (path.startsWith("/api/kibble/")) {
        // Multi-cat scene and body crops are the actual fixture photo; other media uses stable
        // placeholders with distinct before/after and face/scene treatments.
        const id = path.slice(path.lastIndexOf("/") + 1);
        if (id === "e2060-scene-1") return fetch("./e2060-scene-1.jpg");
        if (id === "e1713-scene-1") return fetch("./multicat-scene.jpg");
        if (id.includes("-e2060-")) return fetch("./multicat-kitty-body.jpg");
        if (id.includes("-e1713-kitty-") || id.includes("-e1712-kitty-")) return fetch("./multicat-kitty-body.jpg");
        if (id.includes("-e1713-pancake-") || id.includes("-e1712-unknown-")) return fetch("./multicat-pancake-body.jpg");
        if (id.endsWith("-before")) return fetch("./dish-before.svg");
        if (id.endsWith("-after")) return fetch("./dish-after.svg");
        if (id.endsWith("-face") || id.endsWith("-avatar")) return fetch("./face-crop.svg");
        if (id.endsWith("-scene")) return fetch("./camera-frame.svg");
        return fetch("./body-crop.svg");
      }
      return new Response(null, { status: 404 });
    },
  };
  return hass;
}
