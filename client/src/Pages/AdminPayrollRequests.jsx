// File: src/Pages/AdminPayrollRequests.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Receipt, Loader2, ShieldX, Trash2 } from "lucide-react";

const AdminPayrollRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get("/payroll-consultations");
        setRequests(response.data);
      } catch (e) {
        console.error("Error fetching payroll requests:", e);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this consultation request?")) {
      try {
        await api.delete(`/payroll-consultations/${id}`);
        setRequests(requests.filter((req) => req._id !== id));
        alert("Request deleted successfully.");
      } catch (err) {
        console.error("Error deleting request:", err);
        alert("Failed to delete the request.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full"><Receipt size={28} /></div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Payroll Consultation Requests</h3>
            <p className="text-blue-200 text-sm">List of clients requesting payroll services</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl sm:text-5xl font-extrabold">{requests.length}</p>
          <p className="text-blue-200 text-sm">Total Requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading && <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-500" size={48} /></div>}
        {error && <div className="text-center py-16 text-red-600"><ShieldX size={48} className="mx-auto" /><p className="mt-4 font-semibold">{error}</p></div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleDelete(req._id)} className="text-red-600 hover:text-red-800" title="Delete Request"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No payroll requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayrollRequests;