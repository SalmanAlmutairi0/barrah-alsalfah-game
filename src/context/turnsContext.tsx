"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  completeTurn,
  getAvailableTurns,
  getTargetSelectedAt,
  getTurnsHistory,
  Turn,
} from "@/actions/turns";
import { socket } from "@/lib/socket";

// create a context for turns
export const TurnsContext = createContext<TurnsContextType | undefined>(
  undefined
);

type TurnsContextType = {
  availableTurns: Turn[];
  currentTurn: Turn | null;
  //   handleSetCurrentTurn: (turn: Turn) => void;
  //   handleSetAvailableTurns: (turns: Turn[]) => void;
  turnLoading: boolean;
  turnsHistory: Turn[];
  remainingSeconds: number | null;
  isFreeRound: boolean;
};

export const TurnsProvider = ({
  children,
  roundID,
  roomID,
}: {
  children: React.ReactNode;
  roundID: number;
  roomID: number;
}) => {
  const [availableTurns, setAvailableTurns] = useState<Turn[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null);
  const [turnLoading, setTurnLoading] = useState<boolean>(true);
  const [turnsHistory, setTurnsHistory] = useState<Turn[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isFreeRound, setIsFreeRound] = useState<boolean>(false);
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  //   const handleSetCurrentTurn = (turn: Turn) => {
  //     setCurrentTurn(turn);
  //   };

  //   const handleSetAvailableTurns = (turns: Turn[]) => {
  //     setAvailableTurns(turns);
  //   };

  useEffect(() => {
    if (!roundID || roundID === 0 || !roomID || roomID === 0) return;

    console.log("TurnsProvider useEffect running with roundID:", roundID);

    const fetchAvailableTurns = async () => {
      console.log("Fetching turns for roundID:", roundID);
      try {
        const turns = await getAvailableTurns(roundID);
        console.log("Fetched turns:", turns);
        setAvailableTurns(() => turns);
        setCurrentTurn(
          () => turns.find((t) => !!t.target_id) || turns[0] || null
        );
        console.log("Current turn:", currentTurn);

        // Check if we should start free round immediately after fetching
        if (!turns || turns.length === 0) {
          console.log("No turns available, checking for free round");
          setIsFreeRound(true);
          setRemainingSeconds(60);

          // Start countdown
          setTimeout(() => {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            countdownIntervalRef.current = setInterval(() => {
              setRemainingSeconds((prev) => {
                if (prev === null || prev <= 1) {
                  if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                  }
                  return null;
                }
                return prev - 1;
              });
            }, 1000);
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching turns:", error);
      } finally {
        setTurnLoading(false);
      }
    };

    const fetchTurnsHistory = async () => {
      try {
        const history = await getTurnsHistory(roundID, roomID);
        setTurnsHistory(history || []);
      } catch (e) {
        console.error("Failed to fetch turns history", e);
      }
    };

    fetchAvailableTurns();
    fetchTurnsHistory();

    const handleTurnsCreated = (turns: Turn[]) => {
      setAvailableTurns(() => turns);
      setCurrentTurn(
        () => turns.find((t) => !!t.target_id) || turns[0] || null
      );
      console.log("Current turn:", currentTurn);
    };

    const handleTurnCompleted = (turn_id: number) => {
      setAvailableTurns((prev) => {
        const completedTurn = prev.find((turn) => turn.id === turn_id);
        const filtered = prev.filter((turn) => turn.id !== turn_id);
        setCurrentTurn(
          filtered.find((t) => !!t.target_id) || filtered[0] || null
        );
        if (completedTurn) {
          setTurnsHistory((prevHistory) => {
            if (prevHistory.some((t) => t.id === completedTurn.id)) {
              return prevHistory;
            }
            return [...prevHistory, { ...completedTurn, is_completed: true }];
          });
        }

        // Check if this was the last turn - if so, start free round
        if (filtered.length === 0) {
          console.log("Last turn completed, starting free round!");
          setIsFreeRound(true);
          setRemainingSeconds(60);

          // Start countdown
          setTimeout(() => {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            countdownIntervalRef.current = setInterval(() => {
              setRemainingSeconds((prev) => {
                if (prev === null || prev <= 1) {
                  if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                  }
                  return null;
                }
                return prev - 1;
              });
            }, 1000);
          }, 100);
        }

        return filtered;
      });
      console.log("Current turn:", currentTurn);
    };

    const handleTargetSelectionUpdated = (data: {
      turn_id: number;
      questionar_id: number;
      target_id: number;
      selected_at?: number;
    }) => {
      setAvailableTurns((prev) => {
        const updated = prev.map((t) =>
          t.id === data.turn_id ? { ...t, target_id: data.target_id } : t
        );
        // Make this the current turn explicitly
        const nowCurrent = updated.find((t) => t.id === data.turn_id) || null;
        setCurrentTurn(nowCurrent);
        try {
          if (data.selected_at) {
            localStorage.setItem(
              `turn_selected_at_${data.turn_id}`,
              String(data.selected_at)
            );
          }
        } catch (e) {}
        // Update countdown when target is selected
        updateCountdown(data.turn_id);
        return updated;
      });
    };

    socket.on("turns-created", handleTurnsCreated);
    socket.on("turn-completed", handleTurnCompleted);
    socket.on("target-selection-updated", handleTargetSelectionUpdated);

    return () => {
      socket.off("turns-created", handleTurnsCreated);
      socket.off("turn-completed", handleTurnCompleted);
      socket.off("target-selection-updated", handleTargetSelectionUpdated);
    };
  }, [roundID, roomID]);

  // Check if all players have asked questions (free round logic)
  useEffect(() => {
    if (!availableTurns.length && !turnLoading) {
      // All turns completed - start free round
      if (!isFreeRound) {
        console.log("Starting free round!");

        // Clear any existing timer first
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }

        // Set state changes in correct order
        setIsFreeRound(true);
        setRemainingSeconds(60); // 1 minute for free round

        // Start 1-minute countdown for free round after state update
        setTimeout(() => {
          countdownIntervalRef.current = setInterval(() => {
            setRemainingSeconds((prev) => {
              if (prev === null || prev <= 1) {
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                  countdownIntervalRef.current = null;
                }
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }, 100); // Small delay to ensure state is updated
      }
    } else if (availableTurns.length > 0) {
      // Reset free round if there are available turns
      setIsFreeRound(false);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setRemainingSeconds(null);
    }
  }, [availableTurns.length, turnLoading]);

  // Auto-complete the turn 30s after target selection, resilient to refresh
  useEffect(() => {
    if (!currentTurn || !roomID) return;

    // Clear any previous timer
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }

    // Only schedule when a target is selected and turn not completed
    if (currentTurn.target_id && !currentTurn.is_completed) {
      const schedule = async () => {
        let selectedAt: number | null = null;
        try {
          const stored = localStorage.getItem(
            `turn_selected_at_${currentTurn.id}`
          );
          if (stored) selectedAt = Number(stored);
        } catch (e) {}

        // Fallback: ask server memory map if available
        if (!selectedAt) {
          try {
            selectedAt = await getTargetSelectedAt(currentTurn.id);
          } catch (e) {
            selectedAt = null;
          }
        }

        const now = Date.now();
        const remaining = selectedAt
          ? Math.max(0, 30000 - (now - selectedAt))
          : 30000;

        if (remaining === 0) {
          await completeTurn(currentTurn.id, roomID);
          return;
        }

        completionTimerRef.current = setTimeout(async () => {
          await completeTurn(currentTurn.id, roomID);
        }, remaining);
      };

      schedule();
    }

    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      }
    };
  }, [currentTurn, roomID]);

  // Countdown timer effect
  const updateCountdown = (turnId?: number) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    const targetTurnId = turnId || currentTurn?.id;
    if (!targetTurnId || !currentTurn?.target_id || isFreeRound) {
      if (!isFreeRound) setRemainingSeconds(null);
      return;
    }

    const calculateRemaining = () => {
      let selectedAt: number | null = null;
      try {
        const stored = localStorage.getItem(`turn_selected_at_${targetTurnId}`);
        if (stored) selectedAt = Number(stored);
      } catch (e) {}

      if (!selectedAt) {
        setRemainingSeconds(null);
        return;
      }

      const now = Date.now();
      const elapsed = now - selectedAt;
      const remaining = Math.max(0, Math.ceil((30000 - elapsed) / 1000));

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setRemainingSeconds(null);
      }
    };

    calculateRemaining();
    countdownIntervalRef.current = setInterval(calculateRemaining, 1000);
  };

  useEffect(() => {
    if (!isFreeRound && currentTurn?.target_id) {
      updateCountdown();
    } else if (!isFreeRound) {
      setRemainingSeconds(null);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      if (countdownIntervalRef.current && !isFreeRound) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [currentTurn, isFreeRound]);

  return (
    <TurnsContext.Provider
      value={{
        availableTurns,
        currentTurn,
        turnsHistory,
        // handleSetCurrentTurn,
        // handleSetAvailableTurns,
        turnLoading,
        remainingSeconds,
        isFreeRound,
      }}
    >
      {children}
    </TurnsContext.Provider>
  );
};
