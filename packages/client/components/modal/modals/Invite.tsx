import { Match, Show, Switch } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { useMutation } from "@tanstack/solid-query";
import { ServerPublicInvite } from "stoat.js";

import { Avatar, Dialog, DialogProps, Row } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

/**
 * Modal to join a server
 */
export function InviteModal(props: DialogProps & Modals & { type: "invite" }) {
  const navigate = useNavigate();
  const { showError } = useModals();

  const join = useMutation(() => ({
    mutationFn: () => (props.invite as ServerPublicInvite).join(),
    onSuccess(server) {
      navigate(server.path);
    },
    onError: showError,
  }));

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={
        <Switch>
          <Match when={props.invite.type === "Server"}>
            <Row>
              <Avatar
                size={32}
                src={
                  (props.invite as ServerPublicInvite).serverIcon?.previewUrl
                }
                fallback={(props.invite as ServerPublicInvite).serverName}
              />
              <span>{(props.invite as ServerPublicInvite).serverName}</span>
            </Row>
          </Match>
        </Switch>
      }
      actions={[{ text: "Cancel" }, {
          text: (
            <Show
              when={
                props.invite.type === "Server"
                  ? !(props.invite as ServerPublicInvite).server
                  : true
              }
              fallback={"Open"}
            >
              Join
            </Show>
          ),
          onClick: join.mutateAsync,
        }, ]}
      isDisabled={join.isPending}
      scrimBackground={
        props.invite instanceof ServerPublicInvite
          ? props.invite.serverBanner?.originalUrl
          : undefined
      }
    >
      <Switch>
        <Match when={props.invite.type === "Server"}>
          <Show
            when={!(props.invite as ServerPublicInvite).server}
            fallback={"You're already part of this server."}
          >
            You've been invited to join this server. <br /> Would you like to join?
          </Show>
        </Match>
      </Switch>
    </Dialog>
  );
}
