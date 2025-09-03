"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { deletePlayer, reactivatePlayer } from "@/actions/players";

export function useSocketPresence(
  playerID: number | null | undefined,
  roomID: number | null | undefined,
  playerName: string | null | undefined
) {
  const disconnectionTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!playerID || !roomID || !playerName) return;

    const handleConnect = async () => {
      console.log("Socket connected - reactivating player");
      try {
        // Reactivate this player in case they were marked inactive (same as old hook)
        await reactivatePlayer(playerID);
        console.log(`Reactivated player ${playerID} (${playerName})`);
      } catch (error) {
        console.error("Error reactivating player:", error);
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      // Clear all pending disconnection timers when we disconnect
      disconnectionTimersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
      disconnectionTimersRef.current.clear();
    };

    const handlePlayerLeft = (leftPlayerID: number) => {
      // If it's our own player leaving, handle kick/redirect
      if (leftPlayerID === playerID) {
        console.log("You have been kicked!");
        // This will be handled in roomClient.tsx
        return;
      }

      // For other players leaving, start grace period timer (same as old hook)
      console.log(`Player ${leftPlayerID} left - starting 5s grace period`);

      // Cancel existing timer if any
      if (disconnectionTimersRef.current.has(leftPlayerID)) {
        clearTimeout(disconnectionTimersRef.current.get(leftPlayerID)!);
      }

      // Start new timer (exactly like old hook)
      const timer = setTimeout(async () => {
        try {
          console.log(
            `Grace period expired for player ${leftPlayerID} - marking inactive`
          );
          await deletePlayer(leftPlayerID, roomID);
          disconnectionTimersRef.current.delete(leftPlayerID);
        } catch (error) {
          console.error("Error marking player inactive:", error);
        }
      }, 5000); // 5 second grace period

      disconnectionTimersRef.current.set(leftPlayerID, timer);
    };

    const handlePlayerJoined = (joinedPlayer: any) => {
      const joinedPlayerID = joinedPlayer.id;

      // Cancel any pending disconnection timer for this player (they rejoined)
      if (disconnectionTimersRef.current.has(joinedPlayerID)) {
        clearTimeout(disconnectionTimersRef.current.get(joinedPlayerID)!);
        disconnectionTimersRef.current.delete(joinedPlayerID);
        console.log(
          `Cancelled disconnection timer for player ${joinedPlayerID} (rejoined)`
        );
      }
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("player-left", handlePlayerLeft);
    socket.on("player-joined", handlePlayerJoined);

    // If already connected, reactivate immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("player-left", handlePlayerLeft);
      socket.off("player-joined", handlePlayerJoined);

      // Clear all pending disconnection timers
      disconnectionTimersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
      disconnectionTimersRef.current.clear();
    };
  }, [playerID, roomID, playerName]);
}
