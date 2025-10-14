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
  Mail,
  Phone,
  Briefcase,
  Lightbulb,
  MapPin,
  Hash, // For ID field
  XCircle,
  Building, // Icon for Industry
} from 'lucide-react'
import api from '../api/axios'
import Cookie from 'js-cookie'
import * as XLSX from 'xlsx' // Import for Excel functionality

export default function AdminManageCandidates() {
  const [candidates, setCandidates] = useState([])
  const [userId, setUserId] = useState('') // Initialize as empty string
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    role: '',
    skills: '',
    industry: '', // <-- ADDED
    exp: '',
    industry: '',
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

  const fileInputRef = useRef(null) // Ref for hidden file input

  const showAlert = (type, message) => {
    setAlertMessage({ type, message })
    setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000)
  }

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/candidates/all') // Using /all to see all statuses
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
    setFormData({
      userId: userId, // Ensure userId is passed to new candidate form
      name: '',
      role: '',
      skills: '',
      industry: 'Information Technology', // <-- ADDED with default
      exp: '',
      industry: '',
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
        showAlert('success', 'Candidate added, Awaiting in Approval!')
      }
      handleCloseModal()
      fetchCandidates()
    } catch (error) {
      console.error('Failed to submit candidate:', error)
      showAlert(
        'error',
        error.response?.data?.message ||
          'Failed to save candidate. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this candidate? This action cannot be undone.',
      )
    ) {
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

  // Export to Excel function
  const exportToExcel = () => {
    try {
      const dataToExport = candidates.map(
        ({ name, role, skills, exp, location, industry, email, phone }) => ({
          Name: name,
          Role: role,
          Skills: skills,
          Industry: industry, // <-- ADDED
          'Experience (Years)': exp,
          Location: location,
          Industry: industry,
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

  // Import from Excel function
  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
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

          if (data.length === 0) {
            throw new Error('The Excel file is empty or has no data.')
          }

          const formattedData = data.map((item, index) => {
            // Basic validation for required fields
            if (!item.Name || !item.Role || !item.Email || !item.Industry) {
              // <-- ADDED Industry check
              throw new Error(
                `Row ${
                  index + 2
                }: Missing required fields (Name, Role, Email, Industry)`,
              )
            }
            return {
              userId: userId, // Assign current recruiter's ID
              name: item.Name ? String(item.Name).trim() : '',
              role: item.Role ? String(item.Role).trim() : '',
              skills: item.Skills ? String(item.Skills).trim() : '',
              industry: item.Industry ? String(item.Industry).trim() : '', // <-- ADDED
              exp: item['Experience (Years)']
                ? Number(item['Experience (Years)'])
                : 0,
              location: item.Location ? String(item.Location).trim() : '',
              industry: item.Industry ? String(item.Industry).trim() : '',
              email: item.Email ? String(item.Email).trim().toLowerCase() : '',
              phone: item.Phone ? String(item.Phone).trim() : '',
            }
          })

          let successCount = 0
          let errorCount = 0
          const errors = []

          for (const [index, candidateData] of formattedData.entries()) {
            try {
              await api.post('/candidates', candidateData)
              successCount++
            } catch (error) {
              errorCount++
              errors.push(
                `Row ${index + 2}: ${candidateData.email} - ${
                  error.response?.data?.message || 'Failed to create'
                }`,
              )
            }
          }

          showAlert(
            'success',
            `📊 Import completed: ${successCount} successful, ${errorCount} failed`,
          )
          if (errors.length > 0) {
            console.error('Import errors:', errors)
          }
          fetchCandidates()
        } catch (innerError) {
          console.error('Import processing failed:', innerError)
          showAlert('error', `Failed to process file: ${innerError.message}`)
        }
      }
      reader.readAsBinaryString(file)
    } catch (outerError) {
      console.error('File read error:', outerError)
      showAlert('error', 'Failed to read the file. Please try again.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Clear file input
      }
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
    if (fileInputRef.current && !importing) {
      // Prevent clicking while already importing
      fileInputRef.current.click()
    }
  }

  return (
    <div className='min-h-screen font-sans'>
      <div className='max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8'>
        {/* Header Section */}
        <div className='mb-8 p-4 bg-[#267edc] text-white rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3  rounded-full'>
              <Users className='w-8 h-8 sm:w-10 sm:h-10' />{' '}
              {/* Changed icon to Users */}
            </div>
            <div>
              <h3 className='text-2xl sm:text-3xl font-bold'>
                Manage Bench List
              </h3>
              <p className='text-teal-200 text-sm sm:text-base'>
                Add, update, or remove bench candidates
              </p>
            </div>
          </div>
          <div className='rounded-lg text-center shadow-inner'>
            <div className='text-3xl sm:text-4xl font-extrabold'>
              {candidates.length}
            </div>
            <div className='text-teal-200 text-sm'>Available Candidates</div>{' '}
            {/* Changed text */}
          </div>
        </div>

        {/* Alert Messages */}
        {alertMessage.message && (
          <div
            className={`mb-6 p-4 flex items-center rounded-lg shadow-sm animate-fade-in 
            ${
              alertMessage.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
            role='alert'>
            {alertMessage.type === 'error' ? (
              <XCircle className='w-5 h-5 mr-3 flex-shrink-0' />
            ) : (
              <div className='w-5 h-5 mr-3 flex-shrink-0 text-lg font-bold'>
                ✓
              </div>
            )}
            <span className='text-sm font-medium'>{alertMessage.message}</span>
          </div>
        )}

        {/* Candidates Table Section */}
        <div className='bg-white rounded-lg shadow-md border border-gray-200'>
          <div className='p-5 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>
              All Candidates
            </h2>
            <div className='flex flex-wrap items-center gap-3'>
              {/* Import Data */}
              <button
                type='button' // Important for buttons not in a form to prevent default submit behavior
                onClick={triggerFileInput}
                disabled={importing}
                className='flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'>
                {importing ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' /> // Assuming Loader2 is your spinner icon
                ) : (
                  <Upload size={18} className='mr-2' /> // Assuming Upload is your upload icon
                )}
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

              {/* Export Data */}
              <button
                className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-sm font-medium'
                onClick={exportToExcel}>
                <Download size={18} className='mr-2' /> Export Data
              </button>

              {/* Add New Candidate */}
              <button
                className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 text-sm font-medium'
                onClick={handleOpenAddModal}>
                <PlusCircle size={18} className='mr-2' /> Add New Candidate
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
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
                    Industry
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
                      <div className='flex flex-col items-center justify-center'>
                        <Users className='w-10 h-10 text-gray-400 mb-3' />
                        <span className='text-lg font-medium'>
                          No candidates found. Add one using the form above.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidates.map((c) => (
                    <tr
                      key={c._id}
                      className='hover:bg-gray-50 transition duration-150 ease-in-out'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {c.name}
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
                        {c.industry}
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
                            className='flex items-center text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out hover:scale-105'
                            title='Edit Candidate'>
                            <Edit size={16} className='mr-1' /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                            className='flex items-center text-red-600 hover:text-red-900 transition duration-150 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Delete Candidate'>
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

          {/* Table Footer */}
          <div className='p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600'>
            <div className='mb-2 sm:mb-0'>
              Showing{' '}
              <strong className='font-semibold'>{candidates.length}</strong> of{' '}
              <strong className='font-semibold'>{candidates.length}</strong>{' '}
              candidates
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative overflow-scroll h-[90vh]'>
            <div className='pb-4 border-b border-gray-200 mb-6 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                {editingId ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600 transition'>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 h-fit'>
              <div className='relative'>
                <Hash
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
                <input
                  name='userId'
                  id='user-id'
                  value={userId}
                  readOnly
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-700'
                />
              </div>
              <div className='relative'>
                <Users
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Candidate Name'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <Briefcase
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
                <input
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  placeholder='Role (e.g., Software Engineer)'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              {/* --- NEW FIELD ADDED --- */}
              <div className='relative'>
                <Building
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
                <input
                  name='industry'
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder='Industry (e.g., IT, Finance, Healthcare)'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              {/* --- END OF NEW FIELD --- */}
              <div className='relative'>
                <Lightbulb
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
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
                <Briefcase
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
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
                <MapPin
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
                <input
                  name='industry'
                  type='text'
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder='Industry'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Location'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <Mail
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
                <input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email Address'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <Phone
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  size={18}
                />
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
                  className='flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 text-sm font-medium'
                  onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
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
