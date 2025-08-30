"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import { useMessages } from "@/hooks/useMessages";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { Loader2 } from "lucide-react";



export default function DiscussionChat() {
  const { messages, sendMessage, messagesLoading, sendingMessage } = useMessages();
  const { playerInfo } = usePlayerInfo();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(
      newMessage.trim(),
      playerInfo.playerID,
      playerInfo.playerName
    );
    setNewMessage("");
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg w-full flex-1 flex flex-col min-w-0  min-h-[70vh] max-h-[70vh] md:min-h-[600px] md:max-h-[600px] overflow-hidden">
      <CardHeader>
        <ChatHeader />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {messagesLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
        <ChatMessages
          messages={messages}
            currentPlayerId={playerInfo.playerID}
          />
        )}

        <Separator className="my-4" />
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          isLoading={messagesLoading || sendingMessage}
        />
      </CardContent>
    </Card>
  );
}
