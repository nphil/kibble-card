import { describe, expect, test } from "bun:test";
import { dualFeedPlan } from "../src/lib/dual-feed";

describe("dualFeedPlan", () => {
  test("only hopper 2 has portions -- dispenses hopper 2 alone (0/n)", () => {
    expect(dualFeedPlan(0, 3)).toEqual({ hopper: "2", amount: 3 });
  });

  test("only hopper 1 has portions -- dispenses hopper 1 alone (n/0)", () => {
    expect(dualFeedPlan(4, 0)).toEqual({ hopper: "1", amount: 4 });
  });

  test("both hoppers have portions -- dispenses a real split (a/b)", () => {
    expect(dualFeedPlan(2, 5)).toEqual({ hopper: "both", amount: 2, amount2: 5 });
  });

  test("both hoppers have the same portions -- still a split, not collapsed to a single amount", () => {
    expect(dualFeedPlan(3, 3)).toEqual({ hopper: "both", amount: 3, amount2: 3 });
  });

  test("both hoppers at zero -- nothing to dispense (0/0)", () => {
    expect(dualFeedPlan(0, 0)).toBeNull();
  });
});
