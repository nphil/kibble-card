import { describe, expect, test } from "bun:test";
import { CLIP_SEEK_LEAD_MS, clipSeekOffsetSeconds } from "../src/lib/clip-offset";

describe("clipSeekOffsetSeconds", () => {
  test("seeks to the session's own start, minus the lead, relative to the clip's own start", () => {
    // Session starts 20s into the clip -- minus the 3s lead, the video should start at 17s.
    const clipStartMs = 1_000_000;
    const eventStartSeconds = clipStartMs / 1000 + 20;
    expect(clipSeekOffsetSeconds(eventStartSeconds, clipStartMs)).toBe(17);
  });

  test("clamps to 0 when the session starts at or before the clip's own start", () => {
    const clipStartMs = 1_000_000;
    expect(clipSeekOffsetSeconds(clipStartMs / 1000, clipStartMs)).toBe(0);
    expect(clipSeekOffsetSeconds(clipStartMs / 1000 - 10, clipStartMs)).toBe(0);
  });

  test("clamps to 0 for the lead window itself, not just before the clip", () => {
    // Within CLIP_SEEK_LEAD_MS of the clip's own start -- the lead would push it negative.
    const clipStartMs = 1_000_000;
    const eventStartSeconds = clipStartMs / 1000 + CLIP_SEEK_LEAD_MS / 1000 - 1;
    expect(clipSeekOffsetSeconds(eventStartSeconds, clipStartMs)).toBe(0);
  });

  test("a later split segment seeks further into the shared clip than an earlier one", () => {
    // The realistic multi-cat shape: Kitty's own segment starts at the clip's own start,
    // Pancake's starts two minutes later -- her own seek offset must land well past Kitty's.
    const clipStartMs = 1_000_000;
    const kittyOffset = clipSeekOffsetSeconds(clipStartMs / 1000, clipStartMs);
    const pancakeOffset = clipSeekOffsetSeconds(clipStartMs / 1000 + 120, clipStartMs);
    expect(pancakeOffset).toBeGreaterThan(kittyOffset);
    expect(pancakeOffset).toBe(117);
  });
});
