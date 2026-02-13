import React, { useState, useEffect, useRef } from 'react';
import {
  Edit, Trash2, FileSpreadsheet, FileUp, PlusCircle, X, Loader2, Users, 
  ChevronLeft, ChevronRight, Search 
} from 'lucide-react';
import api from '../api/axios';
import Cookie from 'js-cookie';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// --- Validation Function ---
const validateForm = (data) => {
  const errors = {};
  const namePattern = /^[A-Za-z\s]+$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  const phonePattern = /^[0-9]{10}$/;
  const expPattern = /^\d{1,2}(\.\d+)?$/;

  if (!data.name || !data.name.trim()) errors.name = 'First Name is required.';
  else if (!namePattern.test(data.name.trim())) errors.name = 'Alphabets only.';

  if (!data.surname || !data.surname.trim()) errors.surname = 'Surname is required.';
  else if (!namePattern.test(data.surname.trim())) errors.surname = 'Alphabets only.';

  if (!data.role || !data.role.trim()) errors.role = 'Role is required.';
  if (!data.skills || !data.skills.trim()) errors.skills = 'Skills are required.';

  if (data.exp === '' || data.exp === null) {
    errors.exp = 'Experience is required.';
  } else {
    const val = parseFloat(data.exp);
    if (isNaN(val) || val < 0) errors.exp = 'Must be a positive number.';
    else if (val > 99) errors.exp = 'Max experience is 99 years.';
    else if (!expPattern.test(data.exp)) errors.exp = 'Invalid format.';
  }

  if (!data.location || !data.location.trim()) errors.location = 'Location is required.';
  if (!data.email || !data.email.trim()) errors.email = 'Email is required.';
  else if (!emailPattern.test(data.email.trim())) errors.email = 'Enter a valid email address.';

  if (!data.phone) errors.phone = 'Phone is required.';
  else if (!phonePattern.test(data.phone)) errors.phone = 'Must be exactly 10 digits.';

  return errors;
};

