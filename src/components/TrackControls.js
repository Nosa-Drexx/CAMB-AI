"use client";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import { Trash, Volume2, VolumeX, Volume1, GripVertical } from "lucide-react";
import CustomRange from "./CustomRange";
import {
  removeFromMultiTrack,
  reorderTrackList,
  updateVolume,
} from "@/lib/wavesufer-multitrack";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

const TrackControls = () => {
  const { state, dispatch } = useMultitrackContext();
  const isReady = state.isReady;
  const multitrack = state.multitrack;
  const stateTracks = state.tracks;
  const containerRef = useRef(null);
  const [reOrderTrackElem, setReorderTrackElement] = useState([]);

  const tracks = stateTracks.filter((t) => {
    return t.id !== "placeholder";
  });

  useEffect(() => {
    if (containerRef.current) {
      const sortable = new Sortable(containerRef.current, {
        animation: 150, // Smooth animation
        handle: ".drag-handle", // Drag only by handle
        direction: "vertical",
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (oldIndex !== newIndex) {
            // Reorder tracks in state
            const updatedTracks = [...stateTracks];
            const [movedItem] = updatedTracks.splice(oldIndex, 1);
            updatedTracks.splice(newIndex, 0, movedItem);

            setReorderTrackElement(updatedTracks);
          }
        },
      });

      return () => sortable.destroy();
    }
  }, [stateTracks]);

  const setTracks = (value) => {
    dispatch({ type: "SET_TRACKS", payload: value });
  };

  const setMultitrack = (value) => {
    dispatch({ type: "SET_MULTITRACK", payload: value });
  };

  const setIsReady = (value) => {
    dispatch({ type: "SET_IS_READY", payload: value });
  };

  const setTrackStartPosition = (value) => {
    dispatch({ type: "TRACKS_START_POSITION_UPDATE", payload: value });
  };

  const updateTrackVolume = (value, index, t) => {
    const rangeValue = value;
    updateVolume({
      multitrack,
      isReady,
      volume: rangeValue / 100,
      setTracks,
      index,
      updateState: true,
      stateTrackList: state?.tracks,
    });
  };

  const removeTrack = (id) => {
    removeFromMultiTrack({
      multitrack,
      id,
      prevTracks: stateTracks,
      setTracks,
      setMultitrack,
      setIsReady,
      setTrackStartPosition,
    });
  };

  const handleDeleteTrack = (t) => {
    if (window.confirm("Are you sure you want to remove this track?"))
      removeTrack(t?.id);
  };

  useEffect(() => {
    if (!reOrderTrackElem?.length) return;

    console.log(reOrderTrackElem, "updated list");

    reorderTrackList({
      multitrack,
      newList: reOrderTrackElem,
      setTracks,
      setIsReady,
      setMultitrack,
      setTrackStartPosition,
    });
  }, [reOrderTrackElem]);

  return (
    <div ref={containerRef}>
      {stateTracks.map((t, index) => {
        const volume = t?.volume * 100;

        return (
          <div
            className="w-100 h-[130px] border-b-[2px] border-b-[#888] relative flex align-center px-2 justify-between bg-[#2d2d2d]"
            key={index}
            data-id={t?.id}
          >
            <div className="w-fit h-fit my-auto">
              <CustomRange
                value={volume}
                onRangeUpdate={(val) => updateTrackVolume(val, t?.id, t)}
                disabled={!isReady || !tracks?.length}
                topOrder="-10%"
                leftOrder="-200%"
              >
                {volume < 1 ? (
                  <VolumeX
                    size={24}
                    color="white"
                    disabled={!isReady || !tracks?.length}
                    className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  />
                ) : volume < 50 ? (
                  <Volume1
                    size={24}
                    color="white"
                    disabled={!isReady || !tracks?.length}
                    className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  />
                ) : (
                  <Volume2
                    size={24}
                    color="white"
                    disabled={!isReady || !tracks?.length}
                    className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  />
                )}
              </CustomRange>
            </div>
            <div className="w-fit h-fit my-auto">
              <button
                onClick={() => handleDeleteTrack(t)}
                disabled={!isReady || !tracks?.length}
              >
                <Trash
                  size={24}
                  color="white"
                  className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  disabled={!isReady || !tracks?.length}
                />
              </button>
            </div>
            <button className="drag-handle">
              <GripVertical
                size={24}
                color="gray"
                className="cursor-grab drag-handle"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TrackControls;
