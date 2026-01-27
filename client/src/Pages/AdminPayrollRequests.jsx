// File: src/Pages/AdminPayrollRequests.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  IndianRupee, // Replaced Receipt with IndianRupee
  Loader2, 
  ShieldX, 
  Trash2, 
  Download,
  FileText 
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  const handleExport = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Format data for cleaner export
    const formattedData = requests.map(req => ({
      "Client Name": req.name,
      "Email": req.email,
      "Company": req.company,
      "Request Date": new Date(req.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["Payroll Requests"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, "payroll-requests" + fileExtension);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-slate-900">
      
      {/* ============ BLUE HEADER SECTION ============ */}
      <div className="bg-[#1976d2] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white">
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-center space-x-5 w-full md:w-auto mb-6 md:mb-0">
          <div className="bg-white p-4 rounded-full flex items-center justify-center shadow-md">
            <IndianRupee className="text-[#1976d2]" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll Consultation Requests</h1>
            <p className="text-blue-100 opacity-90 text-sm font-medium mt-1">
              List of clients requesting payroll services
            </p>
          </div>
        </div>

        {/* Right Side: Stats Card */}
        <div className="flex items-center justify-center w-full md:w-auto">
          <div className="bg-white text-gray-800 rounded-lg py-3 px-8 min-w-[160px] flex flex-col items-center shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center space-x-2 text-[#1976d2] mb-1">
              <FileText size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">TOTAL</span>
            </div>
            <span className="text-4xl font-extrabold text-gray-900">{requests.length}</span>
          </div>
        </div>
      </div>
      {/* =========================================== */}

      {/* Content Area Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        
        {/* Export Button Area */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Request List</h2>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || requests.length === 0}
          >
            <Download size={18} className="mr-2" />
            Export to Excel
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin text-[#1976d2]" size={48} />
            <p className="mt-4 font-medium">Loading Requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-red-600 bg-red-50 rounded-lg">
            <ShieldX size={48} />
            <p className="mt-4 font-bold">{error}</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {req.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {req.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {req.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(req.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                          title="Delete Request"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400 bg-gray-50"
                    >
                      <div className="flex flex-col items-center">
                        <IndianRupee size={40} className="mb-2 opacity-50 text-slate-400" />
                        <p>No payroll requests found.</p>
                      </div>
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

export default AdminPayrollRequests;