import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './NewBatches.css'

const API_URL = 'http://localhost:5000'

const NewBatches = () => {
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [coursesData, setCoursesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/batches`)
        setCoursesData(response.data)
      } catch (error) {
        console.error('Failed to fetch new batches:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // ✅ FIX: Mapped `course.course` instead of `course.name`
  const courses = coursesData.map((course) => course.course)

  // ✅ FIX: Filtering logic now uses the correct field names (`course`, `timing`)
  const filteredCourses = coursesData.filter((course) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (course.course && course.course.toLowerCase().includes(searchLower)) ||
      (course.date && course.date.toLowerCase().includes(searchLower)) ||
      (course.timing && course.timing.toLowerCase().includes(searchLower)) ||
      (course.duration &&
        course.duration.toLowerCase().includes(searchLower)) ||
      (course.trainer && course.trainer.toLowerCase().includes(searchLower))
    )
  })

  // ✅ FIX: Pass the correct course name string to the handler
  const handleRegister = (courseName) => {
    setSelectedCourse(courseName)
    setShowRegistration(true)
  }

  const handleCloseRegistration = () => setShowRegistration(false)
  const handleSearchChange = (e) => setSearchTerm(e.target.value)
  const clearSearch = () => setSearchTerm('')

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

    if (!isOpen) return null

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!formData.programType) {
        alert('Please select a Type of option before submitting.')
        return
      }
      try {
        // ✅ FIX: Find the course object by `c.course`
        const selectedCourseObj = coursesData.find(
          (c) => c.course === formData.selectedCourse,
        )
        const payload = {
          ...formData,
          trainer: selectedCourseObj?.trainer || '',
          date: selectedCourseObj?.date || '',
          // ✅ FIX: Use `timing` instead of `timings`
          timings: selectedCourseObj?.timing || '',
          duration: selectedCourseObj?.duration || '',
        }
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbzXzDo0cVEMDIXaU3j-fxrW5Fqi7LggylggenCQHltP300R2PgK6H11YAdeYnpVfhVb/exec',
          {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
          },
        )
        const result = await response.json()
        if (result.result === 'success') {
          setSubmitted(true)
        } else {
          alert('Error: ' + result.message)
        }
      } catch (err) {
        alert('Something went wrong. Try again.')
      }
    }
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
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Email Address *</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Phone Number *</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Select Course *</label>
                  <select
                    name='selectedCourse'
                    value={formData.selectedCourse}
                    onChange={handleInputChange}
                    required>
                    <option value=''>-- Select a Course --</option>
                    {/* ✅ FIX: Use a more descriptive variable name */}
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
                    <select
                      name='programType'
                      value={formData.programType}
                      onChange={handleInputChange}
                      required>
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
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    rows='3'></textarea>
                </div>
                <button type='submit' className='submit-button'>
                  Register for Demo
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
        <h2 className='batches-title'>New Batches</h2>
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
                  <th>Timings</th>
                  <th>Duration</th>
                  <th>Trainer</th>
                  <th>Register for Demo</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course._id}>
                      {/* ✅ FIX: Render all fields from the course object */}
                      <td>{course.course}</td>
                      <td>{course.date}</td>
                      <td>{course.timing}</td>
                      <td>{course.duration || 'N/A'}</td>
                      <td>{course.trainer}</td>
                      <td>
                        <button
                          className='register-btn'
                          // ✅ FIX: Pass `course.course` to the handler
                          onClick={() => handleRegister(course.course)}>
                          Register Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6' className='no-results'>
                      No courses found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
