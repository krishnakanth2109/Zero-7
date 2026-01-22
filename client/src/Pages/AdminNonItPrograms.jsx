import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminNonItPrograms.css";

const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}/non-it-programs`;

const AdminNonItPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    title: "",
    icon: "",
    price: "",
    description: "",
    details: "",
    skills: "",
    duration: ""
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

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

  // --- VALIDATION LOGIC ---
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Course Title is required";
    if (!form.price.trim()) newErrors.price = "Price is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.details.trim()) newErrors.details = "Full details are required";
    if (!form.skills.trim()) newErrors.skills = "Skills are required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strict Price Validation: Prevent typing anything except numbers
    if (name === "price") {
      if (!/^\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });

    // Clear error as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return; // Stop if validation fails
    }

    try {
      const payload = { ...form, skills: form.skills.split(",").map(s => s.trim()).filter(s => s) };
      
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        alert("Program updated ✅");
      } else {
        await axios.post(API_URL, payload);
        alert("Program added ✅");
      }
      
      setForm({ title:"", icon:"", price:"", description:"", details:"", skills:"", duration:"" });
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
    setForm({
      title: program.title,
      icon: program.icon,
      price: program.price,
      description: program.description,
      details: program.details || "",
      skills: program.skills.join(", "),
      duration: program.duration
    });
    setErrors({});
    window.scrollTo(0,0);
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

  return (
    <div className="admin-container">
      <h1 className="admin-title">🎓 Admin - Manage Non-IT Programs</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editingId ? "✏️ Edit Program" : "➕ Add Program"}</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <input name="title" placeholder="Course Title" value={form.title} onChange={handleChange} className={errors.title ? "error-input" : ""} />
            {errors.title && <span style={{color: 'red', fontSize: '12px'}}>{errors.title}</span>}
          </div>

          <div className="form-group">
            <input name="icon" placeholder="Icon (Windows Key + .)" value={form.icon} onChange={handleChange} />
          </div>

          <div className="form-group">
            <input name="price" placeholder="Price (Numbers Only)" value={form.price} onChange={handleChange} className={errors.price ? "error-input" : ""} />
            {errors.price && <span style={{color: 'red', fontSize: '12px'}}>{errors.price}</span>}
          </div>

          <div className="form-group">
            <input name="description" placeholder="Short Description" value={form.description} onChange={handleChange} className={errors.description ? "error-input" : ""} />
            {errors.description && <span style={{color: 'red', fontSize: '12px'}}>{errors.description}</span>}
          </div>

          <div className="form-group full-width">
            <textarea name="details" placeholder="Full Details / Learn More Content" value={form.details} onChange={handleChange} rows={4} className={errors.details ? "error-input" : ""} />
            {errors.details && <span style={{color: 'red', fontSize: '12px'}}>{errors.details}</span>}
          </div>

          <div className="form-group">
            <input name="skills" placeholder="Skills Covered (comma separated)" value={form.skills} onChange={handleChange} className={errors.skills ? "error-input" : ""} />
            {errors.skills && <span style={{color: 'red', fontSize: '12px'}}>{errors.skills}</span>}
          </div>

          <div className="form-group">
            <input name="duration" placeholder="Duration (e.g., 4 months)" value={form.duration} onChange={handleChange} className={errors.duration ? "error-input" : ""} />
            {errors.duration && <span style={{color: 'red', fontSize: '12px'}}>{errors.duration}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">{editingId ? "Update Program" : "Add Program"}</button>
      </form>

      <h2 className="section-heading">📚 Existing Programs</h2>
      <div className="programs-grid">
        {programs.map(p => (
          <div key={p._id} className="program-card">
            <div className="program-header">
              <span className="program-icon">{p.icon}</span>
              <h3>{p.title}</h3>
            </div>
            <p className="program-price">₹{p.price}</p>
            <p className="program-desc">{p.description}</p>
            <p className="program-skills"><strong>Skills:</strong> {p.skills.join(", ")}</p>
            <p className="program-duration"><strong>Duration:</strong> {p.duration}</p>
            {p.details && <p className="program-details"><strong>Details:</strong> {p.details}</p>}
            <div className="card-actions">
              <button onClick={() => handleEdit(p)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNonItPrograms;