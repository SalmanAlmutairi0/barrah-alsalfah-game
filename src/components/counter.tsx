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
  const [secondsLeft, setSecondsLeft] = useState(timeInSeconds);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    setSecondsLeft(timeInSeconds);
  }, [timeInSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onCounterFinish();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onCounterFinish]);

  return (
    <div className="flex items-center gap-2">
      <Clock className={`w-5 h-5 ${clockColor === "primary" ? "text-primary" : "text-destructive"}`} />
      <span
        className={`text-2xl font-bold ${
          secondsLeft <= 30
            ? "text-destructive animate-pulse"
            : "text-foreground"
        }`}
      >
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
}
