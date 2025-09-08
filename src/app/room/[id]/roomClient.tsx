"use client";

import React, { useEffect, useState } from "react";
import WaitingRoom from "../components/waitingRoom";
import { PlayersProvider } from "@/context/playersContext";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useRouter } from "next/navigation";
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
import RoundSummary from "../components/roundSummary";
import ImposterGotCaught from "../components/imposterGuessPhase";
import GameFinished from "../components/gameFinished";
import { socket } from "@/lib/socket";
import { useSocketPresence } from "@/hooks/useSocketPresence";
import { TurnsProvider } from "@/context/turnsContext";

type Props = {
  roomKey: string;
};

export default function RoomClient({ roomKey }: Props) {
  const { playerInfo, deletePlayerInfo, loading } = usePlayerInfo();
  const router = useRouter();

  // if player closed the tap makr him as inactive
  useSocketPresence(
    playerInfo.playerID,
    playerInfo.roomID,
    playerInfo.playerName
  );

  // if the player joined by the link, i need to check if the room key is correct
  // Only check after loading is complete to avoid redirecting due to empty initial state
  useEffect(() => {
    if (loading) return;

    if (playerInfo.roomKey !== roomKey || !playerInfo.roomKey) {
      console.log("room key is not correct");
      router.push("/join");
    }
  }, [playerInfo.roomKey, roomKey, router, loading]);

  // Handle socket connection and room joining
  useEffect(() => {
    if (!playerInfo.roomID || loading) return;

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected");
    }

    // Join the room with player info
    socket.emit("join-room", {
      roomId: playerInfo.roomID.toString(),
      playerID: playerInfo.playerID,
    });

    return () => {
      // Leave the room when component unmounts or roomID changes
      if (playerInfo.roomID) {
        console.log("Socket disconnected");
        socket.emit("leave-room", { roomId: playerInfo.roomID.toString() });
      }
    };
  }, [playerInfo.roomID, loading]);

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
      <PlayersProvider
        roomID={playerInfo.roomID || 0}
        currentPlayerID={playerInfo.playerID}
      >
        <RenderRoomByStatus />
        {/* <GameFinished /> */}
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
      return <RoundInProgressWrapper />;
    case "voting_in_progress":
      return <VotingWrapper />;
    case "imposter_got_caught":
      return <ImposterGotCaught />;
    case "round_summary":
      return <RoundSummary />;
    case "finished":
      return <GameFinished />;
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

  if (!roundID || !playerInfo.roomID) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-14" />
      </div>
    );
  }

  return (
    <VotesProvider roundID={roundID} roomId={playerInfo.roomID}>
      <VotingInProgress />
    </VotesProvider>
  );
};

const RoundInProgressWrapper = () => {
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

  return (
    <TurnsProvider roundID={roundID || 0} roomID={playerInfo.roomID || 0}>
      <RoundInProgress />
    </TurnsProvider>
  );
};
