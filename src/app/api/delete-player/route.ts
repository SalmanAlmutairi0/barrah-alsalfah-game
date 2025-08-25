import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { playerID } = await request.json();

   const { error } = await supabase
     .from("players")
     .update({ is_active: false })
     .eq("id", playerID);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
