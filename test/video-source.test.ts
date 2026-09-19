import { describe, expect, test } from "bun:test";
import { pickVideoSource } from "../src/lib/video-source";

describe("pickVideoSource", () => {
  test("a Scrypted device id and token win over a configured camera entity", () => {
    expect(pickVideoSource("scrypted-1", "token-abc", "camera.feeder")).toEqual({
      kind: "scrypted",
      deviceId: "scrypted-1",
      token: "token-abc",
    });
  });

  test("a missing token falls back to the camera entity", () => {
    expect(pickVideoSource("scrypted-1", undefined, "camera.feeder")).toEqual({
      kind: "ha-camera",
      entityId: "camera.feeder",
    });
  });

  test("a missing device id falls back to the camera entity", () => {
    expect(pickVideoSource(undefined, "token-abc", "camera.feeder")).toEqual({
      kind: "ha-camera",
      entityId: "camera.feeder",
    });
  });

  test("neither Scrypted nor a camera entity leaves no video source", () => {
    expect(pickVideoSource(undefined, undefined, undefined)).toEqual({ kind: "none" });
  });
});
