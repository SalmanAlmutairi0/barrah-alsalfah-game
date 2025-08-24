import { Button } from "@/components/ui/button";
import WaitingRoomHeader from "@/components/waitingRoomHeader";
import WaitingRoomPlayers from "@/components/waitingRoomPlayers";
import React from "react";

export default function WaitingRoom({ players }: { players: { id: number; name: string; isHost: boolean }[] }) {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 h-screen flex flex-col justify-center">
      <WaitingRoomHeader />
      <WaitingRoomPlayers players={players} />
      <Button className="w-full cursor-pointer h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        disabled={players.length <= 2}
      >
        بدء اللعبة
      </Button>
    </div>
  );
}
