"use client";

import { getRoomInfo } from "@/actions/rooms";
import { supabase } from "@/lib/supabaseClient";
import React, { createContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

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

      const data = await getRoomInfo(roomID);
      setRoom(data as Room);
      setLoading(false);
    };

    fetchRoom();
  }, [roomID]);

  // realtime updates
  useEffect(() => {
    if (!roomID) return;

    // Ensure socket connects only on this page
    if (!socket.connected) socket.connect();

    // Join the Socket.IO room when component mounts
    socket.emit("join-room", { roomId: roomID.toString() });

    // Listen for room updates (matches what your action emits)
    socket.on("room-updated", (updates: Partial<Room>) => {
      setRoom((prev) => (prev ? { ...prev, ...updates } : null));
    });

    // Listen for category updates
    socket.on("category-updated", (updates: Partial<Room>) => {
      setRoom((prev) => (prev ? { ...prev, ...updates } : null));
    });

    // If server asks to resync, fetch authoritative room state
    const handleSync = async () => {
      const data = await getRoomInfo(roomID);
      setRoom(data as Room);
    };
    socket.on("room-sync-required", handleSync);

    return () => {
      // Leave the room when component unmounts
      socket.emit("leave-room", { roomId: roomID.toString() });
      socket.off("room-updated");
      socket.off("category-updated");
      socket.off("room-sync-required", handleSync);
      // Disconnect the socket when leaving the room page
      socket.disconnect();
    };
  }, [roomID]);

  return (
    <RoomsContext.Provider value={{ room, loading }}>
      {children}
    </RoomsContext.Provider>
  );
}
