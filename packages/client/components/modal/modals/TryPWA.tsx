import { Dialog, DialogProps, iconSize } from "@revolt/ui";

import MdInfo from "@material-design-icons/svg/outlined/error.svg?component-solid";

import { useState } from "@revolt/state";
import { Modals } from "../types";

export function TryPWAModal(props: DialogProps & Modals & { type: "try_pwa" }) {
  const state = useState();

  return (
    <Dialog
      icon={<MdInfo {...iconSize(24)} />}
      show={props.show}
      onClose={() => {
        state.settings.setValue("pwa:shown", true);
        props.onClose();
      }}
      title={"Did you know?"}
      actions={[{ text: "Close" }, {
          text: "Install",
          onClick: () => {
            // @ts-expect-error PWA event not recognized
            if (state.pwaPrompt) state.pwaPrompt.prompt();
            else
              alert(
                "Sorry, your device doesn't support auto-install. Check your browser's menu for the 'Add to Home Screen' option.",
              );
          }, },]}
    >
      You can <b>install</b> this Web App on your devive for conveient access from the Home Screen, just like a real app. It even hides the huge menu bar! <br /> <br /> To install, tap the button below or open your browser's menu and choose <b> Add to Home Screen</b>.
    </Dialog>
  );
}
