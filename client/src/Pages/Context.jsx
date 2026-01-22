// File: src/Components/Context.js (or wherever your file is located)

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FaCheckCircle,
  FaRocket,
  FaUserCheck,
  FaBuilding,
  FaChalkboardTeacher,
  FaUsers,
  FaUserTie,
  FaFileAlt,
  FaGraduationCap,
  FaCheck
} from 'react-icons/fa'
import './Context.css'
import teamc from '../assets/teamc.jpg'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export default function Context() {
  // State for popup form
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    purpose: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // State for Placed Candidates Ticker
  const [placed, setPlaced] = useState([])

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${API_URL}/forms`, formData)
      // Reset form
      setFormData({ name: '', number: '', email: '', purpose: '' })
      setShowForm(false)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err) {
      console.error('❌ Error submitting form:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // --- CHANGED LOGIC HERE ---
  useEffect(() => {
    const fetchPlaced = async () => {
      try {
        const res = await axios.get(`${API_URL}/interview`)
        
        // STRICT FILTERING:
        // Only include if the interviewLevel is exactly 'placed'.
        // We removed "|| interview.status === 'placed'" to prevent L1/L2 showing up.
        const placedCandidates = res.data.filter(
          (interview) => interview.interviewLevel?.toLowerCase() === 'placed'
        )
        
        setPlaced(placedCandidates)
      } catch (error) {
        console.error('Error fetching placed candidates', error)
      }
    }
    fetchPlaced()
  }, [])

  // --- STYLES ---
  const checkStyle = { 
    color: '#3b82f6', 
    marginRight: '12px', 
    minWidth: '16px', 
    marginTop: '4px' 
  };

  const iconBoxStyle = {
    backgroundColor: '#e6f0ff',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: '#2563eb',
    fontSize: '1.8rem'
  };

  return (
    <section className='context-wrapper'>
      {/* Internal CSS for Layout and Ticker */}
      <style>{`
        .ticker-container {
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%);
          border-bottom: 1px solid #cce0ff;
          color: #1a5cff;
          height: 50px;
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        .ticker-wrapper {
          display: flex;
          white-space: nowrap;
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-item {
          display: inline-block;
          padding: 0 2rem;
          font-size: 1rem;
          font-weight: 500;
        }
        .ticker-item strong {
          color: #0041c2;
        }
        .ticker-container:hover .ticker-wrapper {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .service-card ul {
            list-style: none;
            padding: 0;
        }
        .service-card ul li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          line-height: 1.5;
          font-size: 0.95rem;
          color: #4b5563;
        }
        .service-card h3 {
            margin-bottom: 1rem;
            color: #1e3a8a;
        }
      `}</style>

      <div className='intro'>
        <h1>Igniting Careers. Empowering Businesses. Transforming Futures.</h1>
        <p className='subheading'>
          At Zero7 Technologies, we're dedicated to bridging the gap between
          talent and opportunity. Founded in 2025, our mission is to empower job
          seekers, professionals with career gaps, and those looking to
          transition into new fields by equipping them with the skills and
          support they need to thrive. We are your all-in-one solution for
          career advancement and talent acquisition.
        </p>
      </div>

      {/* ✅ SCROLLBAR (TICKER) SECTION */}
      {placed.length > 0 && (
        <div className='ticker-container'>
          <div className='ticker-wrapper'>
            {placed.map((can, index) => (
              <div className='ticker-item' key={can._id || index}>
                🎉 Congratulations! <strong>{can.candidateName}</strong> has been
                placed as a <strong>{can.jobRole}</strong> &nbsp;&nbsp;✦
              </div>
            ))}
            {/* Duplicate for seamless looping */}
            {placed.map((can, index) => (
              <div className='ticker-item' key={`dup-${can._id || index}`}>
                🎉 Congratulations! <strong>{can.candidateName}</strong> has been
                placed as a <strong>{can.jobRole}</strong> &nbsp;&nbsp;✦
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Row with Flip Effect */}
      <div className='image-row'>
        <div
          className='flip-card'
          onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <img src={teamc} alt='Team collaboration' />
            </div>
            <div className='flip-card-back'>
              <h3>Team Collaboration</h3>
              <p>
                We believe teamwork is the foundation of success, driving
                creativity and innovation together.
              </p>
            </div>
          </div>
        </div>

        <div
          className='flip-card'
          onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <img src='/training.jpeg' alt='Training session' />
            </div>
            <div className='flip-card-back'>
              <h3>Training Programs</h3>
              <p>
                We provide world-class training sessions to empower individuals
                with new-age skills.
              </p>
            </div>
          </div>
        </div>

        <div
          className='flip-card'
          onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <img src='/growth.jpg' alt='Career growth' />
            </div>
            <div className='flip-card-back'>
              <h3>Career Growth</h3>
              <p>
                We create opportunities for continuous career growth and
                future-ready development.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <br /><br />
      <h2 className='section-title'>What We Offer</h2>
      <br /><br />
      
      {/* Services Section */}
      <div className='service-grid'>
        
        {/* CARD 1 */}
        <div className='service-card'>
          <div style={iconBoxStyle}>
            <FaChalkboardTeacher />
          </div>
          <h3>Industry-Focused Training Programs</h3>
          <ul>
            <li><FaCheck style={checkStyle} /> IT & Non-IT Courses with industry experts</li>
            <li><FaCheck style={checkStyle} /> Hands-on Projects and real-world scenarios</li>
            <li><FaCheck style={checkStyle} /> 100% Placement Support with our partner network</li>
            <li><FaCheck style={checkStyle} /> Certification guidance and exam preparation</li>
            <li><FaCheck style={checkStyle} /> Continuous learning and skill upgrade paths</li>
          </ul>
        </div>

        {/* CARD 2 */}
        <div className='service-card'>
          <div style={iconBoxStyle}>
            <FaUsers />
          </div>
          <h3>Payroll and Staffing Services</h3>
          <ul>
            <li><FaCheck style={checkStyle} /> Hassle-free payroll management for companies of all sizes</li>
            <li><FaCheck style={checkStyle} /> Contractor payment support and compliance management</li>
            <li><FaCheck style={checkStyle} /> Flexible staffing solutions for project-based needs</li>
            <li><FaCheck style={checkStyle} /> Employee benefits administration</li>
            <li><FaCheck style={checkStyle} /> Multi-state payroll tax compliance</li>
          </ul>
        </div>

        {/* CARD 3 */}
        <div className='service-card'>
          <div style={iconBoxStyle}>
            <FaUserTie />
          </div>
          <h3>Job-Ready Support</h3>
          <ul>
            <li><FaCheck style={checkStyle} /> Bench Recruitment for immediate placement</li>
            <li><FaCheck style={checkStyle} /> Resume Marketing to top employers</li>
            <li><FaCheck style={checkStyle} /> Interview Preparation with mock sessions</li>
            <li><FaCheck style={checkStyle} /> Career counseling and path guidance</li>
            <li><FaCheck style={checkStyle} /> Soft skills and communication training</li>
          </ul>
        </div>

        {/* CARD 4 */}
        <div className='service-card'>
          <div style={iconBoxStyle}>
            <FaBuilding />
          </div>
          <h3>Campus Hiring Drives</h3>
          <ul>
            <li><FaCheck style={checkStyle} /> College Collaborations for talent pipeline</li>
            <li><FaCheck style={checkStyle} /> Bulk Hiring Campaigns for large organizations</li>
            <li><FaCheck style={checkStyle} /> Internship-to-Hire Programs for experience and evaluation</li>
            <li><FaCheck style={checkStyle} /> Career fair organization and management</li>
            <li><FaCheck style={checkStyle} /> Industry-academia partnership programs</li>
          </ul>
        </div>

        {/* CARD 5 */}
        <div className='service-card'>
          <div style={iconBoxStyle}>
            <FaFileAlt />
          </div>
          <h3>Resume Marketing Services</h3>
          <ul>
            <li><FaCheck style={checkStyle} /> Professional resume creation tailored to your target roles</li>
            <li><FaCheck style={checkStyle} /> Resume distribution across leading job portals</li>
            <li><FaCheck style={checkStyle} /> Keyword optimization for better ATS visibility</li>
            <li><FaCheck style={checkStyle} /> Customized cover letters for impactful applications</li>
            <li><FaCheck style={checkStyle} /> Personalized guidance to improve job search results</li>
          </ul>
        </div>

        {/* CARD 6 */}
        <div className='service-card'>
          <div style={iconBoxStyle}>
            <FaGraduationCap />
          </div>
          <h3>College Connect</h3>
          <ul>
            <li><FaCheck style={checkStyle} /> Bridging the gap between students and industry opportunities</li>
            <li><FaCheck style={checkStyle} /> Campus recruitment drives and placement support</li>
            <li><FaCheck style={checkStyle} /> Skill development workshops and career guidance</li>
            <li><FaCheck style={checkStyle} /> Internship programs with top companies</li>
            <li><FaCheck style={checkStyle} /> Networking sessions with industry experts</li>
          </ul>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='why-choose-us'>
        <h2 className='section-title'>Why Choose Us</h2>
        <div className='features-grid'>
          <div className='feature-card'>
            <div className='feature-icon'>
              <FaRocket />
            </div>
            <h3>Placement-Driven Approach</h3>
            <ul>
              <li>
                <FaCheckCircle /> Dedicated placement cell
              </li>
              <li>
                <FaCheckCircle /> 300+ recruiter network
              </li>
              <li>
                <FaCheckCircle /> Weekly interview opportunities
              </li>
              <li>
                <FaCheckCircle /> Personalized career roadmap
              </li>
              <li>
                <FaCheckCircle /> Post-placement support
              </li>
            </ul>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FaUserCheck />
            </div>
            <h3>Real-Time Projects & Expert Mentorship</h3>
            <ul>
              <li>
                <FaCheckCircle /> Project-based training
              </li>
              <li>
                <FaCheckCircle /> Corporate trainers with{' '}
              </li>
              <li>
                <FaCheckCircle /> Industry-relevant curriculum
              </li>
              <li>
                <FaCheckCircle /> One-on-one mentorship sessions
              </li>
              <li>
                <FaCheckCircle /> Portfolio development guidance
              </li>
            </ul>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FaBuilding />
            </div>
            <h3>Trusted by Companies & Colleges</h3>
            <ul>
              <li>
                <FaCheckCircle /> Partnerships with 50+ institutions
              </li>
              <li>
                <FaCheckCircle /> Corporate tie-ups across IT & Non-IT
              </li>
              <li>
                <FaCheckCircle /> Proven track record of success
              </li>
              <li>
                <FaCheckCircle /> Industry recognition and awards
              </li>
              <li>
                <FaCheckCircle /> Long-standing reputation
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className='testimonial-section'>
        <h2 className='section-title'>Our Impact</h2>
        <p className='section-subtitle'>
          Hear from our candidates and partners about their experiences
        </p>

        <div className='testimonial-grid'>
          <div className='testimonial-card' style={{ animationDelay: '0.1s' }}>
            <div className='testimonial-image'>
              <img src='https://i.postimg.cc/FKrqsthG/IMG-20251018-131705.jpg' alt='Manikraj' />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                Manikraj, CEO of Eden Software Consulting, brings visionary leadership and deep industry expertise to every project his team undertakes
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Manikraj</span>
                <span className='testimonial-role'>CEO</span>
              </div>
            </div>
          </div>

          <div className='testimonial-card' style={{ animationDelay: '0.2s' }}>
            <div className='testimonial-image'>
              <img src='https://i.postimg.cc/L8bfhLpL/IMG-20251018-132027.jpg' alt='Vindhya' />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                As a hiring manager, I've found their pre-screened candidates to
                be exceptionally well-prepared. It's cut our recruitment time by
                half.
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Vindhya</span>
                <span className='testimonial-role'>HR Director</span>
              </div>
            </div>
          </div>

          <div className='testimonial-card' style={{ animationDelay: '0.3s' }}>
            <div className='testimonial-image'>
              <img
                src='https://i.postimg.cc/L5Sqds3s/IMG-20251018-122137.jpg'
                alt='Arjun Kapoor'
              />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                With the expert guidance of our AI/ML trainer, Sri Devi, students were able to master complex concepts and build real-world projects with confidence.
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Sridevi</span>
                <span className='testimonial-role'>AIML</span>
              </div>
            </div>
          </div>

          <div className='testimonial-card' style={{ animationDelay: '0.3s' }}>
            <div className='testimonial-image'>
              <img
                src='https://i.postimg.cc/CKDLFg13/IMG-20251018-122331.jpg'
                alt='Arjun Kapoor'
              />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                With the expert guidance of our Data Analytics trainer,students developed strong skills in data analysis, visualization, and tools like Excel and SQL.
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Swetha</span>
                <span className='testimonial-role'>Data Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}