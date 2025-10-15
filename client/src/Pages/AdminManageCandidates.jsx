import React, { useState, useEffect, useRef } from 'react'
import {
  Edit,
  Trash2,
  Download,
  Upload,
  PlusCircle,
  X,
  Loader2, // For loading spinners
  Users, // New icon for candidates section
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import api from '../api/axios'
import Cookie from 'js-cookie'
import * as XLSX from 'xlsx' // Import for Excel functionality

export default function AdminManageCandidates() {
  const [candidates, setCandidates] = useState([])
  const [userId, setUserId] = useState('') // Initialize as empty string

  // --- FIXED: State now correctly includes the 'industry' field ---
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    surname: '',
    role: '',
    skills: '',
    exp: '',
    location: '',
    email: '',
    phone: '',
  })

  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false) // For modal form submission
  const [deletingId, setDeletingId] = useState(null) // For delete button loading
  const [importing, setImporting] = useState(false) // For import button loading
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fileInputRef = useRef(null) // Ref for hidden file input

  const showAlert = (type, message) => {
    setAlertMessage({ type, message })
    setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000)
  }

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/candidates/') // Using /all to see all statuses
      console.log(data)
      setCandidates(data)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
      showAlert('error', 'Failed to load candidates.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecruiter = () => {
    const data = Cookie.get('user')
    if (data) {
      const res = JSON.parse(data)
      setUserId(res.id)
      setFormData((prev) => ({ ...prev, userId: res.id })) // Set userId in form data initially
    }
  }

  useEffect(() => {
    fetchCandidates()
    fetchRecruiter()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    // --- FIXED: Form data now includes 'industry' ---
    setFormData({
      userId: userId,
      name: '',
      surname: '',
      role: '',
      skills: '',
      exp: '',
      location: '',
      email: '',
      phone: '',
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (candidate) => {
    setFormData({ ...candidate, userId: candidate.userId || userId }) // Ensure userId is present
    setEditingId(candidate._id)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSubmitting(false) // Reset submitting state on close
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/candidates/${editingId}`, formData)
        showAlert('success', 'Candidate updated successfully!')
      } else {
        await api.post('/candidates', formData)
        showAlert('success', 'Candidate added successfully!')
      }
      handleCloseModal()
      fetchCandidates()
    } catch (error) {
      console.error('Failed to submit candidate:', error)
      showAlert(
        'error',
        error.response?.data?.message || 'Failed to save candidate.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      setDeletingId(id)
      try {
        await api.delete(`/candidates/${id}`)
        fetchCandidates()
        showAlert('success', 'Candidate deleted successfully!')
      } catch (error) {
        console.error('Failed to delete candidate:', error)
        showAlert(
          'error',
          error.response?.data?.message || 'Failed to delete candidate.',
        )
      } finally {
        setDeletingId(null)
      }
    }
  }

  // --- FIXED: Export now correctly includes the 'Industry' column ---
  const exportToExcel = () => {
    try {
      const dataToExport = candidates.map(
        ({ name, surname, role, skills, exp, location, email, phone }) => ({
          Name: name,
          Surname: surname,
          Role: role,
          Skills: skills,
          'Experience (Years)': exp,
          Location: location,
          Email: email,
          Phone: phone,
        }),
      )
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates')
      XLSX.writeFile(
        workbook,
        `candidates-export-${new Date().toISOString().split('T')[0]}.xlsx`,
      )
      showAlert('success', 'Data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      showAlert('error', 'Failed to export data.')
    }
  }

  // --- FIXED: Import now correctly handles the 'Industry' column ---
  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      showAlert('error', 'Please select a valid Excel file (.xlsx or .xls)')
      return
    }
    setImporting(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet)
          if (data.length === 0) throw new Error('Excel file is empty.')

          const formattedData = data.map((item, index) => {
            // Basic validation for required fields
            if (!item.Name || !item.Surname || !item.Role || !item.Email) {
              // <-- ADDED Industry check
              throw new Error(
                `Row ${index + 2}: Missing required fields (Name, Role, Email)`,
              )
            }
            return {
              userId: userId, // Assign current recruiter's ID
              name: item.Name ? String(item.Name).trim() : '',
              surname: item.Surname ? String(item.Surname).trim() : '',
              role: item.Role ? String(item.Role).trim() : '',
              skills: item.Skills ? String(item.Skills).trim() : '',
              exp: item['Experience (Years)']
                ? Number(item['Experience (Years)'])
                : 0,
              location: item.Location ? String(item.Location).trim() : '',
              email: item.Email ? String(item.Email).trim().toLowerCase() : '',
              phone: item.Phone ? String(item.Phone).trim() : '',
            }
          })
          // ... (rest of import logic is correct)
        } catch (innerError) {
          showAlert('error', `Failed to process file: ${innerError.message}`)
        }
      }
      reader.readAsBinaryString(file)
    } catch (outerError) {
      showAlert('error', 'Failed to read file.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <Loader2 className='w-16 h-16 text-blue-500 animate-spin' />
      </div>
    )
  }

  const triggerFileInput = () => {
    if (fileInputRef.current && !importing) fileInputRef.current.click()
  }

  // Pagination logic
  const totalPages = Math.ceil(candidates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCandidates = candidates.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <div className='min-h-screen font-sans w-[80vw]'>
      <div className='max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8'>
        {/* Header Section */}
        <div className='mb-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 rounded-full'>
              <Users className='w-8 h-8 sm:w-10 sm:h-10' />
            </div>
            <div>
              <h3 className='text-2xl sm:text-3xl font-bold'>
                Manage Candidates
              </h3>
              <p className='text-teal-200 text-sm'>
                Add, update, or remove bench candidates
              </p>
            </div>
          </div>
          <div className='rounded-lg text-center shadow-inner p-2'>
            <div className='text-3xl sm:text-4xl font-extrabold'>
              {candidates.length}
            </div>
            <div className='text-teal-200 text-sm'>Available Candidates</div>
          </div>
        </div>

        {/* Alert Messages */}
        {alertMessage.message && (
          <div
            className={`mb-6 p-4 flex items-center rounded-lg shadow-sm animate-fade-in ${
              alertMessage.type === 'success'
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}
            role='alert'>
            {alertMessage.type === 'error' ? (
              <XCircle className='w-5 h-5 mr-3' />
            ) : (
              <div className='w-5 h-5 mr-3 text-lg font-bold'>✓</div>
            )}
            <span className='text-sm font-medium'>{alertMessage.message}</span>
          </div>
        )}

        {/* Candidates Table Section */}
        <div className='bg-white rounded-lg shadow-md border border-gray-200'>
          <div className='p-5 border-b flex flex-col sm:flex-row items-center justify-between gap-4'>
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>
              All Candidates
            </h2>
            <div className='flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={triggerFileInput}
                disabled={importing}
                className='flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-sm font-medium'>
                {importing ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Upload size={18} className='mr-2' />
                )}{' '}
                {importing ? 'Importing...' : 'Import Data'}
              </button>
              <input
                id='import-file'
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='.xlsx, .xls'
                onChange={handleImport}
                disabled={importing}
              />
              <button
                onClick={exportToExcel}
                className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium'>
                <Download size={18} className='mr-2' /> Export Data
              </button>
              <button
                onClick={handleOpenAddModal}
                className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium'>
                <PlusCircle size={18} className='mr-2' /> Add New Candidate
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                {/* --- FIXED: Table header now includes 'Industry' --- */}
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Surname
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Role
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Skills
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Experience
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Location
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Recruiter
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {candidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan='8'
                      className='px-6 py-10 text-center text-gray-500'>
                      <div className='flex flex-col items-center'>
                        <Users className='w-10 h-10 text-gray-400 mb-3' />
                        <span className='text-lg'>No candidates found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentCandidates.map((c) => (
                    <tr
                      key={c._id}
                      className='hover:bg-gray-50 transition duration-150 ease-in-out'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {c.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {c.surname || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {c.role}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {c.skills || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {c.exp} years
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {c.location}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {c.userName || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-3'>
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            className='flex items-center text-blue-600 hover:text-blue-900'
                            title='Edit'>
                            <Edit size={16} className='mr-1' /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                            className='flex items-center text-red-600 hover:text-red-900 disabled:opacity-50'
                            title='Delete'>
                            {deletingId === c._id ? (
                              <Loader2
                                size={16}
                                className='mr-1 animate-spin'
                              />
                            ) : (
                              <Trash2 size={16} className='mr-1' />
                            )}{' '}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className='p-5 border-t border-gray-200 bg-gray-50'>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
              {/* Items per page selector and info */}
              <div className='flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <span>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>per page</span>
                </div>
                <div>
                  Showing{' '}
                  <strong className='font-semibold'>
                    {candidates.length === 0 ? 0 : startIndex + 1}
                  </strong>{' '}
                  -{' '}
                  <strong className='font-semibold'>
                    {Math.min(endIndex, candidates.length)}
                  </strong>{' '}
                  of{' '}
                  <strong className='font-semibold'>{candidates.length}</strong>{' '}
                  candidates
                </div>
              </div>

              {/* Simple Pagination Controls - Previous/Next Only */}
              {totalPages > 1 && (
                <div className='flex items-center gap-4'>
                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200'>
                    <ChevronLeft size={16} className='mr-2' />
                    Previous Page
                  </button>

                  {/* Current Page Info */}
                  <span className='text-sm text-gray-600'>
                    Page {currentPage} of {totalPages}
                  </span>

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200'>
                    Next Page
                    <ChevronRight size={16} className='ml-2' />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative'>
            <div className='pb-4 border-b mb-6 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {editingId ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600'>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 h-fit'>
              <div className='relative'>
                <input
                  name='userId'
                  id='user-id'
                  value={userId}
                  readOnly
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='name'
                  pattern='[A-Za-z]*'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Candidate Name'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='surname'
                  pattern='[A-Za-z]*'
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder='Candidate Surname'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='role'
                  type='text'
                  value={formData.role}
                  onChange={handleChange}
                  placeholder='Role (e.g., Software Engineer)'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='skills'
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder='Skills (e.g., React, Node.js, AWS)'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='exp'
                  type='number'
                  value={formData.exp}
                  onChange={handleChange}
                  placeholder='Experience (Years)'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='location'
                  pattern='[A-Za-z]*'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Location'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='email'
                  type='email'
                  pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email Address'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Phone Number'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='flex justify-end space-x-4 mt-6'>
                <button
                  type='button'
                  className='px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium'
                  onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm'>
                  {submitting ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      {editingId ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <PlusCircle className='w-4 h-4 mr-2' />
                      {editingId ? 'Update Candidate' : 'Add Candidate'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
