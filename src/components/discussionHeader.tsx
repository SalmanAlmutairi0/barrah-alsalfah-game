"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Hash } from "lucide-react";
import Counter from "./counter";
import { toast } from "sonner";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useEffect, useState } from "react";
import { getRoundInfo } from "@/actions/round";



export default function DiscussionHeader() {
  const { playerInfo } = usePlayerInfo();
  const [isImposter, setIsImposter] = useState(false);
  const [secretWord, setSecretWord] = useState("");
  const [roundNumber, setRoundNumber] = useState(0);

  const onCounterFinish = () => {
    toast.info("انتهى الوقت", {
      // Add extra info to the toast
      description: "يرجى إنهاء النقاش والانتقال للخطوة التالية.",
      duration: 4000,
    });
  };

  useEffect(() => {
    if (!playerInfo.roomID) return;

    const fetchRoundInfo = async () => {
      try {
        const round = await getRoundInfo(playerInfo.roomID);
        setIsImposter(round.imposter_id === playerInfo.playerID);
        setSecretWord(round.secret_word);
        setRoundNumber(round.round_number);
      } catch (error) {
        console.error("Error fetching round info:", error);
        toast.error("حدث خطأ ما");
      }
    };

    fetchRoundInfo();
  }, [playerInfo.roomID]);

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
          <Counter timeInSeconds={10} onCounterFinish={onCounterFinish} />
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-accent" />
            <span className="text-lg font-medium">الجولة {roundNumber}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
