import { Show } from "solid-js";

import { User } from "stoat.js";
import { styled } from "styled-system/jsx";

import { Text, typography } from "../../design";

import { ProfileCard } from "./ProfileCard";

export function ProfileStatus(props: { user: User }) {
  return (
    <Show when={props.user.status?.text}>
      <ProfileCard>
        <Text class="title" size="large">
          Status
        </Text>
        <Status>
          {props.user.statusMessage((s) =>
            s === "Online"
              ? "Online"
              : s === "Busy"
                ? "Busy"
                : s === "Focus"
                  ? "Focus"
                  : s === "Idle"
                    ? "Idle"
                    : "Offline",
          )}
        </Status>
      </ProfileCard>
    </Show>
  );
}

const Status = styled("span", {
  base: {
    ...typography.raw(),
    userSelect: "text",
  },
});
