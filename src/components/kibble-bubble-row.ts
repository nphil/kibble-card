/** One embedded Bubble Card row. HA's card helpers build the real `custom:bubble-card` element
 * (exactly how stack cards host their children), so the row looks identical to every other
 * Bubble button on the dashboard and follows the same theme variables. Actions come back as the
 * standard `hass-action` event, which the owning card listens for.
 *
 * `bubble-available` tells the caller whether Bubble Card is installed at all; when it is not,
 * the card falls back to its own buttons.
 */

import { LitElement, css, html } from "lit";
import type { HomeAssistant } from "../types";

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): HTMLElement & { hass?: HomeAssistant };
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
  }
}

export async function bubbleCardAvailable(): Promise<boolean> {
  if (customElements.get("bubble-card")) return true;
  // A lazily-registered resource: give it the same grace HA gives custom cards.
  await Promise.race([customElements.whenDefined("bubble-card"), new Promise((r) => setTimeout(r, 2000))]);
  return Boolean(customElements.get("bubble-card"));
}

export class KibbleBubbleRow extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  declare hass: HomeAssistant;
  declare config: Record<string, unknown> | undefined;

  private _element: (HTMLElement & { hass?: HomeAssistant }) | undefined;
  private _builtFor = "";

  updated(): void {
    void this._sync();
  }

  private async _sync(): Promise<void> {
    if (!this.config) return;
    const key = JSON.stringify(this.config);
    if (key !== this._builtFor) {
      this._builtFor = key;
      const helpers = await window.loadCardHelpers?.();
      if (!helpers || key !== this._builtFor) return;
      const next = helpers.createCardElement({ type: "custom:bubble-card", ...this.config });
      this._element?.remove();
      this._element = next;
      this.renderRoot.querySelector(".slot")?.appendChild(next);
    }
    if (this._element && this.hass) this._element.hass = this.hass;
  }

  render() {
    return html`<div class="slot"></div>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `;
}

customElements.define("kibble-bubble-row", KibbleBubbleRow);
