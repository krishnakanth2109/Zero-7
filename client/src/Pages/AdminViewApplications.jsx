// File: src/Pages/AdminViewApplications.jsx (Corrected)

import React, { useEffect, useState } from "react";
import api from '../api/axios'; // Use your central axios instance
import "./AdminViewApplications.css";

// Helper to construct the full URL for the resume file
const getResumeUrl = (path) => {
    // Get the base URL of the backend (e.g., http://localhost:5000)
    const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
    // The path from the DB might contain backslashes on Windows, replace them with forward slashes
    const correctedPath = path.replace(/\\/g, '/');
    return `${baseUrl}/${correctedPath}`;
};

const AdminViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- START OF FIX ---
  // This useEffect now fetches data from your backend API instead of Google Sheets
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/applications');
        // Sort by most recent submission first
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setApplications(sortedData);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []); // The empty array ensures this runs only once when the component mounts
  // --- END OF FIX ---


  if (loading) return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p style={{marginLeft: '15px'}}>Loading applications...</p>
    </div>
  );

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-applications">
      <h2>Job Applications</h2>
      <table className="applications-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Experience</th>
            <th>Current Salary</th>
            <th>Expected Salary</th>
            <th>Location</th>
            <th>Job Role</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              // Use the unique _id from the database as the key
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.contact}</td>
                <td>{app.email}</td>
                <td>{app.experience}</td>
                <td>{app.currentSalary || 'N/A'}</td>
                <td>{app.expectedSalary || 'N/A'}</td>
                <td>{app.location}</td>
                {/* 
                  Use optional chaining (?.) in case a job has been deleted.
                  The backend populates `jobId` with the job object.
                */}
                <td>{app.jobId?.role || 'Not specified'}</td>
                <td>
                  {app.resume ? (
                    // Construct the full URL to the resume file on the server
                    <a href={getResumeUrl(app.resume)} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  ) : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No applications yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminViewApplications;