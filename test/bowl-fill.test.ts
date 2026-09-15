import { describe, expect, test } from "bun:test";
import { combineBowlFill } from "../src/lib/bowl-fill";

describe("combineBowlFill", () => {
  test("treats readings within the equality threshold as one shared bowl", () => {
    expect(combineBowlFill(60, 63)).toEqual({ split: false, hopper1: 60, hopper2: 63, combined: 62 });
  });

  test("splits into two chambers once the difference reaches the threshold", () => {
    expect(combineBowlFill(80, 20)).toEqual({ split: true, hopper1: 80, hopper2: 20, combined: null });
  });

  test("degrades to the single reading when only one auger reports", () => {
    expect(combineBowlFill(45, null)).toEqual({ split: false, hopper1: 45, hopper2: null, combined: 45 });
  });

  test("returns all nulls when neither auger reports", () => {
    expect(combineBowlFill(null, null)).toEqual({ split: false, hopper1: null, hopper2: null, combined: null });
  });
});
