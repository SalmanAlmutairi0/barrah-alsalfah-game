"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import { markAllPlayersInactive, deletePlayer } from "@/actions/players";

export function usePlayerPresence(
  playerID: number | null | undefined,
  roomID: number | null | undefined,
  playerName: string | null | undefined
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const disconnectionTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!playerID || !roomID || !playerName) return;

    // Create presence channel for this room
    const channel = supabase.channel(`room-presence-${roomID}`, {
      config: {
        presence: {
          key: playerID.toString(),
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log("Presence sync - current players:", Object.keys(state));
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log(`Player ${key} joined`, newPresences);

        const joinedPlayerID = parseInt(key);

        // Cancel any pending disconnection timer for this player (they rejoined)
        if (disconnectionTimersRef.current.has(joinedPlayerID)) {
          clearTimeout(disconnectionTimersRef.current.get(joinedPlayerID)!);
          disconnectionTimersRef.current.delete(joinedPlayerID);
          console.log(
            `Cancelled disconnection timer for player ${joinedPlayerID} (rejoined)`
          );
        }
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log(`Player ${key} left`, leftPresences);

        const leftPlayerID = parseInt(key);

        // Only mark others as inactive (not yourself)
        if (leftPlayerID !== playerID) {
          // Add a grace period before marking as inactive (for page refreshes)
          const timer = setTimeout(() => {
            markPlayerInactive(leftPlayerID, roomID);
            disconnectionTimersRef.current.delete(leftPlayerID);
          }, 5000); // 5 second grace period

          disconnectionTimersRef.current.set(leftPlayerID, timer);
          console.log(
            `Started 5s grace period timer for player ${leftPlayerID}`
          );
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // First, reactivate this player in the database (in case they were marked inactive)
          await reactivatePlayer(playerID);

          // Then start tracking this player's presence
          await channel.track({
            playerID,
            playerName,
            roomID,
            onlineAt: new Date().toISOString(),
          });
          console.log(
            `Started tracking presence for player ${playerID} (${playerName})`
          );
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        // Untrack presence when component unmounts
        channelRef.current.untrack();
        channelRef.current.unsubscribe();
        console.log(`Stopped tracking presence for player ${playerID}`);
      }

      // Clear all pending disconnection timers
      disconnectionTimersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
      disconnectionTimersRef.current.clear();
    };
  }, [playerID, roomID, playerName]);

  const reactivatePlayer = async (playerID: number) => {
    try {
      const { error } = await supabase
        .from("players")
        .update({ is_active: true })
        .eq("id", playerID);

      if (error) {
        console.error("Error reactivating player:", error);
      } else {
        console.log(`Reactivated player ${playerID} on rejoin`);
      }
    } catch (error) {
      console.error("Error reactivating player:", error);
    }
  };

  const markPlayerInactive = async (
    inactivePlayerID: number,
    roomID: number
  ) => {
    try {
      await deletePlayer(inactivePlayerID, roomID);
    } catch (error) {
      console.error("Error updating player status:", error);
    }
  };
}
