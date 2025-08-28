"use client";

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Message = {
  id: number;
  player_id: number;
  player_name: string;
  message: string;
  round_id: number;
  created_at: string;
};

type MessagesContextType = {
  messages: Message[];
  messagesLoading: boolean;
  error?: string | null;
  sendMessage: (
    message: string,
    playerId: number,
    playerName: string
  ) => Promise<void>;
  sendingMessage: boolean;
};

export const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

type MessagesProviderProps = {
  roundID: number;
  children: React.ReactNode;
};

export const MessagesProvider = ({
  roundID,
  children,
}: MessagesProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);

  const sendMessage = async (
    messageText: string,
    playerId: number,
    playerName: string
  ) => {
    try {
      setSendingMessage(true);
      const { error } = await supabase.from("messages").insert({
        player_id: playerId,
        player_name: playerName,
        message: messageText,
        round_id: roundID,
      });

      if (error) {
        console.error("Failed to send message:", error);
        setError("حصل خطأ أثناء إرسال الرسالة.");
      }
    } catch (error) {
      console.error("Unexpected error sending message:", error);
      setError("حصل خطأ أثناء إرسال الرسالة.");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (!roundID) return;

    const fetchMessages = async () => {
      setMessagesLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("round_id", roundID)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Failed to fetch messages:", error);
          setError("حصل خطأ أثناء جلب الرسائل.");
        } else {
          setMessages(data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("حصل خطأ أثناء جلب الرسائل.");
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`round-messages-${roundID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `round_id=eq.${roundID}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roundID]);

  return (
    <MessagesContext.Provider
      value={{ messages, messagesLoading, error, sendMessage, sendingMessage }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
