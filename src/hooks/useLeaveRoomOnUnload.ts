"use client";

import { useEffect, useRef } from "react";

export function useLeaveRoomOnUnload(playerID: number | null | undefined) {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!playerID) return;

    const sendHeartbeat = async () => {
      try {
        await fetch("/api/player-heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerID }),
        });
        console.log("Heartbeat sent successfully");
      } catch (error) {
        console.error("Failed to send heartbeat:", error);
      }
    };

    // Send heartbeat every 5 seconds
    const startHeartbeat = () => {
      // Send initial heartbeat
      sendHeartbeat();

      // Set up interval
      heartbeatIntervalRef.current = setInterval(() => {
        sendHeartbeat();
      }, 30000); // Every 30 seconds
    };

    // Start the heartbeat system
    startHeartbeat();

    return () => {
      // Cleanup interval when component unmounts or playerID changes
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [playerID]);
}
