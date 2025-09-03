"use server";

import { supabase } from "@/lib/supabaseClient";

export type Category = {
  id: number;
  name: string;
  icon: string;
  words: { id: number; word: string }[];
};

export const getCategories = async (): Promise<Category[] | []> => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon, words(id, word)")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
};

export const updateSelectedCategory = async (
  roomID: number,
  categoryID: number
) => {
  // Optimistic emit so clients update immediately
  if (global.io) {
    global.io.to(roomID.toString()).emit("category-updated", {
      selected_catagory: categoryID,
    });
  }

  const { data, error } = await supabase
    .from("rooms")
    .update({ selected_catagory: categoryID })
    .eq("id", roomID)
    .select("selected_catagory")
    .single();

  if (error) {
    console.error("Error updating selected category:", error);
    // Ask clients to resync if DB write failed
    if (global.io) {
      global.io.to(roomID.toString()).emit("room-sync-required");
    }
    throw new Error("Failed to update selected category.");
  }
  return data;
};
