"use server";

import { supabase } from "@/lib/supabaseClient";

type PlayerInsertResponse = { id: number };

type CreatePlayerParams = {
  playerName: string;
  isHost: boolean;
  roomID?: number;
};

export const createPlayer = async ({
  playerName,
  isHost,
  roomID,
}: CreatePlayerParams) => {
  const { data, error } = await supabase
    .from("players")
    .insert({
      name: playerName,
      is_host: isHost,
      room_id: roomID,
      is_active: true,
    })
    .select("id")
    .single<PlayerInsertResponse>();

  if (error) {
    console.error("Error creating player:", error);
    throw error;
  }

  const playerID = data.id;

  return playerID;
};

export const deletePlayer = async (playerID: number) => {
  try {
    const { error } = await supabase
      .from("players")
      .update({ is_active: false })
      .eq("id", playerID);

    if (error) throw error;

    console.log(`Player with ID ${playerID} has been deleted.`);
    return true;
  } catch (error) {
    console.error("Error deleting player:", error);
    throw error;
  }
};

export const updatePlayerScores = async (
  imposterID: number,
  mostVotedPlayerID: number | null,
  isTie: boolean,
  players: any[],
  votes: any[]
) => {
  try {
    for (const player of players) {
      const isImposter = player.id === imposterID;
      const votedForImposter = votes.some(
        (vote) => vote.voter_id === player.id && vote.target_id === imposterID
      );
      const didVote = votes.some((vote) => vote.voter_id === player.id);

      let scoreToAdd = 0;

      if (isImposter) {
        // IMPOSTER: Only give points if survived, caught = 0 for now
        if (mostVotedPlayerID !== imposterID || isTie) {
          scoreToAdd = 200; // Survived
        }
      } else {
        // INNOCENT
        if (!didVote) {
          scoreToAdd = -25; // Didn't vote
        } else if (
          votedForImposter &&
          mostVotedPlayerID === imposterID &&
          !isTie
        ) {
          scoreToAdd = 150; // Caught imposter
        } else if (votedForImposter) {
          scoreToAdd = 75; // Voted for imposter but they survived
        }
        // If voted for innocent = 0 points (default)
      }

      // Update score if not zero
      if (scoreToAdd !== 0) {
        const currentScore = player.score || 0;
        await supabase
          .from("players")
          .update({ score: currentScore + scoreToAdd })
          .eq("id", player.id);
      }
    }
  } catch (error) {
    console.error("Error updating scores:", error);
  }
};

// Add this function for imposter word guess scoring
export const updateImposterCaughtScore = async (
  imposterID: number,
  guessedCorrectly: boolean
) => {
  const scoreToAdd = guessedCorrectly ? 100 : -50;

  try {
    // Get current score first
    const { data: playerData, error: fetchError } = await supabase
      .from("players")
      .select("score")
      .eq("id", imposterID)
      .single();

    if (fetchError) throw fetchError;

    const currentScore = playerData.score || 0;
    const newScore = currentScore + scoreToAdd;

    const { error } = await supabase
      .from("players")
      .update({ score: newScore })
      .eq("id", imposterID);

    if (error) {
      console.error(`Error updating imposter score:`, error);
    } else {
      console.log(`Imposter got ${scoreToAdd} points for word guess`);
    }
  } catch (error) {
    console.error("Error updating imposter score:", error);
  }
};
