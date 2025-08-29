import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { playerID } = await request.json();

    if (!playerID) {
      return NextResponse.json(
        { success: false, error: "Missing playerID" },
        { status: 400 }
      );
    }

    // Update player's last_heartbeat timestamp
    const { error } = await supabase
      .from("players")
      .update({
        last_heartbeat: new Date().toISOString(),
        is_active: true, // Ensure player is active when sending heartbeat
      })
      .eq("id", playerID);

    if (error) {
      console.error("Error updating heartbeat:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing heartbeat:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
