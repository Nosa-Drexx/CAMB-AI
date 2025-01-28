"use client";

import { addToMultiTrack, MultiTrackInitFn } from "@/lib/wavesufer-multitrack";
import Sortable from "sortablejs";
import { useEffect, useMemo, useState } from "react";
import FileDrop from "@/components/FileDrop";
import MixtrackFooterControls from "@/components/MixtrackFoooterControls";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import AnimatedContainer from "@/components/AnimatedContainer";
import ReactDOM from "react-dom";
import TopNav from "@/components/TopNav";

export default function Home() {
  const { state, dispatch } = useMultitrackContext();
  const multitrack = state.multitrack;

  const tracks = state.tracks;

  const setMultitrack = (value) => {
    dispatch({ type: "SET_MULTITRACK", payload: value });
  };

  const setIsReady = (value) => {
    dispatch({ type: "SET_IS_READY", payload: value });
  };

  const setPlayStatus = (value) => {
    dispatch({ type: "SET_PLAY_STATUS", payload: value });
  };

  const setTracks = (value) => {
    dispatch({ type: "SET_TRACKS", payload: value });
  };

  //initiallize multitrack
  useEffect(() => {
    MultiTrackInitFn({
      multiTrackInit: multitrack,
      setMultitrack,
      setIsReady,
      setPlayStatus,
    });

    // This should be called before calling initMultiTrack again to properly clean up
    return () => {
      if (multitrack) multitrack?.destroy();
    };
  }, []);

  const uploadAudioTrack = async (file) => {
    const url = window.URL.createObjectURL(file);
    addToMultiTrack({
      multitrack,
      url,
      setMultitrack,
      setIsReady,
      setPlayStatus,
    });
  };

  useEffect(() => {});

  return (
    <main className="w-full multitrack-bg h-[100dvh]">
      <AnimatedContainer>
        <TopNav />
        <section className="w-full max-w-[1200px] mx-auto h-full">
          <FileDrop
            onFilesAdded={(file) => {
              uploadAudioTrack(file[0]);
            }}
          />
          <section className="px-4 w-full">
            <div
              id="audio-pill-container"
              className="overflow-y-auto"
              style={{
                background: "#2d2d2d",
                color: "#fff",
                maxHeight: "calc(100vh - 356px)",
              }}
            ></div>
          </section>

          <MixtrackFooterControls />
        </section>
      </AnimatedContainer>
    </main>
  );
}
