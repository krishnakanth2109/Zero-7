// File: src/Pages/AdminViewRequests.jsx

import React, { useState, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
} from 'lucide-react'
import api from '../api/axios'
import './AdminViewRequests.css'

export default function AdminViewRequests() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/request-info')
      setRequests(data)
    } catch (err) {
      setError('Failed to fetch requests. Please try again.')
      console.error('Fetch requests error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleApprove = async (requestId) => {
    setActionLoading(requestId)
    try {
      await api.put(`/request-info/${requestId}`, { status: 'approved' })
      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: 'approved' } : req,
        ),
      )
      showMessage('Request approved successfully!', 'success')
    } catch (err) {
      console.error('Approve request error:', err)
      showMessage('Failed to approve request. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId) => {
    setActionLoading(requestId)
    try {
      await api.put(`/request-info/${requestId}`, { status: 'rejected' })
      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: 'rejected' } : req,
        ),
      )
      showMessage('Request rejected successfully!', 'success')
    } catch (err) {
      console.error('Reject request error:', err)
      showMessage('Failed to reject request. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (requestId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this request? This action cannot be undone.',
      )
    ) {
      return
    }

    setActionLoading(`delete-${requestId}`)
    try {
      await api.delete(`/request-info/${requestId}`)
      setRequests(requests.filter((req) => req._id !== requestId))
      showMessage('Request deleted successfully!', 'success')
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(null)
      }
    } catch (err) {
      console.error('Delete request error:', err)
      showMessage('Failed to delete request. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { class: 'status-approved', text: 'Approved' }
      case 'rejected':
        return { class: 'status-rejected', text: 'Rejected' }
      default:
        return { class: 'status-pending', text: 'Pending' }
    }
  }

  const getStatusCounts = () => {
    const pending = requests.filter(
      (req) => !req.status || req.status === 'pending',
    ).length
    const approved = requests.filter((req) => req.status === 'approved').length
    const rejected = requests.filter((req) => req.status === 'rejected').length
    return { pending, approved, rejected, total: requests.length }
  }

  const statusCounts = getStatusCounts()

  if (isLoading)
    return (
      <div className='requests-container'>
        <div className='table-loading'>
          <div className='loading-spinner'></div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className='requests-container'>
        <div className='message-toast message-error'>{error}</div>
      </div>
    )

  return (
    <div className='requests-container'>
      {/* Header Section */}
      <div className='requests-header'>
        <h2>Candidate Information Requests</h2>
        <div className='header-stats'>
          <div className='stat-card'>
            <span className='stat-number'>{statusCounts.total}</span>
            <span className='stat-label'>Total</span>
          </div>
          <div className='stat-card pending'>
            <span className='stat-number'>{statusCounts.pending}</span>
            <span className='stat-label'>Pending</span>
          </div>
          <div className='stat-card approved'>
            <span className='stat-number'>{statusCounts.approved}</span>
            <span className='stat-label'>Approved</span>
          </div>
          <div className='stat-card rejected'>
            <span className='stat-number'>{statusCounts.rejected}</span>
            <span className='stat-label'>Rejected</span>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`message-toast message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Table Section */}
      <div className='requests-table-wrapper'>
        <table className='requests-table'>
          <thead>
            <tr>
              <th>Date Received</th>
              <th>Status</th>
              <th>Candidate Name</th>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Requirement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan='7' className='empty-state'>
                  <FileText size={48} />
                  <h3>No requests found</h3>
                  <p>
                    There are no candidate information requests at the moment.
                  </p>
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const statusBadge = getStatusBadge(req.status)
                const isPending = !req.status || req.status === 'pending'

                return (
                  <tr
                    key={req._id}
                    className={statusBadge.class.replace('status-', 'row-')}>
                    {/* Date Received - Centered */}
                    <td>
                      <div>
                        <Calendar size={14} style={{ color: '#9ca3af' }} />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status - Centered */}
                    <td>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>

                    {/* Candidate Name - Left Aligned */}
                    <td>
                      <div>
                        <User size={14} style={{ color: '#9ca3af' }} />
                        {req.candidateName}
                      </div>
                    </td>

                    {/* Company - Left Aligned */}
                    <td>
                      <div>
                        <Building size={14} style={{ color: '#9ca3af' }} />
                        {req.companyName}
                      </div>
                    </td>

                    {/* Contact Person - Left Aligned */}
                    <td>{req.contactPerson}</td>

                    {/* Requirement - Left Aligned */}
                    <td
                      className='requirement-cell'
                      title={req.requirementDetails}>
                      {req.requirementDetails}
                    </td>

                    {/* Actions - Centered */}
                    <td>
                      <div className='actions-cell-container'>
                        {/* First Row: View Details + Approve/Reject */}
                        <div className='flex flex-col gap-2'>
                          <button
                            className='view-details-btn'
                            onClick={() => setSelectedRequest(req)}>
                            <Eye size={14} />
                            View
                          </button>

                          {isPending ? (
                            // Pending State - Show Compact Approve/Reject
                            <div className='compact-approve-reject'>
                              <button
                                className={`approve-btn ${
                                  actionLoading === req._id ? 'loading' : ''
                                }`}
                                onClick={() => handleApprove(req._id)}
                                disabled={actionLoading === req._id}>
                                <CheckCircle size={12} />
                                {actionLoading === req._id ? '' : 'Approve'}
                              </button>
                              <button
                                className={`reject-btn ${
                                  actionLoading === req._id ? 'loading' : ''
                                }`}
                                onClick={() => handleReject(req._id)}
                                disabled={actionLoading === req._id}>
                                <XCircle size={12} />
                                {actionLoading === req._id ? '' : 'Reject'}
                              </button>
                            </div>
                          ) : (
                            // Completed State - Show Disabled Compact Approve/Reject
                            <div className='compact-approve-reject'>
                              <button className='approve-btn disabled' disabled>
                                <CheckCircle size={12} />
                                Approve
                              </button>
                              <button className='reject-btn disabled' disabled>
                                <XCircle size={12} />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Second Row: Delete Button */}
                        <button
                          className={`delete-btn ${
                            actionLoading === `delete-${req._id}`
                              ? 'loading'
                              : ''
                          }`}
                          onClick={() => handleDelete(req._id)}
                          disabled={actionLoading === `delete-${req._id}`}>
                          <Trash2 size={14} />
                          {actionLoading === `delete-${req._id}`
                            ? ''
                            : 'Delete Request'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying full details */}
      {selectedRequest && (
        <div className='modal-overlay' onClick={() => setSelectedRequest(null)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button
              className='modal-close-btn'
              onClick={() => setSelectedRequest(null)}>
              &times;
            </button>
            <h3>Request for: {selectedRequest.candidateName}</h3>

            <p>
              <strong>Status:</strong>
              <span
                className={`status-badge ${
                  getStatusBadge(selectedRequest.status).class
                }`}>
                {getStatusBadge(selectedRequest.status).text}
              </span>
            </p>
            <p>
              <strong>
                <Building size={16} /> Company:
              </strong>
              {selectedRequest.companyName}
            </p>
            <p>
              <strong>
                <User size={16} /> Contact Person:
              </strong>
              {selectedRequest.contactPerson} ({selectedRequest.designation})
            </p>
            <p>
              <strong>
                <Mail size={16} /> Email:
              </strong>
              <a href={`mailto:${selectedRequest.email}`}>
                {selectedRequest.email}
              </a>
            </p>
            <p>
              <strong>
                <Phone size={16} /> Phone:
              </strong>
              <a href={`tel:${selectedRequest.phone}`}>
                {selectedRequest.phone}
              </a>
            </p>
            <p>
              <strong>
                <Globe size={16} /> Website:
              </strong>
              <a
                href={selectedRequest.website}
                target='_blank'
                rel='noopener noreferrer'>
                {selectedRequest.website || 'N/A'}
              </a>
            </p>

            <hr />

            <p>
              <strong>Requirement Details:</strong>{' '}
              {selectedRequest.requirementDetails}
            </p>
            <p>
              <strong>Number of Positions:</strong>{' '}
              {selectedRequest.numberOfPositions}
            </p>
            <p>
              <strong>Budget / CTC:</strong> {selectedRequest.budget || 'N/A'}
            </p>
            <p>
              <strong>Additional Notes:</strong>{' '}
              {selectedRequest.notes || 'N/A'}
            </p>

            <small>
              Received on:{' '}
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </small>

            <div className='modal-actions'>
              {(!selectedRequest.status ||
                selectedRequest.status === 'pending') && (
                <>
                  <button
                    className='approve-btn'
                    onClick={() => {
                      handleApprove(selectedRequest._id)
                      setSelectedRequest(null)
                    }}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    className='reject-btn'
                    onClick={() => {
                      handleReject(selectedRequest._id)
                      setSelectedRequest(null)
                    }}>
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
              <button
                className='delete-btn'
                onClick={() => {
                  handleDelete(selectedRequest._id)
                  setSelectedRequest(null)
                }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
