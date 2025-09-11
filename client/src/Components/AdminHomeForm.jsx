import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AdminHomeForm = () => {
  const [forms, setForms] = useState([]);

  const columns = useMemo(
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

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms`);
        setForms(res.data); // Assuming res.data is an array of FormSubmission
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      }
    };
    fetchForms();
  }, []);

  return (
    <MaterialReactTable
      columns={columns}
      data={forms}
      enableRowSelection={false}
      enableGlobalFilter
      enableColumnOrdering
      positionToolbarAlertBanner="bottom"
    />
  );
};

export default AdminHomeForm;
