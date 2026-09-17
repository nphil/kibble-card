import { describe, expect, test } from "bun:test";
import { hopperStatus, parseHopperLevel } from "../src/lib/hopper-status";

describe("hopperStatus", () => {
  test("nothing until either side has reported", () => {
    expect(hopperStatus(null, null)).toBeNull();
  });

  test("both fine is one quiet line", () => {
    expect(hopperStatus("ok", "ok")).toEqual({ text: "Hopper stocked", tone: "ok" });
    expect(hopperStatus("ok", null)).toEqual({ text: "Hopper stocked", tone: "ok" });
  });

  test("names only the side that needs attention", () => {
    expect(hopperStatus("ok", "low")).toEqual({ text: "Hopper 2 running low", tone: "low" });
    expect(hopperStatus("empty", "ok")).toEqual({ text: "Hopper 1 empty", tone: "empty" });
  });

  test("two different problems list both; empty wins the tone", () => {
    expect(hopperStatus("low", "empty")).toEqual({ text: "Hopper 1 running low · Hopper 2 empty", tone: "empty" });
  });

  test("the same problem on both sides collapses to one phrase", () => {
    expect(hopperStatus("empty", "empty")).toEqual({ text: "Hopper empty", tone: "empty" });
    expect(hopperStatus("low", "low")).toEqual({ text: "Hopper running low", tone: "low" });
  });

  test("parseHopperLevel rejects unavailable/unknown", () => {
    expect(parseHopperLevel("unavailable")).toBeNull();
    expect(parseHopperLevel(undefined)).toBeNull();
    expect(parseHopperLevel("low")).toBe("low");
  });
});
