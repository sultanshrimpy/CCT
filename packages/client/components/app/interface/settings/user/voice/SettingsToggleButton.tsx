import { type JSX, Show } from "solid-js";

import { styled } from "styled-system/jsx";

interface SettingsToggleButtonProps {
  readonly checked: boolean;
  readonly children: JSX.Element;
  readonly description?: JSX.Element;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export function SettingsToggleButton(props: SettingsToggleButtonProps) {
  return (
    <ToggleButton
      type="button"
      data-checked={props.checked ? "true" : undefined}
      disabled={props.disabled}
      onClick={props.disabled ? undefined : props.onClick}
    >
      <Content>
        <Title>{props.children}</Title>
        <Show when={props.description}>
          <Description>{props.description}</Description>
        </Show>
      </Content>

      <Action>
        <CheckboxIcon data-checked={props.checked ? "true" : undefined}>
          <Show when={props.checked} fallback={<UncheckedIcon />}>
            <CheckedIcon />
          </Show>
        </CheckboxIcon>
      </Action>
    </ToggleButton>
  );
}

export const SettingsToggleGroup = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xs)",
  },
});

const ToggleButton = styled("button", {
  base: {
    position: "relative",
    width: "100%",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",

    appearance: "none",
    border: "1px solid var(--md-sys-color-outline-variant)",
    borderRadius: "var(--borderRadius-lg)",
    background: "var(--md-sys-color-surface-container-high)",

    color: "var(--md-sys-color-on-surface)",
    textAlign: "left",
    font: "inherit",
    cursor: "pointer",
    transition:
      "background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease, transform 0.12s ease",

    "&:hover:not(:disabled)": {
      background: "var(--md-sys-color-surface-container-highest)",
      borderColor: "var(--md-sys-color-outline)",
    },

    "&:active:not(:disabled)": {
      transform: "translateY(1px)",
    },

    "&:focus-visible": {
      outline: "2px solid var(--md-sys-color-primary)",
      outlineOffset: "2px",
    },

    "&[data-checked]": {
      background: "var(--md-sys-color-surface-container-highest)",
      borderColor: "var(--md-sys-color-primary)",
      boxShadow: "0 0 0 0.5px var(--md-sys-color-primary) inset",
    },

    "&:disabled": {
      opacity: "0.56",
      cursor: "not-allowed",
    },
  },
});

const Content = styled("div", {
  base: {
    minWidth: "0",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
});

const Title = styled("span", {
  base: {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.3",
    color: "var(--md-sys-color-on-surface)",
  },
});

const Description = styled("span", {
  base: {
    fontSize: "12px",
    lineHeight: "1.35",
    color: "var(--md-sys-color-on-surface-variant)",
    textWrap: "pretty",
  },
});

const Action = styled("div", {
  base: {
    width: "44px",
    minWidth: "44px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    lineHeight: 0,
  },
});

const CheckboxIcon = styled("div", {
  base: {
    width: "22px",
    height: "22px",
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    color: "var(--md-sys-color-on-surface-variant)",
    lineHeight: 0,
    transition: "color 0.12s ease",

    "&[data-checked]": {
      color: "var(--md-sys-color-primary)",
    },
  },
});

function CheckedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function UncheckedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </svg>
  );
}
