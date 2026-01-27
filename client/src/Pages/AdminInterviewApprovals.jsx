import { useState, useEffect, useMemo } from 'react'
import api from '../api/axios'
import { CheckCircle, XCircle, Search, Filter, Download } from 'lucide-react'

// Custom Alert Component
const Alert = ({ message, type, onClose }) => {
  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md border ${typeClasses[type]} shadow-lg transition-opacity duration-300 ease-in-out`} role='alert'>
      <div className='flex items-center justify-between'>
        <span className='block sm:inline'>{message}</span>
        <button onClick={onClose} className='ml-4 text-gray-700 hover:text-gray-900 focus:outline-none'>
          <XCircle className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}

const AdminInterviewApprovals = () => {
  const [interviews, setInterviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApprovalStatuses, setSelectedApprovalStatuses] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('info')

  // --- Date Formatting Helper ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const pendingCount = useMemo(() => interviews.filter((i) => i.approvalStatus === 'pending').length, [interviews])
  const approvedCount = useMemo(() => interviews.filter((i) => i.approvalStatus === 'approved').length, [interviews])
  const rejectedCount = useMemo(() => interviews.filter((i) => i.approvalStatus === 'rejected').length, [interviews])

  const showCustomAlert = (message, type = 'info') => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const fetchData = async () => {
    try {
      const response = await api.get('/interview/all')
      setInterviews(response.data)
    } catch (error) {
      console.error('Error fetching interviews:', error)
      showCustomAlert('Failed to load interviews.', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (interviewId) => {
    try {
      await api.patch(`/interview/${interviewId}`, { approvalStatus: 'approved' })
      setInterviews((prev) => prev.map((i) => i._id === interviewId ? { ...i, approvalStatus: 'approved' } : i))
      showCustomAlert('Interview approved successfully!', 'success')
    } catch (error) {
      showCustomAlert('Failed to approve interview.', 'error')
    }
  }

  const handleReject = async (interviewId) => {
    try {
      await api.patch(`/interview/${interviewId}`, { approvalStatus: 'rejected' })
      setInterviews((prev) => prev.map((i) => i._id === interviewId ? { ...i, approvalStatus: 'rejected' } : i))
      showCustomAlert('Interview rejected successfully!', 'success')
    } catch (error) {
      showCustomAlert('Failed to reject interview.', 'error')
    }
  }

  const handleApprovalStatusCheckboxChange = (status) => {
    setSelectedApprovalStatuses((prev) => prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status])
  }

  const getStatusClasses = (status) => {
    if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800'
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === 'approved' || lowerStatus === 'placed') return 'bg-green-100 text-green-800'
    if (lowerStatus === 'rejected') return 'bg-red-100 text-red-800'
    if (lowerStatus === 'pending') return 'bg-yellow-100 text-yellow-800'
    if (lowerStatus === 'scheduled') return 'bg-blue-100 text-blue-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const filteredInterviews = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return interviews.filter((interview) => {
      const candidateName = (interview.candidateName || '').toLowerCase()
      const companyName = (interview.companyName || '').toLowerCase()
      const jobRole = (interview.jobRole || '').toLowerCase()
      
      const matchesSearch = candidateName.includes(lowerCaseSearchTerm) || 
                            companyName.includes(lowerCaseSearchTerm) || 
                            jobRole.includes(lowerCaseSearchTerm)

      const matchesApprovalStatus = selectedApprovalStatuses.length === 0 || 
                                    selectedApprovalStatuses.includes(interview.approvalStatus)

      return matchesSearch && matchesApprovalStatus
    })
  }, [interviews, searchTerm, selectedApprovalStatuses])

  const handleExport = () => {
    if (filteredInterviews.length === 0) {
      showCustomAlert('No data to export.', 'info')
      return
    }

    const headers = ['S.No', 'Candidate Name', 'Company Name', 'Role', 'Date', 'Interview Level', 'Recruiter', 'Status', 'Approval Status']
    const csvRows = filteredInterviews.map((interview, index) => [
      index + 1,
      `"${String(interview.candidateName || '').replace(/"/g, '""')}"`,
      `"${String(interview.companyName || '').replace(/"/g, '""')}"`,
      `"${String(interview.jobRole || '').replace(/"/g, '""')}"`,
      `"${formatDate(interview.date)}"`,
      `"${String(interview.interviewLevel || '').replace(/"/g, '""')}"`,
      `"${String(interview.userName || '').replace(/"/g, '""')}"`,
      `"${String(interview.status || '').replace(/"/g, '""')}"`,
      `"${String(interview.approvalStatus || '').replace(/"/g, '""')}"`,
    ].join(','))

    const csvContent = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'interview_approvals.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showCustomAlert('Data exported successfully!', 'success')
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen w-[80vw]'>
      {showAlert && <Alert message={alertMessage} type={alertType} onClose={() => setShowAlert(false)} />}

      <h2 className='text-4xl font-extrabold text-gray-900 mb-8 text-center'>Interview Approvals Dashboard</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
         <div className='bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-yellow-400 transform hover:scale-105 transition-transform duration-200 ease-in-out'>
          <div><p className='text-2xl font-bold text-gray-800'>{pendingCount}</p><p className='text-sm text-gray-500'>Pending Approvals</p></div>
          <span className='text-yellow-500 bg-yellow-100 p-3 rounded-full'><Filter className='h-6 w-6' /></span>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-green-400 transform hover:scale-105 transition-transform duration-200 ease-in-out'>
          <div><p className='text-2xl font-bold text-gray-800'>{approvedCount}</p><p className='text-sm text-gray-500'>Approved Interviews</p></div>
          <span className='text-green-500 bg-green-100 p-3 rounded-full'><CheckCircle className='h-6 w-6' /></span>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-red-400 transform hover:scale-105 transition-transform duration-200 ease-in-out'>
          <div><p className='text-2xl font-bold text-gray-800'>{rejectedCount}</p><p className='text-sm text-gray-500'>Rejected Interviews</p></div>
          <span className='text-red-500 bg-red-100 p-3 rounded-full'><XCircle className='h-6 w-6' /></span>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='relative w-full sm:w-1/2'>
          <input
            type='text'
            placeholder='Search by candidate name, company, role...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10' />
        </div>

        <div className='flex items-center space-x-4'>
          {['approved', 'pending', 'rejected'].map(status => (
            <label key={status} className='flex items-center space-x-2 text-gray-700 cursor-pointer capitalize'>
              <input
                type='checkbox'
                className='form-checkbox h-4 w-4'
                checked={selectedApprovalStatuses.includes(status)}
                onChange={() => handleApprovalStatusCheckboxChange(status)}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>

        <button onClick={handleExport} className='flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all'>
          <Download className='h-4 w-5 mr-2' /> Export
        </button>
      </div>

      <div className='overflow-x-auto bg-white shadow-xl rounded-xl'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-[#267edc] text-white'>
            <tr>
              {/* S.NO HEADER */}
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>S.No</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Candidate Name</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Company Name</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Role</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Date</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Level</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Recruiter</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Status</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase'>Approval</th>
              <th className='px-6 py-3 text-center text-xs font-semibold uppercase'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview, index) => (
                <tr key={interview._id} className='hover:bg-gray-100 transition-colors'>
                  {/* S.NO CELL */}
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>{index + 1}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{interview.candidateName}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{interview.companyName}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{interview.jobRole}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold'>
                    {formatDate(interview.date)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{interview.interviewLevel}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{interview.userName || 'N/A'}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(interview.status)}`}>
                      {interview.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(interview.approvalStatus)}`}>
                      {interview.approvalStatus}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                    <div className='flex justify-center space-x-3'>
                      <button onClick={() => handleApprove(interview._id)} className='text-green-600 hover:bg-green-100 p-2 rounded-full'><CheckCircle className='h-5 w-5' /></button>
                      <button onClick={() => handleReject(interview._id)} className='text-red-600 hover:bg-red-100 p-2 rounded-full'><XCircle className='h-5 w-5' /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan='10' className='px-6 py-10 text-center text-gray-500'>No interviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminInterviewApprovals