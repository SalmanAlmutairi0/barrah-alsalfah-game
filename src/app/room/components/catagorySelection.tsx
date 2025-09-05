"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import CatagoryList from "@/components/catagoryList";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { toast } from "sonner";
import { useRoom } from "@/hooks/useRoom";
import { getRandomWord } from "@/actions/words";
import { usePlayers } from "@/hooks/usePlayers";
import { startRound, getPreviousRoundImposter } from "@/actions/round";
import { chnageRoomStatus } from "@/actions/rooms";
import { Loader2 } from "lucide-react";

export default function CatagorySelection() {
  const { playerInfo, savePlayerInfo } = usePlayerInfo();
  const { room } = useRoom();
  const { players } = usePlayers();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const handleStartGame = async () => {
    if (!room?.selectedCatagory) {
      toast.warning("يرجى اختيار تصنيف للعب!", {
        duration: 4000,
      });
      return;
    }

    try {
      setLoading(true);

      const activePlayers = players.filter((player) => player.isActive);

      // Get the previous round's imposter to avoid consecutive selection
      const previousImposterID = await getPreviousRoundImposter(room.id);

      // Filter out the previous imposter if there are enough players
      let availablePlayers = activePlayers;
      if (previousImposterID && activePlayers.length > 1) {
        availablePlayers = activePlayers.filter(
          (player) => player.id !== previousImposterID
        );
        console.log(
          `Previous imposter (${previousImposterID}) excluded from selection`
        );
      }

      // If filtering left us with no players (shouldn't happen), use all active players
      if (availablePlayers.length === 0) {
        availablePlayers = activePlayers;
      }

      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      const randomPlayer = availablePlayers[randomIndex];

      const secretWord = await getRandomWord(room.selectedCatagory);
      const imposterID = randomPlayer.id;

      const round = await startRound({
        room_id: room.id,
        imposter_id: imposterID,
        secret_word: secretWord,
        category_id: selectedCategory || room.selectedCatagory,
      });

      if (!round) {
        throw new Error("Could not start the round");
      }

      await chnageRoomStatus({
        roomID: room.id,
        status: "role_assignment",
      });

      savePlayerInfo({
        ...playerInfo,
        roundID: round.id,
      });
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("حدث خطاء", {
        description: "حصل خطأ أثناء بدء اللعبة. حاول مرة أخرى.",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              اختر نوع التصنيف
            </CardTitle>
            <CardDescription className="text-lg">
              اختر تصنيف الكلمات الذي تريد اللعب به
            </CardDescription>
          </CardHeader>
        </Card>

        <CatagoryList
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {playerInfo.isHost && (
          <div className="flex justify-center">
            <Button
              disabled={loading}
              onClick={handleStartGame}
              className="max-w-2xl w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              ) : (
                "بدء اللعبة"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
