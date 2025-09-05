"use server";

import { Player } from "@/context/playersContext";
import { Vote } from "@/context/votesContext";
import { db } from "@/db";
import { playerTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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
  const [data] = await db
    .insert(playerTable)
    .values({
      name: playerName,
      isHost: isHost,
      roomID: roomID,
      isActive: true,
    })
    .returning();

  if (!data) {
    console.error("Error creating player:", data);
    throw new Error("Error creating player");
  }

  const playerID = data.id;

  // Emit to room
  if (global.io) {
    global.io.to(roomID?.toString() || "").emit("player-joined", {
      id: data.id,
      name: data.name,
      room_id: data.roomID,
      score: data.score,
      is_host: data.isHost,
      is_active: data.isActive,
    });
  }

  return playerID;
};

const checkIfPlayersIsHost = async (playerID: number) => {
  const [data] = await db
    .select({ isHost: playerTable.isHost })
    .from(playerTable)
    .where(eq(playerTable.id, playerID));

  if (!data) {
    console.error("Error checking if player is host:", data);
    throw new Error("Error checking if player is host");
  }

  return data?.isHost;
};

export const deletePlayer = async (playerID: number, roomID: number) => {
  try {
    const isHost = await checkIfPlayersIsHost(playerID);

    if (isHost) {
      await markAllPlayersInactive(roomID);
    }

    const [data] = await db
      .update(playerTable)
      .set({ isActive: false })
      .where(eq(playerTable.id, playerID))
      .returning();

    if (!data) {
      console.error("Error deleting player:", data);
      throw new Error("Error deleting player");
    }

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
    const data = await db
      .update(playerTable)
      .set({ isActive: false })
      .where(eq(playerTable.roomID, roomID))
      .returning();

    if (data.length === 0) {
      console.error("Error marking all players inactive:", data);
      throw new Error("Error marking all players inactive");
    }

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
        (vote) => vote.voterID === player.id && vote.targetID === imposterID
      );
      const didVote = votes.some((vote) => vote.voterID === player.id);

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

        await db
          .update(playerTable)
          .set({ score: newScore })
          .where(eq(playerTable.id, player.id));

        // Emit
        global.io
          .to(player.roomID?.toString() || "")
          .emit("player-score-updated", {
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
    const [playerData] = await db
      .select({ score: playerTable.score })
      .from(playerTable)
      .where(eq(playerTable.id, imposterID));

    const currentScore = playerData.score || 0;
    const newScore = currentScore + scoreToAdd;

    // Update score
    await db
      .update(playerTable)
      .set({ score: newScore })
      .where(eq(playerTable.id, imposterID));

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
  const data = await db
    .select()
    .from(playerTable)
    .where(and(eq(playerTable.roomID, roomID), eq(playerTable.isActive, true)));

  if (data.length === 0) {
    console.error("Error fetching players:", data);
    throw new Error("حصل خطأ أثناء جلب الاعبين.");
  }

  return data;
};

export const getPlayerAction = async ({
  currentPlayerID,
}: {
  currentPlayerID: number;
}) => {
  const [currentPlayerData] = await db
    .select()
    .from(playerTable)
    .where(eq(playerTable.id, currentPlayerID));

  if (!currentPlayerData) {
    console.error("Error fetching player:", currentPlayerData);
    throw new Error("حصل خطأ أثناء جلب الاعب.");
  }

  return currentPlayerData;
};

export const reactivatePlayer = async (playerID: number) => {
  try {
    // First get the player data to emit with the event
    const [playerData] = await db
      .select()
      .from(playerTable)
      .where(eq(playerTable.id, playerID));

    if (!playerData) {
      console.error("Error fetching player:", playerData);
      throw new Error("حصل خطأ أثناء جلب الاعب.");
    }

    // Update the player to active
    const [data] = await db
      .update(playerTable)
      .set({ isActive: true })
      .where(eq(playerTable.id, playerID))
      .returning();

    if (!data) {
      console.error("Error reactivating player:", data);
      throw new Error("حصل خطأ أثناء إعادة تنشيط الاعب.");
    }

    console.log(`Reactivated player ${playerID} on rejoin`);

    // Emit to room that player has rejoined
    if (global.io && playerData.roomID) {
      global.io.to(playerData.roomID.toString()).emit("player-joined", {
        id: playerData.id,
        name: playerData.name,
        room_id: playerData.roomID,
        score: playerData.score,
        is_host: playerData.isHost,
        is_active: true, // Set to true since we just reactivated
      });
      console.log(
        `Emitted player-joined event for player ${playerID} to room ${playerData.roomID}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error reactivating player:", error);
    throw error;
  }
};
