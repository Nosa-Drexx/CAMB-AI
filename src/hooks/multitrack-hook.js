import { MultitrackContext } from "@/context/multitrack-context";
import { useContext } from "react";

// Custom hook for using the context
export function useMultitrackContext() {
  const context = useContext(MultitrackContext);
  if (!context) {
    throw new Error(
      "useMultitrackContext must be used within an MulitrackProvider"
    );
  }
  return context;
}
