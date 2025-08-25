"use client";

import { secureStorage } from "@/lib/secureStorage";
import { useEffect, useState } from "react";

export type PlayerInfo = {
  playerID: number;
  playerName: string;
  roomKey: string;
  roomID: number;
  isHost: boolean;
};

const STORAGE_KEY = "playerInfo";

export function usePlayerInfo() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    playerID: 0,
    playerName: "",
    roomKey: "",
    roomID: 0,
    isHost: false,
  });

  useEffect(() => {
    const saved = secureStorage.getItem(STORAGE_KEY);
    if (saved) setPlayerInfo(saved);
  }, []);

  const savePlayerInfo = (info: PlayerInfo) => {
    setPlayerInfo(info);
    secureStorage.setItem(STORAGE_KEY, info);
  };

  const deletePlayerInfo = () => {
    const empty: PlayerInfo = {
      playerID: 0,
      playerName: "",
      roomKey: "",
      roomID: 0,
      isHost: false,
    };

    setPlayerInfo(empty);
    secureStorage.removeItem(STORAGE_KEY);
  };

  return {
    playerInfo,
    savePlayerInfo,
    deletePlayerInfo,
  };
}
