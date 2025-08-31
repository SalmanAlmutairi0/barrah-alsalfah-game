"use client";

import React, { useState } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import RoundResultHeader from "@/components/roundResultHeader";
import Leaderboard from "@/components/leaderboard";
import RoundActions from "@/components/roundActions";
import ScoringExplanation from "@/components/scoringExplanation";
import { useRoom } from "@/hooks/useRoom";

export default function RoundSummary() {
  const { players, getPreviousScore, getRoundPoints } = usePlayers();
  const { playerInfo } = usePlayerInfo();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <RoundResultHeader />
        <Leaderboard
          players={players}
          getPreviousScore={getPreviousScore}
          getRoundPoints={getRoundPoints}
        />
        <RoundActions
          roomID={playerInfo.roomID}
          loading={loading}
          setLoading={setLoading}
        />
      </div>

      <ScoringExplanation />
    </div>
  );
}
