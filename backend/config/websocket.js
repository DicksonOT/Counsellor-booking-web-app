// import { WebSocketServer, WebSocket } from "ws";

// export const sessions = {};

// export const initWebSocket = (server) => {
//   const wss = new WebSocketServer({ server });

//   wss.on("connection", (ws, req) => {
//     if (!req.url?.startsWith('/sessions/')) {
//       ws.close(4001, "Invalid connection path");
//       return;
//     }

//     const parts = req.url.split('/');
//     const userId = parts[2]; // /sessions/{userId}

//     if (!userId) {
//       ws.close(4001, "No userId provided");
//       return;
//     }

//     console.log(`WS user connected with userId: ${userId}`);

//     if (!sessions[userId]) {
//       sessions[userId] = [];
//     }

//     sessions[userId].push(ws);

//     ws.on("message", (message) => {
//       console.log(`Received message for userId ${userId}:`, message.toString());

//       sessions[userId].forEach((client) => {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(message.toString());
//         }
//       });
//     });

//     ws.on("close", () => {
//       sessions[userId] = sessions[userId].filter((c) => c !== ws);
//       if (sessions[userId].length === 0) {
//         delete sessions[userId];
//       }
//       console.log(`WS connection closed for userId: ${userId}`);
//     });

//     ws.on("error", (error) => {
//       console.error(`WS error for userId ${userId}:`, error);
//     });
//   });

//   console.log("WebSocket server initialized and listening");
// };
import { WebSocketServer, WebSocket } from "ws";

export const sessions = {}; // userId => list of sockets
export const rooms = {};    // roomId => list of { userId, ws }

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    if (!req.url?.startsWith("/sessions/")) {
      ws.close(4001, "Invalid connection path");
      return;
    }

    const parts = req.url.split("/");
    const userId = parts[2]; // /sessions/{userId}
    if (!userId) {
      ws.close(4001, "No userId provided");
      return;
    }

    console.log(`🔌 WS connected: userId=${userId}`);

    // Track sessions per user
    if (!sessions[userId]) sessions[userId] = [];
    sessions[userId].push(ws);

    // Handle messages
    ws.on("message", (raw) => {
      let message;
      try {
        message = JSON.parse(raw.toString());
      } catch {
        console.error("Invalid WS message:", raw.toString());
        return;
      }

      // 1. Notifications (single user)
      if (message.type === "notification") {
        // already covered by sendRealTimeNotification
        return;
      }

      // 2. WebRTC signaling (broadcast in a room)
      if (message.type === "signal") {
        const { roomId, data } = message;
        if (!roomId) return;

        if (!rooms[roomId]) rooms[roomId] = [];
        if (!rooms[roomId].some((u) => u.userId === userId && u.ws === ws)) {
          rooms[roomId].push({ userId, ws });
        }

        rooms[roomId].forEach(({ ws: client, userId: uid }) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "signal", from: userId, data }));
          }
        });
      }
    });

    ws.on("close", () => {
      // remove from sessions
      sessions[userId] = sessions[userId].filter((c) => c !== ws);
      if (sessions[userId].length === 0) delete sessions[userId];

      // remove from rooms
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((c) => c.ws !== ws);
        if (rooms[roomId].length === 0) delete rooms[roomId];
      }

      console.log(`❌ WS closed: userId=${userId}`);
    });
  });

  console.log("✅ WebSocket server initialized with sessions + rooms");
};
