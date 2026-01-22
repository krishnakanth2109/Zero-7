import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Edit,
  Trash2,
  UserPlus,
  XCircle,
  Loader2,
  Download,
  Upload,
  Shield,
  Search,
  CheckCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import api from '../api/axios'
import './AdminManageRecruiters.css'

export default function AdminManageRecruiters() {
  const [recruiters, setRecruiters] = useState([])
  const [filteredRecruiters, setFilteredRecruiters] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    employeeID: '',
    email: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState({}); 
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [importing, setImporting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef(null)
  const modalRef = useRef(null) 

  // --- Validation Function ---
  const validateForm = useCallback((data, isEditing = false) => {
      const errors = {};
      const namePattern = /^[A-Za-z\s]+$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      
      if (!data.name || data.name.trim() === '') {
        errors.name = 'Full Name is required.';
      } else if (!namePattern.test(data.name.trim())) {
        errors.name = 'Name can only contain alphabets and spaces.';
      }

      if (!data.email || data.email.trim() === '') {
        errors.email = 'Email Address is required.';
      } else if (!emailPattern.test(data.email.trim())) {
        errors.email = 'Enter a valid email address.';
      }
      
      if (!data.employeeID || data.employeeID.trim() === '') {
          errors.employeeID = 'Employee ID is required.';
      }
      
      if (!isEditing && (!data.password || data.password.length < 6)) {
          errors.password = 'Password is required (min 6 characters).';
      }
      
      if (isEditing && data.password && data.password.length > 0 && data.password.length < 6) {
          errors.password = 'Password must be at least 6 characters.';
      }

      return errors;
  }, []);

  const fetchRecruiters = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/recruiters')
      setRecruiters(data)
      setFilteredRecruiters(data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch recruiters:', error)
      setError('Failed to fetch recruiters. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecruiters()
  }, [fetchRecruiters])

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    resetForm() 
    setError('') 
    setSuccess('')
    setValidationErrors({});
    setShowPassword(false);
  }
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && isEditModalOpen) {
        closeEditModal()
      }
    }

    if (isEditModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditModalOpen]) 

  useEffect(() => {
    const filtered = recruiters.filter(
      (recruiter) =>
        recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recruiter.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRecruiters(filtered)
  }, [searchTerm, recruiters])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sorted = [...filteredRecruiters].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setFilteredRecruiters(sorted)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
        if (!/^[A-Za-z\s]*$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }
  
  const handleBlur = (e) => {
    const { name } = e.target;
    const isEditing = !!editingId;
    const errors = validateForm(formData, isEditing);
    setValidationErrors(prev => ({ ...prev, [name]: errors[name] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const isEditing = !!editingId;
    const errors = validateForm(formData, isEditing);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true)

    try {
      if (editingId) {
        const dataToUpdate = { ...formData }
        if (!dataToUpdate.password) delete dataToUpdate.password
        await api.put(`/recruiters/${editingId}`, dataToUpdate)
        setSuccess('Recruiter updated successfully!')
      } else {
        await api.post('/recruiters/register', formData)
        setSuccess('Recruiter added successfully!')
      }
      resetForm()
      await fetchRecruiters()

      setTimeout(() => setSuccess(''), 3000)
      closeEditModal() 
    } catch (error) {
      console.error('Failed to submit recruiter:', error)
      setError(error.response?.data?.error || 'Failed to save recruiter.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (recruiter) => {
    setFormData({
      name: recruiter.name,
      email: recruiter.email,
      employeeID: recruiter.employeeId,
      password: '',
    })
    setEditingId(recruiter._id)
    setValidationErrors({});
    setIsEditModalOpen(true) 
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recruiter? This action cannot be undone.')) {
      setDeletingId(id)
      setError('')
      setSuccess('')
      try {
        await api.delete(`/recruiters/${id}`)
        setSuccess('Recruiter deleted successfully!')
        await fetchRecruiters()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete recruiter.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ name: '', employeeID: '', email: '', password: '' })
  }

  const exportToExcel = () => {
    try {
      if (recruiters.length === 0) {
        setError('No recruiters available to export.')
        setTimeout(() => setError(''), 3000)
        return
      }

      const excelData = recruiters.map((recruiter) => ({
        Name: recruiter.name,
        Email: recruiter.email,
        'Employee ID': recruiter.employeeId,
        Status: 'Active',
        'Created Date': recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'N/A',
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruiters')
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      saveAs(blob, `recruiters-export-${new Date().toISOString().split('T')[0]}.xlsx`)
      
      setSuccess('Recruiters exported to Excel successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setError('Failed to export to Excel. Please try again.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleImportExcel = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please select a valid Excel file (.xlsx or .xls)')
      return
    }
    setImporting(true)
    setError('')
    setSuccess('')
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        if (jsonData.length === 0) throw new Error('The Excel file is empty or has no data.')
        
        const processedData = jsonData.map((row, index) => {
          if (!row['Name'] || !row['Email'] || !row['Employee ID']) {
            throw new Error(`Row ${index + 2}: Missing required fields`)
          }
          return {
            name: row['Name'].toString().trim(),
            email: row['Email'].toString().trim().toLowerCase(),
            employeeID: row['Employee ID'].toString().trim(),
            password: 'Zero7@123',
          }
        })

        let successCount = 0
        let errorCount = 0
        const errors = []

        for (const [index, recruiterData] of processedData.entries()) {
          try {
            await api.post('/recruiters/register', recruiterData)
            successCount++
          } catch (error) {
            errorCount++
            errors.push(`Row ${index + 2}: ${recruiterData.email} - ${error.response?.data?.message || 'Failed'}`)
          }
        }
        await fetchRecruiters()
        if (errorCount === 0) {
          setSuccess(`✅ Successfully imported ${successCount} recruiters!`)
        } else {
          setSuccess(`📊 Import completed: ${successCount} successful, ${errorCount} failed`)
        }
        setTimeout(() => setSuccess(''), 5000)
      } catch (error) {
        setError(`❌ Import failed: ${error.message}`)
      } finally {
        setImporting(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => { setError('❌ Failed to read the file.'); setImporting(false) }
    reader.readAsArrayBuffer(file)
  }

  if (loading) {
    return (
      <div className='loading-overlay'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
      </div>
    )
  }

  return (
    <div className='admin-wrapper'>
      <div className='admin-container'>
        
        {/* Header Section */}
        <div className='dashboard-header'>
          <div className='header-left'>
            <div className='icon-box'>
              <Shield className='w-8 h-8 text-blue-600' />
            </div>
            <div>
              <h1 className='header-title'>Manage Recruiters</h1>
              <p className='header-subtitle'>Control access and manage recruitment staff</p>
            </div>
          </div>
          <div className='header-stat-card'>
            <span className='stat-value'>{recruiters.length}</span>
            <span className='stat-label'>Total Recruiters</span>
          </div>
        </div>

        {/* Global Alerts */}
        {error && !isEditModalOpen && (
          <div className='alert alert-error animate-slide-in'>
            <XCircle className='w-5 h-5' />
            <span>{error}</span>
          </div>
        )}

        {success && !isEditModalOpen && (
          <div className='alert alert-success animate-slide-in'>
            <CheckCircle className='w-5 h-5' />
            <span>{success}</span>
          </div>
        )}

        {/* Create Recruiter Form */}
        {!editingId && (
          <div className='admin-card mb-8'>
            <div className='card-header'>
              <h2 className='card-title'>Add New Recruiter</h2>
            </div>
            
            <form onSubmit={handleSubmit} className='card-body'>
              <div className='form-grid'>
                <div className='form-group'>
                  <label className='form-label'>Full Name</label>
                  <input
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='e.g. John Doe'
                    className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
                  />
                  {validationErrors.name && <span className='error-text'>{validationErrors.name}</span>}
                </div>

                <div className='form-group'>
                  <label className='form-label'>Email Address</label>
                  <input
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='e.g. john@company.com'
                    className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                  />
                  {validationErrors.email && <span className='error-text'>{validationErrors.email}</span>}
                </div>

                <div className='form-group'>
                  <label className='form-label'>Employee ID</label>
                  <input
                    name='employeeID'
                    value={formData.employeeID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='e.g. EMP-001'
                    className={`form-input ${validationErrors.employeeID ? 'input-error' : ''}`}
                  />
                  {validationErrors.employeeID && <span className='error-text'>{validationErrors.employeeID}</span>}
                </div>

                <div className='form-group'>
                  <label className='form-label'>Password</label>
                  <div className='password-input-wrapper'>
                    <input
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Minimum 6 characters'
                      className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className='password-toggle'
                    >
                      {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                    </button>
                  </div>
                  {validationErrors.password && <span className='error-text'>{validationErrors.password}</span>}
                </div>
              </div>

              <div className='form-actions'>
                <button
                  type='submit'
                  disabled={submitting}
                  className='btn btn-primary'
                >
                  {submitting ? <Loader2 className='w-4 h-4 animate-spin' /> : <UserPlus className='w-4 h-4' />}
                  <span>Add Recruiter</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className='admin-card'>
          <div className='table-toolbar'>
            <h2 className='card-title'>Recruiter Directory</h2>
            
            <div className='toolbar-actions'>
              <div className='search-wrapper'>
                <Search className='search-icon' />
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='search-input'
                />
              </div>

              <div className='action-group'>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleImportExcel}
                  accept='.xlsx, .xls'
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                  className='btn btn-secondary'
                >
                  {importing ? <Loader2 className='w-4 h-4 animate-spin' /> : <Upload className='w-4 h-4' />}
                  <span>Import</span>
                </button>

                <button
                  type="button"
                  onClick={exportToExcel}
                  className='btn btn-outline-success'
                  title='Export to Excel'
                >
                  <Download className='w-4 h-4' />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className='table-responsive'>
            <table className='modern-table'>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className='sortable'>
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} className='sortable'>
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('employeeId')} className='sortable'>
                    ID {sortConfig.key === 'employeeId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className='text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecruiters.length === 0 ? (
                  <tr>
                    <td colSpan='4' className='empty-state'>
                      <div className='empty-content'>
                        <UserPlus className='w-12 h-12 text-gray-300' />
                        <p>No recruiters found</p>
                        {searchTerm && (
                          <button onClick={() => setSearchTerm('')} className='btn-link'>Clear search</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecruiters.map((recruiter) => (
                    <tr key={recruiter._id}>
                      <td className='font-medium text-dark'>{recruiter.name}</td>
                      <td className='text-muted'>{recruiter.email}</td>
                      <td><span className='badge badge-blue'>{recruiter.employeeId}</span></td>
                      <td className='text-right'>
                        <div className='row-actions'>
                          <button
                            onClick={() => handleEdit(recruiter)}
                            className='icon-btn edit'
                            title='Edit'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(recruiter._id)}
                            disabled={deletingId === recruiter._id}
                            className='icon-btn delete'
                            title='Delete'
                          >
                            {deletingId === recruiter._id ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash2 className='w-4 h-4' />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className='table-footer'>
            Showing <strong>{filteredRecruiters.length}</strong> of <strong>{recruiters.length}</strong> recruiters
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className='modal-overlay' onClick={closeEditModal}>
          <div ref={modalRef} className='modal-content animate-pop-in' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2 className='modal-title'>{editingId ? 'Edit Recruiter' : 'Add Recruiter'}</h2>
              <button 
                type="button"
                onClick={closeEditModal} 
                className='close-btn'
                aria-label='Close modal'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            <div className='modal-body'>
              {error && <div className='alert alert-error'><XCircle className='w-4 h-4' />{error}</div>}
              {success && <div className='alert alert-success'><CheckCircle className='w-4 h-4' />{success}</div>}

              <form onSubmit={handleSubmit} id="edit-recruiter-form">
                <div className='form-group' style={{ marginBottom: '1rem' }}>
                  <label className='form-label'>Full Name</label>
                  <input
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
                  />
                  {validationErrors.name && <span className='error-text'>{validationErrors.name}</span>}
                </div>

                <div className='form-group' style={{ marginBottom: '1rem' }}>
                  <label className='form-label'>Email</label>
                  <input
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                  />
                  {validationErrors.email && <span className='error-text'>{validationErrors.email}</span>}
                </div>

                <div className='form-group' style={{ marginBottom: '1rem' }}>
                  <label className='form-label'>Employee ID</label>
                  <input
                    name='employeeID'
                    value={formData.employeeID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${validationErrors.employeeID ? 'input-error' : ''}`}
                  />
                  {validationErrors.employeeID && <span className='error-text'>{validationErrors.employeeID}</span>}
                </div>

                <div className='form-group' style={{ marginBottom: '1.5rem' }}>
                  <label className='form-label'>{editingId ? 'New Password (Optional)' : 'Password'}</label>
                  <div className='password-input-wrapper'>
                    <input
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={editingId ? 'Leave blank to keep current' : 'Min 6 characters'}
                      className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className='password-toggle'
                    >
                      {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                    </button>
                  </div>
                  {validationErrors.password && <span className='error-text'>{validationErrors.password}</span>}
                </div>

                <div className='modal-footer'>
                  <button type='button' onClick={closeEditModal} className='btn btn-secondary'>Cancel</button>
                  <button type='submit' disabled={submitting} className='btn btn-primary'>
                    {submitting ? <Loader2 className='w-4 h-4 animate-spin' /> : (editingId ? 'Save Changes' : 'Create')}
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