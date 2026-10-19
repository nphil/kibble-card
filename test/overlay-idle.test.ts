import { describe, expect, test } from "bun:test";
import { HIDDEN, VISIBLE, onIdleTimeout, revealOnFirstTap, shouldArmTimer } from "../src/lib/overlay-idle";

describe("VISIBLE / HIDDEN", () => {
  test("are the two opposite, distinguishable states", () => {
    expect(VISIBLE.visible).toBe(true);
    expect(HIDDEN.visible).toBe(false);
  });
});

describe("revealOnFirstTap", () => {
  test("a tap while hidden reveals the controls and reports the tap as consumed", () => {
    const { state, consumed } = revealOnFirstTap(HIDDEN);
    expect(state.visible).toBe(true);
    expect(consumed).toBe(true);
  });

  test("a tap while already visible changes nothing and is not consumed", () => {
    const { state, consumed } = revealOnFirstTap(VISIBLE);
    expect(state).toBe(VISIBLE);
    expect(consumed).toBe(false);
  });
});

describe("onIdleTimeout", () => {
  test("hides the controls when nothing pins them", () => {
    expect(onIdleTimeout(VISIBLE, false)).toEqual(HIDDEN);
  });

  test("leaves a pinned state exactly as it was, visible", () => {
    expect(onIdleTimeout(VISIBLE, true)).toBe(VISIBLE);
  });

  test("a pinned, already-hidden state is also left untouched", () => {
    // Should never happen in practice (the component never arms the timer while hidden), but the
    // function itself must not invent a reveal it was never asked for.
    expect(onIdleTimeout(HIDDEN, true)).toBe(HIDDEN);
  });
});

describe("shouldArmTimer", () => {
  test("arms while visible and nothing pins it -- the normal running-down-to-zero case", () => {
    expect(shouldArmTimer(VISIBLE, false)).toBe(true);
  });

  test("never arms while pinned, even though the controls are visible", () => {
    expect(shouldArmTimer(VISIBLE, true)).toBe(false);
  });

  test("never arms while already hidden -- nothing left to time out", () => {
    expect(shouldArmTimer(HIDDEN, false)).toBe(false);
  });

  test("never arms while both hidden and pinned", () => {
    expect(shouldArmTimer(HIDDEN, true)).toBe(false);
  });
});

describe("a full pinned interaction sequence", () => {
  test("activity reveals, a pin holds it open past what would have been the timeout, and it re-arms once the pin ends", () => {
    // 1. Activity reveals the controls.
    let state: typeof VISIBLE = VISIBLE;
    expect(state.visible).toBe(true);

    // 2. Something pins them (e.g. talkback starts) -- the timer must not be armed at all.
    let pinned = true;
    expect(shouldArmTimer(state, pinned)).toBe(false);

    // 3. Even if a stale timer somehow fired while pinned, the controls must stay visible.
    state = onIdleTimeout(state, pinned) as typeof VISIBLE;
    expect(state.visible).toBe(true);

    // 4. The pin ends -- the component is expected to treat this like fresh activity and re-arm.
    pinned = false;
    expect(shouldArmTimer(state, pinned)).toBe(true);

    // 5. With nothing pinning it and no further activity, the next timeout really does hide it.
    state = onIdleTimeout(state, pinned) as typeof VISIBLE;
    expect(state.visible).toBe(false);
  });
});
