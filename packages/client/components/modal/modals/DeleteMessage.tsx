import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a message
 */
export function DeleteMessageModal(
  props: DialogProps & Modals & { type: "delete_message" },
) {
  const { showError } = useModals();

  const deleteMessage = useMutation(() => ({
    mutationFn: () => props.message.delete(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={"Delete message"}
      actions={[{ text: "Cancel" }, {
          text: "Delete",
          onClick: () => deleteMessage.mutateAsync(), },]}
      isDisabled={deleteMessage.isPending}
    >
      Are you sure you want to delete this?
    </Dialog>
  );
}
