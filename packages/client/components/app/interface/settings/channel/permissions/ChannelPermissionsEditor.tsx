import { For, Match, Show, Switch, createSignal } from "solid-js";

import {
  API,
  Channel,
  DEFAULT_PERMISSION_DIRECT_MESSAGE,
  Server,
} from "stoat.js";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Button, Checkbox2, OverrideSwitch, Row, Text } from "@revolt/ui";

type Props =
  | { type: "server_default"; context: Server }
  | { type: "server_role"; context: Server; roleId: string }
  | { type: "channel_default"; context: Channel }
  | { type: "channel_role"; context: Channel; roleId: string }
  | { type: "group"; context: Channel };

type Context = API.Channel["channel_type"] | "Server";

/**
 * Generic editor for any channel permissions
 */
export function ChannelPermissionsEditor(props: Props) {
  const context: Context =
    // eslint-disable-next-line solid/reactivity
    props.context instanceof Server ? "Server" : props.context.type;

  /**
   * Current permission value, normalised to [allow, deny]
   * @returns [allow, deny] BigInts
   */
  function currentValue() {
    switch (props.type) {
      case "server_default":
        return [BigInt(props.context.defaultPermissions), BigInt(0)];
      case "server_role":
        return [
          BigInt(props.context.roles?.get(props.roleId)?.permissions.a || 0),
          BigInt(props.context.roles?.get(props.roleId)?.permissions.d || 0),
        ];
      case "channel_default":
        return [
          BigInt(props.context.defaultPermissions?.a || 0),
          BigInt(props.context.defaultPermissions?.d || 0),
        ];
      case "channel_role":
        return [
          BigInt(props.context.rolePermissions?.[props.roleId]?.a || 0),
          BigInt(props.context.rolePermissions?.[props.roleId]?.d || 0),
        ];
      case "group":
        return [
          BigInt(
            props.context.permissions ?? DEFAULT_PERMISSION_DIRECT_MESSAGE,
          ),
          BigInt(0),
        ];
    }
  }

  /**
   * Current edited values
   */
  const [value, setValue] = createSignal(currentValue());

  /**
   * Whether there is a pending save
   */
  function unsavedChanges() {
    const [a1, a2] = currentValue(),
      [b1, b2] = value();

    return a1 !== b1 || a2 !== b2;
  }

  /**
   * Reset to the current value
   */
  function reset() {
    setValue(currentValue());
  }

  /**
   * Commit changes
   * @todo mutator
   */
  function save() {
    switch (props.type) {
      case "server_default":
        props.context.setPermissions(undefined, Number(value()[0]));
        break;
      case "server_role":
        props.context.setPermissions(props.roleId, {
          allow: Number(value()[0]),
          deny: Number(value()[1]),
        });
        break;
      case "channel_default":
        props.context.setPermissions(undefined, {
          allow: Number(value()[0]),
          deny: Number(value()[1]),
        });
        break;
      case "channel_role":
        props.context.setPermissions(props.roleId, {
          allow: Number(value()[0]),
          deny: Number(value()[1]),
        });
        break;
      case "group":
        props.context.setPermissions(undefined, Number(value()[0]));
        break;
    }
  }

  const Permissions: {
    heading?: string;
    key: string;
    value: bigint;
    title: string;
    description: Partial<Record<Context | "Any", string>>;
  }[] = [
    {
      heading: "Admin",
      key: "ManageChannel",
      value: 1n ** 0n,
      title: "Manage Channel",
      description: {
        Group: "Edit group name and description",
        Any: "Edit and delete channel",
      },
    },
    {
      key: "ManageServer",
      value: 2n ** 1n,
      title: "Manage Server",
      description: {
        Server: "Edit the server's information and settings",
      },
    },
    {
      key: "ManagePermissions",
      value: 2n ** 2n,
      title: "Manage Permissions",
      description: {
        Group: "Whether other users can edit these settings",
        TextChannel: "Edit channel-specific role and default permissions",
        Server: "Edit any permissions on the server",
      },
    },
    {
      key: "ManageRole",
      value: 2n ** 3n,
      title: "Manage Roles",
      description: {
        Server: "Create and edit server roles",
      },
    },
    {
      key: "ManageCustomisation",
      value: 2n ** 4n,
      title: "Manage Customisation",
      description: {
        Server: "Create server emoji",
      },
    },
    {
      heading: "Members",
      key: "KickMembers",
      value: 2n ** 6n,
      title: "Kick Members",
      description: {
        Server: "Kick lower-ranking members from the server",
      },
    },
    {
      key: "BanMembers",
      value: 2n ** 7n,
      title: "Ban Members",
      description: {
        Server: "Ban lower-ranking members from the server",
      },
    },
    {
      key: "TimeoutMembers",
      value: 2n ** 8n,
      title: "Timeout Members",
      description: {
        Server: "Temporarily prevent lower-ranking members from interacting",
      },
    },
    {
      key: "AssignRoles",
      value: 2n ** 9n,
      title: "Assign Roles",
      description: {
        Server: "Assign lower-ranked roles to lower-ranking members",
      },
    },
    {
      key: "ChangeNickname",
      value: 2n ** 10n,
      title: "Change Nickname",
      description: {
        Server: "Change own nickname",
      },
    },
    {
      key: "ManageNicknames",
      value: 2n ** 11n,
      title: "Manage Nicknames",
      description: {
        Server: "Change other members' nicknames",
      },
    },
    {
      key: "ChangeAvavar",
      value: 2n ** 12n,
      title: "Change Avatar",
      description: {
        Server: "Change own avatar",
      },
    },
    {
      key: "RemoveAvatars",
      value: 2n ** 13n,
      title: "Remove Avatars",
      description: {
        Server: "Remove other members' avatars",
      },
    },
    {
      heading: "Channels",
      key: "ViewChannel",
      value: 2n ** 20n,
      title: "View Channel",
      description: {
        TextChannel: "Able to access this channel",
        Server: "Able to access channels on this server",
      },
    },
    {
      key: "ReadMessageHistory",
      value: 2n ** 21n,
      title: "Read Message History",
      description: {
        TextChannel: "Read past messages sent in channel",
        Server: "Read past messages sent in channels",
      },
    },
    {
      key: "SendMessage",
      value: 2n ** 22n,
      title: "Send Messages",
      description: {
        Group: "Send messages in channel",
        TextChannel: "Send messages in channel",
        Server: "Send messages in channels",
      },
    },
    {
      key: "ManageMessages",
      value: 2n ** 23n,
      title: "Manage Messages",
      description: {
        Group: "Delete and pin messages sent by other members",
        TextChannel: "Delete and pin messages sent by other members",
        Server: "Delete and pin messages sent by other members",
      },
    },
    {
      key: "ManageWebhooks",
      value: 2n ** 24n,
      title: "Manage Webhooks",
      description: {
        Group: "Create and edit webhooks",
        TextChannel: "Create and edit webhooks",
        Server: "Create and edit webhooks",
      },
    },
    {
      key: "InviteOthers",
      value: 2n ** 25n,
      title: "Invite Others",
      description: {
        Group: "Add new members to the group",
        Any: "Create invites for others to use",
      },
    },
    {
      heading: "Messaging",
      key: "SendEmbeds",
      value: 2n ** 26n,
      title: "Send Embeds",
      description: {
        Any: "Send embedded content such as link embeds or custom embeds",
      },
    },
    {
      key: "UploadFiles",
      value: 2n ** 27n,
      title: "Upload Files",
      description: {
        Any: "Send attachments to chat",
      },
    },
    {
      key: "Masquerade",
      value: 2n ** 28n,
      title: "Masquerade",
      description: {
        Any: "Allow members to change name and avatar per-message",
      },
    },
    {
      key: "React",
      value: 2n ** 29n,
      title: "React",
      description: {
        Any: "React to messages with emoji",
      },
    },
    {
      heading: "Voice",
      key: "Connect",
      value: 2n ** 30n,
      title: "Connect",
      description: {
        TextChannel: "Connect to voice channel",
        Server: "Connect to voice channel",
      },
    },
    {
      key: "Speak",
      value: 2n ** 31n,
      title: "Speak",
      description: {
        TextChannel: "Able to speak in voice call",
        Server: "Able to speak in voice call",
      },
    },
    {
      key: "Video",
      value: 2n ** 32n,
      title: "Video",
      description: {
        TextChannel: "Share camera or screen in voice call",
        Server: "Share camera or screen in voice call",
      },
    },
    {
      key: "MuteMembers",
      value: 2n ** 33n,
      title: "Mute Members",
      description: {
        TextChannel: "Mute lower-ranking members in voice call",
        Server: "Mute lower-ranking members in voice call",
      },
    },
    {
      key: "DeafenMembers",
      value: 2n ** 34n,
      title: "Deafen Members",
      description: {
        TextChannel: "Deafen lower-ranking members in voice call",
        Server: "Deafen lower-ranking members in voice call",
      },
    },
    {
      key: "MoveMembers",
      value: 2n ** 35n,
      title: "Move Members",
      description: {
        TextChannel: "Move members between voice channels",
        Server: "Move members between voice channels",
      },
    },
    {
      key: "Listen",
      value: 2n ** 36n,
      title: "Listen",
      description: {
        TextChannel: "Hear other people and see their video",
        Server: "Hear other people and see their video",
      },
    },
    {
      heading: "Mentions",
      key: "MentionEveryone",
      value: 2n ** 37n,
      title: "Mention Everyone",
      description: {
        Any: "Mention everyone and online members inside the server",
      },
    },
    {
      key: "MentionRoles",
      value: 2n ** 38n,
      title: "Mention Roles",
      description: {
        Any: "Mention specific roles",
      },
    },
  ];

  /**
   * Find description for this permission in context
   * If null, don't show this permission entry
   * @param entry Entry
   * @returns Description or null
   */
  function description(entry: (typeof Permissions)[number]) {
    const desc = entry.description;
    return desc[context] ?? desc.Any;
  }

  return (
    <div class={css({ display: "flex", flexDirection: "column" })}>
      <For each={Permissions}>
        {(entry) => (
          <Show when={description(entry)}>
            <Show when={entry.heading}>
              <span class={css({ marginTop: "var(--gap-md)" })}>
                <Text class="label">{entry.heading}</Text>
              </span>
            </Show>

            <Switch
              fallback={
                <ChannelPermissionToggle
                  key={entry.key}
                  title={entry.title}
                  description={description(entry) as string}
                  value={(value()[0] & entry.value) == entry.value}
                  onChange={() =>
                    setValue((v) => [v[0] ^ BigInt(entry.value), v[1]])
                  }
                  havePermission={
                    (props.context.permission & entry.value) === entry.value
                  }
                />
              }
            >
              <Match when={props.type.startsWith("channel_")}>
                <ChannelPermissionOverride
                  key={entry.key}
                  title={entry.title}
                  description={description(entry) as string}
                  value={
                    (value()[0] & entry.value) == entry.value
                      ? "allow"
                      : (value()[1] & entry.value) == entry.value
                        ? "deny"
                        : "neutral"
                  }
                  onChange={(target) => {
                    let allow = value()[0] & ~entry.value;
                    let deny = value()[1] & ~entry.value;

                    if (target === "allow") allow |= entry.value;
                    if (target === "deny") deny |= entry.value;

                    setValue([allow, deny]);
                  }}
                  havePermission={
                    (props.context.permission & entry.value) === entry.value
                  }
                />
              </Match>
            </Switch>
          </Show>
        )}
      </For>

      <StickyPanel>
        <Row>
          <Button
            isDisabled={!unsavedChanges()}
            variant="text"
            size={unsavedChanges() ? "md" : "sm"}
            onPress={reset}
          >
            Reset
          </Button>
          <Button
            isDisabled={!unsavedChanges()}
            size={unsavedChanges() ? "md" : "sm"}
            onPress={save}
          >
            Save permissions
          </Button>
        </Row>
      </StickyPanel>
    </div>
  );
}

