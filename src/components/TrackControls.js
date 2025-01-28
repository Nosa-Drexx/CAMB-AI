import { useMultitrackContext } from "@/hooks/multitrack-hook";
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
import CustomVerticalRange from "./CustomVerticalRange";
import { removeFromMultiTrack, updateVolume } from "@/lib/wavesufer-multitrack";

const TrackControls = () => {
  const { state, dispatch } = useMultitrackContext();
  const isReady = state.isReady;
  const multitrack = state.multitrack;

  const tracks = state.tracks.filter((t) => {
    return t.id !== "placeholder";
  });

  const setTracks = (value) => {
    dispatch({ type: "SET_TRACKS", payload: value });
  };

  const setMultitrack = (value) => {
    dispatch({ type: "SET_MULTITRACK", payload: value });
  };

  const setIsReady = (value) => {
    dispatch({ type: "SET_IS_READY", payload: value });
  };

  const updateTrackVolume = (value, index) => {
    const rangeValue = value;
    updateVolume({
      multitrack,
      isReady,
      volume: rangeValue / 100,
      setTracks,
      index,
      updateState: true,
    });
  };

  const removeTrack = (id) => {
    removeFromMultiTrack({
      multitrack,
      id,
      setTracks,
      setMultitrack,
      setIsReady,
    });
  };
  console.log(tracks, "tracks");

  return (
    <>
      {tracks.map((t, index) => {
        const volume = t?.volume * 100;
        return (
          <div
            className="w-100 h-[130px] border-b-[2px] border-b-[#888] relative flex align-center px-2 justify-between"
            key={t?.id ?? index}
          >
            <div className="w-fit h-fit my-auto">
              <CustomVerticalRange
                value={volume}
                onRangeUpdate={(val) => updateTrackVolume(val, t?.id)}
                disabled={!isReady || !tracks?.length}
              >
                {volume < 1 ? (
                  <VolumeX
                    size={32}
                    color="white"
                    disabled={!isReady || !tracks?.length}
                    className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  />
                ) : volume < 50 ? (
                  <Volume1
                    size={32}
                    color="white"
                    disabled={!isReady || !tracks?.length}
                    className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  />
                ) : (
                  <Volume2
                    size={32}
                    color="white"
                    disabled={!isReady || !tracks?.length}
                    className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  />
                )}
              </CustomVerticalRange>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TrackControls;
