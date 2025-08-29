"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import Counter from "@/components/counter";

type Imposter = {
  id: number;
  name: string;
};

type ImposterGuessHeaderProps = {
  imposter: Imposter;
  onTimerFinish: () => void;
};

export default function ImposterGuessHeader({
  imposter,
  onTimerFinish,
}: ImposterGuessHeaderProps) {
  return (
    <Card className="border-2 border-red-500/30 shadow-lg bg-red-50/10">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Target className="w-8 h-8 text-red-500" />
          <CardTitle className="text-3xl font-bold text-red-600">
            الي برا السالفة انقفط
          </CardTitle>
        </div>

        {/* Imposter Name Display */}
        <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-red-100/30 rounded-lg border border-red-200/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
            {imposter.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-red-600">{imposter.name}</h2>
          <Badge variant="destructive" className="mt-1">
            برا السالفة
          </Badge>
        </div>

        <CardDescription className="text-lg mb-4">
          {imposter.name}, عندك 30 ثانية عشان تخمن الكلمة
        </CardDescription>

        {/* Timer */}
        <div className="flex items-center justify-center">
          <Counter
            timeInSeconds={30}
            onCounterFinish={onTimerFinish}
            clockColor="destructive"
          />
        </div>
      </CardHeader>
    </Card>
  );
}
