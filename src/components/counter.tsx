"use Client";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

type CounterProps = {
  timeInSeconds: number;
  onCounterFinish: () => void;
  clockColor?: "primary" | "destructive";
};

export default function Counter({
  timeInSeconds,
  onCounterFinish,
  clockColor = "primary",
}: CounterProps) {
  const [hasFinished, setHasFinished] = useState(false);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    // Reset finished state when timeInSeconds changes
    setHasFinished(false);
  }, [timeInSeconds]);

  useEffect(() => {
    // Call onCounterFinish when timer reaches 0 and hasn't been called yet
    if (timeInSeconds <= 1 && !hasFinished) {
      setHasFinished(true);
      onCounterFinish();
    }
  }, [timeInSeconds, onCounterFinish, hasFinished]);

  return (
    <div className="flex items-center gap-2">
      <Clock
        className={`w-5 h-5 ${
          clockColor === "primary" ? "text-primary" : "text-destructive"
        }`}
      />
      <span
        className={`text-2xl font-bold ${
          timeInSeconds <= 30
            ? "text-destructive animate-pulse"
            : "text-foreground"
        }`}
      >
        {formatTime(timeInSeconds)}
      </span>
    </div>
  );
}
