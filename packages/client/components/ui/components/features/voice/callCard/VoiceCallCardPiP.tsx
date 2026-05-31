import { Show } from "solid-js";
import {
  TrackLoop,
  TrackReference,
  useEnsureParticipant,
  useIsMuted,
  useIsSpeaking,
  useTrackRefContext,
  VideoTrack,
} from "solid-livekit-components";

import { createSignal, onCleanup } from "solid-js";
import { trackReferencesObservable } from "@livekit/components-core";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import { createEffect } from "solid-js";
import { Track } from "livekit-client";
import { styled } from "styled-system/jsx";

import { useUser } from "@revolt/markdown/users";
import { useVoice } from "@revolt/rtc";
import { Avatar } from "@revolt/ui/components/design";
import { Row } from "@revolt/ui/components/layout";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

import { VoiceCallCardActions } from "./VoiceCallCardActions";
import { VoiceCallCardStatus } from "./VoiceCallCardStatus";

export function VoiceCallCardPiP() {
  const voice = useVoice();
  const [audTracks, setAudTracks] = createSignal<TrackReferenceOrPlaceholder[]>([]);
  createEffect(() => {
    const room = voice.room();
    if (!room) { setAudTracks([]); return; }
    const sub = trackReferencesObservable(
      room,
      [Track.Source.Microphone],
      { onlySubscribed: false }
    ).subscribe(({ trackReferences }) => setAudTracks(trackReferences));
    onCleanup(() => sub.unsubscribe());
  });

  const hasFocusVideo = () => {
    const track = voice.focusTrack();
    if (!track) return false;

    return (
      track.source === Track.Source.ScreenShare ||
      !useIsMuted({
        participant: track.participant,
        source: Track.Source.Camera,
      })()
    );
  };

  return (
    <MiniCard>
      <VoiceCallCardStatus pip />
      <Show when={!hasFocusVideo()} fallback={<MiniVideoTile />}>
        <Row align justify grow wrap>
          <TrackLoop tracks={audTracks()}>{() => <ConnectedUser />}</TrackLoop>
        </Row>
      </Show>
      <VoiceCallCardActions size="xs" />
    </MiniCard>
  );
}

function ConnectedUser() {
  const participant = useEnsureParticipant();

  const isMuted = useIsMuted({
    participant,
    source: Track.Source.Microphone,
  });

  const isSpeaking = useIsSpeaking(participant);
  const user = useUser(participant.identity);

  return (
    <UserIcon speaking={isSpeaking()}>
      <Avatar
        size={24}
        src={user().avatar}
        fallback={user().username}
        shape="square"
      />
      <Show when={isMuted()}>
        <Symbol background="rgba(0,0,0,.5)">mic_off</Symbol>
      </Show>
    </UserIcon>
  );
}

function MiniVideoTile() {
  const voice = useVoice();

  return (
    <TrackLoop tracks={() => [voice.focusTrack()!]}>
      {() => <MiniVideo />}
    </TrackLoop>
  );
}

function MiniVideo() {
  const track = useTrackRefContext();

  return (
    <VideoTrack
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        "border-radius": "inherit",
        "object-fit": "cover",
        overflow: "hidden",
      }}
      trackRef={track as TrackReference}
      manageSubscription={true}
    />
  );
}

const UserIcon = styled("div", {
  base: {
    display: "grid",
    width: "24px",
    height: "24px",
    color: "#fffb",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-circle)",

    "& *": {
      gridArea: "1/1",
    },
  },
  variants: {
    speaking: {
      true: {
        "& svg": {
          outlineOffset: "1px",
          outline: "2px solid var(--md-sys-color-primary)",
          borderRadius: "var(--borderRadius-circle)",
        },
      },
    },
  },
});

const MiniCard = styled("div", {
  base: {
    userSelect: "none",

    pointerEvents: "all",
    width: "100%",
    height: "100%",

    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "end",

    gap: "var(--gap-md)",
    padding: "var(--gap-md)",

    borderRadius: "var(--borderRadius-lg)",
    background: "var(--md-sys-color-secondary-container)",
  },
});
