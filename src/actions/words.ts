"use server"

import { supabase } from "@/lib/supabaseClient";

export const getRandomWord = async (categoryID: number) => {
    const { data, error } = await supabase
        .from("words")
        .select("id,word")
        .eq("catagory_id", categoryID);
    
    if (error) {
        console.error("Error fetching words:", error);
        throw new Error("Could not fetch words");
    }
    
    if (!data || data.length === 0) {
        throw new Error("No words found for the selected category");
    }
    
    // Select a random word from the fetched words
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].word;

}