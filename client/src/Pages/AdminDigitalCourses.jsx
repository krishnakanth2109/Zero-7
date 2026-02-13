// File: src/Pages/AdminDigitalCourses.jsx

import React, { useState, useEffect } from 'react';
import { 
  Edit2, Trash2, Star, Image as ImageIcon, 
  Plus, Save, X, Loader2, BookOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; 

// Domains matching your public page filters
const DOMAIN_OPTIONS = ['Designing', 'DevOps', 'Finance', 'Cloud', 'Management', 'AI', 'Cybersecurity', 'Coding', 'Digital Marketing', 'Data Science'];

export default function AdminDigitalCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    heading: '',
    domain: '',
    image: '',
    paragraph: '',
    rating: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // --- Fetch Data ---
  const fetchCourses = async () => {
    try {
      const res = await api.get('/digital-courses');
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/digital-courses/${currentId}`, formData);
        alert('Course Updated Successfully');
      } else {
        await api.post('/digital-courses', formData);
        alert('Course Added Successfully');
      }
      
      setFormData({ heading: '', domain: '', image: '', paragraph: '', rating: '' });
      setIsEditing(false);
      setCurrentId(null);
      fetchCourses();
    } catch (error) {
      alert('Error saving course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (course) => {
    setFormData({
        heading: course.heading,
        domain: course.domain || '',
        image: course.image,
        paragraph: course.paragraph,
        rating: course.rating
    });
    setIsEditing(true);
    setCurrentId(course._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/digital-courses/${id}`);
        fetchCourses(); 
      } catch (error) {
        alert('Error deleting course');
      }
    }
  };

  // --- UI Helpers ---
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star 
            key={i} 
            size={14} 
            className={`${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Digital Courses</h1>
            <p className="text-slate-500 mt-1">Manage your educational content and resources.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-semibold text-slate-600 flex items-center gap-2">
            <BookOpen size={16} className="text-blue-600" />
            <span>Total Courses: {courses.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: Sticky Form --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  {isEditing ? <Edit2 size={18} className="text-blue-400"/> : <Plus size={18} className="text-green-400"/>}
                  {isEditing ? 'Edit Course' : 'Create Course'}
                </h3>
                {isEditing && (
                  <button 
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({ heading: '', domain: '', image: '', paragraph: '', rating: '' });
                        setCurrentId(null);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Heading Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Heading</label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    placeholder="e.g. Full Stack Mastery"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Domain Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Domain</label>
                  <div className="relative">
                    <select 
                      name="domain" 
                      value={formData.domain}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {DOMAIN_OPTIONS.map((domain) => (
                          <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Image URL & Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                  <AnimatePresence>
                    {formData.image && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Preview</p>
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    name="paragraph"
                    value={formData.paragraph}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the course curriculum..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rating (0-5)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                    <div className="shrink-0 text-yellow-500">
                       <Star size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isEditing 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30" 
                    : "bg-slate-900 hover:bg-slate-800 hover:shadow-slate-500/30"
                  }`}
                >
                  {isEditing ? <><Save size={18}/> Update Course</> : <><Plus size={18}/> Add Course</>}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: List Display --- */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
                <p className="font-medium animate-pulse">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="h-96 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen size={32} />
                </div>
                <p className="text-lg font-bold text-slate-600">No courses available</p>
                <p className="text-sm">Use the form to add your first course.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                {courses.map((course, index) => (
                  <motion.div 
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col overflow-hidden relative"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {course.image ? (
                        <img 
                            src={course.image} 
                            alt={course.heading} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={48} />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Domain Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm z-10">
                        {course.domain}
                      </div>

                      {/* Action Buttons (Floating) */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button 
                            onClick={() => handleEdit(course)}
                            className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => handleDelete(course._id)}
                            className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {course.heading}
                        </h4>
                      </div>
                      
                      <div className="mb-4">
                        {renderStars(course.rating)}
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {course.paragraph}
                      </p>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400">
                     
                         <span className="text-slate-900 bg-slate-100 px-2 py-1 rounded">Rating: {course.rating}/5</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}