"use client";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import PlayerCard from "./playerCard";
import { usePlayers } from "@/hooks/usePlayers";
import PlayerCardSkeleton from "./playerCardSkeleton";
import { Plus } from "lucide-react";

export default function PlayerList() {
  const { players, playersLoading } = usePlayers();

  if (playersLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlayerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-96 ">
      {players.map((player, index) => (
        <div className="mb-2" key={index}>
          <PlayerCard player={player} />
        </div>
      ))}
      <EmptyPlayerSlot />
    </ScrollArea>
  );
}

function EmptyPlayerSlot() {
  const { players } = usePlayers();

  return (
    <div className="">
      {Array.from({ length: Math.max(0, 3 - players.length) }).map((_, i) => (
        <div
          key={i}
          className="flex flex-row-reverse items-center gap-3 p-3 mt-2 rounded-lg border-2 border-dashed border-muted-foreground/30"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground">في انتظار الاعبين</span>
        </div>
      ))}
    </div>
  );
}
