import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Edit, 
  Trash2, 
  PlusCircle, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Loader2
} from "lucide-react";

const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}/non-it-programs`;

const AdminNonItPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    title: "",
    icon: "",
    description: "",
    details: "",
    skills: "",
    duration: ""
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // --- VALIDATION & HANDLERS ---
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Course Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.details.trim()) newErrors.details = "Full details are required";
    if (!form.skills.trim()) newErrors.skills = "Skills are required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // --- FIRST LETTER CAPITALIZATION ---
    if (["title", "description", "details", "duration", "skills"].includes(name)) {
      if (newValue.length > 0) {
        newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
      }
    }

    setForm({ ...form, [name]: newValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { 
        ...form, 
        skills: form.skills.split(",").map(s => s.trim()).filter(s => s) 
      };
      
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      
      setForm({ title:"", icon:"", description:"", details:"", skills:"", duration:"" });
      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      alert("Error saving program");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setForm({
      title: program.title,
      icon: program.icon,
      description: program.description,
      details: program.details || "",
      skills: program.skills.join(", "),
      duration: program.duration
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <BookOpen size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Non-IT Program Manager</h1>
            <p className="text-gray-500 text-sm">Create and organize specialized training courses</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-10 transition-all max-w-2xl">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              {editingId ? <Edit size={18} /> : <PlusCircle size={18} />}
              {editingId ? "Edit Existing Program" : "Add New Program"}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Course Title</label>
              <input 
                name="title" value={form.title} onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm`}
                placeholder="e.g. Digital Marketing Masterclass"
              />
              {errors.title && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Icon */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Emoji Icon</label>
                <input 
                  name="icon" value={form.icon} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Win + . (e.g. 🎓)"
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Duration</label>
                <input 
                  name="duration" value={form.duration} onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.duration ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                  placeholder="e.g. 3 Months"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Short Description</label>
              <input 
                name="description" value={form.description} onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                placeholder="Briefly explain the course"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Full Learning Content</label>
              <textarea 
                name="details" value={form.details} onChange={handleChange} rows={4}
                className={`w-full px-4 py-3 rounded-xl border ${errors.details ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm`}
                placeholder="Elaborate on course details..."
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Skills Covered (Comma Separated)</label>
              <input 
                name="skills" value={form.skills} onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.skills ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                placeholder="SEO, Content Writing, Ads Management"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : editingId ? "Update Program" : "Create Program"}
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <h2 className="text-lg font-black text-gray-700 mb-6 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle size={20} className="text-green-500" /> Current Offerings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(p => (
            <div key={p._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl border border-gray-100 group-hover:scale-110 transition-transform">
                  {p.icon || "🎓"}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold justify-end uppercase">
                    <Clock size={10} /> {p.duration}
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(p)}
                  className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 py-2 rounded-lg bg-red-50 text-red-500 font-bold text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-20 bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">No programs found. Start by adding one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNonItPrograms;