import { Show } from "solid-js";

import { useNotifications } from "@revolt/client";
import { useState } from "@revolt/state";
import { CategoryButton, Checkbox, iconSize } from "@revolt/ui";

import MdMarkUnreadChatAlt from "@material-design-icons/svg/outlined/mark_unread_chat_alt.svg?component-solid";
import MdNotifications from "@material-design-icons/svg/outlined/notifications.svg?component-solid";
import MdSpeaker from "@material-design-icons/svg/outlined/speaker.svg?component-solid";

/**
 * Notifications Page
 */
export default function Notifications(props: { isDesktop: boolean }) {
  const { settings } = useState();

  const { toggleNotificationPermission, togglePushPermission } =
    useNotifications();

  return (
    <CategoryButton.Group>
      <Show when={settings.desktopNotificationsState !== "unsupported"}>
        <CategoryButton
          action={
            <Checkbox
              checked={settings.desktopNotificationsState === "allowed"}
            />
          }
          onClick={() => toggleNotificationPermission(true)}
          icon={<MdNotifications {...iconSize(22)} />}
          description={
            props.isDesktop ? (
              "Receive notifications while the app is open and in the background."
            ) : (
              "Receive notifications while the tab is open."
            )
          }
        >
          Enable Desktop Notifications
        </CategoryButton>
      </Show>
      <Show when={!props.isDesktop}>
        <CategoryButton
          action={
            <Checkbox checked={settings.pushNotificationsState === "allowed"} />
          }
          onClick={() => togglePushPermission(true)}
          icon={<MdMarkUnreadChatAlt {...iconSize(22)} />}
          description={
            "Receive push notifications while the app is closed."
          }
        >
          Enable Push Notifications
        </CategoryButton>
      </Show>

      {/* This is not shown because it is disabled, but it is not commented out so that lingui will still process it. */}
      <Show when={false}>
        <CategoryButton.Collapse
          title={"Sounds"}
          icon={<MdSpeaker {...iconSize(22)} />}
        >
          <CategoryButton
            action={<Checkbox checked onChange={(value) => void value} />}
            onClick={() => void 0}
            icon="blank"
          >
            Message Received
          </CategoryButton>
          <CategoryButton
            action={<Checkbox onChange={(value) => void value} />}
            onClick={() => void 0}
            icon="blank"
          >
            Message Sent
          </CategoryButton>
          <CategoryButton
            action={<Checkbox checked onChange={(value) => void value} />}
            onClick={() => void 0}
            icon="blank"
          >
            User Joined Call
          </CategoryButton>
          <CategoryButton
            action={<Checkbox checked onChange={(value) => void value} />}
            onClick={() => void 0}
            icon="blank"
          >
            User Left Call
          </CategoryButton>
        </CategoryButton.Collapse>
      </Show>
    </CategoryButton.Group>
  );
}
