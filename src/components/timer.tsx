import { Clock } from "lucide-react";
import React from "react";

export default function Timer() {

    
  const timeLeft = 75;

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-primary" />
      <span
        className={`text-2xl font-bold ${
          timeLeft <= 30 ? "text-destructive animate-pulse" : "text-foreground"
        }`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
