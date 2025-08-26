"use Client";

import { RoomsContext } from "@/context/roomContext";
import { useContext } from "react";

export function useRoom() {
  const context = useContext(RoomsContext);
  if (!context) throw new Error("useRoom must be used inside a RoomsProvider");
  return context;
}
