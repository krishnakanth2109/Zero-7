import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Ensure this points to your axios instance
import AdminSidebar from '../Components/AdminSidebar';
import { 
  Plus, Edit2, Trash2, CheckCircle, XCircle, Star, Image as ImageIcon 
} from 'lucide-react';
import './ManageTestimonials.css';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
    rating: 5,
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/testimonials');
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '', role: '', message: '', rating: 5, image: '', isActive: true
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleEdit = (testimonial) => {
    setFormData({ ...testimonial });
    setCurrentId(testimonial._id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/testimonials/${currentId}`, formData);
        alert('Story updated successfully!');
      } else {
        await api.post('/testimonials', formData);
        alert('Story added successfully!');
      }
      fetchTestimonials();
      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this story permanently?')) {
      try {
        await api.delete(`/testimonials/${id}`);
        setTestimonials(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const toggleStatus = async (item) => {
    try {
      const updatedStatus = !item.isActive;
      // Optimistic update
      setTestimonials(prev => prev.map(t => 
        t._id === item._id ? { ...t, isActive: updatedStatus } : t
      ));
      await api.put(`/testimonials/${item._id}`, { isActive: updatedStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      fetchTestimonials();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={true} />
      
      <div className="flex-1 overflow-auto p-8">
        <div className="manage-testimonials-container">
          
          {/* --- UI MATCH: Blue Gradient Banner --- */}
          <div className="banner-card">
            <div className="banner-content">
              <h1>MANAGE <br/> TESTIMONIALS</h1>
              <p>Add, edit, or hide success stories from the bench page.</p>
            </div>
            {!showForm && (
              <button className="btn-add-story" onClick={() => setShowForm(true)}>
                <Plus size={18} /> Add New Story
              </button>
            )}
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="testimonial-form-card">
              <h3 className="form-title">
                {isEditing ? 'Edit Story' : 'Create New Story'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Candidate Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Role / Job Title</label>
                    <input type="text" name="role" value={formData.role} onChange={handleInputChange} required placeholder="e.g. Java Developer" />
                  </div>
                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <select name="rating" value={formData.rating} onChange={handleInputChange}>
                      {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Message</label>
                    <textarea name="message" rows="3" value={formData.message} onChange={handleInputChange} required placeholder="Enter the success story..." />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                      <span>Visible on Website</span>
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="btn-save">{isEditing ? 'Update' : 'Save'}</button>
                </div>
              </form>
            </div>
          )}

          {/* Table Section */}
          <div className="table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>MESSAGE</th>
                  <th>RATING</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center p-8">Loading...</td></tr>
                ) : testimonials.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-8">No testimonials found.</td></tr>
                ) : (
                  testimonials.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <div className="user-cell">
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="user-avatar" />
                          ) : (
                            <div className="user-avatar-placeholder"><ImageIcon size={18} /></div>
                          )}
                          <div className="user-info">
                            <span className="user-name">{t.name}</span>
                            <span className="user-role">{t.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="message-cell" title={t.message}>{t.message}</td>
                      <td>
                        <div className="flex text-yellow-400">
                          {[...Array(parseInt(t.rating) || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${t.isActive ? 'active' : 'inactive'}`}>
                          {t.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="action-btn toggle" onClick={() => toggleStatus(t)} title={t.isActive ? "Hide" : "Show"}>
                            {t.isActive ? <CheckCircle size={18} /> : <XCircle size={18} className="text-gray-400"/>}
                          </button>
                          <button className="action-btn edit" onClick={() => handleEdit(t)} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(t._id)} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageTestimonials;