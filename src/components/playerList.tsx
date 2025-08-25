"use client";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import PlayerCard from "./playerCard";
import { usePlayers } from "@/hooks/usePlayers";

export default function PlayerList() {
  const { players } = usePlayers();
  console.log(players);

  return (
    <ScrollArea className="max-h-96 ">
      {players.map((player, index) => (
        <div className="mb-2" key={index}>
          <PlayerCard player={player} />
        </div>
      ))}
    </ScrollArea>
  );
}
