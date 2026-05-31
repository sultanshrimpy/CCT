import { For } from "solid-js";

import { Avatar, Dialog, DialogProps, List, OverflowingText } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

export function UserProfileMutualFriendsModal(
  props: DialogProps & Modals & { type: "user_profile_mutual_friends" },
) {
  const { openModal } = useModals();

  return (
    <Dialog
      minWidth={420}
      show={props.show}
      onClose={props.onClose}
      title={"Mutual Friends"}
      actions={[{ text: "Close" }]}
    >
      <List>
        <For each={props.users}>
          {(user) => (
            <List.Item
              onClick={() => openModal({ type: "user_profile", user })}
            >
              <Avatar
                slot="icon"
                size={36}
                src={user.animatedAvatarURL}
                fallback={user.displayName}
              />
              <OverflowingText>{user.username}</OverflowingText>
            </List.Item>
          )}
        </For>
      </List>
    </Dialog>
  );
}
