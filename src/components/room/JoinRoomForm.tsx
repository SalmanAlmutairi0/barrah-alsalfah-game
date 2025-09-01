"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, X } from "lucide-react";
import { useState } from "react";
import { joinRoom } from "@/actions/rooms";
import { toast } from "sonner";

type JoinRoomFormProps = {
  onSuccess: (data: {
    playerID: number;
    playerName: string;
    roomKey: string;
    roomID: number;
  }) => void;
};

export function JoinRoomForm({ onSuccess }: JoinRoomFormProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!playerName.trim()) {
      setError("الرجاء ادخال اسمك");
      return;
    }
    if (!roomKey.trim()) {
      setError("الرجاء ادخال رمز الغرفة");
      return;
    }
    setError("");

    try {
      setLoading(true);
      const roomData = await joinRoom({ playerName, roomKey });
      console.log("Joined room successfully:", roomData);

      // Call success callback with room data
      onSuccess({
        playerID: roomData.playerID,
        playerName: playerName,
        roomKey: roomData.roomkey,
        roomID: roomData.roomID,
      });
    } catch (err) {
      console.error("Failed to join room:", err);
      setError((err as Error).message);

      toast.warning("حدث خطأ", {
        description: (err as Error).message,
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

  const handleKeyDown = (e: React.KeyboardEvent, field: "name" | "roomKey") => {
    if (e.key === "Enter") {
      if (field === "name") {
        // Focus room key input when pressing enter on name field
        const roomKeyInput = document.getElementById(
          "roomKey"
        ) as HTMLInputElement;
        if (roomKeyInput) {
          roomKeyInput.focus();
        }
      } else {
        // Submit when pressing enter on room key field
        handleSubmit();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Player Name Input */}
      <div className="space-y-2">
        <Label htmlFor="playerName" className="text-sm font-medium">
          اسمك :
        </Label>
        <Input
          id="playerName"
          placeholder="ادخل اسمك"
          className={`border-2 transition-all duration-200 ${
            error
              ? "border-red-500 focus:border-red-500 animate-shake"
              : "focus:border-primary"
          }`}
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "name")}
        />
      </div>

      {/* Room Key Input */}
      <div className="space-y-2">
        <Label htmlFor="roomKey" className="text-sm font-medium">
          رمز الغرفة :
        </Label>
        <Input
          id="roomKey"
          placeholder="ادخل رمز الغرفة"
          className={`border-2 transition-all duration-200 ${
            error
              ? "border-red-500 focus:border-red-500 animate-shake"
              : "focus:border-accent"
          } text-lg`}
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
          onKeyDown={(e) => handleKeyDown(e, "roomKey")}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm animate-in slide-in-from-top-2 duration-300">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          onClick={handleSubmit}
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
  );
}
