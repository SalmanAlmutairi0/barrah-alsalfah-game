"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target } from "lucide-react";
import VotingPlayerCard from "./VotingPlayerCard";
import { Player } from "./types";
import { Vote } from "@/context/votesContext";
import { useVotes } from "@/hooks/useVotes";

type VotingSelectionCardProps = {
  players: Player[];
  votes: Vote[];
  currentPlayerId: number;
  selectedVote: number | null;
  hasVoted: boolean;
  onSelectPlayer: (playerId: number) => void;
  onSubmitVote: () => void;
};

export default function VotingSelectionCard({
  players,
  votes,
  currentPlayerId,
  selectedVote,
  hasVoted,
  onSelectPlayer,
  onSubmitVote,
}: VotingSelectionCardProps) {
  const { getVoteCount } = useVotes();

 

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          اختر صوتك
        </CardTitle>
        <CardDescription>
          {hasVoted
            ? "لقد قمت بالتصويت!"
            : "اختر اللاعب الذي تشك أنه برا السالفة"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scroll area for players list - max height to handle many players */}
        <ScrollArea className="h-[300px] w-full rounded-md">
          <div className="space-y-4 pr-4">
            {players.map((player) => (
              <VotingPlayerCard
                key={player.id}
                player={player}
                isSelected={selectedVote === player.id}
                voteCount={getVoteCount(player.id)}
                hasVoted={hasVoted}
                onSelect={onSelectPlayer}
              />
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <Button
          onClick={onSubmitVote}
          disabled={!selectedVote || hasVoted}
          className="w-full h-12 text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          {hasVoted ? (
            <>
              <Target className="w-5 h-5 mr-2" />
              تم إرسال الصوت
            </>
          ) : (
            <>
              <Target className="w-5 h-5 mr-2" />
              إرسال الصوت
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
