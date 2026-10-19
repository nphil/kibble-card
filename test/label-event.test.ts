import { describe, expect, test } from "bun:test";
import { labelEvents } from "../src/lib/label-event";
import type { TimelineEvent } from "../src/types";

function fakeEvent(uid: string): TimelineEvent {
  return { uid, kind: "visit", start: 0, end: 0, open: false, cat: "Kitty", identity: "reviewed", confidence: null, thumb: null, scene: null, before: null, after: null, sample_count: 0, session: null };
}

describe("labelEvents", () => {
  test("sends every uid and label as kibble/label, with no sample selection of its own", async () => {
    let sent: Record<string, unknown> | undefined;
    const hass = { callWS: async (message: Record<string, unknown>) => { sent = message; return { events: [fakeEvent("a"), fakeEvent("b")] }; } };
    await labelEvents(hass, "entry-1", { uids: ["a", "b"], label: "Kitty" });
    expect(sent).toEqual({ type: "kibble/label", entry_id: "entry-1", uids: ["a", "b"], label: "Kitty" });
  });

  test("resolves with the server's returned events array", async () => {
    const hass = { callWS: async () => ({ events: [fakeEvent("a"), fakeEvent("b")] }) };
    const result = await labelEvents(hass, "entry-1", { uids: ["a", "b"], label: "not_a_cat" });
    expect(result).toEqual([fakeEvent("a"), fakeEvent("b")]);
  });

  test("rejects rather than silently no-op when the connection has no callWS", async () => {
    await expect(labelEvents({}, "entry-1", { uids: ["a"], label: "Kitty" })).rejects.toThrow();
  });
});
