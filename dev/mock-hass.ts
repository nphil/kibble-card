/** A minimal but honest `hass` stand-in: real `states`/`entities`/`devices` maps built from the
 * fixtures, a `callService` that logs every call (and mutates `states` for the handful of
 * services a screenshot session might actually trigger, so clicking around in the harness
 * behaves like the real thing) instead of a silent no-op.
 */

import type { HomeAssistant } from "../src/types";
import { buildFixture, DEVICE_ID, type ScenarioName } from "./fixtures";

export { DEVICE_ID };

export function createMockHass(scenario: ScenarioName): HomeAssistant {
  const fixture = buildFixture(scenario);
  const states = { ...fixture.states };

  const hass: HomeAssistant = {
    states,
    entities: fixture.entities,
    devices: { [fixture.device.id]: fixture.device },
    themes: {},
    language: "en",
    callService: async (domain, service, data, target) => {
      // eslint-disable-next-line no-console
      console.log("[mock hass] callService", { domain, service, data, target });
      const entityId = (target?.entity_id as string | undefined) ?? undefined;
      if (domain === "number" && service === "set_value" && entityId && states[entityId]) {
        states[entityId] = { ...states[entityId]!, state: String(data?.value ?? "") };
        hass.states = { ...states };
      }
      if (domain === "switch" && service === "toggle" && entityId && states[entityId]) {
        const next = states[entityId]!.state === "on" ? "off" : "on";
        states[entityId] = { ...states[entityId]!, state: next };
        hass.states = { ...states };
      }
      return undefined;
    },
  };
  return hass;
}
