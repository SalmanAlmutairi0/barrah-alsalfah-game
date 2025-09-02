"use server";

import { Player } from "@/context/playersContext";
import { Vote } from "@/context/votesContext";
import { supabase } from "@/lib/supabaseClient";

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
    .select("*")
    .single();

  if (error) {
    console.error("Error creating player:", error);
    throw error;
  }

  const playerID = data.id;

  // Emit to room
  if (global.io) {
    global.io.to(roomID?.toString() || "").emit("player-joined", {
      id: data.id,
      name: data.name,
      room_id: data.room_id,
      score: data.score,
      is_host: data.is_host,
      is_active: data.is_active,
    });
  }

  return playerID;
};

const checkIfPlayersIsHost = async (playerID: number) => {
  const { data, error } = await supabase
    .from("players")
    .select("is_host")
    .eq("id", playerID)
    .single();

  if (error) throw error;
  return data.is_host;
};

export const deletePlayer = async (playerID: number, roomID: number) => {
  try {
    const isHost = await checkIfPlayersIsHost(playerID);

    if (isHost) {
      await markAllPlayersInactive(roomID);
    }

    const { error } = await supabase
      .from("players")
      .update({ is_active: false })
      .eq("id", playerID);

    if (error) throw error;

    console.log(`Player with ID ${playerID} has been deleted.`);

    // Emit to room if roomID is provided
    if (global.io && roomID) {
      global.io.to(roomID.toString()).emit("player-left", playerID);
    }

    return true;
  } catch (error) {
    console.error("Error deleting player:", error);
    throw error;
  }
};

export const markAllPlayersInactive = async (roomID: number) => {
  try {
    const { error } = await supabase
      .from("players")
      .update({ is_active: false })
      .eq("room_id", roomID);

    if (error) throw error;

    console.log(`All players in room ${roomID} have been marked as inactive.`);

    // Emit to room if global.io is available
    if (global.io && roomID) {
      global.io.to(roomID.toString()).emit("all-players-left");
    }
    return true;
  } catch (error) {
    console.error("Error marking all players inactive:", error);
    throw error;
  }
};

export const updatePlayerScores = async (
  imposterID: number,
  mostVotedPlayerID: number | null,
  isTie: boolean,
  players: Player[],
  votes: Vote[]
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
        // IMPOSTER SCORING
        if (mostVotedPlayerID !== imposterID || isTie) {
          // Imposter survived
          scoreToAdd = 200;
        } else {
          // Imposter got caught - no points here, will be handled in guess phase
          scoreToAdd = 0;
        }

        // Apply voting penalty for imposter too
        if (!didVote) {
          scoreToAdd += -25; // Penalty for not voting
        }
      } else {
        // INNOCENT SCORING
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
        const newScore = currentScore + scoreToAdd;

        await supabase
          .from("players")
          .update({ score: newScore })
          .eq("id", player.id);

        // Emit
        global.io.to(player.room_id.toString()).emit("player-score-updated", {
          playerID: player.id,
          score: newScore,
        });
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
    }

    // Emit
    global.io.to(imposterID.toString()).emit("player-score-updated", {
      playerID: imposterID,
      score: newScore,
    });

    return true;
  } catch (error) {
    console.error("Error updating imposter score:", error);
  }
};

export const getPlayersAction = async ({ roomID }: { roomID: number }) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("room_id", roomID)
    .eq("is_active", true);

  if (error) {
    console.error("Failed to fetch players:", error);
    throw new Error("حصل خطأ أثناء جلب الاعبين.");
  }

  return data;
};

export const getPlayerAction = async ({
  currentPlayerID,
}: {
  currentPlayerID: number;
}) => {
  const { data: currentPlayerData, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", currentPlayerID)
    .single();

  if (error) {
    console.error("Failed to fetch player:", error);
    throw new Error("حصل خطأ أثناء جلب الاعب.");
  }

  return currentPlayerData;
};

export const reactivatePlayer = async (playerID: number) => {
  try {
    // First get the player data to emit with the event
    const { data: playerData, error: fetchError } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerID)
      .single();

    if (fetchError) {
      console.error("Error fetching player data:", fetchError);
      throw fetchError;
    }

    // Update the player to active
    const { error } = await supabase
      .from("players")
      .update({ is_active: true })
      .eq("id", playerID);

    if (error) {
      console.error("Error reactivating player:", error);
      throw error;
    }

    console.log(`Reactivated player ${playerID} on rejoin`);

    // Emit to room that player has rejoined
    if (global.io && playerData.room_id) {
      global.io.to(playerData.room_id.toString()).emit("player-joined", {
        id: playerData.id,
        name: playerData.name,
        room_id: playerData.room_id,
        score: playerData.score,
        is_host: playerData.is_host,
        is_active: true, // Set to true since we just reactivated
      });
      console.log(
        `Emitted player-joined event for player ${playerID} to room ${playerData.room_id}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error reactivating player:", error);
    throw error;
  }
};
