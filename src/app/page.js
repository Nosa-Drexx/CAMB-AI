"use client";

import {
  addToMultiTrack,
  backwardTimeBy,
  forwardTimeBy,
  MultiTrackInitFn,
  playPauseMultiTrack,
} from "@/lib/wavesufer-multitrack";
import Sortable from "sortablejs";
import { useEffect, useMemo, useState } from "react";
import FileDrop from "@/components/FileDrop";

export default function Home() {
  const [multitrack, setMuiltiTrack] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [playStatus, setPlayStatus] = useState("none"); //none , playing, paused
  const [tracks, setTracks] = useState([]);

  const isPlaying = useMemo(() => playStatus === "playing"[playStatus]);
  const isPaused = useMemo(() => playStatus === "paused", [playStatus]);

  //initiallize multitrack
  useEffect(() => {
    MultiTrackInitFn({
      multiTrackInit: multitrack,
      setMuiltiTrack,
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
      setMuiltiTrack,
      setIsReady,
      setPlayStatus,
    });
  };

  return (
    <main>
      <div style={{ margin: "2em 0" }}>
        <button
          disabled={!isReady}
          onClick={() => playPauseMultiTrack({ multitrack, isReady })}
        >
          {!isPlaying ? "Play" : "Pause"}
        </button>
        <button
          disabled={!isReady}
          onClick={() => forwardTimeBy({ multitrack, isReady })}
        >
          Forward 30s
        </button>
        <button
          disabled={!isReady}
          onClick={() => backwardTimeBy({ multitrack, isReady })}
        >
          Back 30s
        </button>
      </div>
      <FileDrop
        onFilesAdded={(file) => {
          uploadAudioTrack(file[0]);
        }}
      />
      <section className="px-4 w-full">
        <div
          id="audio-pill-container"
          style={{
            background: "#2d2d2d",
            color: "#fff",
          }}
        ></div>
      </section>
    </main>
  );
}
