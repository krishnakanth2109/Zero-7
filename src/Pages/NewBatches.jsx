import React, { useState } from 'react';
import './NewBatches.css';

const NewBatches = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const coursesData = [
    { name: "UIUX Designing", date: "20 - August - 2025", timings: "04:00 PM - 05:00 PM", duration: "4 Months", trainer: "Mr. Sakthvel" },
    { name: "Python with Django", date: "20 - August - 2025", timings: "05:00 PM - 06:00 PM", duration: "3 Months", trainer: "Mr. Sudheer" },
    { name: "React JS", date: "21 - August - 2025", timings: "11:00 AM - 12:00 PM", duration: "1 Months", trainer: "Mr. Bhargav" },
    { name: "Node JS", date: "18 - August - 2025", timings: "04:00 PM - 05:00 PM", duration: "1 Months", trainer: "Mr. Jaya chandra reddy" },
    { name: "Web Designing", date: "20 - August - 2025", timings: "05:00 PM - 06:00 PM", duration: "2 Months", trainer: "Mr. Bhargav" },
    { name: "SEO", date: "20 - August - 2025", timings: "05:00 PM - 06:00 PM", duration: "2 Months", trainer: "M.S.R" },
    { name: "PHP with MySQL", date: "20 - August - 2025", timings: "05:00 PM - 06:00 PM", duration: "3 Months", trainer: "Mr. Bhargav" },
    { name: "Google Adwords", date: "20 - August - 2025", timings: "05:00 PM - 06:00 PM", duration: "1 Months", trainer: "M.S.R" },
    { name: "Python Full Stack Development", date: "11 - August - 2025", timings: "11:00 AM - 12:00 PM", duration: "5 Months", trainer: "Mr. Sudheer" },
    { name: "Full Stack Development", date: "11 - August - 2025", timings: "04:00 PM - 05:00 PM", duration: "5 Months", trainer: "Mr. Bhargav" },
    { name: "Python with Django", date: "11 - August - 2025", timings: "11:00 AM - 12:00 PM", duration: "3 Months", trainer: "Mr. Sudheer" },
    { name: "UI Development", date: "11 - August - 2025", timings: "04:00 PM - 05:00 PM", duration: "3 Months", trainer: "Mr. Bhargav" }
  ];

  const courses = coursesData.map(course => course.name);

  const filteredCourses = coursesData.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.name.toLowerCase().includes(searchLower) ||
      course.date.toLowerCase().includes(searchLower) ||
      course.timings.toLowerCase().includes(searchLower) ||
      course.duration.toLowerCase().includes(searchLower) ||
      course.trainer.toLowerCase().includes(searchLower)
    );
  });

  const handleRegister = (course) => {
    setSelectedCourse(course);
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const RegistrationModal = ({ isOpen, onClose, initialCourse }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      selectedCourse: initialCourse || '',
      programType: '',  // ✅ dropdown
      message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!formData.programType) {
        alert("Please select a Type of option before submitting.");
        return;
      }

      console.log('Form submitted:', formData);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          selectedCourse: '',
          programType: '',
          message: ''
        });
        onClose();
      }, 3000);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>×</button>

          {submitted ? (
            <div className="success-message">
              <h2>Thank You!</h2>
              <p>
                Your registration for the demo of{" "}
                <strong>{formData.selectedCourse}</strong> has been received.
              </p>
              <p>We will contact you shortly at {formData.email}.</p>
            </div>
          ) : (
            <>
              <h2>Register for a Free Demo</h2>
              <p>Fill in your details to register for a demo class</p>

              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="selectedCourse">Select Course *</label>
                  <select
                    id="selectedCourse"
                    name="selectedCourse"
                    value={formData.selectedCourse}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select a Course --</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Required Dropdown for Program Type */}
                {formData.selectedCourse && (
                  <div className="form-group">
                    <label htmlFor="programType">Enrollment Type *</label>
                    <select
                      id="programType"
                      name="programType"
                      value={formData.programType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Training">Training</option>
                      <option value="Internship">Internship</option>
                      <option value="Resume Marketing">Resume Marketing</option>
                      <option value="All of the above">All of the above</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Register for Demo
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="batches-container">
        <h2 className="batches-title">New Batches</h2>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses by name, date, timings, duration or trainer..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
          <div className="search-results-count">
            {filteredCourses.length} of {coursesData.length} courses found
          </div>
        </div>

        <div className="table-wrapper">
          <table className="batches-table">
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
                filteredCourses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.name}</td>
                    <td>{course.date}</td>
                    <td>{course.timings}</td>
                    <td>{course.duration}</td>
                    <td>{course.trainer}</td>
                    <td>
                      <button
                        className="register-btn"
                        onClick={() => handleRegister(course.name)}
                      >
                        Register Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No courses found matching your search. Try different keywords.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrationModal
        isOpen={showRegistration}
        onClose={handleCloseRegistration}
        initialCourse={selectedCourse}
      />
    </>
  );
};

export default NewBatches;
