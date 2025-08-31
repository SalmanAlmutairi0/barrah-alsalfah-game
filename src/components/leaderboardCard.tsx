import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award } from "lucide-react";
import { Player } from "@/context/playersContext";
import ScoreDisplay from "./scoreDisplay";
import RoundPointsDisplay from "./roundPointsDisplay";

type LeaderboardCardProps = {
  player: Player;
  position: number;
  previousScore?: number;
  roundPoints?: number;
};

export default function LeaderboardCard({
  player,
  position,
  previousScore,
  roundPoints,
}: LeaderboardCardProps) {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">
            {position}
          </div>
        );
    }
  };

  const getRankBadgeVariant = (position: number) => {
    switch (position) {
      case 1:
        return "default" as const;
      case 2:
        return "secondary" as const;
      case 3:
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div
      className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
        position === 1
          ? "border-primary bg-primary/10 shadow-md"
          : position <= 3
          ? "border-accent/50 bg-accent/5"
          : "border-border bg-muted/30"
      }`}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col gap-2 sm:hidden">
        {/* Top Row: Player Info and Rank */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-sm truncate max-w-[120px]">
              {player.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={getRankBadgeVariant(position)} className="text-xs">
              #{position}
            </Badge>
            <div className="w-4 h-4">
              {position === 1 ? (
                <Crown className="w-4 h-4 text-yellow-500" />
              ) : position === 2 ? (
                <Medal className="w-4 h-4 text-gray-400" />
              ) : position === 3 ? (
                <Award className="w-4 h-4 text-amber-600" />
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Row: Scores */}
        <div className="flex items-center justify-between">
          <ScoreDisplay
            currentScore={player.score || 0}
            previousScore={previousScore}
            size="md"
            showAnimation={true}
          />
          {roundPoints !== undefined && roundPoints !== 0 && (
            <RoundPointsDisplay
              roundPoints={roundPoints}
              variant="badge"
              size="sm"
              showAnimation={true}
            />
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Player Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg">
            {player.name.charAt(0).toUpperCase()}
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg">
                {player.name}
              </span>
            </div>
          </div>
        </div>

        {/* Rank and Score */}
        <div className="flex items-center gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <ScoreDisplay
                currentScore={player.score || 0}
                previousScore={previousScore}
                size="lg"
                showAnimation={true}
              />
              {roundPoints !== undefined && roundPoints !== 0 && (
                <RoundPointsDisplay
                  roundPoints={roundPoints}
                  variant="badge"
                  size="sm"
                  showAnimation={true}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={getRankBadgeVariant(position)}
              className="text-xs sm:text-sm"
            >
              #{position}
            </Badge>
            {getRankIcon(position)}
          </div>
        </div>
      </div>
    </div>
  );
}
