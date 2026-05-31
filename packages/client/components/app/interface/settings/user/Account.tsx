import { Match, Show, Switch, createMemo, createSignal } from "solid-js";

import { useClient, useClientLifecycle } from "@revolt/client";
import {
  createMfaResource,
  createOwnProfileResource,
} from "@revolt/client/resources";
import { useModals } from "@revolt/modal";
import { CategoryButton, Column, Row, iconSize } from "@revolt/ui";

import MdAlternateEmail from "@material-design-icons/svg/outlined/alternate_email.svg?component-solid";
import MdBlock from "@material-design-icons/svg/outlined/block.svg?component-solid";
import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";
import MdLock from "@material-design-icons/svg/outlined/lock.svg?component-solid";
import MdMail from "@material-design-icons/svg/outlined/mail.svg?component-solid";
import MdPassword from "@material-design-icons/svg/outlined/password.svg?component-solid";
import MdVerifiedUser from "@material-design-icons/svg/outlined/verified_user.svg?component-solid";

import { useSettingsNavigation } from "../Settings";

import { UserSummary } from "./account/index";

/**
 * Account Page
 */
export function MyAccount() {
  const client = useClient();
  const profile = createOwnProfileResource();
  const { navigate } = useSettingsNavigation();

  return (
    <Column gap="lg">
      <UserSummary
        user={client().user!}
        bannerUrl={profile.data?.animatedBannerURL}
        onEdit={() => navigate("profile")}
        showBadges
      />
      <EditAccount />
      <MultiFactorAuth />
      <ManageAccount />
    </Column>
  );
}

/**
 * Edit account details
 */
function EditAccount() {
  const client = useClient();
  const { openModal } = useModals();
  const [email, setEmail] = createSignal("•••••••••••@•••••••••••");

  return (
    <CategoryButton.Group>
      <CategoryButton
        action="chevron"
        onClick={() =>
          openModal({
            type: "edit_username",
            client: client(),
          })
        }
        icon={<MdAlternateEmail {...iconSize(22)} />}
        description={client().user?.username}
      >
        Username
      </CategoryButton>
      <CategoryButton
        action="chevron"
        onClick={() =>
          openModal({
            type: "edit_email",
            client: client(),
          })
        }
        icon={<MdMail {...iconSize(22)} />}
        description={
          <Row>
            {email()}{" "}
            <Show when={email().startsWith("•")}>
              <a
                onClick={(event) => {
                  event.stopPropagation();
                  client().account.fetchEmail().then(setEmail);
                }}
              >
                Reveal
              </a>
            </Show>
          </Row>
        }
      >
        Email
      </CategoryButton>
      <CategoryButton
        action="chevron"
        onClick={() =>
          openModal({
            type: "edit_password",
            client: client(),
          })
        }
        icon={<MdPassword {...iconSize(22)} />}
        description={"•••••••••"}
      >
        Password
      </CategoryButton>
    </CategoryButton.Group>
  );
}

/**
 * Multi-factor authentication
 */
