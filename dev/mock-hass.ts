/** A minimal but honest `hass` stand-in: real `states`/`entities`/`devices` maps built from the
 * fixtures, a `callService` that logs every call (and mutates state for the handful of services
 * a screenshot/interaction session might actually trigger, so clicking around in the harness
 * behaves like the real thing) instead of a silent no-op, plus `callWS`/`fetchWithAuth` for the
 * timeline/cats cards' WS commands and authenticated image loading.
 *
 * `callWS` and the `kibble.label_face`/`unlabel_face`/`add_cat` services share one mutable
 * store seeded from the fixtures: confirming a pending crop in the harness really does move it
 * into that cat's samples (and back again on unlabel), and bumps `image.*_pending_face`'s state
 * so a card watching that entity for its refetch trigger sees a real change, exactly like push
 * would produce against the real integration.
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

import type { CalibrationHopper, CalibrationState, CatSample, HomeAssistant, KibbleCatSummary, PendingFaceCrop } from "../src/types";
import { resolveKibbleEntities } from "../src/lib/resolve-entities";
import { buildFixture, CATS, DEVICE_ID, ENTRY_ID, INITIAL_CALIBRATION, PENDING_CROPS, SAMPLES_BY_CAT, TIMELINE_ITEMS, type ScenarioName } from "./fixtures";

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

export { DEVICE_ID, ENTRY_ID };

export function createMockHass(scenario: ScenarioName, onChange?: () => void): HomeAssistant {
  const fixture = buildFixture(scenario);
  const states = { ...fixture.states };
  const resolved = resolveKibbleEntities(fixture.entities, fixture.device.id);

  const cats: KibbleCatSummary[] = CATS.map((cat) => ({ ...cat }));
  const pending: PendingFaceCrop[] = [...PENDING_CROPS];
  const samplesByCat: Record<string, CatSample[]> = Object.fromEntries(
    Object.entries(SAMPLES_BY_CAT).map(([cat, samples]) => [cat, [...samples]]),
  );
  const timelineItems = [...TIMELINE_ITEMS];
  const calibration: CalibrationState = cloneCalibration(INITIAL_CALIBRATION);

  function notify(): void {
    hass.states = { ...states };
    onChange?.();
  }

  /** Bumps `image.*_pending_face`'s state to a fresh timestamp, mirroring what the real
   * `KibblePendingFaceImage` entity does on every pending-queue mutation -- the signal the
   * cats card watches to know when to re-read `kibble/faces/pending` and `kibble/cats`. */
  function touchPendingFace(): void {
    const id = resolved.pendingFace;
    const current = id ? states[id] : undefined;
    if (!id || !current) return;
    const now = new Date().toISOString();
    states[id] = { ...current, state: now, last_changed: now, last_updated: now };
  }

  const hass: HomeAssistant = {
    states,
    entities: fixture.entities,
    devices: { [fixture.device.id]: fixture.device },
    themes: {},
    language: "en",
    callService: async (domain, service, data, target) => {
      // eslint-disable-next-line no-console
      console.log("[mock hass] callService", { domain, service, data, target });
      const entityId = (target?.entity_id as string | undefined) ?? undefined;
      if (domain === "number" && service === "set_value" && entityId && states[entityId]) {
        states[entityId] = { ...states[entityId]!, state: String(data?.value ?? "") };
        notify();
      }
      if (domain === "switch" && service === "toggle" && entityId && states[entityId]) {
        const next = states[entityId]!.state === "on" ? "off" : "on";
        states[entityId] = { ...states[entityId]!, state: next };
        notify();
      }
      if (domain === "kibble" && service === "label_face") {
        const cropId = data?.crop_id as string | undefined;
        const cat = data?.cat as string | undefined;
        const index = cropId ? pending.findIndex((crop) => crop.name === cropId) : -1;
        if (index !== -1 && cat) {
          const [crop] = pending.splice(index, 1);
          // "not_a_cat"/"other" are real reserved buckets the crop moves into -- it leaves the
          // inbox, but there is no cat gallery to add it to.
          if (crop && cat !== "not_a_cat" && cat !== "other") {
            const gallery = samplesByCat[cat] ?? (samplesByCat[cat] = []);
            gallery.push({ name: crop.name, ts: crop.ts });
            const rosterEntry = cats.find((c) => c.name === cat);
            if (rosterEntry) {
              rosterEntry.samples = gallery.length;
              rosterEntry.last_seen = Math.max(rosterEntry.last_seen ?? 0, crop.ts);
            }
          }
          touchPendingFace();
          notify();
        }
      }
      if (domain === "kibble" && service === "unlabel_face") {
        const cat = data?.cat as string | undefined;
        const name = data?.name as string | undefined;
        const gallery = cat ? samplesByCat[cat] : undefined;
        const index = gallery && name ? gallery.findIndex((sample) => sample.name === name) : -1;
        if (gallery && index !== -1) {
          const [sample] = gallery.splice(index, 1);
          const rosterEntry = cats.find((c) => c.name === cat);
          if (rosterEntry) rosterEntry.samples = gallery.length;
          if (sample) pending.push({ name: sample.name, ts: sample.ts, vendor_pet_id: null, vendor_cat: null, guess: null });
          touchPendingFace();
          notify();
        }
      }
      if (domain === "kibble" && service === "add_cat") {
        const name = data?.name as string | undefined;
        if (name && !cats.some((c) => c.name === name)) {
          cats.push({ name, samples: 0, last_seen: null, avatar: null, vendor_pet_id: null, color_index: cats.length });
          notify();
        }
      }
      return undefined;
    },
    callWS: async (msg) => {
      const type = msg.type as string | undefined;
      if (type === "kibble/timeline") {
        const includeVisits = msg.include_visits === true;
        const items = includeVisits ? timelineItems : timelineItems.filter((item) => item.kind !== "visit");
        return { items: [...items] };
      }
      if (type === "kibble/cats") {
        return { cats: cats.map((cat) => ({ ...cat })) };
      }
      if (type === "kibble/vision/last") {
        // A fixed diagnostic frame, not simulated live detection -- the harness has no real
        // camera to analyse. Mirrors a genuine `GET /vision/last` capture (LibreFeed's own
        // regression fixture for "a cat that arrives and stays still"): one admitted box
        // touching the top of the frame (exercises the label's flip-inside rule) plus one
        // clutter-memory box the pipeline never admits (the quiet/dashed treatment).
        return {
          frame: {
            at_ms: Date.now(),
            wall_unix: Math.floor(Date.now() / 1000),
            w: 1280,
            h: 720,
            detections: [
              { x1: 0.0875, y1: 0, x2: 0.6586, y2: 0.5014, score: 0.968, admitted: true },
              { x1: 0.78, y1: 0.62, x2: 0.97, y2: 0.95, score: 0.41, admitted: false },
            ],
            verified: true,
            cat: "Pancake",
            cat_score: 0.71,
            overlay: true,
          },
        };
      }
      if (type === "kibble/cats/delete") {
        const name = msg.name as string | undefined;
        const index = name ? cats.findIndex((cat) => cat.name === name) : -1;
        if (!name || index === -1) throw { code: "not_found", message: `Unknown cat ${String(name)}` };
        cats.splice(index, 1);
        delete samplesByCat[name];
        notify();
        return {};
      }
      if (type === "kibble/faces/pending") {
        return { crops: [...pending] };
      }
      if (type === "kibble/faces/samples") {
        const cat = msg.cat as string | undefined;
        return { samples: cat ? [...(samplesByCat[cat] ?? [])] : [] };
      }
      if (type === "kibble/faces/upload") {
        const cat = msg.cat as string | undefined;
        const rosterEntry = cat ? cats.find((c) => c.name === cat) : undefined;
        if (!cat || !rosterEntry) throw { code: "not_found", message: `Unknown cat ${String(cat)}` };
        const gallery = samplesByCat[cat] ?? (samplesByCat[cat] = []);
        const ts = Math.floor(Date.now() / 1000);
        const name = `upload-${Date.now()}.jpg`;
        gallery.push({ name, ts });
        rosterEntry.samples = gallery.length;
        rosterEntry.last_seen = Math.max(rosterEntry.last_seen ?? 0, ts);
        notify();
        // Harness stand-in for the classifier's own quality gate: every third upload for a cat
        // reads as low-confidence, so the low_quality note has something to exercise.
        const lowQuality = gallery.length % 3 === 0;
        return lowQuality ? { name, samples: gallery.length, low_quality: true } : { name, samples: gallery.length };
      }
      if (type === "kibble/faces/delete_sample") {
        const cat = msg.cat as string | undefined;
        const name = msg.name as string | undefined;
        const gallery = cat ? samplesByCat[cat] : undefined;
        const index = gallery && name ? gallery.findIndex((sample) => sample.name === name) : -1;
        if (!gallery || index === -1) throw { code: "not_found", message: "Unknown sample" };
        gallery.splice(index, 1);
        const rosterEntry = cats.find((c) => c.name === cat);
        if (rosterEntry) rosterEntry.samples = gallery.length;
        notify();
        return {};
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
    fetchWithAuth: async (input) => {
      const path = typeof input === "string" ? input : "";
      if (path.startsWith("/api/kibble/")) {
        // No real image backend in the harness. Every crop/sample/thumbnail reuses one of three
        // placeholders: a filename containing "before"/"after" (feed cycles and the eat-compare
        // pair both name their images this way) gets the matching dish placeholder, so a
        // `kibble-before-after` tile actually shows two different photos instead of the same
        // one twice; everything else falls back to the cat-like face-crop placeholder.
        if (/before/i.test(path)) return fetch("./dish-before.svg");
        if (/after/i.test(path)) return fetch("./dish-after.svg");
        return fetch("./face-crop.svg");
      }
      return new Response(null, { status: 404 });
    },
  };
  return hass;
}
