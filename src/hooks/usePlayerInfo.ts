"use client";

import { secureStorage } from "@/lib/secureStorage";
import { useEffect, useState, useCallback } from "react";

export type PlayerInfo = {
  playerID: number;
  playerName: string;
  roomKey: string;
  roomID: number;
  isHost: boolean;
  selectedCatagory?: number;
};

const STORAGE_KEY = "playerInfo";

export function usePlayerInfo() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    playerID: 0,
    playerName: "",
    roomKey: "",
    roomID: 0,
    isHost: false,
    selectedCatagory: undefined,
  });

  useEffect(() => {
    const saved = secureStorage.getItem(STORAGE_KEY);
    if (saved) setPlayerInfo(saved);
  }, []);

  const savePlayerInfo = useCallback((info: PlayerInfo) => {
    setPlayerInfo(info);
    secureStorage.setItem(STORAGE_KEY, info);
  }, []);

  const deletePlayerInfo = useCallback(() => {
    const empty: PlayerInfo = {
      playerID: 0,
      playerName: "",
      roomKey: "",
      roomID: 0,
      isHost: false,
      selectedCatagory: undefined,
    };

    setPlayerInfo(empty);
    secureStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    playerInfo,
    savePlayerInfo,
    deletePlayerInfo,
  };
}
