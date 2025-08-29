"use client";

import { supabase } from "@/lib/supabaseClient";
import React, { createContext, useEffect, useState } from "react";

export type RoomStatus =
  | "waiting_for_players"
  | "catagory_selection"
  | "role_assignment"
  | "round_in_progress"
  | "voting_in_progress"
  | "imposter_got_caught"
  | "round_summary"
  | "finished";

export type Room = {
  id: number;
  room_key: string;
  status: RoomStatus;
  host_id: number;
  selected_catagory: number | null;
  round: number;
};

type RoomsContextType = {
  room: Room | null;
  loading: boolean;
};

export const RoomsContext = createContext<RoomsContextType | undefined>(
  undefined
);

export function RoomsProvider({
  roomID,
  children,
}: {
  roomID: number;
  children: React.ReactNode;
}) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);

  // initial fetch
  useEffect(() => {
    if (!roomID) return;
    const fetchRoom = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("id, room_key, status, host_id, selected_catagory, round")
        .eq("id", roomID)
        .single();

      if (!error) setRoom(data as Room);
      setLoading(false);
    };

    fetchRoom();
  }, [roomID]);

  // realtime updates
  useEffect(() => {
    if (!roomID) return;

    const channel = supabase
      .channel(`room-${roomID}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomID}`,
        },
        (payload) => {
          setRoom(payload.new as Room);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomID]);

  return (
    <RoomsContext.Provider value={{ room, loading }}>
      {children}
    </RoomsContext.Provider>
  );
}
