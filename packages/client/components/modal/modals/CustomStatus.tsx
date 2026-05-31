import { createFormControl, createFormGroup } from "solid-forms";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal for editing user's custom status
 */
export function CustomStatusModal(
  props: DialogProps & Modals & { type: "custom_status" },
) {
  const { showError } = useModals();

  /* eslint-disable solid/reactivity */
  const group = createFormGroup({
    text: createFormControl(props.client.user?.status?.text ?? ""),
  });
  /* eslint-enable solid/reactivity */

  async function onSubmit() {
    try {
      const text = group.controls.text.value;
      await props.client.user!.edit({
        status: {
          ...props.client.user?.status,
          text: text.trim().length > 0 ? text : undefined,
        },
      });
      props.onClose();
    } catch (error) {
      showError(error);
    }
  }

  const submit = Form2.useSubmitHandler(group, onSubmit);

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={"Set your status"}
      actions={[{ text: "Close" }, {
          text: "Save",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column>
          <Form2.TextField
            maxlength={128}
            counter
            name="text"
            control={group.controls.text}
            label={"Custom status"}
          />
        </Column>
      </form>
    </Dialog>
  );
}
