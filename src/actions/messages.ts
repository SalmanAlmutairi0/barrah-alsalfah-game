"use server";

import { supabase } from "@/lib/supabaseClient";

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
  const { data, error } = await supabase
    .from("messages")
    .insert({
      player_id: playerId,
      player_name: playerName,
      message: messageText,
      round_id: roundID,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to send message:", error);
    throw new Error("حصل خطأ أثناء إرسال الرسالة.");
  }

  // Emit to room
  if (global.io && data) {
    global.io.to(roomId.toString()).emit("new-message", data);
  }
};

export const getMessagesAction = async ({ roundID }: { roundID: number }) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("round_id", roundID)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error);
    throw new Error("حصل خطأ أثناء جلب الرسائل.");
  }

  return data;
};
