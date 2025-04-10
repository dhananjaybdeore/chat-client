// pages/chat.js
"use client";

import { useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "@/lib/websocketService";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import styles from "./Chat.module.css"; // Import CSS module

export default function Chat() {
  const [partnerName, setPartnerName] = useState("");
  const [messages, setMessages] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [toasts, setToasts] = useState([]);
  const router = useRouter();

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");
    if (!userId || !userName) {
      router.push("/");
      return;
    }

    connectWebSocket(
      userId,
      userName,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setWaiting(false);
      },
      (waitingStatus, partnerName) => {
        setPartnerName(partnerName);
        setMessages([]);
        setWaiting(waitingStatus);
      },
      showToast
    );

    return () => disconnectWebSocket();
  }, [router]);

  return (
    <div className={styles.container}>
      {partnerName && (
        <h1 className={styles.header}>
          Connected with{" "}
          <span className={styles.partnerName}>{partnerName}</span>
        </h1>
      )}
      {waiting ? (
        <p className={styles.waiting}>🟡 Waiting for a new match...</p>
      ) : (
        <>
          <ChatWindow messages={messages} />
          <MessageInput onSend={sendMessage} />
        </>
      )}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => removeToast(toast.id)}
          index={index}
        />
      ))}
    </div>
  );
}
