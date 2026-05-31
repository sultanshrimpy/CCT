import { useVoice } from "@revolt/rtc";
import { useState } from "@revolt/state";
import { ScreenShareQualityName } from "@revolt/state/stores/Voice";
import {
  CategoryButton,
  CategorySelectOption,
  Checkbox,
  Column,
  Text,
} from "@revolt/ui";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

export function ScreenShareOptions() {
  const { voice } = useState();
  const voiceContext = useVoice();

  const qualities = voiceContext.getEnabledScreenShareQualities();

  return (
    <Column>
      <Text class="title">
        Screen Share Settings
      </Text>
      <CategoryButton.Group>
        <CategoryButton.Select
          icon={<Symbol>screen_share</Symbol>}
          title={"Select screen share quality"}
          options={
            Object.fromEntries(
              Object.keys(qualities).map((name) => [
                name,
                {
                  title: qualities[name as ScreenShareQualityName]!.fullName,
                },
              ]),
            ) as { [key in ScreenShareQualityName]: CategorySelectOption }
          }
          value={voice.screenShareQuality}
          onUpdate={(ns) => (voice.screenShareQuality = ns)}
        />
        <CategoryButton
          icon="blank"
          action={<Checkbox checked={voice.screenShareQualityAsk} />}
          onClick={() =>
            (voice.screenShareQualityAsk = !voice.screenShareQualityAsk)
          }
        >
          Always Ask for Screen Share Quality
        </CategoryButton>
      </CategoryButton.Group>
    </Column>
  );
}
