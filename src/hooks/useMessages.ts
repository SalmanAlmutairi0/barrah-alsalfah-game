"use client";
import { MessagesContext } from "@/context/messagesContext";
import { useContext } from "react";

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used inside MessagesProvider");
  }
  return context;
};
