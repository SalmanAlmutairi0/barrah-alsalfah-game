"use client";
import { createRoom, joinRoom } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { Loader2, LogIn, Plus, Users, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JoinPage() {
  const { savePlayerInfo, deletePlayerInfo } = usePlayerInfo();
  const [playerName, setPlayerName] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [createRoomError, setCreateRoomError] = useState("");
  const [joinRoomError, setJoinRoomError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only clear player info when explicitly coming to join page
    // This allows users to refresh room pages without losing session
    deletePlayerInfo();
  }, [deletePlayerInfo]);

  const validateFields = (
    action: string,
    playerName: string,
    roomKey: string
  ) => {
    if (action === "create") {
      if (!playerName.trim()) {
        setCreateRoomError("الرجاء ادخال اسمك");
        return false;
      } else {
        setCreateRoomError("");
        return true;
      }
    }
    if (action === "join") {
      if (!playerName.trim() || !roomKey.trim()) {
        setJoinRoomError("الرجاء ادخال رمز الغرفة");
        setCreateRoomError("الرجاء ادخال اسمك");
        return false;
      } else {
        setJoinRoomError("");
        setCreateRoomError("");
        return true;
      }
    }
    return false;
  };

  const handleCreateRoom = async () => {
    const isValid = validateFields("create", playerName, roomKey);
    if (!isValid) return;

    try {
      setLoading(true);
      const roomData = await createRoom({ playerName });
      console.log("Room created successfully:", roomData);

      // Save player info to local storage
      savePlayerInfo({
        playerID: roomData.playerID,
        playerName: playerName,
        roomKey: roomData.room_key,
        roomID: roomData.roomID,
        isHost: true,
      });

      router.push(`/room/${roomData.room_key}`);
    } catch (err) {
      console.error("Failed to create room:", err);
      setCreateRoomError("حصل خطأ أثناء إنشاء الغرفة");

      toast.error("حدث خطأ", {
        description: "حصل خطأ أثناء إنشاء الغرفة. حاول مرة أخرى.",
        action: {
          label: "إغلاق",
          onClick: () => toast.dismiss(),
        },
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    const isValid = validateFields("join", playerName, roomKey);
    if (!isValid) return;

    try {
      setLoading(true);

      const roomData = await joinRoom({ playerName, roomKey });

      console.log("Joined room successfully:", roomData);
      savePlayerInfo({
        playerID: roomData.playerID,
        playerName: playerName,
        roomKey: roomData.roomkey,
        roomID: roomData.roomID,
        isHost: false,
      });

      router.push(`/room/${roomData.roomkey}`);
    } catch (error) {
      console.error("Failed to join room:", error);
      setJoinRoomError("حصل خطأ أثناء دخول الغرفة");
      toast.error("حدث خطأ", {
        description: "حصل خطأ أثناء دخول الغرفة. حاول مرة أخرى.",
        action: {
          label: "إغلاق",
          onClick: () => toast.dismiss(),
        },
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
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
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-sm font-medium">
              اسمك :
            </Label>
            <Input
              id="playerName"
              placeholder="ادخل اسمك"
              className={`border-2 transition-all duration-200 ${
                createRoomError
                  ? "border-red-500 focus:border-red-500 animate-shake"
                  : "focus:border-primary"
              }`}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateRoom();
                }
              }}
            />
            {createRoomError && (
              <p className="text-red-500 text-sm animate-in slide-in-from-top-2 duration-300">
                {createRoomError}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <Button
              className="h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleCreateRoom}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              انشاء غرفة جديدة
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  او
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="ادخل رمز الغرفة"
                className={`border-2 transition-all duration-200 ${
                  joinRoomError
                    ? "border-red-500 focus:border-red-500 animate-shake"
                    : "focus:border-accent"
                } text-center font-mono text-lg`}
                value={roomKey}
                onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinRoom();
                  }
                }}
                maxLength={6}
              />
              {joinRoomError && (
                <p className="text-red-500 text-sm animate-in slide-in-from-top-2 duration-300">
                  {joinRoomError}
                </p>
              )}
              <Button
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 bg-transparent hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handleJoinRoom}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                انضمام للغرفة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
