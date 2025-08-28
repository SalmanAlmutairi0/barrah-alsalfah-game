"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./types";
import Message from "./Message";
import { MessageCircle } from "lucide-react";

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
        {messages.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground" dir="rtl">
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                <MessageCircle className="w-7 h-7" />
              </span>
              <span className="text-lg font-semibold" dir="rtl">
                مافيه رسايل إلى الآن
              </span>
              <span className="text-sm" dir="rtl">
                ابدأ اسأل اخوياك وخل النقاش يبتدي!
              </span>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isCurrentPlayer={message.playerId === currentPlayerId}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </ScrollArea>
  );
}
