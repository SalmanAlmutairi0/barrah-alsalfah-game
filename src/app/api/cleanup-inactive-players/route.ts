import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { roomID, checkerPlayerID } = await request.json();

    if (!roomID || !checkerPlayerID) {
      return NextResponse.json(
        { success: false, error: "Missing roomID or checkerPlayerID" },
        { status: 400 }
      );
    }

    // Find ALL players in this room who haven't sent a heartbeat recently
    const cutoffTime = new Date(Date.now() - 60000); // 1 minute ago

    const { data: inactivePlayers, error: selectError } = await supabase
      .from("players")
      .select("id, name, last_heartbeat, is_active")
      .eq("room_id", roomID)
      .eq("is_active", true)
      .neq("id", checkerPlayerID)
      .lt("last_heartbeat", cutoffTime.toISOString());

    if (selectError) {
      console.error("Error selecting inactive players:", selectError);
      throw selectError;
    }

    if (!inactivePlayers || inactivePlayers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No inactive players found in room",
        inactiveCount: 0,
      });
    }

    // Mark all inactive players as inactive
    const inactivePlayerIds = inactivePlayers.map((p) => p.id);

    const { error: updateError } = await supabase
      .from("players")
      .update({ is_active: false })
      .in("id", inactivePlayerIds);

    if (updateError) {
      console.error("Error marking players inactive:", updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `Marked ${inactivePlayers.length} players as inactive`,
      inactiveCount: inactivePlayers.length,
      inactivePlayers: inactivePlayers.map((p) => ({ id: p.id, name: p.name })),
    });
  } catch (error) {
    console.error("Error cleaning up inactive players:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
