import { For } from "solid-js";

import { useClient } from "@revolt/client";
import { createOwnProfileResource } from "@revolt/client/resources";
import { useModals } from "@revolt/modal";
import { Avatar, CategoryButton, Column, Text, iconSize } from "@revolt/ui";

import MdGroups from "@material-design-icons/svg/outlined/groups.svg?component-solid";

import { UserSummary } from "../account/index";

import { UserProfileEditor } from "./UserProfileEditor";

/**
 * Edit profile
 */
export function EditProfile() {
  const client = useClient();
  const { openModal } = useModals();
  const profile = createOwnProfileResource();

  return (
    <Column gap="lg">
      <UserSummary
        user={client().user!}
        bannerUrl={profile.data?.animatedBannerURL}
      />

      <CategoryButton.Group>
        <CategoryButton.Collapse
          icon={<MdGroups {...iconSize(22)} />}
          title={"Server Identities"}
          description={"Change your profile per-server"}
          scrollable
        >
          <For each={client().servers.toList()}>
            {(server) => (
              <CategoryButton
                icon={
                  <Avatar
                    src={server.animatedIconURL}
                    size={24}
                    fallback={server.name}
                  />
                }
                onClick={() =>
                  openModal({
                    type: "server_identity",
                    member: server.member!,
                  })
                }
              >
                {server.name}
              </CategoryButton>
            )}
          </For>
        </CategoryButton.Collapse>
      </CategoryButton.Group>

      <Column>
        <Text class="title" size="large">
          Edit Global Profile
        </Text>
        <UserProfileEditor user={client().user!} />
      </Column>
    </Column>
  );
}
