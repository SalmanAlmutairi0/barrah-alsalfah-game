"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Player = {
  id: number;
  name: string;
  room_id: string;
  score: number;
  is_host: boolean;
};

type PlayersContextType = {
  players: Player[];
};

export const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

type PlayersProviderProps = {
  roomID: number;
  children: React.ReactNode;
};

export const PlayersProvider = ({ roomID, children }: PlayersProviderProps) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!roomID) return;

    // Fetch initial players for the room
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomID);

      if (error) {
        console.error("Failed to fetch players:", error);
      } else {
        setPlayers(data || []);
      }
    };

    fetchPlayers();

    // Realtime subscription to player changes in this room
    const channel = supabase
      .channel(`room-players-${roomID}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomID}`,
        },
        (payload) => {
          setPlayers((prev) => {
            const { eventType, new: newPlayer, old } = payload;

            switch (eventType) {
              case "INSERT":
                return [...prev, newPlayer as Player];
              case "UPDATE":
                return prev.map((p) =>
                  p.id === (newPlayer as Player).id ? (newPlayer as Player) : p
                );
              case "DELETE":
                return prev.filter((p) => p.id !== (old as Player).id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomID]);

  return (
    <PlayersContext.Provider value={{ players }}>
      {children}
    </PlayersContext.Provider>
  );
};
