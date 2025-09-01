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
    //TODO: find the room by room key
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
  const { error } = await supabase
    .from("rooms")
    .update({ status })
    .eq("id", roomID);

  if (!error) return true;

  if (error) {
    console.error("Error updating room status:", error);
    throw error;
  }
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

  return true;
};
