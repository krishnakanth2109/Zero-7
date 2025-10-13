import React, { useState, useEffect } from 'react'
import api from '../api/axios' // Assuming this path is correct for your setup
import {
  FaUserTie,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa' // Importing icons

const PlacedCandidates = () => {
  const [placedCandidates, setPlacedCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlacedCandidates = async () => {
    try {
      setLoading(true)
      const response = await api.get('/interview')
      // Filter only placed candidates
      const placed = response.data.filter(
        (interview) => interview.status?.toLowerCase() === 'placed',
      )
      setPlacedCandidates(placed)
    } catch (error) {
      console.error('Error fetching placed candidates:', error)
      // Optionally handle error state in UI
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlacedCandidates()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100'>
        <div className='text-center p-8 bg-white rounded-lg shadow-xl'>
          <div className='animate-spin h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-lg text-gray-700 font-semibold'>
            Loading placed candidates...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen  p-6 sm:p-10'>
      {/* Header */}
      <header className='flex flex-col sm:flex-row justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <FaCheckCircle className='text-green-500 text-3xl mr-3' />
          <h1 className='text-3xl font-extrabold text-gray-800'>
            Placed Candidates
          </h1>
        </div>
        <div className='flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-lg shadow-sm'>
          <span className='mr-2'>Total Placed:</span>
          <span className='text-2xl'>{placedCandidates.length}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='max-w-7xl mx-auto'>
        {placedCandidates.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-xl shadow-md border border-gray-100'>
            <p className='text-2xl text-gray-600 font-medium'>
              No placed candidates yet. Keep up the great work!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {placedCandidates.map((candidate) => (
              <div
                key={candidate._id}
                className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-green-200'>
                <div className='p-6'>
                  <div className='flex items-center mb-4'>
                    <FaUserTie className='text-indigo-500 text-xl mr-3' />
                    <h3 className='text-md font-bold text-gray-800'>
                      {candidate.candidateName}
                    </h3>
                  </div>
                  <div className='space-y-3'>
                    <p className='flex items-center text-gray-700'>
                      <FaBuilding className='text-purple-400 mr-3' />
                      <span className='font-semibold'>Company:</span>{' '}
                      {candidate.companyName}
                    </p>
                    <p className='flex items-center text-gray-700'>
                      <FaBriefcase className='text-teal-400 mr-3' />
                      <span className='font-semibold'>Job Role:</span>{' '}
                      {candidate.jobRole}
                    </p>
                    <p className='flex items-center text-gray-700'>
                      <FaCheckCircle className='text-green-500 mr-3' />
                      <span className='font-semibold'>Level:</span>{' '}
                      {candidate.interviewLevel}
                    </p>
                    <p className='flex items-center text-gray-700'>
                      <FaCalendarAlt className='text-orange-400 mr-3' />
                      <span className='font-semibold'>Date Placed:</span>{' '}
                      {new Date(candidate.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className='bg-green-50 px-6 py-3 rounded-b-xl border-t border-green-100'>
                  <p className='text-green-700 text-sm font-medium'>
                    Status: <span className='font-bold uppercase'>Placed</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlacedCandidates
