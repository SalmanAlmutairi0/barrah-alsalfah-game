"use server";

import { db } from "@/db";
import { roomTable, roundsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type RoundProps = {
  room_id: number;
  imposter_id: number;
  secret_word: string;
  category_id: number;
};

export const startRound = async ({
  imposter_id,
  secret_word,
  room_id,
  category_id,
}: RoundProps) => {
  const [data] = await db
    .insert(roundsTable)
    .values({
      roomID: room_id,
      imposterID: imposter_id,
      secretWord: secret_word,
      categoryID: category_id,
    })
    .returning();

  if (!data) {
    console.error("Error starting round:", data);
    throw new Error("Could not start the round");
  }

  return data;
};

export const getRoundInfo = async (room_id: number) => {
  const [data] = await db
    .select({
      id: roundsTable.id,
      imposterID: roundsTable.imposterID,
      secretWord: roundsTable.secretWord,
      startedAt: roundsTable.startedAt,
    })
    .from(roundsTable)
    .where(eq(roundsTable.roomID, room_id))
    .orderBy(desc(roundsTable.createdAt))
    .limit(1);

  if (!data) {
    console.error("Error fetching round info:", data);
    throw new Error("Could not fetch round info");
  }

  return data;
};

export const updateRoundStartTime = async (round_id: number) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  const [data] = await db
    .update(roundsTable)
    .set({
      startedAt: new Date(currentTimeSeconds * 1000),
    })
    .where(eq(roundsTable.id, round_id))
    .returning();

  if (!data) {
    console.error("Error updating round:", data);
    throw new Error("Could not update round");
  }

  return true;
};

export const getPreviousRoundImposter = async (
  room_id: number
): Promise<number | null> => {
  // const { data, error } = await supabase
  //   .from("rounds")
  //   .select("imposter_id")
  //   .eq("room_id", room_id)
  //   .order("created_at", { ascending: false })
  //   .limit(2); // Get last 2 rounds

  // if (error) {
  //   console.error("Error fetching previous rounds:", error);
  //   return null;
  // }

  // if (data && data.length >= 2) {
  //   return data[1].imposter_id;
  // }

  const data = await db
    .select({
      imposterID: roundsTable.imposterID,
    })
    .from(roundsTable)
    .where(eq(roundsTable.roomID, room_id))
    .orderBy(desc(roundsTable.createdAt))
    .limit(2);

  if (!data) {
    console.error("Error fetching previous rounds:", data);
    throw new Error("Could not fetch previous rounds");
  }

  if (data.length >= 2) {
    return data[1].imposterID;
  }

  return null;
};
