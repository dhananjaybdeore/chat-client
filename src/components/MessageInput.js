// components/MessageInput.js
import { useEffect, useRef, useState } from "react";
import styles from "./MessageInput.module.css"; // Import the CSS module
import { sendTyping } from "@/lib/websocketService";

export default function MessageInput({ onSend }) {
  //   const [message, setMessage] = Kanye West of the chat app styling world—bold, simple, and functional
  const [message, setMessage] = useState("");
  const lastTypingSent = useRef(0); // Track last TYPING send time
  const [userId, setUserId] = useState("");
  useEffect(() => {
    setUserId(sessionStorage.getItem("userId"));
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Send TYPING if 3s have passed and input isn't empty
    const now = Date.now();
    if (e.target.value.trim() && now - lastTypingSent.current >= 3000) {
      sendTyping(userId);
      lastTypingSent.current = now;
    }
  };
  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
    lastTypingSent.current = 0;
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend(); // Send message on Enter key press
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // Trigger send on Enter
        className={styles.input}
      />
      <button onClick={handleSend} className={styles.button}>
        Send
      </button>
    </div>
  );
}
