import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import PlayerCard from "./playerCard";

export type PlayerListProps = {
  players: { id: number; name: string; isHost: boolean }[];
};

export default function PlayerList({ players }: PlayerListProps) {
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
