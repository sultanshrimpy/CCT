import { useClient } from "@revolt/client";
import { Markdown } from "@revolt/markdown";
import { Dialog, DialogProps } from "@revolt/ui";

import { useModals } from "..";
import { Modals } from "../types";

export function ServerInfoModal(
  props: DialogProps & Modals & { type: "server_info" },
) {
  const client = useClient();
  const { openModal } = useModals();

  const canOpenSettings = () =>
    props.server.orPermission(
      "ManageServer",
      "ManageCustomisation",
      "ManageRole",
      "ManagePermissions",
    );

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={props.server.name}
      actions={[
        ...(canOpenSettings()
          ? [
              {
                text: "Settings",
                onClick() {
                  openModal({
                    type: "settings",
                    config: "server",
                    context: props.server,
                  });
                },
              },
            ]
          : []),
        {
          text: "Edit Identity",
          onClick() {
            openModal({
              type: "server_identity",
              member: props.server.member!,
            });
          },
        },
        {
          text: "Report",
          onClick() {
            openModal({
              type: "report_content",
              client: client(),
              target: props.server,
            });
          },
        },
        { text: "Close" },
      ]}
    >
      <Markdown content={props.server.description!} />
    </Dialog>
  );
}
