// File: src/Pages/AdminViewRequests.jsx

import React, { useState, useEffect, useMemo } from 'react'
import {
  CheckSquare,      
  MinusCircle,      
  Maximize2,        
  Trash,            
  Calendar,
  Building,
  User,             
  Users,            // Added for the header icon
  Mail,
  Phone,
  Globe,
  FileText,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  ShieldCheck,
  ShieldAlert,
  ClipboardList
} from 'lucide-react'
import api from '../api/axios'

export default function AdminViewRequests() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage] = useState(null)

  // Filters & Search State
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  })

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

  // --- Actions ---
  const handleApprove = async (requestId) => {
    setActionLoading(`approve-${requestId}`)
    try {
      await api.put(`/request-info/${requestId}`, { status: 'approved' })
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: 'approved' } : req,
        ),
      )
      showMessage('Request approved successfully!', 'success')
    } catch (err) {
      console.error('Approve error:', err)
      showMessage('Failed to approve request.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId) => {
    setActionLoading(`reject-${requestId}`)
    try {
      await api.put(`/request-info/${requestId}`, { status: 'rejected' })
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: 'rejected' } : req,
        ),
      )
      showMessage('Request rejected successfully!', 'success')
    } catch (err) {
      console.error('Reject error:', err)
      showMessage('Failed to reject request.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (requestId) => {
    if (!window.confirm('Delete this request permanently?')) return

    setActionLoading(`delete-${requestId}`)
    try {
      await api.delete(`/request-info/${requestId}`)
      setRequests((prev) => prev.filter((req) => req._id !== requestId))
      showMessage('Request deleted successfully!', 'success')
      if (selectedRequest?._id === requestId) setSelectedRequest(null)
    } catch (err) {
      console.error('Delete error:', err)
      showMessage('Failed to delete request.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // --- Logic: Filter, Search & Sort ---
  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests]

    // 1. Filter by Status
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        result = result.filter((req) => !req.status || req.status === 'pending')
      } else {
        result = result.filter((req) => req.status === filterStatus)
      }
    }

    // 2. Filter by Search Term (Enhanced to include Email/Phone)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      result = result.filter((req) => 
        (req.candidateName?.toLowerCase() || '').includes(lower) ||
        (req.companyName?.toLowerCase() || '').includes(lower) ||
        (req.contactPerson?.toLowerCase() || '').includes(lower) ||
        (req.email?.toLowerCase() || '').includes(lower) ||
        (req.phone || '').includes(lower)
      )
    }

    // 3. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || ''
        const valB = b[sortConfig.key] || ''
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [requests, filterStatus, searchTerm, sortConfig])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Helper: Status Badges
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-amber-100 text-amber-800 border-amber-200'
    }
  }

  // Helper: Counts
  const counts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter((r) => !r.status || r.status === 'pending').length,
      approved: requests.filter((r) => r.status === 'approved').length,
      rejected: requests.filter((r) => r.status === 'rejected').length
    }
  }, [requests])

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="w-4 ml-1"></span>
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline" /> : <ChevronDown size={14} className="ml-1 inline" />
  }

  return (
    <div className='p-4 sm:p-8 bg-gray-50 min-h-screen font-sans'>
      
      {/* ============ BLUE HEADER ============ */}
      <div className='bg-[#1976d2] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white'>
        <div className='flex items-center space-x-5 w-full md:w-auto mb-6 md:mb-0'>
          <div className='bg-white p-4 rounded-full flex items-center justify-center shadow-md'>
            <Users className='text-[#1976d2]' size={32} /> {/* Replaced Inbox with Users icon */}
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Candidate Requests</h1>
            <p className='text-blue-100 opacity-90 text-sm font-medium mt-1'>
              Manage incoming candidate information requests
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center w-full md:w-auto'>
          <div className='bg-white text-gray-800 rounded-lg py-3 px-8 min-w-[160px] flex flex-col items-center shadow-md'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#1976d2] mb-1'>Total Requests</span>
            <span className='text-4xl font-extrabold text-gray-900'>{requests.length}</span>
          </div>
        </div>
      </div>

      {/* ============ FILTERS & SEARCH CARD ============ */}
      <div className='bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          
          {/* Tabs */}
          <div className='flex flex-wrap gap-2'>
             {['all', 'pending', 'approved', 'rejected'].map((status) => {
               const isActive = filterStatus === status
               let activeClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               if (isActive && status === 'all') activeClass = 'bg-blue-600 text-white'
               if (isActive && status === 'pending') activeClass = 'bg-amber-500 text-white'
               if (isActive && status === 'approved') activeClass = 'bg-green-600 text-white'
               if (isActive && status === 'rejected') activeClass = 'bg-red-500 text-white'
               
               return (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status)}
                   className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center space-x-2 ${activeClass}`}
                 >
                   <span className="capitalize">{status}</span>
                   <span className={`px-1.5 py-0.5 rounded-full text-xs bg-white/30`}>
                     {counts[status]}
                   </span>
                 </button>
               )
             })}
          </div>

          {/* Search Bar */}
          <div className='relative w-full md:w-80'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search size={18} className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search name, company, email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all'
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============ TOAST MESSAGE ============ */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in-down ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* ============ TABLE CARD ============ */}
      <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
        
        {isLoading && (
          <div className='flex justify-center items-center py-20 text-gray-500'>
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1976d2]"></div>
             <span className="ml-3 font-medium">Loading data...</span>
          </div>
        )}

        {error && (
          <div className='p-10 text-center text-red-500 font-semibold'>
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  {[
                    { key: 'createdAt', label: 'Date Received' },
                    { key: 'status', label: 'Status' },
                    { key: 'candidateName', label: 'Candidate Name' },
                    { key: 'companyName', label: 'Company' },
                    { key: 'contactPerson', label: 'Contact Person' },
                    { key: 'requirementDetails', label: 'Requirement' },
                    { key: 'actions', label: 'Actions' }
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.key !== 'actions' && col.key !== 'requirementDetails' && handleSort(col.key)}
                      className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${col.key !== 'actions' && col.key !== 'requirementDetails' ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700' : ''}`}
                    >
                      <div className="flex items-center">
                        {col.label}
                        <SortIndicator columnKey={col.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredAndSortedRequests.length === 0 ? (
                  <tr>
                    <td colSpan='7' className='px-6 py-16 text-center text-gray-400'>
                      <div className="flex flex-col items-center">
                        <Filter size={40} className="mb-2 opacity-50" />
                        <p className="text-lg font-medium text-gray-500">No requests match your filters</p>
                        <p className="text-sm">Try adjusting your search or tabs.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedRequests.map((req) => {
                    const statusClass = getStatusStyle(req.status || 'pending')
                    const isPending = !req.status || req.status === 'pending'
                    const loadingId = actionLoading?.split('-')[1]
                    const loadingType = actionLoading?.split('-')[0]

                    return (
                      <tr key={req._id} className='hover:bg-blue-50 transition-colors duration-150'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                           <div className="flex items-center">
                             <Calendar size={14} className="mr-2 text-gray-400" />
                             {new Date(req.createdAt).toLocaleDateString()}
                           </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${statusClass}`}>
                            {req.status || 'pending'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                           <div className="flex items-center">
                             <User size={14} className="mr-2 text-gray-400" />
                             {req.candidateName}
                           </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                           <div className="flex items-center">
                             <Building size={14} className="mr-2 text-gray-400" />
                             {req.companyName}
                           </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {req.contactPerson}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 max-w-xs truncate' title={req.requirementDetails}>
                          {req.requirementDetails}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex items-center space-x-2'>
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className='p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors'
                              title='View Details'
                            >
                              <Maximize2 size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleApprove(req._id)}
                              disabled={!isPending || actionLoading}
                              className={`p-1.5 rounded-lg transition-colors ${!isPending ? 'opacity-30 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                              title='Approve'
                            >
                               {loadingType === 'approve' && loadingId === req._id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <CheckSquare size={16} />}
                            </button>

                            <button
                              onClick={() => handleReject(req._id)}
                              disabled={!isPending || actionLoading}
                              className={`p-1.5 rounded-lg transition-colors ${!isPending ? 'opacity-30 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
                              title='Reject'
                            >
                               {loadingType === 'reject' && loadingId === req._id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <MinusCircle size={16} />}
                            </button>

                            <button
                              onClick={() => handleDelete(req._id)}
                              disabled={actionLoading}
                              className='p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors'
                              title='Delete'
                            >
                               {loadingType === 'delete' && loadingId === req._id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Trash size={16} />}
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
        )}
      </div>

      {/* ============ DETAIL MODAL ============ */}
      {selectedRequest && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm' onClick={() => setSelectedRequest(null)}>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up' onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-800'>Request Information</h3>
              <button onClick={() => setSelectedRequest(null)} className='text-gray-400 hover:text-gray-600 transition-colors'>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className='p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
              
              {/* Status Banner */}
              <div className={`p-3 rounded-lg border flex items-center justify-between ${getStatusStyle(selectedRequest.status || 'pending')}`}>
                <span className="font-bold uppercase text-xs tracking-wider">Current Status</span>
                <span className="font-bold capitalize">{selectedRequest.status || 'Pending'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase">Candidate</label>
                   <p className="font-medium text-gray-800 flex items-center mt-1"><User size={14} className="mr-1.5 text-blue-500"/> {selectedRequest.candidateName}</p>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase">Company</label>
                   <p className="font-medium text-gray-800 flex items-center mt-1"><Building size={14} className="mr-1.5 text-blue-500"/> {selectedRequest.companyName}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Contact Info</label>
                <div className="bg-gray-50 p-3 rounded-lg mt-1 space-y-2 text-sm text-gray-700">
                    <p className="flex items-center"><ClipboardList size={14} className="mr-2 text-gray-400"/> {selectedRequest.contactPerson} <span className="text-xs text-gray-400 ml-1">({selectedRequest.designation})</span></p>
                    <p className="flex items-center"><Mail size={14} className="mr-2 text-gray-400"/> <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">{selectedRequest.email}</a></p>
                    <p className="flex items-center"><Phone size={14} className="mr-2 text-gray-400"/> <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 hover:underline">{selectedRequest.phone}</a></p>
                    {selectedRequest.website && (
                       <p className="flex items-center"><Globe size={14} className="mr-2 text-gray-400"/> <a href={selectedRequest.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedRequest.website}</a></p>
                    )}
                </div>
              </div>

              <div className="space-y-3">
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Requirements</label>
                    <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedRequest.requirementDetails}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-semibold text-gray-600">Positions:</span> {selectedRequest.numberOfPositions}
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Budget:</span> {selectedRequest.budget || 'N/A'}
                    </div>
                 </div>
                 {selectedRequest.notes && (
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Notes</label>
                        <p className="text-sm text-gray-600 italic mt-1">{selectedRequest.notes}</p>
                    </div>
                 )}
              </div>
              
              <div className="text-right text-xs text-gray-400 border-t pt-3">
                 Received: {new Date(selectedRequest.createdAt).toLocaleString()}
              </div>

            </div>

            {/* Modal Footer */}
            <div className='bg-gray-50 px-6 py-4 flex justify-end space-x-3'>
              {(!selectedRequest.status || selectedRequest.status === 'pending') && (
                 <>
                   <button 
                     onClick={() => { handleApprove(selectedRequest._id); setSelectedRequest(null); }}
                     className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center"
                   >
                     <ShieldCheck size={16} className="mr-1.5"/> Approve
                   </button>
                   <button 
                     onClick={() => { handleReject(selectedRequest._id); setSelectedRequest(null); }}
                     className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 flex items-center"
                   >
                     <ShieldAlert size={16} className="mr-1.5"/> Reject
                   </button>
                 </>
              )}
               <button 
                 onClick={() => { handleDelete(selectedRequest._id); setSelectedRequest(null); }}
                 className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center"
               >
                 <Trash size={16} className="mr-1.5"/> Delete
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}