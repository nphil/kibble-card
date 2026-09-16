/** Live video + two-way audio straight from Scrypted, through the HA Scrypted integration's
 * authenticated proxy (`/api/scrypted/<token>/...`). One WebRTC peer connection per open card:
 * Scrypted's WebRTC plugin sends the feeder's H.264 + AAC mic stream and receives the browser's
 * microphone on a `sendrecv` audio transceiver, which it hands to the feeder camera's `Intercom`
 * (the Kibble Scrypted mixin → the feeder's RTSP backchannel). The mic track is attached lazily
 * on first use and toggled with `track.enabled`, so push-to-talk never renegotiates.
 *
 * Why not the `scrypted-nvr-camera` element the integration ships: its microphone/speaker flags
 * are read once at mount (`setConfig` after that is inert), so a talk button would have to tear
 * the stream down and restart it on every press. This is the same engine, driven directly.
 */

import { connectScryptedClient, type ScryptedClientStatic } from "@scrypted/client";
import type { HomeAssistant } from "../types";

/** The token sensor the HA Scrypted integration creates (`sensor.scrypted_token_<host>`): its
 * state is the proxy path secret. First one wins if there are several Scrypted servers. */
export function findScryptedToken(hass: HomeAssistant): string | undefined {
  for (const entry of Object.values(hass.entities ?? {})) {
    if (entry.platform === "scrypted" && entry.entity_id.startsWith("sensor.scrypted_token")) {
      const state = hass.states[entry.entity_id]?.state;
      if (state && state !== "unavailable" && state !== "unknown") return state;
    }
  }
  return undefined;
}

export type LiveState = "idle" | "connecting" | "live" | "error";

/** Minimal `RTCSignalingSession` the Scrypted WebRTC plugin drives over RPC (its
 * `common/src/rtc-signaling.ts` `BrowserSignalingSession`, reduced to what a viewer needs). */
class BrowserSignalingSession {
  pc: RTCPeerConnection | undefined;
  microphone: RTCRtpSender | undefined;
  private micTrack: MediaStreamTrack | undefined;
  onTrack: ((stream: MediaStream) => void) | undefined;
  onClosed: (() => void) | undefined;
  /** `proxy: true` is what makes the WebRTC plugin's own sink handle this session instead of
   * delegating to the camera's `RTCSignalingChannel` — the sink is the half that negotiates a
   * `sendrecv` audio transceiver for cameras with `Intercom` and returns a session control whose
   * `setPlayback` starts/stops talkback (`plugins/webrtc`). Without it the answer comes back with
   * the audio m-line rejected (port 0) and there is no return path at all. */
  readonly options = {
    proxy: true,
    userAgent: navigator.userAgent,
    capabilities: {
      audio: RTCRtpReceiver.getCapabilities?.("audio") ?? { codecs: [], headerExtensions: [] },
      video: RTCRtpReceiver.getCapabilities?.("video") ?? { codecs: [], headerExtensions: [] },
    },
    screen: { devicePixelRatio: window.devicePixelRatio, width: screen.width, height: screen.height },
  };
  // Scrypted's RPC layer reads proxied properties from here.
  readonly __proxy_props = { options: this.options };

  async getOptions() {
    return this.options;
  }

  private createPeerConnection(setup: RTCAVSignalingSetup): RTCPeerConnection {
    if (this.pc) return this.pc;
    const pc = new RTCPeerConnection(setup.configuration);
    this.pc = pc;
    pc.addEventListener("iceconnectionstatechange", () => {
      if (["disconnected", "failed", "closed"].includes(pc.iceConnectionState)) this.onClosed?.();
    });
    const remote = new MediaStream();
    pc.addEventListener("track", (ev) => {
      remote.addTrack(ev.track);
      this.onTrack?.(remote);
    });
    if (setup.datachannel) pc.createDataChannel(setup.datachannel.label, setup.datachannel.dict);
    if (setup.audio) {
      const audio = pc.addTransceiver("audio", setup.audio);
      if (setup.audio.direction === "sendrecv" || setup.audio.direction === "sendonly") this.microphone = audio.sender;
    }
    if (setup.video) pc.addTransceiver("video", setup.video);
    return pc;
  }

