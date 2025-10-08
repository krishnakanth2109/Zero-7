import React from 'react'
import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/clg-cnt.jpg'
import './CollegeConnect.css'
import './CampusHiring.css' // reuse all CampusHiring styles here
import {
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiClock,
  FiLayers,
  FiMapPin,
  FiFileText,
  FiShield,
} from 'react-icons/fi'

/* ---------------- DATA (moved from CampusHiring) ---------------- */

const colleges = [
  {
    title: 'MoU-based Placement Drives',
    copy: 'Structured, year-round drives with transparent reporting and one-point coordination.',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'MoU-based placement drives',
      'transparent KPIs & reports',
      'single-point coordination',
    ],
    icon: <FiCalendar aria-hidden='true' />,
  },
  {
    title: 'Industry Exposure & Internships',
    copy: 'Capstone projects, internships, and skill bridges designed with hiring teams.',
    img: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'internships & live projects',
      'industry mentoring',
      'assessment to onboarding',
    ],
    icon: <FiLayers aria-hidden='true' />,
  },
  {
    title: 'Corporate Guest Lectures',
    copy: 'Leaders from industry on campus for tools, stacks, and career paths.',
    img: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'corporate guest lectures',
      'latest tools & stacks',
      'career guidance',
    ],
    icon: <FiUsers aria-hidden='true' />,
  },
]

const companies = [
  {
    title: 'Bulk Fresher Hiring',
    copy: 'High-intent batches from target campuses, filtered to your skill matrix.',
    badge: '2–4 week cycle',
    img: '/bulk.jpg',
    icon: <FiBriefcase aria-hidden='true' />,
  },
  {
    title: 'Pre-Screened Student Batches',
    copy: 'Aptitude, coding, and communication screens before interview day.',
    badge: 'ready to deploy',
    img: '/Batches.jpg',
    icon: <FiTrendingUp aria-hidden='true' />,
  },
  {
    title: 'Custom Recruitment Events',
    copy: 'Hackathons, case marathons, and assessment centers.',
    badge: 'tailored events',
    img: '/CRP.jpg',
    icon: <FiCalendar aria-hidden='true' />,
  },
]

const steps = [
  { label: 'campus shortlisting', icon: <FiMapPin aria-hidden='true' /> },
  { label: 'MoU & scheduling', icon: <FiFileText aria-hidden='true' /> },
  {
    label: 'pre-screen & L1 tests',
    icon: <FiCheckCircle aria-hidden='true' />,
  },
  { label: 'interviews & offers', icon: <FiBriefcase aria-hidden='true' /> },
  { label: 'onboarding & MIS', icon: <FiShield aria-hidden='true' /> },
]

const partnerLogos = [
  { alt: 'google', src: 'https://logo.clearbit.com/google.com' },
  { alt: 'microsoft', src: 'https://logo.clearbit.com/microsoft.com' },
  { alt: 'ibm', src: 'https://logo.clearbit.com/ibm.com' },
  { alt: 'amazon', src: 'https://logo.clearbit.com/amazon.com' },
  { alt: 'adobe', src: 'https://logo.clearbit.com/adobe.com' },
  { alt: 'intel', src: 'https://logo.clearbit.com/intel.com' },
  { alt: 'cisco', src: 'https://logo.clearbit.com/cisco.com' },
  { alt: 'shopify', src: 'https://logo.clearbit.com/shopify.com' },
  { alt: 'facebook', src: 'https://logo.clearbit.com/facebook.com' },
  { alt: 'linkedin', src: 'https://logo.clearbit.com/linkedin.com' },
  { alt: 'twitter', src: 'https://logo.clearbit.com/twitter.com' },
  { alt: 'tesla', src: 'https://logo.clearbit.com/tesla.com' },
  { alt: 'uber', src: 'https://logo.clearbit.com/uber.com' },
  { alt: 'airbnb', src: 'https://logo.clearbit.com/airbnb.com' },
  { alt: 'spotify', src: 'https://logo.clearbit.com/spotify.com' },
  { alt: 'netflix', src: 'https://logo.clearbit.com/netflix.com' },
  { alt: 'slack', src: 'https://logo.clearbit.com/slack.com' },
  { alt: 'zoom', src: 'https://logo.clearbit.com/zoom.us' },
  { alt: 'oracle', src: 'https://logo.clearbit.com/oracle.com' },
  { alt: 'paypal', src: 'https://logo.clearbit.com/paypal.com' },
  { alt: 'salesforce', src: 'https://logo.clearbit.com/salesforce.com' },
  { alt: 'sap', src: 'https://logo.clearbit.com/sap.com' },
  { alt: 'dell', src: 'https://logo.clearbit.com/dell.com' },
  { alt: 'hpe', src: 'https://logo.clearbit.com/hpe.com' },
]

/* ---------------- VIEW ---------------- */

