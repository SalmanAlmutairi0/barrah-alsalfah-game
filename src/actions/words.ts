"use server";

import { db } from "@/db";
import { wordsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getRandomWord = async (categoryID: number) => {
 console.log("selected categoryID", categoryID)
  const data = await db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
    })
    .from(wordsTable)
    .where(eq(wordsTable.catagoryID, categoryID));

  if (!data || data.length === 0) {
    throw new Error("No words found for the selected category");
  }

  // Select a random word from the fetched words
  const randomIndex = Math.floor(Math.random() * data.length);
  console.log("random word", data[randomIndex].word)
  return data[randomIndex].word;
};

export const getWords = async (categoryID: number) => {
  const data = await db
    .select({
      id: wordsTable.id,
      word: wordsTable.word,
    })
    .from(wordsTable)
    .where(eq(wordsTable.catagoryID, categoryID))
    .limit(9);

  if (!data || data.length === 0) {
    throw new Error("No words found for the selected category");
  }

  return data;
};
