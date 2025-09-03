"use client";
import { deletePlayer } from "@/actions/players";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { usePlayers } from "@/hooks/usePlayers";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type KickDialogProps = {
  isKickDialogOpen: boolean;
  setIsKickDialogOpen: (value: boolean) => void;
  player: { id: number; name: string; is_host: boolean };
  setLoading: (value: boolean) => void;
};

export default function KickDialog({
  isKickDialogOpen,
  setIsKickDialogOpen,
  setLoading,
  player,
}: KickDialogProps) {
  const [kickLoading, setKickLoading] = useState(false);
  const { playerInfo, savePlayerInfo } = usePlayerInfo();
  const { players } = usePlayers();

  const realHostID = players.find((p) => p.is_host)?.id;
  const potentiallyFakeHostID = playerInfo.playerID;

  const handleKick = async () => {
    setIsKickDialogOpen(false);

    // if the user change the isHost in the local storage
    if (potentiallyFakeHostID !== realHostID) {
      console.error("Only the real host can kick players.");
      savePlayerInfo({ ...playerInfo, isHost: false });
      return;
    }

    try {
      setKickLoading(true);
      setLoading(true);
      const isKicked = await deletePlayer(player.id, playerInfo.roomID);
      if (isKicked) {
        toast.success("تم طرد الاعب", {
          description: `تم طرد الاعب ${player.name} بنجاح.`,
          action: {
            label: "إغلاق",
            onClick: () => toast.dismiss(),
          },
          duration: 5000,
        });
      } else {
        console.error(`Failed to kick player ${player.name}.`);
      }
    } catch (error) {
      console.error("Error kicking player:", error);
      toast.error("حدث خطاء", {
        description: `حصل خطأ أثناء طرد الاعب ${player.name}. حاول مرة أخرى.`,
        action: {
          label: "إغلاق",
          onClick: () => toast.dismiss(),
        },
        duration: 5000,
      });
    } finally {
      setKickLoading(false);
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right text-xl">
            هل أنت متأكد أنك تريد طرد الاعب {player.name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right text-md">
            لا يمكن التراجع عن هذا الإجراء. سيتم إزالة اللاعب من الغرفة.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-3">
          <AlertDialogCancel
            className="px-9"
            onClick={() => setIsKickDialogOpen(false)}
            disabled={kickLoading}
          >
            تراجع
          </AlertDialogCancel>
          <AlertDialogAction
            className="px-9"
            disabled={kickLoading}
            onClick={handleKick}
          >
            طرد {kickLoading && <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
