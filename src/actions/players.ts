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
    .insert({ name: playerName, is_host: isHost, room_id: roomID, is_active: true })
    .select("id")
    .single<PlayerInsertResponse>();

  if (error) {
    console.error("Error creating player:", error);
    throw error;
  }

  const playerID = data.id;

  return playerID;
};
