import { describe, expect, test } from "bun:test";
import { answerOutbox, createSender } from "../src/lib/answer-sync";
import { CALL_TIMEOUT_MS } from "../src/lib/backoff";
import type { HomeAssistant, Sample, VisitResult } from "../src/types";
import { FakeClock, settle } from "./helpers";

const sample: Sample = { uid: "s1", t: 0, body: null, face: null, guess: null, guess_confidence: null, review: "Kitty", label: "Kitty", sid: null, box: null, crop: null, peers: [], cat: null };
const visit: VisitResult = { uid: "v1", kind: "eat", cats: [{ cat: "Kitty", ate: true }], needs_ate: false };

function fakeHass(name: string, calls: string[]): HomeAssistant {
  return {
    states: {},
    entities: {},
    devices: {},
    themes: {},
    language: "en",
    callService: async () => undefined,
    callWS: async (message) => {
      calls.push(`${name}:${String(message.type)}`);
      return message.type === "kibble/session/ate" ? { visit } : { sample, visit };
    },
  };
}

describe("createSender", () => {
  test("a photo answer goes to kibble/sample/label and comes back with the sample and the visit", async () => {
    const sent: Record<string, unknown>[] = [];
    const hass = { callWS: async (message: Record<string, unknown>) => (sent.push(message), { sample, visit }) };
    const send = createSender(() => hass, "entry-1");
    expect(await send({ kind: "photo", sampleUid: "s1", label: "Kitty" })).toEqual({ kind: "photo", sample, visit });
    expect(sent).toEqual([{ type: "kibble/sample/label", entry_id: "entry-1", sample_uid: "s1", label: "Kitty" }]);
  });

  test("a who-ate answer goes to kibble/session/ate", async () => {
    const sent: Record<string, unknown>[] = [];
    const hass = { callWS: async (message: Record<string, unknown>) => (sent.push(message), { visit }) };
    const send = createSender(() => hass, "entry-1");
    expect(await send({ kind: "ate", visitUid: "v1", ate: ["Kitty"] })).toEqual({ kind: "ate", visit });
    expect(sent).toEqual([{ type: "kibble/session/ate", entry_id: "entry-1", uid: "v1", ate: ["Kitty"] }]);
  });

  test("without a connection it fails, so the answer stays waiting", async () => {
    const send = createSender(() => undefined, "entry-1");
    await expect(send({ kind: "photo", sampleUid: "s1", label: "Kitty" })).rejects.toThrow("Not connected.");
  });

  test("a request that never answers fails after the timeout", async () => {
    const clock = new FakeClock();
    const send = createSender(() => ({ callWS: () => new Promise<never>(() => {}) }), "entry-1", clock);
    const outcome = send({ kind: "photo", sampleUid: "s1", label: "Kitty" }).then(
      () => null,
      (err: unknown) => err,
    );
    clock.advance(CALL_TIMEOUT_MS);
    expect(await outcome).toMatchObject({ code: "timeout" });
  });
});

describe("the shared outbox", () => {
  test("is one per entry, and sends with the newest hass", async () => {
    const calls: string[] = [];
    const outbox = answerOutbox(fakeHass("old", calls), "entry-shared");
    expect(answerOutbox(fakeHass("new", calls), "entry-shared")).toBe(outbox);
    outbox.enqueue({ kind: "photo", sampleUid: "s1", label: "Kitty" });
    await settle();
    expect(calls).toEqual(["new:kibble/sample/label"]);
    expect(outbox.size).toBe(0);
  });
});
