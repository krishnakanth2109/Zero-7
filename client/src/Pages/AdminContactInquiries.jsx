// File: src/Pages/AdminContactInquiries.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios"; // Assuming you have a central axios instance
import { MessageSquare, Loader2, ShieldX, Trash2 } from "lucide-react";

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

  return (
    // The main container div remains largely the same.
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      
      {/* --- UPDATED: Header color changed to a blue gradient --- */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <MessageSquare size={28} />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Contact Us Inquiries</h3>
            {/* --- UPDATED: Subtitle text color to match the blue theme --- */}
            <p className="text-blue-200 text-sm">Messages from the public contact form</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl sm:text-5xl font-extrabold">{inquiries.length}</p>
          {/* --- UPDATED: Subtitle text color to match the blue theme --- */}
          <p className="text-blue-200 text-sm">Total Inquiries</p>
        </div>
      </div>

      {/* Content Area Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            {/* --- UPDATED: Loader spin color changed to blue --- */}
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
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.length > 0 ? (
                  inquiries.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.service}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-sm whitespace-pre-wrap">{item.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Inquiry">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
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