"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./types";
import Message from "./Message";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentPlayerId: number;
}

export default function ChatMessages({
  messages,
  currentPlayerId,
}: ChatMessagesProps) {
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 pr-2 md:pr-4 min-h-0 overflow-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isCurrentPlayer={message.playerId === currentPlayerId}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
    </ScrollArea>
  );
}
