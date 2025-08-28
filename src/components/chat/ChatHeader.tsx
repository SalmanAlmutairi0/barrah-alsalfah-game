"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { MessageCircle, Target } from "lucide-react";

export default function ChatHeader() {
  const { playerInfo } = usePlayerInfo();
  const onStartVotingPhase = () => {};
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <CardTitle>النقاش</CardTitle>
      </div>

      {playerInfo.isHost && (
        <Button
          onClick={onStartVotingPhase}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Target className="w-4 h-4 mr-2" />
          ابدأ التصويت
        </Button>
      )}
    </div>
  );
}
