import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a role
 */
export function DeleteRoleModal(
  props: DialogProps & Modals & { type: "delete_role" },
) {
  const { showError } = useModals();

  const deleteRole = useMutation(() => ({
    mutationFn: () => props.role.delete(),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<>Delete {props.role.name}?</>}
      actions={[{ text: "Cancel" }, {
          text: "Delete",
          onClick: () => deleteRole.mutateAsync(), },]}
      isDisabled={deleteRole.isPending}
    >
      Once it's deleted, there's no going back.
    </Dialog>
  );
}
