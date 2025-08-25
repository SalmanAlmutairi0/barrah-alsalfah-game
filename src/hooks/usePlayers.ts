"use client";
import { PlayersContext } from "@/context/playersContext";
import { useContext } from "react";

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used inside PlayersProvider");
  }
  return context;
};
