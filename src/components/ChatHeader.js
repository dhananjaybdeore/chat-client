// components/ChatHeader.js
import styles from "./ChatHeader.module.css";

export default function ChatHeader({ partnerName }) {
  if (!partnerName) return null; // Don’t render if no partner name

  return (
    <div className={styles.header}>
      <span className={styles.label}>Chatting with</span>
      <span className={styles.partnerName}>{partnerName}</span>
    </div>
  );
}
