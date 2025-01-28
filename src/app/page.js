"use client";

import { addToMultiTrack, MultiTrackInitFn } from "@/lib/wavesufer-multitrack";
import { useEffect, useMemo, useState } from "react";
import FileDrop from "@/components/FileDrop";
import MixtrackFooterControls from "@/components/MixtrackFoooterControls";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import AnimatedContainer from "@/components/AnimatedContainer";
import TopNav from "@/components/TopNav";
import TrackControls from "@/components/TrackControls";

export default function Home() {
  const { state, dispatch } = useMultitrackContext();
  const multitrack = state.multitrack;
  const stateTracks = state.tracks;

  const setMultitrack = (value) => {
    dispatch({ type: "SET_MULTITRACK", payload: value });
  };

  const setIsReady = (value) => {
    dispatch({ type: "SET_IS_READY", payload: value });
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
      setTracks,
    });

    // Multitrack   clean up
    return () => {
      if (multitrack) multitrack?.destroy();
    };
  }, []);

  const uploadAudioTrack = async (file) => {
    const url = window.URL.createObjectURL(file);
    addToMultiTrack({
      multitrack,
      url,
      prevTracks: stateTracks,
      setMultitrack,
      setIsReady,
      setTracks,
    });
  };

  return (
    <main className="w-full multitrack-bg h-[100dvh] overflow-y-hidden">
      <AnimatedContainer>
        <TopNav />
        <section className="w-full max-w-[1200px] max-h-[100dvh] mx-auto h-full">
          <FileDrop
            onFilesAdded={(file) => {
              uploadAudioTrack(file[0]);
            }}
          />
          <section className="flex px-4 w-full overflow-y-auto ">
            <section
              className="w-full flex"
              style={{ maxWidth: "1200px", width: "calc(100% - 100px)" }}
            >
              <div
                id="audio-pill-container"
                className="w-full"
                style={{
                  background: "#2d2d2d",
                  color: "#fff",
                  maxHeight: "calc(100vh - 370px)",
                }}
              ></div>
            </section>
            <div
              style={{
                background: "#2d2d2d",
                color: "#fff",
                maxHeight: "calc(100vh - 370px)",
                width: "100px",
              }}
            >
              <TrackControls />
            </div>
          </section>

          <MixtrackFooterControls />
        </section>
      </AnimatedContainer>
    </main>
  );
}
