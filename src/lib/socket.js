"use client";

import { io } from "socket.io-client";

export const socket = io(undefined, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  timeout: 5000,
});