function MultiFactorAuth() {
  const client = useClient();
  const mfa = createMfaResource();
  const { openModal, mfaFlow, mfaEnableTOTP, showError } = useModals();

  /**
   * Show recovery codes
   */
  async function showRecoveryCodes() {
    const ticket = await mfaFlow(mfa.data!);

    ticket!.fetchRecoveryCodes().then((codes) =>
      openModal({
        type: "mfa_recovery",
        mfa: mfa.data!,
        codes,
      }),
    );
  }

  /**
   * Generate recovery codes
   */
  async function generateRecoveryCodes() {
    const ticket = await mfaFlow(mfa.data!);

    ticket!.generateRecoveryCodes().then((codes) =>
      openModal({
        type: "mfa_recovery",
        mfa: mfa.data!,
        codes,
      }),
    );
  }

  /**
   * Configure authenticator app
   */
  async function setupAuthenticatorApp() {
    const ticket = await mfaFlow(mfa.data!);
    const secret = await ticket!.generateAuthenticatorSecret();

    let success;
    while (!success) {
      try {
        const code = await mfaEnableTOTP(secret, client().user!.username);

        if (code) {
          await mfa.data!.enableAuthenticator(code);
          success = true;
        }
      } catch (err) {
        showError(err);
      }
    }
  }

  /**
   * Disable authenticator app
   */
  function disableAuthenticatorApp() {
    mfaFlow(mfa.data!).then((ticket) => ticket!.disableAuthenticator());
  }

  return (
    <CategoryButton.Group>
      <CategoryButton.Collapse
        icon={<MdVerifiedUser {...iconSize(22)} />}
        title={"Recovery Codes"}
        description={
          "Configure a way to get back into your account in case your 2FA is lost"
        }
      >
        <Switch
          fallback={
            <CategoryButton
              icon="blank"
              disabled={mfa.isLoading}
              onClick={generateRecoveryCodes}
              description={"Setup recovery codes"}
            >
              Generate Recovery Codes
            </CategoryButton>
          }
        >
          <Match when={!mfa.isLoading && mfa.data?.recoveryEnabled}>
            <CategoryButton
              icon="blank"
              description={"Get active recovery codes"}
              onClick={showRecoveryCodes}
            >
              View Recovery Codes
            </CategoryButton>
            <CategoryButton
              icon="blank"
              description={"Get a new set of recovery codes"}
              onClick={generateRecoveryCodes}
            >
              Reset Recovery Codes
            </CategoryButton>
          </Match>
        </Switch>
      </CategoryButton.Collapse>
      <CategoryButton.Collapse
        icon={<MdLock {...iconSize(22)} />}
        title={"Authenticator App"}
        description={"Configure one-time password authentication"}
      >
        <Switch
          fallback={
            <CategoryButton
              icon="blank"
              disabled={mfa.isLoading}
              onClick={setupAuthenticatorApp}
              description={"Setup one-time password authenticator"}
            >
              Enable Authenticator
            </CategoryButton>
          }
        >
          <Match when={!mfa.isLoading && mfa.data?.authenticatorEnabled}>
            <CategoryButton
              icon="blank"
              description={
                "Disable one-time password authenticator"
              }
              onClick={disableAuthenticatorApp}
            >
              Remove Authenticator
            </CategoryButton>
          </Match>
        </Switch>
      </CategoryButton.Collapse>
    </CategoryButton.Group>
  );
}

/**
 * Manage account
 */
function ManageAccount() {
  const client = useClient();
  const mfa = createMfaResource();
  const { mfaFlow } = useModals();
  const { logout } = useClientLifecycle();

  const stillOwnServers = createMemo(
    () =>
      client().servers.filter((server) => server.owner?.self || false).length >
      0,
  );

  /**
   * Disable account
   */
  function disableAccount() {
    mfaFlow(mfa.data!).then((ticket) =>
      ticket!.disableAccount().then(() => logout()),
    );
  }

  /**
   * Delete account
   */
  function deleteAccount() {
    mfaFlow(mfa.data!).then((ticket) =>
      ticket!.deleteAccount().then(() => logout()),
    );
  }

  return (
    <CategoryButton.Group>
      <CategoryButton
        action="chevron"
        disabled={mfa.isLoading}
        onClick={disableAccount}
        icon={<MdBlock {...iconSize(22)} fill="var(--md-sys-color-error)" />}
        description={
          "You won't be able to access your account unless you contact support - however, your data will not be deleted."
        }
      >
        Disable Account
      </CategoryButton>
      <CategoryButton
        action={stillOwnServers() ? undefined : "chevron"}
        disabled={mfa.isLoading || stillOwnServers()}
        onClick={deleteAccount}
        icon={<MdDelete {...iconSize(22)} fill="var(--md-sys-color-error)" />}
        description={
          "Your account and all of your data (including your messages and friends list) will be queued for deletion. A confirmation email will be sent - you can cancel this within 7 days by contacting support."
        }
      >
        <Switch fallback={"Delete Account"}>
          <Match when={stillOwnServers()}>
            Cannot delete account until servers are deleted or transferred
          </Match>
        </Switch>
      </CategoryButton>
    </CategoryButton.Group>
  );
}
