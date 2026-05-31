import { createFormControl, createFormGroup } from "solid-forms";

import {
  Avatar,
  Column,
  Dialog,
  DialogProps,
  FloatingSelect,
  Form2,
  MenuItem,
  Text,
} from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Ban a server member with reason
 */
export function BanMemberModal(
  props: DialogProps & Modals & { type: "ban_member" },
) {
  const { showError } = useModals();

  const group = createFormGroup({
    reason: createFormControl(""),
    deleteMessageSeconds: createFormControl("0"),
  });
  async function onSubmit() {
    try {
      await props.member.ban({
        reason: group.controls.reason.value,
        delete_message_seconds: Number(
          group.controls.deleteMessageSeconds.value,
        ),
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
      title={"Ban Member"}
      actions={[{ text: "Cancel" }, {
          text: "Ban",
          onClick: () => {
            onSubmit();
            return false;
          }, isDisabled: !Form2.canSubmit(group), },]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column align>
          <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
          <Text>
            You are about to ban {props.member.user?.username}
          </Text>
          <Form2.TextField
            maxlength={1024}
            counter
            name="reason"
            control={group.controls.reason}
            label={"Reason"}
            placeholder={"User broke a certain rule…"}
          />
          <FloatingSelect
            label={"Delete Message History"}
            value={group.controls.deleteMessageSeconds.value}
            onChange={(
              e: Event & { currentTarget: HTMLElement; target: Element },
            ) =>
              group.controls.deleteMessageSeconds.setValue(
                e.currentTarget.getAttribute("value") || "0",
              )
            }
          >
            <MenuItem value="0">
              Don't delete messages
            </MenuItem>
            <MenuItem value="3600">
              1 hour
            </MenuItem>
            <MenuItem value="21600">
              6 hours
            </MenuItem>
            <MenuItem value="86400">
              1 day
            </MenuItem>
            <MenuItem value="259200">
              3 days
            </MenuItem>
            <MenuItem value="604800">
              7 days
            </MenuItem>
          </FloatingSelect>
        </Column>
      </form>
    </Dialog>
  );
}
