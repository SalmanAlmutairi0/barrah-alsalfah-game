import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Sparkles } from "lucide-react";
import PlayerList from "./playerList";
import { usePlayers } from "@/hooks/usePlayers";

export default function WaitingRoomPlayers() {
  const { players } = usePlayers();

  return (
    <Card className="border-2 border-accent/20 shadow-xl">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-lg sm:text-xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span>الأعبين ({players.length})</span>
          </div>
          {players.length >= 3 && (
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm self-start sm:self-auto">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              جاهز للبدء
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <PlayerList />
      </CardContent>
    </Card>
  );
}
