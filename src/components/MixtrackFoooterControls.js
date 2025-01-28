"use client";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import {
  backwardTimeBy,
  forwardTimeBy,
  playPauseMultiTrack,
  updateVolumeAll,
} from "@/lib/wavesufer-multitrack";
import Image from "next/image";
import { useMemo, useState } from "react";

const MixtrackFooterControls = () => {
  const { state, dispatch } = useMultitrackContext();
  const multitrack = state.multitrack;
  const isReady = state.isReady;
  const playStatus = state.playStatus;

  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const isPlaying = useMemo(() => playStatus === "playing"[playStatus]);
  const isPaused = useMemo(() => playStatus === "paused", [playStatus]);

  const updateVolume = (event) => {
    const rangeValue = event.target.valueAsNumber;
    // const player = playerRef.current.audio.current;
    // player.volume = rangeValue / 100;
    updateVolumeAll({ multitrack, isReady, volume: rangeValue / 100 });
    setVolume(rangeValue);
  };

  return (
    <footer className="flex justify-between gap-4 fixed bottom-0 left-0 w-full glass-bg z-[1000] p-4 lg:p-6 text-[#9b5de5] font-bold">
      <div></div>
      <div className="flex gap-3">
        {/* Back 30s */}
        <button
          disabled={!isReady}
          onClick={() => backwardTimeBy({ multitrack, isReady })}
        >
          Back 30s
        </button>

        {/* Play /Pause */}
        <button
          disabled={!isReady}
          onClick={() => playPauseMultiTrack({ multitrack, isReady })}
        >
          {!isPlaying ? "Play" : "Pause"}
        </button>

        {/* Forward 30s */}
        <button
          disabled={!isReady}
          onClick={() => forwardTimeBy({ multitrack, isReady })}
        >
          Forward 30s
        </button>
      </div>

      {/* Zoom */}
      <div className="relative">
        <Image
          width={22}
          height={22}
          src={`/assets/icons/volume-icon-white.svg`}
          onMouseLeave={() => setShowVolume(false)}
          onMouseEnter={() => setShowVolume(true)}
          className="transition-transform duration-200 hover:scale-110"
          alt="audio-icons"
        />
        {showVolume ? (
          <div
            className="flex p-2 transform -rotate-90 rounded bg-black absolute"
            style={{ left: "-220%", top: "-200%" }}
            onMouseOver={() => setShowVolume(true)}
            onMouseOut={() => setShowVolume(false)}
          >
            <input
              type={"range"}
              min="0"
              max="100"
              value={volume}
              onChange={updateVolume}
              className="accent-[#5b33ab] cursor-pointer w-[100px] m-auto"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </footer>
  );
};

export default MixtrackFooterControls;
