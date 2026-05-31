import { State } from "..";

import { AbstractStore } from ".";

/**
 * Possible noise suppresion states. Browser is browser noise suppresion and enhanced is machine learning suppression via RNNoise.
 */
export type NoiseSuppresionState = "disabled" | "browser" | "enhanced";

const NoiseSuppresionStates: NoiseSuppresionState[] = [
  "disabled",
  "browser",
  "enhanced",
];

/**
 * Possible screen share qualities. Low is 720p@30fps, high 1080p@30fps and text is source@5fps.
 */
export type ScreenShareQualityName = "low" | "high" | "text";

/**
 * Array of available screen share quality names.
 */
export const ScreenShareQualityNames: ScreenShareQualityName[] = [
  "low",
  "high",
  "text",
];

export interface TypeVoice {
  preferredAudioInputDevice?: string;
  preferredAudioOutputDevice?: string;

  echoCancellation: boolean;
  noiseSupression: NoiseSuppresionState;
  autoGainControl: boolean;

  screenShareQuality: ScreenShareQualityName;
  screenShareQualityAsk: boolean;
  screenShareAudio: boolean;

  inputVolume: number;
  outputVolume: number;
  deafen: boolean;
  micOn: boolean;

  userVolumes: Record<string, number>;
  userMutes: Record<string, boolean>;

  screenShareVolumes: Record<string, number>;
  screenShareMutes: Record<string, boolean>;

  // Noise gate
  noiseGateThreshold: number;

  // Auto reconnect
  autoReconnect: boolean;

  // Push to talk
  pushToTalkEnabled: boolean;
  pushToTalkKeybind: string;
  pushToTalkMode: "hold" | "toggle";
  pushToTalkReleaseDelay: number;
  pushToTalkNotificationSounds: boolean;

  // Notification sound settings
  notificationSoundsEnabled: boolean;
  notificationVolume: number;
  soundJoinCall: boolean;
  soundLeaveCall: boolean;
  soundSomeoneJoined: boolean;
  soundSomeoneLeft: boolean;
  soundMute: boolean;
  soundUnmute: boolean;
  soundReceiveMessage: boolean;
  soundDisconnect: boolean;
  soundIncomingCall: boolean;
}

/**
 * Handles enabling and disabling client experiments.
 */
