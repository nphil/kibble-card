/** Hash routing logic for popup dialogs (calibration, detection areas, settings).
 *
 * The main card listens for hash changes and opens the corresponding dialog. This keeps
 * in-card wizards synchronized with Bubble Card settings rows that live OUTSIDE the card
 * and navigate via hash (since they cannot reach the card's own hass-action listeners).
 */

import type { KibbleCardConfig } from "../types";

/** Which popup dialog the current hash requests, or null if none.
 *
 * Respects configured hash overrides:
 * - `detection_areas_hash` (default `#detection-areas`)
 * - `calibrate_hash` (default `#calibrate`)
 *
 * `settings_hash` has no default: if configured, the gear navigates to an external dashboard;
 * it never opens an in-card panel. */
export function popupForHash(
  hash: string,
  config: KibbleCardConfig | undefined,
): "calibrate" | "detection-areas" | null {
  if (!config) return null;

  const detectionAreasHash = config.detection_areas_hash ?? "#detection-areas";
  if (hash === detectionAreasHash) return "detection-areas";

  const calibrateHash = config.calibrate_hash ?? "#calibrate";
  if (hash === calibrateHash) return "calibrate";

  return null;
}
