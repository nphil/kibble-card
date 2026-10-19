import { describe, it, expect } from "bun:test";
import { popupForHash } from "../src/lib/popup-hash";
import type { KibbleCardConfig } from "../src/types";

describe("popupForHash", () => {
  describe("detection areas popup", () => {
    it("opens detection areas with default hash", () => {
      const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: "test" };
      expect(popupForHash("#detection-areas", config)).toBe("detection-areas");
    });

    it("opens detection areas with custom hash", () => {
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        detection_areas_hash: "#camera-setup",
      };
      expect(popupForHash("#camera-setup", config)).toBe("detection-areas");
    });

    it("respects custom detection areas hash over default", () => {
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        detection_areas_hash: "#exclude-areas",
      };
      expect(popupForHash("#detection-areas", config)).toBeNull();
      expect(popupForHash("#exclude-areas", config)).toBe("detection-areas");
    });
  });

  describe("calibration popup", () => {
    it("opens calibration with default hash", () => {
      const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: "test" };
      expect(popupForHash("#calibrate", config)).toBe("calibrate");
    });

    it("opens calibration with custom hash", () => {
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        calibrate_hash: "#bowl-setup",
      };
      expect(popupForHash("#bowl-setup", config)).toBe("calibrate");
    });

    it("respects custom calibrate hash over default", () => {
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        calibrate_hash: "#hopper-calibration",
      };
      expect(popupForHash("#calibrate", config)).toBeNull();
      expect(popupForHash("#hopper-calibration", config)).toBe("calibrate");
    });
  });

  describe("no popup", () => {
    it("returns null for unmatched hash", () => {
      const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: "test" };
      expect(popupForHash("#unknown", config)).toBeNull();
    });

    it("returns null for settings hash (no in-card handler)", () => {
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        settings_hash: "#settings-popup",
      };
      expect(popupForHash("#settings-popup", config)).toBeNull();
    });

    it("returns null for empty hash", () => {
      const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: "test" };
      expect(popupForHash("", config)).toBeNull();
    });

    it("returns null for bare hash without leading #", () => {
      const config: KibbleCardConfig = { type: "custom:kibble-card", device_id: "test" };
      expect(popupForHash("detection-areas", config)).toBeNull();
    });
  });

  describe("config undefined", () => {
    it("returns null when config is undefined", () => {
      expect(popupForHash("#calibrate", undefined)).toBeNull();
      expect(popupForHash("#detection-areas", undefined)).toBeNull();
    });
  });

  describe("hash conflicts and precedence", () => {
    it("prefers detection areas match over calibration", () => {
      // If hashes are different, calibrate should match calibrate
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        detection_areas_hash: "#setup-camera",
        calibrate_hash: "#setup-bowl",
      };
      expect(popupForHash("#setup-camera", config)).toBe("detection-areas");
      expect(popupForHash("#setup-bowl", config)).toBe("calibrate");
    });

    it("allows hashes to be the same (but one wins)", () => {
      // Edge case: both hashes are identical -> detection-areas checked first
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        detection_areas_hash: "#wizard",
        calibrate_hash: "#wizard",
      };
      // detection_areas_hash is checked first in the implementation
      expect(popupForHash("#wizard", config)).toBe("detection-areas");
    });
  });

  describe("fresh settings behavior", () => {
    it("uses defaults when hashes not configured", () => {
      const minimalConfig: KibbleCardConfig = { type: "custom:kibble-card", device_id: "test" };
      expect(popupForHash("#calibrate", minimalConfig)).toBe("calibrate");
      expect(popupForHash("#detection-areas", minimalConfig)).toBe("detection-areas");
      expect(popupForHash("#unknown", minimalConfig)).toBeNull();
    });

    it("only overrides hash when explicitly set", () => {
      const config: KibbleCardConfig = {
        type: "custom:kibble-card",
        device_id: "test",
        calibrate_hash: "#bowl",
        // detection_areas_hash omitted -> uses default
      };
      expect(popupForHash("#calibrate", config)).toBeNull();
      expect(popupForHash("#bowl", config)).toBe("calibrate");
      expect(popupForHash("#detection-areas", config)).toBe("detection-areas");
    });
  });
});
