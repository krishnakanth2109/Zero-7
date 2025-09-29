import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Download, Upload, PlusCircle, X } from 'lucide-react'
import api from '../api/axios'
import './AdminManageCandidates.css'

export default function AdminManageCandidates() {
  const [candidates, setCandidates] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    skills: '', // <-- Field is present
    exp: '',
    location: '',
    email: '',
    phone: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' })

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/candidates')
      setCandidates(data)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
      showAlert('error', 'Failed to load candidates.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const showAlert = (type, message) => {
    setAlertMessage({ type, message })
    setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFormData({
      name: '',
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
    setFormData(candidate)
    setEditingId(candidate._id)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      showAlert('error', 'Failed to save candidate. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${id}`)
        fetchCandidates()
        showAlert('success', 'Candidate deleted successfully!')
      } catch (error) {
        console.error('Failed to delete candidate:', error)
        showAlert('error', 'Failed to delete candidate.')
      }
    }
  }

  // Export and Import functions remain...
  const exportToCSV = () => {
    // Implementation here...
  }

  const handleImport = (e) => {
    // Implementation here...
  }

  if (loading) {
    return <div className='loading-spinner'></div>
  }

  return (
    <div className='admin-dashboard'>
      {alertMessage.message && (
        <div className={`app-alert ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}
      <header className='dashboard-header'>
        <h1 className='dashboard-title'>
          Manage Your Bench Candidates Efficiently
        </h1>
      </header>
      <main className='dashboard-content'>
        <section className='candidates-overview card'>
          <div className='section-header'>
            <h2>All Candidates</h2>
            <div className='actions-group'>
              <button className='btn btn-primary' onClick={handleOpenAddModal}>
                <PlusCircle size={18} /> Add New Candidate
              </button>
              {/* Other buttons like import/export */}
            </div>
          </div>
          <div className='table-responsive'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan='7' className='no-data-message'>
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  candidates.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.role}</td>
                      <td>{c.skills || 'N/A'}</td>
                      <td>{c.exp} years</td>
                      <td>{c.location}</td>
                      <td className='actions-cell'>
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className='btn btn-icon btn-edit'
                          title='Edit'>
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className='btn btn-icon btn-delete'
                          title='Delete'>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-content card'>
            <div className='modal-header'>
              <h2>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>
              <button onClick={handleCloseModal} className='modal-close-btn'>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className='candidate-form-modal'>
              <div className='form-group'>
                <label>Name</label>
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Role</label>
                <input
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Skills</label>
                <input
                  name='skills'
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder='e.g., React, Node.js'
                  required
                />
              </div>
              <div className='form-group'>
                <label>Experience (Years)</label>
                <input
                  name='exp'
                  type='number'
                  value={formData.exp}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Location</label>
                <input
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Email</label>
                <input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Phone</label>
                <input
                  name='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-actions-modal'>
                <button
                  type='submit'
                  className='btn btn-primary submit-modal-btn'>
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
