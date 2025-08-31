"use client";
import React from "react";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

interface RoundPointsDisplayProps {
  roundPoints: number;
  showAnimation?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  duration?: number;
  variant?: "default" | "badge" | "inline";
}

export default function RoundPointsDisplay({
  roundPoints,
  showAnimation = true,
  size = "md",
  className,
  duration = 1.5,
  variant = "default",
}: RoundPointsDisplayProps) {
  const isPositive = roundPoints > 0;
  const isNegative = roundPoints < 0;
  const isZero = roundPoints === 0;

  // Size configurations with responsive classes
  const sizeConfig = {
    sm: {
      text: "text-xs sm:text-sm",
      icon: "w-2 h-2 sm:w-3 sm:h-3",
      padding: "px-1 py-0.5 sm:px-2 sm:py-1",
    },
    md: {
      text: "text-sm sm:text-base",
      icon: "w-3 h-3 sm:w-4 sm:h-4",
      padding: "px-2 py-1 sm:px-3 sm:py-1.5",
    },
    lg: {
      text: "text-base sm:text-lg",
      icon: "w-4 h-4 sm:w-5 sm:h-5",
      padding: "px-3 py-1.5 sm:px-4 sm:py-2",
    },
  };

  const config = sizeConfig[size];

  // Color and icon based on points
  const getStyles = () => {
    if (isPositive) {
      return {
        textColor: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
        icon: <ArrowUp className={config.icon} />,
        trendIcon: <TrendingUp className={config.icon} />,
      };
    } else if (isNegative) {
      return {
        textColor: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
        icon: <ArrowDown className={config.icon} />,
        trendIcon: <TrendingDown className={config.icon} />,
      };
    } else {
      return {
        textColor: "text-gray-500",
        bgColor: "bg-gray-50 border-gray-200",
        icon: <div className={cn(config.icon, "rounded-full bg-gray-300")} />,
        trendIcon: (
          <div className={cn(config.icon, "rounded-full bg-gray-300")} />
        ),
      };
    }
  };

  const styles = getStyles();

  // Don't show if zero points
  if (isZero) {
    return null;
  }

  const pointsText = isPositive ? `+${roundPoints}` : `${roundPoints}`;

  // Badge variant - compact display
  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-full border",
          config.padding,
          styles.bgColor,
          styles.textColor,
          "font-medium",
          config.text,
          className
        )}
      >
        {styles.icon}
        {showAnimation ? (
          <CountUp
            start={0}
            end={roundPoints}
            duration={duration}
            preserveValue
            useEasing
            formattingFn={(value) => (value > 0 ? `+${value}` : `${value}`)}
          />
        ) : (
          pointsText
        )}
      </div>
    );
  }

  // Inline variant - minimal display
  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-medium",
          styles.textColor,
          config.text,
          className
        )}
      >
        {styles.icon}
        {showAnimation ? (
          <CountUp
            start={0}
            end={roundPoints}
            duration={duration}
            preserveValue
            useEasing
            formattingFn={(value) => (value > 0 ? `+${value}` : `${value}`)}
          />
        ) : (
          pointsText
        )}
      </span>
    );
  }

  // Default variant - full display with background
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border",
        config.padding,
        styles.bgColor,
        className
      )}
    >
      <div className={cn("flex items-center gap-1", styles.textColor)}>
        {styles.trendIcon}
        <span className={cn("font-bold", config.text)}>
          {showAnimation ? (
            <CountUp
              start={0}
              end={roundPoints}
              duration={duration}
              preserveValue
              useEasing
              formattingFn={(value) => (value > 0 ? `+${value}` : `${value}`)}
            />
          ) : (
            pointsText
          )}
        </span>
      </div>
    </div>
  );
}
