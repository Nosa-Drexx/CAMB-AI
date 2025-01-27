import MultiTrack from "wavesurfer-multitrack";

//initialize track
export const MultiTrackInitFn = (
  {
    multiTrackInit,
    setMuiltiTrack = () => {},
    setIsReady = () => {},
    setPlayStatus = () => {},
    setDropEventTrigger = () => {},
  },
  previousTracks = []
) => {
  if (multiTrackInit) {
    multiTrackInit?.destroy();
    setIsReady(false);
  }

  const multitrack = createMuiltiTrack(previousTracks);

  //drop event on all track to change track with ease
  multitrack.on("drop", (e) => {
    console.log(e, "drop");
    // setDropEventTrigger({ id });
  });

  // Set sinkId
  multitrack.once("canplay", async () => {
    // await multitrack.setSinkId("default");
    // console.log("Set sinkId to default");
    setIsReady(true);
  });

  //play pause event
  multitrack.on("pause", () => setPlayStatus("paused"));
  multitrack.on("play", () => setPlayStatus("playing"));

  setMuiltiTrack(multitrack);
};

//add audio track
export const addToMultiTrack = ({
  multitrack,
  url,
  id,
  setMuiltiTrack,
  setIsReady,
  setPlayStatus,
}) => {
  if (!multitrack) throw new Error(`No multitrack found`);
  if (!url) throw new Error(`No audio url found for ${url}`);

  const previousTrack = multitrack?.tracks?.filter(
    (track) => track?.id !== "placeholder" && track?.url
  );

  const newTrack = {
    id: 0,
    startPosition: 0,
    url,
    draggable: true,
    options: {
      waveColor: "hsl(25, 87%, 49%)",
      progressColor: "hsl(25, 87%, 20%)",
    },
  };

  previousTrack.push(newTrack);

  //reintitalize multi-track with new track.
  MultiTrackInitFn(
    {
      multiTrackInit: multitrack,
      setMuiltiTrack,
      setIsReady,
      setPlayStatus,
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

//create multi track
const createMuiltiTrack = (track = []) => {
  const multitrack = MultiTrack.create(
    [
      {
        id: 0,
      },
      ...track,
    ],
    {
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
    }
  );

  return multitrack;
};

// Zoom
// const slider = document.querySelector('input[type="range"]');
// slider.oninput = () => {
//   multitrack.zoom(slider.valueAsNumber);
// };
