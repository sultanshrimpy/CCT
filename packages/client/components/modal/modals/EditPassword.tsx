import { createFormControl, createFormGroup } from "solid-forms";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Change account password
 */
export function EditPasswordModal(
  props: DialogProps & Modals & { type: "edit_password" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    password: createFormControl("", { required: true }),
    currentPassword: createFormControl("", { required: true }),
  });

  async function onSubmit() {
    try {
      await props.client.account.changePassword(
        group.controls.password.value,
        group.controls.currentPassword.value,
      );

      props.onClose();
    } catch (err) {
      showError(err);
    }
  }

  const submit = Form2.useSubmitHandler(group, onSubmit);

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={"Change login password"}
      actions={[{ text: "Close" }, {
          text: "Change",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column>
          <Form2.TextField
            name="password"
            control={group.controls.password}
            label={"New Password"}
            type="password"
            placeholder={"Enter a new password."}
          />
          <Form2.TextField
            name="currentPassword"
            control={group.controls.currentPassword}
            label={"Current Password"}
            type="password"
            placeholder={"Enter your current password..."}
          />
        </Column>
      </form>
    </Dialog>
  );
}
