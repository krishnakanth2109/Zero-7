// AdminNotifications.jsx
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function AdminNotifications() {
  const audioContextRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    // Function to unlock audio context
    const unlockAudio = async () => {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      audioUnlockedRef.current = true;
    };

    // Function to play notification sound
    const playSound = async () => {
      try {
        if (!audioUnlockedRef.current) await unlockAudio();
        const audio = new Audio("/sounds/notification.wav");
        await audio.play();
      } catch (err) {
        console.log("🔔 Sound blocked:", err);
      }
    };

    // Unlock on first user interaction
    const clickUnlock = () => unlockAudio();
    document.addEventListener("click", clickUnlock, { once: true });
    document.addEventListener("touchstart", clickUnlock, { once: true });

    // Request Web Notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Setup socket connection
    const socket = io(API_URL.replace("/api", ""));
    socket.on("newFormSubmission", (newForm) => {
      // Play sound
      playSound();

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("New Form Submission", {
          body: `${newForm.name} submitted a form`,
          icon: "/logo192.png",
        });
      }
    });

    // Cleanup
    return () => {
      socket.disconnect();
      document.removeEventListener("click", clickUnlock);
      document.removeEventListener("touchstart", clickUnlock);
    };
  }, []); // empty dependency array, no ESLint warning

  return null; // Component does not render anything
}
