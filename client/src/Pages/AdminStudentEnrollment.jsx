// File: src/Pages/AdminCandidateEnrollment.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios"; // Use your central axios instance
import * as XLSX from "xlsx"; // Import the xlsx library
import { Trash2, Download } from "lucide-react"; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminCandidateEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleExportToExcel = () => {
    const dataToExport = enrollments.map(({ _id, __v, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");
    XLSX.writeFile(workbook, "CandidateEnrollments.xlsx");
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedEnrollments(enrollments.map((e) => e._id));
    } else {
      setSelectedEnrollments([]);
    }
  };

  const handleSelectRow = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedEnrollments((prev) => [...prev, id]);
    } else {
      setSelectedEnrollments((prev) => prev.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    if (enrollments.length > 0 && selectedEnrollments.length === enrollments.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedEnrollments, enrollments]);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/candidate-enrollment/${id}`);
          setEnrollments(enrollments.filter(enrollment => enrollment._id !== id));
          setSelectedEnrollments(selectedEnrollments.filter(itemId => itemId !== id));
          MySwal.fire('Deleted!', 'The enrollment has been deleted.', 'success');
        } catch (error) {
          console.error('Failed to delete enrollment:', error);
          MySwal.fire('Error', 'Failed to delete enrollment.', 'error');
        }
      }
    });
  };

  const handleDeleteSelected = async () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedEnrollments.length} enrollments. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedEnrollments.map((id) => api.delete(`/candidate-enrollment/${id}`))
          );
          fetchEnrollments();
          setSelectedEnrollments([]);
          setSelectAll(false);
          MySwal.fire('Deleted!', 'The selected enrollments have been deleted.', 'success');
        } catch (error) {
          console.error('Failed to delete selected enrollments:', error);
          MySwal.fire('Error', 'Failed to delete some or all selected enrollments.', 'error');
        }
      }
    });
  };

  return (
    // FIX: Changed width to w-[80vw] to ensure it fits next to the sidebar without overflow issues
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 w-[80vw] box-border">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight uppercase">
          Candidate Enrollments
        </h2>
        
        {/* Buttons Container */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:justify-end">
            {selectedEnrollments.length > 0 && (
                <button
                    onClick={handleDeleteSelected}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-200"
                >
                    <Trash2 size={18} className="mr-2" />
                    Delete ({selectedEnrollments.length})
                </button>
            )}
            
            <button
              onClick={handleExportToExcel}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200"
            >
              <Download size={18} className="mr-2" />
              Export to Excel
            </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      )}
      {error && <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

      {/* Table Section */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-blue-600">
                <tr>
                  <th scope="col" className="px-6 py-4 w-4">
                      <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                  </th>
                  <th scope="col" className="px-6 py-4">S.No</th> {/* Added S.No Column Header */}
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Contact</th>
                  <th scope="col" className="px-6 py-4">Email</th>
                  <th scope="col" className="px-6 py-4">Location</th>
                  <th scope="col" className="px-6 py-4">Role</th>
                  <th scope="col" className="px-6 py-4">Skills</th>
                  <th scope="col" className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment, index) => (
                    <tr
                      key={enrollment._id}
                      className={`transition-colors duration-150 ${
                          selectedEnrollments.includes(enrollment._id)
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <td className="px-6 py-4">
                          <input
                              type="checkbox"
                              checked={selectedEnrollments.includes(enrollment._id)}
                              onChange={(e) => handleSelectRow(e, enrollment._id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                      </td>
                      {/* Added S.No Data Cell */}
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {enrollment.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{enrollment.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{enrollment.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{enrollment.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{enrollment.role}</td>
                      <td className="px-6 py-4 max-w-xs truncate" title={enrollment.skills}>
                        {enrollment.skills}
                      </td>
                      <td className="px-6 py-4 text-center">
                          <button
                              onClick={() => handleDelete(enrollment._id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                              title="Delete Enrollment"
                          >
                              <Trash2 size={20} />
                          </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-medium">No enrollments found</p>
                        <p className="text-sm">New candidate submissions will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateEnrollment;