import { WebSocketServer, WebSocket } from "ws";

export const sessions = {};

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    if (!req.url?.startsWith('/sessions/')) {
      ws.close(4001, "Invalid connection path");
      return;
    }

    const parts = req.url.split('/');
    const userId = parts[2]; // /sessions/{userId}

    if (!userId) {
      ws.close(4001, "No userId provided");
      return;
    }

    console.log(`WS user connected with userId: ${userId}`);

    if (!sessions[userId]) {
      sessions[userId] = [];
    }

    sessions[userId].push(ws);

    ws.on("message", (message) => {
      console.log(`Received message for userId ${userId}:`, message.toString());

      sessions[userId].forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on("close", () => {
      sessions[userId] = sessions[userId].filter((c) => c !== ws);
      if (sessions[userId].length === 0) {
        delete sessions[userId];
      }
      console.log(`WS connection closed for userId: ${userId}`);
    });

    ws.on("error", (error) => {
      console.error(`WS error for userId ${userId}:`, error);
    });
  });

  console.log("WebSocket server initialized and listening");
};
