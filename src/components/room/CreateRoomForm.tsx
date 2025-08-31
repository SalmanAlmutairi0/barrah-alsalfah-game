"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { createRoom } from "@/actions/rooms";
import { toast } from "sonner";

type CreateRoomFormProps = {
  onSuccess: (data: {
    playerID: number;
    playerName: string;
    roomKey: string;
    roomID: number;
  }) => void;
};

export function CreateRoomForm({ onSuccess }: CreateRoomFormProps) {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!playerName.trim()) {
      setError("الرجاء ادخال اسمك");
      return;
    }
    setError("");

    try {
      setLoading(true);
      const roomData = await createRoom({ playerName });
      console.log("Room created successfully:", roomData);

      // Call success callback with room data
      onSuccess({
        playerID: roomData.playerID,
        playerName: playerName,
        roomKey: roomData.room_key,
        roomID: roomData.roomID,
      });
    } catch (err) {
      console.error("Failed to create room:", err);
      setError("حصل خطأ أثناء إنشاء الغرفة");

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
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
          onKeyDown={handleKeyDown}
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
          className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          انشاء غرفة جديدة
        </Button>
      </div>
    </div>
  );
}
