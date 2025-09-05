"use client";

import React, { useEffect, useState } from "react";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { toast } from "sonner";
import { getRoundInfo } from "@/actions/round";
import { useRoom } from "@/hooks/useRoom";
import { usePlayers } from "@/hooks/usePlayers";
import { getWords } from "@/actions/words";
import { updateImposterCaughtScore } from "@/actions/players";
import { chnageRoomStatus } from "@/actions/rooms";
import ImposterGuessHeader from "@/components/imposterGuessHeader";
import ImposterWordSelection from "@/components/imposterWordSelection";
import ImposterWaitingView from "@/components/imposterWaitingView";
import { socket } from "@/lib/socket.js";

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
  const [imposterGuess, setImposterGuess] = useState<{
    word: string;
    isCorrect: boolean;
    imposterName: string;
  } | null>(null);
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
          !room?.selectedCatagory ||
          !playerInfo.roomID
        ) {
          return;
        }

        // Get round info
        const roundInfo = await getRoundInfo(playerInfo.roomID);
        const imposterPlayer = players.find(
          (player) => player.id === roundInfo.imposterID
        );

        if (imposterPlayer) {
          setImposter({
            id: imposterPlayer.id,
            name: imposterPlayer.name,
          });
        }

        setSecretWord(roundInfo.secretWord);

        // Get words from category
        const wordsData = await getWords(room.selectedCatagory);

        // Add the secret word to the list if it's not already there
        const wordExists = wordsData.some(
          (w) => w.word === roundInfo.secretWord
        );
        if (!wordExists) {
          wordsData.push({ id: 0, word: roundInfo.secretWord });
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

  // Listen for imposter guess submissions
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleImposterGuessSubmitted = (data: {
      imposterGuess: string;
      isCorrect: boolean;
      imposterName: string;
    }) => {
      setImposterGuess({
        word: data.imposterGuess,
        isCorrect: data.isCorrect,
        imposterName: data.imposterName,
      });
    };

    socket.on("imposter-guess-submitted", handleImposterGuessSubmitted);

    return () => {
      socket.off("imposter-guess-submitted", handleImposterGuessSubmitted);
    };
  }, []);

  const handleWordSelect = (word: string) => {
    if (!hasSubmitted && !timeUp && isImposter) {
      setSelectedWord(word);
    }
  };

  const handleSubmitGuess = async () => {
    if (!selectedWord || hasSubmitted || timeUp || !isImposter) return;

    try {
      setHasSubmitted(true);

      // Check if guess is correct
      const isCorrect = selectedWord === secretWord;

      // Emit the imposter's guess to all players in the room via socket
      socket.emit("imposter-guess-submitted", {
        roomId: playerInfo.roomID,
        imposterGuess: selectedWord,
        isCorrect: isCorrect,
        imposterName: imposter?.name,
      });

      // Update imposter score based on guess
      if (imposter?.id) {
        await updateImposterCaughtScore(imposter.id, isCorrect);
      }

      // Show feedback to user
      toast.success(
        isCorrect
          ? "ياسلام عليك! اجابتك صحيحة - حصلت على نقاط إضافية"
          : "اجابتك غلط - تم خصم نقاط منك"
      );

      // Wait a moment for user to see the feedback
      setTimeout(async () => {
        // Proceed to round summary
        await chnageRoomStatus({
          roomID: playerInfo.roomID,
          status: "round_summary",
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting guess:", error);
      toast.error("حدث خطأ في إرسال التخمين");
      setHasSubmitted(false);
    }
  };

  const handleTimerFinish = async () => {
    setTimeUp(true);

    // If imposter hasn't submitted, give them penalty and proceed
    if (!hasSubmitted && isImposter && imposter?.id) {
      try {
        // Give penalty for not guessing (treated as wrong guess)
        await updateImposterCaughtScore(imposter.id, false);

        toast.error("انتهى الوقت! تم خصم نقاط منك لعدم التخمين");

        // Wait a moment then proceed to round summary
        setTimeout(async () => {
          await chnageRoomStatus({
            roomID: playerInfo.roomID,
            status: "round_summary",
          });
        }, 2000);
      } catch (error) {
        console.error("Error updating room status:", error);
      }
    } else if (!isImposter) {
      // For non-imposters, just proceed to round summary when time is up
      try {
        await chnageRoomStatus({
          roomID: playerInfo.roomID,
          status: "round_summary",
        });
        toast.info("انتهى الوقت! انتقال إلى ملخص الجولة");
      } catch (error) {
        console.error("Error updating room status:", error);
      }
    }
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
          <ImposterWaitingView
            imposter={imposter}
            secretWord={secretWord}
            imposterGuess={imposterGuess}
          />
        )}
      </div>
    </div>
  );
}
