"use client";

import { useEffect } from "react";

export function useLeaveRoomOnUnload(playerID: number | null | undefined) {
  useEffect(() => {
    if (!playerID) return;

    const send = () => {
      const payload = new Blob([JSON.stringify({ playerID })], {
        type: "application/json",
      });

      // Prefer sendBeacon
      const ok = navigator.sendBeacon("/api/delete-player", payload);

      // Fallback: keepalive fetch (for some browsers)
      if (!ok) {
        try {
          fetch("/api/delete-player", {
            method: "POST",
            body: JSON.stringify({ playerID }),
            headers: { "Content-Type": "application/json" },
            keepalive: true,
          });
        } catch {}
      }
    };

    const onUnload = () => send();

    // Only trigger on real unload events
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("pagehide", onUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") send();
    });

    // Cleanup listeners on unmount (don't call send here)
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("pagehide", onUnload);
      document.removeEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") send();
      });
    };
  }, [playerID]);
}
