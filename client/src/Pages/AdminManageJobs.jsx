import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './AdminManageJobs.css';
import * as XLSX from 'xlsx';
import {
  FilePenLine,
  FileText,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CheckCircle,
  XCircle,
  Plus,
  FileUp,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';

const AdminManageJobs = () => {
  // --- STATE MANAGEMENT ---
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState([]);
  
  // Filters
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJobs, setSelectedJobs] = useState([]); 

  // Form State
  const [formState, setFormState] = useState({
    companyId: '',
    role: '',
    exp: '',
    skills: '',
    salary: '',
    location: '',
    industry: 'Information Technology',
    status: 'active',
    companyName: '' 
  });

  // UI State
  const [showPopup, setShowPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- STATS CALCULATIONS ---
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status?.toLowerCase() === 'active').length;
  const inactiveJobs = jobs.filter(job => ['inactive', 'in active'].includes(job.status?.toLowerCase())).length;

  // --- API CALLS ---
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError('Could not fetch jobs.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/company');
      setCompany(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Capitalize first letter for specific text fields
    if (['role', 'location', 'skills', 'industry', 'salary'].includes(name) && newValue.length > 0) {
        newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
    }

    setFormState((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleCompanySelectChange = (e) => {
    const selectedCompanyId = e.target.value;
    setFormState((prevState) => ({ ...prevState, companyId: selectedCompanyId }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formState);
      fetchJobs();
      setShowPopup(false);
      resetForm();
      alert('Job added successfully!');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error adding job');
    }
  };

  const resetForm = () => {
    setFormState({
      companyId: '', role: '', exp: '', skills: '', salary: '',
      location: '', industry: 'Information Technology', status: 'active', companyName: ''
    });
  };

  const handleEditPopup = (job) => {
    setFormState({
      ...job,
      companyId: job.companyId?._id || job.companyId,
      companyName: job.companyName || ''
    });
    setEditPopup(true);
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    try {
      const { companyName, ...updateData } = formState;
      await api.patch(`/jobs/${formState._id}`, updateData);
      setEditPopup(false);
      fetchJobs();
      alert('Job updated successfully!');
    } catch (err) {
      alert('Error updating job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert('Job deleted successfully!');
      } catch (err) {
        alert('Failed to delete job.');
      }
    }
  };

  const handleDeleteSelectedJobs = async () => {
    if (window.confirm(`Delete ${selectedJobs.length} selected jobs?`)) {
      try {
        await Promise.all(selectedJobs.map(jobId => api.delete(`/jobs/${jobId}`)));
        alert('Selected jobs deleted successfully!');
        fetchJobs();
        setSelectedJobs([]);
      } catch (err) {
        alert('Failed to delete some jobs.');
      }
    }
  };

  // --- EXCEL HANDLERS ---
  const handleExportToExcel = () => {
    const jobsToExport = filteredJobs.map((job) => ({
      "Company Name": job.companyName || 'N/A',
      "Role": job.role,
      "Experience": job.exp,
      "Skills": job.skills,
      "Salary": job.salary,
      "Location": job.location,
      "Industry": job.industry || 'N/A',
      "Status": job.status || 'N/A',
      "Date Posted": job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(jobsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');
    XLSX.writeFile(workbook, 'Job_Listings.xlsx');
  };

  const handleImportFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const companyNameToIdMap = new Map(
      company.map((c) => [c.name.toLowerCase().trim(), c._id])
    );

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // raw: false ensures numeric fields like Salary don't get scientific notation
        const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        let importedCount = 0;
        let skipCount = 0;
        
        for (const job of data) {
          const rawName = (job["Company Name"] || job.companyName || job.Company || "");
          const companyId = companyNameToIdMap.get(String(rawName).toLowerCase().trim());
          
          if (!companyId) {
            skipCount++;
            continue;
          }

          const jobPayload = {
            companyId: companyId,
            role: job.Role || job.role || "",
            exp: job.Experience || job.experience || job.exp || "0",
            skills: job.Skills || job.skills || "",
            salary: job.Salary || job.salary || "0",
            location: job.Location || job.location || "",
            industry: job.Industry || job.industry || 'Information Technology',
            status: (job.Status || job.status || 'active').toLowerCase(),
          };
          
          try {
            await api.post('/jobs', jobPayload);
            importedCount++;
          } catch (err) {
             console.error(`Failed to import job row`, err);
          }
        }
        alert(`Import Complete: ${importedCount} jobs added. ${skipCount} skipped due to unknown company names.`);
        fetchJobs();
      } catch (err) {
        alert('Failed to process Excel file.');
      } finally {
        setIsImporting(false);
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- PAGINATION & FILTERS ---
  const filteredJobs = jobs.filter((job) => {
    const companyMatch = selectedCompany ? job.companyName === selectedCompany : true;
    const statusMatch = selectedStatus ? job.status === selectedStatus : true;
    return companyMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectJob = (jobId) => {
    setSelectedJobs((prev) => 
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = currentJobs.map((job) => job._id);
      setSelectedJobs((prev) => [...new Set([...prev, ...ids])]);
    } else {
      const ids = currentJobs.map((job) => job._id);
      setSelectedJobs((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <div className="admin-manage-jobs w-[80vw] mx-auto p-4">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-[#1877f2] p-8 rounded-2xl flex flex-wrap gap-6 items-center justify-between mb-8 shadow-md min-h-[160px]">
        <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <FileText size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight">Manage Job Postings</h3>
            </div>
            <p className="text-blue-100 text-sm ml-1 opacity-90">Add, update, or remove job listings from the portal.</p>
        </div>

        <div className="flex gap-6 flex-wrap justify-center md:justify-end">
            <div className="bg-white rounded-xl w-[160px] h-[120px] flex flex-col items-center justify-center shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="text-[#1877f2]" size={20} />
                    <span className="text-[#1877f2] font-bold text-sm tracking-wider uppercase">TOTAL</span>
                </div>
                <span className="text-4xl font-extrabold text-slate-800">{totalJobs}</span>
            </div>
            <div className="bg-white rounded-xl w-[160px] h-[120px] flex flex-col items-center justify-center shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <span className="text-emerald-500 font-bold text-sm tracking-wider uppercase">ACTIVE</span>
                </div>
                <span className="text-4xl font-extrabold text-slate-800">{activeJobs}</span>
            </div>
            <div className="bg-white rounded-xl w-[160px] h-[120px] flex flex-col items-center justify-center shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <XCircle className="text-rose-500" size={20} />
                    <span className="text-rose-500 font-bold text-sm tracking-wider uppercase">INACTIVE</span>
                </div>
                <span className="text-4xl font-extrabold text-slate-800">{inactiveJobs}</span>
            </div>
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => { resetForm(); setShowPopup(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow transition-colors w-full md:w-auto">
            <Plus size={18} /> Add New Job
          </button>
          {selectedJobs.length > 0 && (
            <button
              onClick={handleDeleteSelectedJobs}
              className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow transition-colors">
              Delete ({selectedJobs.length})
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {/* IMPORT BUTTON */}
          <label
            className={`flex items-center justify-center gap-2 
            bg-emerald-500 hover:bg-emerald-600 
            text-white font-medium rounded-lg cursor-pointer shadow transition-colors
            w-36 h-11
            ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isImporting ? <Loader2 className="animate-spin" size={18}/> : <FileUp size={18} />}
            <span className="whitespace-nowrap">
              {isImporting ? 'Importing...' : 'Import'}
            </span>
            <input
              type="file"
              disabled={isImporting}
              accept=".xlsx, .xls"
              onChange={handleImportFromExcel}
              className="hidden"
            />
          </label>

          {/* EXPORT BUTTON */}
          <button
            onClick={handleExportToExcel}
            className="flex items-center justify-center gap-2 
            bg-indigo-500 hover:bg-indigo-600 
            text-white font-medium rounded-lg shadow transition-colors
            w-36 h-11"
          >
            <FileSpreadsheet size={18} />
            <span className="whitespace-nowrap">Export</span>
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-700">Current Listings</h2>
          <div className="flex gap-3">
            <select
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none bg-white">
              <option value="">All Companies</option>
              {company.map((comp) => <option key={comp._id} value={comp.name}>{comp.name}</option>)}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none bg-white">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="in active">In Active</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading jobs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4 w-10">
                    <input type="checkbox" onChange={handleSelectAll} checked={currentJobs.length > 0 && currentJobs.every(job => selectedJobs.includes(job._id))} />
                  </th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Exp</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date Posted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentJobs.length > 0 ? (
                  currentJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input type="checkbox" checked={selectedJobs.includes(job._id)} onChange={() => handleSelectJob(job._id)} />
                      </td>
                      <td className="p-4 font-medium text-gray-800">{job.companyName}</td>
                      <td className="p-4 text-gray-600">{job.role}</td>
                      <td className="p-4 text-gray-600 text-center">{job.exp}</td>
                      <td className="p-4 text-gray-600 max-w-xs truncate" title={job.skills}>{job.skills}</td>
                      <td className="p-4 text-gray-600 font-medium">{job.salary}</td>
                      <td className="p-4 text-gray-600">{job.location}</td>
                      <td className="p-4 text-gray-600 text-xs whitespace-nowrap">
                        {job.createdAt ? new Date(job.createdAt).toLocaleString() : '-'}
                      </td>
                      <td className="p-4">
                         {/* Added whitespace-nowrap to keep status in one line */}
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                           job.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                             {job.status || 'N/A'}
                         </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEditPopup(job)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors">
                                <FilePenLine size={18} />
                            </button>
                            <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                <XCircle size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="p-12 text-center text-gray-400">No job listings match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {filteredJobs.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
             <div className="text-sm text-gray-600 font-medium">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredJobs.length)} of {filteredJobs.length}
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* --- ADD POPUP --- */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transition-all">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">Post New Job</h3>
              <button onClick={() => setShowPopup(false)} className="hover:rotate-90 transition-transform"><XCircle /></button>
            </div>
            <form onSubmit={handleAddJob} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                  <select name="companyId" value={formState.companyId} onChange={handleCompanySelectChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Company</option>
                    {company.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                    <input name="role" value={formState.role} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Yrs)</label>
                    <input type="number" name="exp" value={formState.exp} onChange={handleInputChange} min="0" required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Skills</label>
                  <input name="skills" value={formState.skills} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Java, React, SQL" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
                    <input type="text" name="salary" value={formState.salary} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input name="location" value={formState.location} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <input type="text" value="Active" disabled className="w-full border bg-gray-50 rounded-xl p-3 text-gray-500 font-medium" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4">Post Job Listing</button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT POPUP --- */}
      {editPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transition-all">
             <div className="bg-indigo-600 p-5 flex justify-between items-center text-white">
                <h3 className="font-bold text-xl">Update Job Details</h3>
                <button onClick={() => setEditPopup(false)} className="hover:rotate-90 transition-transform"><XCircle /></button>
            </div>
            <form onSubmit={handleEditJob} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company (Read Only)</label>
                  <input type="text" value={formState.companyName} disabled className="w-full border border-gray-200 bg-gray-100 rounded-xl p-3 text-gray-500 font-medium" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                      <input name="role" value={formState.role} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
                      <input name="exp" value={formState.exp} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Skills</label>
                  <input name="skills" value={formState.skills} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
                      <input name="salary" value={formState.salary} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                      <input name="location" value={formState.location} onChange={handleInputChange} required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
               </div>
               <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select name="status" value={formState.status} onChange={handleInputChange} className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="active">Active</option>
                        <option value="in active">In Active</option>
                    </select>
               </div>
               <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4">Save Updated Details</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminManageJobs;