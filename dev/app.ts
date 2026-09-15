/** Dev harness bootstrap. Reads `?scenario=idle|dispensing|unreachable&theme=light|dark&width=
 * <px>&height=<px>&name=<text>` from the URL, mounts one real `<kibble-card>` against the mock
 * hass, and sets `window.__kibbleReady` once it has actually finished rendering so the
 * screenshot script isn't guessing with a fixed delay.
 */

import "../dist/kibble-card.js";
import type { KibbleCardConfig } from "../src/types";
import { createMockHass, DEVICE_ID } from "./mock-hass";
import type { ScenarioName } from "./fixtures";

declare global {
  interface Window {
    __kibbleReady?: boolean;
  }
}

interface KibbleCardElement extends HTMLElement {
  hass: ReturnType<typeof createMockHass>;
  setConfig: (config: KibbleCardConfig) => void;
  updateComplete: Promise<unknown>;
}

async function main(): Promise<void> {
  const params = new URLSearchParams(location.search);
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

  await customElements.whenDefined("kibble-card");
  const card = document.createElement("kibble-card") as KibbleCardElement;
  const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: DEVICE_ID };
  if (name) config.name = name;
  card.setConfig(config);
  card.hass = createMockHass(scenario);
  container.appendChild(card);

  await card.updateComplete;
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  window.__kibbleReady = true;
}

void main();
