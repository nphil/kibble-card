import { describe, expect, test } from "bun:test";
import { UploadQueue, type UploadOutcome } from "../src/lib/upload-queue";

/** Drains the microtask queue deterministically -- every `.then`/`.finally` hop a settling
 * promise chain schedules is itself a microtask, so enough consecutive `await`s of an already-
 * resolved promise let a chain of any realistic depth fully settle. Bounded, not time-based: no
 * wall-clock cost and nothing to race, unlike a real timer. */
async function flushMicrotasks(turns = 20): Promise<void> {
  for (let i = 0; i < turns; i++) await Promise.resolve();
}

function statusesOf(queue: UploadQueue): Record<string, string> {
  return Object.fromEntries(queue.items.map((item) => [item.id, item.status]));
}

describe("UploadQueue", () => {
  test("bounds concurrency to the configured limit and pulls the next item once a slot frees", async () => {
    const gates = new Map<string, (blob: Blob) => void>();
    const queue = new UploadQueue(
      {
        compress: (id) => {
          const { promise, resolve } = Promise.withResolvers<Blob>();
          gates.set(id, resolve);
          return promise;
        },
        upload: async (): Promise<UploadOutcome> => ({ status: "added" }),
      },
      () => {},
      2,
    );
    queue.enqueue(["a", "b", "c", "d"]);
    queue.start();
    await flushMicrotasks();
    expect(statusesOf(queue)).toEqual({ a: "compressing", b: "compressing", c: "queued", d: "queued" });

    gates.get("a")!(new Blob());
    await flushMicrotasks();
    expect(statusesOf(queue)).toEqual({ a: "added", b: "compressing", c: "compressing", d: "queued" });

    gates.get("b")!(new Blob());
    gates.get("c")!(new Blob());
    await flushMicrotasks();
    expect(statusesOf(queue)).toEqual({ a: "added", b: "added", c: "added", d: "compressing" });

    gates.get("d")!(new Blob());
    await flushMicrotasks();
    expect(statusesOf(queue)).toEqual({ a: "added", b: "added", c: "added", d: "added" });
    expect(queue.allSettled).toBe(true);
  });

  test("choosing photos never starts uploads on its own -- only start() does", async () => {
    let compressCalls = 0;
    const queue = new UploadQueue(
      {
        compress: async () => {
          compressCalls++;
          return new Blob();
        },
        upload: async () => ({ status: "added" }),
      },
      () => {},
    );
    queue.enqueue(["a"]);
    await flushMicrotasks();
    expect(queue.get("a")!.status).toBe("queued");
    expect(compressCalls).toBe(0);

    queue.start();
    await flushMicrotasks();
    expect(queue.get("a")!.status).toBe("added");
    expect(compressCalls).toBe(1);
  });

  test("a thrown upload error settles as `error` carrying its message; retry resumes and can succeed", async () => {
    let attempt = 0;
    const queue = new UploadQueue(
      {
        compress: async () => new Blob(),
        upload: async (): Promise<UploadOutcome> => {
          attempt++;
          if (attempt === 1) throw new Error("network down");
          return { status: "added" };
        },
      },
      () => {},
    );
    queue.enqueue(["a"]);
    queue.start();
    await flushMicrotasks();
    expect(queue.get("a")).toEqual({ id: "a", status: "error", message: "network down" });

    queue.retry("a");
    await flushMicrotasks();
    expect(queue.get("a")).toEqual({ id: "a", status: "added", message: null });
  });

  test("retry is a no-op for an item that isn't in error", async () => {
    const queue = new UploadQueue({ compress: async () => new Blob(), upload: async () => ({ status: "added" }) }, () => {});
    queue.enqueue(["a"]);
    queue.start();
    await flushMicrotasks();
    expect(queue.get("a")!.status).toBe("added");
    queue.retry("a");
    await flushMicrotasks();
    expect(queue.get("a")!.status).toBe("added"); // unchanged, not re-queued
  });

  test("server verdicts (duplicate, no_cat) map straight to their own status without being treated as failures", async () => {
    const outcomes: Record<string, UploadOutcome> = {
      a: { status: "added" },
      b: { status: "duplicate", message: "Already have this one." },
      c: { status: "no_cat", message: "No cat found in this photo." },
    };
    const queue = new UploadQueue({ compress: async () => new Blob(), upload: async (id) => outcomes[id]! }, () => {}, 3);
    queue.enqueue(["a", "b", "c"]);
    queue.start();
    await flushMicrotasks();
    expect(queue.items.map((item) => item.status)).toEqual(["added", "duplicate", "no_cat"]);
    expect(queue.tally()).toEqual({ added: 1, duplicate: 1, no_cat: 1, error: 0, canceled: 0 });
  });

  test("cancelPending stops a still-queued item immediately and aborts an in-flight one via its signal", async () => {
    let sawAbort = false;
    const queue = new UploadQueue(
      {
        compress: (_id, signal) => {
          const { promise, reject } = Promise.withResolvers<Blob>();
          signal.addEventListener("abort", () => {
            sawAbort = true;
            reject(new DOMException("canceled", "AbortError"));
          });
          return promise;
        },
        upload: async () => ({ status: "added" }),
      },
      () => {},
      1,
    );
    queue.enqueue(["a", "b"]);
    queue.start();
    await flushMicrotasks();
    expect(queue.get("a")!.status).toBe("compressing");
    expect(queue.get("b")!.status).toBe("queued");

    queue.cancelPending();
    await flushMicrotasks();
    expect(sawAbort).toBe(true);
    expect(queue.get("a")).toEqual({ id: "a", status: "canceled", message: null });
    expect(queue.get("b")).toEqual({ id: "b", status: "canceled", message: null });
    expect(queue.allSettled).toBe(true);
  });

  test("dispose aborts in-flight work and stops the pool from starting anything new", async () => {
    let uploadCalls = 0;
    const queue = new UploadQueue(
      {
        compress: (_id, signal) => {
          const { promise, reject } = Promise.withResolvers<Blob>();
          signal.addEventListener("abort", () => reject(new DOMException("canceled", "AbortError")));
          return promise;
        },
        upload: async () => {
          uploadCalls++;
          return { status: "added" };
        },
      },
      () => {},
      1,
    );
    queue.enqueue(["a", "b"]);
    queue.start();
    await flushMicrotasks();
    queue.dispose();
    await flushMicrotasks();
    expect(queue.get("a")!.status).toBe("canceled");
    expect(queue.get("b")!.status).toBe("queued"); // dispose stops the pool; it does not cancel the untouched backlog
    expect(uploadCalls).toBe(0);
  });
});
