// File: src/Pages/AdminDigitalCourses.jsx

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Star, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios'; // Make sure this points to your configured axios instance

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
        // Update existing
        await api.put(`/digital-courses/${currentId}`, formData);
        alert('Course Updated Successfully');
      } else {
        // Create new
        await api.post('/digital-courses', formData);
        alert('Course Added Successfully');
      }
      
      // Reset and Refresh
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
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/digital-courses/${id}`);
        fetchCourses(); // Refresh list
      } catch (error) {
        alert('Error deleting course');
      }
    }
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "#ffc107" : "none"} 
          stroke={i <= rating ? "#ffc107" : "#cbd5e1"} 
        />
      );
    }
    return <div className="d-flex gap-1">{stars}</div>;
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Manage Digital Courses</h2>

      <div className="row">
        {/* Form Section */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 sticky-top" style={{top: '20px', zIndex: 1}}>
            <div className="card-header bg-white">
              <h5 className="mb-0">{isEditing ? 'Edit Course' : 'Add New Course'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Course Heading</label>
                  <input
                    type="text"
                    name="heading"
                    className="form-control"
                    placeholder="e.g. Full Stack Development"
                    value={formData.heading}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Domain (Category)</label>
                  <select 
                    name="domain" 
                    className="form-select"
                    value={formData.domain}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Domain</option>
                    {DOMAIN_OPTIONS.map((domain) => (
                        <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.image && (
                      <div className="mt-2">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px'}} 
                            onError={(e) => e.target.style.display = 'none'}
                          />
                      </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description / Paragraph</label>
                  <textarea
                    name="paragraph"
                    className="form-control"
                    rows="3"
                    placeholder="Course details..."
                    value={formData.paragraph}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating (0 - 5)</label>
                  <input
                    type="number"
                    name="rating"
                    className="form-control"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {isEditing ? 'Update Course' : 'Add Course'}
                </button>
                {isEditing && (
                    <button 
                        type="button" 
                        className="btn btn-secondary w-100 mt-2"
                        onClick={() => {
                            setIsEditing(false);
                            setFormData({ heading: '', domain: '', image: '', paragraph: '', rating: '' });
                            setCurrentId(null);
                        }}
                    >
                        Cancel
                    </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Display List Section */}
        <div className="col-lg-8">
          <div className="row g-4">
            {isLoading ? (
                <div className="col-12 text-center">Loading...</div>
            ) : courses.length === 0 ? (
                <div className="col-12 text-center text-muted">No courses added yet.</div>
            ) : (
                courses.map((course) => (
                <div key={course._id} className="col-md-6">
                    <div className="card h-100 shadow-sm border-0">
                    <div className="position-relative">
                        {course.image ? (
                            <img src={course.image} className="card-img-top" alt={course.heading} style={{height: '200px', objectFit: 'cover'}} />
                        ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                                <ImageIcon size={40} className="text-muted" />
                            </div>
                        )}
                        <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                            <button 
                                className="btn btn-sm btn-light rounded-circle shadow-sm"
                                onClick={() => handleEdit(course)}
                            >
                                <Edit2 size={16} className="text-primary" />
                            </button>
                            <button 
                                className="btn btn-sm btn-light rounded-circle shadow-sm"
                                onClick={() => handleDelete(course._id)}
                            >
                                <Trash2 size={16} className="text-danger" />
                            </button>
                        </div>
                        <div className="position-absolute bottom-0 start-0 p-2">
                            <span className="badge bg-dark">{course.domain}</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0 fw-bold">{course.heading}</h5>
                            <div className="bg-light px-2 py-1 rounded">
                                {renderStars(course.rating)}
                            </div>
                        </div>
                        <p className="card-text text-muted small">{course.paragraph}</p>
                    </div>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}