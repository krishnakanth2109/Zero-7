// File: src/Pages/AdminBatchEnrollments.jsx

import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { 
  ClipboardList, 
  Loader2, 
  ShieldX, 
  Trash2, 
  Download, 
  Users 
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const AdminBatchEnrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        const response = await api.get('/batch-enrollments')
        setEnrollments(response.data)
      } catch (e) {
        console.error('Error fetching enrollments:', e)
        setError('Failed to load enrollment data.')
      } finally {
        setLoading(false)
      }
    }
    fetchEnrollments()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await api.delete(`/batch-enrollments/${id}`)
        setEnrollments(enrollments.filter((item) => item._id !== id))
      } catch (err) {
        console.error('Error deleting enrollment:', err)
        alert('Failed to delete the enrollment.')
      }
    }
  }

  const handleExport = () => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const formattedData = enrollments.map((item) => ({
      Name: item.name,
      Contact: `${item.phone}, ${item.email}`,
      Course: item.selectedCourse,
      'Enrollment Type': item.programType,
      Message: item.message || 'N/A',
      'Submitted On': new Date(item.createdAt).toLocaleString(),
    }))

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    saveAs(data, 'batch-enrollments' + fileExtension)
  }

  return (
    <div className='p-4 sm:p-8 bg-gray-50 min-h-screen font-sans'>
      
      {/* ============ BLUE HEADER SECTION ============ */}
      <div className='bg-[#1976d2] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white'>
        
        {/* Left Side: Icon & Text */}
        <div className='flex items-center space-x-5 w-full md:w-auto mb-6 md:mb-0'>
          <div className='bg-white p-4 rounded-full flex items-center justify-center shadow-md'>
            <ClipboardList className='text-[#1976d2]' size={32} />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Batch Demo Enrollments
            </h1>
            <p className='text-blue-100 opacity-90 text-sm font-medium mt-1'>
              Registrations from the 'New Batches' page
            </p>
          </div>
        </div>

        {/* Right Side: Stats Card */}
        <div className='flex items-center justify-center w-full md:w-auto'>
          <div className='bg-white text-gray-800 rounded-lg py-3 px-8 min-w-[160px] flex flex-col items-center shadow-md transform hover:-translate-y-1 transition-transform duration-300'>
            <div className='flex items-center space-x-2 text-[#1976d2] mb-1'>
              <Users size={16} />
              <span className='text-xs font-bold uppercase tracking-wider'>TOTAL</span>
            </div>
            <span className='text-4xl font-extrabold text-gray-900'>
              {enrollments.length}
            </span>
          </div>
        </div>
      </div>
      {/* =========================================== */}

      {/* Content Area Card */}
      <div className='bg-white rounded-xl shadow-md p-6 border border-gray-100'>
        
        {/* Export Button Area */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg font-semibold text-gray-700'>Registrations List</h2>
          <button
            onClick={handleExport}
            className='inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed'
            disabled={loading || enrollments.length === 0}>
            <Download size={18} className='mr-2' />
            Export to Excel
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
            <Loader2 className='animate-spin text-[#1976d2]' size={48} />
            <p className='mt-4 font-medium'>Loading Enrollments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='flex flex-col items-center justify-center py-20 text-red-600 bg-red-50 rounded-lg'>
            <ShieldX size={48} />
            <p className='mt-4 font-bold'>{error}</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className='overflow-x-auto rounded-lg border border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Contact
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Course
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Enrollment Type
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Message
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Submitted On
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {enrollments.length > 0 ? (
                  enrollments.map((item) => (
                    <tr key={item._id} className='hover:bg-blue-50 transition-colors duration-150'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                        {item.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        <div className='font-medium'>{item.phone}</div>
                        <div className='text-xs text-gray-500'>{item.email}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium'>
                        {item.selectedCourse}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <span className='px-2 py-1 bg-blue-100 text-[#1976d2] rounded-full text-xs font-bold'>
                          {item.programType}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 max-w-xs break-words'>
                        {item.message || <span className='text-gray-400 italic'>N/A</span>}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all'
                          title='Delete Enrollment'>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='7'
                      className='px-6 py-12 text-center text-gray-400 bg-gray-50'>
                      <div className='flex flex-col items-center'>
                        <ClipboardList size={40} className='mb-2 opacity-50' />
                        <p>No batch enrollments found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBatchEnrollments