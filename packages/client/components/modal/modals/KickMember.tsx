import { useMutation } from "@tanstack/solid-query";

import { Avatar, Column, Dialog, DialogProps, Text } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Kick a server member
 */
export function KickMemberModal(
  props: DialogProps & Modals & { type: "kick_member" },
) {
  const { showError } = useModals();

  const kick = useMutation(() => ({
    mutationFn: () => props.member.kick(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={"Kick Member"}
      actions={[{ text: "Cancel" }, {
          text: "Kick",
          onClick: kick.mutateAsync,
        }, ]}
      isDisabled={kick.isPending}
    >
      <Column align>
        <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
        <Text>
          You are about to kick {props.member.user?.username}
        </Text>
      </Column>
    </Dialog>
  );
}
