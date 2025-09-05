"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Hash, Tag } from "lucide-react";
import Counter from "./counter";
import { toast } from "sonner";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useEffect, useState } from "react";
import { getRoundInfo } from "@/actions/round";
import { chnageRoomStatus } from "@/actions/rooms";
import { useRoom } from "@/hooks/useRoom";
import { getCategoryById, Category } from "@/actions/catagory";

export default function DiscussionHeader() {
  const { playerInfo } = usePlayerInfo();
  const { room } = useRoom();
  const [isImposter, setIsImposter] = useState(false);
  const [secretWord, setSecretWord] = useState("");
  const [startedAtSeconds, setStartedAtSeconds] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(180); // Default 3 minutes
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const onCounterFinish = () => {
    // First toast: Time's up (4 seconds)
    toast.info("انتهى الوقت", {
      description: "يرجى إنهاء النقاش والانتقال للخطوة التالية.",
      duration: 4000,
    });

    // After first toast finishes, show warning about voting (5 seconds)
    setTimeout(() => {
      toast.warning("التصويت سيبدأ خلال 5 ثوان!", {
        description: "تجهز تصوت على الي تحس انه برا السالفة",
        duration: 5000,
      });

      // After the warning, update room status to voting
      setTimeout(async () => {
        try {
          if (playerInfo.roomID) {
            await chnageRoomStatus({
              roomID: playerInfo.roomID,
              status: "voting_in_progress",
            });
            console.log("Room status updated to voting");
          }
        } catch (error) {
          console.error("Error updating room status to voting:", error);
          toast.error("حدث خطأ في بدء التصويت");
        }
      }, 5000); // 5 seconds after the warning toast appears
    }, 4000); // 4 seconds after the first toast appears
  };

  // Calculate remaining time when startedAtSeconds changes
  useEffect(() => {
    if (startedAtSeconds) {
      const currentTimeSeconds = Math.floor(Date.now() / 1000);
      const elapsedSeconds = currentTimeSeconds - startedAtSeconds;

      const totalDiscussionTime = 120;

      const remaining = Math.max(0, totalDiscussionTime - elapsedSeconds);
      setRemainingTime(remaining);
    } else {
      // If no start time, use full timer
      setRemainingTime(120);
    }
  }, [startedAtSeconds]);

  useEffect(() => {
    if (!playerInfo.roomID) return;

    const fetchRoundInfo = async () => {
      try {
        const round = await getRoundInfo(playerInfo.roomID);

        setIsImposter(round.imposterID === playerInfo.playerID);
        setSecretWord(round.secretWord || "");
        setStartedAtSeconds(
          round.startedAt ? round.startedAt.getTime() / 1000 : null
        );
      } catch (error) {
        console.error("Error fetching round info:", error);
        toast.error("حدث خطأ ما");
      }
    };

    fetchRoundInfo();
  }, [playerInfo.roomID]);

  // Fetch category information when room data is available
  useEffect(() => {
    if (!room?.selectedCatagory) return;

    const fetchCategory = async () => {
      try {
        const category = await getCategoryById(room.selectedCatagory!);
        setSelectedCategory(category as Category);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [room?.selectedCatagory]);

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            وقت النقاش
          </CardTitle>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isImposter
                ? "bg-destructive/20 text-destructive border border-destructive/30"
                : "bg-primary/20 text-primary border border-primary/30"
            }`}
          >
            {isImposter
              ? "🎭 انت برا السالفة"
              : `🔍 انت داخل السالفة - الكلمة: ${secretWord}`}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <Counter
            timeInSeconds={remainingTime}
            onCounterFinish={onCounterFinish}
          />
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-accent" />
            <span className="text-lg font-medium">
              الجولة {room?.roundNumber || 0}
            </span>
          </div>
          {selectedCategory && (
            <>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-secondary-foreground" />
                <span className="text-lg font-medium">
                  {selectedCategory.icon} {selectedCategory.name}
                </span>
              </div>
            </>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
