"use server";

import { supabase } from "@/lib/supabaseClient";

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
  const { data, error } = await supabase
    .from("votes")
    .insert({
      round_id: roundID,
      voter_id: voterId,
      target_id: targetId,
    })
    .select("id, round_id, voter_id, target_id, created_at")
    .single();

  if (error) {
    console.error("لم يتم إرسال الصوت:", error);
    throw new Error(error.message);
  }

  // Emit to room
  if (global.io && data) {
    global.io.to(roomId.toString()).emit("vote-updated", data);
  }
};

export const getVotesAction = async ({ roundID }: { roundID: number }) => {
  const { data, error } = await supabase
    .from("votes")
    .select("id, round_id, voter_id, target_id, created_at")
    .eq("round_id", roundID)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("لم يتم جلب الصوتات:", error);
    throw new Error(error.message);
  }

  return data;
};
