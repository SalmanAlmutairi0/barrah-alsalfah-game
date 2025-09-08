"use server";

import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/context/playersContext";

export type Turn = {
  id: number;
  round_id: number;
  questionar_id: number;
  target_id: number;
  is_completed: boolean;
  created_at: string;
};

export const createTurns = async (
  room_id: number,
  round_id: number,
  players: Player[]
) => {
  const { data, error } = await supabase
    .from("turns")
    .insert(
      players.map((player) => ({
        questionar_id: player.id,
        round_id: round_id,
      }))
    )
    .select("*");

  if (error) {
    console.error("Error creating turns:", error);
    throw error;
  }

  // emit to room
  if (global.io) {
    global.io.to(room_id.toString()).emit("turns-created", data);
  }

  return data;
};

export const getAvailableTurns = async (round_id: number) => {
  const { data, error } = await supabase
    .from("turns")
    .select("*")
    .eq("round_id", round_id)
    .eq("is_completed", false)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching available turns:", error);
    throw error;
  }

  return data;
};

export const updateTargetSelection = async (
  turn_id: number,
  questionar_id: number,
  target_id: number,
  room_id: number
) => {
  const { data, error } = await supabase
    .from("turns")
    .update({ target_id: target_id })
    .eq("id", turn_id)
    .eq("questionar_id", questionar_id)
    .is("target_id", null)
    .select("id");

  if (error) {
    console.error("Error updating target selection:", error);
    throw error;
  }

  // Only emit and schedule completion if we actually updated a row
  if (data && data.length > 0 && global.io) {
    // Track selection time in-memory for accurate remaining timer on refresh
    const g = global as unknown as {
      turnSelectedAtMap?: Map<number, number>;
      io?: any;
    };
    if (!g.turnSelectedAtMap) {
      g.turnSelectedAtMap = new Map<number, number>();
    }
    g.turnSelectedAtMap.set(turn_id, Date.now());

    global.io.to(room_id.toString()).emit("target-selection-updated", {
      turn_id: turn_id,
      questionar_id: questionar_id,
      target_id: target_id,
      selected_at: Date.now(),
    });

    // Schedule automatic completion after 30 seconds (best-effort server-side)
    setTimeout(async () => {
      try {
        await completeTurn(turn_id, room_id);
      } catch (e) {
        console.error("Failed to auto-complete turn:", e);
      }
    }, 30000);
  }
};

export const getTargetSelectedAt = async (
  turn_id: number
): Promise<number | null> => {
  try {
    const g = global as unknown as { turnSelectedAtMap?: Map<number, number> };
    const map: Map<number, number> | undefined = g.turnSelectedAtMap;
    if (!map) return null;
    const value = map.get(turn_id) || null;
    return value;
  } catch (e) {
    console.error("getTargetSelectedAt error:", e);
    return null;
  }
};

export const completeTurn = async (turn_id: number, room_id: number) => {
  const { data, error } = await supabase
    .from("turns")
    .update({ is_completed: true })
    .eq("id", turn_id)
    .eq("is_completed", false)
    .select("id");

  if (error) {
    console.error("Error updating turn:", error);
    throw error;
  }

  if (data && data.length > 0 && global.io) {
    global.io.to(room_id.toString()).emit("turn-completed", turn_id);
  }

  return true;
};

export const getTurnsHistory = async (round_id: number, room_id: number) => {
  const { data, error } = await supabase
    .from("turns")
    .select("*")
    .eq("round_id", round_id)
    .eq("is_completed", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching turns history:", error);
    throw error;
  }

  //   emit to room
  if (global.io) {
    global.io.to(room_id.toString()).emit("turns-history-updated", data);
  }

  return data;
};
