// File: src/Pages/Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Context from './Context.jsx';
import api from '../api/axios.js';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [formData, setFormData] = useState({ name: '', number: '', email: '', purpose: '' });
  const [loading, setLoading] = useState(false);
  
  // State for the new offer section
  const [offer, setOffer] = useState(null);
  const [isOfferVisible, setIsOfferVisible] = useState(false);
  const offerSectionRef = useRef(null);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      // --- FIX: Ensure the API response is an array to prevent crashes ---
      if (Array.isArray(response.data)) {
        setJobPostings(response.data);
      } else {
        console.error("Jobs API did not return an array:", response.data);
        setJobPostings([]); // Default to an empty array on error
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobPostings([]); // Also default to empty on fetch failure
    }
  };
  
  const fetchOffer = async () => {
    try {
      const response = await api.get('/offers/latest');
      setOffer(response.data);
    } catch (error) {
      console.error("Failed to fetch offer:", error);
    }
  };

  const daysAgo = (dateString) => {
    if (!dateString) return '';
    const posted = new Date(dateString);
    const diffDays = Math.floor((new Date() - posted) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Effect for initial data fetching
  useEffect(() => {
    fetchJobs();
    fetchOffer();
  }, []);

  // --- FIX: Separate useEffect for the Intersection Observer animation ---
  // This effect will run whenever the `offer` state changes from null to having data.
  useEffect(() => {
    if (!offer || !offerSectionRef.current) return; // Don't run if there's no offer or ref yet

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsOfferVisible(true);
          observer.unobserve(entry.target); // Stop observing after animation
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    observer.observe(offerSectionRef.current);

    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, [offer]); // The dependency array ensures this runs when 'offer' data arrives

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/forms', formData);
      alert('✅ Form submitted successfully! Manager will be notified.');
      setShowForm(false);
      setFormData({ name: '', number: '', email: '', purpose: '' });
    } catch (error) {
      console.error('❌ Form submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='home-root'>
      {/* Ticker for the latest job */}
      <div className='bg-white w-screen p-2 overflow-hidden text-blue-500 ticker'>
        <p>
          🔔 A new job is posted:{' '}
          <strong>
            {jobPostings.length > 0 ? jobPostings[0].role : 'Exciting Roles'}
          </strong>
        </p>
      </div>
      
      {/* Hero with background video */}
      <header className='video-hero' role='banner'>
        <video className='hero-video' src='/Logo video.mp4' autoPlay muted loop playsInline />
      </header>
      
      {/* Scrolling Ticker for multiple jobs */}
      <div className='bg-white w-screen p-2 overflow-hidden text-blue-500 ticker'>
        {jobPostings.length > 0 && jobPostings.slice(0, 5).map((job) => (
          <span className='mr-12' key={job._id}>
            🔔 New: {job.role} - {daysAgo(job.createdAt)}
          </span>
        ))}
      </div>

      {/* --- THIS IS THE NEW SPECIAL OFFER SECTION --- */}
      {/* It will now render and animate correctly */}
      {offer && (
        <section ref={offerSectionRef} className="py-16 sm:py-24 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Text Content with slide-in animation */}
              <div className={`transition-all duration-1000 ease-out ${isOfferVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{offer.heading}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{offer.paragraph}</p>
                <button 
                  onClick={() => setShowForm(true)} 
                  className="mt-8 inline-block bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-105"
                >
                  Inquire Now
                </button>
              </div>
              {/* Animated Image with slide-in and rotate animation */}
              <div className={`transition-all duration-1000 ease-out delay-200 ${isOfferVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-3'}`}>
                <div className="relative shadow-2xl rounded-2xl">
                   <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl blur opacity-60"></div>
                   <img 
                    src={offer.imageUrl}
                    alt={offer.heading}
                    className="relative w-full h-auto object-cover rounded-2xl" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Context />

      {/* Popup Form */}
      {showForm && (
        <div className='form-popup' role='dialog' aria-modal='true'>
          <div className='form-container'>
            <button className='form-close-x' aria-label='Close' onClick={() => setShowForm(false)}>×</button>
            <h3>Career Consultation Form</h3>
            <form onSubmit={handleSubmit}>
              <input type='text' name='name' placeholder='Your Name' value={formData.name} onChange={handleChange} required />
              <input type='tel' name='number' placeholder='Your Number' value={formData.number} onChange={handleChange} required />
              <input type='email' name='email' placeholder='Your Email' value={formData.email} onChange={handleChange} required />
              <textarea name='purpose' placeholder='Purpose of Consultation' value={formData.purpose} onChange={handleChange} required></textarea>
              <button type='submit' className='submit-btn' disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
              <button type='button' className='close-btn' onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;