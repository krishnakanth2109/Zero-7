import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AdminHomeForm = () => {
  const [forms, setForms] = useState([]);

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

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms`);
        const initialData = res.data.map((form) => ({ ...form, highlighted: false }));
        setForms(initialData);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      }
    };
    fetchForms();
  }, []);

  const table = useMaterialReactTable({
    columns,
    data: forms,
    enableRowSelection: false,
    enableGlobalFilter: true,
    enableColumnOrdering: true,
    positionToolbarAlertBanner: "bottom",
  });

  return <MaterialReactTable table={table} />;
};

export default AdminHomeForm;
