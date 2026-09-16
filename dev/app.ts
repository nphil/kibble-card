/** Dev harness bootstrap. Reads `?card=hero|timeline|cats&scenario=idle|dispensing|unreachable
 * &theme=light|dark&width=<px>&height=<px>&name=<text>&limit=<n>&confidence=<0-1>` from the URL,
 * mounts one real card against the mock hass, and sets `window.__kibbleReady` once it has
 * actually finished rendering so the screenshot script isn't guessing with a fixed delay.
 * `card` defaults to `hero` (the original single-card harness URLs keep working unchanged);
 * `scenario` only affects the hero -- the timeline/cats cards read the same mock `kibble/*` WS
 * fixtures regardless of it.
 */

import "../dist/kibble-card.js";
import type { HomeAssistant, KibbleCardConfig, KibbleCatsCardConfig, KibbleTimelineCardConfig } from "../src/types";
import { createMockHass, DEVICE_ID } from "./mock-hass";
import type { ScenarioName } from "./fixtures";

declare global {
  interface Window {
    __kibbleReady?: boolean;
  }
}

type CardName = "hero" | "timeline" | "cats";

const TAG_FOR_CARD: Record<CardName, string> = {
  hero: "kibble-card",
  timeline: "kibble-timeline-card",
  cats: "kibble-cats-card",
};

interface MountedCardElement extends HTMLElement {
  hass: HomeAssistant;
  setConfig: (config: KibbleCardConfig | KibbleTimelineCardConfig | KibbleCatsCardConfig) => void;
  updateComplete: Promise<unknown>;
}

function configFor(card: CardName, params: URLSearchParams, name: string | undefined): KibbleCardConfig | KibbleTimelineCardConfig | KibbleCatsCardConfig {
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
    const confidence = params.get("confidence");
    if (confidence) config.confidence = Number(confidence);
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

async function main(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const card = (params.get("card") ?? "hero") as CardName;
  const scenario = (params.get("scenario") ?? "idle") as ScenarioName;
  const theme = params.get("theme") ?? "light";
  const width = Number(params.get("width") ?? "400");
  const heightParam = params.get("height");
  const height = heightParam ? Number(heightParam) : null;
  const name = params.get("name") ?? undefined;

  document.documentElement.classList.toggle("dark", theme === "dark");

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
  });
  element.hass = hass;
  container.appendChild(element);

  await element.updateComplete;
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  window.__kibbleReady = true;
}

void main();
