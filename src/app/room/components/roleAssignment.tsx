"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RoleHiddenView from "@/components/roleHiddenView";
import RoleRevealedView from "@/components/roleRevealedView";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { Loader2 } from "lucide-react";
import { getRoundInfo } from "@/actions/round";

export default function RoleAssignment() {
  const [roleRevealed, setRoleRevealed] = useState(false);
  const { playerInfo } = usePlayerInfo();
  const [secretWord, setSecretWord] = useState("");
  const [isImposter, setIsImposter] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerInfo.roomID) return;

    setLoading(true);
    const fetchRoundInfo = async () => {
      try {
        const roundInfo = await getRoundInfo(playerInfo.roomID);
        setSecretWord(roundInfo.secret_word);
        setIsImposter(roundInfo.imposter_id === playerInfo.playerID);
      } catch (error) {
        console.error("Error during role assignment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoundInfo();
  }, [playerInfo.roomID]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold">تعيين الدور</CardTitle>
          <CardDescription>
            {playerInfo.playerName}، هذا هو دورك في هذه الجولة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!roleRevealed ? (
            <RoleHiddenView onReveal={() => setRoleRevealed(true)} />
          ) : (
            <RoleRevealedView
              isImposter={isImposter}
              secretWord={secretWord}
              isHost={playerInfo.isHost}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
