"use client";

import React from "react";
import { ChatMessage } from "./types";

type MessageProps = {
  message: ChatMessage;
  isCurrentPlayer: boolean;
}

export default function Message({ message, isCurrentPlayer }: MessageProps) {
  return (
    <div
      className={`flex gap-3 ${
        isCurrentPlayer ? "justify-end" : "justify-start"
      }`}
    >
      {!isCurrentPlayer && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
          {message.player_name.charAt(0).toUpperCase()}
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words overflow-hidden overflow-x-hidden ${
          isCurrentPlayer
            ? "bg-primary text-primary-foreground"
            : "bg-muted border border-border"
        }`}
      >
        {!isCurrentPlayer && (
          <p className="text-xs font-medium mb-1 opacity-70">
            {message.player_name}
          </p>
        )}
        <p className="text-sm break-words break-all whitespace-pre-wrap">
          {message.message}
        </p>
        <p
          className={`text-xs mt-1 ${
            isCurrentPlayer ? "opacity-70" : "text-muted-foreground"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {isCurrentPlayer && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
          {message.player_name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
