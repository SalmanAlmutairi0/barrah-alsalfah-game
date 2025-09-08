import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { usePlayers } from "@/hooks/usePlayers";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { ScrollArea } from "./ui/scroll-area";
import { User, Crown } from "lucide-react";
import { Badge } from "./ui/badge";

type SelectTargetDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTarget?: (playerId: number) => void;
};

export default function SelectTargetDialog({
  isOpen,
  onOpenChange,
  onSelectTarget,
}: SelectTargetDialogProps) {
  const { players } = usePlayers();
  const { playerInfo } = usePlayerInfo();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  // Filter out the current player from the list
  const availablePlayers = players.filter(
    (player) => player.id !== playerInfo.playerID
  );

  const handleSelectPlayer = (playerId: number) => {
    setSelectedPlayerId(playerId);
  };

  const handleConfirm = () => {
    if (selectedPlayerId && onSelectTarget) {
      onSelectTarget(selectedPlayerId);
      onOpenChange(false);
      setSelectedPlayerId(null);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedPlayerId(null);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center" dir="rtl">
            اختر من تريد أن تسأله
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center" dir="rtl">
            اختر لاعب من القائمة لتوجه له سؤالك
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-64">
          <div className="space-y-2 p-2">
            {availablePlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted ${
                  selectedPlayerId === player.id
                    ? "bg-primary/10 border-primary"
                    : "bg-background border-border hover:border-primary/50"
                }`}
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {player.is_host && (
                    <Badge
                      variant="secondary"
                      className="bg-accent text-accent-foreground flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3" />
                      مضيف
                    </Badge>
                  )}
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}

            {availablePlayers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا يوجد لاعبين متاحين</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <AlertDialogFooter className="flex gap-2" dir="rtl">
          <AlertDialogCancel onClick={handleCancel}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedPlayerId}
            className="bg-primary hover:bg-primary/90"
          >
            اختيار
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
