import { Avatar, Dialog, DialogProps } from "@revolt/ui";

import { Modals } from "../types";

export function EmojiPreviewModal(
  props: DialogProps & Modals & { type: "emoji_preview" },
) {
  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={`:${props.emoji.name}:`}
      actions={[{
          text: "Delete",
          async onClick() {
            await props.emoji.delete();
          },
        }, { text: "Close" }, ]}
    >
      <Avatar src={props.emoji.url} shape="rounded-square" />
    </Dialog>
  );
}
