// lib/websocketService.js
let socket = null;

export const connectWebSocket = (
  userId,
  userName,
  onMessage,
  onDisconnect,
  onToast
) => {
  if (socket) return;

  socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
  socket.onopen = () => {
    console.log("✅ WebSocket connected");
    // onToast?.("Connected to the server!", "success"); // Trigger toast instead of alert
    socket.send(JSON.stringify({ type: "JOIN_CHAT", userId, userName }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // console.log(`data: ` + JSON.stringify(data));
    if (data.type === "MATCHED") {
      console.log("✅ Matched with a new user!");
      onToast?.("Matched with a new user!", "success"); // Toast for match
      onDisconnect(false, data.userName);
    } else if (data.type === "DISCONNECTED") {
      console.log("⚠️ Your chat partner left. Waiting for a new match...");
      onToast?.("Your chat partner left. Waiting for a new match...", "error"); // Toast for disconnect
      onDisconnect(true); // Trigger waiting UI
    } else if (data.type === "RECEIVE_MESSAGE") {
      onMessage({ message: data.message, senderId: data.senderId });
    }
  };

  socket.onclose = () => {
    console.log("🔴 WebSocket disconnected");
    // onToast?.("WebSocket disconnected", "error"); // Toast for close
  };
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "SEND_MESSAGE", message }));
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "DISCONNECT" }));
    }
    socket.close();
    socket = null;
  }
};
