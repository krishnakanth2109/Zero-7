import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Edit,
  Trash2,
  UserPlus,
  Loader2,
  FileSpreadsheet,
  FileUp,
  Shield,
  Search,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../api/axios';

export default function AdminManageRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    employeeID: '',
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [importing, setImporting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef(null);

  const validateForm = useCallback((data, isEditing = false) => {
    const errors = {};
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!data.name || data.name.trim() === '') {
      errors.name = 'Full Name is required.';
    } else if (!namePattern.test(data.name.trim())) {
      errors.name = 'Name can only contain alphabets.';
    }
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email Address is required.';
    } else if (!emailPattern.test(data.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!data.employeeID || data.employeeID.trim() === '') {
      errors.employeeID = 'Employee ID is required.';
    }
    if (!isEditing && (!data.password || data.password.length < 6)) {
      errors.password = 'Password is required (min 6 characters).';
    }
    return errors;
  }, []);

  const fetchRecruiters = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/recruiters');
      setRecruiters(data);
      setFilteredRecruiters(data);
    } catch (err) {
      console.error('Failed to fetch recruiters.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  useEffect(() => {
    const filtered = recruiters.filter(
      (rec) =>
        rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecruiters(filtered);
  }, [searchTerm, recruiters]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredRecruiters].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredRecruiters(sorted);
  };

  const handleEdit = (recruiter) => {
    setEditingId(recruiter._id);
    setFormData({
      name: recruiter.name,
      email: recruiter.email,
      employeeID: recruiter.employeeId,
      password: '', // Keep blank for security during edit
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'name') {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
      if (value.length > 0) {
        finalValue = value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const errors = validateForm(formData, !!editingId);
    setValidationErrors((prev) => ({ ...prev, [name]: errors[name] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData, !!editingId);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      if (editingId) {
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        await api.put(`/recruiters/${editingId}`, dataToUpdate);
        setSuccess('Recruiter updated successfully!');
      } else {
        await api.post('/recruiters/register', formData);
        setSuccess('Recruiter added successfully!');
      }
      setEditingId(null);
      setFormData({ name: '', employeeID: '', email: '', password: '' });
      fetchRecruiters();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save recruiter.');
    } finally {
      setSubmitting(false);
    }
  };

  const exportToExcel = () => {
    const excelData = recruiters.map((r) => ({
      Name: r.name, Email: r.email, 'Employee ID': r.employeeId, Status: 'Active'
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruiters');
    XLSX.writeFile(workbook, `recruiters-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        for (const row of jsonData) {
          await api.post('/recruiters/register', {
            name: row['Name'], email: row['Email'], employeeID: row['Employee ID'], password: 'Zero7@123'
          });
        }
        fetchRecruiters();
        setSuccess('Import Successful');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) { alert('Import failed'); }
      finally { setImporting(false); }
    };
    reader.readAsArrayBuffer(file);
  };

  if (loading) return (
    <div className='fixed inset-0 flex items-center justify-center bg-white/80 z-50'>
      <Loader2 className='w-12 h-12 text-blue-600 animate-spin' />
    </div>
  );

  return (
    <div className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Header Section */}
        <div className='bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 p-3 rounded-xl'>
              <Shield className='w-8 h-8 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-slate-800'>Manage Recruiters</h1>
              <p className='text-slate-500 text-sm'>Control access and staff directory</p>
            </div>
          </div>
          <div className='bg-white border border-slate-200 px-8 py-3 rounded-xl shadow-sm text-center'>
            <span className='block text-3xl font-black text-blue-600'>{recruiters.length}</span>
            <span className='text-[10px] uppercase tracking-widest font-black text-slate-400'>Total Staff</span>
          </div>
        </div>

        {/* Global Alerts */}
        {success && (
          <div className='mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl'>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {/* Form Card (Vertical Layout) */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8 max-w-xl'>
          <div className='px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
            <h2 className='font-bold text-slate-700'>{editingId ? 'Edit Recruiter' : 'Add New Recruiter'}</h2>
          </div>
          <form onSubmit={handleSubmit} className='p-6 space-y-5'>
            {['name', 'email', 'employeeID'].map((key) => (
               <div key={key} className='flex flex-col gap-1'>
                 <label className='text-xs font-bold text-slate-600 ml-1 uppercase'>{key.replace('ID', ' ID')}</label>
                 <input
                   name={key} 
                   value={formData[key]} 
                   onChange={handleChange} 
                   onBlur={handleBlur}
                   className={`w-full px-4 py-2.5 rounded-xl border ${validationErrors[key] ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all`}
                   placeholder={`Enter ${key}`}
                 />
                 {validationErrors[key] && <p className='text-[10px] text-red-500 font-bold ml-1'>{validationErrors[key]}</p>}
               </div>
            ))}
            
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-bold text-slate-600 ml-1 uppercase'>Password</label>
              <div className='relative'>
                <input
                  name='password' 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all'
                  placeholder={editingId ? 'Leave blank to keep current' : 'Min 6 characters'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600'>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className='pt-2 flex gap-3'>
              <button 
                type="submit"
                disabled={submitting} 
                className='flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-50'
              >
                {submitting ? <Loader2 className='animate-spin' size={18} /> : (editingId ? <Edit size={18} /> : <UserPlus size={18} />)}
                {editingId ? 'Update Recruiter' : 'Add Staff Member'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => { setEditingId(null); setFormData({name:'', email:'', employeeID:'', password:''}); }}
                  className='px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Directory Card */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30'>
            <h2 className='font-black text-slate-700 uppercase tracking-widest text-xs'>Recruiter Directory</h2>
            <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
              <div className='relative flex-1 md:w-64'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                <input 
                  type='text' 
                  placeholder='Search staff...' 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white'
                />
              </div>
              <button 
                disabled={importing}
                onClick={() => fileInputRef.current.click()} 
                className='flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all'
              >
                {importing ? <Loader2 className='animate-spin' size={16}/> : <FileUp size={16} className='text-blue-600' />} 
                Import
                <input type="file" ref={fileInputRef} onChange={handleImportExcel} hidden accept='.xlsx, .xls' />
              </button>
              <button 
                onClick={exportToExcel} 
                className='flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all'
              >
                <FileSpreadsheet size={16} /> Export
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-black'>
                  {['name', 'email', 'employeeId'].map(k => (
                    <th key={k} onClick={() => handleSort(k)} className='px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors'>
                      {k.replace('Id', ' ID')} {sortConfig.key === k && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                  <th className='px-6 py-4 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {filteredRecruiters.map((rec) => (
                  <tr key={rec._id} className='hover:bg-slate-50/50 transition-colors'>
                    <td className='px-6 py-4 text-sm font-bold text-slate-800'>{rec.name}</td>
                    <td className='px-6 py-4 text-sm text-slate-500'>{rec.email}</td>
                    <td className='px-6 py-4'><span className='px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black border border-blue-100'>{rec.employeeId}</span></td>
                    <td className='px-6 py-4 text-left'>
                      <div className='flex justify-start gap-3'>
                        <button onClick={() => handleEdit(rec)} className='p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all'><Edit size={16} /></button>
                        <button 
                          onClick={() => { if(window.confirm('Delete Recruiter?')) api.delete(`/recruiters/${rec._id}`).then(() => fetchRecruiters()) }} 
                          className='p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRecruiters.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm">No staff members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}