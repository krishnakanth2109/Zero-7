// File: src/Pages/AdminContactInquiries.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios"; 
import { Loader2, ShieldX, Trash2, Contact } from "lucide-react"; 
import * as XLSX from "xlsx"; 

const AdminContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const response = await api.get("/contact-inquiries");
        setInquiries(response.data);
      } catch (e) {
        console.error("Error fetching inquiries:", e);
        setError("Failed to load inquiry data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await api.delete(`/contact-inquiries/${id}`);
        setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
      } catch (err) {
        console.error("Error deleting inquiry:", err);
        alert("Failed to delete the inquiry. Please try again.");
      }
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = inquiries.map(
      ({ _id, __v, updatedAt, ...rest }) => ({
        ...rest,
        createdAt: new Date(rest.createdAt).toLocaleString(),
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Inquiries");

    XLSX.writeFile(workbook, "ContactInquiries.xlsx");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      {/* 
         TOP HEADER CARD 
         - Solid Blue Background (bg-blue-600)
         - Icon Logic Fixed: White Circle (bg-white) with Blue Icon (text-blue-600)
      */}
      <div className="bg-blue-600 rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          {/* Icon Container: Solid White Circle */}
          <div className="bg-white p-3 rounded-full shadow-md">
            {/* Icon: Blue Color to contrast with the white circle */}
            <Contact className="text-blue-600" size={32} />
          </div>
          
          {/* Text Container */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Contact Us Inquiries
            </h3>
            <p className="text-blue-100 text-sm">
              Messages from the public contact form
            </p>
          </div>
        </div>

        {/* Stats Container (Right Side) */}
        <div className="text-right">
          <p className="text-3xl sm:text-5xl font-extrabold">
            {inquiries.length}
          </p>
          <p className="text-blue-100 text-sm">Total Inquiries</p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-700">All Inquiries</h4>
            <button
                onClick={handleExportToExcel}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
                Export to Excel
            </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="mt-4">Loading Inquiries...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-600">
            <ShieldX size={48} />
            <p className="mt-4 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* TABLE HEADER (Blue bg, White text) */}
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Submitted On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.length > 0 ? (
                  inquiries.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.service}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-sm whitespace-pre-wrap">
                        {item.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Inquiry"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No contact inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactInquiries;