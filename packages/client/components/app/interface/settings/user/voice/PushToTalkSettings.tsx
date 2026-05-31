import { Show } from "solid-js";

import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useState } from "@revolt/state";
import { Column, KeybindInput, Row, Slider, Text } from "@revolt/ui";

import { CompactNumberInput } from "./CompactNumberInput";
import {
  SettingsToggleButton,
  SettingsToggleGroup,
} from "./SettingsToggleButton";

/**
 * Sync PTT settings to desktop main process
 */
function syncToDesktop(settings: {
  enabled?: boolean;
  keybind?: string;
  mode?: "hold" | "toggle";
  releaseDelay?: number;
  notificationSounds?: boolean;
}) {
  if (typeof window !== "undefined" && window.pushToTalk?.updateSettings) {
    window.pushToTalk.updateSettings(settings);
  }
}

/**
 * Push to Talk settings configuration
 */
export function PushToTalkSettings() {
  const state = useState();

  return (
    <Column gap="lg">
      <Column>
        <SettingsToggleGroup>
          <SettingsToggleButton
            checked={state.voice.pushToTalkEnabled}
            onClick={() => {
              const newValue = !state.voice.pushToTalkEnabled;
              state.voice.pushToTalkEnabled = newValue;
              syncToDesktop({ enabled: newValue });
            }}
          >
            Enable Push to Talk
          </SettingsToggleButton>
        </SettingsToggleGroup>
      </Column>

      <Show when={state.voice.pushToTalkEnabled}>
        <Column gap="md">
          <Text class="label" rootClass={sectionHeading}>
            Push to Talk Keybind
          </Text>

          <KeybindInput
            value={state.voice.pushToTalkKeybind}
            onChange={(value) => {
              state.voice.pushToTalkKeybind = value;
              syncToDesktop({ keybind: value });
            }}
            placeholder="Click to set keybind"
          />
        </Column>

        <Column>
          <Text class="label" rootClass={sectionHeading}>
            Notification Sounds
          </Text>
          <SettingsToggleGroup>
            <SettingsToggleButton
              checked={state.voice.pushToTalkNotificationSounds}
              description={
                "Play sounds when muting/unmuting with Push to Talk"
              }
              onClick={() => {
                const newValue = !state.voice.pushToTalkNotificationSounds;
                state.voice.pushToTalkNotificationSounds = newValue;
                syncToDesktop({ notificationSounds: newValue });
              }}
            >
              Play Mute/Unmute Sounds
            </SettingsToggleButton>
          </SettingsToggleGroup>
        </Column>

        <Column>
          <Text class="label" rootClass={sectionHeading}>
            Mode
          </Text>
          <SettingsToggleGroup>
            <SettingsToggleButton
              checked={state.voice.pushToTalkMode === "toggle"}
              description={
                "Default is Hold mode"
              }
              onClick={() => {
                const newMode =
                  state.voice.pushToTalkMode === "hold" ? "toggle" : "hold";
                state.voice.pushToTalkMode = newMode;
                syncToDesktop({ mode: newMode });
              }}
            >
              Enable Toggle Mode
            </SettingsToggleButton>
          </SettingsToggleGroup>
        </Column>

        <Column gap="md">
          <Text class="label" rootClass={sectionHeading}>
            Release Delay
          </Text>
          <Row gap="md" align={true}>
            <SliderContainer>
              <Slider
                min={0}
                max={5000}
                step={50}
                value={state.voice.pushToTalkReleaseDelay}
                onInput={(event) => {
                  const value = event.currentTarget.value;
                  state.voice.pushToTalkReleaseDelay = value;
                  syncToDesktop({ releaseDelay: value });
                }}
                labelFormatter={(value) => `${value}ms`}
              />
            </SliderContainer>
            <TextFieldContainer>
              <CompactNumberInput
                type="text"
                width="64px"
                value={state.voice.pushToTalkReleaseDelay.toString()}
                inputMode="numeric"
                onChange={(event) => {
                  const value = parseInt(event.currentTarget.value, 10);
                  if (!isNaN(value) && value >= 0 && value <= 5000) {
                    state.voice.pushToTalkReleaseDelay = value;
                    syncToDesktop({ releaseDelay: value });
                  }
                }}
              />
              <Text size="small" class="label">
                ms
              </Text>
            </TextFieldContainer>
          </Row>
        </Column>
      </Show>
    </Column>
  );
}

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
