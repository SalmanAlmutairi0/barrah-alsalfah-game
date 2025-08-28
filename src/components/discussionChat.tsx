"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import { ChatMessage } from "./chat/types";

// Dummy game state
const currentPlayerId = 1;

const initialMessages: ChatMessage[] = [
  // {
  //   id: 1,
  //   playerId: 2,
  //   playerName: "علي",
  //   message: "أنا أحب الموز لأنه سهل الأكل!",
  //   timestamp: new Date(),
  // },
  // {
  //   id: 2,
  //   playerId: 3,
  //   playerName: "سارة",
  //   message: "التفاح هو المفضل لدي، منعش ومقرمش.",
  //   timestamp: new Date(),
  // },
  // {
  //   id: 3,
  //   playerId: 1,
  //   playerName: "أنت",
  //   message: "المانجو هو الأفضل، حلو ولذيذ!",
  //   timestamp: new Date(),
  // },
];

export default function DiscussionChat() {
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: chatMessages.length + 1,
      playerId: currentPlayerId,
      playerName: "You",
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg w-full flex-1 flex flex-col min-w-0 max-h-[70vh] md:max-h-[600px] overflow-hidden">
      <CardHeader>
        <ChatHeader />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatMessages
          messages={chatMessages}
          currentPlayerId={currentPlayerId}
        />

        <Separator className="my-4" />
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
        />
      </CardContent>
    </Card>
  );
}
