// File: src/Pages/NewBatchDashboard.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx' // Import the xlsx library
import { FiEdit } from 'react-icons/fi'
import { Loader2, PlusCircle, X } from 'lucide-react'
import api from '../api/axios'
import { duration } from 'moment'
// Removed: import './NewBatchDashboard.css' // No longer needed with Tailwind CSS

const API_URL = process.env.REACT_APP_API_URL // Ensure this matches your server port

export default function NewBatchDashboard() {
  const [batches, setBatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editPopup, setEditPopup] = useState(false)
  const [batch, setBatch] = useState()
  const [newBatch, setNewBatch] = useState({
    course: '',
    date: '',
    timing: '',
    duration: '',
    trainer: '',
    demo: 'No',
  })

  // Fetch batches from the server
  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/batches`)
      setBatches(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch batches:', error)
      alert('Could not fetch batches.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [editPopup])

  const handleChange = (e) =>
    setNewBatch({ ...newBatch, [e.target.name]: e.target.value })

  const handleEditChange = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value })
  }

  const handleAddBatch = async (e) => {
    e.preventDefault() // Use preventDefault for form submission
    if (
      !newBatch.course ||
      !newBatch.date ||
      !newBatch.timing ||
      !newBatch.trainer
    ) {
      alert('Please fill all fields.')
      return
    }
    try {
      const response = await axios.post(`${API_URL}/batches`, newBatch)
      setBatches([response.data, ...batches]) // Add to top of list
      setNewBatch({ course: '', date: '', timing: '', trainer: '', demo: 'No' })
      alert('Batch added successfully!')
    } catch (error) {
      console.error('Failed to add batch:', error)
      alert('Error adding new batch.')
    }
  }

  const handleDeleteBatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await axios.delete(`${API_URL}/batches/${id}`)
        setBatches(batches.filter((batch) => batch._id !== id))
      } catch (error) {
        console.error('Failed to delete batch:', error)
        alert('Error deleting batch.')
      }
    }
  }

  // --- NEW: EXPORT TO EXCEL FUNCTION ---
  const handleExport = () => {
    // We don't want to export database-specific fields like _id, __v, timestamps
    const dataToExport = batches.map(
      ({ course, date, timing, duration, trainer, demo }) => ({
        Course: course,
        Date: date,
        Timing: timing,
        Duration: duration,
        Trainer: trainer,
        'Demo Available': demo,
      }),
    )

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Batches')
    XLSX.writeFile(workbook, 'NewBatches.xlsx') // This will download the file
  }

  // --- NEW: IMPORT FROM EXCEL FUNCTION ---
  const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)

      // Map Excel headers to our database schema fields
      const formattedBatches = json.map((row) => ({
        course: row.Course,
        date: row.Date,
        timing: row.Timing,
        duration: row.duration,
        trainer: row.Trainer,
        demo: row['Demo Available'] || 'No',
      }))

      if (
        window.confirm(
          `Found ${formattedBatches.length} batches to import. Do you want to proceed?`,
        )
      ) {
        try {
          await axios.post(`${API_URL}/batches/bulk`, formattedBatches)
          alert('Batches imported successfully!')
          fetchBatches() // Refresh the list from the server
        } catch (error) {
          console.error('Failed to import batches:', error)
          alert('Error importing batches. Check the console for details.')
        }
      }
    }
    reader.readAsArrayBuffer(file)
    event.target.value = null // Reset file input
  }

  const handleCloseModal = () => {
    setEditPopup(false)
  }

  const handlePopup = (batch) => {
    setBatch(batch)
    setEditPopup(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    const res = await api.patch(`/batches/${batch._id}`, batch)
    setEditPopup(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-sans'>
      <h2 className='text-4xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow-md'>
        🎓 New Batch Dashboard
      </h2>

      {/* Add New Batch Form */}
      <div className='bg-white shadow-xl rounded-lg p-6 mb-8 max-w-4xl mx-auto border border-indigo-200'>
        <h3 className='text-2xl font-bold text-indigo-700 mb-6 flex items-center'>
          <span className='text-indigo-500 mr-3 text-3xl'>➕</span> Add New
          Batch
        </h3>
        <form onSubmit={handleAddBatch} className='space-y-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='text'
              name='course'
              placeholder='Course Name'
              value={newBatch.course}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200'
            />
            <input
              type='date'
              name='date'
              placeholder='Date (e.g., 20 Aug 2025)'
              value={newBatch.date}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200'
            />
            <input
              type='text'
              name='timing'
              placeholder='Batch Timing'
              value={newBatch.timing}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200'
            />
            <input
              type='text'
              name='duration'
              placeholder='Batch Duration'
              value={newBatch.duration}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200'
            />
            <input
              type='text'
              name='trainer'
              placeholder='Trainer Name'
              value={newBatch.trainer}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200'
            />
            <select
              name='demo'
              value={newBatch.demo}
              onChange={handleChange}
              className='p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all duration-200 appearance-none pr-8 cursor-pointer'
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
              }}>
              <option value='No'>Register for Demo: No</option>
              <option value='Yes'>Register for Demo: Yes</option>
            </select>
          </div>
          <button
            className='w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-lg font-semibold'
            type='submit'>
            Add Batch
          </button>
        </form>
      </div>

      {/* popup */}
      {editPopup && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative'>
            <div className='pb-4 border-b border-gray-200 mb-6 flex items-center justify-between'>
              <h3 className='text-2xl font-semibold text-gray-800'>
                Edit Batches
              </h3>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600 transition'>
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmitEdit}
              className='grid grid-cols-1 gap-4'>
              <div className='relative'>
                <input
                  name='course'
                  id='course'
                  value={batch.course}
                  onChange={handleEditChange}
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg  text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='date'
                  value={batch.date}
                  onChange={handleEditChange}
                  placeholder='Date'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='role'
                  value={batch.timing}
                  onChange={handleEditChange}
                  placeholder='Batch timing'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='role'
                  value={batch.duration}
                  onChange={handleEditChange}
                  placeholder='Batch duration'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <div className='relative'>
                <input
                  name='trainer'
                  value={batch.trainer}
                  onChange={handleEditChange}
                  placeholder='Trainer'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
              <select
                name='demo'
                value={batch.demo}
                onChange={handleEditChange}
                className='relative p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all duration-200 appearance-none pr-8 cursor-pointer'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em 1.5em',
                }}>
                <option value='No'>Register for Demo: No</option>
                <option value='Yes'>Register for Demo: Yes</option>
              </select>
              <div className='flex justify-end space-x-4 mt-6'>
                <button
                  type='button'
                  className='flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 text-sm font-medium'
                  onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
                  Update Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show Batches Table */}
      <div className='bg-white shadow-xl rounded-lg p-6 max-w-6xl mx-auto border border-indigo-200'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4'>
          <h3 className='text-2xl font-bold text-indigo-700 mb-4 sm:mb-0 flex items-center'>
            <span className='text-indigo-500 mr-3 text-3xl'>📋</span> All
            Batches
          </h3>
          <div className='flex flex-wrap gap-3 items-center justify-center'>
            <label
              type='button'
              htmlFor='import-excel'
              className='bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200 text-sm font-medium'>
              Import from Excel
            </label>
            <input
              id='import-excel'
              type='file'
              accept='.xlsx, .xls'
              onChange={handleImport}
              className='hidden'
            />
            <label
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 text-sm font-medium'
              onClick={handleExport}>
              Export to Excel
            </label>
          </div>
        </div>

        {isLoading ? (
          <p className='text-center text-gray-600 text-lg py-8'>
            Loading batches...
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Course
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Timing
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Duration
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trainer
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Demo
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <tr
                      key={batch._id}
                      className='hover:bg-gray-50 transition-colors duration-150'>
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {batch.course}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
                        {batch.date}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
                        {batch.timing}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
                        {batch.duration}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
                        {batch.trainer}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                          batch.demo === 'Yes'
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}>
                        {batch.demo}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-4'>
                        <button
                          onClick={() => handlePopup(batch)}
                          className='text-indigo-600 hover:text-indigo-900 font-semibold transition-colors duration-200 flex items-center'
                          title='Edit Company'>
                          <FiEdit className='mr-1 h-4 w-4' /> Edit
                        </button>
                        <button
                          className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-xs'
                          onClick={() => handleDeleteBatch(batch._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='6'
                      className='px-4 py-6 text-center text-gray-500 text-base'>
                      No batches found. Add one above or import from Excel.
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
