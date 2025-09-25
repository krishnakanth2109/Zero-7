// File: src/Pages/AdminManageCandidates.jsx (Updated - Buttons moved to table section)

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Download, Upload } from 'lucide-react';
import api from '../api/axios';
import './AdminManageCandidates.css';

export default function AdminManageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/candidates');
            setCandidates(data);
        } catch (error) {
            console.error("Failed to fetch candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/candidates/${editingId}`, formData);
            } else {
                await api.post('/candidates', formData);
            }
            setFormData({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
            setEditingId(null);
            fetchCandidates();
        } catch (error) {
            console.error("Failed to submit candidate:", error);
        }
    };

    const handleEdit = (candidate) => {
        setFormData(candidate);
        setEditingId(candidate._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await api.delete(`/candidates/${id}`);
                fetchCandidates();
            } catch (error) {
                console.error("Failed to delete candidate:", error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
    };

    // Export to Excel function
    const exportToExcel = () => {
        const headers = ['Name', 'Role', 'Experience', 'Location', 'Email', 'Phone'];
        const csvContent = [
            headers.join(','),
            ...candidates.map(candidate => [
                `"${candidate.name}"`,
                `"${candidate.role}"`,
                `"${candidate.exp}"`,
                `"${candidate.location}"`,
                `"${candidate.email}"`,
                `"${candidate.phone}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'candidates.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Import from Excel function
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csvData = event.target.result;
                const lines = csvData.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                
                const candidatesToImport = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim() === '') continue;
                    
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    if (values.length === headers.length) {
                        const candidate = {
                            name: values[0] || '',
                            role: values[1] || '',
                            exp: values[2] || '',
                            location: values[3] || '',
                            email: values[4] || '',
                            phone: values[5] || ''
                        };
                        candidatesToImport.push(candidate);
                    }
                }

                // Import candidates to backend
                for (const candidate of candidatesToImport) {
                    await api.post('/candidates', candidate);
                }

                // Refresh the list
                fetchCandidates();
                alert(`Successfully imported ${candidatesToImport.length} candidates`);
                
            } catch (error) {
                console.error('Error importing CSV:', error);
                alert('Error importing CSV file');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Zero7 Tech</h1>
                <h2>Admin Panel</h2>
            </div>

            <div className="content-container">
                {/* SIMPLIFIED Page Header - No buttons here */}
                <div className="page-header">
                    <h1>Manage Bench Candidates</h1>
                </div>

                <form onSubmit={handleSubmit} className="candidate-form">
                    <div className="form-grid">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                        <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
                        <input name="exp" value={formData.exp} onChange={handleChange} placeholder="Experience (years)" required />
                        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editingId ? 'Update Candidate' : 'Add Candidate'}
                        </button>
                        {editingId && (
                            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* TABLE SECTION WITH IMPORT/EXPORT BUTTONS */}
                <div className="table-section">
                    <div className="table-header">
                        <h2>All Candidates</h2>
                        <div className="import-export-buttons">
                            <label htmlFor="import-csv" className="import-btn">
                                <Upload size={16} style={{ marginRight: "8px" }} />
                                Import from Excel
                            </label>
                            <input
                                id="import-csv"
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                            <button onClick={exportToExcel} className="export-btn">
                                <Download size={16} style={{ marginRight: "8px" }} />
                                Export to Excel
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="candidates-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Experience</th>
                                    <th>Location</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map(c => (
                                    <tr key={c._id}>
                                        <td>{c.name}</td>
                                        <td>{c.role}</td>
                                        <td>{c.exp} years</td>
                                        <td>{c.location}</td>
                                        <td>{c.email}</td>
                                        <td>{c.phone}</td>
                                        <td className="actions">
                                            <button onClick={() => handleEdit(c)} className="edit-btn">
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(c._id)} className="delete-btn">
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}