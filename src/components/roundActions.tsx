import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { chnageRoomStatus } from "@/actions/rooms";
import { toast } from "sonner";

interface RoundActionsProps {
  roomID: number;
}

export default function RoundActions({ roomID }: RoundActionsProps) {
  const handleNextRound = async () => {
    try {
      await chnageRoomStatus({
        roomID: roomID,
        status: "catagory_selection",
      });
    } catch (error) {
      console.error("Error starting next round:", error);
      toast.error("حدث خطأ في بدء الجولة التالية");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full h-10 sm:h-12 text-base sm:text-lg font-semibold"
            variant="default"
            onClick={handleNextRound}
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            الجولة التالية
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
