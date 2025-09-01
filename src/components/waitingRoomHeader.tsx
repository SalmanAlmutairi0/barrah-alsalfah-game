"use client";
import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { GamepadIcon, Copy, Check } from "lucide-react";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { toast } from "sonner";

export default function WaitingRoomHeader() {
  const { playerInfo } = usePlayerInfo();
  const [copied, setCopied] = useState(false);

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(playerInfo.roomKey);
      setCopied(true);
      toast.success("تم نسخ رقم الغرفة!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("فشل في نسخ رقم الغرفة");
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-float">
            <GamepadIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="text-center sm:text-right">
            <CardTitle className="text-2xl sm:text-3xl p-3 font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              في انتظار الاعبين
            </CardTitle>
            
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Badge variant="outline" className="text-lg shadow sm:text-xl px-3 py-1 sm:px-4 sm:py-2 font-mono">
            {playerInfo.roomKey}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRoomCode}
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            {copied ? (
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            {copied ? "تم النسخ" : "نسخ"}
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 px-2">
          <span className="hidden sm:inline">شارك هذا الرمز مع أصدقائك للانضمام إلى اللعبة</span>
          <span className="sm:hidden">شارك الرمز مع أصدقائك</span>
        </p>
      </CardHeader>
    </Card>
  );
}
