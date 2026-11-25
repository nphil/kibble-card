/** The one answer outbox per Kibble entry, shared by every card on the page, plus the glue that
 * feeds it real Home Assistant calls. `AnswerOutbox` itself is pure; this file is where it meets
 * `localStorage`, `hass.callWS` and the browser coming back online.
 *
 * Any card that could have answers waiting (the cats card, the timeline card, the hero) asks for
 * `answerOutbox(hass, entryId)` as soon as it has a `hass`. The first ask replays whatever an
 * earlier visit left in storage, so unsent answers are delivered at card start even when nobody
 * opens the review queue. The queue and the event sheet only ever add to it and listen to it.
 */

import type { HomeAssistant, Sample, VisitResult } from "../types";
import { AnswerOutbox, outboxKey, type Answer } from "./answer-outbox";
import { CALL_TIMEOUT_MS, realTimers, withTimeout, type Timers } from "./backoff";
import { labelAte, labelSample } from "./sample-label";
import { announceReviewChange } from "./review-bus";
import { browserStorage } from "./simple-storage";

/** What Kibble said back for a delivered answer. */
export type Delivery =
  | { kind: "photo"; sample: Sample; visit: VisitResult }
  | { kind: "ate"; visit: VisitResult };

export type EntryOutbox = AnswerOutbox<Delivery>;

/** Sends one answer to Kibble and gives up if it takes longer than `CALL_TIMEOUT_MS`: a request
 * that never answers is a failed request, and the outbox tries it again. */
export function createSender(getHass: () => Pick<HomeAssistant, "callWS"> | undefined, entryId: string, timers: Timers = realTimers): (answer: Answer) => Promise<Delivery> {
  return async (answer) => {
    const hass = getHass();
    if (!hass) throw new Error("Not connected.");
    if (answer.kind === "photo") {
      const { sample, visit } = await withTimeout(labelSample(hass, entryId, { sampleUid: answer.sampleUid, label: answer.label }), CALL_TIMEOUT_MS, timers);
      return { kind: "photo", sample, visit };
    }
    const visit = await withTimeout(labelAte(hass, entryId, { visitUid: answer.visitUid, ate: answer.ate }), CALL_TIMEOUT_MS, timers);
    return { kind: "ate", visit };
  };
}

/** What the outbox's sender needs to know about the page right now. It is replaced on every
 * `willUpdate`, so the sender always uses the newest `hass`. */
interface Live {
  hass: HomeAssistant;
  /** Whether the socket was up the last time a card looked. */
  connected: boolean;
}

interface Slot {
  outbox: EntryOutbox;
  live: Live;
}

const slots = new Map<string, Slot>();
const ANNOUNCE_DELAY_MS = 600;
let listening = false;

function sendAllNow(): void {
  for (const slot of slots.values()) slot.outbox.sendNow();
}

/** Coming back to the tab or regaining the network is the moment worth trying again at once,
 * instead of waiting out a backoff that was measured against the old connection. */
function listenForWakeups(): void {
  if (listening || typeof document === "undefined") return;
  listening = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") sendAllNow();
  });
  if (typeof window !== "undefined") window.addEventListener("online", sendAllNow);
}

/** Tells the other Kibble cards on the page that photos were named, once, shortly after the last
 * answer of a burst has reached Kibble: they then refresh without waiting for the integration's
 * own push, which only arrives after its background learning. */
function announceAfterDelivery(outbox: EntryOutbox, entryId: string): void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  outbox.subscribe((event) => {
    if (event.type !== "delivered") return;
    clearTimeout(timer);
    timer = setTimeout(() => announceReviewChange(entryId), ANNOUNCE_DELAY_MS);
  });
}

/** The outbox for `entryId`. Call with the latest `hass` from `willUpdate`; it keeps the newest
 * one for sending and retries straight away when the connection to Home Assistant returns. */
export function answerOutbox(hass: HomeAssistant, entryId: string): EntryOutbox {
  const connected = hass.connected !== false;
  const known = slots.get(entryId);
  if (known) {
    known.live.hass = hass;
    if (connected && !known.live.connected) known.outbox.sendNow();
    known.live.connected = connected;
    return known.outbox;
  }
  const live: Live = { hass, connected };
  const outbox = new AnswerOutbox<Delivery>({ key: outboxKey(entryId), storage: browserStorage(), send: createSender(() => live.hass, entryId) });
  slots.set(entryId, { outbox, live });
  announceAfterDelivery(outbox, entryId);
  listenForWakeups();
  outbox.start();
  return outbox;
}
