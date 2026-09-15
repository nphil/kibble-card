import { describe, expect, test } from "bun:test";
import { deriveFeederStatus, relativeTime, statusText } from "../src/lib/feeding";

describe("deriveFeederStatus", () => {
  test("is unreachable when every core sensor is down", () => {
    expect(deriveFeederStatus(["unavailable", "unknown", undefined], "unavailable")).toBe("unreachable");
  });

  test("is unreachable when no core entities resolved at all", () => {
    expect(deriveFeederStatus([], undefined)).toBe("unreachable");
  });

  test("is dispensing when feeding is on, even if one other core sensor is briefly odd", () => {
    expect(deriveFeederStatus(["62", "unknown", "3"], "on")).toBe("dispensing");
  });

  test("is idle when reachable and not feeding", () => {
    expect(deriveFeederStatus(["62", "58", "3"], "off")).toBe("idle");
  });
});

describe("relativeTime", () => {
  const base = new Date(2026, 0, 1, 12, 0, 0);

  test("collapses sub-minute gaps to just now", () => {
    expect(relativeTime(base, new Date(2026, 0, 1, 12, 0, 30))).toBe("just now");
  });

  test("uses minutes under an hour", () => {
    expect(relativeTime(base, new Date(2026, 0, 1, 12, 45, 0))).toBe("45m ago");
  });

  test("uses hours under a day", () => {
    expect(relativeTime(base, new Date(2026, 0, 1, 14, 0, 0))).toBe("2h ago");
  });

  test("uses days at 24h and beyond", () => {
    expect(relativeTime(base, new Date(2026, 0, 3, 12, 0, 0))).toBe("2d ago");
  });
});

describe("statusText", () => {
  test("names the interface's own unreachable message, not a raw state", () => {
    expect(statusText("unreachable", null)).toBe("Feeder unreachable \u2014 check that kibbled is running");
  });

  test("shows Dispensing while a feed is running, ignoring any stale last-fed text", () => {
    expect(statusText("dispensing", "2h ago")).toBe("Dispensing\u2026");
  });

  test("shows Fed <relative> when idle with feed history", () => {
    expect(statusText("idle", "2h ago")).toBe("Fed 2h ago");
  });

  test("shows Ready to feed when idle with no feed history yet", () => {
    expect(statusText("idle", null)).toBe("Ready to feed");
  });
});
