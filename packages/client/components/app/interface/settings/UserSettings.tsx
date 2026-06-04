import { Show } from "solid-js";

import { Server } from "stoat.js";
import { css } from "styled-system/css";

import { useClient, useClientLifecycle } from "@revolt/client";
import { CONFIGURATION } from "@revolt/common";
import { useUser } from "@revolt/markdown/users";
import { useModals } from "@revolt/modal";
import { fetchLatestChangelog } from "@revolt/modal/modals/Changelog";
import { ColouredText, Column, Text, iconSize } from "@revolt/ui";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

import MdAccountCircle from "@material-design-icons/svg/outlined/account_circle.svg?component-solid";
import MdCampaign from "@material-design-icons/svg/outlined/campaign.svg?component-solid";
import MdLogout from "@material-design-icons/svg/outlined/logout.svg?component-solid";
import MdMemory from "@material-design-icons/svg/outlined/memory.svg?component-solid";
import MdMic from "@material-design-icons/svg/outlined/mic.svg?component-solid";
import MdNotifications from "@material-design-icons/svg/outlined/notifications.svg?component-solid";
import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import MdScience from "@material-design-icons/svg/outlined/science.svg?component-solid";
import MdSmartToy from "@material-design-icons/svg/outlined/smart_toy.svg?component-solid";
import MdVerifiedUser from "@material-design-icons/svg/outlined/verified_user.svg?component-solid";
import MdWorkspacePremium from "@material-design-icons/svg/outlined/workspace_premium.svg?component-solid";

import pkg from "../../../../../../package.json";

import { SettingsConfiguration } from ".";
import { MyAccount } from "./user/Account";
import AdvancedSettings from "./user/Advanced";
import { LanguageSettings } from "./user/Language";
import Native from "./user/Native";
import Notifications from "./user/Notifications";
import { Sessions } from "./user/Sessions";
import { AccountCard, BackCard } from "./user/_AccountCard";
import { AppearanceMenu } from "./user/appearance";
import { MyBots, ViewBot } from "./user/bots";
import { EditProfile } from "./user/profile";
import { EditSubscription } from "./user/subscriptions";
import { VoiceSettings } from "./user/voice/VoiceSettings";

