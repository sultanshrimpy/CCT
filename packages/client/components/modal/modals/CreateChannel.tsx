import { createFormControl, createFormGroup } from "solid-forms";
import { createSignal, createMemo, Show } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";

import { useNavigate } from "@revolt/routing";
import { Column, Dialog, DialogProps, Form2, Radio2 } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

import { StageBridgeLinks, saveStageBridgeLinks } from "./StageBridgeLinks";

/**
 * Modal to create a new server channel
 */
export function CreateChannelModal(
  props: DialogProps & Modals & { type: "create_channel" },
) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { showError } = useModals();

  const group = createFormGroup({
    name: createFormControl("", { required: true }),
    type: createFormControl("Text"),
  });

const [audienceLinks, setAudienceLinks] = createSignal<string[]>([]);
const isVoice = createMemo(() => group.controls.type.value === "Voice");
  async function onSubmit() {
    try {
      const channel = await props.server.createChannel({
        type: group.controls.type.value as "Text" | "Voice",
        name: group.controls.name.value,
      });

       if (group.controls.type.value === "Voice" && audienceLinks().length > 0) {
	 await saveStageBridgeLinks(channel.id, audienceLinks());
       }

       if (props.cb) {
        props.cb(channel);
       } else {
        navigate(`/server/${props.server.id}/channel/${channel.id}`);
       }


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
      title={<Trans>Create channel</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Create</Trans>,
          onClick: () => {
            onSubmit();
            return false;
          },
          isDisabled: !Form2.canSubmit(group),
        },
      ]}
      isDisabled={group.isPending}
    >
      <form onSubmit={submit}>
        <Column>
          <Form2.TextField
            minlength={1}
            maxlength={32}
            counter
            name="name"
            control={group.controls.name}
            label={t`Channel Name`}
          />

          <Form2.Radio control={group.controls.type}>
            <Radio2.Option value="Text">
              <Trans>Text Channel</Trans>
            </Radio2.Option>
            <Radio2.Option value="Voice">
              <Trans>Voice Channel</Trans>
            </Radio2.Option>
          </Form2.Radio>
	  <div style={group.controls.type.value === "Voice" ? {} : { display: "none" }}>
	    <StageBridgeLinks
	      server={props.server}
	      selected={audienceLinks()}
	      onChange={setAudienceLinks}
	    />
	  </div>
        </Column>
      </form>
    </Dialog>
  );
}