export default function AdminManageCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    userId: '', name: '', surname: '', role: '', skills: '', exp: '', location: '', email: '', phone: '',
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [importing, setImporting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const fileInputRef = useRef(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/candidates/');
      setCandidates(data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      MySwal.fire('Error', 'Failed to load candidates.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = Cookie.get('user');
    if (data) {
      const res = JSON.parse(data);
      setUserId(res.id);
    }
    fetchCandidates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Regex Constraints
    if (name === 'name' || name === 'surname') newValue = value.replace(/[^A-Za-z\s]/g, '');
    if (name === 'phone') newValue = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'exp') {
      if (value > 99) newValue = 99;
      if (value < 0) newValue = 0;
    }

    // Capitalize First Letter Logic (Name, Surname, Role, Location)
    if (['name', 'surname', 'role', 'location'].includes(name) && newValue.length > 0) {
        newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
    }

    setFormData({ ...formData, [name]: newValue });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validateForm(formData);
    if (validationErrors[name]) setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ userId, name: '', surname: '', role: '', skills: '', exp: '', location: '', email: '', phone: '' });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (candidate) => {
    setFormData({ ...candidate });
    setEditingId(candidate._id);
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/candidates/${editingId}`, formData);
        MySwal.fire({ icon: 'success', title: 'Updated!', text: 'Candidate updated successfully.', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/candidates', formData);
        MySwal.fire({ icon: 'success', title: 'Added!', text: 'Candidate added successfully.', timer: 1500, showConfirmButton: false });
      }
      setShowModal(false);
      fetchCandidates();
    } catch (error) {
      MySwal.fire('Error', error.response?.data?.message || 'Failed to save candidate.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        try {
          await api.delete(`/candidates/${id}`);
          fetchCandidates();
          MySwal.fire('Deleted!', 'Candidate removed.', 'success');
        } catch (error) { MySwal.fire('Error', 'Delete failed.', 'error'); }
        finally { setDeletingId(null); }
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedCandidates.length === 0) return;
    MySwal.fire({ title: `Delete ${selectedCandidates.length} candidates?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(selectedCandidates.map((id) => api.delete(`/candidates/${id}`)));
          fetchCandidates();
          setSelectedCandidates([]);
          setSelectAll(false);
          MySwal.fire('Deleted!', 'Selected candidates removed.', 'success');
        } catch (error) { MySwal.fire('Error', 'Bulk delete failed.', 'error'); }
      }
    });
  };

  // --- IMPORT LOGIC ---
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        if (jsonData.length === 0) throw new Error("Excel file is empty.");

        const formattedData = jsonData.map(item => {
          return {
            userId: userId,
            name: String(item.Name || item.name || '').trim(),
            surname: String(item.Surname || item.surname || '').trim(),
            role: String(item.Role || item.role || '').trim(),
            skills: String(item.Skills || item.skills || '').trim(),
            exp: parseFloat(item.Experience || item.experience || item.exp || item['Experience (Years)'] || 0),
            location: String(item.Location || item.location || '').trim(),
            email: String(item.Email || item.email || '').trim(),
            phone: String(item.Phone || item.phone || '').trim().replace(/\s/g, ''),
          };
        }).filter(i => i.name && i.email && i.phone);

        if (formattedData.length === 0) throw new Error("No valid data found (Check headers: Name, Surname, Role, Email, etc.)");

        await api.post('/candidates/bulk', formattedData);
        
        fetchCandidates();
        MySwal.fire('Success', `${formattedData.length} candidates imported!`, 'success');
      } catch (err) {
        console.error("Bulk Import Error:", err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || err.message || 'Format error.';
        MySwal.fire('Import Failed', errorMsg, 'error');
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const exportToExcel = () => {
    try {
      const dataToExport = candidates.map(({ candidateId, name, surname, role, skills, exp, location, email, phone }) => ({
        'Candidate ID': candidateId, Name: name, Surname: surname, Role: role, Skills: skills, 'Experience': exp, Location: location, Email: email, Phone: phone
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
      XLSX.writeFile(wb, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) { MySwal.fire('Error', 'Export failed.', 'error'); }
  };

  // --- Filtering & Pagination ---
  const filteredCandidates = candidates.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name?.toLowerCase().includes(term)) ||
      (c.surname?.toLowerCase().includes(term)) ||
      (c.email?.toLowerCase().includes(term)) ||
      (c.role?.toLowerCase().includes(term)) ||
      (c.candidateId?.toString().toLowerCase().includes(term)) ||
      (c.phone?.includes(term))
    );
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedCandidates(checked ? currentCandidates.map(c => c._id) : []);
  };

  const handleSelectCandidate = (e, id) => {
    if (e.target.checked) setSelectedCandidates(prev => [...prev, id]);
    else {
      setSelectedCandidates(prev => prev.filter(cid => cid !== id));
      setSelectAll(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Loader2 className="animate-spin text-[#1976d2]" size={48} />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="bg-[#1976d2] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white transition-all duration-300">
        <div className="flex items-center space-x-5 w-full md:w-auto mb-6 md:mb-0">
          <div className="bg-white p-4 rounded-full flex items-center justify-center shadow-md">
            <Users className="text-[#1976d2]" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Candidates</h1>
            <p className="text-blue-100 opacity-90 text-sm font-medium mt-1">Bench candidate operations</p>
          </div>
        </div>
        <div className="bg-white text-gray-800 rounded-lg py-3 px-8 min-w-[160px] flex flex-col items-center shadow-md">
          <span className="text-4xl font-extrabold text-gray-900">{candidates.length}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1976d2]">Available</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        {/* ACTIONS */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 space-y-4 xl:space-y-0 gap-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight uppercase">All Candidates</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center justify-end">
            <div className="relative w-full sm:w-64">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedCandidates.length > 0 && (
                <button onClick={handleDeleteSelected} className="px-3 py-2 bg-red-50 text-red-600 font-semibold rounded-lg border border-red-200 text-sm">
                  <Trash2 size={16} className="mr-1" /> Delete ({selectedCandidates.length})
                </button>
              )}
              {/* IMPORT BUTTON WITH NEW ICON */}
              <button onClick={() => fileInputRef.current.click()} disabled={importing} className="inline-flex items-center px-3 py-2 bg-[#5c6bc0] text-white font-semibold rounded-lg hover:bg-[#3f51b5] transition-all text-sm">
                {importing ? <Loader2 size={16} className="animate-spin mr-1" /> : <FileUp size={16} className="mr-1" />}
                {importing ? 'Importing...' : 'Import'}
              </button>
              <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleImport} />
              
              {/* EXPORT BUTTON WITH NEW ICON */}
              <button onClick={exportToExcel} className="inline-flex items-center px-3 py-2 bg-[#5c6bc0] text-white font-semibold rounded-lg hover:bg-[#3f51b5] text-sm">
                <FileSpreadsheet size={16} className="mr-1" /> Export
              </button>
              
              <button onClick={handleOpenAddModal} className="inline-flex items-center px-3 py-2 bg-[#5c6bc0] text-white font-semibold rounded-lg hover:bg-[#3f51b5] text-sm">
                <PlusCircle size={16} className="mr-1" /> Add New
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="rounded text-blue-600" /></th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Skills</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Exp</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCandidates.map((c, index) => (
                <tr key={c._id} className={`hover:bg-blue-50 ${selectedCandidates.includes(c._id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input type="checkbox" checked={selectedCandidates.includes(c._id)} onChange={(e) => handleSelectCandidate(e, c._id)} className="rounded text-blue-600" />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{startIndex + index + 1}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{c.candidateId || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{c.name} {c.surname}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.role}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{c.skills}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.exp} Yrs</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.location}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleOpenEditModal(c)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(c._id)} disabled={deletingId === c._id} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full">
                        {deletingId === c._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentCandidates.length === 0 && (
                <tr><td colSpan="9" className="px-6 py-12 text-center text-gray-400 bg-gray-50">No candidates found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-6 border-t pt-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold">{startIndex + 1}</span> to <span className="font-bold">{Math.min(startIndex + itemsPerPage, filteredCandidates.length)}</span> of <span className="font-bold">{filteredCandidates.length}</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={18} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h3>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">First Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Surname</label>
                  <input name="surname" value={formData.surname} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.surname ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Role</label>
                  <input name="role" value={formData.role} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.role ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Experience (Years)</label>
                  <input name="exp" type="number" step="0.1" value={formData.exp} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.exp ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.exp && <p className="text-xs text-red-500 mt-1">{errors.exp}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.location ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input name="phone" maxLength={10} value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Skills (Comma Separated)</label>
                  <input name="skills" value={formData.skills} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.skills ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-[#1976d2] text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center">
                  {submitting && <Loader2 size={18} className="animate-spin mr-2" />}
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}