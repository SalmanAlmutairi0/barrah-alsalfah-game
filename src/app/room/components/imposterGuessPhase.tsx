"use client";

import React, { useEffect, useState } from "react";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { toast } from "sonner";
import { getRoundInfo } from "@/actions/round";
import { useRoom } from "@/hooks/useRoom";
import { usePlayers } from "@/hooks/usePlayers";
import { getWords } from "@/actions/words";
import ImposterGuessHeader from "@/components/imposterGuessHeader";
import ImposterWordSelection from "@/components/imposterWordSelection";
import ImposterWaitingView from "@/components/imposterWaitingView";

type Imposter = {
  id: number;
  name: string;
};

type Word = {
  id: number;
  word: string;
};

export default function ImposterGotCaught() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [imposter, setImposter] = useState<Imposter | null>(null);
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [timeUp, setTimeUp] = useState(false);
  const { playerInfo } = usePlayerInfo();
  const { room } = useRoom();
  const { players } = usePlayers();
  const isImposter = imposter?.id === playerInfo.playerID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Wait for players and room data to be available
        if (
          players.length === 0 ||
          !room?.selected_catagory ||
          !playerInfo.roomID
        ) {
          return;
        }

        // Get round info
        const roundInfo = await getRoundInfo(playerInfo.roomID);
        const imposterPlayer = players.find(
          (player) => player.id === roundInfo.imposter_id
        );

        if (imposterPlayer) {
          setImposter({
            id: imposterPlayer.id,
            name: imposterPlayer.name,
          });
        }

        setSecretWord(roundInfo.secret_word);

        // Get words from category
        const wordsData = await getWords(room.selected_catagory);

        // Add the secret word to the list if it's not already there
        const wordExists = wordsData.some(
          (w) => w.word === roundInfo.secret_word
        );
        if (!wordExists) {
          wordsData.push({ id: 0, word: roundInfo.secret_word });
        }

        // Shuffle the words
        const shuffledWords = wordsData.sort(() => Math.random() - 0.5);
        setWords(shuffledWords);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ في تحميل البيانات");
      }
    };

    fetchData();
  }, [players, room, playerInfo.roomID]);

  const handleWordSelect = (word: string) => {
    if (!hasSubmitted && !timeUp && isImposter) {
      setSelectedWord(word);
    }
  };

  const handleSubmitGuess = async () => {
    // if (!selectedWord || hasSubmitted || timeUp) return;

    // try {
    //   setHasSubmitted(true);

    //   // Here you might want to store the guess in the database
    //   // For now, we'll just proceed to round summary

    //   await chnageRoomStatus({
    //     roomID: playerInfo.roomID,
    //     status: "round_summary",
    //   });

    const isCorrect = selectedWord === secretWord;
    toast.success(
      isCorrect
        ? "ياسلام عليك, اجابتك صحيحة"
        : "اجابتك غلط, لكن ماعليه تقدر تحاول مره ثانية"
    );
    // } catch (error) {
    //   console.error("Error submitting guess:", error);
    //   toast.error("حدث خطأ في إرسال التخمين");
    //   setHasSubmitted(false);
    // }
  };

  const handleTimerFinish = async () => {
    setTimeUp(true);

    // If imposter hasn't submitted, auto-proceed to round summary
    // if (!hasSubmitted) {
    //   try {
    //     await chnageRoomStatus({
    //       roomID: playerInfo.roomID,
    //       status: "round_summary",
    //     });
    //     toast.info("انتهى الوقت! انتقال إلى ملخص الجولة");
    //   } catch (error) {
    //     console.error("Error updating room status:", error);
    //   }
    // }
  };

  // Show loading state if data is not ready
  if (!imposter || !secretWord || words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">
            جاري تحميل بيانات برا السالفة...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with imposter name and timer */}
        <ImposterGuessHeader
          imposter={imposter}
          onTimerFinish={handleTimerFinish}
        />

        {/* Word Guessing or Waiting Section */}
        {isImposter ? (
          <ImposterWordSelection
            words={words}
            selectedWord={selectedWord}
            hasSubmitted={hasSubmitted}
            timeUp={timeUp}
            onWordSelect={handleWordSelect}
            onSubmitGuess={handleSubmitGuess}
          />
        ) : (
          <ImposterWaitingView imposter={imposter} secretWord={secretWord} />
        )}
      </div>
    </div>
  );
}
