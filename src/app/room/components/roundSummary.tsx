"use client";

import React from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import RoundResultHeader from "@/components/roundResultHeader";
import Leaderboard from "@/components/leaderboard";
import RoundActions from "@/components/roundActions";

export default function RoundSummary() {
  const { players } = usePlayers();
  const { playerInfo } = usePlayerInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <RoundResultHeader />
        <Leaderboard players={players} />
        <RoundActions roomID={playerInfo.roomID} />
      </div>
    </div>
  );
}
