import { iconSize } from "@revolt/ui";

import MdArrowForward from "@material-design-icons/svg/filled/arrow_forward.svg?component-solid";

import { Ripple } from "../../../../components/design";

import { FloatingIndicator } from "./FloatingIndicator";

interface Props {
  /**
   * Jump back to present messages
   */
  onClick: () => void;
}

/**
 * Component indicating user can jump back to present messages
 */
export function JumpToBottom(props: Props) {
  return (
    <FloatingIndicator position="bottom" onClick={props.onClick}>
      <Ripple />
      <span style={{ "flex-grow": 1 }}>
        Viewing older messages
      </span>
      <span>
        Jump to present
      </span>
      <MdArrowForward {...iconSize(16)} />
    </FloatingIndicator>
  );
}
