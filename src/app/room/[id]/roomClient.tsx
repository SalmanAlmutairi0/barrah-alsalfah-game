"use client";

import React, { useEffect } from "react";
import WaitingRoom from "../components/waitingRoom";
import { PlayersProvider } from "@/context/playersContext";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useRouter } from "next/navigation";
import { useLeaveRoomOnUnload } from "@/hooks/useLeaveRoomOnUnload";

type Props = {
  roomKey: string;
};

export default function RoomClient({ roomKey }: Props) {
  const { playerInfo } = usePlayerInfo();
  const router = useRouter();
  // useLeaveRoomOnUnload(playerInfo.playerID);


  useEffect(() => {
    if (!playerInfo.playerName || playerInfo.roomKey !== roomKey) {
      router.push("/");
    }
  }, [playerInfo.playerName, playerInfo.roomKey]);

  return (
    <PlayersProvider roomID={playerInfo.roomID || 0}>
      <WaitingRoom />
    </PlayersProvider>
  );
}
