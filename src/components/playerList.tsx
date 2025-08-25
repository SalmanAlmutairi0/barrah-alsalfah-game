"use client";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import PlayerCard from "./playerCard";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";

export default function PlayerList() {
  const { players } = usePlayers();

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
