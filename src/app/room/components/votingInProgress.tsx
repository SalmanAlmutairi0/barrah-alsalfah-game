"use client";

import VotingHeader from "@/components/votingHeader";
import React, { useEffect, useState } from "react";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { usePlayers } from "@/hooks/usePlayers";
import VotingSelectionCard from "@/components/voting/VotingSelectionCard";
import { useVotes } from "@/hooks/useVotes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { chnageRoomStatus } from "@/actions/rooms";
import { getRoundInfo } from "@/actions/round";
import { RoomStatus } from "@/context/roomContext";

export default function VotingInProgress() {
  const [selectedTargetID, setSelectedTargetID] = useState<number | null>(null);
  const { playerInfo } = usePlayerInfo();
  const { players } = usePlayers();
  const { hasUserVoted, votes, submitVote, votesLoading, error, getVoteCount } =
    useVotes();
  const currentPlayerId = playerInfo.playerID;
  const hasVoted = hasUserVoted(currentPlayerId);
  const allPlayersVoted = votes.length === players.length;

  useEffect(() => {
    // if all players voted, proceed to round summary
    if (allPlayersVoted) {
      updateRoomStatus();
    }
  }, [allPlayersVoted]);

  const handleTimerFinish = async () => {
    if (allPlayersVoted) return;
    await updateRoomStatus();
  };

  const handleVote = async () => {
    if (selectedTargetID && !hasVoted) {
      console.log(selectedTargetID, currentPlayerId);
      try {
        await submitVote(currentPlayerId, selectedTargetID);
      } catch (error) {
        console.error("Error submitting vote:", error);
      }
    }
  };

  const updateRoomStatus = async () => {
    try {
      // Get the current round info to find the imposter
      const roundInfo = await getRoundInfo(playerInfo.roomID);
      const imposterID = roundInfo.imposter_id;

      // Count votes for each player
      const votesCount = players.map((player) => ({
        playerID: player.id,
        voteCount: getVoteCount(player.id),
      }));
      console.log("Vote counts:", votesCount);

      // Find who got the most votes
      let mostVotedPlayerID = null;
      let maxVotes = 0;
      let isTie = false;

      votesCount.forEach(({ playerID, voteCount }) => {
        if (voteCount > maxVotes) {
          mostVotedPlayerID = playerID;
          maxVotes = voteCount;
          isTie = false;
        } else if (
          (voteCount === maxVotes && maxVotes > 0) ||
          voteCount === 0
        ) {
          isTie = true;
        }
      });

      // Determine the status based on voting results
      let newStatus: RoomStatus;

      if (isTie || mostVotedPlayerID === null || maxVotes === 0) {
        // Tie vote or no votes - imposter survives (wins)
        newStatus = "round_summary";
      } else if (mostVotedPlayerID === imposterID) {
        // Imposter got the most votes - got caught
        newStatus = "imposter_got_caught";
      } else {
        // Someone else got the most votes - imposter survives (wins)
        newStatus = "round_summary";
      }

      console.log("Voting results:", {
        imposterID,
        mostVotedPlayerID,
        maxVotes,
        isTie,
        newStatus,
        votesCount,
      });

      await chnageRoomStatus({
        roomID: playerInfo.roomID,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error changing room status:", error);
      toast.error("حدث خطأ في تحديد نتيجة التصويت");
    }
  };

  if (votesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-14" />
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <VotingHeader initialTime={30} onTimerFinish={handleTimerFinish} />

        <div className="grid grid-cols-1 gap-6">
          <VotingSelectionCard
            players={players}
            votes={votes}
            currentPlayerId={currentPlayerId}
            selectedVote={selectedTargetID}
            hasVoted={hasVoted}
            onSelectPlayer={setSelectedTargetID}
            onSubmitVote={handleVote}
          />
        </div>
      </div>
    </div>
  );
}
