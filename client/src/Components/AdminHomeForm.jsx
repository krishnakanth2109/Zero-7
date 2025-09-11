import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Typography } from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AdminHomeFormTable = () => {
  const [forms, setForms] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  // Columns for MRT
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", size: 200 },
      { accessorKey: "email", header: "Email", size: 250 },
      { accessorKey: "purpose", header: "Purpose", size: 200 },
      { accessorKey: "message", header: "Message", size: 300 },
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

  // Fetch initial forms and setup socket
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms`);
        // Add 'highlighted: false' to all existing rows
        const initialData = res.data.map((form) => ({ ...form, highlighted: false }));
        setForms(initialData);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      }
    };
    fetchForms();

    const socket = io(API_URL.replace("/api", ""));
    socket.on("newFormSubmission", (newForm) => {
      const formWithHighlight = { ...newForm, highlighted: true };
      setForms((prev) => [formWithHighlight, ...prev]);
      setHasNew(true);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setForms((prev) =>
          prev.map((f) =>
            f._id === newForm._id ? { ...f, highlighted: false } : f
          )
        );
      }, 3000);

      // Play notification sound
      const playSound = () => {
        const audio = new Audio("/sounds/notification.wav");
        audio.play().catch(() => console.log("🔔 Sound blocked until interaction"));
      };

      playSound();
      document.addEventListener(
        "click",
        () => {
          if (hasNew) playSound();
        },
        { once: true }
      );
    });

    return () => socket.disconnect();
  }, []);

  const table = useMaterialReactTable({
    columns,
    data: forms,
    enableRowSelection: false, // disable row selection
    enableGlobalFilter: true,
    enableColumnOrdering: true,
    positionToolbarAlertBanner: "bottom",
  });

  return <MaterialReactTable table={table} />;
};

export default AdminHomeFormTable;
