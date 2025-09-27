import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, UserPlus, XCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function AdminManageRecruiters() {
    const [recruiters, setRecruiters] = useState([]);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');

    const fetchRecruiters = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/recruiters');
            setRecruiters(data);
            setError('');
        } catch (error) {
            console.error("Failed to fetch recruiters:", error);
            setError('Failed to fetch recruiters. Please ensure the backend is running and the API endpoint is available.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecruiters();
    }, [fetchRecruiters]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            if (editingId) {
                const updateData = { email: formData.email };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await api.put(`/recruiters/${editingId}`, updateData);
            } else {
                await api.post('/recruiters/register', formData);
            }
            resetForm();
            await fetchRecruiters();
        } catch (error) {
            console.error("Failed to submit recruiter:", error);
            setError(error.response?.data?.error || 'Failed to save recruiter.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (recruiter) => {
        setFormData({ email: recruiter.email, password: '' });
        setEditingId(recruiter._id);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recruiter? This action cannot be undone.")) {
            setDeletingId(id);
            try {
                await api.delete(`/recruiters/${id}`);
                await fetchRecruiters();
            } catch (error) {
                console.error("Failed to delete recruiter:", error);
                setError(error.response?.data?.error || 'Failed to delete recruiter.');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ email: '', password: '' });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                        <UserPlus className="mr-3 text-gray-800" size={36} /> Manage Recruiters
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Add, update, or remove recruiter accounts from the system.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 flex items-center animate-fade-in">
                        <XCircle className="w-5 h-5 mr-3" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Recruiter Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 ease-in-out">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">
                        {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="recruiter@example.com"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm text-gray-800"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={editingId ? "New Password (Optional)" : "Password"}
                                required={!editingId}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out shadow-sm text-gray-800"
                            />
                            {editingId && (
                                <p className="mt-2 text-sm text-gray-500">Leave blank to keep current password.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 ease-in-out shadow-sm"
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    {editingId ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-3" />
                                    {editingId ? 'Update Recruiter' : 'Add Recruiter'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* All Recruiters Table styled to match screenshot */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        All Recruiters
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Recruiter Email</th>
                                    <th scope="col" className="py-3 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="py-4 px-6 text-center text-gray-500 bg-gray-800">
                                            <div className="flex justify-center items-center text-white">
                                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                                Loading recruiters...
                                            </div>
                                        </td>
                                    </tr>
                                ) : recruiters.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="py-4 px-6 text-center text-gray-400 bg-gray-800">No recruiters found.</td>
                                    </tr>
                                ) : (
                                    recruiters.map(r => (
                                        <tr key={r._id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                                            <td className="py-4 px-6 font-medium text-white whitespace-nowrap">{r.email}</td>
                                            <td className="py-4 px-6 text-right flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleEdit(r)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-200 hover:bg-purple-300 transition-colors duration-200"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r._id)}
                                                    disabled={deletingId === r._id}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-800 bg-red-200 hover:bg-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === r._id ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                    )}
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}