import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AdminHomeForm = () => {
  const [forms, setForms] = useState([]);
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const previousLengthRef = useRef(0); // Track previous submissions

  // Columns for MaterialReactTable
  const columns = React.useMemo(
    () => [
      { accessorKey: "name", header: "Name", size: 150 },
      { accessorKey: "number", header: "Phone Number", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
      { accessorKey: "purpose", header: "Purpose", size: 200 },
      {
        accessorFn: (row) => new Date(row.createdAt),
        id: "createdAt",
        header: "Submitted At",
        sortingFn: "datetime",
        Cell: ({ cell }) =>
          cell.getValue().toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }),
      },
    ],
    []
  );

  // Load notification sound using Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const loadAudio = async () => {
      try {
        const response = await fetch("/notification.mp3"); // replace with your file
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.error("Failed to load audio:", err);
      }
    };

    loadAudio();
  }, []);

  // Function to play notification sound
  const playSound = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  // Fetch forms and check for new submissions
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms`);
        setForms(res.data);

        // Play sound if new form is submitted
        if (res.data.length > previousLengthRef.current) {
          playSound();
        }
        previousLengthRef.current = res.data.length;
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      }
    };

    fetchForms();
    const interval = setInterval(fetchForms, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Admin Forms</h2>
      <MaterialReactTable
        columns={columns}
        data={forms}
        enableRowSelection={false}
        enableGlobalFilter
        enableColumnOrdering
        positionToolbarAlertBanner="bottom"
      />
    </div>
  );
};

export default AdminHomeForm;
