import React, { useState, useEffect, useMemo } from 'react'
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
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md border ${typeClasses[type]} shadow-lg transition-opacity duration-300 ease-in-out`}
      role='alert'>
      <div className='flex items-center justify-between'>
        <span className='block sm:inline'>{message}</span>
        <button
          onClick={onClose}
          className='ml-4 text-gray-700 hover:text-gray-900 focus:outline-none'>
          <XCircle className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}

const AdminCandidateApprovals = () => {
  const [candidates, setCandidates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // State for filtering
  const [filterStatus, setFilterStatus] = useState('all') 
  const [activeStatus, setActiveStatus] = useState("all") 

  const [filterRole, setFilterRole] = useState('all') 
  const [filterLocation, setFilterLocation] = useState('all') 
  const [filterRecruiter, setFilterRecruiter] = useState('all') 
  
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('info')

  // Unified handler to sync Cards and Dropdown
  const handleFilterChange = (status) => {
    setActiveStatus(status)
    setFilterStatus(status)
  }

  // --- Derived Counts ---
  const pendingCount = useMemo(() => candidates.filter((c) => c.status === 'pending').length, [candidates])
  const approvedCount = useMemo(() => candidates.filter((c) => c.status === 'approved').length, [candidates])
  const rejectedCount = useMemo(() => candidates.filter((c) => c.status === 'rejected').length, [candidates])
  const placedCount = useMemo(() => candidates.filter((c) => c.status === 'placed').length, [candidates])

  // Function to show alerts
  const showCustomAlert = (message, type = 'info') => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const fetchData = async () => {
    try {
      const response = await api.get('/candidates/all') 
      setCandidates(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
      showCustomAlert('Failed to load candidates.', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, []) 

  // Extract unique values for filters
  const uniqueRecruiters = useMemo(() => {
    const recruiters = new Set(
      candidates.map((c) => c.userName).filter(Boolean),
    )
    return ['all', ...Array.from(recruiters).sort()]
  }, [candidates])

  // --- Action Handlers ---
  const handleApprove = async (candidateId) => {
    try {
      await api.patch(`/candidates/${candidateId}/status`, { status: 'approved' })
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c._id === candidateId ? { ...c, status: 'approved' } : c,
        ),
      )
      showCustomAlert('Candidate approved successfully!', 'success')
    } catch (error) {
      console.error('Error approving candidate:', error)
      showCustomAlert('Failed to approve candidate.', 'error')
    }
  }

  const handleReject = async (candidateId) => {
    try {
      await api.patch(`/candidates/${candidateId}/status`, { status: 'rejected' })
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c._id === candidateId ? { ...c, status: 'rejected' } : c,
        ),
      )
      showCustomAlert('Candidate rejected successfully!', 'success')
    } catch (error) {
      console.error('Error rejecting candidate:', error)
      showCustomAlert('Failed to reject candidate.', 'error')
    }
  }

  // --- Status Badge Styling ---
  const getStatusClasses = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'placed': return 'bg-purple-100 text-purple-800'
      case 'pending': default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  // --- CORE FILTERING LOGIC ---
  const filteredCandidates = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    return candidates.filter((candidate) => {
      const matchesSearch =
        (candidate.name && candidate.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (candidate.role && candidate.role.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (candidate.location && candidate.location.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (candidate.skills && candidate.skills.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (candidate.userName && candidate.userName.toLowerCase().includes(lowerCaseSearchTerm))

      const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus
      const matchesRecruiter = filterRecruiter === 'all' || (candidate.userName && candidate.userName === filterRecruiter)

      return matchesSearch && matchesStatus && matchesRecruiter
    })
  }, [candidates, searchTerm, filterStatus, filterRecruiter])

  // --- Export to CSV Functionality ---
  const handleExport = () => {
    if (filteredCandidates.length === 0) {
      showCustomAlert('No data to export based on current filters.', 'info')
      return
    }

    const headers = ['S.No', 'Name', 'Role', 'Location', 'Skills', 'Recruiter', 'Status']
    const csvRows = filteredCandidates.map((candidate, index) => {
      return [
        index + 1,
        `"${String(candidate.name || '').replace(/"/g, '""')}"`,
        `"${String(candidate.role || '').replace(/"/g, '""')}"`,
        `"${String(candidate.location || '').replace(/"/g, '""')}"`,
        `"${String(candidate.skills || '').replace(/"/g, '""')}"`,
        `"${String(candidate.userName || 'N/A').replace(/"/g, '""')}"`,
        `"${String(candidate.status || '').replace(/"/g, '""')}"`,
      ].join(',')
    })

    const csvContent = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'candidate_approvals.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showCustomAlert('Data exported successfully!', 'success')
    } else {
      showCustomAlert('Your browser does not support downloading files directly.', 'error')
    }
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen w-[80vw]'>
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <h2 className='text-4xl font-extrabold text-gray-900 mb-8 text-center'>
        Candidate Approval Dashboard
      </h2>

      {/* Status Count Containers */}
      <div className="flex w-full gap-6 mb-8 max-w-6xl flex-nowrap overflow-x-auto pb-4 sm:pb-0">
        <div
          onClick={() => handleFilterChange("pending")}
          className={`flex-1 min-w-[200px] bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-b-4 cursor-pointer transition
            ${activeStatus === "pending" ? "border-yellow-500 ring-2 ring-yellow-200" : "border-blue-400 hover:scale-105"}
          `}
        >
          <div>
            <p className="text-xl font-bold text-gray-800">{pendingCount}</p>
            <p className="text-sm text-gray-500">Pending Approvals</p>
          </div>
          <span className="text-yellow-500 bg-yellow-100 p-2 rounded-full shrink-0">
            <Filter className="h-5 w-5" />
          </span>
        </div>

        <div
          onClick={() => handleFilterChange("approved")}
          className={`flex-1 min-w-[200px] bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-b-4 cursor-pointer transition
            ${activeStatus === "approved" ? "border-green-500 ring-2 ring-green-200" : "border-blue-400 hover:scale-105"}
          `}
        >
          <div>
            <p className="text-xl font-bold text-gray-800">{approvedCount}</p>
            <p className="text-sm text-gray-500">Approved Candidates</p>
          </div>
          <span className="text-green-500 bg-green-100 p-2 rounded-full shrink-0">
            <CheckCircle className="h-5 w-5" />
          </span>
        </div>

        <div
          onClick={() => handleFilterChange("rejected")}
          className={`flex-1 min-w-[200px] bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-b-4 cursor-pointer transition
            ${activeStatus === "rejected" ? "border-red-500 ring-2 ring-red-200" : "border-blue-400 hover:scale-105"}
          `}
        >
          <div>
            <p className="text-xl font-bold text-gray-800">{rejectedCount}</p>
            <p className="text-sm text-gray-500">Rejected Candidates</p>
          </div>
          <span className="text-red-500 bg-red-100 p-2 rounded-full shrink-0">
            <XCircle className="h-5 w-5" />
          </span>
        </div>

        <div
          onClick={() => handleFilterChange("placed")}
          className={`flex-1 min-w-[200px] bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-b-4 cursor-pointer transition
            ${activeStatus === "placed" ? "border-purple-500 ring-2 ring-purple-200" : "border-blue-400 hover:scale-105"}
          `}
        >
          <div>
            <p className="text-xl font-bold text-gray-800">{placedCount}</p>
            <p className="text-sm text-gray-500">Placed Candidates</p>
          </div>
          <span className="text-purple-500 bg-purple-100 p-2 rounded-full shrink-0">
            <CheckCircle className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Search, Filter, and Export Section */}
      <div className='flex flex-col md:flex-row flex-wrap justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4'>
        <div className='relative w-full md:w-1/3 lg:w-1/4'>
          <input
            type='text'
            placeholder='Search candidates...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
             <Search className="h-3 w-3" />
          </div>
        </div>

        <div className='relative w-full md:w-auto min-w-[150px]'>
          <select
            className='block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
            <option value='placed'>Placed</option>
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
        </div>

        <div className='relative w-full md:w-auto min-w-[150px]'>
          <select
            className='block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            value={filterRecruiter}
            onChange={(e) => setFilterRecruiter(e.target.value)}>
            {uniqueRecruiters.map((recruiter) => (
              <option key={recruiter} value={recruiter}>
                {recruiter === 'all' ? 'All Recruiters' : recruiter}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
        </div>

        <button
          onClick={handleExport}
          className='flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 w-full md:w-auto mt-4 md:mt-0'
          title='Export to CSV'>
          <Download className='h-5 w-5 mr-2' /> Export
        </button>
      </div>

      {/* Table Container */}
      <div className='overflow-x-auto bg-white shadow-xl rounded-xl'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-[#267edc] text-white'>
            <tr>
              {/* Added S.No Header */}
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>S.No</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>Role</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>Location</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>Skills</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>Recruiter</th>
              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'>Status</th>
              <th className='px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, index) => (
                <tr
                  key={candidate._id}
                  className='hover:bg-gray-100 transition-colors duration-150 ease-in-out'>
                  {/* Added S.No Data Cell */}
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700'>{index + 1}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{candidate.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{candidate.role}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{candidate.location}</td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-wrap gap-2'>
                      {candidate.skills &&
                        candidate.skills.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className='px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full shadow-sm'>
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{candidate.userName || 'N/A'}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusClasses(candidate.status)}`}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                    <div className='flex justify-center space-x-3'>
                      <button
                        onClick={() => handleApprove(candidate._id)}
                        className='p-2 rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110 duration-200'
                        title='Approve'>
                        <CheckCircle className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleReject(candidate._id)}
                        className='p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-110 duration-200'
                        title='Reject'>
                        <XCircle className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Updated colSpan to 8 because of S.No column */}
                <td colSpan='8' className='px-6 py-10 text-center text-gray-500 text-lg'>
                  No candidates found for the current search/filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCandidateApprovals