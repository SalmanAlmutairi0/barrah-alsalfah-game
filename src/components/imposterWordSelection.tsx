"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lightbulb, Target } from "lucide-react";

type Word = {
  id: number;
  word: string;
};

type ImposterWordSelectionProps = {
  words: Word[];
  selectedWord: string | null;
  hasSubmitted: boolean;
  timeUp: boolean;
  onWordSelect: (word: string) => void;
  onSubmitGuess: () => void;
};

export default function ImposterWordSelection({
  words,
  selectedWord,
  hasSubmitted,
  timeUp,
  onWordSelect,
  onSubmitGuess,
}: ImposterWordSelectionProps) {
  return (
    <Card className="border-2 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-600">
          <Lightbulb className="w-6 h-6" />
          خمن الكلمة السرية
        </CardTitle>
        <CardDescription>
          اختر الكلمة التي تعتقد أنها الكلمة الي كان يسألون عنها اخوياك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {words.map((word, index) => (
            <Button
              key={index}
              variant={selectedWord === word.word ? "default" : "outline"}
              className={`h-16 text-lg font-semibold transition-all ${
                selectedWord === word.word
                  ? "border-2 border-primary shadow-lg"
                  : "hover:border-primary/50"
              } ${hasSubmitted || timeUp ? "opacity-50" : ""}`}
              onClick={() => onWordSelect(word.word)}
              disabled={hasSubmitted || timeUp}
            >
              {word.word}
            </Button>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={onSubmitGuess}
            disabled={!selectedWord || hasSubmitted || timeUp}
            className="h-12 px-8 text-lg font-semibold"
            size="lg"
          >
            {hasSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                تم الإرسال
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                تأكيد التخمين
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
