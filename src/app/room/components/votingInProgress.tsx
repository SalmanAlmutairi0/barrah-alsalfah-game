"use client";

import VotingHeader from "@/components/votingHeader";
import React, { useState } from "react";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { usePlayers } from "@/hooks/usePlayers";
import VotingSelectionCard from "@/components/voting/VotingSelectionCard";
import { useVotes } from "@/hooks/useVotes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VotingInProgress() {
  const [selectedTargetID, setSelectedTargetID] = useState<number | null>(null);
  const { playerInfo } = usePlayerInfo();
  const { players } = usePlayers();
  const { hasUserVoted, votes, submitVote, votesLoading, error } = useVotes();
  const currentPlayerId = playerInfo.playerID;
  const hasVoted = hasUserVoted(currentPlayerId);
  const allPlayersVoted = votes.length === players.length;

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

  const handleTimerFinish = () => {
    console.log("Voting time finished!");
    // TODO: Auto-proceed to results or handle timeout
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
