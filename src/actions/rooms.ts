"use server";

import { supabase } from "@/lib/supabaseClient";
import { createPlayer } from "./players";
import { RoomStatus } from "@/context/roomContext";

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
    const { data: createRoomData, error: createRoomError } = await supabase
      .from("rooms")
      .insert({
        host_id: playerID,
        status: "waiting_for_players",
        round: 1,
        room_key: roomKey,
      })
      .select("id, room_key")
      .single();

    if (createRoomError) {
      console.error("Error creating room:", createRoomError);
      throw createRoomError;
    }

    // update the player with the room id
    const { error: updatePlayerError } = await supabase
      .from("players")
      .update({ room_id: createRoomData.id })
      .eq("id", playerID);

    if (updatePlayerError) {
      console.error("Error updating player with room ID:", updatePlayerError);
      throw updatePlayerError;
    }

    return { playerID: playerID, roomID: createRoomData.id, room_key: roomKey };
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
    const { data: roomStatusData, error: roomStatusError } = await supabase
      .from("rooms")
      .select("status")
      .eq("room_key", roomKey)
      .single();

    if (roomStatusData?.status === "finished") {
      console.error("Room is finished");
      throw new Error("الغرفة منتهية");
    }

    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("id")
      .eq("room_key", roomKey)
      .single();

    if (!roomData) {
      console.error("Room not found");
      throw new Error("الغرفة غير موجودة");
    }

    if (roomError) {
      console.error("Error finding room:", roomError);
      throw new Error("Error finding room");
    }

    const playerID = await createPlayer({
      playerName: playerName,
      isHost: false,
      roomID: roomData.id,
    });

    return { playerID, playerName, roomID: roomData.id, roomkey: roomKey };
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

  const { error } = await supabase
    .from("rooms")
    .update({ status })
    .eq("id", roomID);

  if (error) {
    console.error("Error updating room status:", error);
    // Ask clients to resync if DB write failed
    if (global.io) {
      global.io.to(roomID.toString()).emit("room-sync-required");
    }
    throw error;
  }

  return true;
};

type UpdateRoundParams = {
  roomID: number;
  round: number;
};

export const updateRound = async ({ roomID, round }: UpdateRoundParams) => {
  const { error } = await supabase
    .from("rooms")
    .update({ round })
    .eq("id", roomID);

  if (error) {
    console.error("Error updating round:", error);
    throw error;
  }

  // Emit to room
  if (global.io) {
    global.io.to(roomID.toString()).emit("round-updated", { round });
  }

  return true;
};

export const getRoomInfo = async (roomID: number) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_key, status, host_id, selected_catagory, round")
    .eq("id", roomID)
    .single();

  if (error) {
    console.error("Error fetching room info:", error);
    throw error;
  }

  return data;
};
