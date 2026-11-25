import { describe, expect, test } from "bun:test";
import { WsQuery } from "../src/lib/ws-query";
import { FakeClock, settle } from "./helpers";

describe("WsQuery that retries", () => {
  test("keeps the last good data and says it is reconnecting when a later read fails", async () => {
    const clock = new FakeClock();
    const query = new WsQuery<string>(() => {}, { retry: [1000, 2000], timers: clock });
    let working = true;
    const run = async (): Promise<string> => {
      if (!working) throw new Error("offline");
      return "data";
    };
    query.refresh(run);
    await settle();
    expect(query.state).toMatchObject({ data: "data", error: null, reconnecting: false, loading: false });

    working = false;
    query.refresh(run);
    await settle();
    expect(query.state).toMatchObject({ data: "data", error: "offline", reconnecting: true });

    working = true;
    clock.advance(1000);
    await settle();
    expect(query.state).toMatchObject({ data: "data", error: null, reconnecting: false });
  });

  test("before any data a failure is an error, not a reconnect, and it retries on the backoff by itself", async () => {
    const clock = new FakeClock();
    const query = new WsQuery<string>(() => {}, { retry: [1000, 2000], timers: clock });
    let attempts = 0;
    const run = async (): Promise<string> => {
      attempts++;
      if (attempts < 3) throw new Error("not yet");
      return "data";
    };
    query.refresh(run);
    await settle();
    expect(query.state).toMatchObject({ data: null, error: "not yet", reconnecting: false });
    clock.advance(1000);
    await settle();
    expect(attempts).toBe(2);
    clock.advance(1999);
    await settle();
    expect(attempts).toBe(2);
    clock.advance(1);
    await settle();
    expect(attempts).toBe(3);
    expect(query.state).toMatchObject({ data: "data", error: null });
  });

  test("a read that never answers fails after the timeout", async () => {
    const clock = new FakeClock();
    const query = new WsQuery<string>(() => {}, { timeoutMs: 15_000, timers: clock });
    query.refresh(() => new Promise<string>(() => {}));
    expect(query.state.loading).toBe(true);
    clock.advance(15_000);
    await settle();
    expect(query.state).toMatchObject({ loading: false, error: "Kibble took too long to answer." });
  });

  test("retryNow runs the last read again at once, and does nothing before there was one", async () => {
    const clock = new FakeClock();
    const query = new WsQuery<string>(() => {}, { retry: [1000], timers: clock });
    query.retryNow();
    expect(query.state.loading).toBe(false);
    let attempts = 0;
    query.refresh(async () => {
      attempts++;
      throw new Error("offline");
    });
    await settle();
    query.retryNow();
    await settle();
    expect(attempts).toBe(2);
  });

  test("dispose stops the retrying", async () => {
    const clock = new FakeClock();
    const query = new WsQuery<string>(() => {}, { retry: [1000], timers: clock });
    let attempts = 0;
    query.refresh(async () => {
      attempts++;
      throw new Error("offline");
    });
    await settle();
    query.dispose();
    clock.advance(10_000);
    await settle();
    expect(attempts).toBe(1);
  });

  test("a query built without retry never retries by itself and never claims to reconnect", async () => {
    const clock = new FakeClock();
    const query = new WsQuery<string>(() => {}, { timers: clock });
    let working = true;
    const run = async (): Promise<string> => {
      if (!working) throw new Error("offline");
      return "data";
    };
    query.refresh(run);
    await settle();
    working = false;
    query.refresh(run);
    await settle();
    expect(query.state).toMatchObject({ data: "data", error: "offline", reconnecting: false });
    expect(clock.waiting).toBe(0);
  });
});
