"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Leaderboard from "@/components/leaderboard";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useRoom } from "@/hooks/useRoom";
import { chnageRoomStatus } from "@/actions/rooms";
import { deletePlayer, markAllPlayersInactive } from "@/actions/players";
import {
  Crown,
  Trophy,
  Home,
  RotateCcw,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GameFinished() {
  const { players } = usePlayers();
  const { playerInfo, deletePlayerInfo } = usePlayerInfo();
  const { room } = useRoom();
  const router = useRouter();
  const [restartLoading, setRestartLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);

  // Find the winner (player with highest score)
  const winner = players.reduce((prev, current) => {
    return prev.score > current.score ? prev : current;
  }, players[0]);

  const handleRestartGame = async () => {
    if (!playerInfo.isHost) {
      toast.error("فقط المضيف يمكنه إعادة تشغيل اللعبة");
      return;
    }

    try {
      setRestartLoading(true);

      // Reset room status to waiting for players
      await chnageRoomStatus({
        roomID: playerInfo.roomID,
        status: "waiting_for_players",
      });

      toast.success("تم إعادة تشغيل اللعبة بنجاح!");
    } catch (error) {
      console.error("Error restarting game:", error);
      toast.error("حدث خطأ أثناء إعادة تشغيل اللعبة");
    } finally {
      setRestartLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      setLeaveLoading(true);

      await deletePlayer(playerInfo.playerID, playerInfo.roomID);
      toast.success("تم الخروج من الغرفة بنجاح");
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("حدث خطأ أثناء الخروج من الغرفة");
    } finally {
      setLeaveLoading(false);
    }
  };

  if (!winner) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-14" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Finished Header */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                انتهت اللعبة!
              </CardTitle>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <p className="text-muted-foreground text-base sm:text-lg">
                مبروك للفائز وشكراً لجميع اللاعبين
              </p>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
        </Card>

        {/* Winner Announcement */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 shadow-lg animate-glow">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              {/* Crown and title */}
              <div className="flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-accent animate-float" />
                <h2 className="text-xl sm:text-2xl font-bold text-primary">
                  🎉 الفائز 🎉
                </h2>
                <Crown className="w-8 h-8 text-accent animate-float" />
              </div>

              {/* Winner info */}
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-md mx-auto max-w-sm">
                <div className="flex items-center justify-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl sm:text-2xl shadow-lg">
                      {winner.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-card flex items-center justify-center">
                      <Crown className="w-3 h-3 text-accent-foreground" />
                    </div>
                  </div>

                  {/* Winner details */}
                  <div className="text-right space-y-2">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {winner.name}
                    </p>
                    <div className="flex justify-end">
                      <Badge
                        variant="default"
                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm sm:text-base px-3 py-1 shadow-md font-bold border-0"
                      >
                        🏆 {winner.score} نقطة
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground">
            النتائج النهائية
          </h3>
          <Leaderboard players={players} />
        </div>

        {/* Action Buttons */}
        <Card className="border-2 border-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Restart Game Button - Only for Host */}
              {playerInfo.isHost && (
                <Button
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                  onClick={handleRestartGame}
                  disabled={restartLoading}
                >
                  {restartLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="w-5 h-5 mr-2" />
                  )}
                  بدء لعبة جديدة
                </Button>
              )}

              {/* Leave Room Button */}
              <Button
                className={`w-full h-12 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg ${
                  !playerInfo.isHost ? "sm:col-span-2" : ""
                }`}
                variant="destructive"
                onClick={handleLeaveRoom}
                disabled={leaveLoading}
              >
                {leaveLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Home className="w-5 h-5 mr-2" />
                )}
                {playerInfo.isHost ? "إنهاء الغرفة للجميع" : "الخروج من الغرفة"}
              </Button>
            </div>

            {/* Host-only note */}
            <div className="mt-4 text-center">
              {!playerInfo.isHost ? (
                <p className="text-sm text-muted-foreground">
                  فقط المضيف يمكنه بدء لعبة جديدة
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  تنبيه: خروج المضيف سينهي الغرفة لجميع اللاعبين
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
