"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Target } from "lucide-react";

type VotingHeaderProps = {
  initialTime?: number;
  onTimerFinish?: () => void;
};

export default function VotingHeader({
  initialTime = 30,
  onTimerFinish = () => {},
}: VotingHeaderProps) {
  const [timeInSeconds, setTimeInSeconds] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeInSeconds === 0) {
      onTimerFinish();
    }
  }, [timeInSeconds, onTimerFinish]);

  return (
    <Card className="border-2 border-destructive/20 shadow-lg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="w-6 h-6 text-destructive" />
          <CardTitle className="text-2xl font-bold text-destructive">
            مرحلة التصويت
          </CardTitle>
        </div>
        <CardDescription className="text-lg">
          من تشك أنه برا السالفة؟ صوت الحين!
        </CardDescription>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Clock
              className={`w-5 h-5 ${
                timeInSeconds <= 10
                  ? "text-destructive animate-pulse"
                  : "text-foreground"
              }`}
            />
            <span
              className={`text-2xl font-bold ${
                timeInSeconds <= 10
                  ? "text-destructive animate-pulse"
                  : "text-foreground"
              }`}
            >
              {formatTime(timeInSeconds)}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
