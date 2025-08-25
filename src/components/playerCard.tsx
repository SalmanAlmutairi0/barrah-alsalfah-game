import React from "react";
import { Badge } from "./ui/badge";
import { Crown } from "lucide-react";

export type PlayerCardProps = {
  player: { id: number; name: string; is_host: boolean };
};

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div
      key={player.id}
      className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-muted/50 border border-border transition-all duration-200 hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <span className="font-medium">{player.name}</span>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
          {player.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {player.is_host && (
        <Badge
          variant="secondary"
          className="bg-accent text-accent-foreground flex items-center gap-1"
        >
          <Crown className="w-3 h-3" />
          المضيف
        </Badge>
      )}
    </div>
  );
}
