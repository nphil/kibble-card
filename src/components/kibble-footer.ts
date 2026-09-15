/** Three quiet glances, never toggles: cloud connection, desiccant days left, Wi-Fi (when the
 * device exposes it). Every icon opens settings on tap — the actual controls live there.
 */

import { LitElement, css, html, nothing } from "lit";
import { mdiIcon, type MdiIconName } from "../lib/mdi-icons";

type CloudState = "connected" | "blocked" | "unreachable" | "unknown";

const CLOUD_ICON: Record<CloudState, MdiIconName> = {
  connected: "cloudCheck",
  blocked: "cloudLock",
  unreachable: "cloudAlert",
  unknown: "cloudQuestion",
};

const CLOUD_LABEL: Record<CloudState, string> = {
  connected: "Cloud connected",
  blocked: "Cloud blocked",
  unreachable: "Cloud unreachable",
  unknown: "Cloud status unknown",
};

export class KibbleFooter extends LitElement {
  static properties = {
    cloudState: { type: String },
    desiccantDays: { type: Number },
    wifiLabel: { type: String },
  };

  declare cloudState: string | null | undefined;
  declare desiccantDays: number | null;
  declare wifiLabel: string | null;

  constructor() {
    super();
    this.cloudState = null;
    this.desiccantDays = null;
    this.wifiLabel = null;
  }

  render() {
    const cloud = this.cloudState && this.cloudState in CLOUD_ICON ? (this.cloudState as CloudState) : "unknown";
    return html`
      <div class="footer">
        <button type="button" class="glance ${cloud === "blocked" ? "warn" : ""}" title=${CLOUD_LABEL[cloud]} @click=${this._openSettings}>
          ${mdiIcon(CLOUD_ICON[cloud])}
        </button>
        ${this.desiccantDays == null
          ? nothing
          : html`
              <button type="button" class="glance" title="Desiccant left" @click=${this._openSettings}>
                ${mdiIcon("airFilter")}<span>${this.desiccantDays}d</span>
              </button>
            `}
        ${this.wifiLabel
          ? html`
              <button type="button" class="glance" title="Wi-Fi" @click=${this._openSettings}>
                ${mdiIcon("wifi")}<span>${this.wifiLabel}</span>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private _openSettings(): void {
    this.dispatchEvent(new CustomEvent("open-settings", { bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: block;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 6px 4px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-footer-size, 12px);
    }
    .glance {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 6px;
      min-height: var(--kibble-touch-target, 48px);
      border-radius: 8px;
    }
    .glance svg {
      font-size: 1.4em;
    }
    .glance.warn {
      color: var(--kibble-amber-dark);
    }
    .glance:hover {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    }
    .spacer {
      flex: 1;
    }
    .settings svg {
      font-size: 1.5em;
    }
  `;
}

customElements.define("kibble-footer", KibbleFooter);

declare global {
  interface HTMLElementTagNameMap {
    "kibble-footer": KibbleFooter;
  }
}
