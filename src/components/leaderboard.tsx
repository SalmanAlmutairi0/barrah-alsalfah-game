import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Player } from "@/context/playersContext";
import LeaderboardCard from "./leaderboardCard";

interface LeaderboardProps {
  players: Player[];
  getPreviousScore?: (playerId: number) => number | undefined;
  getRoundPoints?: (playerId: number) => number;
}

export default function Leaderboard({
  players,
  getPreviousScore,
  getRoundPoints,
}: LeaderboardProps) {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="border-2 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          جدول النقاط
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          ترتيب اللاعبين حسب النقاط المحققة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const position = index + 1;
          return (
            <LeaderboardCard
              key={player.id}
              player={player}
              position={position}
              previousScore={getPreviousScore?.(player.id)}
              roundPoints={getRoundPoints?.(player.id)}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
