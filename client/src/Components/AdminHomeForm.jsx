import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AdminHomeForm = () => {
  const [forms, setForms] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    fetchForms();

    const socket = io(API_URL.replace("/api", "")); // connect to backend
    socket.on("newFormSubmission", (newForm) => {
      setForms((prev) => [newForm, ...prev]);
      setHasNew(true);

      // 🔔 Play sound
      const audio = new Audio("/notification.mp3");
      audio.play();
    });

    return () => socket.disconnect();
  }, []);

  const fetchForms = async () => {
    const res = await axios.get(`${API_URL}/forms`);
    setForms(res.data);
  };

  return (
    <div>
      <h2>Form Submissions {hasNew && "🔴"}</h2>
      <ul>
        {forms.map((f) => (
          <li key={f._id}>
            <strong>{f.name}</strong> ({f.email}) - {f.purpose}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHomeForm;
