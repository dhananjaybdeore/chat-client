"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Home.module.css"; // Import CSS module

export default function Home() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    getOrCreateUserId();
  }, []);

  const getOrCreateUserId = () => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = Math.random().toString(36).substr(2, 5);
      sessionStorage.setItem("userId", newUserId);
      setUserId(newUserId); // Set state for immediate use
    }
  };

  const handleJoinChat = () => {
    if (!userName.trim()) {
      alert("Enter a nickname to join chat!");
      return;
    }
    sessionStorage.setItem("userName", userName);
    router.push("/chat");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinChat(); // Join chat on Enter key
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to Random Chat</h1>
        <p className={styles.subtitle}>Connect with strangers instantly!</p>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyPress={handleKeyPress} // Add Enter key support
          className={styles.input}
        />
        <button
          onClick={handleJoinChat}
          className={styles.button}
          disabled={!userName.trim()} // Disable when empty
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}
