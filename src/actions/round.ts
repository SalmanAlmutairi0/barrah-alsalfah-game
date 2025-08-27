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
