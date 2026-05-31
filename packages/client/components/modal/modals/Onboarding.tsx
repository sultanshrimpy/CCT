import { createFormControl, createFormGroup } from "solid-forms";

import { Column, Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

// TODO: port the onboarding modal design

/**
 * Modal to pick a new username
 */
export function OnboardingModal(
  props: DialogProps & Modals & { type: "onboarding" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    username: createFormControl("", { required: true }),
  });

  async function onSubmit() {
    try {
      await props.callback(group.controls.username.value);
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
      title={"Choose username"}
      actions={[{ text: "Cancel" }, {
          text: "Good",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column>
          <Form2.TextField
            minlength={1}
            maxlength={32}
            counter
            name="username"
            control={group.controls.username}
            label={"Username"}
          />
        </Column>
      </form>
    </Dialog>
  );
}
