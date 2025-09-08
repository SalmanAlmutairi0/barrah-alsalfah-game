"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  MessageCircle,
  Clock,
  Users,
  ArrowLeft,
  UserSearch,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useTurns } from "@/hooks/useTurns";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { Button } from "./ui/button";
import SelectTargetDialog from "./selectTargetDialog";
import { updateTargetSelection } from "@/actions/turns";
import { toast } from "sonner";

export default function TargetSelection() {
  const {
    currentTurn,
    turnLoading,
    turnsHistory,
    remainingSeconds,
    isFreeRound,
  } = useTurns();
  const { players } = usePlayers();
  const { playerInfo, loading: playerInfoLoading } = usePlayerInfo();
  const [isSelectTargetDialogOpen, setIsSelectTargetDialogOpen] =
    useState(false);

  const isCurrentPlayerTurn =
    currentTurn?.questionar_id === playerInfo.playerID;

  const getPlayerName = (playerId: number) => {
    const player = players.find((player) => player.id === playerId);
    return player?.name;
  };

  const handleSelectTarget = async (targetId: number) => {
    if (!currentTurn?.id || !currentTurn?.questionar_id || !playerInfo.roomID)
      return;
    try {
      await updateTargetSelection(
        currentTurn?.id,
        currentTurn?.questionar_id,
        targetId,
        playerInfo.roomID
      );
    } catch (error) {
      console.error("Error selecting target:", error);
      toast.error("حدث خطأ ما");
    }
  };

  if (turnLoading || playerInfoLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            تتبع الأدوار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="mr-2 text-sm text-muted-foreground">
              جاري التحميل...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          تتبع الأدوار
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Turn */}
        <div>
          <div className="flex items-center justify-between  p-3 rounded-lg bg-primary/5 mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">الدور الحالي</span>
            </div>
            {remainingSeconds !== null && remainingSeconds > 0 && (
              <Badge variant={isFreeRound ? "destructive" : "secondary"}>
                <Clock className="w-3 h-3 mr-1" />
                <span className="font-mono">
                  {isFreeRound
                    ? `${Math.floor(remainingSeconds / 60)}:${String(
                        remainingSeconds % 60
                      ).padStart(2, "0")}`
                    : `${remainingSeconds}s`}
                </span>
                {isFreeRound && <span className="mr-1">جولة حرة</span>}
              </Badge>
            )}
          </div>

          {/* this is for when the target is not selected */}
          {!currentTurn?.target_id && !isFreeRound && (
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-3">
                  {/* Pulse indicator */}
                  <div className="flex justify-center items-center w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>

                  {/* Player info */}
                  <div
                    className="flex items-center justify-center gap-2"
                    dir="rtl"
                  >
                    <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
                      {getPlayerName(currentTurn?.questionar_id || 0) ||
                        "لا يوجد"}
                    </div>
                    <UserSearch className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                      يختار الهدف...
                    </span>
                  </div>

                  {/* Button for current player */}
                  {isCurrentPlayerTurn && (
                    <Button
                      size="sm"
                      className="text-sm bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700"
                      onClick={() => setIsSelectTargetDialogOpen(true)}
                    >
                      اختر من تريد أن تسأله
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* this is for when the target is selected */}
          {currentTurn?.target_id && !isFreeRound && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-center gap-3"
                  dir="rtl"
                >
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                    {getPlayerName(currentTurn?.questionar_id || 0) ||
                      "لا يوجد"}
                  </div>
                  <ArrowLeft className="w-5 h-5 text-primary" />
                  <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                    {getPlayerName(currentTurn?.target_id || 0) || "لا يوجد"}
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  يسأل الآن
                </p>
              </CardContent>
            </Card>
          )}

          {/* Free Round Display */}
          {isFreeRound && (
            <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex justify-center items-center w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-1">
                      جولة حرة!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      جميع اللاعبين سألوا أسئلتهم - اسألوا ما تشاءون!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        {/* History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">تاريخ الأدوار</span>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-2 pr-2">
              {turnsHistory.map((turn) => (
                <div key={turn.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2" dir="rtl">
                      <span className="text-sm font-medium text-primary">
                        {getPlayerName(turn.questionar_id || 0) || "لا يوجد"}
                      </span>
                      <ArrowLeft className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-secondary-foreground">
                        {getPlayerName(turn.target_id || 0) || "لا يوجد"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {turn.created_at}
                    </span>
                  </div>
                </div>
              ))}

              {turnsHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد أدوار بعد</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <SelectTargetDialog
        isOpen={isSelectTargetDialogOpen}
        onOpenChange={setIsSelectTargetDialogOpen}
        onSelectTarget={handleSelectTarget}
      />
    </Card>
  );
}
