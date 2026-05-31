import {
  type JSX,
  Accessor,
  ErrorBoundary,
  createContext,
  createMemo,
  createSignal,
  Setter,
  untrack,
  useContext,
} from "solid-js";

import { Rerun } from "@solid-primitives/keyed";

import { SettingsConfiguration, SettingsEntry, SettingsList } from ".";
import { SettingsContent } from "./_layout/Content";
import { SettingsSidebar } from "./_layout/Sidebar";

export interface SettingsProps {
  /**
   * Close settings
   */
  onClose?: () => void;

  /**
   * Settings context
   */
  context: never;

  contentRef: Setter<HTMLDivElement | undefined>;
}

/**
 * Transition animation
 */
export type SettingsTransition = "normal" | "to-child" | "to-parent";

/**
 * Provide navigation to child components
 */
const SettingsNavigationContext = createContext<{
  page: Accessor<string | undefined>;
  navigate: (path: string | SettingsEntry) => void;
}>();

/**
 * Generic Settings component
 */
export function Settings(props: SettingsProps & SettingsConfiguration<never>) {
  const [page, setPage] = createSignal<undefined | string>(
    // eslint-disable-next-line
    (props.context as any)?.page,
  );
  const [transition, setTransition] =
    createSignal<SettingsTransition>("normal");

  /**
   * Navigate to a certain page
   */
  function navigate(entry: string | SettingsEntry) {
    let id;
    if (typeof entry === "object") {
      if (entry.onClick) {
        entry.onClick();
      } else if (entry.href) {
        window.open(entry.href, "_blank");
      } else if (entry.id) {
        id = entry.id;
      }
    } else {
      id = entry;
    }

    if (!id) return;

    const current = page();
    if (current?.startsWith(id)) {
      setTransition("to-parent");
    } else if (current && id.startsWith(current)) {
      setTransition("to-child");
    } else {
      setTransition("normal");
    }

    setPage(id);
  }

  return (
    <SettingsNavigationContext.Provider
      value={{
        page,
        navigate,
      }}
    >
      <MemoisedList
        context={props.context}
        list={props.list}
        onClose={props.onClose}
      >
        {(list) => (
          <>
            <SettingsSidebar list={list} page={page} setPage={setPage} />
            <SettingsContent
              ref={props.contentRef}
              page={page}
              list={list}
              title={props.title}
              onClose={props.onClose}
            >
              <Rerun on={page}>
                <ErrorBoundary fallback={(err, reset) => (
                  <div style={{ padding: "20px", color: "red" }}>
                    <strong>Settings page error:</strong>
                    <pre style={{ "font-size": "12px", "white-space": "pre-wrap" }}>
                      {err?.message ?? String(err)}
                    </pre>
                    <button onClick={reset}>Retry</button>
                  </div>
                )}>
                  <div>
                    {props.render({ page }, props.context)}
                  </div>
                </ErrorBoundary>
              </Rerun>
            </SettingsContent>
          </>
        )}
      </MemoisedList>
    </SettingsNavigationContext.Provider>
  );
}

/**
 * Memoise the list but generate it within context
 */
function MemoisedList(props: {
  context: never;
  onClose?: () => void;
  list: (context: never, onClose?: () => void) => SettingsList<unknown>;
  children: (list: Accessor<SettingsList<unknown>>) => JSX.Element;
}) {
  /**
   * Generate list of categories / links
   */
  const list = createMemo(() => props.list(props.context, props.onClose));
  return <>{props.children(list)}</>;
}

/**
 * Use settings navigation context
 */
export const useSettingsNavigation = () =>
  useContext(SettingsNavigationContext)!;
