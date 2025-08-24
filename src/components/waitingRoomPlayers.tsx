import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {  Users } from "lucide-react";
import PlayerList from "./playerList";

export default function WaitingRoomPlayers({ players }: { players: { id: number; name: string; isHost: boolean }[] }) {

  return (
    <Card className="border-2 border-accent/20 w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          الاعبين
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <PlayerList players={players} />
        </div>
      </CardContent>
    </Card>
  );
}
