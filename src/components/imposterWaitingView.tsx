"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";

type Imposter = {
  id: number;
  name: string;
};

type ImposterWaitingViewProps = {
  imposter: Imposter;
  secretWord: string;
};

export default function ImposterWaitingView({
  imposter,
  secretWord,
}: ImposterWaitingViewProps) {
  return (
    <Card className="border-2 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Users className="w-6 h-6" />
          ننتظر {imposter.name} يخمن الكلمة
        </CardTitle>
        <CardDescription>
          الكلمة السرية هي:{" "}
          <span className="font-bold text-primary">{secretWord}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto animate-pulse">
            🤔
          </div>
          <p className="text-muted-foreground">
            جاري انتظار تخمين {imposter.name}...
          </p>
          <p className="text-sm text-muted-foreground">تتوقعون يجيبها صح ؟</p>
        </div>
      </CardContent>
    </Card>
  );
}
