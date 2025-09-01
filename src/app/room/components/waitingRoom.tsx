"use client";
import { chnageRoomStatus } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import WaitingRoomHeader from "@/components/waitingRoomHeader";
import WaitingRoomPlayers from "@/components/waitingRoomPlayers";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import React, { useState } from "react";
import { ArrowRight, Loader2, Play } from "lucide-react";

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
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 h-screen flex flex-col justify-center">
      <WaitingRoomHeader />
      <WaitingRoomPlayers />
      {playerInfo.isHost && (
        <Button
          className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          disabled={players.length < 1}
          onClick={handleGameStart}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-2" />
              كمل الى اختيار التصنيف
            </>
          )}
        </Button>
      )}
    </div>
  );
}
