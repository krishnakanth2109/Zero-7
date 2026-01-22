import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminItPrograms.css";

// Use environment variable or fallback to localhost
const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}/it-programs`;

const AdminItPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    title: "",
    icon: "",
    price: "",
    description: "",
    details: "",
    technologies: ""
  });
  const [editingId, setEditingId] = useState(null);
  
  // New state for validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(API_URL);
      setPrograms(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // --- Validation Logic (Updated for ALL fields) ---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // 1. Title Validation
    if (!form.title.trim()) {
      tempErrors.title = "Title is required.";
      isValid = false;
    } else if (form.title.length < 3) {
      tempErrors.title = "Title must be at least 3 characters.";
      isValid = false;
    }

    // 2. Icon Validation
    if (!form.icon.trim()) {
      tempErrors.icon = "Icon is required.";
      isValid = false;
    }

    // 3. Price Validation
    if (!form.price.trim()) {
      tempErrors.price = "Price is required.";
      isValid = false;
    } else if (!/^[0-9$.,\s]+$/.test(form.price)) {
      tempErrors.price = "Invalid price format.";
      isValid = false;
    }

    // 4. Description Validation
    if (!form.description.trim()) {
      tempErrors.description = "Description is required.";
      isValid = false;
    }

    // 5. Details Validation
    if (!form.details.trim()) {
      tempErrors.details = "Details are required.";
      isValid = false;
    }

    // 6. Technologies Validation
    if (!form.technologies.trim()) {
      tempErrors.technologies = "Technologies are required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run Validation before submitting
    if (!validateForm()) {
      return; 
    }

    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(t => t !== "")
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        alert("Program updated ✅");
      } else {
        await axios.post(API_URL, payload);
        alert("Program added ✅");
      }

      // Reset form and errors
      setForm({
        title: "",
        icon: "",
        price: "",
        description: "",
        details: "",
        technologies: ""
      });
      setErrors({});
      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert("Error saving program ❌");
    }
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setErrors({}); // Clear errors when switching to edit mode
    setForm({
      title: program.title,
      icon: program.icon,
      price: program.price,
      description: program.description,
      details: program.details,
      technologies: program.technologies.join(", ")
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Program deleted ✅");
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert("Error deleting program ❌");
    }
  };

  // Helper style for error messages
  const errorStyle = { color: 'red', fontSize: '0.85rem', marginTop: '5px', display: 'block' };

  return (
    <div className="admin-container">
      <h1 className="admin-title">🎓 Admin - Manage IT Programs</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editingId ? "✏️ Edit Program" : "➕ Add Program"}</h2>
        <div className="form-grid">
          
          {/* Title Field */}
          <div className="input-group">
            <input 
              name="title" 
              placeholder="Title *" 
              value={form.title} 
              onChange={handleChange} 
              className={errors.title ? "input-error" : ""}
            />
            {errors.title && <span style={errorStyle}>{errors.title}</span>}
          </div>

          {/* Icon Field */}
          <div className="input-group">
            <input 
              name="icon" 
              placeholder="Icon (Win + .) *" 
              value={form.icon} 
              onChange={handleChange}
              className={errors.icon ? "input-error" : ""}
            />
            {errors.icon && <span style={errorStyle}>{errors.icon}</span>}
          </div>

          {/* Price Field */}
          <div className="input-group">
            <input 
              name="price" 
              placeholder="Price *" 
              value={form.price} 
              onChange={handleChange} 
              className={errors.price ? "input-error" : ""}
            />
            {errors.price && <span style={errorStyle}>{errors.price}</span>}
          </div>

          {/* Description Field */}
          <div className="input-group">
            <input 
              name="description" 
              placeholder="Short Description *" 
              value={form.description} 
              onChange={handleChange} 
              className={errors.description ? "input-error" : ""}
            />
            {errors.description && <span style={errorStyle}>{errors.description}</span>}
          </div>

          {/* Details Field (Textarea) */}
          <div className="input-group full-width">
            <textarea 
              name="details" 
              placeholder="Details *" 
              value={form.details} 
              onChange={handleChange}
              className={errors.details ? "input-error" : ""}
            ></textarea>
            {errors.details && <span style={errorStyle}>{errors.details}</span>}
          </div>

          {/* Technologies Field */}
          <div className="input-group full-width">
            <input 
              name="technologies" 
              placeholder="Technologies (comma separated) *" 
              value={form.technologies} 
              onChange={handleChange} 
              className={errors.technologies ? "input-error" : ""}
            />
            {errors.technologies && <span style={errorStyle}>{errors.technologies}</span>}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Program" : "Add Program"}
        </button>
      </form>

      {/* Programs List */}
      <h2 className="section-heading">📚 Existing Programs</h2>
      <div className="programs-grid">
        {programs.map((p) => (
          <div key={p._id} className="program-card">
            <div className="program-header">
              <span className="program-icon">{p.icon}</span>
              <h3>{p.title}</h3>
            </div>
            <p className="program-price">{p.price}</p>
            <p className="program-desc">{p.description}</p>
            <p className="program-tech">
              <strong>Tech:</strong> {p.technologies.join(", ")}
            </p>
            <div className="card-actions">
              <button onClick={() => handleEdit(p)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="btn btn-secondary">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminItPrograms;