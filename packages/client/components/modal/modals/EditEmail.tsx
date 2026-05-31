import { createFormControl, createFormGroup } from "solid-forms";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Change account email address
 */
export function EditEmailModal(
  props: DialogProps & Modals & { type: "edit_email" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    email: createFormControl("", { required: true }),
    currentPassword: createFormControl("", { required: true }),
  });

  async function onSubmit() {
    try {
      await props.client.account.changeEmail(
        group.controls.email.value,
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
      title={"Change login email"}
      actions={[{ text: "Close" }, {
          text: "Send email",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column>
          <Form2.TextField
            name="email"
            type="email"
            label={"Email"}
            control={group.controls.email}
            placeholder={"someone@example.com"}
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
