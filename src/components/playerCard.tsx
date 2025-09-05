"use client";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Crown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import KickDialog from "./kickDialog";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";

export type PlayerCardProps = {
  player: { id: number; name: string; isHost: boolean };
};

export default function PlayerCard({ player }: PlayerCardProps) {
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false);
  const { playerInfo } = usePlayerInfo();
  const [loading, setLoading] = useState(false);

  const currnetPlayerIsHost = playerInfo.isHost || false;

  const handleKickPlayer = () => {
    console.log(`kicking player: ${player.name} by host`);
    setIsKickDialogOpen(() => !isKickDialogOpen);
  };
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
      {player.isHost && (
        <Badge
          variant="secondary"
          className="bg-accent text-accent-foreground flex items-center gap-1"
        >
          <Crown className="w-3 h-3" />
          المضيف
        </Badge>
      )}
      {!player.isHost && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleKickPlayer}
          className={`text-red-600 ${!currnetPlayerIsHost ? "hidden" : ""}`}
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "طرد"}
        </Button>
      )}

      {isKickDialogOpen && (
        <KickDialog
          isKickDialogOpen={isKickDialogOpen}
          setIsKickDialogOpen={setIsKickDialogOpen}
          player={player}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
