// File: src/Pages/AdminViewApplications.jsx (Corrected)

import React, { useEffect, useState } from "react";
import api from '../api/axios'; // Use your central axios instance
import "./AdminViewApplications.css";

// --- FIX: The getResumeUrl helper function is no longer needed and has been removed. ---

const AdminViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/applications');
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
  }, []);


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
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.contact}</td>
                <td>{app.email}</td>
                <td>{app.experience}</td>
                <td>{app.currentSalary || 'N/A'}</td>
                <td>{app.expectedSalary || 'N/A'}</td>
                <td>{app.location}</td>
                <td>{app.jobId?.role || 'Not specified'}</td>
                <td>
                  {/* --- START OF FIX --- */}
                  {/* We now use app.resume directly in the href attribute */}
                  {app.resume ? (
                    <a href={app.resume} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  ) : "N/A"}
                  {/* --- END OF FIX --- */}
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