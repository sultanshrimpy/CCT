import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { AudioTrack } from "solid-livekit-components";

import {
  getTrackReferenceId,
  isLocal,
  trackReferencesObservable,
} from "@livekit/components-core";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import { Key } from "@solid-primitives/keyed";
import { RemoteTrackPublication, Track } from "livekit-client";

import { useState } from "@revolt/state";
import { useVoice } from "../state";

export function RoomAudioManager() {
  const voice = useVoice();
  const state = useState();

  const [trackReferences, setTrackReferences] = createSignal<TrackReferenceOrPlaceholder[]>([]);

  // Re-subscribe whenever the room signal changes
  createEffect(() => {
    const room = voice.room();
    if (!room) {
      setTrackReferences([]);
      return;
    }

    const subscription = trackReferencesObservable(
      room,
      [Track.Source.Microphone, Track.Source.ScreenShareAudio, Track.Source.Unknown],
      { onlySubscribed: true }
    ).subscribe(({ trackReferences: refs }) => {
      setTrackReferences(prev => {
        const prevIds = prev.map(t => getTrackReferenceId(t)).join(",");
        const nextIds = refs.map(t => getTrackReferenceId(t)).join(",");
        return prevIds === nextIds ? prev : refs;
      });
    });

    onCleanup(() => subscription.unsubscribe());
  });

  const filteredTracks = createMemo(() =>
    trackReferences().filter(
      (track) =>
        !isLocal(track.participant) &&
        track.publication.kind === Track.Kind.Audio,
    ),
  );

  createEffect(() => {
    const tracks = filteredTracks();
    console.info("[rtc] filtered tracks", tracks);
    for (const track of tracks) {
      (track.publication as RemoteTrackPublication).setSubscribed(true);
      console.info(track.publication);
    }
  });

  return (
    <div style={{ display: "none" }}>
      <Key each={filteredTracks()} by={(item) => getTrackReferenceId(item)}>
        {(track) => (
          <AudioTrack
            trackRef={track()}
            volume={
              state.voice.outputVolume *
              (track().source === Track.Source.ScreenShareAudio
                ? (state.voice.getScreenShareVolume(track().participant.identity) ?? 1)
                : (state.voice.getUserVolume(track().participant.identity) ?? 1))
            }
            muted={
              (track().source === Track.Source.ScreenShareAudio
                ? state.voice.getScreenShareMuted(track().participant.identity)
                : state.voice.getUserMuted(track().participant.identity)) ||
              voice.deafen()
            }
            enableBoosting
          />
        )}
      </Key>
    </div>
  );
}