export class Voice extends AbstractStore<"voice", TypeVoice> {
  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, "voice");
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    /** nothing needs to be done */
  }

  /**
   * Generate default values
   */
  default(): TypeVoice {
    return {
      echoCancellation: true,
      noiseSupression: "browser",
      autoGainControl: true,
      screenShareQuality: "low",
      screenShareQualityAsk: true,
      screenShareAudio: true,
      inputVolume: 1.0,
      outputVolume: 1.0,
      deafen: false,
      micOn: true,
      userVolumes: {},
      userMutes: {},
      screenShareVolumes: {},
      screenShareMutes: {},

      // Noise gate
      noiseGateThreshold: 0.01,

      // Auto reconnect
      autoReconnect: true,

      // Push to talk
      pushToTalkEnabled: false,
      pushToTalkKeybind: "",
      pushToTalkMode: "hold",
      pushToTalkReleaseDelay: 100,
      pushToTalkNotificationSounds: true,

      // Notification sound defaults (all enabled)
      notificationSoundsEnabled: true,
      notificationVolume: 0.5,
      soundJoinCall: true,
      soundLeaveCall: true,
      soundSomeoneJoined: true,
      soundSomeoneLeft: true,
      soundMute: true,
      soundUnmute: true,
      soundReceiveMessage: true,
      soundDisconnect: true,
      soundIncomingCall: true,
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeVoice>): TypeVoice {
    const data = this.default();

    if (typeof input.preferredAudioInputDevice === "string") {
      data.preferredAudioInputDevice = input.preferredAudioInputDevice;
    }

    if (typeof input.preferredAudioOutputDevice === "string") {
      data.preferredAudioOutputDevice = input.preferredAudioOutputDevice;
    }

    if (typeof input.echoCancellation === "boolean") {
      data.echoCancellation = input.echoCancellation;
    }

    // migrate legacy noise suppression to new suppression state
    if ((input.noiseSupression as unknown) === "true") {
      data.noiseSupression = "browser";
    } else if ((input.noiseSupression as unknown) === "false") {
      data.noiseSupression = "disabled";
    } else if (
      input.noiseSupression &&
      NoiseSuppresionStates.includes(input.noiseSupression)
    ) {
      data.noiseSupression = input.noiseSupression;
    }

    if (typeof input.autoGainControl === "boolean") {
      data.autoGainControl = input.autoGainControl;
    }

    if (
      input.screenShareQuality &&
      ScreenShareQualityNames.includes(input.screenShareQuality)
    ) {
      data.screenShareQuality = input.screenShareQuality;
    }

    if (typeof input.screenShareQualityAsk === "boolean") {
      data.screenShareQualityAsk = input.screenShareQualityAsk;
    }

    if (typeof input.screenShareAudio === "boolean") {
      data.screenShareAudio = input.screenShareAudio;
    }

    if (typeof input.inputVolume === "number") {
      data.inputVolume = input.inputVolume;
    }

    if (typeof input.outputVolume === "number") {
      data.outputVolume = input.outputVolume;
    }

    if (typeof input.deafen === "boolean") {
      data.deafen = input.deafen;
    }

    if (typeof input.micOn === "boolean") {
      data.micOn = input.micOn;
    }

    if (typeof input.userVolumes === "object") {
      Object.entries(input.userVolumes)
        .filter(
          ([userId, volume]) =>
            typeof userId === "string" && typeof volume === "number",
        )
        .forEach(([k, v]) => (data.userVolumes[k] = v));
    }

    if (typeof input.userMutes === "object") {
      Object.entries(input.userMutes)
        .filter(
          ([userId, muted]) => typeof userId === "string" && muted === true,
        )
        .forEach(([k, v]) => (data.userMutes[k] = v));
    }

    if (typeof input.screenShareVolumes === "object") {
      Object.entries(input.screenShareVolumes)
        .filter(
          ([userId, volume]) =>
            typeof userId === "string" && typeof volume === "number",
        )
        .forEach(([k, v]) => (data.screenShareVolumes[k] = v));
    }

    if (typeof input.screenShareMutes === "object") {
      Object.entries(input.screenShareMutes)
        .filter(
          ([userId, muted]) => typeof userId === "string" && muted === true,
        )
        .forEach(([k, v]) => (data.screenShareMutes[k] = v));
    }

    return data;
  }

  /**
   * Set a user's volume
   * @param userId User ID
   * @param volume Volume
   */
  setUserVolume(userId: string, volume: number) {
    this.set("userVolumes", userId, volume);
  }

  /**
   * Get a user's volume
   * @param userId User ID
   * @returns Volume or default
   */
  getUserVolume(userId: string): number {
    return this.get().userVolumes[userId] || 1.0;
  }

  /**
   * Set whether a user is muted
   * @param userId User ID
   * @param muted Whether they should be muted
   */
  setUserMuted(userId: string, muted: boolean) {
    this.set("userMutes", userId, muted);
  }

  /**
   * Get whether a user is muted
   * @param userId User ID
   * @returns Whether muted
   */
  getUserMuted(userId: string): boolean {
    return this.get().userMutes[userId] || false;
  }

  /**
   * Set a user's screen share volume
   * @param userId User ID
   * @param volume Volume
   */
  setScreenShareVolume(userId: string, volume: number) {
    this.set("screenShareVolumes", userId, volume);
  }

  /**
   * Get a user's screen share volume
   * @param userId User ID
   * @returns Volume or default
   */
  getScreenShareVolume(userId: string): number {
    return this.get().screenShareVolumes[userId] || 1.0;
  }

  /**
   * Set whether a user's screen share is muted
   * @param userId User ID
   * @param muted Whether they should be muted
   */
  setScreenShareMuted(userId: string, muted: boolean) {
    this.set("screenShareMutes", userId, muted);
  }

  /**
   * Get whether a user's screen share is muted
   * @param userId User ID
   * @returns Whether muted
   */
  getScreenShareMuted(userId: string): boolean {
    return this.get().screenShareMutes[userId] ?? true;
  }

  /**
   * Set the preferred audio input device
   */
  set preferredAudioInputDevice(value: string) {
    this.set("preferredAudioInputDevice", value);
  }

  /**
   * Set the preferred audio output device
   */
  set preferredAudioOutputDevice(value: string) {
    this.set("preferredAudioOutputDevice", value);
  }

  /**
   * Set echo cancellation
   */
  set echoCancellation(value: boolean) {
    this.set("echoCancellation", value);
  }

  /**
   * Set noise cancellation
   */
  set noiseSupression(value: NoiseSuppresionState) {
    this.set("noiseSupression", value);
  }

  /**
   * Set auto gain control
   */
  set autoGainControl(value: boolean) {
    this.set("autoGainControl", value);
  }

  /**
   * Set screen share quality
   */
  set screenShareQuality(value: ScreenShareQualityName) {
    this.set("screenShareQuality", value);
  }

  /**
   * Set screen share quality always ask
   */
  set screenShareQualityAsk(value: boolean) {
    this.set("screenShareQualityAsk", value);
  }

  /**
   * Set screen share audio
   */
  set screenShareAudio(value: boolean) {
    this.set("screenShareAudio", value);
  }

  /**
   * Set input volume
   */
  set inputVolume(value: number) {
    this.set("inputVolume", value);
  }

  /**
   * Set output volume
   */
  set outputVolume(value: number) {
    this.set("outputVolume", value);
  }

  /**
   * Set mic status
   */
  set micOn(value: boolean) {
    this.set("micOn", value);
  }

  /**
   * Set defean status
   */
  set deafen(value: boolean) {
    this.set("deafen", value);
  }

  /**
   * Get the preferred audio input device
   */
  get preferredAudioInputDevice(): string | undefined {
    return this.get().preferredAudioInputDevice;
  }

  /**
   * Get the preferred audio output device
   */
  get preferredAudioOutputDevice(): string | undefined {
    return this.get().preferredAudioInputDevice;
  }

  /**
   * Get echo cancellation
   */
  get echoCancellation(): boolean | undefined {
    return this.get().echoCancellation;
  }

  /**
   * Get noise supression
   */
  get noiseSupression(): NoiseSuppresionState | undefined {
    return this.get().noiseSupression;
  }

  /**
   * Get auto gain control
   */
  get autoGainControl(): boolean | undefined {
    return this.get().autoGainControl;
  }

  /**
   * Get screen share quality
   */
  get screenShareQuality(): ScreenShareQualityName | undefined {
    return this.get().screenShareQuality;
  }

  /**
   * Get screen share quality always ask
   */
  get screenShareQualityAsk(): boolean {
    return this.get().screenShareQualityAsk;
  }

  /**
   * Get screen share audio
   */
  get screenShareAudio(): boolean {
    return this.get().screenShareAudio;
  }

  /**
   * Get input volume
   */
  get inputVolume(): number {
    return this.get().inputVolume;
  }

  /**
   * Get output volume
   */
  get outputVolume(): number {
    return this.get().outputVolume;
  }

  /**
   * Get deafen status
   */
  get deafen(): boolean {
    return this.get().deafen;
  }

  /**
   * Get mic status
   */
  get micOn(): boolean {
    return this.get().micOn;
  }

  // --- Noise gate getter/setter ---

  get noiseGateThreshold(): number {
    return this.get().noiseGateThreshold;
  }
  set noiseGateThreshold(v: number) {
    this.set("noiseGateThreshold", v);
  }

  // --- Notification sound getters/setters ---

  get notificationSoundsEnabled(): boolean {
    return this.get().notificationSoundsEnabled;
  }
  set notificationSoundsEnabled(v: boolean) {
    this.set("notificationSoundsEnabled", v);
  }

  get notificationVolume(): number {
    return this.get().notificationVolume;
  }
  set notificationVolume(v: number) {
    this.set("notificationVolume", v);
  }

  get soundJoinCall(): boolean {
    return this.get().soundJoinCall;
  }
  set soundJoinCall(v: boolean) {
    this.set("soundJoinCall", v);
  }

  get soundLeaveCall(): boolean {
    return this.get().soundLeaveCall;
  }
  set soundLeaveCall(v: boolean) {
    this.set("soundLeaveCall", v);
  }

  get soundSomeoneJoined(): boolean {
    return this.get().soundSomeoneJoined;
  }
  set soundSomeoneJoined(v: boolean) {
    this.set("soundSomeoneJoined", v);
  }

  get soundSomeoneLeft(): boolean {
    return this.get().soundSomeoneLeft;
  }
  set soundSomeoneLeft(v: boolean) {
    this.set("soundSomeoneLeft", v);
  }

  get soundMute(): boolean {
    return this.get().soundMute;
  }
  set soundMute(v: boolean) {
    this.set("soundMute", v);
  }

  get soundUnmute(): boolean {
    return this.get().soundUnmute;
  }
  set soundUnmute(v: boolean) {
    this.set("soundUnmute", v);
  }

  get soundReceiveMessage(): boolean {
    return this.get().soundReceiveMessage;
  }
  set soundReceiveMessage(v: boolean) {
    this.set("soundReceiveMessage", v);
  }

  get soundDisconnect(): boolean {
    return this.get().soundDisconnect;
  }
  set soundDisconnect(v: boolean) {
    this.set("soundDisconnect", v);
  }

  get soundIncomingCall(): boolean {
    return this.get().soundIncomingCall;
  }
  set soundIncomingCall(v: boolean) {
    this.set("soundIncomingCall", v);
  }

  get autoReconnect(): boolean {
    return this.get().autoReconnect ?? true;
  }
  set autoReconnect(v: boolean) {
    this.set("autoReconnect", v);
  }

  set outputVolume(v: number) {
    this.set("outputVolume", v);
  }

  get pushToTalkEnabled(): boolean { return this.get().pushToTalkEnabled; }
  set pushToTalkEnabled(v: boolean) { this.set("pushToTalkEnabled", v); }

  get pushToTalkKeybind(): string { return this.get().pushToTalkKeybind; }
  set pushToTalkKeybind(v: string) { this.set("pushToTalkKeybind", v); }

  get pushToTalkMode(): "hold" | "toggle" { return this.get().pushToTalkMode; }
  set pushToTalkMode(v: "hold" | "toggle") { this.set("pushToTalkMode", v); }

  get pushToTalkReleaseDelay(): number { return this.get().pushToTalkReleaseDelay; }
  set pushToTalkReleaseDelay(v: number) { this.set("pushToTalkReleaseDelay", v); }

  get pushToTalkNotificationSounds(): boolean { return this.get().pushToTalkNotificationSounds; }
  set pushToTalkNotificationSounds(v: boolean) { this.set("pushToTalkNotificationSounds", v); }

  setPushToTalkConfig(config: {
    enabled: boolean;
    keybind: string;
    mode: "hold" | "toggle";
    releaseDelay: number;
  }) {
    if (typeof config.enabled === "boolean") {
      this.set("pushToTalkEnabled", config.enabled);
    }
    if (typeof config.keybind === "string") {
      this.set("pushToTalkKeybind", config.keybind);
    }
    if (config.mode === "hold" || config.mode === "toggle") {
      this.set("pushToTalkMode", config.mode);
    }
    if (typeof config.releaseDelay === "number") {
      this.set("pushToTalkReleaseDelay", config.releaseDelay);
    }
   }
}
