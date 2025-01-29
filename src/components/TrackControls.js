"use client";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import { GripVertical } from "lucide-react";
import { reorderTrackList } from "@/lib/wavesufer-multitrack";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

const TrackControls = () => {
  const { state, dispatch } = useMultitrackContext();
  const multitrack = state.multitrack;
  const stateTracks = state.tracks;
  const containerRef = useRef(null);
  const [reOrderTrackElem, setReorderTrackElement] = useState([]);

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

  useEffect(() => {
    if (!reOrderTrackElem?.length) return;

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
            <button className="drag-handle mx-auto">
              <GripVertical
                size={32}
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
