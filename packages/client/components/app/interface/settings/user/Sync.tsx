import { CategoryButton, Checkbox, Column, Time, iconSize } from "@revolt/ui";

import MdBrush from "@material-design-icons/svg/outlined/brush.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";
import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";

/**
 * Sync Configuration Page
 */
export default function Sync() {
  return (
    <Column gap="lg">
      <CategoryButton.Group>
        <CategoryButton
          action={<Checkbox checked onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<MdPalette {...iconSize(22)} />}
          description={
            "Sync appearance options, such as chosen emoji pack and message density."
          }
        >
          Appearance
        </CategoryButton>
        <CategoryButton
          action={<Checkbox checked onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<MdBrush {...iconSize(22)} />}
          description={
            "Sync your chosen theme, colours, and any custom CSS."
          }
        >
          Theme
        </CategoryButton>
        <CategoryButton
          action={<Checkbox checked onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<MdLanguage {...iconSize(22)} />}
          description={"Sync your currently chosen language."}
        >
          Language
        </CategoryButton>
      </CategoryButton.Group>
      <CategoryButton.Group>
        <CategoryButton>
          Last sync <Time format="relative" value={0} />
        </CategoryButton>
      </CategoryButton.Group>
    </Column>
  );
}
