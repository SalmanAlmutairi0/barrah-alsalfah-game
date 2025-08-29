"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Target, Crown } from "lucide-react";
import { Player } from "./types";

type VotingPlayerCardProps = {
  player: Player;
  isSelected: boolean;
  voteCount: number;
  hasVoted: boolean;
  onSelect: (playerId: number) => void;
};

export default function VotingPlayerCard({
  player,
  isSelected,
  voteCount,
  hasVoted,
  onSelect,
}: VotingPlayerCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-destructive bg-destructive/10 ring-2 ring-destructive/20"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      } ${hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => !hasVoted && onSelect(player.id)}
    >
      <div className="flex flex-row-reverse items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">{player.name}</p>
          </div>

          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
            {player.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            {isSelected && !hasVoted && (
              <Target className="w-5 h-5 text-destructive" />
            )}
            <div className="text-sm text-muted-foreground">
              {voteCount} أصوات
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
