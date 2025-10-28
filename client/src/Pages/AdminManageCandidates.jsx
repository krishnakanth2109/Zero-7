import React, { useState, useEffect, useRef } from 'react';
import {
  Edit, Trash2, Download, Upload, PlusCircle, X, Loader2, Users, XCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import api from '../api/axios';
import Cookie from 'js-cookie';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './AdminManageCandidates.css'; // <-- IMPORT THE DEDICATED CSS FILE

const MySwal = withReactContent(Swal);

export default function AdminManageCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    candidateId: '',
    name: '',
    surname: '',
    role: '',
    skills: '',
    exp: '',
    location: '',
    email: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef(null);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage({ type: '', message: '' }), 4000);
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/candidates/');
      setCandidates(data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      showAlert('error', 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiter = () => {
    const data = Cookie.get('user');
    if (data) {
      const res = JSON.parse(data);
      setUserId(res.id);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchRecruiter();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      userId: userId,
      candidateId: '',
      name: '',
      surname: '',
      role: '',
      skills: '',
      exp: '',
      location: '',
      email: '',
      phone: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (candidate) => {
    setFormData(candidate);
    setEditingId(candidate._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        // For updates, we send the form data as is
        await api.put(`/candidates/${editingId}`, formData);
        showAlert('success', 'Candidate updated successfully!');
      } else {
        // For creating, we create a new payload and remove the candidateId
        const payload = { ...formData, userId };
        delete payload.candidateId; // This is the key fix

        await api.post('/candidates', payload);
        showAlert('success', 'Candidate added successfully!');
      }
      handleCloseModal();
      fetchCandidates();
    } catch (error) {
      console.error('Failed to submit candidate:', error);
      showAlert('error', error.response?.data?.message || 'Failed to save candidate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        try {
          await api.delete(`/candidates/${id}`);
          fetchCandidates();
          MySwal.fire('Deleted!', 'The candidate has been deleted.', 'success');
        } catch (error) {
          showAlert('error', error.response?.data?.message || 'Failed to delete candidate.');
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const handleDeleteSelected = async () => {
    MySwal.fire({
      title: 'Delete Selected Candidates?',
      text: `You are about to delete ${selectedCandidates.length} candidates. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedCandidates.map((id) => api.delete(`/candidates/${id}`))
          );
          fetchCandidates();
          setSelectedCandidates([]);
          setSelectAll(false);
          MySwal.fire('Deleted!', 'The selected candidates have been deleted.', 'success');
        } catch (error) {
          showAlert('error', 'Failed to delete some or all selected candidates.');
        }
      }
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedCandidates(isChecked ? currentCandidates.map((c) => c._id) : []);
  };

  const handleSelectCandidate = (e, id) => {
    const isChecked = e.target.checked;
    setSelectedCandidates(prev => isChecked ? [...prev, id] : prev.filter((cid) => cid !== id));
  };

  const exportToExcel = () => {
    try {
      const dataToExport = candidates.map(
        ({ candidateId, name, surname, role, skills, exp, location, email, phone }) => ({
          'Candidate ID': candidateId,
          Name: name,
          Surname: surname,
          Role: role,
          Skills: skills,
          'Experience (Years)': exp,
          Location: location,
          Email: email,
          Phone: phone,
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
      XLSX.writeFile(workbook, `candidates-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      showAlert('success', 'Data exported successfully!');
    } catch (error) {
      showAlert('error', 'Failed to export data.');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/)) {
      showAlert('error', 'Please select a valid Excel file.');
      return;
    }
    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          if (data.length === 0) throw new Error('Excel file is empty.');

          const formattedData = data.map((item, index) => {
            // The 'Candidate ID' column is no longer needed in the Excel file for import
            if (!item.Name || !item.Role || !item.Email) {
              throw new Error(`Row ${index + 2}: Missing required fields (Name, Role, Email)`);
            }
            return {
              userId: userId,
              name: String(item.Name || '').trim(),
              surname: String(item.Surname || '').trim(),
              role: String(item.Role || '').trim(),
              skills: String(item.Skills || '').trim(),
              exp: String(item['Experience (Years)'] || 0),
              location: String(item.Location || '').trim(),
              email: String(item.Email || '').trim().toLowerCase(),
              phone: String(item.Phone || '').trim(),
            };
          });

          await api.post('/candidates/bulk', formattedData);
          fetchCandidates();
          showAlert('success', `${formattedData.length} candidates imported successfully!`);
        } catch (innerError) {
          showAlert('error', `Import failed: ${innerError.message}`);
        }
      };
      reader.readAsBinaryString(file);
    } catch (outerError) {
      showAlert('error', 'Failed to read the file.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current && !importing) fileInputRef.current.click();
  };

  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner-icon" />
      </div>
    );
  }

  return (
    <div className="candidates-page">
      <div className="candidates-container">
        <div className="page-header">
          <div className="header-content">
            <Users className="header-icon" />
            <div>
              <h3 className="header-title">Manage Candidates</h3>
              <p className="header-subtitle">Add, update, or remove bench candidates</p>
            </div>
          </div>
          <div className="stats-box">
            <div className="stats-number">{candidates.length}</div>
            <div className="stats-label">Available Candidates</div>
          </div>
        </div>

        {alertMessage.message && (
          <div className={`app-alert ${alertMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alertMessage.type === 'error' ? <XCircle className="alert-icon" /> : <div className="alert-icon-success">✓</div>}
            <span className="alert-message">{alertMessage.message}</span>
          </div>
        )}

        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">All Candidates</h2>
            <div className="actions-group">
              {selectedCandidates.length > 0 && <button onClick={handleDeleteSelected} className="btn btn-danger"><Trash2 size={18} /> Delete ({selectedCandidates.length})</button>}
              <button type="button" onClick={triggerFileInput} disabled={importing} className="btn btn-purple"><Upload size={18} /> {importing ? 'Importing...' : 'Import'}</button>
              <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleImport} disabled={importing} />
              <button onClick={exportToExcel} className="btn btn-success"><Download size={18} /> Export</button>
              <button onClick={handleOpenAddModal} className="btn btn-primary"><PlusCircle size={18} /> Add New</button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                  <th>Candidate ID</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Role</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Recruiter</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((c) => (
                  <tr key={c._id} className={selectedCandidates.includes(c._id) ? 'selected-row' : ''}>
                    <td><input type="checkbox" checked={selectedCandidates.includes(c._id)} onChange={(e) => handleSelectCandidate(e, c._id)} /></td>
                    <td data-label="ID">{c.candidateId || 'N/A'}</td>
                    <td data-label="Name">{c.name}</td>
                    <td data-label="Surname">{c.surname || 'N/A'}</td>
                    <td data-label="Role">{c.role}</td>
                    <td data-label="Skills">{c.skills || 'N/A'}</td>
                    <td data-label="Experience">{c.exp} years</td>
                    <td data-label="Location">{c.location}</td>
                    <td data-label="Recruiter">{c.userName || 'N/A'}</td>
                    <td data-label="Actions">
                      <div className="actions-cell">
                        <button onClick={() => handleOpenEditModal(c)} className="btn-icon btn-edit"><Edit size={16} /> Edit</button>
                        <button onClick={() => handleDelete(c._id)} disabled={deletingId === c._id} className="btn-icon btn-delete">
                          {deletingId === c._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-controls">
             <div className="pagination-summary">Showing <strong>{startIndex + 1}</strong> - <strong>{Math.min(endIndex, candidates.length)}</strong> of <strong>{candidates.length}</strong></div>
             {totalPages > 1 && <div className="pagination-buttons"><button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft size={18}/></button><span>Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight size={18}/></button></div>}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>
              <button onClick={handleCloseModal} className="modal-close-btn"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              {/* === CORRECTED CONDITIONAL INPUT FOR CANDIDATE ID === */}
              {editingId ? (
                <input name="candidateId" value={formData.candidateId} readOnly className="form-input readonly"/>
              ) : (
                <input value="ID will be auto-generated" disabled className="form-input readonly"/>
              )}

              <input name="name" pattern="[A-Za-z\s]*" value={formData.name} onChange={handleChange} placeholder="Candidate Name" required className="form-input"/>
              <input name="surname" pattern="[A-Za-z\s]*" value={formData.surname} onChange={handleChange} placeholder="Candidate Surname" required className="form-input"/>
              <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" required className="form-input"/>
              <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma-separated)" required className="form-input"/>
              <input name="exp" type="number" value={formData.exp} onChange={handleChange} placeholder="Experience (Years)" required className="form-input"/>
              <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="form-input"/>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="form-input"/>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="form-input"/>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <><Loader2 className="animate-spin"/> Processing...</> : <>{editingId ? 'Update Candidate' : 'Add Candidate'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}