"use client";

import { chnageRoomStatus } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useTurns } from "@/hooks/useTurns";
import { MessageCircle, Target } from "lucide-react";
import { toast } from "sonner";

export default function ChatHeader() {
  const { playerInfo } = usePlayerInfo();
  const {isFreeRound} = useTurns()
  const onStartVotingPhase = async () => {
    try {
      await chnageRoomStatus({
        roomID: playerInfo.roomID,
        status: "voting_in_progress",
      });
      
    } catch (error) {
      console.error("Error starting voting phase:", error);
      toast.error("حدث خطأ في بدء التصويت");
      
    }
  };
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <CardTitle>النقاش</CardTitle>
      </div>

      {playerInfo.isHost && (
        <Button
          onClick={onStartVotingPhase}
          disabled={!isFreeRound}
          className={`bg-accent hover:bg-accent/90 text-accent-foreground ${isFreeRound ? "bg-accent/90 hover:bg-accent/90" : "cursor-not-allowed opacity-50"}`}
        >
          <Target className="w-4 h-4 mr-2" />
          ابدأ التصويت
        </Button>
      )}
    </div>
  );
}
