"use client";

import { MultitrackProvider } from "@/context/multitrack-context";

const Providers = ({ children }) => {
  return <MultitrackProvider>{children}</MultitrackProvider>;
};

export default Providers;
