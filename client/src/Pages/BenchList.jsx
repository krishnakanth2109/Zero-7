// File: src/Pages/BenchList.jsx

import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import './BenchList.css'

const BenchList = () => {
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState({
    candidates: 0,
    clients: 0,
    placements: 0,
  })
  const [openFAQ, setOpenFAQ] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidates, setCandidates] = useState([]) // Initialize as empty array

  // --- START: NEW STATE FOR REQUEST INFO FORM ---
  const [requestFormData, setRequestFormData] = useState({
      candidateName: '',
      companyName: '',
      website: '',
      contactPerson: '',
      designation: '',
      email: '',
      phone: '',
      requirementDetails: '',
      numberOfPositions: 1, // Matches the model field `numberOfPositions`
      budget: '',
      notes: '', // Matches the model field `notes`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- END: NEW STATE ---

  // 👇 Enrollment form state
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    location: '',
    resume: '',
  })

  // Enrollment form handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const GOOGLE_SHEETS_URL =
    'https://script.google.com/macros/s/AKfycbzgsGoKMXRNJimjZpClBYG-d1kq4ylpyqucOkYjcpM38UqvfGvgpO1D3Zk_xV0RawJi/exec' // replace with your script URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    let endPoint = '/enrollments/'
    const url = process.env.REACT_APP_API_URL
      ? `${process.env.REACT_APP_API_URL}${endPoint}`
      : `http://localhost:5000/api${endPoint}`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
    await fetch(url, options)
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      alert('Enrollment submitted successfully ✅')
      setFormData({
        name: '',
        contact: '',
        email: '',
        location: '',
        resume: '',
      })
    } catch (error) {
      console.error('Error submitting enrollment:', error)
      alert('Failed to submit enrollment ❌')
    }
  }
  
  // --- START: NEW HANDLERS FOR REQUEST INFO FORM ---
  const handleRequestFormChange = (e) => {
      const { name, value } = e.target;
      setRequestFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          // Combine form data with the selected candidate's name
          const payload = { 
              ...requestFormData, 
              candidateName: selectedCandidate.name 
          };

          // Send data to the backend API
          await api.post('/request-info', payload);
          
          alert('Request submitted successfully! Our team will get back to you shortly.');
          
          // Close modal and reset form
          setSelectedCandidate(null);
          setRequestFormData({
              candidateName: '', companyName: '', website: '', contactPerson: '',
              designation: '', email: '', phone: '', requirementDetails: '',
              numberOfPositions: 1, budget: '', notes: '',
          });

      } catch (err) {
          console.error("Failed to submit request:", err);
          alert("There was an error submitting your request. Please try again.");
      } finally {
          setIsSubmitting(false);
      }
  };
  // --- END: NEW HANDLERS ---

  const testimonials = [
    { name: 'Ramesh - HR Manager', text: 'Zero7 helped us find quality candidates in record time. Excellent service!', img: 'https://randomuser.me/api/portraits/men/32.jpg', },
    { name: 'Priya - Placed Candidate', text: 'The resume marketing service worked for me. I got interviews within a week!', img: 'https://randomuser.me/api/portraits/women/45.jpg', },
    { name: 'Sandeep - Client', text: 'Professional team, transparent process, and great support. Highly recommend.', img: 'https://randomuser.me/api/portraits/men/46.jpg', },
  ]

  const faqs = [
    { q: 'What is Bench Marketing?', a: 'Bench marketing helps candidates on the bench find suitable projects quickly by connecting them with clients.', },
    { q: 'How does Resume Marketing work?', a: 'We promote your profile to employers, schedule interviews, and guide you through placements.', },
    { q: 'Is there any fee involved?', a: 'Yes, minimal charges apply for professional services. Contact us for details.', },
    { q: 'How long does it take to get placed?', a: 'On average, candidates get interview calls within 1-3 weeks depending on demand.', },
  ]

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get('/candidates')
        setCandidates(data)
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      }
    }
    fetchCandidates()
    let c = 0, cl = 0, p = 0
    const interval = setInterval(() => {
      if (c < 250) c++
      if (cl < 120) cl++
      if (p < 500) p++
      setStats({ candidates: c, clients: cl, placements: p })
      if (c === 250 && cl === 120 && p === 500) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='bench-page'>
      {/* Hero Section */}
      <section className='hero-section'>
        <img src='./bench-banner.jpg' alt='Bench List Banner' className='hero-image'/>
        <div className='overlay '>
          <h1>Zero7 Bench List</h1>
          <p>Connecting skilled professionals with top MNCs – explore our available talent today!</p>
        </div>
      </section>

      {/* Candidate Enrollment Form */}
      <section className='form-section'>
        <h2>Candidate Enrollment Form</h2>
        <form onSubmit={handleSubmit} className='enrollment-form'>
          <input type='text' name='name' placeholder='Your Name' value={formData.name} onChange={handleChange} required />
          <input type='tel' name='contact' placeholder='Contact Number' value={formData.contact} onChange={handleChange} required />
          <input type='email' name='email' placeholder='Email Address' value={formData.email} onChange={handleChange} required />
          <input type='text' name='location' placeholder='Your Location' value={formData.location} onChange={handleChange} required />
          <input type='text' name='resume' placeholder='Give your Resume link' value={formData.resume} onChange={handleChange} required />
          <button className='bg-blue-500 py-3 px-2 text-white' type='submit'>Submit</button>
        </form>
      </section>

      {/* Stats */}
      <section className='stats-section'>
        <div className='stat-card'><h2>{stats.candidates}+</h2><p>Candidates Available</p></div>
        <div className='stat-card'><h2>{stats.clients}+</h2><p>Clients Served</p></div>
        <div className='stat-card'><h2>{stats.placements}+</h2><p>Placements Done</p></div>
      </section>

      {/* Candidate List */}
      <section className='candidates-section'>
        <h2>Available Candidates</h2>
        <div className='candidate-table-wrapper'>
          <table className='candidate-table'>
            <thead>
              <tr>
                <th>Name</th><th>Role</th><th>Skills</th><th>Experience</th><th>Location</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                  <tr key={c._id}> {/* Use _id from MongoDB */}
                    <td title={c.name}>{c.name}</td>
                    <td title={c.role}>{c.role}</td>
                    <td>{c.skills}</td>
                    <td>{c.exp}</td>
                    <td>{c.location}</td>
                    <td>
                      <button className='btn-gradient' onClick={() => setSelectedCandidate(c)}>
                        Request Info
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* --- MODIFIED: Popup form for requesting candidate info --- */}
        {selectedCandidate && (
          <div className='popup-form-overlay'>
            <div className='popup-form'>
              <h2>Request Info for <strong style={{color: '#0d47a1'}}>{selectedCandidate.name}</strong></h2>
              <p>Please provide your company details to proceed.</p>

              {/* UPDATED a FORM to call the new submission handler */}
              <form onSubmit={handleRequestSubmit}>
                <div className='form-group'>
                  <i className='fa fa-building'></i>
                  <input type='text' name='companyName' placeholder='Company Name' required value={requestFormData.companyName} onChange={handleRequestFormChange} />
                </div>
                <div className='form-group'>
                  <i className='fa fa-globe'></i>
                  <input type='url' name='website' placeholder='Website / LinkedIn Profile (optional)' value={requestFormData.website} onChange={handleRequestFormChange} />
                </div>
                <div className='form-group'>
                  <i className='fa fa-user'></i>
                  <input type='text' name='contactPerson' placeholder='Contact Person Name' required value={requestFormData.contactPerson} onChange={handleRequestFormChange} />
                </div>
                <div className='form-group'>
                  <i className='fa fa-id-badge'></i>
                  <input type='text' name='designation' placeholder='Designation / Role' required value={requestFormData.designation} onChange={handleRequestFormChange} />
                </div>
                <div className='form-group'>
                  <i className='fa fa-envelope'></i>
                  <input type='email' name='email' placeholder='Official Email ID' required value={requestFormData.email} onChange={handleRequestFormChange} />
                </div>
                <div className='form-group'>
                  <i className='fa fa-phone'></i>
                  <input type='tel' name='phone' placeholder='Phone Number (with WhatsApp)' required value={requestFormData.phone} onChange={handleRequestFormChange} />
                </div>
                <textarea name='requirementDetails' placeholder='Requirement Details: Skills, Job Location, Mode, etc.' rows='3' required value={requestFormData.requirementDetails} onChange={handleRequestFormChange}></textarea>
                <div className='form-row'>
                  {/* Note the name change to match the model */}
                  <input type='number' name='numberOfPositions' placeholder='Number of Positions' required value={requestFormData.numberOfPositions} onChange={handleRequestFormChange} />
                  <input type='text' name='budget' placeholder='Budget / CTC Range (optional)' value={requestFormData.budget} onChange={handleRequestFormChange} />
                </div>
                {/* Note the name change to match the model */}
                <textarea name='notes' placeholder='Additional Notes / Comments (optional)' rows='2' value={requestFormData.notes} onChange={handleRequestFormChange}></textarea>
                <label className='checkbox'>
                  <input type='checkbox' required /> I confirm the details are correct and for genuine hiring purposes.
                </label>
                <div className='form-actions'>
                  <button type='submit' className='btn-gradient' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button type='button' className='btn-cancel' onClick={() => setSelectedCandidate(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Info Flip Cards */}
      <section className='extra-section'>
        <h2>Why Choose Our Bench Program?</h2>
        <div className='info-cards'>
          <div className='flip-card'><div className='flip-card-inner'><div className='flip-card-front'><img src='/faster.jpg' alt='Faster Hiring' /><h3>Faster Hiring</h3></div><div className='flip-card-back'><p>Our candidates are pre-screened, ensuring clients save time in recruitment.</p></div></div></div>
          <div className='flip-card'><div className='flip-card-inner'><div className='flip-card-front'><img src='/trusted.jpg' alt='Trusted Network' /><h3>Trusted Network</h3></div><div className='flip-card-back'><p>Strong tie-ups with MNCs and startups to connect talent with opportunity.</p></div></div></div>
          <div className='flip-card'><div className='flip-card-inner'><div className='flip-card-front'><img src='/support.jpg' alt='Support' /><h3>End-to-End Support</h3></div><div className='flip-card-back'><p>From resume marketing to interview prep, we guide you at every step.</p></div></div></div>
        </div>
      </section>

      {/* Process */}
      <section className='process-section'>
        <h2>How Our Bench Process Works</h2>
        <div className='process-steps'>
          <div className='process-card'><h3>Step 1</h3><p>Candidate registers with Zero7 Bench Program.</p></div>
          <div className='process-card'><h3>Step 2</h3><p>Our team markets resumes to potential clients.</p></div>
          <div className='process-card'><h3>Step 3</h3><p>Interviews scheduled with top companies.</p></div>
          <div className='process-card'><h3>Step 4</h3><p>Candidate gets placed with full support from our team.</p></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='testimonials'>
        <h2>What Our Clients & Students Say</h2>
        <div className='testimonial-cards'>
          {testimonials.map((t, i) => (<div className='testimonial-card' key={i}><img src={t.img} alt={t.name} className='testimonial-img' /><p>"{t.text}"</p><h4>- {t.name}</h4></div>))}
        </div>
      </section>

      {/* FAQ */}
      <section className='faq'>
        <h2>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (<div className={`faq-item ${openFAQ === i ? 'open' : ''}`} key={i}><button className='faq-question' onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>{f.q} <span>{openFAQ === i ? '−' : '+'}</span></button><div className='faq-answer'><p>{f.a}</p></div></div>))}
      </section>

      {/* Popup Registration Form for management */}
      {showForm && (
        <div className='popup-form-overlay'>
          <div className='popup-form'>
            <h2>Connect with Management</h2>
            <form>
              <input type='text' placeholder='Your Name' required />
              <input type='email' placeholder='Your Email' required />
              <input type='tel' placeholder='Your Contact Number' required />
              <textarea placeholder='Your Query / Purpose' required></textarea>
              <div className='form-actions'>
                <button type='submit' className='btn-gradient'>Submit</button>
                <button type='button' onClick={() => setShowForm(false)} className='btn-secondary'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BenchList