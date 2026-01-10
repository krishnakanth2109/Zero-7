import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Context from './Context.jsx';
import api from '../api/axios.js';
import heroVideo from '../assets/logo video.mp4'; 

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', number: '', email: '', purpose: '' });
  const [loading, setLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [offer, setOffer] = useState(null);
  const [isOfferVisible, setIsOfferVisible] = useState(false);
  const offerSectionRef = useRef(null);
  const navigate = useNavigate();

  // --- Fetch Data ---
  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      if (Array.isArray(response.data)) {
        setJobPostings(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) { console.error(error); }
  };

  const fetchOffer = async () => {
    try {
      const response = await api.get('/offers/latest');
      setOffer(response.data);
    } catch (error) { console.error(error); }
  };

  const daysAgo = (dateString) => {
    if (!dateString) return '';
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  useEffect(() => { fetchJobs(); fetchOffer(); }, []);

  useEffect(() => {
    if (!offer || !offerSectionRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setIsOfferVisible(true);
    }, { threshold: 0.2 });
    observer.observe(offerSectionRef.current);
    return () => observer.disconnect();
  }, [offer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/forms', formData);
      alert('✅ Form submitted successfully!');
      setShowForm(false);
      setFormData({ name: '', number: '', email: '', purpose: '' });
    } catch (error) { alert('Something went wrong.'); } 
    finally { setLoading(false); }
  };

  const latestJob = jobPostings.length > 0 ? jobPostings[0] : { role: 'Roles' };

  return (
    <div className='home-root w-full overflow-x-hidden bg-white'>
      
      {/* --- TOP TICKER --- */}

{latestJob && (
  <div className='w-full bg-white m-0 p-0 relative z-20 border-0'>
    <div className='ticker-wrap py-1'>
      <div
        key={latestJob._id + Date.now()}   // ⬅️ forces restart
        className='ticker-content text-blue-600 text-xs md:text-sm'
      >
        <span className='mr-12 inline-block'>
          🚀 New: <span className='font-bold'>{latestJob.role}</span> – 
          <span className='text-gray-500'>{daysAgo(latestJob.createdAt)}</span>
        </span>
      </div>
    </div>
  </div>
)}




      {/* --- HERO VIDEO --- */}
      {/* 
         Fixed Video Lines: Added outline-none, border-none, shadow-none.
         Structure: leading-[0] and flex-col remove vertical gaps.
      */}
      <header className='w-full bg-white m-0 p-0 leading-[0] flex flex-col border-0 outline-none'>
        <video
          className='w-full h-auto object-cover block m-0 p-0 align-bottom border-none outline-none shadow-none'
          src={heroVideo} 
          autoPlay
          muted
          loop
          playsInline
        />
      </header>

      {/* --- BOTTOM TICKER --- */}
      {jobPostings.length > 0 && (
        <div className='w-full bg-white m-0 p-0 relative z-20 border-0'>
          <div className='ticker-wrap py-1'>
            <div className='ticker-content text-blue-600 text-xs md:text-sm'>
              {jobPostings.slice(0, 5).map((job) => (
                <span className='mr-12 inline-block' key={job._id}>
                  🚀 New: <span className='font-bold'>{job.role}</span> – <span className='text-gray-500'>{daysAgo(job.createdAt)}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SPECIAL OFFER --- */}
      {offer && (
        <section ref={offerSectionRef} className='py-8 md:py-12 lg:py-24 bg-white overflow-hidden'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
              <div className={`transition-all duration-1000 ${isOfferVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className='text-2xl md:text-4xl font-extrabold text-gray-900 mb-3'>{offer.heading}</h2>
                <p className='text-gray-600'>{offer.paragraph}</p>
                <button onClick={() => navigate('/contact')} className='mt-6 bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform'>
                  Inquire Now
                </button>
              </div>
              <div className={`transition-all duration-1000 delay-200 ${isOfferVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <img src={offer.imageUrl} alt={offer.heading} className='w-full h-auto rounded-2xl shadow-2xl' />
              </div>
            </div>
          </div>
        </section>
      )}

      <Context />

      {/* --- FORM MODAL --- */}
      {showForm && (
        <div className='form-popup'>
          <div className='form-container'>
            <button className='form-close-x' onClick={() => setShowForm(false)}>×</button>
            <h3 className="font-bold text-xl mb-4">Career Consultation Form</h3>
            <form onSubmit={handleSubmit}>
              <input type='text' placeholder='Your Name' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input type='tel' placeholder='Your Number' value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} required />
              <input type='email' placeholder='Your Email' value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <textarea placeholder='Purpose' value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} required></textarea>
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