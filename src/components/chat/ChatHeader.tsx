"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { MessageCircle, Target } from "lucide-react";

interface ChatHeaderProps {
  onStartVoting: () => void;
  canStartVoting: boolean;
}

export default function ChatHeader({
  onStartVoting,
  canStartVoting,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <CardTitle>النقاش</CardTitle>
      </div>
      <Button
        onClick={onStartVoting}
        disabled={!canStartVoting}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Target className="w-4 h-4 mr-2" />
        ابدأ التصويت
      </Button>
    </div>
  );
}
