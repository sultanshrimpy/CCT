import { Match, Switch } from "solid-js";

import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a channel
 */
export function DeleteChannelModal(
  props: DialogProps & Modals & { type: "delete_channel" },
) {
  const { showError } = useModals();

  const deleteChannel = useMutation(() => ({
    mutationFn: () => props.channel.delete(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={
        <Switch fallback={<>{"Delete "}{props.channel.name}{"?"}</>}>
          <Match when={props.channel.type === "Group"}>
            Leave {props.channel.name}?
          </Match>
          <Match when={props.channel.type === "DirectMessage"}>
            Close conversation with {props.channel.recipient?.displayName}?
          </Match>
        </Switch>
      }
      actions={[{ text: "Cancel" }, {
          text: (
            <Switch fallback={"Delete"}>
              <Match when={props.channel.type === "Group"}>
                Leave
              </Match>
              <Match when={props.channel.type === "DirectMessage"}>
                Close
              </Match>
            </Switch>
          ),
          onClick: () => deleteChannel.mutateAsync(), },]}
      isDisabled={deleteChannel.isPending}
    >
      <Switch
        fallback={"Once it's deleted, there's no going back."}
      >
        <Match when={props.channel.type === "Group"}>
          You won't be able to rejoin unless you are re-invited.
        </Match>
        <Match when={props.channel.type === "DirectMessage"}>
          You can re-open it later, but it will disappear on both sides.
        </Match>
      </Switch>
    </Dialog>
  );
}
