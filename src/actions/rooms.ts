"use server";

import { createPlayer } from "./players";
import { RoomStatus } from "@/context/roomContext";
import { playerTable, roomTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

type CreateRoomParams = {
  playerName: string;
};
export const createRoom = async ({ playerName }: CreateRoomParams) => {
  try {
    // create the player who is the host
    const playerID = await createPlayer({
      playerName: playerName,
      isHost: true,
    });

    const roomKey = crypto.randomUUID().slice(0, 8).toUpperCase();

    // create the room
    const [createRoomData] = await db
      .insert(roomTable)
      .values({
        hostID: playerID,
        status: "waiting_for_players",
        roundNumber: 1,
        roomKey: roomKey,
      })
      .returning();

    if (!createRoomData) {
      console.error("Error creating room:", createRoomData);
      throw new Error("Error creating room");
    }

    // update the player with the room id
    await db
      .update(playerTable)
      .set({ roomID: createRoomData.id })
      .where(eq(playerTable.id, playerID));

    return { playerID: playerID, roomID: createRoomData.id, roomKey };
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

type JoinRoomParams = {
  playerName: string;
  roomKey: string;
};
export const joinRoom = async ({ playerName, roomKey }: JoinRoomParams) => {
  try {
    // check if the room status is not finsished or not
    const [roomStatusData] = await db
      .select()
      .from(roomTable)
      .where(eq(roomTable.roomKey, roomKey));

    if (!roomStatusData || roomStatusData.status === "finished") {
      console.error("Room not found");
      throw new Error("الغرفة غير موجودة");
    }

    const [roomData] = await db
      .select({ id: roomTable.id })
      .from(roomTable)
      .where(eq(roomTable.roomKey, roomKey));

    if (!roomData) {
      console.error("Room not found");
      throw new Error("الغرفة غير موجودة");
    }

    const playerID = await createPlayer({
      playerName: playerName,
      isHost: false,
      roomID: roomData.id,
    });

    return { playerID, playerName, roomID: roomData.id, roomKey };
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

type ChangeRoomStatusParams = {
  roomID: number;
  status: RoomStatus;
};

export const chnageRoomStatus = async ({
  roomID,
  status,
}: ChangeRoomStatusParams) => {
  // Optimistic emit so clients update immediately
  if (global.io) {
    global.io.to(roomID.toString()).emit("room-updated", { status });
  }

  const [data] = await db
    .update(roomTable)
    .set({ status: status })
    .where(eq(roomTable.id, roomID))
    .returning();

  if (!data) {
    console.error("Error updating room status:", data);
    // Ask clients to resync if DB write failed
    if (global.io) {
      global.io.to(roomID.toString()).emit("room-sync-required");
    }
    throw new Error("Error updating room status");
  }

  return true;
};

type UpdateRoundParams = {
  roomID: number;
  round: number;
};

export const updateRound = async ({ roomID, round }: UpdateRoundParams) => {
  const [data] = await db
    .update(roomTable)
    .set({ roundNumber: round })
    .where(eq(roomTable.id, roomID))
    .returning();

  if (!data) {
    console.error("Error updating round:", data);
    throw new Error("Error updating round");
  }

  // Emit to room
  if (global.io) {
    global.io.to(roomID.toString()).emit("round-updated", { round });
  }

  return true;
};

export const getRoomInfo = async (roomID: number) => {
  const [data] = await db
    .select({
      id: roomTable.id,
      roomKey: roomTable.roomKey,
      status: roomTable.status,
      hostID: roomTable.hostID,
      selectedCatagory: roomTable.selectedCatagory,
      roundNumber: roomTable.roundNumber,
    })
    .from(roomTable)
    .where(eq(roomTable.id, roomID));

  return data;
};
