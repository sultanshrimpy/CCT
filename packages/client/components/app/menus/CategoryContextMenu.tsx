import { Show } from "solid-js";

import type { API } from "stoat.js";
import { Channel, Server } from "stoat.js";

import { useModals } from "@revolt/modal";
import { useState } from "@revolt/state";

import MdBadge from "@material-design-icons/svg/outlined/badge.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdLibraryAdd from "@material-design-icons/svg/outlined/library_add.svg?component-solid";
import MdMarkChatRead from "@material-design-icons/svg/outlined/mark_chat_read.svg?component-solid";

import { Symbol } from "@revolt/ui/components/utils/Symbol";
import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuDivider,
} from "./ContextMenu";

export type CategoryData = Omit<API.Category, "channels"> & {
  channels: Channel[];
};

/**
 * Context menu for categories
 */
export function CategoryContextMenu(props: {
  server: Server;
  category: CategoryData;
}) {
  const state = useState();
  const { openModal } = useModals();

  /**
   * Mark category as read
   */
  function markAsRead() {
    props.category.channels
      .filter((channel) => channel.unread)
      .forEach((channel) => channel.ack());
  }

  /**
   * Create a new category
   */
  function createCategory() {
    openModal({
      type: "create_category",
      server: props.server,
    });
  }

  /**
   * Delete category
   */
  function deleteCategory() {
    openModal({
      type: "delete_category",
      server: props.server,
      categoryId: props.category.id,
    });
  }

  function editCategoryName() {
    openModal({
      type: "edit_category",
      server: props.server,
      category: props.category,
    });
  }

  /**
   * Copy category id to clipboard
   */
  function copyId() {
    navigator.clipboard.writeText(props.category.id);
  }

  /**
   * Determine if any channel in category has unread messages
   */
  const hasUnread = () => {
    return props.category.channels.some((channel) => channel?.unread);
  };

  return (
    <ContextMenu>
      <Show when={hasUnread()}>
        <ContextMenuButton icon={MdMarkChatRead} onClick={markAsRead}>
          Mark as read
        </ContextMenuButton>
        <ContextMenuDivider />
      </Show>

      <Show when={props.server.havePermission("ManageChannel")}>
        <ContextMenuButton icon={MdLibraryAdd} onClick={createCategory}>
          Create category
        </ContextMenuButton>
      </Show>
      <Show when={props.server.havePermission("ManageChannel")}>
        <ContextMenuButton
          icon={<Symbol size={16}>edit</Symbol>}
          onClick={editCategoryName}
        >
          Rename category
        </ContextMenuButton>
      </Show>
      <Show when={props.server.havePermission("ManageChannel")}>
        <ContextMenuButton icon={MdDelete} onClick={deleteCategory} destructive>
          Delete category
        </ContextMenuButton>
      </Show>

      <Show when={state.settings.getValue("advanced:copy_id")}>
        <ContextMenuDivider />
      </Show>

      <Show when={state.settings.getValue("advanced:copy_id")}>
        <ContextMenuButton icon={MdBadge} onClick={copyId}>
          Copy category ID
        </ContextMenuButton>
      </Show>
    </ContextMenu>
  );
}
