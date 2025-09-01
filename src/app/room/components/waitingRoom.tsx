"use client";
import { chnageRoomStatus } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WaitingRoomHeader from "@/components/waitingRoomHeader";
import WaitingRoomPlayers from "@/components/waitingRoomPlayers";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import React, { useState } from "react";
import { ArrowRight, Loader2, Clock, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Component for host game controls
function HostGameControls({
  players,
  loading,
  onGameStart,
}: {
  players: any[];
  loading: boolean;
  onGameStart: () => void;
}) {
  return (
    <div className="space-y-3">
      {players.length < 3 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-800 dark:text-amber-200 text-xs sm:text-sm">
                تحتاج إلى 3 لاعبين على الأقل للبدء
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full h-12 sm:h-14 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-[1.01] disabled:transform-none disabled:opacity-50"
        disabled={loading || players.length < 3}
        onClick={onGameStart}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
        ) : (
          <>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            <span> كمل الى اختيار التصنيف</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
          </>
        )}
      </Button>
    </div>
  );
}

// Component for non-host waiting message
function WaitingMessage() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="flex items-center justify-center gap-2 py-3 sm:py-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground text-xs sm:text-sm text-center">
          في انتظار مضيف الغرفة لبدء اللعبة...
        </span>
      </CardContent>
    </Card>
  );
}

export default function WaitingRoom() {
  const { players } = usePlayers();
  const { playerInfo } = usePlayerInfo();
  const [loading, setLoading] = useState(false);

  const handleGameStart = async () => {
    try {
      setLoading(true);
      await chnageRoomStatus({
        roomID: Number(players[0].room_id),
        status: "catagory_selection",
      });
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء بدء اللعبة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-screen flex flex-col justify-center">
      <WaitingRoomHeader />
      <WaitingRoomPlayers />

      {playerInfo.isHost ? (
        <HostGameControls
          players={players}
          loading={loading}
          onGameStart={handleGameStart}
        />
      ) : (
        <WaitingMessage />
      )}
    </div>
  );
}
