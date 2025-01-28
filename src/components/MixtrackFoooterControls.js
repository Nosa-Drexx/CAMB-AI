"use client";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import {
  backwardTimeBy,
  forwardTimeBy,
  playPauseMultiTrack,
  updateVolumeAll,
  zoomTrack,
} from "@/lib/wavesufer-multitrack";
import Image from "next/image";
import { useMemo, useState } from "react";
import CustomRange from "./CustomRange";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  ZoomIn,
  Volume2,
  VolumeX,
  Volume1,
} from "lucide-react";

const MixtrackFooterControls = () => {
  const { state, dispatch } = useMultitrackContext();
  const multitrack = state.multitrack;
  const isReady = state.isReady;
  const playStatus = state.playStatus;
  const stateTracks = state.tracks;

  const tracks = useMemo(
    () =>
      state.tracks.filter((track) => track?.id !== "placeholder" && track?.url),
    [state.tracks]
  );

  const [volume, setVolume] = useState(100);
  const [zoom, setZoom] = useState(50);

  const isPlaying = useMemo(() => playStatus === "playing", [playStatus]);

  const setTracks = (value) => {
    dispatch({ type: "SET_TRACKS", payload: value });
  };

  const setPlayStatus = (value) => {
    dispatch({ type: "SET_PLAY_STATUS", payload: value });
  };

  const updateVolume = (value) => {
    const rangeValue = value;
    updateVolumeAll({
      multitrack,
      isReady,
      volume: rangeValue / 100,
      setTracks,
    });
    setVolume(rangeValue);
  };
  const updateZoom = (value) => {
    const rangeValue = value;
    zoomTrack({ multitrack, isReady, zoomBy: rangeValue });
    setZoom(rangeValue);
  };

  return (
    <footer className="flex justify-between gap-4 fixed bottom-0 left-0 w-full glass-bg z-[1000] p-4 lg:p-6 text-[#9b5de5] font-bold">
      {/* Zoom */}
      <CustomRange
        value={zoom}
        onRangeUpdate={updateZoom}
        disabled={!isReady || !tracks?.length}
      >
        <ZoomIn
          size={32}
          color="black"
          disabled={!isReady || !tracks?.length}
          className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
        />
      </CustomRange>
      <div className="flex gap-3">
        {/* Back 30s */}
        <button
          className="disabled:cursor-not-allowed transition-transform duration-200 hover:scale-110"
          disabled={!isReady || !tracks?.length}
          onClick={() => backwardTimeBy({ multitrack, isReady })}
        >
          <Rewind size={32} color="black" />
        </button>

        {/* Play /Pause */}
        <button
          className="disabled:cursor-not-allowed transition-transform duration-200 hover:scale-110"
          disabled={!isReady || !tracks?.length}
          onClick={() =>
            playPauseMultiTrack({ multitrack, isReady, setPlayStatus })
          }
        >
          {!isPlaying ? (
            <Play size={32} color="black" />
          ) : (
            <Pause size={32} color="black" />
          )}
        </button>

        {/* Forward 30s */}
        <button
          className="disabled:cursor-not-allowed transition-transform duration-200 hover:scale-110"
          disabled={!isReady || !tracks?.length}
          onClick={() => forwardTimeBy({ multitrack, isReady })}
        >
          <FastForward size={32} color="black" />
        </button>
      </div>

      {/* Volume */}
      <CustomRange
        value={volume}
        onRangeUpdate={updateVolume}
        disabled={!isReady || !tracks?.length}
      >
        {volume < 1 ? (
          <VolumeX
            size={32}
            color="black"
            disabled={!isReady || !tracks?.length}
            className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
          />
        ) : volume < 50 ? (
          <Volume1
            size={32}
            color="black"
            disabled={!isReady || !tracks?.length}
            className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
          />
        ) : (
          <Volume2
            size={32}
            color="black"
            disabled={!isReady || !tracks?.length}
            className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
          />
        )}
      </CustomRange>
    </footer>
  );
};

export default MixtrackFooterControls;
