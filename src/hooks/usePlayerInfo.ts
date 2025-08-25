"use client";

import { useLocalStorage } from "@uidotdev/usehooks";

export type PlayerInfo = {
  playerID: number;
  playerName: string;
  roomKey: string;
  roomID: number;
  isHost: boolean; 
};

export function usePlayerInfo() {
  const [playerInfo, setPlayerInfo] = useLocalStorage<PlayerInfo>(
    "playerInfo",
    {
      playerID: 0,
      playerName: "",
      roomKey: "",
      roomID: 0,
      isHost: false,
    }
  );

  const savePlayerInfo = (info: PlayerInfo) => {
    setPlayerInfo(info);
  };

  const deletePlayerInfo = () => {
    setPlayerInfo({ playerID: 0, playerName: "", roomKey: "", roomID: 0, isHost: false });
  };

  return {
    playerInfo,
    savePlayerInfo,
    deletePlayerInfo,
  };
}
