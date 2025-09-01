"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getVotesAction, sendVoteAction } from "@/actions/votes";

export type Vote = {
  id: number;
  round_id: number;
  voter_id: number;
  target_id: number;
  created_at: string;
};

type VotesContextType = {
  votes: Vote[];
  votesLoading: boolean;
  error?: string | null;
  submitVote: (voterId: number, targetId: number) => Promise<void>;
  hasUserVoted: (userId: number) => boolean;
  getVoteCount: (playerId: number) => number;
};

export const VotesContext = createContext<VotesContextType | undefined>(
  undefined
);

export function VotesProvider({
  roundID,
  children,
}: {
  roundID: number;
  children: React.ReactNode;
}) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit a vote
  const submitVote = async (voterId: number, targetId: number) => {
    try {
      setError(null);

      // Check if user already voted
      const existingVote = votes.find((vote) => vote.voter_id === voterId);
      if (existingVote) {
        throw new Error("لقد صوتت في هذه الجولة");
      }

      // Prevent self-voting
      if (voterId === targetId) {
        throw new Error("مايمديك تصوت على نفسك");
      }

      await sendVoteAction({ roundID, voterId, targetId });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "لم يتم إرسال الصوت";
      setError(errorMessage);
      throw err;
    }
  };

  // Check if user has voted
  const hasUserVoted = (userId: number): boolean => {
    return votes.some((vote) => vote.voter_id === userId);
  };

  // Get vote count for a specific player
  const getVoteCount = (playerId: number): number => {
    return votes.filter((vote) => vote.target_id === playerId).length;
  };

  // Initial fetch
  useEffect(() => {
    if (!roundID) return;

    const fetchVotes = async () => {
      setVotesLoading(true);
      setError(null);

      try {
        const data = await getVotesAction({ roundID });
        setVotes(data || []);
      } catch (error) {
        console.error("لم يتم جلب الصوتات:", error);
        setError(error instanceof Error ? error.message : "لم يتم جلب الصوتات");
      }

      setVotesLoading(false);
    };

    fetchVotes();
  }, [roundID]);

  // Real-time updates
  useEffect(() => {
    if (!roundID) return;

    const channel = supabase
      .channel(`votes-${roundID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `round_id=eq.${roundID}`,
        },
        (payload) => {
          setVotes((prev) => [...prev, payload.new as Vote]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "votes",
          filter: `round_id=eq.${roundID}`,
        },
        (payload) => {
          setVotes((prev) => prev.filter((vote) => vote.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roundID]);

  return (
    <VotesContext.Provider
      value={{
        votes,
        votesLoading,
        error,
        submitVote,
        hasUserVoted,
        getVoteCount,
      }}
    >
      {children}
    </VotesContext.Provider>
  );
}
