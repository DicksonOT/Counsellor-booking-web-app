import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 }); // adjust to your signalling port

// Track connected users { userId: ws }
const sessions = {};

wss.on("connection", (ws) => {
  console.log("🔌 New WebSocket connection");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      switch (data.type) {
        case "join-room":
          handleJoinRoom(ws, data);
          break;

        case "webrtc-offer":
          forwardToOtherParticipant(data.roomId, ws, data);
          break;

        case "webrtc-answer":
          forwardToOtherParticipant(data.roomId, ws, data);
          break;

        case "webrtc-ice-candidate":
          forwardToOtherParticipant(data.roomId, ws, data);
          break;

        default:
          console.log("⚠️ Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("❌ Error parsing WS message:", error);
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket disconnected");
    // Optionally: clean up sessions mapping
  });
});

function handleJoinRoom(ws, { userId, roomId, role }) {
  ws.userId = userId;
  ws.roomId = roomId;
  ws.role = role;

  if (!sessions[roomId]) sessions[roomId] = [];
  sessions[roomId].push(ws);

  console.log(`✅ ${role} (${userId}) joined room: ${roomId}`);

  // Notify the other participant
  forwardToOtherParticipant(roomId, ws, {
    type: "participant-joined",
    role,
    userId
  });
}

function forwardToOtherParticipant(roomId, senderWs, payload) {
  if (!sessions[roomId]) return;
  sessions[roomId].forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

console.log("🚀 WebSocket signalling server running on port 8081");
