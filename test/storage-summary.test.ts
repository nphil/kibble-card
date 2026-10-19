import { describe, expect, test } from "bun:test";
import { formatBytes, spoolSummary, storageSummary } from "../src/lib/storage-summary";

describe("formatBytes", () => {
  test("whole MB in the common range", () => {
    expect(formatBytes(184 * 1024 * 1024)).toBe("184 MB");
  });

  test("one decimal place under 10 MB so small usage doesn't round to nothing", () => {
    expect(formatBytes(Math.round(2.4 * 1024 * 1024))).toBe("2.4 MB");
  });

  test("switches to GB at 1000 MB and up", () => {
    expect(formatBytes(1200 * 1024 * 1024)).toBe("1.2 GB");
  });

  test("whole GB once past 10 GB", () => {
    expect(formatBytes(15 * 1024 * 1024 * 1024)).toBe("15 GB");
  });
});

describe("storageSummary", () => {
  test("matches the documented example exactly", () => {
    expect(storageSummary({ used_bytes: 184 * 1024 * 1024, retention_days: 14 })).toBe("Using 184 MB, keeping 14 days");
  });

  test("singular day", () => {
    expect(storageSummary({ used_bytes: 10 * 1024 * 1024, retention_days: 1 })).toBe("Using 10 MB, keeping 1 day");
  });
});

describe("spoolSummary", () => {
  test("null when the daemon reported nothing", () => {
    expect(spoolSummary(null)).toBeNull();
  });

  test("formats both sides of the feeder's own transient spool", () => {
    expect(spoolSummary({ used_bytes: Math.round(2.1 * 1024 * 1024), cap_bytes: 8 * 1024 * 1024 })).toBe("Feeder buffer 2.1 MB of 8.0 MB");
  });
});
