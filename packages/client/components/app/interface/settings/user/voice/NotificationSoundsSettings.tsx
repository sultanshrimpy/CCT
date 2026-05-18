import { Trans } from "@lingui-solid/solid/macro";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useState } from "@revolt/state";
import { Column, Row, Slider, Text } from "@revolt/ui";

import { CompactNumberInput } from "./CompactNumberInput";
import {
  SettingsToggleButton,
  SettingsToggleGroup,
} from "./SettingsToggleButton";

/**
 * Notification sounds settings configuration
 */
export function NotificationSoundsSettings() {
  const state = useState();

  const individualSoundsDisabled = () => !state.voice.notificationSoundsEnabled;

  return (
    <Column gap="lg">
      <Column>
        <SettingsToggleGroup class={notificationToggleGroup}>
          <SettingsToggleButton
            checked={state.voice.notificationSoundsEnabled}
            onClick={() => {
              state.voice.notificationSoundsEnabled =
                !state.voice.notificationSoundsEnabled;
            }}
          >
            <Trans id="notifications.sounds.enable">
              Enable Notification Sounds
            </Trans>
          </SettingsToggleButton>
        </SettingsToggleGroup>
      </Column>

      <Column gap="md">
        <Text class="label" rootClass={sectionHeading}>
          <Trans id="notifications.sounds.volume">Master Volume</Trans>
        </Text>
        <Row gap="md" align={true}>
          <SliderContainer>
            <Slider
              min={0}
              max={100}
              step={1}
              disabled={individualSoundsDisabled()}
              value={state.voice.notificationVolume * 100}
              onInput={(event) => {
                if (!individualSoundsDisabled()) {
                  const value = event.currentTarget.value;
                  state.voice.notificationVolume = value / 100;
                }
              }}
              labelFormatter={(value) => `${value}%`}
            />
          </SliderContainer>
          <TextFieldContainer>
            <CompactNumberInput
              type="text"
              width="48px"
              disabled={individualSoundsDisabled()}
              value={Math.round(
                state.voice.notificationVolume * 100,
              ).toString()}
              inputMode="numeric"
              onChange={(event) => {
                if (!individualSoundsDisabled()) {
                  const value = parseInt(event.currentTarget.value, 10);
                  if (!isNaN(value) && value >= 0 && value <= 100) {
                    state.voice.notificationVolume = value / 100;
                  }
                }
              }}
            />
            <Text size="small" class="label">
              %
            </Text>
          </TextFieldContainer>
        </Row>
      </Column>

      <Column>
        <Text class="label" rootClass={sectionHeading}>
          <Trans id="notifications.sounds.individual">Individual Sounds</Trans>
        </Text>
        <SettingsToggleGroup class={notificationToggleGroup}>
          <SettingsToggleButton
            checked={state.voice.soundJoinCall}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundJoinCall = !state.voice.soundJoinCall;
              }
            }}
          >
            <Trans id="notifications.sounds.joinCall">Join Call</Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundLeaveCall}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundLeaveCall = !state.voice.soundLeaveCall;
              }
            }}
          >
            <Trans id="notifications.sounds.leaveCall">Leave Call</Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundSomeoneJoined}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundSomeoneJoined =
                  !state.voice.soundSomeoneJoined;
              }
            }}
          >
            <Trans id="notifications.sounds.someoneJoined">
              Someone Joined
            </Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundSomeoneLeft}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundSomeoneLeft = !state.voice.soundSomeoneLeft;
              }
            }}
          >
            <Trans id="notifications.sounds.someoneLeft">Someone Left</Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundMute}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundMute = !state.voice.soundMute;
              }
            }}
          >
            <Trans id="notifications.sounds.mute">Mute</Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundUnmute}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundUnmute = !state.voice.soundUnmute;
              }
            }}
          >
            <Trans id="notifications.sounds.unmute">Unmute</Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundReceiveMessage}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundReceiveMessage =
                  !state.voice.soundReceiveMessage;
              }
            }}
          >
            <Trans id="notifications.sounds.receiveMessage">
              Receive Message
            </Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundDisconnect}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundDisconnect = !state.voice.soundDisconnect;
              }
            }}
          >
            <Trans id="notifications.sounds.disconnect">Disconnected</Trans>
          </SettingsToggleButton>

          <SettingsToggleButton
            checked={state.voice.soundIncomingCall}
            disabled={individualSoundsDisabled()}
            onClick={() => {
              if (!individualSoundsDisabled()) {
                state.voice.soundIncomingCall = !state.voice.soundIncomingCall;
              }
            }}
          >
            <Trans id="notifications.sounds.incomingCall">Incoming Call</Trans>
          </SettingsToggleButton>
        </SettingsToggleGroup>
      </Column>

      <Column>
        <Text class="label" rootClass={sectionHeading}>
          <Trans id="notifications.sounds.connection">Connection</Trans>
        </Text>
        <SettingsToggleGroup class={notificationToggleGroup}>
          <SettingsToggleButton
            checked={state.voice.autoReconnect}
            onClick={() => {
              state.voice.autoReconnect = !state.voice.autoReconnect;
            }}
          >
            <Trans id="notifications.sounds.autoReconnect">
              Auto-reconnect
            </Trans>
          </SettingsToggleButton>
        </SettingsToggleGroup>
      </Column>
    </Column>
  );
}

const notificationToggleGroup = css({
  gap: "10px",
});

const pageHeading = css({
  fontSize: "16px",
  fontWeight: "700",
  lineHeight: "1.3",
  color: "var(--md-sys-color-on-surface)",
  letterSpacing: "0.01em",
});

const sectionHeading = css({
  fontSize: "15px",
  fontWeight: "600",
  lineHeight: "1.35",
  color: "var(--md-sys-color-on-surface)",
  marginBottom: "2px",
});

const SliderContainer = styled("div", {
  base: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  },
});

const TextFieldContainer = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-xs)",
    minHeight: "32px",
  },
});