  async createLocalDescription(
    type: "offer" | "answer",
    setup: RTCAVSignalingSetup,
    sendIceCandidate?: (candidate: RTCIceCandidateInit) => Promise<void>,
  ) {
    const pc = this.createPeerConnection(setup);
    const gathered = new Promise<void>((resolve) => {
      pc.onicecandidate = (ev) => {
        if (ev.candidate) void sendIceCandidate?.(JSON.parse(JSON.stringify(ev.candidate)));
        else resolve();
      };
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === "complete") resolve();
      };
    });
    const local = type === "offer"
      ? await pc.createOffer({ offerToReceiveAudio: !!setup.audio, offerToReceiveVideo: !!setup.video })
      : await pc.createAnswer();
    const set = pc.setLocalDescription(local);
    if (sendIceCandidate) return { type: local.type, sdp: local.sdp };
    await set;
    await gathered;
    const final = pc.localDescription ?? local;
    return { type: final.type, sdp: final.sdp };
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit, setup: RTCAVSignalingSetup) {
    await this.createPeerConnection(setup).setRemoteDescription(description);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc?.addIceCandidate(candidate);
  }

  async endSession() {}

  /** Attaches the microphone on first enable (a `sendrecv` transceiver was already negotiated,
   * so `replaceTrack` needs no renegotiation), then just flips `enabled`. */
  async setMicrophone(enabled: boolean): Promise<void> {
    if (!this.microphone) throw new Error("this stream has no return-audio channel");
    if (enabled && !this.micTrack) {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micTrack = mic.getAudioTracks()[0];
      await this.microphone.replaceTrack(this.micTrack);
    }
    if (this.micTrack) this.micTrack.enabled = enabled;
  }

  close() {
    this.micTrack?.stop();
    this.pc?.getSenders().forEach((s) => s.track?.stop());
    this.pc?.close();
    this.pc = undefined;
  }
}

/** The subset of Scrypted's `RTCAVSignalingSetup` this session reads. */
interface RTCAVSignalingSetup {
  type?: "offer" | "answer";
  audio?: RTCRtpTransceiverInit;
  video?: RTCRtpTransceiverInit;
  datachannel?: { label: string; dict?: RTCDataChannelInit };
  configuration?: RTCConfiguration;
}

/** What `startRTCSignalingSession` resolves to on the WebRTC plugin's sink: its
 * `RTCSessionControl`, of which only playback toggling is used here. */
interface SessionControl {
  setPlayback(options: { audio: boolean; video: boolean }): Promise<void>;
}

interface RTCSignalingChannelDevice {
  startRTCSignalingSession(session: BrowserSignalingSession): Promise<SessionControl>;
}

export interface LiveTarget {
  /** Scrypted device id of the feeder camera (the number in the NVR "card id"). */
  deviceId: string;
  token: string;
}

/** One card's live connection: `open()` negotiates and plays into `video`; `talk(true|false)`
 * is push-to-talk; `close()` releases everything (including the mic). */
export class ScryptedLive {
  state: LiveState = "idle";
  error: string | undefined;
  hasIntercom = false;
  private client: ScryptedClientStatic | undefined;
  private session: BrowserSignalingSession | undefined;
  private control: SessionControl | undefined;
  private onChange: () => void;

  constructor(onChange: () => void) {
    this.onChange = onChange;
  }

  async open(target: LiveTarget, video: HTMLVideoElement): Promise<void> {
    this.close();
    this.setState("connecting");
    try {
      // Trailing slash is load-bearing: the client resolves its paths with `new URL(path,
      // baseUrl)`, which would otherwise drop the token segment (`/api/scrypted/login`, 404).
      const baseUrl = `${location.origin}/api/scrypted/${target.token}/`;
      const client = await connectScryptedClient({ baseUrl, pluginId: "@scrypted/core", clientName: "kibble-card" });
      this.client = client;
      const device = client.systemManager.getDeviceById<RTCSignalingChannelDevice>(target.deviceId);
      if (!device) throw new Error(`Scrypted has no device ${target.deviceId}`);
      const interfaces: string[] = device.interfaces ?? [];
      if (!interfaces.includes("RTCSignalingChannel")) throw new Error(`${device.name} has no WebRTC channel in Scrypted`);
      this.hasIntercom = interfaces.includes("Intercom");

      const session = new BrowserSignalingSession();
      this.session = session;
      session.onTrack = (stream) => {
        if (video.srcObject !== stream) {
          video.srcObject = stream;
          void video.play().catch(() => undefined);
        }
        this.setState("live");
      };
      session.onClosed = () => {
        if (this.session === session) this.fail("stream disconnected");
      };
      const channel: RTCSignalingChannelDevice = device;
      this.control = await channel.startRTCSignalingSession(session);
    } catch (e) {
      this.fail(e instanceof Error ? e.message : String(e));
      throw e;
    }
  }

  /** Push-to-talk. The mic track is attached on first use, then only `enabled` flips; Scrypted's
   * session control is told to start/stop feeding the camera's `Intercom` so the feeder's
   * speaker session lasts exactly as long as the button is held. */
  async talk(enabled: boolean): Promise<void> {
    if (!this.session) throw new Error("not connected");
    await this.session.setMicrophone(enabled);
    await this.control?.setPlayback({ audio: enabled, video: true });
  }

  close(): void {
    void this.control?.setPlayback({ audio: false, video: true }).catch(() => undefined);
    this.control = undefined;
    this.session?.close();
    this.session = undefined;
    this.client?.disconnect?.();
    this.client = undefined;
    if (this.state !== "idle") this.setState("idle");
  }

  private fail(message: string) {
    this.error = message;
    this.session?.close();
    this.session = undefined;
    this.setState("error");
  }

  private setState(state: LiveState) {
    this.state = state;
    if (state !== "error") this.error = undefined;
    this.onChange();
  }
}
