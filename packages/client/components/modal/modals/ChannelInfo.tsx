import { Markdown } from "@revolt/markdown";
import { Dialog, DialogProps } from "@revolt/ui";

import { Modals } from "../types";

export function ChannelInfoModal(
  props: DialogProps & Modals & { type: "channel_info" },
) {
  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={`#${props.channel.name}`}
      actions={[{ text: "Close" }]}
    >
      <Markdown content={props.channel.description!} />
    </Dialog>
  );
}
