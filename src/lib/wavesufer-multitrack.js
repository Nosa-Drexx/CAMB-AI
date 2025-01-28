import MultiTrack from "wavesurfer-multitrack";
import { getRandomSolidColor } from "./random";

//initialize track
export const MultiTrackInitFn = (
  {
    multiTrackInit,
    setMultitrack = () => {},
    setIsReady = () => {},
    setPlayStatus = () => {},
    setTracks = () => {},
  },
  previousTracks = []
) => {
  if (multiTrackInit) {
    multiTrackInit?.destroy();
    setIsReady(false);
  }

  const multitrack = createMuiltiTrack(previousTracks);

  multitrack.once("canplay", async () => {
    setIsReady(true);
  });

  //play pause event
  multitrack.on("pause", () => setPlayStatus("paused"));
  multitrack.on("play", () => setPlayStatus("playing"));

  //voluem change event
  // multitrack.on("volume-change", ({ id, volume }) => {
  //   const tracks = multitrack?.tracks?.map((track) => {
  //     return track.id === id ? { ...track, volume } : track;
  //   });
  //   setTracks(tracks);
  //   console.log(`Track ${id} volume updated to ${volume}`);
  // });

  setMultitrack(multitrack);
};

//add audio track
export const addToMultiTrack = ({
  multitrack,
  url,
  setMultitrack = () => {},
  setIsReady = () => {},
  setPlayStatus = () => {},
  setTracks = () => {},
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!url) throw new Error(`No audio url found for ${url}`);

  const previousTrack = multitrack?.tracks?.filter(
    (track) => track?.id !== "placeholder" && track?.url
  );

  const randomColor = getRandomSolidColor();

  const newTrack = {
    id: 0,
    startPosition: 0,
    url,
    draggable: true,
    options: {
      waveColor: randomColor.mainColor,
      progressColor: randomColor.lightColor,
      label: "inti",
    },
    volume: 1,
  };

  previousTrack.push(newTrack);

  setTracks(previousTrack);

  //reintitalize multi-track with new track.
  MultiTrackInitFn(
    {
      multiTrackInit: multitrack,
      setMultitrack,
      setIsReady,
      setPlayStatus,
      setTracks,
    },
    previousTrack
  );
};

//remove track
export const removeFromMultiTrack = ({ multitrack, id }) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!id) throw new Error(`No track id found for ${id}`);

  multitrack.removeTrack(id);
};

//pause / play audio
export const playPauseMultiTrack = ({ multitrack, isReady }) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  //multitrack can play event

  if (isReady) multitrack.isPlaying() ? multitrack.pause() : multitrack.play();
};

//forward audio duration
export const forwardTimeBy = ({ multitrack, isReady }, forwardBy = 30) => {
  if (!multitrack) throw new Error(`No multitrack found`);

  if (isReady) multitrack.setTime(multitrack.getCurrentTime() + forwardBy);
};

//backward audio duration
export const backwardTimeBy = ({ multitrack, isReady }, backwardBy = 30) => {
  if (!multitrack) throw new Error(`No multitrack found`);

  if (isReady) multitrack.setTime(multitrack.getCurrentTime() - backwardBy);
};

//update individual track
export const updateVolume = ({
  multitrack,
  isReady,
  volume = 1,
  index = 0,
  multiTrackList,
  setTracks = () => {},
  updateState = true,
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  const multitrackTracks =
    multiTrackList ||
    multitrack?.tracks?.filter(
      (track) => track?.id !== "placeholder" && track?.url
    );

  if (!isReady) return;
  if (!multitrackTracks[index]) return;

  multitrack?.setTrackVolume(index, volume);

  if (!updateState) return;

  const tracks = multitrack?.tracks?.map((track) => {
    return track.id === id ? { ...track, volume } : track;
  });
};

//update all track
export const updateVolumeAll = ({
  multitrack,
  isReady,
  volume = 1,
  setTracks = () => {},
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);

  const multitrackTracks = multitrack?.tracks?.filter(
    (track) => track?.id !== "placeholder" && track?.url
  );

  multitrackTracks.forEach((element, index) => {
    updateVolume({
      multitrack,
      isReady,
      volume,
      index,
      multiTrackList: multitrackTracks,
      updateState: false,
      setTracks,
    });
  });

  const tracks = multitrack?.tracks?.map((track) => {
    return { ...track, volume };
  });

  setTracks(tracks);
};

export const zoomTrack = ({ multitrack, isReady, zoomBy = 10 }) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!isReady) return;
  multitrack.zoom(zoomBy);
};

//create multi track
const createMuiltiTrack = (track = []) => {
  const trackList = !track?.length ? [{ id: 0 }] : track;
  const multitrack = MultiTrack.create(trackList, {
    container: document.querySelector("#audio-pill-container"), // required!
    minPxPerSec: 10, // zoom level
    rightButtonDrag: false, // set to true to drag with right mouse button
    cursorWidth: 2,
    cursorColor: "#D72F21",
    trackBackground: "#2D2D2D",
    trackBorderColor: "#7C7C7C",
    dragBounds: true,
    envelopeOptions: {
      lineColor: "rgba(255, 0, 0, 0.7)",
      lineWidth: 4,
      dragPointSize: window.innerWidth < 600 ? 20 : 10,
      dragPointFill: "rgba(255, 255, 255, 0.8)",
      dragPointStroke: "rgba(255, 255, 255, 0.3)",
    },
  });

  return multitrack;
};

// Zoom
// const slider = document.querySelector('input[type="range"]');
// slider.oninput = () => {
//   multitrack.zoom(slider.valueAsNumber);
// };

// useEffect(() => {
//   if (isReady && multitrack) {
//     // Target the container where WaveSurfer creates its tracks
//     const trackContainer = document.querySelector("#audio-pill-container")
//       ?.children[0]?.children[0];
//     console.log(trackContainer, "track container");

//     if (trackContainer) {
//       Sortable.create(trackContainer, {
//         animation: 150,
//         direction: "vertical",
//         onEnd: function (evt) {
//           console.log(evt, "evt");
//           // const tracks = multitrack.getTracks();
//           // const movedTrack = tracks[evt.oldIndex];
//           // // Remove track from old position and insert at new position
//           // tracks.splice(evt.oldIndex, 1);
//           // tracks.splice(evt.newIndex, 0, movedTrack);
//           // // Update WaveSurfer's track order
//           // multitrack.reorder(tracks);
//         },
//       });
//     }
//   }
// }, [isReady, multitrack]);
