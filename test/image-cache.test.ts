import { describe, expect, test } from "bun:test";
import { kibbleImageUrl } from "../src/lib/image-cache";

describe("kibbleImageUrl", () => {
  test("builds the HTTP image view path for a simple kind", () => {
    expect(kibbleImageUrl("01ABC", "event", "1789580000.jpg")).toBe("/api/kibble/01ABC/image/event/1789580000.jpg");
  });

  test("builds a nested sample/{cat} kind as two path segments", () => {
    expect(kibbleImageUrl("01ABC", "sample/Pancake", "1789580000.jpg")).toBe(
      "/api/kibble/01ABC/image/sample/Pancake/1789580000.jpg",
    );
  });

  test("percent-encodes a cat name and filename with spaces or special characters", () => {
    expect(kibbleImageUrl("01ABC", "sample/Mr Whiskers", "a b.jpg")).toBe(
      "/api/kibble/01ABC/image/sample/Mr%20Whiskers/a%20b.jpg",
    );
  });
});
