"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target } from "lucide-react";
import Counter from "./counter";

type VotingHeaderProps = {
  initialTime?: number;
  onTimerFinish?: () => void;
};

export default function VotingHeader({
  initialTime = 30,
  onTimerFinish = () => {},
}: VotingHeaderProps) {
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
          من تشك أنه برا السالفة؟ صوت الآن!
        </CardDescription>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Counter
            timeInSeconds={initialTime}
            clockColor="destructive"
            onCounterFinish={onTimerFinish}
          />
        </div>
      </CardHeader>
    </Card>
  );
}
