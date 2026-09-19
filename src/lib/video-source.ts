/** Which transport `kibble-live-hero` should use for live video, and nothing else -- kept pure
 * (no `hass`, no DOM) so the decision itself is directly unit testable, and so the render path
 * never grows a nested if/else chasing "is it Scrypted or not" on top of its own "is it actually
 * playing" state.
 *
 * Scrypted is an optimisation the card reaches for when it's there (its own low-latency WebRTC
 * negotiation, plus two-way talk over the feeder's Intercom) -- never a requirement. That mirrors
 * the integration side's own rule (`custom_components/kibble/camera.py`'s module docstring, in
 * the integration repo): the feeder's video hub is a preference, never a dependency -- its camera
 * entity falls back from a delegate stream entity, to a fixed stream URL, to the feeder's own
 * RTSP substream directly, and a fresh install with none of those configured still shows a
 * picture. This card's tree is shorter (Scrypted, or that same HA camera entity, that's all of
 * it) but the principle is the same one: Scrypted optional, no camera at all the one dead end.
 */

import type { LiveTarget } from "./scrypted-live";

export type VideoSource = ({ kind: "scrypted" } & LiveTarget) | { kind: "ha-camera"; entityId: string } | { kind: "none" };

/** Scrypted needs BOTH halves to be usable: a device id from the card config and a live token
 * from the HA Scrypted integration's own sensor (`findScryptedToken`) -- either one missing (no
 * `scrypted_id` configured, or the integration not installed/not yet reporting a token) falls
 * through to the feeder's own camera entity; no camera entity at all falls through to
 * `kibble-live-hero`'s "no camera on this device" placeholder. */
export function pickVideoSource(
  scryptedId: string | undefined,
  scryptedToken: string | undefined,
  cameraEntity: string | undefined,
): VideoSource {
  if (scryptedId && scryptedToken) return { kind: "scrypted", deviceId: scryptedId, token: scryptedToken };
  if (cameraEntity) return { kind: "ha-camera", entityId: cameraEntity };
  return { kind: "none" };
}
