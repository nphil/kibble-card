import { describe, expect, test } from "bun:test";
import { AnswerOutbox, answerId, describeDrops, describeWaiting, outboxKey, terminalReason, type Answer, type OutboxEvent } from "../src/lib/answer-outbox";
import type { SimpleStorage } from "../src/lib/simple-storage";
import { FakeClock, memoryStorage, settle } from "./helpers";

const photo = (sampleUid: string, label: string): Answer => ({ kind: "photo", sampleUid, label });
const ate = (visitUid: string, cats: string[]): Answer => ({ kind: "ate", visitUid, ate: cats });
const labelOf = (answer: Answer): string => (answer.kind === "photo" ? `${answer.sampleUid}:${answer.label}` : `ate:${answer.visitUid}`);
const KEY = outboxKey("entry-1");
const offline = { code: "unknown_error", message: "offline" };

describe("delivery", () => {
  test("an answer is recorded at once, sent, and forgotten when Kibble has it", async () => {
    const sent: Answer[] = [];
    const events: OutboxEvent<string>[] = [];
    const storage = memoryStorage();
    const outbox = new AnswerOutbox<string>({ key: KEY, storage, timers: new FakeClock(), send: async (answer) => (sent.push(answer), "saved") });
    outbox.subscribe((event) => events.push(event));
    outbox.enqueue(photo("s1", "Kitty"));
    expect(outbox.size).toBe(1);
    expect(storage.data.has(KEY)).toBe(true);
    await settle();
    expect(sent).toEqual([photo("s1", "Kitty")]);
    expect(outbox.size).toBe(0);
    expect(events).toEqual([{ type: "change" }, { type: "delivered", answer: photo("s1", "Kitty"), result: "saved" }, { type: "change" }]);
  });

  test("answers go one at a time, oldest first", async () => {
    const started: string[] = [];
    const finish: (() => void)[] = [];
    const outbox = new AnswerOutbox<string>({
      key: KEY,
      storage: null,
      timers: new FakeClock(),
      send: (answer) =>
        new Promise((resolve) => {
          started.push(labelOf(answer));
          finish.push(() => resolve("ok"));
        }),
    });
    outbox.enqueue(photo("a", "Kitty"));
    outbox.enqueue(photo("b", "Pancake"));
    outbox.enqueue(ate("v1", ["Kitty"]));
    expect(started).toEqual(["a:Kitty"]);
    finish[0]!();
    await settle();
    expect(started).toEqual(["a:Kitty", "b:Pancake"]);
    finish[1]!();
    await settle();
    finish[2]!();
    await settle();
    expect(started).toEqual(["a:Kitty", "b:Pancake", "ate:v1"]);
    expect(outbox.size).toBe(0);
  });

  test("a newer answer for the same photo replaces an older one that was not acknowledged", async () => {
    const started: string[] = [];
    const finish: (() => void)[] = [];
    const delivered: string[] = [];
    const outbox = new AnswerOutbox<string>({
      key: KEY,
      storage: null,
      timers: new FakeClock(),
      send: (answer) =>
        new Promise((resolve) => {
          started.push(labelOf(answer));
          finish.push(() => resolve(labelOf(answer)));
        }),
    });
    outbox.subscribe((event) => event.type === "delivered" && delivered.push(event.result));
    outbox.enqueue(photo("a", "Kitty"));
    outbox.enqueue(photo("a", "skip"));
    expect(outbox.pendingLabel("a")).toBe("skip");
    finish[0]!();
    await settle();
    finish[1]!();
    await settle();
    expect(started).toEqual(["a:Kitty", "a:skip"]);
    expect(delivered).toEqual(["a:skip"]);
  });

  test("what waits is known per photo, a waiting undo included, and a visit's question is not a photo", () => {
    const outbox = new AnswerOutbox({ key: KEY, storage: null, timers: new FakeClock(), send: () => new Promise(() => {}) });
    outbox.enqueue(photo("a", "Kitty"));
    outbox.enqueue(photo("b", "follow"));
    outbox.enqueue(ate("v1", ["Kitty"]));
    expect(outbox.pendingLabel("a")).toBe("Kitty");
    expect(outbox.pendingLabel("b")).toBe("follow");
    expect(outbox.pendingLabel("zzz")).toBeUndefined();
    expect([...outbox.pendingPhotoLabels()]).toEqual([["a", "Kitty"], ["b", "follow"]]);
  });
});

