import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Target } from "lucide-react";
import { chnageRoomStatus } from "@/actions/rooms";
import { toast } from "sonner";

type RoundActionsProps = {
  roomID: number;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export default function RoundActions({
  roomID,
  loading,
  setLoading,
}: RoundActionsProps) {
  const handleNextRound = async () => {
    try {
      setLoading(true);
      await chnageRoomStatus({
        roomID: roomID,
        status: "catagory_selection",
      });
    } catch (error) {
      console.error("Error starting next round:", error);
      toast.error("حدث خطأ في بدء الجولة التالية");
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            ) : (
              "الجولة التالية"
            )}{" "}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
