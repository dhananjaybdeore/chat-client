// // components/ChatWindow.js
// import { useEffect, useState } from "react";
// import Toast from "./Toast";
// import styles from "./ChatWindow.module.css"; // Import the CSS module

// export default function ChatWindow({ messages }) {
//   const [toast, setToast] = useState({ message: "", type: "info" });
//   const [userId, setUserId] = useState("");

//   const showToast = (message, type = "info") => {
//     setToast({ message, type });
//   };

//   useEffect(() => {
//     showToast("Connected to chat!", "success"); // Toast on mount
//   }, []);

//   useEffect(() => {
//     const userId = sessionStorage.getItem("userId");
//     setUserId(userId);
//   }, []);

//   return (
//     <div className={styles.chatContainer}>
//       {messages.length === 0 ? (
//         <p className={styles.emptyMessage}>Start chatting...</p>
//       ) : (
//         messages.map((msg, index) => (
//           <p
//             key={index}
//             className={`${styles.message} ${
//               msg.senderId === userId ? styles.self : styles.other
//             }`}
//           >
//             {msg.message}
//           </p>
//         ))
//       )}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         duration={3000}
//         onClose={() => setToast({ message: "", type: "info" })}
//       />
//     </div>
//   );
// }

// components/ChatWindow.js
import { useEffect, useState, useRef } from "react";
import Toast from "./Toast";
import styles from "./ChatWindow.module.css";

export default function ChatWindow({ messages }) {
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [userId, setUserId] = useState("");
  const chatContainerRef = useRef(null); // Ref to the chat container

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Set userId from sessionStorage
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setUserId(userId);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling for better UX
      });
    }
  }, [messages]); // Trigger whenever messages array changes

  return (
    <div className={styles.chatContainer} ref={chatContainerRef}>
      {messages.length === 0 ? (
        <p className={styles.emptyMessage}>Start chatting...</p>
      ) : (
        messages.map((msg, index) => (
          <p
            key={index}
            className={`${styles.message} ${
              msg.senderId === userId ? styles.self : styles.other
            }`}
          >
            {msg.message}
          </p>
        ))
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        duration={3000}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
