"use server";

import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

type SendMessageParams = {
  playerId: number;
  playerName: string;
  messageText: string;
  roundID: number;
  roomId: number;
};

export const sendMessageAction = async ({
  playerId,
  playerName,
  messageText,
  roundID,
  roomId,
}: SendMessageParams) => {
  const [data] = await db
    .insert(messagesTable)
    .values({
      playerID: playerId,
      playerName: playerName,
      message: messageText,
      roundID: roundID,
    })
    .returning();

  if (!data) {
    console.error("Error sending message:", data);
    throw new Error("Could not send message");
  }

  // Emit to room
  if (global.io && data) {
    global.io.to(roomId.toString()).emit("new-message", data);
  }
};

export const getMessagesAction = async ({ roundID }: { roundID: number }) => {
  const data = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.roundID, roundID))
    .orderBy(asc(messagesTable.createdAt));

  if (!data || data.length === 0) {
    console.error("Error fetching messages:", data);
    throw new Error("حصل خطأ أثناء جلب الرسائل.");
  }

  return data;
};
