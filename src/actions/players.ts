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
