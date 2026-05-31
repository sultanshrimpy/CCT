import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { Settings, SettingsConfigurations } from "@revolt/app";
import { DialogProps } from "@revolt/ui";

import { useState } from "@revolt/state";
import { SlideDrawer } from "@revolt/ui/components/navigation/SlideDrawer";
import { Modals } from "../types";

/**
 * Modal to display server information
 */
export function SettingsModal(
  props: DialogProps & Modals & { type: "settings" },
) {
  const { setDiagDrawer } = useState();
  // eslint-disable-next-line solid/reactivity
  const config = SettingsConfigurations[props.config];

  //Drawer slider for mobile
  let rootRef, sDrawer: SlideDrawer | null;
  const [contRef, setContRef] = createSignal<HTMLDivElement>();
  createEffect(
    on(contRef, (cont) => {
      if (!cont || sDrawer) return;
      sDrawer = new SlideDrawer(cont, rootRef!);
      setDiagDrawer(sDrawer);
    }),
  );
  onCleanup(() => {
    sDrawer?.delete();
    setDiagDrawer((sDrawer = null));
  });

  return (
    <Portal mount={document.getElementById("floating")!}>
      <div
        style={{
          "z-index": 100,
          position: "fixed",
          width: "100%",
          height: "100vh",
          left: 0,
          top: 0,
          "pointer-events": "none",
        }}
      >
          <Show when={props?.show}>
            <div
              ref={rootRef}
              class="settings_overlay"
            >
              <Settings
                onClose={props.onClose}
                render={config.render}
                title={config.title}
                list={config.list}
                context={props.context as never}
                contentRef={setContRef}
              />
            </div>
          </Show>
      </div>
    </Portal>
  );
}
