import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award } from "lucide-react";
import { Player } from "@/context/playersContext";

interface LeaderboardCardProps {
  player: Player;
  position: number;
}

export default function LeaderboardCard({
  player,
  position,
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
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        position === 1
          ? "border-primary bg-primary/10 shadow-md"
          : position <= 3
          ? "border-accent/50 bg-accent/5"
          : "border-border bg-muted/30"
      }`}
    >
      <div className="flex items-center justify-between">
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
            <div
              className={`text-xl sm:text-2xl font-bold text-primary ${
                player.score < 0 ? "text-red-600" : "text-primary"
              }`}
            >
              {player.score}
            </div>
            <div className="text-xs text-muted-foreground">نقطة</div>
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
