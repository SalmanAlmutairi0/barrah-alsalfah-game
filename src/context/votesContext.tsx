"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  getUserVote: (userId: number) => Vote | null;
  deleteVote: (voteId: number) => Promise<void>;
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

      const { data, error } = await supabase
        .from("votes")
        .insert({
          round_id: roundID,
          voter_id: voterId,
          target_id: targetId,
        })
        .select("id, round_id, voter_id, target_id, created_at")
        .single();

      if (error) {
        console.error("لم يتم إرسال الصوت:", error);
        throw new Error(error.message);
      }

      // Real-time will handle the state update, but we can also update locally for immediate feedback
      // setVotes(prev => [...prev, data]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "لم يتم إرسال الصوت";
      setError(errorMessage);
      throw err;
    }
  };

  // Delete a vote (if needed for vote changes)
  const deleteVote = async (voteId: number) => {
    try {
      setError(null);

      const { error } = await supabase.from("votes").delete().eq("id", voteId);

      if (error) {
        console.error("لم يتم حذف الصوت:", error);
        throw new Error(error.message);
      }

      // Real-time will handle the state update
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "لم يتم حذف الصوت";
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

  // Get user's vote if they have voted
  const getUserVote = (userId: number): Vote | null => {
    return votes.find((vote) => vote.voter_id === userId) || null;
  };

  // Initial fetch
  useEffect(() => {
    if (!roundID) return;

    const fetchVotes = async () => {
      setVotesLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("votes")
        .select("id, round_id, voter_id, target_id, created_at")
        .eq("round_id", roundID)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("لم يتم جلب الصوتات:", error);
        setError(error.message);
      } else {
        setVotes(data || []);
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
        getUserVote,
        deleteVote,
      }}
    >
      {children}
    </VotesContext.Provider>
  );
}
