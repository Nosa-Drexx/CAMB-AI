"use client";

import {
  addToMultiTrack,
  backwardTimeBy,
  forwardTimeBy,
  MultiTrackInitFn,
  playPauseMultiTrack,
} from "@/lib/wavesufer-multitrack";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [multitrack, setMuiltiTrack] = useState(null);
  const [dropEventTrigger, setDropEventTrigger] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [playStatus, setPlayStatus] = useState("none"); //none , playing, paused

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

  //drop event triggered
  useEffect(() => {
    if (dropEventTrigger) {
      // addToMultiTrack({ multitrack, url, id });
    }
  }, [dropEventTrigger]);

  const uploadAudioTrack = async (e) => {
    const file = e.target.files[0];
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
        {/* <button className="text-center"> */}
        <input
          id="file_upload"
          name="file_upload"
          type="file"
          className="visually-hidden"
          accept="audio/wav, audio/mp3, audio/aac, audio/x-m4a, audio/flac, audio/ogg"
          onChange={uploadAudioTrack}
        />
        Upload audio track
        {/* </button> */}
      </div>

      <div
        id="audio-pill-container"
        style={{ background: "#2d2d2d", color: "#fff" }}
      ></div>
    </main>
  );
}
