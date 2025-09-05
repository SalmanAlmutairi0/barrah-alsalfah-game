"use server";

import { db } from "@/db";
import { votesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { asc } from "drizzle-orm";

type SendVoteParams = {
  roundID: number;
  voterId: number;
  targetId: number;
  roomId: number;
};

export const sendVoteAction = async ({
  roundID,
  voterId,
  targetId,
  roomId,
}: SendVoteParams) => {
  const [data] = await db
    .insert(votesTable)
    .values({
      voterID: voterId,
      targetID: targetId,
      roundID,
    })
    .returning();

  if (!data) {
    console.error("Error sending vote:", data);
    throw new Error("Could not send vote");
  }

  // Emit to room
  if (global.io && data) {
    global.io.to(roomId.toString()).emit("vote-updated", data);
  }
};

export const getVotesAction = async ({ roundID }: { roundID: number }) => {
  const data = await db
    .select({
      id: votesTable.id,
      roundID: votesTable.roundID,
      voterID: votesTable.voterID,
      targetID: votesTable.targetID,
    })
    .from(votesTable)
    .where(eq(votesTable.roundID, roundID))
    .orderBy(asc(votesTable.createdAt));

  return data;
};
