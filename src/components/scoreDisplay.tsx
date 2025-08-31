"use client";
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Coins, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

interface ScoreDisplayProps {
  currentScore: number;
  previousScore?: number;
  isLoading?: boolean;
  showAnimation?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  duration?: number;
}

export default function ScoreDisplay({
  currentScore,
  previousScore,
  isLoading = false,
  showAnimation = true,
  size = "md",
  className,
  duration = 1.5,
}: ScoreDisplayProps) {
  const [showChangeIndicator, setShowChangeIndicator] = useState(false);

  // Calculate score difference
  const scoreDifference =
    previousScore !== undefined ? currentScore - previousScore : 0;
  const hasIncreased = scoreDifference > 0;
  const hasDecreased = scoreDifference < 0;

  // Size configurations with responsive classes
  const sizeConfig = {
    sm: {
      text: "text-xs sm:text-sm",
      icon: "w-2 h-2 sm:w-3 sm:h-3",
      coins: "w-3 h-3 sm:w-4 sm:h-4",
      loader: "w-2 h-2 sm:w-3 sm:h-3",
      badge: "text-xs",
    },
    md: {
      text: "text-sm sm:text-base md:text-lg",
      icon: "w-3 h-3 sm:w-4 sm:h-4",
      coins: "w-4 h-4 sm:w-5 sm:h-5",
      loader: "w-3 h-3 sm:w-4 sm:h-4",
      badge: "text-xs sm:text-sm",
    },
    lg: {
      text: "text-base sm:text-lg md:text-xl lg:text-2xl",
      icon: "w-4 h-4 sm:w-5 sm:h-5",
      coins: "w-5 h-5 sm:w-6 sm:h-6",
      loader: "w-4 h-4 sm:w-5 sm:h-5",
      badge: "text-sm sm:text-base",
    },
  };

  const config = sizeConfig[size];

  // Show change indicator when score changes
  useEffect(() => {
    if (showAnimation && scoreDifference !== 0) {
      setShowChangeIndicator(true);
      const timer = setTimeout(() => {
        setShowChangeIndicator(false);
      }, duration * 1000 + 500); // Show for animation duration + 500ms

      return () => clearTimeout(timer);
    }
  }, [currentScore, previousScore, showAnimation, duration, scoreDifference]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Coins className={cn("text-yellow-500 animate-pulse", config.coins)} />
        <Loader2
          className={cn("animate-spin text-muted-foreground", config.loader)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Money icon */}
      <Coins className={cn("text-yellow-500", config.coins)} />

      {/* Score with CountUp animation - no arrows, just the number */}
      <span
        className={cn(
          "font-bold transition-colors duration-300",
          config.text,
          currentScore < 0 ? "text-red-600" : "text-primary"
        )}
      >
        <CountUp
          start={previousScore !== undefined ? previousScore : currentScore}
          end={currentScore}
          duration={duration}
          preserveValue
          useEasing
        />
      </span>
    </div>
  );
}
