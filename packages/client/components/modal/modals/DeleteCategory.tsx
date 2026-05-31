import { useMutation } from "@tanstack/solid-query";

import { Dialog, DialogProps } from "@revolt/ui";
import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to delete a category
 */
export function DeleteCategoryModal(
  props: DialogProps & Modals & { type: "delete_category" },
) {
  const { showError } = useModals();

  const deleteCategory = useMutation(() => ({
    mutationFn: () =>
      props.server.edit({
        categories: (props.server.categories ?? []).filter(
          (c) => c.id !== props.categoryId,
        ),
      }),
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={"Delete category"}
      actions={[{ text: "Cancel" }, {
          text: "Delete",
          onClick: deleteCategory.mutateAsync,
        }, ]}
      isDisabled={deleteCategory.isPending}
    >
      Once it's deleted, there's no going back.
    </Dialog>
  );
}
