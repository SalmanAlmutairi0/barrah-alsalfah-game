import DiscussionChat from "@/components/discussionChat";
import DiscussionHeader from "@/components/discussionHeader";
import WaitingRoomPlayers from "@/components/waitingRoomPlayers";
import { MessagesProvider } from "@/context/messagesContext";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { getRoundInfo } from "@/actions/round";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RoundInProgress() {
  const { playerInfo } = usePlayerInfo();
  const [roundID, setRoundID] = useState<number | null>(null);

  useEffect(() => {
    if (!playerInfo.roomID) return;
    const fetchRoundInfo = async () => {
      try {
        const round = await getRoundInfo(playerInfo.roomID);
        setRoundID(round.id);
      } catch (error) {
        console.error("Error fetching round info:", error);
        toast.error("حدث خطأ ما");
      }
    };
    fetchRoundInfo();
  }, [playerInfo.roomID]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container p-4 max-w-6xl mx-auto space-y-6">
        <DiscussionHeader />

        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4 w-full">
          <div className="w-full md:basis-2/3 md:max-w-[66%] min-w-0">
            <MessagesProvider roundID={roundID || 0}>
              <DiscussionChat />
            </MessagesProvider>
          </div>

          <div className="w-full md:basis-1/3 md:max-w-[34%]">
            <WaitingRoomPlayers />
          </div>
        </div>
      </div>
    </div>
  );
}
