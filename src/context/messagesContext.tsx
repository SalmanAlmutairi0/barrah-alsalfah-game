"use client";

import React, { createContext, useEffect, useState } from "react";
import { getMessagesAction, sendMessageAction } from "@/actions/messages";
import { socket } from "@/lib/socket";

export type Message = {
  id: number;
  playerID: number;
  playerName: string;
  message: string;
  roundID: number;
  createdAt: Date;
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
  roomID: number;
  children: React.ReactNode;
};

export const MessagesProvider = ({
  roundID,
  roomID,
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
      await sendMessageAction({
        playerId,
        playerName,
        messageText,
        roundID,
        roomId: roomID,
      });
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
        const data = await getMessagesAction({ roundID });
        setMessages(data as Message[]);
        // const { data, error } = await supabase
        //   .from("messages")
        //   .select("*")
        //   .eq("round_id", roundID)
        //   .order("created_at", { ascending: true });

        // if (error) {
        //   console.error("Failed to fetch messages:", error);
        //   setError("حصل خطأ أثناء جلب الرسائل.");
        // } else {
        //   setMessages(data || []);
        // }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("حصل خطأ أثناء جلب الرسائل.");
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();

    // Listen for new messages via Socket.IO
    socket.on("new-message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("new-message");
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
