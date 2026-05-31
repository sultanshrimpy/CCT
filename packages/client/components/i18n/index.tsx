import type { JSX } from "solid-js";
import { initTime } from "./dayjs";

// Initialize dayjs locale on load
initTime();

export function I18nProvider(props: { children: JSX.Element }) {
  return <>{props.children}</>;
}

export { Language, Languages } from "./Languages";
export { timeLocale, useTime } from "./dayjs";
export { useError } from "./errors";

export async function loadAndSwitchLocale() {
  // No-op: translations removed
}

export function browserPreferredLanguage() {
  return "en";
}

export function initI18n() {
  // No-op: translations removed
}