const Config: SettingsConfiguration<{ server: Server }> = {
  /**
   * Page titles
   * @param key
   */
  title(ctx, key) {
    if (key.startsWith("bots/")) {
      const user = useUser(key.substring(5));
      return user()!.username;
    }

    return ctx.entries
      .flatMap((category) => category.entries)
      .find((entry) => entry.id === key)?.title as string;
  },

  /**
   * Render the current client settings page
   */
  // we take care of the reactivity ourselves
  /* eslint-disable solid/reactivity */
  /* eslint-disable solid/components-return-once */
  render(props) {
    const id = props.page();
    const client = useClient();

    if (id?.startsWith("bots/")) {
      const bot = client().bots.get(id.substring("bots/".length))!;
      return <ViewBot bot={bot!} />;
    }

    switch (id) {
      case "account":
        return <MyAccount />;
      case "appearance":
        return <AppearanceMenu />;
      case "advanced":
        return <AdvancedSettings />;
      case "profile":
        return <EditProfile />;
      case "sessions":
        return <Sessions />;
      case "bots":
        return <MyBots />;
      case "language":
        return <LanguageSettings />;
      case "subscribe":
        return <EditSubscription />;
      case "native":
        return <Native />;
      case "voice":
        return <VoiceSettings />;
      case "notifications":
        return <Notifications isDesktop={!!window.native} />;
      default:
        return null;
    }
  },
  /* eslint-enable solid/reactivity */
  /* eslint-enable solid/components-return-once */

  /**
   * Generate list of categories / entries for client settings
   * @returns List
   */
  list(_, onClose) {
    const { pop, openModal } = useModals();
    const { logout } = useClientLifecycle();

    return {
      context: null!,
      prepend: (
        <Column gap="s">
          <BackCard onClose={onClose} />
          <AccountCard />
          <div />
        </Column>
      ),
      append: (
        <Column gap="none">
          <Text class="label">
            <span class={css({ userSelect: "none", fontWeight: "bold" })}>
              Version:
            </span>{" "}
            <span class={css({ userSelect: "all" })}>{pkg.version}</span>
          </Text>
          <Show when={window.native}>
            <Text class="label">
              Stoat for Desktop {window.native.versions.desktop()}
            </Text>
            <Text class="label">
              <span
                class={css({
                  fontSize: "0.8em",
                  lineHeight: "0.8em",
                  opacity: "0.5",
                })}
              >
                {window.native.versions.electron()},{" "}
                {window.native.versions.node()},{" "}
                {window.native.versions.chrome()}
              </span>
            </Text>
          </Show>
        </Column>
      ),
      entries: [
        {
          title: "User Settings",
          entries: [
            {
              id: "account",
              icon: <></>,
              title: <></>,
              hidden: true,
            },
            {
              id: "profile",
              icon: <MdAccountCircle {...iconSize(20)} />,
              title: "Profile",
            },
            {
              id: "sessions",
              icon: <MdVerifiedUser {...iconSize(20)} />,
              title: "Sessions",
            },
          ],
        },
        {
          title: "CCT",
          entries: [
            {
              id: "bots",
              icon: <MdSmartToy {...iconSize(20)} />,
              title: "My Bots",
            },
          ],
        },
        {
          title: "Subscriptions",
          hidden: import.meta.env.PROD,
          entries: [
            {
              id: "subscribe",
              icon: <MdWorkspacePremium {...iconSize(20)} />,
              title: "[premium]",
            },
          ],
        },
        {
          title: "Client Settings",
          entries: [
            // {
            //   id: "audio",
            //   icon: <MdSpeaker {...iconSize(20)} />,
            //   title: t("app.settings.pages.audio.title"),
            //   hidden:
            //     !getController("state").experiments.isEnabled("voice_chat"),
            // },
            {
              id: "voice",
              icon: <MdMic {...iconSize(20)} />,
              title: CONFIGURATION.ENABLE_VIDEO ? (
                "Voice & Video"
              ) : (
                "Voice"
              ),
            },
            {
              id: "appearance",
              icon: <MdPalette {...iconSize(20)} />,
              title: "Appearance",
            },
            // {
            //   id: "accessibility",
            //   icon: <MdAccessibility {...iconSize(20)} />,
            //   title: t("app.settings.pages.accessibility.title"),
            // },
            // {
            //   id: "plugins",
            //   icon: <MdExtension {...iconSize(20)} />,
            //   title: t("app.settings.pages.plugins.title"),
            //   hidden: !getController("state").experiments.isEnabled("plugins"),
            // },
            {
              id: "notifications",
              icon: <MdNotifications {...iconSize(20)} />,
              title: "Notifications",
            },
            // {
            //   id: "keybinds",
            //   icon: <MdKeybinds {...iconSize(20)} />,
            //   title: t("app.settings.pages.keybinds.title"),
            // },

            // {
            //   id: "sync",
            //   icon: <MdSync {...iconSize(20)} />,
            //   title: t("app.settings.pages.sync.title"),
            // },
            {
              id: "native",
              hidden: !window.native,
              icon: <Symbol size={20}>desktop_windows</Symbol>,
              title: "Desktop",
            },
            // {
            //   id: "experiments",
            //   icon: <MdScience {...iconSize(20)} />,
            //   title: Experiments,
            // },
          ],
        },

        {
          entries: [
            {
              onClick: async () => {
                const changelog = await fetchLatestChangelog();
                if (!changelog) return;
                openModal({ type: "changelog", changelog });
              },
              icon: <MdCampaign {...iconSize(20)} />,
              title: "What's New",
            },
            {
              href: "https://github.com/stoatchat",
              icon: <MdMemory {...iconSize(20)} />,
              title: "Source Code",
            },
            {
              id: "advanced",
              icon: <MdScience {...iconSize(20)} />,
              title: "Advanced",
            },
            {
              id: "logout",
              icon: (
                <MdLogout {...iconSize(20)} fill="var(--md-sys-color-error)" />
              ),
              title: (
                <ColouredText colour="var(--md-sys-color-error)">
                  Log Out
                </ColouredText>
              ),
              onClick() {
                pop();
                logout();
              },
            },
          ],
        },
      ],
    };
  },
};

export default Config;
