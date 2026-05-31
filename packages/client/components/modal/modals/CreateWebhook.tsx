import { createFormControl, createFormGroup } from "solid-forms";

import { Dialog, DialogProps, Form2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Create a new group and optionally add members
 */
export function CreateWebhookModal(
  props: DialogProps & Modals & { type: "create_webhook" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    name: createFormControl("", { required: true }),
  });

  async function onSubmit() {
    try {
      const webhook = await props.channel.createWebhook(
        group.controls.name.value,
      );

      props.onClose();
      props.callback(webhook.id);
    } catch (err) {
      showError(err);
    }
  }

  const submit = Form2.useSubmitHandler(group, onSubmit);

  return (
    <Dialog
      minWidth={420}
      show={props.show}
      onClose={props.onClose}
      title={"Create a webhook"}
      actions={[{ text: "Close" }, {
          text: "Create",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Form2.TextField
          minlength={1}
          maxlength={32}
          counter
          name="name"
          control={group.controls.name}
          label={"Webhook Name"}
        />
      </form>
    </Dialog>
  );
}
