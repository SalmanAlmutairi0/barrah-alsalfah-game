"use server"

import { supabase } from "@/lib/supabaseClient";

export type Category = {
    id: number;
    name: string;
    icon: string;
    words: { id: number; word: string }[];
}

export const getCategories = async ():Promise<Category[] | []> => {

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