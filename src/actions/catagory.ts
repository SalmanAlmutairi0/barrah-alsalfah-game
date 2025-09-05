"use server";

import { db } from "@/db";
import { catagoryTable, roomTable, wordsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type Category = {
  id: number;
  name: string;
  icon: string;
  words: { id: number; word: string }[];
};

export const getCategories = async () => {
  const categories = await db
    .select({
      id: catagoryTable.id,
      name: catagoryTable.name,
      icon: catagoryTable.icon,
    })
    .from(catagoryTable)
    .orderBy(desc(catagoryTable.id));

  console.log("categories", categories);

  const categoriesWithWords = await Promise.all(
    categories.map(async (category) => {
      const words = await db
        .select({ id: wordsTable.id, word: wordsTable.word })
        .from(wordsTable)
        .where(eq(wordsTable.catagoryID, category.id));

      return {
        ...category,
        words,
      };
    })
  );

  return categoriesWithWords;
};

export const getCategoryById = async (categoryId: number) => {
  // const { data, error } = await supabase
  //   .from("categories")
  //   .select("id, name, icon")
  //   .eq("id", categoryId)
  //   .single();

  // if (error) {
  //   console.error("Error fetching category:", error);
  //   return null;
  // }

  const [data] = await db
    .select({
      id: catagoryTable.id,
      name: catagoryTable.name,
      icon: catagoryTable.icon,
    })
    .from(catagoryTable)
    .where(eq(catagoryTable.id, categoryId));

  if (!data) {
    throw new Error("Category not found");
  }

  return data;
};

export const updateSelectedCategory = async (
  roomID: number,
  categoryID: number
) => {
  // Optimistic emit so clients update immediately
  if (global.io) {
    global.io.to(roomID.toString()).emit("category-updated", {
      selectedCatagory: categoryID,
    });
  }

  // const { data, error } = await supabase
  //   .from("rooms")
  //   .update({ selected_catagory: categoryID })
  //   .eq("id", roomID)
  //   .select("selected_catagory")
  //   .single();

  const [data] = await db
    .update(roomTable)
    .set({ selectedCatagory: categoryID })
    .where(eq(roomTable.id, roomID))
    .returning();

  if (!data) {
    console.error("Error updating selected category:", data);
    // Ask clients to resync if DB write failed
    if (global.io) {
      global.io.to(roomID.toString()).emit("room-sync-required");
    }
    throw new Error("Failed to update selected category.");
  }
  return data;
};
