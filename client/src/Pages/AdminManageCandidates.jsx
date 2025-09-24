// File: src/Pages/AdminManageCandidates.jsx (Fully Updated)

import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // <-- 1. IMPORT the central API instance instead of axios

export default function AdminManageCandidates() {
    // State management remains the same
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({ name: '', role: '', exp: '', location: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchCandidates = async () => {
        try {
            // 2. UPDATED to use the 'api' instance. No more template strings needed.
            const { data } = await api.get('/candidates');
            setCandidates(data);
        } catch (error) {
            console.error("Failed to fetch candidates:", error);
            // Optionally set an error state here to show a message to the user
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
                // 3. UPDATED to use the 'api' instance
                await api.put(`/candidates/${editingId}`, formData);
            } else {
                // 4. UPDATED to use the 'api' instance
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
                // 5. UPDATED to use the 'api' instance
                await api.delete(`/candidates/${id}`);
                fetchCandidates();
            } catch (error) {
                console.error("Failed to delete candidate:", error);
            }
        }
    };

    return (
        <div>
            <h2>Manage Bench Candidates</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
                <input name="exp" value={formData.exp} onChange={handleChange} placeholder="Experience" required />
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                <button type="submit">{editingId ? 'Update Candidate' : 'Add Candidate'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', role: '', exp: '', location: '', email: '', phone: '' }); }}>Cancel</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Experience</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map(c => (
                        <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>{c.role}</td>
                            <td>{c.exp}</td>
                            <td>{c.location}</td>
                            <td>
                                <button onClick={() => handleEdit(c)}>Edit</button>
                                <button onClick={() => handleDelete(c._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}