"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getPlayerAction, getPlayersAction } from "@/actions/players";
import { socket } from "@/lib/socket";

export type Player = {
  id: number;
  name: string;
  room_id: string;
  score: number;
  is_host: boolean;
  is_active: boolean;
};

type PlayersContextType = {
  players: Player[];
  playersLoading: boolean;
  error?: string | null;
  getPreviousScore: (playerId: number) => number | undefined;
  getRoundPoints: (playerId: number) => number;
};

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined
);

type PlayersProviderProps = {
  roomID: number;
  children: React.ReactNode;
  currentPlayerID?: number;
};

export const PlayersProvider = ({
  roomID,
  children,
  currentPlayerID,
}: PlayersProviderProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playersLoading, setPlayersLoading] = useState<boolean>(false);
  const [previousScores, setPreviousScores] = useState<Map<number, number>>(
    new Map()
  );
  const [roundStartScores, setRoundStartScores] = useState<Map<number, number>>(
    new Map()
  );

  useEffect(() => {
    if (!roomID) return;

    // Fetch initial players for the room
    const fetchPlayers = async () => {
      setPlayersLoading(true);
      setError(null);
      try {
        const data = await getPlayersAction({ roomID });
        const fetchedPlayers = data || [];

        // If current player is not in the results (race condition),
        // fetch their info and add them
        if (
          currentPlayerID &&
          !fetchedPlayers.find((p) => p.id === currentPlayerID)
        ) {
          const currentPlayerData = await getPlayerAction({
            currentPlayerID,
          });
          if (currentPlayerData) {
            fetchedPlayers.push(currentPlayerData);
          }
        }

        setPlayers(fetchedPlayers);

        // Initialize round start scores for tracking round points
        const initialScores = new Map<number, number>();
        fetchedPlayers.forEach((player) => {
          initialScores.set(player.id, player.score || 0);
        });

        setRoundStartScores(initialScores);
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("حصل خطأ أثناء جلب الاعبين.");
      } finally {
        setPlayersLoading(false);
      }
    };

    fetchPlayers();

    socket.on(`player-joined`, (data) => {
      setPlayers((prev) => {
        const newPlayer = data as Player;
        // Check if player already exists (in case of rejoin)
        const existingIndex = prev.findIndex((p) => p.id === newPlayer.id);
        if (existingIndex >= 0) {
          // Player rejoining, update their data
          return prev.map((p) => (p.id === newPlayer.id ? newPlayer : p));
        } else {
          // New player joining
          return [...prev, newPlayer];
        }
      });
    });

    socket.on(`player-left`, (playerID) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerID));
    });
    socket.on(`all-players-left`, () => {
      setPlayers([]);
    });

    socket.on(`player-score-updated`, (data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === data.playerID ? { ...p, score: data.score } : p
        )
      );
    });
    // Realtime subscription to player changes in this room
    //   const channel = supabase
    //     .channel(`room-players-${roomID}`)
    //     .on(
    //       "postgres_changes",
    //       {
    //         event: "*",
    //         schema: "public",
    //         table: "players",
    //         filter: `room_id=eq.${roomID}`,
    //       },
    //       (payload) => {
    //         setPlayers((prev) => {
    //           const { eventType, new: newPlayer, old } = payload;

    //           switch (eventType) {
    //             case "INSERT":
    //               const insertedPlayer = newPlayer as Player;
    //               // Set round start score for new player
    //               setRoundStartScores((prevScores) => {
    //                 const newScores = new Map(prevScores);
    //                 newScores.set(insertedPlayer.id, insertedPlayer.score || 0);
    //                 return newScores;
    //               });
    //               return [...prev, insertedPlayer];

    //             case "UPDATE":
    //               const updated = newPlayer as Player;

    //               if (!updated.is_active) {
    //                 // remove inactive players
    //                 return prev.filter((p) => p.id !== updated.id);
    //               } else {
    //                 // Handle active players: update if exists, add if rejoining
    //                 const existingIndex = prev.findIndex(
    //                   (p) => p.id === updated.id
    //                 );
    //                 if (existingIndex >= 0) {
    //                   // Store previous score before updating
    //                   const existingPlayer = prev[existingIndex];
    //                   if (existingPlayer.score !== updated.score) {
    //                     setPreviousScores((prevScores) => {
    //                       const newScores = new Map(prevScores);
    //                       newScores.set(updated.id, existingPlayer.score);
    //                       return newScores;
    //                     });
    //                   }
    //                   // Player exists, update them
    //                   return prev.map((p) => (p.id === updated.id ? updated : p));
    //                 } else {
    //                   // Player rejoining, add them back to the list
    //                   return [...prev, updated];
    //                 }
    //               }

    //             case "DELETE":
    //               return prev.filter((p) => p.id !== (old as Player).id);

    //             default:
    //               return prev;
    //           }
    //         });
    //       }
    //     )
    //     .subscribe();

    return () => {
      socket.off(`player-joined`);
      socket.off(`player-left`);
      socket.off(`all-players-left`);
      socket.off(`player-score-updated`);
    };
  }, [roomID, currentPlayerID]);

  const getPreviousScore = (playerId: number): number | undefined => {
    return previousScores.get(playerId);
  };

  const getRoundPoints = (playerId: number): number => {
    const currentPlayer = players.find((p) => p.id === playerId);
    const roundStartScore = roundStartScores.get(playerId);

    if (!currentPlayer || roundStartScore === undefined) {
      return 0;
    }

    return (currentPlayer.score || 0) - roundStartScore;
  };

  return (
    <PlayersContext.Provider
      value={{
        players,
        playersLoading,
        error,
        getPreviousScore,
        getRoundPoints,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};
