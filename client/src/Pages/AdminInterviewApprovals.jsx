import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { CheckCircle, XCircle, Search, Filter } from 'lucide-react';

// Custom Alert Component
const Alert = ({ message, type, onClose }) => {
  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md border ${typeClasses[type]} shadow-lg transition-opacity duration-300 ease-in-out`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <span className="block sm:inline">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const AdminInterviewApprovals = () => {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  // Load counts from localStorage on initial render
  const [approvedCount, setApprovedCount] = useState(() => {
    return parseInt(localStorage.getItem('interviewApprovedCount')) || 0;
  });
  const [rejectedCount, setRejectedCount] = useState(() => {
    return parseInt(localStorage.getItem('interviewRejectedCount')) || 0;
  });
  const [pendingCount, setPendingCount] = useState(() => {
    return parseInt(localStorage.getItem('interviewPendingCount')) || 0;
  });

  // Function to show alerts
  const showCustomAlert = (message, type = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Alert disappears after 5 seconds
  };

  const fetchData = async () => {
    try {
      const response = await api.get('/interview/all');
      setInterviews(response.data);

      // Recalculate and update counts when data is fetched
      const allFetchedInterviews = response.data;
      const initialApproved = allFetchedInterviews.filter(c => c.approvalStatus === 'approved').length;
      const initialRejected = allFetchedInterviews.filter(c => c.approvalStatus === 'rejected').length;
      const initialPending = allFetchedInterviews.filter(c => c.approvalStatus === 'pending').length;

      setApprovedCount(initialApproved);
      setRejectedCount(initialRejected);
      setPendingCount(initialPending);

      localStorage.setItem('interviewApprovedCount', initialApproved);
      localStorage.setItem('interviewRejectedCount', initialRejected);
      localStorage.setItem('interviewPendingCount', initialPending);

    } catch (error) {
      console.error('Error fetching interviews:', error);
      showCustomAlert('Failed to load interviews.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Effect to update localStorage whenever counts change
  useEffect(() => {
    localStorage.setItem('interviewApprovedCount', approvedCount.toString());
  }, [approvedCount]);

  useEffect(() => {
    localStorage.setItem('interviewRejectedCount', rejectedCount.toString());
  }, [rejectedCount]);

  useEffect(() => {
    localStorage.setItem('interviewPendingCount', pendingCount.toString());
  }, [pendingCount]);

  // --- Action Handlers ---
  const handleApprove = async (interviewId) => {
    try {
      await api.patch(`/interview/${interviewId}`, {
        approvalStatus: 'approved',
      });
      setInterviews((prevInterviews) =>
        prevInterviews.map((c) =>
          c._id === interviewId ? { ...c, approvalStatus: 'approved' } : c,
        ),
      );
      setApprovedCount((prev) => prev + 1);
      setPendingCount((prev) => prev - 1);
      showCustomAlert('Interview approved successfully!', 'success');
    } catch (error) {
      console.error('Error approving interview:', error);
      showCustomAlert('Failed to approve interview.', 'error');
    }
  };

  const handleReject = async (interviewId) => {
    try {
      // NOTE: Original code had a typo `/candidates/${interviewId}/status`.
      // Changed to `/interview/${interviewId}` assuming it should target the interview endpoint.
      // Please verify your backend endpoint for rejecting interviews.
      await api.patch(`/interview/${interviewId}`, {
        approvalStatus: 'rejected',
      });
      setInterviews((prevInterviews) =>
        prevInterviews.map((c) =>
          c._id === interviewId ? { ...c, approvalStatus: 'rejected' } : c,
        ),
      );
      setRejectedCount((prev) => prev + 1);
      setPendingCount((prev) => prev - 1);
      showCustomAlert('Interview rejected successfully!', 'success');
    } catch (error) {
      console.error('Error rejecting interview:', error);
      showCustomAlert('Failed to reject interview.', 'error');
    }
  };

  // --- Status Badge Styling ---
  const getStatusClasses = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Memoized filtered and searched interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch =
        interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.interviewLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (interview.userName && interview.userName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter =
        filterStatus === 'all' || interview.approvalStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [interviews, searchTerm, filterStatus]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Interview Approvals Dashboard
      </h2>

      {/* Status Count Containers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-yellow-400 transform hover:scale-105 transition-transform duration-200 ease-in-out">
          <div>
            <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
            <p className="text-sm text-gray-500">Pending Approvals</p>
          </div>
          <span className="text-yellow-500 bg-yellow-100 p-3 rounded-full">
            <Filter className="h-6 w-6" />
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-green-400 transform hover:scale-105 transition-transform duration-200 ease-in-out">
          <div>
            <p className="text-2xl font-bold text-gray-800">{approvedCount}</p>
            <p className="text-sm text-gray-500">Approved Interviews</p>
          </div>
          <span className="text-green-500 bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6" />
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-red-400 transform hover:scale-105 transition-transform duration-200 ease-in-out">
          <div>
            <p className="text-2xl font-bold text-gray-800">{rejectedCount}</p>
            <p className="text-sm text-gray-500">Rejected Interviews</p>
          </div>
          <span className="text-red-500 bg-red-100 p-3 rounded-full">
            <XCircle className="h-6 w-6" />
          </span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by candidate name, company, role..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Candidate Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Company Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Interview Level
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Recruiter
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Approval Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview) => (
                <tr key={interview._id} className="hover:bg-gray-100 transition-colors duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {interview.candidateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {interview.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {interview.jobRole}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {interview.interviewLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {interview.userName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusClasses(
                        interview.status,
                      )}`}
                    >
                      {interview.status.charAt(0).toUpperCase() +
                        interview.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusClasses(
                        interview.approvalStatus,
                      )}`}
                    >
                      {interview.approvalStatus.charAt(0).toUpperCase() +
                        interview.approvalStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleApprove(interview._id)}
                          className="p-2 rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110 duration-200"
                          title="Approve"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(interview._id)}
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-110 duration-200"
                          title="Reject"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
          
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-gray-500 text-lg">
                  No interviews found for the current search/filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInterviewApprovals;