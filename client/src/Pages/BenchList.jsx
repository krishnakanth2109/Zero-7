// File: src/Pages/BenchList.jsx

import React, { useState, useEffect } from 'react'
import api from '../api/axios' 
import Pagination from '../Components/Pagination'
import { FileText, Search, Users, CheckCircle } from 'lucide-react'
import './BenchList.css' 

const BenchList = () => {
  // --- STATE MANAGEMENT ---
  const [showForm, setShowForm] = useState(false)
  const [activeStep, setActiveStep] = useState(null)
  const [stats, setStats] = useState({ candidates: 0, clients: 0, placements: 0 })
  const [openFAQ, setOpenFAQ] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [placed, setPlaced] = useState([])
  
  // New State for Testimonials
  const [testimonials, setTestimonials] = useState([])

  // Form States
  const [requestFormData, setRequestFormData] = useState({
    candidateName: '', companyName: '', website: '', contactPerson: '',
    designation: '', email: '', phone: '', requirementDetails: '',
    numberOfPositions: 1, budget: '', notes: '',
  })
  const [isRequesting, setIsRequesting] = useState(false)

  const [enrollmentFormData, setEnrollmentFormData] = useState({
    name: '', contact: '', email: '', location: '', role: '', skills: '',
  })
  const [isEnrolling, setIsEnrolling] = useState(false)

  // --- VALIDATION HELPER ---
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // --- HANDLERS ---

  const handleEnrollmentChange = (e) => {
    const { name, value } = e.target
    if (name === 'contact') {
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setEnrollmentFormData({ ...enrollmentFormData, [name]: value })
      }
    } else if (['location', 'role', 'skills', 'name'].includes(name)) {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setEnrollmentFormData({ ...enrollmentFormData, [name]: value })
      }
    } else {
      setEnrollmentFormData({ ...enrollmentFormData, [name]: value })
    }
  }

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault()
    
    if (enrollmentFormData.contact.length !== 10) {
      alert('Validation Error: Contact number must be exactly 10 digits.')
      return
    }

    if (!isValidEmail(enrollmentFormData.email)) {
      alert('Validation Error: Please enter a valid email address (e.g., example@domain.com).')
      return
    }

    setIsEnrolling(true)
    try {
      await api.post('/candidate-enrollment', enrollmentFormData)
      alert('Enrollment submitted successfully! Our team will get in touch. ✅')
      setEnrollmentFormData({ name: '', contact: '', email: '', location: '', role: '', skills: '' })
    } catch (error) {
      console.error('Error submitting enrollment:', error)
      alert(`Error: ${error.response?.data?.message || 'Failed to submit.'} ❌`)
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target
    setRequestFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequestSubmit = async (e) => {
    e.preventDefault()

    if (!isValidEmail(requestFormData.email)) {
        alert('Validation Error: Please enter a valid email address.')
        return
    }

    setIsRequesting(true)
    try {
      await api.post('/request-info', { ...requestFormData, candidateName: selectedCandidate.name })
      alert('Request submitted successfully! Our team will get back to you shortly.')
      setSelectedCandidate(null)
      setRequestFormData({ candidateName: '', companyName: '', website: '', contactPerson: '', designation: '', email: '', phone: '', requirementDetails: '', numberOfPositions: 1, budget: '', notes: '' })
    } catch (err) {
      console.error('Failed to submit request:', err)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handlePageChange = (page) => setCurrentPage(page)
  const handleItemsPerPageChange = (items) => { setItemsPerPage(items); setCurrentPage(1) }
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCandidates = candidates.slice(startIndex, startIndex + itemsPerPage)

  // --- API CALLS & EFFECTS ---

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get('/candidates')
        setCandidates(data)
      } catch (error) { console.error('Failed to fetch candidates:', error) }
    }

    // --- UPDATED LOGIC HERE ---
    const fetchPlaced = async () => {
      try {
        const response = await api.get('/interview')
        // STRICT FILTERING: Only show if interviewLevel is 'placed'
        const placedCandidates = response.data.filter(
          (interview) => interview.interviewLevel?.toLowerCase() === 'placed'
        )
        setPlaced(placedCandidates)
      } catch (error) { console.log('Error fetching placed candidates', error) }
    }

    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/testimonials/public')
        setTestimonials(data)
      } catch (error) { console.error('Error fetching testimonials', error) }
    }

    fetchCandidates()
    fetchPlaced()
    fetchTestimonials()

    let c = 0, cl = 0, p = 0
    const interval = setInterval(() => {
      c = Math.min(c + 5, 250); cl = Math.min(cl + 3, 120); p = Math.min(p + 10, 500)
      setStats({ candidates: c, clients: cl, placements: p })
      if (c === 250 && cl === 120 && p === 500) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const faqs = [
    { q: 'What is Bench Marketing?', a: 'Bench marketing helps candidates on the bench find suitable projects quickly by connecting them with clients.' },
    { q: 'How does Resume Marketing work?', a: 'We promote your profile to employers, schedule interviews, and guide you through placements.' },
    { q: 'Is there any fee involved?', a: 'Yes, minimal charges apply for professional services. Contact us for details.' },
    { q: 'How long does it take to get placed?', a: 'On average, candidates get interview calls within 1-3 weeks depending on demand.' },
  ]

  const processSteps = [
    { id: 1, icon: <FileText size={32} />, title: 'Application', text: 'Submit resume & details.' },
    { id: 2, icon: <Search size={32} />, title: 'Screening', text: 'Profile review.' },
    { id: 3, icon: <Users size={32} />, title: 'Interviews', text: 'Technical & HR rounds.' },
    { id: 4, icon: <CheckCircle size={32} />, title: 'Onboarding', text: 'Offer & placement.' }
  ]

  return (
    <div className='bench-page'>
      {/* --- INLINE STYLES --- */}
      <style>{`
        /* --- General Layout --- */
        .bench-page {
            width: 100%;
            overflow-x: hidden;
            background-color: #f9fafb;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* --- Ticker Styles --- */
        .ticker-container { width: 100%; overflow: hidden; background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%); border-bottom: 1px solid #cce0ff; color: #1a5cff; height: 50px; display: flex; align-items: center; }
        .ticker-wrapper { display: flex; white-space: nowrap; animation: ticker-scroll 30s linear infinite; }
        .ticker-item { display: inline-block; padding: 0 2rem; font-size: 1rem; font-weight: 500; }
        .ticker-item strong { color: #0041c2; }
        @keyframes ticker-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

        /* --- HERO SECTION --- */
        .hero-section {
            position: relative;
            width: 100%;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .hero-image {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
        }
        .overlay {
            position: relative;
            z-index: 1;
            text-align: center;
            color: white;
            background: rgba(0,0,0,0.5);
            padding: 40px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .view-openings-btn-hero {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .view-openings-btn-hero:hover { background: #1d4ed8; }

        /* --- STATS SECTION --- */
        .stats-section {
            padding: 80px 20px;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap; 
        }

        .stat-card {
            position: relative;
            width: 320px;
            height: 320px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
            background-size: cover;
            background-position: center;
        }

        .stat-card:hover { transform: translateY(-10px); }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(to bottom, rgba(30, 64, 175, 0.85), rgba(30, 58, 138, 0.95)); 
            z-index: 1;
        }

        .stat-content {
            position: relative;
            z-index: 2;
            height: 100%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-align: center;
        }

        .stat-icon {
            width: 90px; height: 90px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 36px; margin-bottom: 20px;
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 0 15px rgba(255,255,255,0.1);
        }

        .stat-content h2 { font-size: 3.2rem; font-weight: 800; margin: 0 0 10px 0; line-height: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .stat-content p { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin: 0; }

        /* --- CANDIDATES TABLE --- */
        .candidates-section { padding: 40px 20px; text-align: center; background: white; }
        .candidates-section h2 { 
            color: #1a3b8c; 
            font-size: 2rem; 
            margin-bottom: 30px; 
            font-weight: 800; 
            text-transform: uppercase; 
        }
        
        .candidate-table-wrapper { 
            overflow-x: auto; 
            border-radius: 8px; 
            border: 1px solid #e0e0e0;
            max-width: 1200px; 
            margin: 0 auto; 
        }
        
        .candidate-table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white; 
            min-width: 800px; 
        }
        
        .candidate-table thead { 
            background-color: #0d6efd; 
            color: white; 
        }
        
        .candidate-table th { 
            padding: 18px 15px; 
            text-align: left; 
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.5px;
        }

        .candidate-table tbody tr {
            border-bottom: 1px solid #eeeeee;
        }
        
        .candidate-table tbody tr:hover {
            background-color: #f8faff;
        }

        .candidate-table td { 
            padding: 20px 15px; 
            text-align: left; 
            color: #333;
            font-size: 15px;
            vertical-align: middle;
        }
        
        .candidate-table td:nth-child(2) { color: #555; }
        .candidate-table td:nth-child(3) { color: #555; max-width: 300px; }

        .btn-request {
            background-color: #0099ff; 
            color: white;
            padding: 10px 20px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            white-space: nowrap;
            display: inline-block;
            text-align: center;
        }
        
        .btn-request:hover {
            background-color: #0088e0;
        }

        /* --- POPUP FORM INPUT ICONS --- */
        .popup-form .form-group {
            position: relative;
            margin-bottom: 15px;
        }
        
        .popup-form .form-group i.input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
            font-size: 14px;
            pointer-events: none;
            z-index: 10;
        }

        .popup-form .form-group i.input-icon.textarea-icon {
            top: 20px;
            transform: none;
        }

        .popup-form input, 
        .popup-form textarea,
        .popup-form select {
            width: 100%;
            padding: 12px 12px 12px 40px !important;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }

        .popup-form .form-row {
            display: flex;
            gap: 15px;
        }

        .popup-form .form-row .form-group {
            flex: 1;
        }

        /* --- SUCCESS STORIES --- */
        .success-stories-section { padding: 80px 20px; background-color: #f8f9fa; text-align: center; }
        .stories-title { font-size: 2.8rem; font-weight: 700; color: #1a1a2e; font-style: italic; font-family: "Times New Roman", Times, serif; margin-bottom: 10px; }
        .stories-divider { width: 50px; height: 4px; background: #4f46e5; margin: 0 auto 20px auto; border-radius: 2px; }
        .stories-subtitle { color: #6b7280; font-size: 1.1rem; margin-bottom: 60px; }
        .stories-grid { display: flex; justify-content: center; flex-wrap: wrap; gap: 30px; max-width: 1200px; margin: 0 auto; }
        .story-card { background: white; border-radius: 16px; padding: 40px 30px; width: 300px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); display: flex; flex-direction: column; align-items: center; transition: transform 0.3s ease; position: relative; }
        .story-card:hover { transform: translateY(-10px); }
        .story-image-wrapper { position: relative; margin-bottom: 25px; }
        .story-image { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #f3f4f6; }
        .quote-badge { position: absolute; bottom: 0; right: -5px; background: #4f46e5; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; }
        .story-message { font-size: 1rem; line-height: 1.6; color: #374151; font-style: italic; text-align: center; margin-bottom: 30px; flex-grow: 1; }
        .author-name { font-size: 1.1rem; font-weight: 700; color: #2563eb; margin: 0 0 5px 0; }
        .author-role { font-size: 0.9rem; color: #6b7280; margin: 0; }

        /* --- HIRING PROCESS SECTION --- */
        .process-section {
          padding: 80px 20px;
          background-color: #f8fafc;
          text-align: center;
        }

        .process-container {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-top: 50px;
        }

        .process-card {
          background: white;
          border-radius: 24px;
          padding: 40px 30px;
          width: 280px;
          height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
          cursor: pointer;
        }

        .process-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .icon-bubble {
          width: 80px;
          height: 80px;
          background-color: #eff6ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          color: #3b82f6;
          font-size: 32px;
        }

        .process-card h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .process-card p {
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.5;
          margin: 0;
          font-weight: 500;
        }

        @media (max-width: 768px) {
            .stats-section { flex-direction: column; align-items: center; padding: 40px 20px; }
            .stat-card { width: 320px; height: 320px; max-width: 100%; margin-bottom: 20px; }
            .stories-title { font-size: 2rem; }
            .candidate-table td, .candidate-table th { padding: 10px; }
        }
      `}</style>

      {/* --- CONTENT START --- */}

      {placed.length > 0 && (
        <div className='ticker-container'>
          <div className='ticker-wrapper'>
            {placed.concat(placed).map((can, index) => (
              <div className='ticker-item' key={index}>
                🎉 Congratulations! <strong>{can.candidateName}</strong> placed as <strong>{can.jobRole}</strong> ✦
              </div>
            ))}
          </div>
        </div>
      )}

      <section className='hero-section'>
        <img src='./bench-banner.jpg' alt='Bench List Banner' className='hero-image' />
        <div className='overlay'>
          <h1>Zero7 Technologies List</h1>
          <p>Building bridges between ambition and opportunity in the new world of work</p>
          <button className='view-openings-btn-hero' onClick={() => document.querySelector('.candidates-section').scrollIntoView({ behavior: 'smooth' })}>
            View Openings ↓
          </button>
        </div>
      </section>

      {/* --- SQUARE STATS SECTION --- */}
      <section className='stats-section'>
        <div className='stat-card' style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
          <div className='stat-content'>
            <div className='stat-icon'><i className='fa fa-users'></i></div>
            <h2>{stats.candidates}+</h2>
            <p>CANDIDATES AVAILABLE</p>
          </div>
        </div>
        <div className='stat-card' style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
          <div className='stat-content'>
            <div className='stat-icon'><i className='fa fa-briefcase'></i></div>
            <h2>{stats.clients}+</h2>
            <p>CLIENTS SERVED</p>
          </div>
        </div>
        <div className='stat-card' style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
          <div className='stat-content'>
            <div className='stat-icon'><i className='fa fa-trophy'></i></div>
            <h2>{stats.placements}+</h2>
            <p>PLACEMENTS DONE</p>
          </div>
        </div>
      </section>

      {/* --- MAIN CANDIDATE TABLE SECTION --- */}
      <section className='candidates-section'>
        <h2>AVAILABLE CANDIDATES</h2>
        <div className='candidate-table-wrapper'>
          <table className='candidate-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Skills</th>
                <th>Exp</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidates.length > 0 ? paginatedCandidates.map(c => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.role}</td>
                  <td>{c.skills}</td>
                  <td>{c.exp} Yrs</td>
                  <td>{c.location}</td>
                  <td>
                    <button className='btn-request' onClick={() => setSelectedCandidate(c)}>
                      Request Info
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan='6' align='center' style={{padding: '30px'}}>No candidates available.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalItems={candidates.length} 
            itemsPerPage={itemsPerPage} 
            onPageChange={handlePageChange} 
            onItemsPerPageChange={handleItemsPerPageChange} 
            itemsPerPageOptions={[5, 10, 20]} 
          />
        </div>
        
        {/* --- REQUEST INFO POPUP --- */}
        {selectedCandidate && (
          <div className='popup-form-overlay'>
            <div className='popup-form'>
              <h2>Request Info for <strong>{selectedCandidate.name}</strong></h2>
              <form onSubmit={handleRequestSubmit}>
                 <div className='form-group'>
                    <i className="fa fa-building input-icon"></i>
                    <input type='text' name='companyName' placeholder='Company Name' required onChange={handleRequestFormChange} />
                 </div>
                 
                 <div className='form-group'>
                    <i className="fa fa-user input-icon"></i>
                    <input type='text' name='contactPerson' placeholder='Contact Person' required onChange={handleRequestFormChange} />
                 </div>

                 <div className='form-group'>
                    <i className="fa fa-id-card input-icon"></i>
                    <input type='text' name='designation' placeholder='Designation' required onChange={handleRequestFormChange} />
                 </div>

                 <div className='form-group'>
                    <i className="fa fa-envelope input-icon"></i>
                    <input type='email' name='email' placeholder='Email (e.g. user@domain.com)' required onChange={handleRequestFormChange} />
                 </div>

                 <div className='form-group'>
                    <i className="fa fa-phone input-icon"></i>
                    <input type='tel' name='phone' placeholder='Phone' required onChange={handleRequestFormChange} />
                 </div>

                 <div className='form-group'>
                    <i className="fa fa-file-text input-icon textarea-icon"></i>
                    <textarea name='requirementDetails' placeholder='Requirements' required onChange={handleRequestFormChange}></textarea>
                 </div>

                 <div className='form-row'>
                    <div className='form-group'>
                        <i className="fa fa-users input-icon"></i>
                        <input type='number' name='numberOfPositions' placeholder='No. of Positions' required onChange={handleRequestFormChange} />
                    </div>
                    <div className='form-group'>
                        <i className="fa fa-money input-icon"></i>
                        <input type='text' name='budget' placeholder='Budget' onChange={handleRequestFormChange} />
                    </div>
                 </div>

                 <div className='form-actions'>
                    <button type='submit' className='btn-gradient'>Submit</button>
                    <button type='button' className='btn-cancel' onClick={() => setSelectedCandidate(null)}>Cancel</button>
                 </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <section className='extra-section'>
        <h2>Why Choose Our Bench Program?</h2><br />
        <div className='info-cards'>
          <div className='flip-card'><div className='flip-card-inner'><div className='flip-card-front'><img src='/faster.jpg' alt='Faster Hiring' /><h3>Faster Hiring</h3></div><div className='flip-card-back'><p>Carefully evaluated profiles to ensure skills, experience, and job readiness align with employer requirements.</p></div></div></div>
          <div className='flip-card'><div className='flip-card-inner'><div className='flip-card-front'><img src='/trusted.jpg' alt='Trusted Network' /><h3>Trusted Network</h3></div><div className='flip-card-back'><p>Strong partnerships with leading multinational companies to provide trusted hiring and career opportunities.</p></div></div></div>
          <div className='flip-card'><div className='flip-card-inner'><div className='flip-card-front'><img src='/support.jpg' alt='Support' /><h3>End-to-End Support</h3></div><div className='flip-card-back'><p>Career-Focused Placement Process
Structured support to help candidates secure the right job opportunities.</p></div></div></div>
        </div>
      </section>

      {/* --- SUCCESS STORIES SECTION --- */}
      {testimonials.length > 0 && (
        <section className='success-stories-section'>
          <h2 className='stories-title'>SUCCESS STORIES</h2>
          <div className='stories-divider'></div>
          <p className='stories-subtitle'>Hear from our candidates about their experiences</p>
          
          <div className='stories-grid'>
            {testimonials.map((item) => (
              <div className='story-card' key={item._id}>
                <div className='story-image-wrapper'>
                  <img 
                    src={item.image || 'https://via.placeholder.com/80'} 
                    alt={item.name} 
                    className='story-image' 
                  />
                  <div className='quote-badge'>❝</div>
                </div>
                <p className='story-message'>{item.message}</p>
                <div className='story-author'>
                  <h4 className='author-name'>{item.name}</h4>
                  <p className='author-role'>{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className='form-section'>
        <h2>CANDIDATE ENROLLMENT FORM</h2>
        <form onSubmit={handleEnrollmentSubmit} className='enrollment-form'>
          <input name='name' placeholder='Your Name' value={enrollmentFormData.name} onChange={handleEnrollmentChange} required />
          <input name='contact' placeholder='Contact (10 Digits)' value={enrollmentFormData.contact} onChange={handleEnrollmentChange} required maxLength={10} />
          <input name='email' placeholder='Email (e.g. user@domain.com)' value={enrollmentFormData.email} onChange={handleEnrollmentChange} required />
          <input name='location' placeholder='Location' value={enrollmentFormData.location} onChange={handleEnrollmentChange} required />
          <input name='role' placeholder='Role' value={enrollmentFormData.role} onChange={handleEnrollmentChange} required />
          <input name='skills' placeholder='Skills' value={enrollmentFormData.skills} onChange={handleEnrollmentChange} required />
          <button className='bg-blue-500 py-3 px-2 text-white rounded-lg' type='submit' disabled={isEnrolling}>{isEnrolling ? 'Submitting...' : 'Submit'}</button>
        </form>
      </section>

      {/* --- HIRING PROCESS SECTION --- */}
      <section className='process-section'>
        <h2>OUR HIRING PROCESS</h2>
        <div className='process-container'>
          {processSteps.map(step => (
            <div key={step.id} className='process-card' onClick={() => setActiveStep(step.id)}>
              <div className='icon-bubble'>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='faq'>
        <h2>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div className={`faq-item ${openFAQ === i ? 'open' : ''}`} key={i}>
            <button className='faq-question' onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>{f.q} <span>{openFAQ === i ? '−' : '+'}</span></button>
            {openFAQ === i && <div className='faq-answer'><p>{f.a}</p></div>}
          </div>
        ))}
      </section>

      {showForm && (
        <div className='popup-form-overlay'>
          <div className='popup-form'>
            <h2>Connect with Management</h2>
            <form>
              <input type='text' placeholder='Name' required />
              <input type='email' placeholder='Email' required />
              <input type='tel' placeholder='Contact' required />
              <textarea placeholder='Query' required></textarea>
              <div className='form-actions'><button className='btn-gradient'>Submit</button><button type='button' className='btn-secondary' onClick={() => setShowForm(false)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BenchList