import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './AdminManageJobs.css'; // We will create this for styling

const API_URL = "http://localhost:5000"; // Your backend server URL

const AdminManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formState, setFormState] = useState({
        role: '',
        exp: '',
        skills: '',
        salary: '',
        location: ''
    });

    // Fetch all jobs from the backend when the component loads
    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/api/jobs`);
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

    // Handle changes in the form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle the form submission to add a new job
    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/jobs`, formState);
            // Add the new job to the top of the list for immediate UI update
            setJobs([response.data, ...jobs]);
            // Reset the form
            setFormState({ role: '', exp: '', skills: '', salary: '', location: '' });
            alert('Job added successfully!');
        } catch (err) {
            alert('Failed to add job. Check console for details.');
            console.error("Error adding job:", err);
        }
    };

    // Handle the deletion of a job
    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await axios.delete(`${API_URL}/api/jobs/${jobId}`);
                // Filter out the deleted job for immediate UI update
                setJobs(jobs.filter(job => job._id !== jobId));
                alert('Job deleted successfully!');
            } catch (err) {
                alert('Failed to delete job. Check console for details.');
                console.error("Error deleting job:", err);
            }
        }
    };

    return (
        <div className="admin-manage-jobs">
            {/* Form to Add a New Job */}
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

            {/* Table of Existing Jobs */}
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