import { describe, expect, test } from "bun:test";
import { labelAte, labelSample } from "../src/lib/sample-label";
import type { Sample, VisitResult } from "../src/types";

function fakeSample(overrides: Partial<Sample> = {}): Sample {
  return {
    uid: "e1-s1", t: 0, body: null, face: null, guess: null, guess_confidence: null,
    review: "Kitty", label: "Kitty",
    sid: null, box: null, crop: null, peers: [], cat: null,
    ...overrides,
  };
}

function fakeVisit(overrides: Partial<VisitResult> = {}): VisitResult {
  return { uid: "e1", kind: "eat", cats: [{ cat: "Kitty", ate: true }], needs_ate: false, ...overrides };
}

describe("labelSample", () => {
  test("sends the sample uid and label as kibble/sample/label", async () => {
    let sent: Record<string, unknown> | undefined;
    const hass = { callWS: async (message: Record<string, unknown>) => { sent = message; return { sample: fakeSample(), visit: fakeVisit() }; } };
    await labelSample(hass, "entry-1", { sampleUid: "e1-s1", label: "Kitty" });
    expect(sent).toEqual({ type: "kibble/sample/label", entry_id: "entry-1", sample_uid: "e1-s1", label: "Kitty" });
  });

  test("resolves with the sample and the visit the server returned", async () => {
    const result = { sample: fakeSample({ review: "skip", label: "skip" }), visit: fakeVisit({ needs_ate: true }) };
    const hass = { callWS: async () => result };
    expect(await labelSample(hass, "entry-1", { sampleUid: "e1-s1", label: "skip" })).toEqual(result);
  });

  test("rejects rather than silently no-op when the connection has no callWS", async () => {
    await expect(labelSample({}, "entry-1", { sampleUid: "e1-s1", label: "Kitty" })).rejects.toThrow();
  });
});

describe("labelAte", () => {
  test("sends the visit uid and the cats that ate as kibble/session/ate", async () => {
    let sent: Record<string, unknown> | undefined;
    const hass = { callWS: async (message: Record<string, unknown>) => { sent = message; return { visit: fakeVisit() }; } };
    await labelAte(hass, "entry-1", { visitUid: "e1", ate: ["Kitty", "Pancake"] });
    expect(sent).toEqual({ type: "kibble/session/ate", entry_id: "entry-1", uid: "e1", ate: ["Kitty", "Pancake"] });
  });

  test("resolves with the visit the server returned", async () => {
    const visit = fakeVisit({ cats: [{ cat: "Kitty", ate: true }, { cat: "Pancake", ate: false }] });
    const hass = { callWS: async () => ({ visit }) };
    expect(await labelAte(hass, "entry-1", { visitUid: "e1", ate: ["Kitty"] })).toEqual(visit);
  });

  test("rejects when the connection has no callWS", async () => {
    await expect(labelAte({}, "entry-1", { visitUid: "e1", ate: ["Kitty"] })).rejects.toThrow();
  });
});
