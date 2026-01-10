import React, { useState, useEffect, useRef } from 'react'
import {
  Edit,
  Trash2,
  UserPlus,
  XCircle,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  X,
} from 'lucide-react' 
import api from '../api/axios' 

// --- FIXED: InputField moved OUTSIDE the main component ---
const InputField = ({ name, type = 'text', placeholder, value, onChange, error, isPassword = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='w-full'>
      <div className="relative group">
        <input
          name={name}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full 
            pl-4 pr-4 ${isPassword ? 'pr-12' : ''} 
            py-3 
            bg-white border 
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'} 
            rounded-xl 
            text-gray-700 placeholder-gray-400 
            text-sm font-medium
            focus:outline-none focus:ring-4 
            transition-all duration-200
            shadow-sm
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer z-10"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 ml-1 text-xs font-medium text-red-500 animate-fadeIn">{error}</p>}
    </div>
  );
};

export default function AdminManageManagers() {
  const [managers, setManagers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    employeeID: '',
    email: '',
    password: '',
  })
  
  const [validationErrors, setValidationErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const modalRef = useRef(null)

  const fetchManagers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/managers')
      setManagers(data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch managers:', error)
      setError('Failed to fetch managers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isEditModalOpen
      ) {
        if (!event.target.closest('#edit-manager-form')) {
          closeEditModal()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditModalOpen])

  // --- VALIDATION ---
  const validateForm = () => {
    const errors = {}
    const { name, email, password, employeeID } = formData

    if (!name.trim()) errors.name = 'Name is required'
    else if (!/^[a-zA-Z\s]+$/.test(name)) errors.name = 'Letters and spaces only'

    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address'

    if (!employeeID.trim()) errors.employeeID = 'Employee ID is required'

    if (!editingId && !password) errors.password = 'Password is required'
    else if (password && password.length < 6) errors.password = 'Min 6 characters'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'name' && /[^a-zA-Z\s]/.test(value)) return

    setFormData({ ...formData, [name]: value })
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validateForm()) return

    setSubmitting(true)
    try {
      if (editingId) {
        const dataToUpdate = { ...formData }
        if (!dataToUpdate.password) delete dataToUpdate.password
        await api.put(`/managers/${editingId}`, dataToUpdate)
        setSuccess('Manager updated successfully!')
      } else {
        await api.post('/managers/register', formData)
        setSuccess('Manager added successfully!')
      }
      resetForm()
      fetchManagers()
      setTimeout(() => setSuccess(''), 3000)
      closeEditModal()
    } catch (error) {
      console.error('Failed to submit manager:', error)
      setError(error.response?.data?.error || 'Failed to save manager.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (manager) => {
    setFormData({
      name: manager.name,
      email: manager.email,
      employeeID: manager.employeeId,
      password: '',
    })
    setValidationErrors({})
    setEditingId(manager._id)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    resetForm()
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this manager?')) {
      setDeletingId(id)
      try {
        await api.delete(`/managers/${id}`)
        setSuccess('Manager deleted successfully!')
        fetchManagers()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ name: '', employeeID: '', email: '', password: '' })
    setValidationErrors({})
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans'>
      <div className='max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8'>
        {/* Header */}
        <div className='mb-8 p-4 bg-[#267edc] text-white rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-blue-500 rounded-full'>
              <Shield className='w-8 h-8 sm:w-10 sm:h-10' />
            </div>
            <div>
              <h3 className='text-2xl sm:text-3xl font-bold'>Manage Managers</h3>
              <p className='text-blue-200 text-sm'>Add, update, or remove manager accounts</p>
            </div>
          </div>
          <div className='bg-blue-700/50 backdrop-blur-sm px-5 py-2 rounded-lg text-center shadow-inner'>
            <div className='text-3xl font-extrabold'>{managers.length}</div>
            <div className='text-blue-200 text-xs uppercase tracking-wider'>Managers</div>
          </div>
        </div>

        {/* Global Alerts */}
        {error && !isEditModalOpen && (
          <div className='mb-6 p-4 flex items-center bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm'>
            <XCircle className='w-5 h-5 mr-3 flex-shrink-0' />
            <span className='text-sm font-medium'>{error}</span>
          </div>
        )}
        {success && !isEditModalOpen && (
          <div className='mb-6 p-4 flex items-center bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-sm'>
            <div className='w-5 h-5 mr-3 flex-shrink-0 font-bold'>✓</div>
            <span className='text-sm font-medium'>{success}</span>
          </div>
        )}

        {/* Add Manager Form */}
        {!editingId && (
          <form onSubmit={handleSubmit} className='mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner'>
            <div className='mb-6 pb-2 border-b border-gray-200'>
              <h2 className='text-xl font-bold text-gray-800 uppercase tracking-wide'>Add New Manager</h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <InputField 
                name="name" 
                placeholder="Full Name (Letters only)" 
                value={formData.name} 
                onChange={handleChange} 
                error={validationErrors.name} 
              />
              <InputField 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                error={validationErrors.email} 
              />
              <InputField 
                name="employeeID" 
                placeholder="Employee ID" 
                value={formData.employeeID} 
                onChange={handleChange} 
                error={validationErrors.employeeID} 
              />
              <InputField 
                name="password" 
                placeholder="Password (Min 6 chars)" 
                value={formData.password} 
                onChange={handleChange} 
                error={validationErrors.password}
                isPassword={true} 
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={submitting}
                className='flex items-center px-8 py-3 rounded-lg bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed'>
                {submitting ? (
                  <><Loader2 className='w-5 h-5 mr-2 animate-spin' />Processing...</>
                ) : (
                  <><UserPlus className='w-5 h-5 mr-2' />Add Manager</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Name</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Email</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>ID</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {loading ? (
                  <tr><td colSpan='4' className='px-6 py-12 text-center text-gray-500'><Loader2 className='w-8 h-8 mx-auto animate-spin mb-2'/>Loading...</td></tr>
                ) : managers.length === 0 ? (
                  <tr><td colSpan='4' className='px-6 py-12 text-center text-gray-500'>No managers found.</td></tr>
                ) : (
                  managers.map((m) => (
                    <tr key={m._id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{m.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{m.email}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'><span className='px-2 py-1 rounded bg-gray-100 text-gray-700 font-mono text-xs'>{m.employeeId}</span></td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-4'>
                          <button onClick={() => handleEdit(m)} className='text-blue-600 hover:text-blue-900 flex items-center'><Edit className='w-4 h-4 mr-1'/>Edit</button>
                          <button onClick={() => handleDelete(m._id)} disabled={deletingId === m._id} className='text-red-600 hover:text-red-900 flex items-center'>
                            {deletingId === m._id ? <Loader2 className='w-4 h-4 mr-1 animate-spin'/> : <Trash2 className='w-4 h-4 mr-1'/>}Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
          <div ref={modalRef} className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform scale-100' id='edit-manager-form'>
            <button onClick={closeEditModal} className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors'><X className='w-5 h-5 text-gray-500'/></button>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Edit Manager</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={validationErrors.name} />
              <InputField name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} error={validationErrors.email} />
              <InputField name="employeeID" placeholder="ID" value={formData.employeeID} onChange={handleChange} error={validationErrors.employeeID} />
              <InputField name="password" placeholder="New Password (Optional)" value={formData.password} onChange={handleChange} error={validationErrors.password} isPassword={true} />
              
              <div className='flex justify-end space-x-3 pt-4'>
                <button type='button' onClick={closeEditModal} className='px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium'>Cancel</button>
                <button type='submit' disabled={submitting} className='px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70'>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}