import DiscussionChat from "@/components/discussionChat";
import DiscussionHeader from "@/components/discussionHeader";
import WaitingRoomPlayers from "@/components/waitingRoomPlayers";

export default function RoundInProgress() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container p-4 max-w-6xl mx-auto space-y-6">
        <DiscussionHeader />

        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4 w-full">
          <div className="w-full md:basis-2/3 md:max-w-[66%] min-w-0">
            <DiscussionChat />
          </div>

          <div className="w-full md:basis-1/3 md:max-w-[34%]">
            <WaitingRoomPlayers />
          </div>
        </div>
      </div>
    </div>
  );
}