const CollegeConnect = () => {
  const navigate = useNavigate()
  const handleContactRedirect = () => navigate('/contact')

  return (
    <div className='college-connect'>
      {/* Hero Section */}
      <section
        className='hero'
        style={{ backgroundImage: `url(${heroImage})` }}>
        <div className='hero-overlay'>
          <h1>Welcome to College Connect</h1>
          <p>Empowering Students with Opportunities for a brighter future.</p>
          <button className='btn-primary'>Get Started</button>
        </div>
      </section>

      {/* About Section */}
      <section className='about'>
        <h2>About College Connect</h2>
        <p>
          College Connect is a platform designed to empower students by
          providing access to internships, training programs, workshops, and
          placement opportunities. We collaborate with colleges and universities
          to create a direct connection between academic learning and industry
          needs.
        </p>
      </section>

      {/* KEY FEATURES */}
      <section className='features'>
        <h2>Key Features</h2>
        <div className='feature-grid'>
          <div className='feature-card'>
            <h3>Internships</h3>
            <p>
              Hands-on opportunities to gain real-world industry experience.
            </p>
          </div>
          <div className='feature-card'>
            <h3>Training Programs</h3>
            <p>Specialized sessions to enhance skills and career readiness.</p>
          </div>
          <div className='feature-card'>
            <h3>Workshops</h3>
            <p>Interactive workshops conducted by industry experts.</p>
          </div>
          <div className='feature-card'>
            <h3>Placements</h3>
            <p>Connecting students with companies for their career growth.</p>
          </div>
        </div>
      </section>

      {/* CAMPUS HIRING CONTENT BELOW */}
      <section
        className='campus-section'
        aria-labelledby='campus-colleges-title'>
        <h2 id='campus-colleges-title' className='campus-section-title'>
          For Colleges
        </h2>
        <div className='campus-card-grid'>
          {colleges.map((c, i) => (
            <article className='campus-card' key={i} aria-label={c.title}>
              <div
                className='campus-card-media'
                role='img'
                aria-label={`${c.title} image`}
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className='campus-card-body'>
                <div className='campus-card-icon'>{c.icon}</div>
                <h3 className='campus-card-title'>{c.title}</h3>
                <p className='campus-card-copy'>{c.copy}</p>
                <ul className='campus-card-checks'>
                  {c.bullets.map((b, j) => (
                    <li key={j}>
                      <FiCheckCircle /> <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a href='#partner' className='campus-link'>
                  Talk to Campus Team →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className='campus-section'
        aria-labelledby='campus-companies-title'>
        <h2 id='campus-companies-title' className='campus-section-title'>
          For Companies
        </h2>
        <div className='campus-card-grid'>
          {companies.map((c, i) => (
            <article className='campus-card' key={i} aria-label={c.title}>
              <div
                className='campus-card-media'
                role='img'
                aria-label={`${c.title} image`}
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className='campus-card-body'>
                <div className='campus-card-top'>
                  <div className='campus-card-icon'>{c.icon}</div>
                  <span className='campus-badge-chip'>{c.badge}</span>
                </div>
                <h3 className='campus-card-title'>{c.title}</h3>
                <p className='campus-card-copy'>{c.copy}</p>
                <a href='#book-drive' className='campus-link'>
                  Request Profiles →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section
        className='campus-process'
        aria-labelledby='campus-process-title'>
        <h2 id='campus-process-title' className='campus-process-title'>
          How a Drive Works
        </h2>
        <ol className='campus-timeline'>
          {steps.map((s, i) => (
            <li key={i} className='campus-timeline-step'>
              <div className='campus-timeline-node'>{s.icon}</div>
              <p className='campus-timeline-label'>{s.label}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* LOGO STRIP */}
      <section className='campus-logos' aria-label='partner company logos'>
        <div className='marquee-viewport'>
          <div className='marquee-track marquee-right'>
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div className='marquee-logo' key={i}>
                <img
                  className='marquee-logo-img'
                  src={logo.src}
                  alt={logo.alt}
                  loading='lazy'
                  decoding='async'
                  referrerPolicy='no-referrer'
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      'https://dummyimage.com/120x36/e9eef6/6b7280.png&text=' +
                      encodeURIComponent(logo.alt)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET CONNECTED */}
      <section className='get-connected'>
        <h2>Get Connected</h2>
        <p>
          Want to collaborate with us? Reach out today and let’s build a future
          together.
        </p>
        <button onClick={handleContactRedirect} className='btn-secondary'>
          Contact Us
        </button>
      </section>

      {/* PROPOSAL FORM */}
      <section className='proposal-form'>
        <h2>College to Company Proposal Form</h2>
        <form>
          <div className='form-group'>
            <label>College Name</label>
            <input type='text' placeholder='Enter your college name' required />
          </div>
          <div className='form-group'>
            <label>Contact Person</label>
            <input
              type='text'
              placeholder='Enter contact person name'
              required
            />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' placeholder='Enter your email' required />
          </div>
          <div className='form-group'>
            <label>Phone</label>
            <input type='tel' placeholder='Enter phone number' required />
          </div>
          <div className='form-group'>
            <label>Proposal Type</label>
            <select required>
              <option value=''>-- Select --</option>
              <option value='placements'>Placements</option>
              <option value='technologies'>Technologies</option>
              <option value='internships'>Internships</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <div className='form-group'>
            <label>Message</label>
            <textarea placeholder='Write your proposal...' required></textarea>
          </div>
          <button type='submit' className='btn-primary'>
            Submit Proposal
          </button>
        </form>
      </section>
    </div>
  )
}

export default CollegeConnect
