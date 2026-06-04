import { For, Show, createMemo } from "solid-js";

import type { API, Channel } from "stoat.js";
import { styled } from "styled-system/jsx";

import { TextWithEmoji } from "@revolt/markdown";
import {
  Column,
  Draggable,
  Text,
  typography,
} from "@revolt/ui";
import { createDragHandle } from "@revolt/ui/components/utils/Draggable";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

import { ServerSettingsProps } from "../ServerSettings";

/**
 * Ordered category data (mirrors the type in ServerSidebar)
 */
type CategoryData = Omit<API.Category, "channels"> & { channels: Channel[] };

type OrderingEvent =
  | { type: "categories"; ids: string[] }
  | { type: "category"; id: string; channelIds: string[]; moved: boolean };

/**
 * Channel Management settings page
 * Allows users with ManageChannel to reorder channels and categories.
 */
export function ChannelManagement(props: ServerSettingsProps) {
  // Mirror of the same held-event logic from ServerSidebar
  let heldEvent: OrderingEvent & { type: "category" } = null!;

  function handleOrdering(event: OrderingEvent) {
    if (event.type === "category" && event.moved && !heldEvent) {
      heldEvent = event;
      return;
    }

    const normalisedCategories = props.server.orderedChannels.map(
      (category) => ({
        ...category,
        channels: category.channels.map((channel) => channel.id),
      }),
    );

    if (event.type === "categories") {
      props.server.edit({
        categories: event.ids
          .map((id) => normalisedCategories.find((cat) => cat.id === id)!)
          .filter((cat) => cat),
      });
    } else {
      props.server.edit({
        categories: normalisedCategories.map((category) => {
          if (heldEvent && category.id === heldEvent.id) {
            return { ...category, channels: heldEvent.channelIds };
          } else if (category.id === event.id) {
            return { ...category, channels: event.channelIds };
          } else {
            return category;
          }
        }),
      });
      heldEvent = null!;
    }
  }

  return (
    <Column gap="lg">
      <Text class={typography({ class: "title", size: "large" })}>
        Channel Management
      </Text>
      <Text class={typography({ class: "body", size: "medium" })}>
        Drag to reorder channels and categories. Changes save automatically.
      </Text>

      <Draggable
        dragHandles
        type="category"
        disabled={false}
        items={props.server.orderedChannels}
        onChange={(ids) => handleOrdering({ type: "categories", ids })}
      >
        {(entry) => (
          <CategoryBlock
            category={entry.item}
            dragDisabled={entry.dragDisabled}
            setDragDisabled={entry.setDragDisabled}
            handleOrdering={handleOrdering}
          />
        )}
      </Draggable>
    </Column>
  );
}

/**
 * A single draggable category block with its channel list inside
 */
function CategoryBlock(props: {
  category: CategoryData;
  dragDisabled: () => boolean;
  setDragDisabled: (v: boolean) => void;
  handleOrdering: (event: OrderingEvent) => void;
}) {
  const channels = createMemo(() => props.category.channels);

  return (
    <CategoryContainer>
      {/* Category header — drag handle */}
      <Show when={props.category.id !== "default"}>
        <CategoryHeader
          {...createDragHandle(props.dragDisabled, props.setDragDisabled)}
        >
          <Symbol size={16}>drag_indicator</Symbol>
          <TextWithEmoji content={props.category.title} />
        </CategoryHeader>
      </Show>

      {/* Channels inside this category */}
      <Draggable
        type="channels"
        items={channels()}
        onChange={(channelIds) => {
          const current = channels();
          props.handleOrdering({
            type: "category",
            id: props.category.id,
            channelIds,
            moved: channelIds.length !== current.length,
          });
        }}
        disabled={false}
        minimumDropAreaHeight="32px"
      >
        {(entry) => (
          <ChannelRow>
            <Symbol size={14} style={{ opacity: "0.5" }}>
              drag_indicator
            </Symbol>
            <Show
              when={entry.item.isVoice}
              fallback={<Symbol size={14}>grid_3x3</Symbol>}
            >
              <Symbol size={14}>headset_mic</Symbol>
            </Show>
            <ChannelName>
              <TextWithEmoji content={entry.item.name!} />
            </ChannelName>
          </ChannelRow>
        )}
      </Draggable>
    </CategoryContainer>
  );
}

const CategoryContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    borderRadius: "var(--borderRadius-md)",
    background: "var(--md-sys-color-surface-container)",
    padding: "var(--gap-sm)",
  },
});

const CategoryHeader = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-sm)",
    padding: "6px var(--gap-sm)",
    cursor: "grab",
    userSelect: "none",
    borderRadius: "var(--borderRadius-sm)",
    fontWeight: 600,
    fontSize: "12px",
    letterSpacing: "0.04em",
    color: "var(--md-sys-color-on-surface-variant)",
    "&:hover": {
      background: "var(--md-sys-color-surface-container-high)",
    },
  },
});

const ChannelRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-sm)",
    padding: "8px var(--gap-md)",
    borderRadius: "var(--borderRadius-sm)",
    cursor: "grab",
    userSelect: "none",
    color: "var(--md-sys-color-on-surface)",
    "&:hover": {
      background: "var(--md-sys-color-surface-container-high)",
    },
  },
});

const ChannelName = styled("span", {
  base: {
    flexGrow: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontSize: "14px",
  },
});