describe("retrying", () => {
  test("a failed answer waits 1, 2, 5, 10, then 30 seconds between tries", async () => {
    const clock = new FakeClock();
    let attempts = 0;
    const outbox = new AnswerOutbox({
      key: KEY,
      storage: null,
      timers: clock,
      send: async () => {
        attempts++;
        throw offline;
      },
    });
    outbox.enqueue(photo("a", "Kitty"));
    await settle();
    expect(attempts).toBe(1);
    let expected = 1;
    for (const wait of [1000, 2000, 5000, 10_000, 30_000, 30_000]) {
      clock.advance(wait - 1);
      await settle();
      expect(attempts).toBe(expected);
      clock.advance(1);
      await settle();
      expect(attempts).toBe(++expected);
    }
    expect(outbox.size).toBe(1);
  });

  test("one stuck answer does not hold up the ones behind it", async () => {
    const sent: string[] = [];
    const outbox = new AnswerOutbox({
      key: KEY,
      storage: null,
      timers: new FakeClock(),
      send: async (answer) => {
        sent.push(labelOf(answer));
        if (answer.kind === "photo" && answer.sampleUid === "stuck") throw offline;
        return "ok";
      },
    });
    outbox.enqueue(photo("stuck", "Kitty"));
    outbox.enqueue(photo("fine", "Pancake"));
    await settle();
    expect(sent).toEqual(["stuck:Kitty", "fine:Pancake"]);
    expect(outbox.entries.map((entry) => labelOf(entry.answer))).toEqual(["stuck:Kitty"]);
  });

  test("Send now forgets the waiting and tries again at once", async () => {
    let attempts = 0;
    const outbox = new AnswerOutbox({
      key: KEY,
      storage: null,
      timers: new FakeClock(),
      send: async () => {
        attempts++;
        throw offline;
      },
    });
    outbox.enqueue(photo("a", "Kitty"));
    await settle();
    outbox.sendNow();
    await settle();
    expect(attempts).toBe(2);
  });

  test("Send now with nothing waiting does nothing", () => {
    const events: OutboxEvent[] = [];
    const outbox = new AnswerOutbox({ key: KEY, storage: null, timers: new FakeClock(), send: async () => "ok" });
    outbox.subscribe((event) => events.push(event));
    outbox.sendNow();
    expect(events).toEqual([]);
  });

  test("a timeout, a lost connection or a server hiccup is kept and tried again", async () => {
    for (const failure of [{ code: "timeout", message: "slow" }, { code: "unknown_error", message: "oops" }, new Error("socket closed")]) {
      const outbox = new AnswerOutbox({
        key: KEY,
        storage: null,
        timers: new FakeClock(),
        send: async () => {
          throw failure;
        },
      });
      outbox.enqueue(photo("a", "Kitty"));
      await settle();
      expect(outbox.size).toBe(1);
      expect(outbox.drops).toEqual([]);
    }
  });

  test("a disposed outbox stops trying", async () => {
    const clock = new FakeClock();
    let attempts = 0;
    const outbox = new AnswerOutbox({
      key: KEY,
      storage: null,
      timers: clock,
      send: async () => {
        attempts++;
        throw offline;
      },
    });
    outbox.enqueue(photo("a", "Kitty"));
    await settle();
    outbox.dispose();
    clock.advance(60_000);
    await settle();
    expect(attempts).toBe(1);
  });
});

describe("answers Kibble will never accept", () => {
  test("not found and refused answers are dropped, reported once, and not tried again", async () => {
    for (const code of ["not_found", "agent_rejected"] as const) {
      const events: OutboxEvent[] = [];
      const outbox = new AnswerOutbox({
        key: KEY,
        storage: null,
        timers: new FakeClock(),
        send: async () => {
          throw { code, message: "no" };
        },
      });
      outbox.subscribe((event) => events.push(event));
      outbox.enqueue(photo("a", "Kitty"));
      await settle();
      expect(outbox.size).toBe(0);
      expect(outbox.drops).toEqual([{ answer: photo("a", "Kitty"), reason: code }]);
      expect(events.filter((event) => event.type === "dropped")).toEqual([{ type: "dropped", answer: photo("a", "Kitty"), reason: code }]);
      outbox.clearDrops();
      expect(outbox.drops).toEqual([]);
    }
  });

  test("the final no is told apart from every other failure", () => {
    expect(terminalReason({ code: "not_found" })).toBe("not_found");
    expect(terminalReason({ code: "agent_rejected" })).toBe("agent_rejected");
    expect(terminalReason({ code: "timeout" })).toBeNull();
    expect(terminalReason(new Error("x"))).toBeNull();
    expect(terminalReason(null)).toBeNull();
  });
});

