
import React, { useEffect, useState } from "react";
import api from "../api/axios"; // Use your central axios instance
import * as XLSX from "xlsx"; // Import the xlsx library

const AdminCandidateEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/candidate-enrollment");
        setEnrollments(data);
      } catch (e) {
        console.error("Error fetching enrollments:", e);
        setError("Failed to load enrollments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleExportToExcel = () => {
    // Remove internal fields like _id and __v before exporting
    const dataToExport = enrollments.map(({ _id, __v, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");
    XLSX.writeFile(workbook, "CandidateEnrollments.xlsx");
  };

  return (
    // Main container with padding and a light background
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header section with flex layout to space out title and button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Candidate Enrollments
        </h2>
        {/* Export Button with blue theme, hover effects, and transitions */}
        <button
          onClick={handleExportToExcel}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Export to Excel
        </button>
      </div>

      {/* Conditional Rendering for Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading enrollments...</p>}
      {error && <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Table section, rendered when not loading and no error */}
      {!loading && !error && (
        // Wrapper to handle table overflow on small screens and add a shadow/border
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg bg-white">
          <table className="w-full text-sm text-left text-gray-500">
            {/* Table Header */}
            <thead className="text-xs text-white uppercase bg-blue-500">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Skills</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  // Table Row with alternating background colors (zebra striping) and a bottom border
                  <tr
                    key={enrollment._id}
                    className="bg-white border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {enrollment.name}
                    </td>
                    <td className="px-6 py-4">{enrollment.contact}</td>
                    <td className="px-6 py-4">{enrollment.email}</td>
                    <td className="px-6 py-4">{enrollment.location}</td>
                    <td className="px-6 py-4">{enrollment.role}</td>
                    <td className="px-6 py-4">{enrollment.skills}</td>
                  </tr>
                ))
              ) : (
                // Message shown when there are no enrollments
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No new enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateEnrollment;