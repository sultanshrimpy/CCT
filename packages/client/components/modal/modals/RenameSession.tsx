import { createFormControl, createFormGroup } from "solid-forms";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal for renaming session
 */
export function RenameSessionModal(
  props: DialogProps & Modals & { type: "rename_session" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    // eslint-disable-next-line solid/reactivity
    name: createFormControl(props.session.name, { required: true }),
  });

  async function onSubmit() {
    try {
      await props.session.rename(group.controls.name.value);
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
      title={"Rename Session"}
      actions={[{ text: "Cancel" }, {
          text: "Rename",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column>
          <Form2.TextField
            //TODO: the length should probably be limited here, I couldn't find the server-side validator
            name="name"
            control={group.controls.name}
            label={"Name"}
            placeholder={"Enter a new name for this session"}
          />
        </Column>
      </form>
    </Dialog>
  );
}
