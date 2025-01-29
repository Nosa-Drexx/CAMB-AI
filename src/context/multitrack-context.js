import { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  multitrack: null,
  isReady: false,
  playStatus: "none", // none, playing, paused
  tracks: [],
};

// Reducer function
function multitrackReducer(state, action) {
  switch (action.type) {
    case "SET_MULTITRACK":
      return { ...state, multitrack: action.payload };
    case "SET_IS_READY":
      return { ...state, isReady: action.payload };
    case "SET_PLAY_STATUS":
      return { ...state, playStatus: action.payload };
    case "SET_TRACKS":
      return { ...state, tracks: action.payload };
    case "TRACKS_START_POSITION_UPDATE":
      const tracks = state.tracks.map((track) => {
        if (Number(track.id) === Number(action.payload.id)) {
          return { ...track, startPosition: action.payload.startPosition };
        }
        return track;
      });
      return { ...state, tracks };
    default:
      return state;
  }
}

// Create context
const MultitrackContext = createContext(initialState);

// Context provider
function MultitrackProvider({ children }) {
  const [state, dispatch] = useReducer(multitrackReducer, initialState);

  return (
    <MultitrackContext.Provider value={{ state, dispatch }}>
      {children}
    </MultitrackContext.Provider>
  );
}

export { MultitrackContext, MultitrackProvider };
