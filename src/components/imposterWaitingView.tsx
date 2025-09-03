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
  imposterGuess?: {
    word: string;
    isCorrect: boolean;
    imposterName: string;
  } | null;
};

export default function ImposterWaitingView({
  imposter,
  secretWord,
  imposterGuess,
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
          {imposterGuess ? (
            // Show the guess result
            <>
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto ${
                  imposterGuess.isCorrect
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gradient-to-br from-red-500 to-red-600"
                }`}
              >
                {imposterGuess.isCorrect ? "✅" : "❌"}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {imposter.name} خمن:
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-white font-bold ${
                      imposterGuess.isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {imposterGuess.word}
                  </span>
                </p>
                <p
                  className={`text-lg font-bold ${
                    imposterGuess.isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {imposterGuess.isCorrect
                    ? "إجابة صحيحة! 🎉"
                    : "إجابة خاطئة! 💔"}
                </p>
                <p className="text-sm text-muted-foreground">
                  الكلمة الصحيحة كانت:{" "}
                  <span className="font-bold text-primary">{secretWord}</span>
                </p>
              </div>
            </>
          ) : (
            // Show waiting state
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto animate-pulse">
                🤔
              </div>
              <p className="text-muted-foreground">
                جاري انتظار تخمين {imposter.name}...
              </p>
              <p className="text-sm text-muted-foreground">
                تتوقعون يجيبها صح ؟
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
