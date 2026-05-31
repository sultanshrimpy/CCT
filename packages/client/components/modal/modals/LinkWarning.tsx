import { Match, Switch, createMemo, createSignal } from "solid-js";

import { styled } from "styled-system/jsx";

import { useState } from "@revolt/state";
import { Checkbox, Column, Dialog, DialogProps, Text } from "@revolt/ui";

import { Modals } from "../types";

/**
 * Modal to warn the user about a potentially unsafe link
 */
export function LinkWarningModal(
  props: DialogProps & Modals & { type: "link_warning" },
) {
  const state = useState();
  const [value, setValue] = createSignal(false);

  const scrutiny = createMemo(() => {
    const destUrlString = props.url.toString();
    if (destUrlString !== props.display) {
      try {
        const displayUrl = new URL(props.display);
        if (destUrlString !== displayUrl.toString()) {
          return 2;
        } else {
          return 1;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // URL parsing failed; the link is likely not intentionally misleading.
        return 1;
      }
    }

    return 0;
  });

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={"External links can be dangerous!"}
      actions={[{ text: "Close" }, {
          text: "Continue",
          onClick: () => {
            window.open(props.url, "_blank", "noopener");

            if (value() && scrutiny() === 0) {
              state.linkSafety.trust(props.url);
            }
          }, isDisabled: scrutiny() === 2 && !value(), },]}
    >
      <Column>
        <span>
          Are you sure you want to go to
          <Link>{props.url.toString()}</Link>?
        </span>
        <Switch
          fallback={
            <Checkbox checked={value()} onChange={() => setValue((v) => !v)}>
              <span>
                Don't ask me again for
                <Link>{props.url.origin}</Link>
              </span>
            </Checkbox>
          }
        >
          <Match when={scrutiny() === 1}>
            {"You clicked on "}{props.display}{"."}
          </Match>
          <Match when={scrutiny() === 2}>
            <Scrutinise>
              <Text>
                <strong>Be careful!</strong> <br /> This is not the same as the link that was displayed:
              </Text>
              <Link>{props.display}</Link>
              <Checkbox checked={value()} onChange={() => setValue((v) => !v)}>
                I understand the consequences
              </Checkbox>
            </Scrutinise>
          </Match>
        </Switch>
      </Column>
    </Dialog>
  );
}

const Link = styled("span", {
  base: {
    textDecoration: "underline",
    overflowWrap: "anywhere",
  },
});

const Scrutinise = styled("span", {
  base: {
    display: "flex",
    flexDirection: "column",
    color: "var(--md-sys-color-error)",
  },
});
