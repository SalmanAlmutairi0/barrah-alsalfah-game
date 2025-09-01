"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { LogIn, Plus, Users, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CreateRoomForm } from "@/components/room/CreateRoomForm";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";
import { deletePlayer } from "@/actions/players";

export default function JoinPage() {
  const { savePlayerInfo, deletePlayerInfo, playerInfo } = usePlayerInfo();
  const [mode, setMode] = useState<"join" | "create">("join"); // Default to join mode
  const router = useRouter();

  useEffect(() => {
    // Only clear player info when explicitly coming to join page
    // This allows users to refresh room pages without losing session
    const clearPlayerInfo = async () => {
      if (playerInfo.playerID) {
        await deletePlayer(playerInfo.playerID, playerInfo.roomID);
      }
      deletePlayerInfo();
    };

    clearPlayerInfo;
  }, [deletePlayerInfo]);

  const handleRoomSuccess = (
    data: {
      playerID: number;
      playerName: string;
      roomKey: string;
      roomID: number;
    },
    isHost: boolean
  ) => {
    // Save player info to local storage
    savePlayerInfo({
      playerID: data.playerID,
      playerName: data.playerName,
      roomKey: data.roomKey,
      roomID: data.roomID,
      isHost: isHost,
    });

    // Navigate to room
    router.push(`/room/${data.roomKey}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <Button
        variant="ghost"
        className="absolute top-4 left-4 gap-2 hover:scale-105 transition-all duration-200"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-4 h-4" />
        <Home className="w-4 h-4" />
        الرئيسية
      </Button>

      <Card className="w-full max-w-md shadow-xl border-2 border-primary/20 animate-in slide-in-from-bottom-5 duration-700">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            برا السالفة
          </CardTitle>
          <CardDescription className="text-lg">
            انشئ غرفة جديدة أو انضم لغرفة موجودة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={mode === "join" ? "default" : "ghost"}
              className={`h-10 transition-all duration-200 ${
                mode === "join"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-primary/70"
              }`}
              onClick={() => setMode("join")}
            >
              <LogIn className="w-4 h-4 mr-2" />
              انضمام لغرفة
            </Button>
            <Button
              variant={mode === "create" ? "default" : "ghost"}
              className={`h-10 transition-all duration-200 ${
                mode === "create"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-primary/70"
              }`}
              onClick={() => setMode("create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              انشاء غرفة
            </Button>
          </div>

          {/* Form Components */}
          {mode === "create" ? (
            <CreateRoomForm
              onSuccess={(data) => handleRoomSuccess(data, true)}
            />
          ) : (
            <JoinRoomForm
              onSuccess={(data) => handleRoomSuccess(data, false)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
