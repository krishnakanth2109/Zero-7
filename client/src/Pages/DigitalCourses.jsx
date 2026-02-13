// File: src/Pages/DigitalCourses.jsx

import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import api from '../api/axios'; // Ensure you have your axios instance configured here

const domains = ['Designing', 'DevOps', 'Finance', 'Cloud', 'Management', 'AI', 'Cybersecurity', 'Coding', 'Digital Marketing', 'Data Science'];

const DigitalCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    contact: '', 
    message: '' 
  });

  // --- 1. Fetch Courses from Backend ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/digital-courses');
        
        // Map backend data (heading, paragraph, image) to frontend UI (title, desc, img)
        const formattedData = response.data.map(item => ({
          _id: item._id,
          title: item.heading,
          desc: item.paragraph,
          img: item.image,
          rating: item.rating || 4.5,
          reviews: Math.floor(Math.random() * 500) + 50, 
          // If your backend doesn't have a 'domain' field yet, we default to 'Coding' 
          domain: item.domain || determineDomain(item.heading) || 'Coding'
        }));

        setCourses(formattedData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Helper to guess domain if missing from backend (Optional cosmetic helper)
  const determineDomain = (title) => {
    const t = title.toLowerCase();
    if (t.includes('design')) return 'Designing';
    if (t.includes('finance') || t.includes('payroll')) return 'Finance';
    if (t.includes('marketing')) return 'Digital Marketing';
    if (t.includes('cloud') || t.includes('devops')) return 'DevOps';
    if (t.includes('manager') || t.includes('business')) return 'Management';
    if (t.includes('data') || t.includes('ai')) return 'Data Science';
    if (t.includes('security')) return 'Cybersecurity';
    return 'Coding';
  };

  // --- 2. Filter Logic ---
  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.domain === filter);

  // --- 3. Handle Enrollment Submission ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // FIX 1: Use the correct endpoint '/enrollments' (matches backend enrollments.js)
      // FIX 2: Change 'courseName' to 'course' to match Mongoose Schema
      await api.post('/enrollments', { 
        ...formData, 
        course: selectedCourse.title 
      });
      
      alert(`Enrollment for ${selectedCourse.title} submitted successfully!`);
      setSelectedCourse(null);
      setFormData({ name: '', email: '', contact: '', message: '' });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Something went wrong';
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[450px] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80" alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-5xl md:text-7xl font-bold mb-4 tracking-tight">Explore Our Courses</h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium mb-8">Expert-Led Courses Built For Real-World Success.</p>
          <button 
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-cyan-500 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            Explore Now <span>&rarr;</span>
          </button>
        </div>
      </section>

      {/* --- DOMAIN FILTER SECTION --- */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Preferred Domain......</h2>
          <p className="text-gray-500 mb-10">Select your desired courses below and enjoy while learning...</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setFilter('All')}
              className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all ${filter === 'All' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'}`}
            >
              All
            </button>
            {domains.map((d, i) => (
              <button 
                key={i} 
                onClick={() => setFilter(d)}
                className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all ${filter === d ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- COURSE GRID --- */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-4 text-gray-500">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No courses found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredCourses.map((course) => (
                <div key={course._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="h-48 overflow-hidden bg-gray-50 relative">
                    <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-3">{course.desc}</p>
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(course.rating) ? "text-yellow-400 text-xs" : "text-gray-300 text-xs"} />
                      ))}
                      <span className="text-xs font-bold text-gray-700 ml-1">
                        {course.rating} <span className="text-gray-400 font-normal">({course.reviews})</span>
                      </span>
                    </div>
                    
                    {/* Single Full-Width Enroll Button */}
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="w-full py-2.5 text-sm font-bold border border-gray-200 rounded hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-300"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- ENROLLMENT MODAL --- */}
{selectedCourse && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCourse(null)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            
            <button className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors" onClick={() => setSelectedCourse(null)}>
              <FaTimes className="text-xl" />
            </button>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Enrollment Form</h3>
            <p className="text-gray-500 text-sm mb-6">Course: <span className="text-cyan-600 font-bold">{selectedCourse.title}</span></p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 sm:py-3 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.replace(/[^A-Za-z ]/g, '')})}
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 sm:py-3 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contact Number</label>
                <input 
                  type="text" 
                  maxLength="10"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 sm:py-3 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="10-digit mobile number"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value.replace(/\D/g, '')})}
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Additional Message</label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none placeholder-gray-400" 
                  rows="3"
                  placeholder="Tell us about your requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-cyan-500 text-white py-3 sm:py-3.5 rounded-xl font-bold text-lg hover:bg-cyan-600 shadow-lg shadow-cyan-100 transition-all active:scale-95 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Processing...' : 'Submit Enrollment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCourses;