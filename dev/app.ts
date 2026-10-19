/** Dev harness bootstrap. Reads `?card=hero|timeline|cats|schedule&scenario=idle|dispensing|unreachable&fixture=default|multicat-a|multicat-b|multicat-c`
 * &theme=light|dark&width=<px>&height=<px>&name=<text>&limit=<n>&hopper1=<level>&hopper2=
 * <level>&single=<0|1>&food1=<text>&food2=<text>` from the URL, mounts one real card against
 * the mock hass, and sets `window.__kibbleReady` once it has actually finished rendering so
 * the screenshot script is not guessing with a fixed delay. `card` defaults to `hero`; `scenario` only affects the hero.
 * The multi-cat fixtures exercise the e2060 review, confirmed companions, and the one-cat case.
 * `hopper1`/`hopper2`/`single`/`food1`/`food2` (hero only) force the point sensors
 * (`empty`/`low`/`ok`/`unknown`), the divider switch, and hopper food names on top of the
 * chosen scenario. `unknown` maps to `unavailable`, matching a real MCU that has not reported.
 * `single=1` switches the divider off (undivided mode).
 * `schedule=divider|mixed` (hero and schedule card) swaps the schedule table: `divider` (the default) is the
 * live 00:00 and 12:00 feeds at 0 + 3 portions, `mixed` shows every row shape the per-hopper
 * editor draws. `schedule_fail=1` makes every `kibble.schedule_*` call reject, to see the
 * editor's error line. Every `callService` is also recorded on `window.__kibbleCalls`.
 */

import "../dist/kibble-card.js";
import type { HomeAssistant, KibbleCardConfig, KibbleCatsCardConfig, KibbleScheduleCardConfig, KibbleTimelineCardConfig } from "../src/types";
import { createMockHass, DEVICE_ID } from "./mock-hass";
import { resolveKibbleEntities } from "../src/lib/resolve-entities";
import { SCHEDULE_FIXTURES, scheduleState, type HarnessFixture, type ScenarioName, type ScheduleFixtureName } from "./fixtures";

declare global {
  interface Window {
    __kibbleReady?: boolean;
  }
}

type CardName = "hero" | "timeline" | "cats" | "schedule";

const TAG_FOR_CARD: Record<CardName, string> = {
  hero: "kibble-card",
  timeline: "kibble-timeline-card",
  cats: "kibble-cats-card",
  schedule: "kibble-schedule-card",
};

interface MountedCardElement extends HTMLElement {
  hass: HomeAssistant;
  setConfig: (config: KibbleCardConfig | KibbleTimelineCardConfig | KibbleCatsCardConfig | KibbleScheduleCardConfig) => void;
  updateComplete: Promise<unknown>;
}

function configFor(card: CardName, params: URLSearchParams, name: string | undefined): KibbleCardConfig | KibbleTimelineCardConfig | KibbleCatsCardConfig | KibbleScheduleCardConfig {
  if (card === "schedule") return { type: "custom:kibble-schedule-card", device_id: DEVICE_ID };
  if (card === "timeline") {
    const config: KibbleTimelineCardConfig = { type: "custom:kibble-timeline-card", device_id: DEVICE_ID };
    if (name) config.name = name;
    const limit = params.get("limit");
    if (limit) config.limit = Number(limit);
    return config;
  }
  if (card === "cats") {
    const config: KibbleCatsCardConfig = { type: "custom:kibble-cats-card", device_id: DEVICE_ID };
    if (name) config.name = name;
    return config;
  }
  const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: DEVICE_ID };
  if (name) config.name = name;
  const settingsHash = params.get("settings_hash");
  if (settingsHash) config.settings_hash = settingsHash;
  const scheduleHash = params.get("schedule_hash");
  if (scheduleHash) config.schedule_hash = scheduleHash;
  return config;
}

/** Forces `hopper1`/`hopper2`'s raw point-sensor state, `single`'s divider switch, and
 * `food1`/`food2`'s food-name text state on top of whatever `scenario` already set, entirely
 * independent of which scenario is active -- lets a screenshot session reach any hopper/mode
 * combination without a dedicated fixture per combination. A no-op for any param that's
 * absent, and a no-op entirely for cards other than the hero (the only card with hopper
 * entities at all). `single=1` switches the divider off (single/undivided mode); anything
 * else, including absent, leaves the scenario's own divider state alone. */
function applyHopperOverrides(hass: HomeAssistant, params: URLSearchParams): void {
  const resolved = resolveKibbleEntities(hass.entities, DEVICE_ID);
  const levelOverrides: Array<[string | undefined, string | null]> = [
    [resolved.hopperLevel1, params.get("hopper1")],
    [resolved.hopperLevel2, params.get("hopper2")],
  ];
  for (const [entityId, requested] of levelOverrides) {
    if (!entityId || !requested || !hass.states[entityId]) continue;
    const value = requested === "unknown" ? "unavailable" : requested;
    hass.states[entityId] = { ...hass.states[entityId], state: value };
  }
  const single = params.get("single");
  if (single !== null && resolved.hopperDivider && hass.states[resolved.hopperDivider]) {
    const isSingle = single === "1" || single === "true";
    hass.states[resolved.hopperDivider] = { ...hass.states[resolved.hopperDivider], state: isSingle ? "off" : "on" };
  }
  const foodOverrides: Array<[string | undefined, string | null]> = [
    [resolved.hopperFood1, params.get("food1")],
    [resolved.hopperFood2, params.get("food2")],
  ];
  for (const [entityId, requested] of foodOverrides) {
    if (!entityId || requested === null || !hass.states[entityId]) continue;
    hass.states[entityId] = { ...hass.states[entityId], state: requested };
  }
  const schedule = params.get("schedule");
  if (resolved.schedule && hass.states[resolved.schedule] && (schedule === "divider" || schedule === "mixed")) {
    const name: ScheduleFixtureName = schedule;
    hass.states[resolved.schedule] = { ...scheduleState(SCHEDULE_FIXTURES[name]), entity_id: resolved.schedule };
  }
}

/** Renders `hass-notification` (the labelling sheet's one closing toast, ux-spec.md section
 * A.8) as a fixed bottom banner so a screenshot session can capture it -- real Home Assistant
 * owns this UI itself; the harness has no chrome of its own to show it, so this stands in.
 * Never auto-dismisses (a screenshot tool needs it to hold still, not race a timer); a second
 * toast while one is already showing just replaces the text, matching "one toast per session"
 * closing behaviour. */
function setupToastListener(): void {
  let toastEl: HTMLDivElement | null = null;
  window.addEventListener("hass-notification", (event) => {
    const message = (event as CustomEvent<{ message: string }>).detail.message;
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "kibble-harness-toast";
      toastEl.style.cssText = [
        "position:fixed",
        "left:50%",
        "bottom:24px",
        "transform:translateX(-50%)",
        "max-width:92vw",
        "padding:12px 20px",
        "border-radius:10px",
        "background:#212121",
        "color:#fff",
        "font:500 14px/1.4 system-ui,sans-serif",
        "box-shadow:0 4px 16px rgba(0,0,0,0.35)",
        "z-index:5000",
        "text-align:center",
      ].join(";");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
  });
}

async function main(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const card = (params.get("card") ?? "hero") as CardName;
  const scenario = (params.get("scenario") ?? "idle") as ScenarioName;
  const fixtureParam = params.get("fixture");
  const harnessFixture: HarnessFixture = fixtureParam === "multicat-a" || fixtureParam === "multicat-b" || fixtureParam === "multicat-c" ? fixtureParam : "default";
  const theme = params.get("theme") ?? "light";
  const width = Number(params.get("width") ?? "400");
  const heightParam = params.get("height");
  const height = heightParam ? Number(heightParam) : null;
  const name = params.get("name") ?? undefined;
  const settingsOpen = params.get("settings_open") === "true";

  document.documentElement.classList.toggle("dark", theme === "dark");
  setupToastListener();

  const container = document.getElementById("container");
  if (!container) throw new Error("missing #container");
  container.style.width = `${width}px`;
  container.style.height = height ? `${height}px` : "auto";

  const tag = TAG_FOR_CARD[card];
  await customElements.whenDefined(tag);
  const element = document.createElement(tag) as MountedCardElement;
  element.setConfig(configFor(card, params, name));
  const hass = createMockHass(scenario, () => {
    element.hass = { ...hass };
  }, harnessFixture);
  applyHopperOverrides(hass, params);
  if (params.get("schedule_fail") === "1") {
    const callService = hass.callService;
    hass.callService = async (domain, service, data, target) => {
      if (domain === "kibble" && service.startsWith("schedule_")) {
        // Recorded like any call, but never applied: a refused write changes nothing.
        (window.__kibbleCalls ??= []).push({ domain, service, data: structuredClone(data ?? {}), target });
        throw { code: "service_validation_error", message: "Schedule writes are turned off in the Kibble integration options" };
      }
      return callService(domain, service, data, target);
    };
  }
  element.hass = hass;
  container.appendChild(element);

  await element.updateComplete;
  // Hero-only: opens the settings dialog (dish before/after, per-hopper feed, etc.) on load, so
  // a screenshot session can land straight on it instead of scripting a click on the gear.
  if (card === "hero" && settingsOpen) {
    element.shadowRoot?.querySelector<HTMLButtonElement>(".gear-button")?.click();
    await element.updateComplete;
  }
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  window.__kibbleReady = true;
}

void main();
