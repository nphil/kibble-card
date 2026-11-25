import { describe, expect, test } from "bun:test";
import { loadPhotoPage, loadPhotosLeft, PHOTO_PAGE_SIZE, type CallWS } from "../src/lib/review-source";

function item(uid: string) {
  return { sample: { uid }, visit: { uid: "visit-" + uid, kind: "visit", cats: [], needs_ate: false } };
}

function server(response: unknown): { callWS: CallWS; calls: Record<string, unknown>[] } {
  const calls: Record<string, unknown>[] = [];
  const callWS: CallWS = async (message) => {
    calls.push(message);
    return response;
  };
  return { callWS, calls };
}

describe("review source", () => {
  test("asks kibble/review/photos for one page, with no cursor on the first", async () => {
    const { callWS, calls } = server({ items: [item("a"), item("b")], remaining: 7, visits: 3, cursor: "next", has_more: true });
    const page = await loadPhotoPage(callWS, "entry-1");
    expect(calls).toEqual([{ type: "kibble/review/photos", entry_id: "entry-1", limit: PHOTO_PAGE_SIZE }]);
    expect(page.items.map((entry) => entry.sample.uid)).toEqual(["a", "b"]);
    expect(page).toMatchObject({ remaining: 7, visits: 3, cursor: "next", has_more: true });
  });

  test("continues from a cursor", async () => {
    const { callWS, calls } = server({ items: [], remaining: 0, visits: 0, cursor: null, has_more: false });
    await loadPhotoPage(callWS, "entry-1", "next", 10);
    expect(calls).toEqual([{ type: "kibble/review/photos", entry_id: "entry-1", limit: 10, cursor: "next" }]);
  });

  test("cleans a page on the way in", async () => {
    const { callWS } = server({ items: [item("a"), { sample: {}, visit: { uid: "v" } }, null, { sample: { uid: "x" } }], remaining: -4, visits: "many", cursor: "", has_more: "yes" });
    const page = await loadPhotoPage(callWS, "entry-1");
    expect(page.items.map((entry) => entry.sample.uid)).toEqual(["a"]);
    expect(page).toMatchObject({ remaining: 0, visits: 0, cursor: null, has_more: false });
  });

  test("an empty answer is an empty page", async () => {
    const { callWS } = server(null);
    expect(await loadPhotoPage(callWS, "entry-1")).toEqual({ items: [], remaining: 0, visits: 0, cursor: null, has_more: false });
  });

  test("the badge count asks for one photo and reads how many remain", async () => {
    const { callWS, calls } = server({ items: [item("a")], remaining: 41, visits: 9, cursor: "c", has_more: true });
    expect(await loadPhotosLeft(callWS, "entry-1")).toBe(41);
    expect(calls).toEqual([{ type: "kibble/review/photos", entry_id: "entry-1", limit: 1 }]);
  });

  test("a failed read rejects so the screen can retry", async () => {
    const callWS: CallWS = async () => {
      throw new Error("offline");
    };
    await expect(loadPhotoPage(callWS, "entry-1")).rejects.toThrow("offline");
  });
});