const StickyPanel = styled("div", {
  base: {
    position: "sticky",
    width: "fit-content",
    padding: "var(--gap-md)",
    bottom: "var(--gap-lg)",
    borderRadius: "var(--borderRadius-xl)",
    background: "var(--md-sys-color-surface)",
  },
});

function ChannelPermissionToggle(props: {
  key: string;
  title: string;
  description: string;

  value: boolean;
  onChange: (value: boolean) => void;

  havePermission: boolean;
}) {
  return (
    <Checkbox2
      name={props.key}
      checked={props.value}
      onChange={(event) => props.onChange(event.currentTarget.checked)}
      disabled={!props.havePermission}
    >
      <div
        class={css({
          marginStart: "var(--gap-md)",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <Text size="large">{props.title}</Text>
        <Text>{props.description}</Text>
      </div>
    </Checkbox2>
  );
}

function ChannelPermissionOverride(props: {
  key: string;
  title: string;
  description: string;

  value: "allow" | "deny" | "neutral";
  onChange: (value: "allow" | "deny" | "neutral") => void;

  havePermission: boolean;
}) {
  return (
    <div
      class={css({
        gap: "var(--gap-md)",
        display: "flex",
      })}
    >
      <div
        class={css({
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        })}
      >
        <Text size="large">{props.title}</Text>
        <Text>{props.description}</Text>
      </div>
      <OverrideSwitch
        disabled={!props.havePermission}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}
