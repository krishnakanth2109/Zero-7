// File: src/Pages/NewBatchDashboard.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx' // Import the xlsx library
import './NewBatchDashboard.css'

const API_URL = process.env.REACT_APP_API_URL // Ensure this matches your server port

export default function NewBatchDashboard() {
  const [batches, setBatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newBatch, setNewBatch] = useState({
    course: '',
    date: '',
    timing: '',
    trainer: '',
    demo: 'No',
  })

  // Fetch batches from the server
  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/batches`)
      setBatches(response.data)
    } catch (error) {
      console.error('Failed to fetch batches:', error)
      alert('Could not fetch batches.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  const handleChange = (e) =>
    setNewBatch({ ...newBatch, [e.target.name]: e.target.value })

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
      ({ course, date, timing, trainer, demo }) => ({
        Course: course,
        Date: date,
        Timing: timing,
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

  return (
    <div className='dashboard-container'>
      <h2>🎓 New Batch Dashboard</h2>

      {/* Add New Batch Form */}
      <div className='form-card'>
        <h3>➕ Add New Batch</h3>
        <form onSubmit={handleAddBatch}>
          {' '}
          {/* Use form element for better accessibility */}
          <div className='form-grid'>
            <input
              type='text'
              name='course'
              placeholder='Course Name'
              value={newBatch.course}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='date'
              placeholder='Date (e.g., 20 Aug 2025)'
              value={newBatch.date}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='timing'
              placeholder='Batch Timing'
              value={newBatch.timing}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='trainer'
              placeholder='Trainer Name'
              value={newBatch.trainer}
              onChange={handleChange}
              required
            />
            <select name='demo' value={newBatch.demo} onChange={handleChange}>
              <option value='No'>Register for Demo: No</option>
              <option value='Yes'>Register for Demo: Yes</option>
            </select>
          </div>
          <button className='add-btn' type='submit'>
            Add Batch
          </button>
        </form>
      </div>

      {/* Show Batches Table */}
      <div className='table-card'>
        <div className='table-header'>
          <h3>📋 All Batches</h3>
          <div className='table-actions'>
            <label htmlFor='import-excel' className='import-btn'>
              Import from Excel
            </label>
            <input
              id='import-excel'
              type='file'
              accept='.xlsx, .xls'
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <button className='export-btn' onClick={handleExport}>
              Export to Excel
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading batches...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Timing</th>
                <th>Trainer</th>
                <th>Demo</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch._id}>
                    <td>{batch.course}</td>
                    <td>{batch.date}</td>
                    <td>{batch.timing}</td>
                    <td>{batch.trainer}</td>
                    <td
                      className={batch.demo === 'Yes' ? 'demo-yes' : 'demo-no'}>
                      {batch.demo}
                    </td>
                    <td>
                      <button
                        className='delete-btn'
                        onClick={() => handleDeleteBatch(batch._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6'>
                    No batches found. Add one above or import from Excel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
