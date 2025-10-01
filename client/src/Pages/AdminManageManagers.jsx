// File: src/Pages/AdminManageManagers.jsx

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, UserPlus, X } from 'lucide-react';
import api from '../api/axios'; // Using the central axios instance

export default function AdminManageManagers() {
    const [managers, setManagers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        employeeID: '',
        email: '',
        password: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/managers');
            setManagers(data);
        } catch (error) {
            console.error("Failed to fetch managers:", error);
            showAlert('Failed to fetch managers. Please check the API.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // For updates, the backend doesn't require password, so we can send formData as is.
                // If a new password is provided it will be hashed.
                await api.put(`/managers/${editingId}`, formData);
                showAlert('Manager updated successfully!');
            } else {
                await api.post('/managers/register', formData);
                showAlert('Manager added successfully!');
            }
            resetForm();
            fetchManagers();
        } catch (error) {
            console.error("Failed to submit manager:", error);
            showAlert(error.response?.data?.error || 'Failed to save manager.', 'error');
        }
    };

    const handleEdit = (manager) => {
        // We populate the form with the correct data structure
        setFormData({ 
            name: manager.name,
            email: manager.email,
            employeeID: manager.employeeId, // <-- FIX: Use 'employeeId' from fetched data for the form
            password: '' 
        });
        setEditingId(manager._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await api.delete(`/managers/${id}`);
                showAlert('Manager deleted successfully!', 'success');
                fetchManagers();
            } catch (error) {
                console.error("Failed to delete manager:", error);
                showAlert('Failed to delete manager.', 'error');
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        // --- FIX: Reset form to match the new simplified structure ---
        setFormData({ name: '', employeeID: '', email: '', password: '' });
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }
    
    const Alert = ({ message, type, onClose }) => {
        const baseClasses = "fixed top-5 right-5 flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg z-50 transition-opacity duration-300";
        const typeClasses = {
            success: "bg-green-100 text-green-800",
            error: "bg-red-100 text-red-800",
        };
        return (
            <div className={`${baseClasses} ${typeClasses[type]} ${alert.show ? 'opacity-100' : 'opacity-0'}`} role="alert">
                <span className="font-medium mr-2">{type === 'success' ? 'Success!' : 'Error!'}</span> {message}
                <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-opacity-20 focus:ring-2" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
            {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, show: false })} />}
            
            <h1 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">
                {editingId ? 'Edit Manager' : 'Add New Manager'}
            </h1>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-10 transition-all duration-300">
                <form onSubmit={handleSubmit}>
                    {/* --- FIX: Removed 'assigned_Company', 'age', and 'phone' inputs --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="input-field" />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="input-field" />
                        <input name="employeeID" value={formData.employeeID} onChange={handleChange} placeholder="Employee ID" required className="input-field" />
                        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={editingId ? "New Password (Optional)" : "Password"} required={!editingId} className="input-field" />
                    </div>
                    
                    <div className="flex items-center justify-end gap-4 mt-4">
                        {editingId && (
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancel Edit
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <UserPlus size={18} />
                            <span>{editingId ? 'Update Manager' : 'Add Manager'}</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg overflow-hidden">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">All Managers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Employee ID</th>
                                {/* --- REMOVED Company and Phone headers --- */}
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managers.map(m => (
                                <tr key={m._id} className="bg-white border-b hover:bg-slate-50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{m.name}</td>
                                    <td className="px-6 py-4">{m.email}</td>
                                    {/* --- FIX: Display 'employeeId' (lowercase d) from the database --- */}
                                    <td className="px-6 py-4">{m.employeeId}</td>
                                    {/* --- REMOVED Company and Phone cells --- */}
                                    <td className="px-6 py-4 flex justify-center items-center gap-4">
                                        <button onClick={() => handleEdit(m)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Manager">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(m._id)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Manager">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {managers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-slate-500">
                                        No managers found. Add one using the form above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}