import React, { useState, useEffect } from 'react';
import { Edit, Trash2, UserPlus, XCircle, Loader2, Shield, Mail, IdCard, Key } from 'lucide-react'; // Added icons for consistency
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
    const [submitting, setSubmitting] = useState(false); // New state for form submission loading
    const [deletingId, setDeletingId] = useState(null); // New state for delete loading
    const [error, setError] = useState(''); // Unified error state
    const [success, setSuccess] = useState(''); // Unified success state

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/managers');
            setManagers(data);
            setError(''); // Clear error on successful fetch
        } catch (error) {
            console.error("Failed to fetch managers:", error);
            setError('Failed to fetch managers. Please check the API.');
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
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/managers/${editingId}`, formData);
                setSuccess('Manager updated successfully!');
            } else {
                await api.post('/managers/register', formData);
                setSuccess('Manager added successfully!');
            }
            resetForm();
            fetchManagers();
            setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error("Failed to submit manager:", error);
            setError(error.response?.data?.error || 'Failed to save manager.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (manager) => {
        setFormData({ 
            name: manager.name,
            email: manager.email,
            employeeID: manager.employeeId,
            password: '' 
        });
        setEditingId(manager._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this manager? This action cannot be undone.")) {
            setDeletingId(id);
            setError('');
            setSuccess('');
            try {
                await api.delete(`/managers/${id}`);
                setSuccess('Manager deleted successfully!');
                fetchManagers();
                setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
            } catch (error) {
                console.error("Failed to delete manager:", error);
                setError(error.response?.data?.error || 'Failed to delete manager.');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ name: '', employeeID: '', email: '', password: '' });
    };
    
    return (
        // Corrected: Wrapped the entire content in a single parent div
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {/* Header Section */}
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500 rounded-full">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-bold">Manage Managers</h3>
                            <p className="text-blue-200 text-sm sm:text-base">
                                Add, update, or remove manager accounts from the system
                            </p>
                        </div>
                    </div>
                    <div className="bg-blue-700/50 backdrop-blur-sm px-5 py-2 rounded-lg text-center shadow-inner">
                        <div className="text-3xl sm:text-4xl font-extrabold">{managers.length}</div>
                        <div className="text-blue-200 text-sm">Total Managers</div>
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 flex items-center bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm animate-fade-in" role="alert">
                        <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 flex items-center bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm animate-fade-in" role="alert">
                        <div className="w-5 h-5 mr-3 flex-shrink-0 text-lg font-bold">✓</div>
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                )}

                {/* Add/Edit Form */}
                <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                    <div className="mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            {editingId ? 'Edit Manager' : 'Add New Manager'}
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="relative">
                           
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Full Name" 
                                required 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>

                        <div className="relative">
                          
                            <input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="Email Address" 
                                required 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>

                        <div className="relative">
                            
                            <input 
                                name="employeeID" 
                                value={formData.employeeID} 
                                onChange={handleChange} 
                                placeholder="Employee ID" 
                                required 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>

                        <div className="relative">
                           
                            <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder={editingId ? "New Password (Optional)" : "Password"} 
                                required={!editingId} 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 text-sm font-medium"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Edit
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {editingId ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    {editingId ? 'Update Manager' : 'Add Manager'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <br />

                {/* Managers Table Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="p-5 border-b border-gray-200">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">All Managers</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                                                <span className="text-lg font-medium">Loading managers...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : managers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserPlus className="w-10 h-10 text-gray-400 mb-3" />
                                                <span className="text-lg font-medium">No managers found. Add one using the form above.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    managers.map(m => (
                                        <tr key={m._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {m.employeeId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => handleEdit(m)} 
                                                        className="flex items-center text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out hover:scale-105"
                                                        title="Edit Manager"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(m._id)} 
                                                        disabled={deletingId === m._id}
                                                        className="flex items-center text-red-600 hover:text-red-900 transition duration-150 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Manager"
                                                    >
                                                        {deletingId === m._id ? (
                                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                        )}
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
                        <div className="mb-2 sm:mb-0">
                            Showing <strong className="font-semibold">{managers.length}</strong> of{' '}
                            <strong className="font-semibold">{managers.length}</strong> managers
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { AdminManageManagers };