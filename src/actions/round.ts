"use server";

import { supabase } from "@/lib/supabaseClient";

type RoundProps = {
  room_id: number;
  imposter_id: number;
  secret_word: string;
};

export const startRound = async ({
  imposter_id,
  secret_word,
  room_id,
}: RoundProps) => {
  const { data, error } = await supabase
    .from("rounds")
    .insert({
      room_id: room_id,
      imposter_id: imposter_id,
      secret_word: secret_word,
    })
    .select("id, imposter_id, secret_word")
    .single();

  if (error) {
    console.error("Error starting round:", error);
    throw new Error("Could not start the round");
  }

  return data;
};

export const getRoundInfo = async (room_id: number) => {
  const { data, error } = await supabase
    .from("rounds")
    .select("id, imposter_id, secret_word, round_number, started_at")
    .eq("room_id", room_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching round info:", error);
    throw new Error("Could not fetch round info");
  }

  return data;
};

export const updateRoundStartTime = async (round_id: number) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  const { error } = await supabase
    .from("rounds")
    .update({
      started_at: currentTimeSeconds,
    })
    .eq("id", round_id);

  if (error) {
    console.error("Error updating round:", error);
    throw new Error("Could not update round");
  }

  return true;
};
