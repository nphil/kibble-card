import { describe, expect, test } from "bun:test";
import { loadTimelineVisits, loadUnknownCount, loadUnknownVisits, type CallWS } from "../src/lib/review-source";
import type { TimelineEvent } from "../src/types";

function row(uid: string, kind: TimelineEvent["kind"] = "visit"): TimelineEvent {
  return { uid, kind, start: 1, end: 2, open: false, cat: null, identity: "unknown", confidence: null, thumb: null, scene: null, before: null, after: null, sample_count: 0, session: null };
}

/** A server that hands out `pages` one cursor at a time and records every request. */
function pagedServer(pages: TimelineEvent[][], total?: number): { callWS: CallWS; calls: Record<string, unknown>[] } {
  const calls: Record<string, unknown>[] = [];
  const callWS: CallWS = async (message) => {
    calls.push(message);
    const index = message.cursor ? Number(message.cursor) : 0;
    const more = index < pages.length - 1;
    return { items: pages[index] ?? [], cursor: more ? String(index + 1) : null, has_more: more, ...(total === undefined ? {} : { total }) };
  };
  return { callWS, calls };
}

describe("review source", () => {
  test("reads every page of unknown visits and reports the server's total", async () => {
    const { callWS, calls } = pagedServer([[row("a"), row("b")], [row("c")]], 3);
    const result = await loadUnknownVisits(callWS, "entry-1");
    expect(result.items.map((item) => item.uid)).toEqual(["a", "b", "c"]);
    expect(result.total).toBe(3);
    expect(calls).toEqual([
      { type: "kibble/review", entry_id: "entry-1", limit: 60 },
      { type: "kibble/review", entry_id: "entry-1", limit: 60, cursor: "1" },
    ]);
  });

  test("the timeline read keeps visits and meals and drops feeds", async () => {
    const { callWS, calls } = pagedServer([[row("a"), row("f", "feed")], [row("m", "eat")]]);
    const items = await loadTimelineVisits(callWS, "entry-1");
    expect(items.map((item) => item.uid)).toEqual(["a", "m"]);
    expect(calls[0]).toEqual({ type: "kibble/timeline", entry_id: "entry-1", limit: 100 });
  });

  test("stops after a fixed number of pages even if the server never runs out", async () => {
    let calls = 0;
    const callWS: CallWS = async () => {
      calls++;
      return { items: [row("x" + calls)], cursor: "again", has_more: true, total: 999 };
    };
    const result = await loadUnknownVisits(callWS, "entry-1");
    expect(calls).toBe(20);
    expect(result.items).toHaveLength(20);
  });

  test("the badge count asks for one row only", async () => {
    const { callWS, calls } = pagedServer([[row("a")]], 41);
    expect(await loadUnknownCount(callWS, "entry-1")).toBe(41);
    expect(calls).toEqual([{ type: "kibble/review", entry_id: "entry-1", limit: 1 }]);
  });

  test("a failed read rejects so the screen can offer a retry", async () => {
    const callWS: CallWS = async () => {
      throw new Error("offline");
    };
    await expect(loadUnknownVisits(callWS, "entry-1")).rejects.toThrow("offline");
  });
});
