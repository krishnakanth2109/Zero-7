import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // <-- CORRECT: Imports the central API connection
import './AdminManageJobs.css'; // Import the new CSS file
import * as XLSX from 'xlsx';

const AdminManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formState, setFormState] = useState({ role: '', exp: '', skills: '', salary: '', location: '' });
    const [showPopup, setShowPopup] = useState(false); // State for controlling the pop-up

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
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
            const response = await api.post('/jobs', formState);
            setJobs([response.data, ...jobs]);
            setFormState({ role: '', exp: '', skills: '', salary: '', location: '' });
            alert('Job added successfully!');
            setShowPopup(false); // Close pop-up after adding job
        } catch (err) {
            alert('Failed to add job. Check console for details.');
            console.error("Error adding job:", err);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                setJobs(jobs.filter(job => job._id !== jobId));
                alert('Job deleted successfully!');
            } catch (err) {
                alert('Failed to delete job. Check console for details.');
                console.error("Error deleting job:", err);
            }
        }
    };

    const handleExportToExcel = () => {
        // Create a new array without the _id field for a cleaner export
        const jobsToExport = jobs.map(({ _id, __v, ...rest }) => rest);
        const worksheet = XLSX.utils.json_to_sheet(jobsToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
        XLSX.writeFile(workbook, "JobListings.xlsx");
    };

    const handleImportFromExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const binaryString = event.target.result;
                const workbook = XLSX.read(binaryString, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);

                // Post each job sequentially and wait for all to complete
                for (const job of data) {
                    await api.post('/jobs', job);
                }

                alert('Jobs imported successfully!');
                fetchJobs(); // Refresh the job list from the server
            } catch (err) {
                 alert('Failed to import jobs. Please check the file format and console for details.');
                console.error("Error importing jobs:", err);
            }
        };
        reader.readAsBinaryString(file);
        // Reset file input to allow uploading the same file again
        e.target.value = '';
    };


    return (
        <div className="admin-manage-jobs">
            <h1 className="main-title">Admin Job Management</h1>

            <button onClick={() => setShowPopup(true)} className="add-new-job-button">
                Add New Job Posting
            </button>

            {/* Container for Import/Export links to match the screenshot layout */}
            <div className="excel-actions-container">
                 <label htmlFor="import-excel" className="excel-action-link">
                    Import from Excel
                </label>
                <input
                    id="import-excel"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImportFromExcel}
                    style={{ display: 'none' }}
                />
                <button onClick={handleExportToExcel} className="excel-action-link">
                    Export to Excel
                </button>
            </div>


            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup-button" onClick={() => setShowPopup(false)}>
                            &times;
                        </button>
                        <h2>Add New Job Posting</h2>
                        <form onSubmit={handleAddJob} className="add-job-form">
                            <div className="form-group">
                                <label htmlFor="role">Job Role</label>
                                <input id="role" name="role" value={formState.role} onChange={handleInputChange} placeholder="e.g., Frontend Developer" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exp">Experience</label>
                                <input id="exp" name="exp" value={formState.exp} onChange={handleInputChange} placeholder="e.g., 0-2 yrs" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="skills">Skills</label>
                                <input id="skills" name="skills" value={formState.skills} onChange={handleInputChange} placeholder="e.g., React, JS, HTML" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="salary">Salary</label>
                                <input id="salary" name="salary" value={formState.salary} onChange={handleInputChange} placeholder="e.g., 3-4 LPA" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input id="location" name="location" value={formState.location} onChange={handleInputChange} placeholder="e.g., Hyderabad" required />
                            </div>
                            <button type="submit" className="post-job-button">Post Job</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="listings-container card">
                <h2>Current Job Listings</h2>
                {isLoading && <p>Loading jobs...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && !error && (
                    <div className="table-responsive">
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
                                        <td colSpan="6" className="no-jobs-found">No job positions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManageJobs;