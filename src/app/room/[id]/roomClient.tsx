"use client";

import React, { useEffect, useState } from "react";
import WaitingRoom from "../components/waitingRoom";
import { PlayersProvider } from "@/context/playersContext";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { RoomsProvider } from "@/context/roomContext";
import CatagorySelection from "../components/catagorySelection";
import { useRoom } from "@/hooks/useRoom";
import { Loader2 } from "lucide-react";
import RoleAssignment from "../components/roleAssignment";
import RoundInProgress from "../components/roundInProgress";
import VotingInProgress from "../components/votingInProgress";
import { VotesProvider } from "@/context/votesContext";
import { getRoundInfo } from "@/actions/round";
import { toast } from "sonner";

type Props = {
  roomKey: string;
};

export default function RoomClient({ roomKey }: Props) {
  const { playerInfo, deletePlayerInfo, loading } = usePlayerInfo();
  const router = useRouter();

  // if the player joined by the link, we need to check if the room key is correct
  // Only check after loading is complete to avoid redirecting due to empty initial state
  useEffect(() => {
    if (loading) return; // Wait for player info to load

    if (playerInfo.roomKey !== roomKey || !playerInfo.roomKey) {
      console.log("room key is not correct");
      router.push("/");
    }
  }, [playerInfo.roomKey, roomKey, router, loading]);

  // listener for when the user is kicked or the user didnt fill the player name or the room key
  useEffect(() => {
    if (!playerInfo.playerID) return;

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
    playerInfo.playerID,
    playerInfo.playerName,
    playerInfo.roomKey,
    roomKey,
    router,
    deletePlayerInfo,
  ]);

  // Show loading while player info is being loaded from storage
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-14" />
      </div>
    );
  }

  return (
    <RoomsProvider roomID={playerInfo.roomID || 0}>
      <PlayersProvider roomID={playerInfo.roomID || 0}>
        <RenderRoomByStatus />
        {/* <RoundInProgress /> */}
      </PlayersProvider>
    </RoomsProvider>
  );
}

const RenderRoomByStatus = () => {
  const { room, loading } = useRoom();
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-14 " />
      </div>
    );

  switch (room?.status) {
    case "waiting_for_players":
      return <WaitingRoom />;
    case "catagory_selection":
      return <CatagorySelection />;
    case "role_assignment":
      return <RoleAssignment />;
    case "round_in_progress":
      return <RoundInProgress />;
    case "voting_in_progress":
      return <VotingWrapper />;
    // default:
    //   return <div>Unknown status</div>;
  }
};

const VotingWrapper = () => {
  const { playerInfo } = usePlayerInfo();
  const [roundID, setRoundID] = useState<number | null>(null);

  useEffect(() => {
    if (!playerInfo.roomID) return;

    const fetchRoundInfo = async () => {
      try {
        const round = await getRoundInfo(playerInfo.roomID);
        setRoundID(round.id);
      } catch (error) {
        console.error("Error fetching round info:", error);
        toast.error("حدث خطأ في تحميل معلومات الجولة");
      }
    };

    fetchRoundInfo();
  }, [playerInfo.roomID]);

  if (!roundID) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-14" />
      </div>
    );
  }

  return (
    <VotesProvider roundID={roundID}>
      <VotingInProgress />
    </VotesProvider>
  );
};
