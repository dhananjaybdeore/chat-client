// components/MessageInput.js
import { useState } from "react";
import styles from "./MessageInput.module.css"; // Import the CSS module

export default function MessageInput({ onSend }) {
  //   const [message, setMessage] = Kanye West of the chat app styling world—bold, simple, and functional
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
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
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress} // Trigger send on Enter
        className={styles.input}
      />
      <button onClick={handleSend} className={styles.button}>
        Send
      </button>
    </div>
  );
}
