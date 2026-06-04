import { createFormControl, createFormGroup } from "solid-forms";
import { Match, Show, Switch } from "solid-js";

import type { API } from "stoat.js";

import { encodeChannelLimit, parseChannelLimit, stripChannelLimit } from "@revolt/common/lib/channelLimit";

import { useClient } from "@revolt/client";
import { CONFIGURATION } from "@revolt/common";
import { useModals } from "@revolt/modal";
import { Button, CircularProgress, Column, Form2, Row, Text } from "@revolt/ui";

import { ChannelSettingsProps } from "../ChannelSettings";

/**
 * Channel overview
 */
export default function ChannelOverview(props: ChannelSettingsProps) {
  const client = useClient();
  const { openModal } = useModals();

  /* eslint-disable solid/reactivity */
  // we want to take the initial value only
  const isVoice = () => props.channel.isVoice;

  const editGroup = createFormGroup({
    name: createFormControl(props.channel.name),
    description: createFormControl(stripChannelLimit(props.channel.description)),
    userLimit: createFormControl(
      String(parseChannelLimit(props.channel.description) || ""),
    ),
    icon: createFormControl<string | File[] | null>(
      props.channel.animatedIconURL,
    ),
  });
  /* eslint-enable solid/reactivity */

  function onReset() {
    editGroup.controls.name.setValue(props.channel.name);
    editGroup.controls.description.setValue(stripChannelLimit(props.channel.description));
    editGroup.controls.userLimit.setValue(String(parseChannelLimit(props.channel.description) || ""));
    editGroup.controls.icon.setValue(props.channel.animatedIconURL ?? null);
  }

  async function onSubmit() {
    const changes: API.DataEditChannel = {
      remove: [],
    };

    if (editGroup.controls.name.isDirty) {
      changes.name = editGroup.controls.name.value.trim();
    }

    if (editGroup.controls.description.isDirty || editGroup.controls.userLimit.isDirty) {
      const rawDesc = editGroup.controls.description.value.trim();
      const limit = parseInt(editGroup.controls.userLimit.value || "0", 10) || 0;
      const encoded = encodeChannelLimit(limit, rawDesc);

      if (encoded) {
        changes.description = encoded;
      } else {
        changes.remove!.push("Description");
      }
    }

    if (editGroup.controls.icon.isDirty) {
      if (!editGroup.controls.icon.value) {
        changes.remove!.push("Icon");
      } else if (Array.isArray(editGroup.controls.icon.value)) {
        const body = new FormData();
        body.append("file", editGroup.controls.icon.value[0]);

        const [key, value] = client().authenticationHeader;
        const data: { id: string } = await fetch(
          `${CONFIGURATION.DEFAULT_MEDIA_URL}/icons`,
          {
            method: "POST",
            body,
            headers: {
              [key]: value,
            },
          },
        ).then((res) => res.json());

        changes.icon = data.id;
      }
    }

    await props.channel.edit(changes);
  }

  const submit = Form2.useSubmitHandler(editGroup, onSubmit, onReset);

  return (
    <Column gap="xl">
      <form onSubmit={submit}>
        <Column>
          <Text class="label">
            Channel Info
          </Text>
          <Form2.FileInput control={editGroup.controls.icon} accept="image/*" />
          <Form2.TextField
            minlength={1}
            maxlength={32}
            counter
            name="name"
            control={editGroup.controls.name}
            label={"Channel Name"}
          />
          <Form2.TextField
            autosize
            min-rows={2}
            maxlength={1024}
            counter
            name="description"
            control={editGroup.controls.description}
            label={"Channel Description"}
            placeholder={"This channel is about..."}
          />
          <Show when={isVoice()}>
            <Form2.TextField
              name="userLimit"
              control={editGroup.controls.userLimit}
              label={"Max Users (0 or blank = unlimited)"}
              placeholder={"e.g. 4"}
            />
          </Show>
          <Row>
            <Form2.Reset group={editGroup} onReset={onReset} />
            <Form2.Submit group={editGroup} requireDirty>
              Save
            </Form2.Submit>
            <Show when={editGroup.isPending}>
              <CircularProgress />
            </Show>
          </Row>
        </Column>
      </form>
      <Column>
        <Text class="label">
          Mark as Mature
        </Text>
        <Text>
          Users will be asked to confirm their age before opening this channel.
        </Text>
        <div>
          <Button
            onPress={() =>
              openModal({
                type: "channel_toggle_mature",
                channel: props.channel,
              })
            }
          >
            <Switch fallback={"Mark as Mature"}>
              <Match when={props.channel.mature}>
                Unmark as Mature
              </Match>
            </Switch>
          </Button>
        </div>
      </Column>
    </Column>
  );
}
