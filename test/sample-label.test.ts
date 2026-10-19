import { describe, expect, test } from "bun:test";
import { labelSample } from "../src/lib/sample-label";

function fakeSample(overrides: Partial<{ review: string | null; label: string | null }> = {}) {
  return {
    uid: "e1-s1", t: 0, body: null, face: null, guess: null, guess_confidence: null,
    review: overrides.review ?? "Kitty", label: overrides.label ?? "Kitty",
    sid: null, box: null, crop: null, peers: [], cat: null,
  };
}

describe("labelSample", () => {
  test("sends the sample uid and label as kibble/sample/label", async () => {
    let sent: Record<string, unknown> | undefined;
    const hass = { callWS: async (message: Record<string, unknown>) => { sent = message; return { sample: fakeSample() }; } };
    await labelSample(hass, "entry-1", { sampleUid: "e1-s1", label: "Kitty" });
    expect(sent).toEqual({ type: "kibble/sample/label", entry_id: "entry-1", sample_uid: "e1-s1", label: "Kitty" });
  });

  test("resolves with the server's returned sample", async () => {
    const sample = fakeSample({ review: "skip", label: "skip" });
    const hass = { callWS: async () => ({ sample }) };
    const result = await labelSample(hass, "entry-1", { sampleUid: "e1-s1", label: "skip" });
    expect(result).toEqual(sample);
  });

  test("rejects rather than silently no-op when the connection has no callWS", async () => {
    await expect(labelSample({}, "entry-1", { sampleUid: "e1-s1", label: "Kitty" })).rejects.toThrow();
  });
});
