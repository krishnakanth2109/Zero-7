import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const AdminHomeForm = () => {
  const [forms, setForms] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // Number of items per page
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending',
  }) // Initial sort
  const audioContextRef = useRef(null)
  const audioBufferRef = useRef(null)
  const previousLengthRef = useRef(0) // Track previous submissions

  // Load notification sound using Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)()

    const loadAudio = async () => {
      try {
        const response = await fetch('/notification.mp3') // replace with your file
        const arrayBuffer = await response.arrayBuffer()
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(
          arrayBuffer,
        )
      } catch (err) {
        console.error('Failed to load audio:', err)
      }
    }

    loadAudio()
  }, [])

  // Function to play notification sound
  const playSound = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBufferRef.current
      source.connect(audioContextRef.current.destination)
      source.start(0)
    }
  }

  // Fetch forms and check for new submissions
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms`)
        setForms(res.data)

        // Play sound if new form is submitted
        if (res.data.length > previousLengthRef.current) {
          playSound()
        }
        previousLengthRef.current = res.data.length
      } catch (err) {
        console.error('Failed to fetch forms:', err)
      }
    }

    fetchForms()
    const interval = setInterval(fetchForms, 5000) // check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // --- Sorting Logic ---
  const sortedForms = useMemo(() => {
    let sortableForms = [...forms]
    if (sortConfig.key !== null) {
      sortableForms.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Special handling for createdAt (Date objects)
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableForms
  }, [forms, sortConfig])

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // --- Pagination Logic ---
  const totalPages = Math.ceil(sortedForms.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentForms = sortedForms.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const renderPaginationButtons = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }

    return (
      <nav className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
        <div className='flex flex-1 justify-between sm:hidden'>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'>
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'>
            Next
          </button>
        </div>
        <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-gray-700'>
              Showing{' '}
              <span className='font-medium'>{indexOfFirstItem + 1}</span> to{' '}
              <span className='font-medium'>
                {Math.min(indexOfLastItem, sortedForms.length)}
              </span>{' '}
              of <span className='font-medium'>{sortedForms.length}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav
              className='isolate inline-flex -space-x-px rounded-md shadow-sm'
              aria-label='Pagination'>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'>
                <span className='sr-only'>Previous</span>
                <svg
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  aria-current={currentPage === number ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === number
                      ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}>
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'>
                <span className='sr-only'>Next</span>
                <svg
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Carrer Consultation Form</h2>

      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Phone Number
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Purpose
                    </th>
                    <th
                      scope='col'
                      className='relative cursor-pointer py-3.5 pl-3 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6'
                      onClick={() => requestSort('createdAt')}>
                      Submitted At
                      {sortConfig.key === 'createdAt' && (
                        <span>
                          {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {currentForms.length > 0 ? (
                    currentForms.map((form) => (
                      <tr key={form._id}>
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                          {form.name}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {form.number}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {form.email}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {form.purpose}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {new Date(form.createdAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan='5'
                        className='text-center py-4 text-sm text-gray-500'>
                        No forms to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && renderPaginationButtons()}
    </div>
  )
}

export default AdminHomeForm
