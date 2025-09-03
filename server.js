import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Ensure singleton Socket.IO server instance
  if (!global._io) {
    global._io = new Server(httpServer, {
      cors: {
        origin: dev
          ? ["http://localhost:3000", "http://127.0.0.1:3000"]
          : false,
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket"],
      perMessageDeflate: false,
      pingInterval: 10000,
      pingTimeout: 20000,
    });
  }
  const io = global._io;

  // Make io globally available for server actions
  global.io = io;

  // Store disconnection timers
  const disconnectionTimers = new Map();

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle room joining with player info
    socket.on("join-room", ({ roomId, playerID }) => {
      // Check if already in room to avoid duplicate logs
      if (!socket.rooms.has(roomId)) {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      }

      // Store player info on socket for disconnection handling
      if (playerID) {
        socket.playerID = playerID;
        socket.roomId = roomId;
        console.log(`Socket ${socket.id} associated with player ${playerID}`);

        // Cancel any existing disconnection timer for this player (they reconnected)
        if (disconnectionTimers.has(playerID)) {
          clearTimeout(disconnectionTimers.get(playerID));
          disconnectionTimers.delete(playerID);
          console.log(
            `Cancelled disconnection timer for player ${playerID} (reconnected)`
          );
        }
      }
    });

    // Handle room leaving
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      // If this socket had a player associated, mark them as inactive after grace period
      if (socket.playerID && socket.roomId) {
        const playerID = socket.playerID;
        const roomId = socket.roomId;

        console.log(
          `Player ${playerID} disconnected - starting 5s grace period`
        );

        // Start disconnection timer
        const timer = setTimeout(() => {
          console.log(
            `Grace period expired for player ${playerID} - emitting player-left`
          );

          // Simply emit player-left event (the hook will handle the database update)
          io.to(roomId.toString()).emit("player-left", playerID);
          disconnectionTimers.delete(playerID);
        }, 5000); // 5 second grace period

        disconnectionTimers.set(playerID, timer);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running`);
    });
});
