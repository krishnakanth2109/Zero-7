// File: src/Pages/CurrentHirings.jsx

import React, { useState, useEffect } from 'react'
import api from '../api/axios' // Use your central axios instance
import {
  Briefcase,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Clock,
  Building, // Icon for Industry
} from 'lucide-react'
import './CurrentHirings.css'

const CurrentHirings = () => {
  const [jobPositions, setJobPositions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [applyData, setApplyData] = useState({
    name: '',
    contact: '',
    email: '',
    experience: '',
    currentSalary: '',
    expectedSalary: '',
    location: '',
    resume: '', // This will hold the resume URL string
  })

  const [selectedJobIndex, setSelectedJobIndex] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flippedProcess, setFlippedProcess] = useState([false, false, false])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await api.get('/jobs')
        const sortedJobs = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setJobPositions(sortedJobs)
      } catch (err) {
        console.error('Error fetching job positions:', err)
        setError('Could not load job listings. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const toggleProcess = (i) => {
    setFlippedProcess((s) => s.map((val, index) => (index === i ? !val : val)))
  }

  const handleApplyChange = (e) => {
    const { name, value } = e.target;
    setApplyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const job = jobPositions[selectedJobIndex]
    if (!job || !applyData.resume) {
      alert('Please provide a link to your resume.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...applyData,
      jobId: job._id
    };

    try {
      await api.post('/applications', payload);

      alert(`Application for ${job.role} submitted successfully!`);
      // Reset form
      setApplyData({
        name: '', contact: '', email: '', experience: '',
        currentSalary: '', expectedSalary: '', location: '', resume: '',
      });
      setSelectedJobIndex(null);

    } catch (error) {
      console.error('Application submission error:', error);
      alert('There was an error submitting your application. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysAgo = (dateString) => {
    const posted = new Date(dateString)
    const diffDays = Math.floor((new Date() - posted) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  const latestJob =
    jobPositions.length > 0 ? jobPositions[0] : { role: 'Exciting Roles' }

  const processSteps = [
    { title: 'Step 1: Application', content: 'Fill out the application form with your details and a link to your resume.', icon: '📝', },
    { title: 'Step 2: Screening', content: 'Our recruiters review your profile. Shortlisted candidates get a call.', icon: '🔍', },
    { title: 'Step 3: Interviews & Placement', content: 'Attend technical & HR interviews. We support you through the final placement.', icon: '🎯', },
  ]

  return (
    <div className='current-hirings-page'>
      <div className='ticker-bar'>
        🆕 A new job is posted: <strong>{latestJob.role}</strong>
      </div>

      <section className='hero-section'>
        <img
          src='/current hiring.jpg'
          alt='Hiring Banner'
          className='hero-image'
        />
      </section>

      <div className='job-offer-ticker'>
        <div className='ticker-content'>
          {jobPositions.slice(0, 5).map((job, idx) => (
            <span key={idx} className='ticker-item'>
              🔔 New: {job.role} – {daysAgo(job.createdAt)}
            </span>
          ))}
        </div>
      </div>

      <section className='intro-section'>
        <h2>We are Hiring!</h2>
        <p>
          At Zero7 Technologies, we connect professionals with top companies. Explore our open positions and apply.
        </p>
      </section>

      <section className='process-section'>
        <h2>Our Hiring Process</h2>
        <div className='process-cards' role='list'>
          {processSteps.map((step, i) => (
            <div
              key={i}
              className={`process-card ${flippedProcess[i] ? 'is-flipped' : ''
                }`}
              onClick={() => toggleProcess(i)}
              tabIndex={0}
              role='button'
              aria-pressed={flippedProcess[i]}>
              <div className='process-inner'>
                <div className='process-front'>
                  <div className='process-front-content'>
                    <div className='process-icon' aria-hidden='true'>
                      {step.icon}
                    </div>
                    <h3>{step.title}</h3>
                  </div>
                </div>
                <div className='process-back'>
                  <div className='process-back-content'>
                    <p>{step.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='jobs-section'>
        <h2>Available Job Positions</h2>
        {isLoading && <p style={{ textAlign: 'center' }}>Loading jobs...</p>}
        {error && <p className='error-message'>{error}</p>}
        {!isLoading && !error && (
          <div className='jobs-table-wrap'>
            <table className='jobs-table' role='table'>
              <thead>
                {/* --- ADDED: Industry column header --- */}
                <tr>
                  <th>Posted</th>
                  <th>Role</th>
                  <th>Industry</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Salary</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobPositions.length > 0 ? (
                  jobPositions.map((job, index) => (
                    <React.Fragment key={job._id}>
                      <tr>
                        <td>{daysAgo(job.createdAt)}</td>
                        <td>{job.role}</td>
                        {/* --- ADDED: Industry data cell --- */}
                        <td>{job.industry || 'N/A'}</td>
                        <td>{job.exp}</td>
                        <td>{job.skills}</td>
                        <td>{job.salary}</td>
                        <td>{job.location}</td>
                        <td>
                          <button
                            className='apply-btn'
                            onClick={() =>
                              setSelectedJobIndex(
                                index === selectedJobIndex ? null : index,
                              )
                            }>
                            {selectedJobIndex === index ? 'Close' : 'Apply'}
                          </button>
                        </td>
                      </tr>
                      {selectedJobIndex === index && (
                        <tr className='apply-form-row'>
                          {/* --- UPDATED: Colspan increased to 8 to match new column --- */}
                          <td colSpan='8' className='apply-form-td'>
                            <div className='apply-form-container'>
                              <h3>
                                <Briefcase size={18} /> Apply for {job.role}
                              </h3>
                              <form onSubmit={handleApplySubmit} className='apply-form'>
                                <div className='input-group'>
                                  <User size={16} />
                                  <input type='text' name='name' placeholder='Your Name' value={applyData.name} onChange={handleApplyChange} required pattern='^[A-Za-z\s]{3,}$' title='Name must be at least 3 letters' />
                                </div>

                                <div className='input-group'>
                                  <Phone size={16} />
                                  <input type='tel' name='contact' placeholder='Contact Number' value={applyData.contact} onChange={handleApplyChange} required pattern='^\d{10}$' title='Enter a valid 10-digit phone number' />
                                </div>

                                <div className='input-group'>
                                  <Mail size={16} />
                                  <input type='email' name='email' placeholder='Email Address' value={applyData.email} onChange={handleApplyChange} required pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' title='Enter a valid email address' />
                                </div>

                                <div className='input-group'>
                                  <Clock size={16} />
                                  <input type='text' name='experience' placeholder='Experience (in years)' value={applyData.experience} onChange={handleApplyChange} required pattern='^\d+(\.\d{1,2})?$' title='Enter a valid number of years (e.g., 2 or 2.5)' />
                                </div>

                                <div className='input-group'>
                                  <DollarSign size={16} />
                                  <input type='text' name='currentSalary' placeholder='Current Salary (Optional)' value={applyData.currentSalary} onChange={handleApplyChange} pattern='^\d+(\.\d{1,2})?$' title='Enter a valid salary amount' />
                                </div>

                                <div className='input-group'>
                                  <DollarSign size={16} />
                                  <input type='text' name='expectedSalary' placeholder='Expected Salary (Optional)' value={applyData.expectedSalary} onChange={handleApplyChange} pattern='^\d+(\.\d{1,2})?$' title='Enter a valid salary amount' />
                                </div>

                                <div className='input-group'>
                                  <MapPin size={16} />
                                  <input type='text' name='location' placeholder='Your Location' value={applyData.location} onChange={handleApplyChange} required pattern='^[A-Za-z\s]{2,}$' title='Location must be at least 2 letters' />
                                </div>

                                <div className='input-group'>
                                  <FileText size={16} />
                                  <input type='url' name='resume' placeholder='Paste link to your Resume (e.g., Google Drive)' value={applyData.resume} onChange={handleApplyChange} required pattern='https?://.+' title='Enter a valid URL' />
                                </div>

                                <div className='form-buttons'>
                                  <button type='submit' className='submit-apply' disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                  </button>
                                  <button type='button' className='cancel-btn' onClick={() => setSelectedJobIndex(null)}>
                                    Cancel
                                  </button>
                                </div>
                              </form>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan='8' style={{ textAlign: 'center', padding: '20px' }}>
                      No open positions at this time. Please check back later.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default CurrentHirings