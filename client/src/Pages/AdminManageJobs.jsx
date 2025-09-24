// File: src/Pages/AdminManageJobs.jsx (Fully Corrected)

import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // <-- CORRECT: Imports the central API connection

const AdminManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formState, setFormState] = useState({ role: '', exp: '', skills: '', salary: '', location: '' });

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            // CORRECT: Uses the central 'api' object
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (err) {
            setError('Could not fetch jobs. Please try again later.');
            console.error("Error fetching jobs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            // CORRECT: Uses the central 'api' object
            const response = await api.post('/jobs', formState);
            setJobs([response.data, ...jobs]);
            setFormState({ role: '', exp: '', skills: '', salary: '', location: '' });
            alert('Job added successfully!');
        } catch (err) {
            alert('Failed to add job. Check console for details.');
            console.error("Error adding job:", err);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                // CORRECT: Uses the central 'api' object
                await api.delete(`/jobs/${jobId}`);
                setJobs(jobs.filter(job => job._id !== jobId));
                alert('Job deleted successfully!');
            } catch (err) {
                alert('Failed to delete job. Check console for details.');
                console.error("Error deleting job:", err);
            }
        }
    };

    // Your JSX is preserved
    return (
        <div className="admin-manage-jobs">
            <div className="form-container card">
                <h2>Add New Job Posting</h2>
                <form onSubmit={handleAddJob} className="add-job-form">
                    <input name="role" value={formState.role} onChange={handleInputChange} placeholder="Job Role (e.g., Frontend Developer)" required />
                    <input name="exp" value={formState.exp} onChange={handleInputChange} placeholder="Experience (e.g., 0-2 yrs)" required />
                    <input name="skills" value={formState.skills} onChange={handleInputChange} placeholder="Skills (e.g., React, JS, HTML)" required />
                    <input name="salary" value={formState.salary} onChange={handleInputChange} placeholder="Salary (e.g., 3-4 LPA)" required />
                    <input name="location" value={formState.location} onChange={handleInputChange} placeholder="Location (e.g., Hyderabad)" required />
                    <button type="submit">Add Job</button>
                </form>
            </div>
            <div className="listings-container card">
                <h2>Current Job Listings</h2>
                {isLoading && <p>Loading jobs...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && !error && (
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Experience</th>
                                <th>Skills</th>
                                <th>Salary</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length > 0 ? jobs.map((job) => (
                                <tr key={job._id}>
                                    <td>{job.role}</td>
                                    <td>{job.exp}</td>
                                    <td>{job.skills}</td>
                                    <td>{job.salary}</td>
                                    <td>{job.location}</td>
                                    <td>
                                        <button onClick={() => handleDeleteJob(job._id)} className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6">No job positions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminManageJobs;