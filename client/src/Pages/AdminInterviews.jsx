import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment Object
const localizer = momentLocalizer(moment)

const InterviewTracker = () => {
  const [interviewData, setInterviewData] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [candidateOptions, setCandidateOptions] = useState([])
  const [companyOptions, setCompanyOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentEditInterview, setCurrentEditInterview] = useState(null)

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/interview')
      setInterviewData(response.data)

      // Transform interview data for the calendar
      const events = response.data.map((interview) => ({
        title: `${interview.candidateName} @ ${interview.companyName}`,
        start: new Date(interview.date),
        end: new Date(interview.date),
        allDay: true,
        resource: interview,
      }))
      setCalendarEvents(events)
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOptions = async () => {
    try {
      const response = await api.get('/interview/search')
      setCandidateOptions(response.data.candidates)
      setCompanyOptions(response.data.companies)
    } catch (error) { // <-- Corrected: Added curly braces
      console.error('Error fetching options:', error)
    }
  }

  useEffect(() => {
    fetchInterviews()
    fetchOptions()
  }, [])

  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    companyName: '',
    job: '', // This state holds the Job ID
    status: 'Scheduled',
    date: '',
  })

  const [editStatus, setEditStatus] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'Pending Feedback':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'Offer Extended':
        return 'bg-purple-100 text-purple-800 border border-purple-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500'
      case 'Completed':
        return 'bg-green-500'
      case 'Pending Feedback':
        return 'bg-amber-500'
      case 'Offer Extended':
        return 'bg-purple-500'
      case 'Rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setNewInterview((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (
      !newInterview.candidateName ||
      !newInterview.companyName ||
      !newInterview.job ||
      !newInterview.date
    ) {
      alert('Please fill in all fields.')
      return
    }

    setSubmitting(true)
    const sendInterview = {
      candidateId: newInterview.candidateName,
      jobId: newInterview.job,
      status: newInterview.status,
      companyId: newInterview.companyName,
      date: newInterview.date,
    }

    try {
      await api.post('/interview', sendInterview)
      setShowAddForm(false)
      setNewInterview({
        candidateName: '',
        companyName: '',
        job: '',
        status: 'Scheduled',
        date: '',
      })
      fetchInterviews() // Re-fetch interviews to update the list and calendar
    } catch (error) {
      console.error('Error adding interview:', error)
      alert('Failed to add interview. ' + (error.response?.data?.message || 'Server Error'))
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (interview) => {
    setCurrentEditInterview(interview)
    setEditStatus(interview.status)
    setShowEditModal(true)
  }

  const handleEditStatusChange = (e) => {
    setEditStatus(e.target.value)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentEditInterview) return

    setSubmitting(true)
    try {
      await api.patch(`/interview/${currentEditInterview._id}`, {
        status: editStatus,
      })
      setShowEditModal(false)
      setCurrentEditInterview(null)
      fetchInterviews()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status.')
    } finally {
      setSubmitting(false)
    }
  }

  // Custom calendar event styles
  const eventStyleGetter = (event) => {
    const status = event.resource?.status
    let backgroundColor = '#3174ad'
    
    switch (status) {
      case 'Completed': backgroundColor = '#10b981'; break
      case 'Pending Feedback': backgroundColor = '#f59e0b'; break
      case 'Offer Extended': backgroundColor = '#8b5cf6'; break
      case 'Rejected': backgroundColor = '#ef4444'; break
      default: backgroundColor = '#3b82f6'
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        padding: '2px 8px',
      },
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading interviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Interview Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage candidate interviews, track status, and schedule meetings in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {['Scheduled', 'Completed', 'Pending Feedback', 'Offer Extended'].map((status) => (
            <div key={status} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{status}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {interviewData.filter(item => item.status === status).length}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusDot(status)}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Interview Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Interview Schedule</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="flex items-center">
              {showAddForm ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hide Form
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Interview
                </>
              )}
            </span>
          </button>
        </div>

        {/* Add Interview Form */}
        {showAddForm && (
          <div className="mb-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-800">Schedule New Interview</h3>
            </div>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="candidateName" className="block text-sm font-semibold text-gray-700">
                  Candidate Name
                </label>
                <select
                  id="candidateName"
                  name="candidateName"
                  value={newInterview.candidateName}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Select a Candidate</option>
                  {candidateOptions.map((candidate) => (
                    <option key={candidate._id} value={candidate._id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700">
                  Company Name
                </label>
                <select
                  id="companyName"
                  name="companyName"
                  value={newInterview.companyName}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Select a Company</option>
                  {companyOptions.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="job" className="block text-sm font-semibold text-gray-700">
                  Job ID
                </label>
                <input
                  type="text"
                  id="job"
                  name="job"
                  value={newInterview.job}
                  onChange={handleAddInputChange}
                  placeholder="Enter the Job ID"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
                  Interview Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newInterview.date}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                  required
                />
              </div>
              
              <div className="lg:col-span-2 space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newInterview.status}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending Feedback">Pending Feedback</option>
                  <option value="Offer Extended">Offer Extended</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="lg:col-span-2 flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scheduling...
                    </span>
                  ) : (
                    'Schedule Interview'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Interviews Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviewData.map((interview) => (
                  <tr key={interview._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                          {interview.candidateName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{interview.candidateName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{interview.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{interview.jobRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(interview.status)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(interview.status)}`}></span>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(interview.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(interview)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4"></div>
            <h3 className="text-2xl font-bold text-gray-800">Interview Calendar</h3>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                popup
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {showEditModal && currentEditInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    Update Interview Status
                  </h3>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={() => setShowEditModal(false)}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  for <span className="font-semibold text-indigo-600">{currentEditInterview.candidateName}</span>
                </p>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="mb-6">
                  <label htmlFor="editStatus" className="block text-sm font-semibold text-gray-700 mb-3">
                    Select New Status
                  </label>
                  <select
                    id="editStatus"
                    name="editStatus"
                    value={editStatus}
                    onChange={handleEditStatusChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Feedback">Pending Feedback</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  >
                    {submitting ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewTracker