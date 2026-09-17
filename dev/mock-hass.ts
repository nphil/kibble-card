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

import type { CatSample, HomeAssistant, KibbleCatSummary, PendingFaceCrop } from "../src/types";
import { resolveKibbleEntities } from "../src/lib/resolve-entities";
import { buildFixture, CATS, DEVICE_ID, ENTRY_ID, PENDING_CROPS, SAMPLES_BY_CAT, TIMELINE_ITEMS, type ScenarioName } from "./fixtures";

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
      throw { code: "unknown_command", message: `Unknown command: ${String(type)}` };
    },
    fetchWithAuth: async (input) => {
      const path = typeof input === "string" ? input : "";
      if (path.startsWith("/api/kibble/")) {
        // No real image backend in the harness -- every crop/sample/thumbnail reuses this one
        // cat-like placeholder, distinct from the camera feed's own dark vignette stand-in.
        return fetch("./face-crop.svg");
      }
      return new Response(null, { status: 404 });
    },
  };
  return hass;
}
