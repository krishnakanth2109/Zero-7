import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Download, Upload, PlusCircle, X } from 'lucide-react'; // Added PlusCircle and X for modal
import api from '../api/axios'; // Assuming this path is correct
import './AdminManageCandidates.css'; // New CSS file

export default function AdminManageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [alertMessage, setAlertMessage] = useState({ type: '', message: '' }); // For alerts

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/candidates');
            setCandidates(data);
        } catch (error) {
            console.error("Failed to fetch candidates:", error);
            showAlert('error', 'Failed to load candidates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Function to show alert messages
    const showAlert = (type, message) => {
        setAlertMessage({ type, message });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000); // Hide after 3 seconds
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (candidate) => {
        setFormData(candidate);
        setEditingId(candidate._id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/candidates/${editingId}`, formData);
                showAlert('success', 'Candidate updated successfully!');
            } else {
                await api.post('/candidates', formData);
                showAlert('success', 'Candidate added successfully!');
            }
            handleCloseModal(); // Close modal after submission
            fetchCandidates();
        } catch (error) {
            console.error("Failed to submit candidate:", error);
            showAlert('error', 'Failed to save candidate. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await api.delete(`/candidates/${id}`);
                fetchCandidates();
                showAlert('success', 'Candidate deleted successfully!');
            } catch (error) {
                console.error("Failed to delete candidate:", error);
                showAlert('error', 'Failed to delete candidate.');
            }
        }
    };

    // Export to CSV function
    const exportToCSV = () => {
        const headers = ['Name', 'Role', 'Experience', 'Location', 'Email', 'Phone'];
        const csvContent = [
            headers.map(h => `"${h}"`).join(','), // Quote headers
            ...candidates.map(candidate => [
                `"${candidate.name}"`,
                `"${candidate.role}"`,
                `"${candidate.exp}"`,
                `"${candidate.location}"`,
                `"${candidate.email}"`,
                `"${candidate.phone}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'candidates.csv';
        document.body.appendChild(a); // Append to body to make it clickable
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url);
        showAlert('success', 'Candidates exported to CSV!');
    };

    // Import from CSV function
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csvData = event.target.result;
                const lines = csvData.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
                if (lines.length <= 1) { // Only header or no data
                    showAlert('error', 'No candidate data found in the CSV file.');
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const candidatesToImport = [];

                for (let i = 1; i < lines.length; i++) {
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
                    } else {
                        console.warn(`Skipping malformed row: ${lines[i]}`);
                    }
                }

                if (candidatesToImport.length > 0) {
                    // Import candidates to backend
                    for (const candidate of candidatesToImport) {
                        await api.post('/candidates', candidate);
                    }
                    fetchCandidates();
                    showAlert('success', `Successfully imported ${candidatesToImport.length} candidates!`);
                } else {
                    showAlert('warning', 'No valid candidates found in the CSV file to import.');
                }
                
            } catch (error) {
                console.error('Error importing CSV:', error);
                showAlert('error', 'Error importing CSV file. Please check format.');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    };


    if (loading) {
        return <div className="loading-spinner"></div>; // Enhanced loading spinner
    }

    return (
        <div className="admin-dashboard">
            {alertMessage.message && (
                <div className={`app-alert ${alertMessage.type}`}>
                    {alertMessage.message}
                </div>
            )}

            <header className="dashboard-header">
                <h1 className="dashboard-title">Manage Your Bench Candidates Efficiently</h1>
                {/* <p className="dashboard-subtitle">Manage Your Bench Candidates Efficiently</p> */}
            </header>

            <main className="dashboard-content">
                <section className="candidates-overview card">
                    <div className="section-header">
                        <h2>All Candidates</h2>
                        <div className="actions-group">
                            <button className="btn btn-primary" onClick={handleOpenAddModal}>
                                <PlusCircle size={18} /> Add New Candidate
                            </button>
                            <label htmlFor="import-csv" className="btn btn-secondary">
                                <Upload size={18} /> Import CSV
                            </label>
                            <input
                                id="import-csv"
                                type="file"
                                accept=".csv"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                            <button onClick={exportToCSV} className="btn btn-secondary">
                                <Download size={18} /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="data-table">
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
                                {candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="no-data-message">No candidates found. Click "Add New Candidate" to get started!</td>
                                    </tr>
                                ) : (
                                    candidates.map(c => (
                                        <tr key={c._id}>
                                            <td>{c.name}</td>
                                            <td>{c.role}</td>
                                            <td>{c.exp} years</td>
                                            <td>{c.location}</td>
                                            <td>{c.email}</td>
                                            <td>{c.phone}</td>
                                            <td className="actions-cell">
                                                <button onClick={() => handleOpenEditModal(c)} className="btn btn-icon btn-edit" title="Edit Candidate">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(c._id)} className="btn btn-icon btn-delete" title="Delete Candidate">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Candidate Form Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>
                            <button onClick={handleCloseModal} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="candidate-form-modal">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Candidate Name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exp">Experience (Years)</label>
                                <input id="exp" name="exp" type="number" value={formData.exp} onChange={handleChange} placeholder="e.g., 3" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., New York" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="e.g., +1 (555) 123-4567" required />
                            </div>
                            <div className="form-actions-modal">
                                <button type="submit" className="btn btn-primary submit-modal-btn">
                                    {editingId ? 'Update Candidate' : 'Add Candidate'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}