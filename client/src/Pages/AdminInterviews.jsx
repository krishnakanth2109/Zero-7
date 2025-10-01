import React, { useState } from 'react'

const InterviewTracker = () => {
  const [interviewData, setInterviewData] = useState([
    {
      id: 1,
      candidateName: 'Alice Johnson',
      companyName: 'Tech Innovators Inc.',
      status: 'Scheduled',
      date: '2024-10-26',
    },
    {
      id: 2,
      candidateName: 'Bob Williams',
      companyName: 'Global Solutions',
      status: 'Completed',
      date: '2024-10-20',
    },
    {
      id: 3,
      candidateName: 'Charlie Brown',
      companyName: 'Data Analytics Corp.',
      status: 'Pending Feedback',
      date: '2024-10-18',
    },
    {
      id: 4,
      candidateName: 'Diana Prince',
      companyName: 'Future Ventures',
      status: 'Rejected',
      date: '2024-10-15',
    },
    {
      id: 5,
      candidateName: 'Eve Adams',
      companyName: 'Innovate Minds',
      status: 'Offer Extended',
      date: '2024-10-22',
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentEditInterview, setCurrentEditInterview] = useState(null) // Stores the interview being edited

  // State for the "Add New Interview" form
  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    companyName: '',
    status: 'Scheduled', // Default status
    date: '',
  })

  // State for the "Edit Status" form within the modal
  const [editStatus, setEditStatus] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Pending Feedback':
        return 'bg-yellow-100 text-yellow-800'
      case 'Offer Extended':
        return 'bg-purple-100 text-purple-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setNewInterview((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (
      !newInterview.candidateName ||
      !newInterview.companyName ||
      !newInterview.date
    ) {
      alert('Please fill in all fields.')
      return
    }

    const newId = Math.max(...interviewData.map((item) => item.id), 0) + 1
    setInterviewData((prev) => [...prev, { ...newInterview, id: newId }])
    setNewInterview({
      candidateName: '',
      companyName: '',
      status: 'Scheduled',
      date: '',
    })
    setShowAddForm(false)
  }

  const openEditModal = (interview) => {
    setCurrentEditInterview(interview)
    setEditStatus(interview.status) // Set initial status in modal to current status
    setShowEditModal(true)
  }

  const handleEditStatusChange = (e) => {
    setEditStatus(e.target.value)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!currentEditInterview) return

    setInterviewData((prev) =>
      prev.map((item) =>
        item.id === currentEditInterview.id
          ? { ...item, status: editStatus }
          : item,
      ),
    )
    setShowEditModal(false)
    setCurrentEditInterview(null)
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Candidate Interview Tracker
      </h2>

      {/* Add New Interview Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className='mb-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
        {showAddForm ? 'Hide Add Form' : 'Add New Interview'}
      </button>

      {/* Add New Interview Form */}
      {showAddForm && (
        <div className='mb-8 p-6 bg-white shadow-md rounded-lg'>
          <h3 className='text-xl font-semibold mb-4 text-gray-800'>
            Add New Interview
          </h3>
          <form
            onSubmit={handleAddSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='candidateName'
                className='block text-sm font-medium text-gray-700'>
                Candidate Name
              </label>
              <input
                type='text'
                id='candidateName'
                name='candidateName'
                value={newInterview.candidateName}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='companyName'
                className='block text-sm font-medium text-gray-700'>
                Company Name
              </label>
              <input
                type='text'
                id='companyName'
                name='companyName'
                value={newInterview.companyName}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700'>
                Interview Date
              </label>
              <input
                type='date'
                id='date'
                name='date'
                value={newInterview.date}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='status'
                className='block text-sm font-medium text-gray-700'>
                Initial Status
              </label>
              <select
                id='status'
                name='status'
                value={newInterview.status}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'>
                <option value='Scheduled'>Scheduled</option>
                <option value='Completed'>Completed</option>
                <option value='Pending Feedback'>Pending Feedback</option>
                <option value='Offer Extended'>Offer Extended</option>
                <option value='Rejected'>Rejected</option>
              </select>
            </div>
            <div className='md:col-span-2'>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                Add Interview
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interview Table */}
      <div className='overflow-x-auto bg-white shadow-md rounded-lg'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-blue-600'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Candidate Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Company Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Interview Date
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {interviewData.map((interview) => (
              <tr key={interview.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {interview.candidateName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                  {interview.companyName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      interview.status,
                    )}`}>
                    {interview.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                  {interview.date}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button
                    onClick={() => openEditModal(interview)}
                    className='text-indigo-600 hover:text-indigo-900'>
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Status Modal */}
      {showEditModal && currentEditInterview && (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none bg-gray-900 bg-opacity-50'>
          <div className='relative w-auto my-6 mx-auto max-w-lg'>
            {/* Modal content */}
            <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
              {/* Header */}
              <div className='flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t'>
                <h3 className='text-xl font-semibold'>
                  Edit Status for {currentEditInterview.candidateName}
                </h3>
                <button
                  className='p-1 ml-auto bg-transparent border-0 text-gray-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                  onClick={() => setShowEditModal(false)}>
                  <span className='bg-transparent text-gray-700 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                    ×
                  </span>
                </button>
              </div>
              {/* Body */}
              <div className='relative p-6 flex-auto'>
                <form onSubmit={handleEditSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='editStatus'
                      className='block text-sm font-medium text-gray-700'>
                      New Status
                    </label>
                    <select
                      id='editStatus'
                      name='editStatus'
                      value={editStatus}
                      onChange={handleEditStatusChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'>
                      <option value='Scheduled'>Scheduled</option>
                      <option value='Completed'>Completed</option>
                      <option value='Pending Feedback'>Pending Feedback</option>
                      <option value='Offer Extended'>Offer Extended</option>
                      <option value='Rejected'>Rejected</option>
                    </select>
                  </div>
                  <div className='flex items-center justify-end pt-6 border-t border-solid border-gray-300 rounded-b'>
                    <button
                      className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => setShowEditModal(false)}>
                      Close
                    </button>
                    <button
                      className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='submit'>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewTracker
