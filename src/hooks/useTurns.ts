"use client";
import { TurnsContext } from "@/context/turnsContext";
import { useContext } from "react";

export const useTurns = () => {
  const context = useContext(TurnsContext);
  if (!context) {
    throw new Error("useTurns must be used inside TurnsProvider");
  }
  return context;
};
