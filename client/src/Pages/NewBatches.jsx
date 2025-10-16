// File: src/Pages/NewBatches.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from '../Components/Pagination'
import api from '../api/axios' // Import your central api instance
import './NewBatches.css'

const API_URL = process.env.REACT_APP_API_URL

const NewBatches = () => {
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [coursesData, setCoursesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // This still fetches the list of available batches correctly
        const response = await axios.get(`${API_URL}/batches`)
        setCoursesData(response.data)
      } catch (error) {
        console.error('Failed to fetch new batches:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const courses = coursesData.map((course) => course.course)

  const filteredCourses = coursesData.filter((course) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (course.course && course.course.toLowerCase().includes(searchLower)) ||
      (course.date && course.date.toLowerCase().includes(searchLower)) ||
      (course.timing && course.timing.toLowerCase().includes(searchLower)) ||
      (course.duration && course.duration.toLowerCase().includes(searchLower)) ||
      (course.trainer && course.trainer.toLowerCase().includes(searchLower))
    )
  })

  const handleRegister = (courseName) => {
    setSelectedCourse(courseName)
    setShowRegistration(true)
  }

  const handleCloseRegistration = () => setShowRegistration(false)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }
  const clearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

  const RegistrationModal = ({ isOpen, onClose, initialCourse }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      selectedCourse: initialCourse || '',
      programType: '',
      message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false) // State for loading feedback

    if (!isOpen) return null

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // --- THIS IS THE UPDATED SUBMISSION LOGIC ---
    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!formData.programType) {
        alert('Please select an Enrollment Type before submitting.')
        return
      }
      setIsSubmitting(true)
      try {
        const selectedCourseObj = coursesData.find((c) => c.course === formData.selectedCourse)
        const payload = {
          ...formData,
          trainer: selectedCourseObj?.trainer || '',
          date: selectedCourseObj?.date || '',
          timings: selectedCourseObj?.timing || '',
          duration: selectedCourseObj?.duration || '',
        }
        
        // Use the axios instance to post to your new backend endpoint
        await api.post('/batch-enrollments', payload)

        setSubmitted(true) // Show the success message
      } catch (err) {
        console.error("Registration failed:", err)
        const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.'
        alert(`Error: ${errorMessage}`)
      } finally {
        setIsSubmitting(false)
      }
    }
    // ---------------------------------------------

    return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
          {submitted ? (
            <div className='success-message'>
              <h2>Thank You!</h2>
              <p>
                Your registration for the demo of{' '}
                <strong>{formData.selectedCourse}</strong> has been received.
              </p>
              <p>We will contact you shortly at {formData.email}.</p>
            </div>
          ) : (
            <>
              <h2>Register for a Free Demo</h2>
              <p>Fill in your details to register for a demo class</p>
              <form onSubmit={handleSubmit} className='registration-form'>
                <div className='form-group'>
                  <label>Full Name *</label>
                  <input type='text' name='name' value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Email Address *</label>
                  <input type='email' name='email' value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Phone Number *</label>
                  <input type='tel' name='phone' value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Select Course *</label>
                  <select name='selectedCourse' value={formData.selectedCourse} onChange={handleInputChange} required>
                    <option value=''>-- Select a Course --</option>
                    {courses.map((courseName, index) => (
                      <option key={index} value={courseName}>
                        {courseName}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.selectedCourse && (
                  <div className='form-group'>
                    <label>Enrollment Type *</label>
                    <select name='programType' value={formData.programType} onChange={handleInputChange} required>
                      <option value=''>-- Select Type --</option>
                      <option value='Training'>Training</option>
                      <option value='Internship'>Internship</option>
                      <option value='Resume Marketing'>Resume Marketing</option>
                      <option value='All of the above'>All of the above</option>
                    </select>
                  </div>
                )}
                <div className='form-group'>
                  <label>Message (Optional)</label>
                  <textarea name='message' value={formData.message} onChange={handleInputChange} rows='3'></textarea>
                </div>
                <button type='submit' className='submit-button' disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Register for Demo'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='batches-container'>
        <div className='flex'>
          <h2 className='batches-title'>New Batches</h2>
        </div>
        <div className='search-container'>
          <div className='search-box'>
            <input
              type='text'
              placeholder='Search courses...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='search-input'
            />
            {searchTerm && (
              <button className='clear-search' onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
          <div className='search-results-count'>
            {filteredCourses.length} of {coursesData.length} courses found
          </div>
        </div>

        <div className='table-wrapper'>
          {isLoading ? (
            <p>Loading batches...</p>
          ) : (
            <table className='batches-table'>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Register for Demo</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.course}</td>
                      <td>
                        {new Date(course.date).toLocaleDateString('En-IN', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td>{course.duration || 'N/A'}</td>
                      <td>
                        <button
                          className='register-btn'
                          onClick={() => handleRegister(course.course)}>
                          Register Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4' className='no-results'>
                      No courses found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {filteredCourses.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCourses.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          )}
        </div>
      </div>
      <RegistrationModal
        isOpen={showRegistration}
        onClose={handleCloseRegistration}
        initialCourse={selectedCourse}
      />
    </>
  )
}

export default NewBatches