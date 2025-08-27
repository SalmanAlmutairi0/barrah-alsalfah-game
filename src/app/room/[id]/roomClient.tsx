"use client";

import React, { useEffect } from "react";
import WaitingRoom from "../components/waitingRoom";
import { PlayersProvider } from "@/context/playersContext";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { RoomsProvider } from "@/context/roomContext";
import CatagorySelection from "../components/catagorySelection";
import { useRoom } from "@/hooks/useRoom";

type Props = {
  roomKey: string;
};

export default function RoomClient({ roomKey }: Props) {
  const { playerInfo, deletePlayerInfo } = usePlayerInfo();
  const router = useRouter();

  // listener for when the user is kicked or the user didnt fill the player name or the room key
  useEffect(() => {
    if (!playerInfo.playerID) return;

    if (!playerInfo.playerName || playerInfo.roomKey !== roomKey) {
      router.push("/");
    }

    const channel = supabase
      .channel(`player-${playerInfo.playerID}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "players",
          filter: `id=eq.${playerInfo.playerID}`,
        },
        (payload) => {
          if (payload.new && payload.new.is_active === false) {
            console.log("You have been kicked!");
            deletePlayerInfo();
            router.push("/");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    playerInfo?.playerID,
    playerInfo?.playerName,
    playerInfo?.roomKey,
    roomKey,
    router,
    deletePlayerInfo,
  ]);

  return (
    <RoomsProvider roomID={playerInfo.roomID || 0}>
      <PlayersProvider roomID={playerInfo.roomID || 0}>
        <RenderRoomByStatus />
        {/* <CatagorySelection />; */}
      </PlayersProvider>
    </RoomsProvider>
  );
}

const RenderRoomByStatus = () => {
  const { room } = useRoom();
  switch (room?.status) {
    case "waiting_for_players":
      return <WaitingRoom />;
    case "catagory_selection":
      return <CatagorySelection />;
    default:
      return <div>Unknown status</div>;
  }
};

