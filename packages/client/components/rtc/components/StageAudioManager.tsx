import { createEffect, createMemo, createSignal, onCleanup, Show } from "solid-js";
import { AudioTrack, RoomContext } from "solid-livekit-components";
import { getTrackReferenceId, isLocal, trackReferencesObservable } from "@livekit/components-core";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import { Key } from "@solid-primitives/keyed";
import { Track } from "livekit-client";
import { useState } from "@revolt/state";
import { useVoice } from "../state";

export function StageAudioManager() {
  const voice = useVoice();

  return (
    <Show when={voice.stageRoom()}>
      {(stageRoom) => (
        <RoomContext.Provider value={stageRoom()}>
          <StageAudioTracks />
        </RoomContext.Provider>
      )}
    </Show>
  );
}

function StageAudioTracks() {
  const state = useState();
  const voice = useVoice();

  const [trackReferences, setTrackReferences] = createSignal<TrackReferenceOrPlaceholder[]>([]);

  createEffect(() => {
    const room = voice.stageRoom();
    if (!room) {
      setTrackReferences([]);
      return;
    }

    const subscription = trackReferencesObservable(
      room,
      [Track.Source.Microphone, Track.Source.ScreenShareAudio, Track.Source.Unknown],
      { onlySubscribed: true }
    ).subscribe(({ trackReferences: refs }) => {
      setTrackReferences(refs);
    });

    onCleanup(() => subscription.unsubscribe());
  });

  const filteredTracks = createMemo(() =>
    trackReferences().filter(
      (track) =>
        !isLocal(track.participant) &&
        track.publication.kind === Track.Kind.Audio
    )
  );

  return (
    <div style={{ display: "none" }}>
      <Key each={filteredTracks()} by={(item) => getTrackReferenceId(item)}>
        {(track) => (
          <AudioTrack
            trackRef={track()}
            volume={() => state.voice.outputVolume}
            muted={false}
            enableBoosting
          />
        )}
      </Key>
    </div>
  );
}
