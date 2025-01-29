import MultiTrack from "wavesurfer-multitrack";
import { getRandomSolidColor } from "./random";

//initialize track
export const MultiTrackInitFn = (
  {
    multiTrackInit,
    setMultitrack = () => {},
    setIsReady = () => {},
    setTrackStartPosition = () => {},
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

  multitrack.on("start-position-change", async (value) => {
    setTrackStartPosition(value);
  });

  //udate trrack volume if previous track exist
  previousTracks.forEach((track) => {
    updateVolume({
      multitrack,
      isReady: true,
      volume: track?.volume,
      index: track?.id,
    });
  });

  setMultitrack(multitrack);
};

//add audio track
export const addToMultiTrack = ({
  multitrack,
  url,
  prevTracks,
  setMultitrack = () => {},
  setIsReady = () => {},
  setTracks = () => {},
  setTrackStartPosition = () => {},
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!url) throw new Error(`No audio url found for ${url}`);

  const previousTrack = (prevTracks || multitrack?.tracks)?.filter(
    (track) => track?.id !== "placeholder" && track?.url
  );

  const randomColor = getRandomSolidColor();

  const newTrack = {
    id: previousTrack?.length || 0,
    startPosition: 0,
    url,
    draggable: true,
    options: {
      waveColor: randomColor.mainColor,
      progressColor: randomColor.lightColor,
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
      setTrackStartPosition,
    },
    previousTrack
  );
};

//remove track
export const removeFromMultiTrack = ({
  multitrack,
  id,
  prevTracks,
  setTracks = () => {},
  setMultitrack = () => {},
  setIsReady = () => {},
  setTrackStartPosition = () => {},
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (typeof id !== "number") throw new Error(`No track id found for ${id}`);

  const filteredTracks = (prevTracks || multitrack?.tracks)?.filter(
    (track) => track?.id !== "placeholder" && track?.url && track?.id !== id
  );

  setTracks(filteredTracks);

  //reintitalize multi-track without removed track.
  MultiTrackInitFn(
    {
      multiTrackInit: multitrack,
      setMultitrack,
      setIsReady,
      setTrackStartPosition,
    },
    filteredTracks
  );
};

//pause / play audio
export const playPauseMultiTrack = ({
  multitrack,
  isReady,
  setPlayStatus = () => {},
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  //multitrack can play event

  if (!isReady) return;

  const isPlaying = multitrack.isPlaying();
  isPlaying ? setPlayStatus("paused") : setPlayStatus("playing");
  isPlaying ? multitrack.pause() : multitrack.play();
};

//forward audio duration
export const forwardTimeBy = ({ multitrack, isReady }, forwardBy = 30) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  const updateSeek = Math.min(
    multitrack.getCurrentTime() + forwardBy,
    multitrack.maxDuration
  );
  if (isReady) multitrack.setTime(updateSeek);
};

//backward audio duration
export const backwardTimeBy = ({ multitrack, isReady }, backwardBy = 30) => {
  if (!multitrack) throw new Error(`No multitrack found`);

  const updateSeek = Math.min(multitrack.getCurrentTime() + backwardBy, 0);

  if (isReady) multitrack.setTime(updateSeek);
};

//update individual track
export const updateVolume = ({
  multitrack,
  isReady,
  volume = 1,
  index = 0,
  multiTrackList,
  stateTrackList,
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

  if (!updateState || !stateTrackList) return;

  const tracks = stateTrackList?.map((track) => {
    return track.id === index ? { ...track, volume } : track;
  });

  setTracks(tracks);
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

//zoom track
export const zoomTrack = ({ multitrack, isReady, zoomBy = 10 }) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!isReady) return;
  multitrack.zoom(zoomBy);
};

export const reorderTrackList = ({
  multitrack,
  setIsReady = () => {},
  setMultitrack = () => {},
  setTrackStartPosition = () => {},
  newList,
  setTracks,
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!Array.isArray(newList))
    throw new Error(`Expect newList params to be a typeof array`);

  if (setTracks) setTracks(newList);

  //reintitalize multi-track with new track.
  MultiTrackInitFn(
    {
      multiTrackInit: multitrack,
      setMultitrack,
      setIsReady,
      setTrackStartPosition,
    },
    newList
  );
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