describe("surviving a reload", () => {
  test("a new outbox on the same storage sends what the last one left, in order", async () => {
    const storage = memoryStorage();
    const first = new AnswerOutbox({
      key: KEY,
      storage,
      timers: new FakeClock(),
      send: async () => {
        throw offline;
      },
    });
    first.enqueue(photo("a", "Kitty"));
    first.enqueue(ate("v1", ["Pancake"]));
    await settle();
    first.dispose();

    const sent: string[] = [];
    const reloaded = new AnswerOutbox({ key: KEY, storage, timers: new FakeClock(), send: async (answer) => (sent.push(labelOf(answer)), "ok") });
    expect(reloaded.size).toBe(2);
    reloaded.start();
    await settle();
    expect(sent).toEqual(["a:Kitty", "ate:v1"]);
    expect(reloaded.size).toBe(0);
  });

  test("only what was written is read back: the newest answer per photo, in order, nothing malformed", () => {
    const storage = memoryStorage({
      [KEY]: JSON.stringify({
        v: 1,
        entries: [
          { seq: 2, answer: photo("a", "Pancake") },
          { seq: 1, answer: photo("a", "Kitty") },
          { seq: 3, answer: ate("v1", ["Kitty"]) },
          { seq: "x", answer: photo("b", "Kitty") },
          { seq: 4, answer: ate("v2", []) },
          { seq: 5, answer: { kind: "photo", sampleUid: 7, label: "Kitty" } },
          null,
        ],
      }),
    });
    const outbox = new AnswerOutbox({ key: KEY, storage, timers: new FakeClock(), send: async () => "ok" });
    expect(outbox.entries.map((entry) => labelOf(entry.answer))).toEqual(["a:Pancake", "ate:v1"]);
    outbox.enqueue(photo("c", "skip"));
    expect(outbox.entries[outbox.entries.length - 1]!.seq).toBe(4);
  });

  test("other versions, garbage and blocked storage all start empty", () => {
    for (const stored of [JSON.stringify({ v: 2, entries: [{ seq: 1, answer: photo("a", "Kitty") }] }), "not json", "null", "7"]) {
      const outbox = new AnswerOutbox({ key: KEY, storage: memoryStorage({ [KEY]: stored }), timers: new FakeClock(), send: async () => "ok" });
      expect(outbox.size).toBe(0);
    }
    const blocked: SimpleStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    const outbox = new AnswerOutbox({ key: KEY, storage: blocked, timers: new FakeClock(), send: () => new Promise(() => {}) });
    outbox.enqueue(photo("a", "Kitty"));
    expect(outbox.size).toBe(1);
  });
});

describe("words and ids", () => {
  test("two answers are the same question when they are about the same photo or visit", () => {
    expect(answerId(photo("s1", "Kitty"))).toBe(answerId(photo("s1", "skip")));
    expect(answerId(photo("s1", "Kitty"))).not.toBe(answerId(ate("s1", ["Kitty"])));
    expect(outboxKey("entry-1")).toBe("kibble:outbox:entry-1");
  });

  test("the waiting line", () => {
    expect(describeWaiting(0)).toBe("");
    expect(describeWaiting(1)).toBe("1 answer waiting to send");
    expect(describeWaiting(12)).toBe("12 answers waiting to send");
  });

  test("one calm sentence for what could not be saved", () => {
    expect(describeDrops([])).toBe("");
    expect(describeDrops([{ answer: photo("a", "Kitty"), reason: "not_found" }])).toBe("1 answer could not be saved: that photo no longer exists");
    expect(describeDrops([{ answer: photo("a", "Kitty"), reason: "not_found" }, { answer: photo("b", "Kitty"), reason: "not_found" }])).toBe("2 answers could not be saved: those photos no longer exist");
    expect(describeDrops([{ answer: ate("v1", ["Kitty"]), reason: "not_found" }])).toBe("1 answer could not be saved: that visit no longer exists");
    expect(describeDrops([{ answer: photo("a", "Kitty"), reason: "agent_rejected" }])).toBe("1 answer could not be saved: Kibble did not accept it");
    expect(describeDrops([{ answer: photo("a", "Kitty"), reason: "agent_rejected" }, { answer: photo("b", "Kitty"), reason: "not_found" }])).toBe("2 answers could not be saved");
  });
});
