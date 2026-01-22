import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Contact.css'

const Contact = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    const newErrors = {}
    const nameRegex = /^[A-Za-z\s]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // 1. Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = 'Name should only contain letters'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    // 2. Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // 3. Service Validation
    if (!formData.service) {
      newErrors.service = 'Please select a service'
    }

    // 4. Message Validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    // Return true if no errors
    return Object.keys(newErrors).length === 0
  }

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target

    // Specific logic for name input to prevent numbers while typing
    if (name === 'name') {
      const cleaned = value.replace(/[^A-Za-z\s]/g, '')
      setFormData({ ...formData, [name]: cleaned })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Run Validation
    if (!validateForm()) {
      return // Stop submission if errors exist
    }

    setIsSubmitting(true)
    setStatusMessage('Sending your message...')

    try {
      await axios.post(`${API_URL}/contact-inquiries`, formData)
      setStatusMessage('Thank you! We will get back to you soon.')
      setFormData({ name: '', email: '', service: '', message: '' })
      setErrors({}) // Clear any residual errors
      setTimeout(() => setStatusMessage(''), 5000)
    } catch (error) {
      console.error('Error:', error)
      setStatusMessage('An error occurred. Please try again later.')
      setTimeout(() => setStatusMessage(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='contact-wrapper'>
      <div className='contact-header'>
        <h1>Let’s Connect</h1>
        <div className='header-line'></div>
        <p>We’d love to hear from you. Reach out anytime.</p>
      </div>

      <div className='contact-grid'>
        {/* LEFT CARD - Contact Details */}
        <div className='contact-card'>
          <h2>Contact Details</h2>
          <div className='card-line'></div>

          <div className='contact-rows-container'>
            <div className='contact-row'>
              <div className='icon-box'>
                <i className='fas fa-phone'></i>
              </div>
              <div className='row-text'>
                <span>6304244117 / 89198 01095</span>
              </div>
            </div>

            <div className='contact-row'>
              <div className='icon-box'>
                <i className='fas fa-envelope'></i>
              </div>
              <div className='row-text'>
                <span>info@zero7technologies.com</span>
              </div>
            </div>

            <div className='contact-row'>
              <div className='icon-box'>
                <i className='fas fa-map-marker-alt'></i>
              </div>
              <div className='row-text'>
                <span>
                  Ground Floor Shanmukha Empires, 83 Ayyappa Society Main Road,
                  Madhapur, Hyderabad, Telangana
                </span>
              </div>
            </div>
          </div>

          <div className='map-box'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237.89256318873484!2d78.39182793785751!3d17.44625912878081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa7477a72b9083c7f%3A0xb5e513691e0dc3d9!2sZero7%20Technologies!5e0!3m2!1sen!2sin!4v1766383432242!5m2!1sen!2sin'
              loading='lazy'
              title='Zero7 Location'></iframe>
          </div>
        </div>

        {/* RIGHT CARD - Form */}
        <div className='form-card'>
          <h2>Quick Inquiry</h2>
          <div className='card-line'></div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className='input-group'>
              <input
                type='text'
                name='name'
                placeholder='Your Name'
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className='input-group'>
              <input
                type='email'
                name='email'
                placeholder='Your Email'
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Service Selection */}
            <div className='input-group'>
              <select
                name='service'
                value={formData.service}
                onChange={handleChange}
                className={errors.service ? 'input-error' : ''}
              >
                <option value=''>Select Service</option>
                <option value='Training'>Training</option>
                <option value='Payroll Services'>Payroll Services</option>
                <option value='Resume Marketing'>Resume Marketing</option>
                <option value='Campus Hiring'>Campus Hiring</option>
              </select>
              {errors.service && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.service}
                </span>
              )}
            </div>

            {/* Message Field */}
            <div className='input-group'>
              <textarea
                rows='4'
                name='message'
                placeholder='Your Message'
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'input-error' : ''}
              />
              {errors.message && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.message}
                </span>
              )}
            </div>

            <button type='submit' className='submit-btn' disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {statusMessage && <p className='status' style={{ marginTop: '15px' }}>{statusMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact