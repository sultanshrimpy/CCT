import { Show } from "solid-js";

import { ServerMember, User } from "stoat.js";

import { timeLocale, useTime } from "@revolt/i18n";

import { Text } from "../../design";
import { OverflowingText } from "../../utils";

import { ProfileCard } from "./ProfileCard";

export function ProfileJoined(props: { user: User; member?: ServerMember }) {
  const dayjs = useTime();

  return (
    <ProfileCard>
      <Text class="title" size="large">
        Joined
      </Text>
      <Text class="label">
        <OverflowingText>Stoat</OverflowingText>
        {/* Account Created */}
      </Text>
      <Text>
        {dayjs(props.user.createdAt).format(
          timeLocale()[1]
            .formats.L?.replace("MM", "MMM")
            .replaceAll("/", " ")
            .replaceAll("-", " "),
        )}
      </Text>
      <Show when={props.member}>
        <Text class="label">
          <OverflowingText>{props.member!.server!.name}</OverflowingText>
          {/* Member Since */}
        </Text>
        <Text>
          {dayjs(props.member!.joinedAt).format(
            timeLocale()[1]
              .formats.L?.replace("MM", "MMM")
              .replaceAll("/", " ")
              .replaceAll("-", " "),
          )}
        </Text>
      </Show>
    </ProfileCard>
  );
}
