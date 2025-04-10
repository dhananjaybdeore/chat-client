// components/Toast.js
"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
  index = 0,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      style={{ top: `${20 + index * 60}px` }}
    >
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
