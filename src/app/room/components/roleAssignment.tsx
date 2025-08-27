"use client";
import { useState } from "react";
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

export default function RoleAssignment() {
  const [roleRevealed, setRoleRevealed] = useState(false);
  const [isImposter] = useState(false);
  const { playerInfo } = usePlayerInfo();

  const secretWord = "موز";

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
            <RoleRevealedView isImposter={isImposter} secretWord={secretWord} isHost={playerInfo.isHost} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
