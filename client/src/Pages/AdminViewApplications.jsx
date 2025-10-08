// File: src/Pages/AdminViewApplications.jsx (Merged and Corrected)

<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react'
import api from '../api/axios' // Use your central axios instance
import './AdminViewApplications.css'

<<<<<<< HEAD
// --- FIX: The getResumeUrl helper function is no longer needed and has been removed. ---
=======
// Helper to construct the full URL for the resume file
const getResumeUrl = (path) => {
  // Get the base URL of the backend (e.g., http://localhost:5000)
  const baseUrl = (
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  ).replace('/api', '')
  // The path from the DB might contain backslashes on Windows, replace them with forward slashes
  const correctedPath = path.replace(/\\/g, '/')
  return `${baseUrl}/${correctedPath}`
}
>>>>>>> 241581076bec5f15d8d2088c59014fb878a1c0c6
=======
import React, { useEffect, useState } from 'react';
import api from '../api/axios'; // Use your central axios instance
import './AdminViewApplications.css';
>>>>>>> Stashed changes

const AdminViewApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
<<<<<<< HEAD
        setLoading(true);
        setError(null);
        const response = await api.get('/applications');
        // Sort by most recent submission first
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setApplications(sortedData);
=======
        setLoading(true)
        setError(null)
        const response = await api.get('/applications')
        // Sort by most recent submission first
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setApplications(sortedData)
>>>>>>> 241581076bec5f15d8d2088c59014fb878a1c0c6
      } catch (err) {
<<<<<<< Updated upstream
        console.error('Failed to fetch applications:', err)
        setError(
          'Failed to load applications. Please ensure the backend is running.',
        )
=======
        console.error('Failed to fetch applications:', err);
        setError(
          'Failed to load applications. Please ensure the backend is running.',
        );
>>>>>>> Stashed changes
      } finally {
        setLoading(false)
      }
    }

<<<<<<< HEAD
    fetchApplications();
<<<<<<< Updated upstream
  }, []);
=======
    fetchApplications()
  }, []) // The empty array ensures this runs only once when the component mounts

  const handleReject = async (id) => {
    try {
      const confirmDelete = window.confirm(
        'Are you sure you want to reject this candidate?',
      )
      if (!confirmDelete) return

      await api.delete(`/applications/${id}`) // DELETE request to backend
      setApplications((prev) => prev.filter((app) => app._id !== id)) // Update UI
      alert('Candidate rejected successfully ❌')
    } catch (err) {
      console.error('Failed to reject candidate:', err)
      alert('Failed to reject candidate ❌')
    }
  }
  // --- END OF FIX ---
>>>>>>> 241581076bec5f15d8d2088c59014fb878a1c0c6
=======
  }, []); // The empty array ensures this runs only once when the component mounts

  // Function to handle the "Reject" action, which deletes the application
  const handleReject = async (id) => {
    try {
      const confirmReject = window.confirm(
        'Are you sure you want to reject and delete this application? This action cannot be undone.',
      );
      if (!confirmReject) return;

      // Send a DELETE request to the backend API
      await api.delete(`/applications/${id}`);
      
      // Immediately remove the application from the local state to update the UI
      setApplications((prev) => prev.filter((app) => app._id !== id));
      alert('Application rejected and removed successfully.');
    } catch (err) {
      console.error('Failed to reject application:', err);
      alert('Failed to reject the application. Please try again.');
    }
  };
>>>>>>> Stashed changes

  if (loading)
    return (
      <div className='loading-spinner-container'>
        <div className='spinner'></div>
        <p style={{ marginLeft: '15px' }}>Loading applications...</p>
      </div>
<<<<<<< Updated upstream
    )

  if (error) return <p className='error-message'>{error}</p>
=======
    );

  if (error) return <p className='error-message'>{error}</p>;
>>>>>>> Stashed changes

  return (
    <div className='admin-applications'>
      <h2>Job Applications</h2>
      <table className='applications-table'>
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
<<<<<<< Updated upstream
            <th>Status</th>
=======
            <th>Action</th> {/* Changed "Status" to "Action" for clarity */}
>>>>>>> Stashed changes
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name || 'N/A'}</td>
                <td>{app.contact || 'N/A'}</td>
                <td>{app.email || 'N/A'}</td>
                <td>{app.experience || 'N/A'}</td>
                <td>{app.currentSalary || 'N/A'}</td>
                <td>{app.expectedSalary || 'N/A'}</td>
<<<<<<< Updated upstream
<<<<<<< HEAD
                <td>{app.location}</td>
=======
                <td>{app.location || 'N/A'}</td>

                {/* 
                  Use optional chaining (?.) in case a job has been deleted.
                  The backend populates `jobId` with the job object.
                */}
>>>>>>> 241581076bec5f15d8d2088c59014fb878a1c0c6
                <td>{app.jobId?.role || 'Not specified'}</td>
=======
                <td>{app.location || 'N/A'}</td>
                <td>{app.jobId?.role || 'Job Not Found'}</td>
>>>>>>> Stashed changes
                <td>
                  {app.resume ? (
<<<<<<< Updated upstream
<<<<<<< HEAD
                    <a href={app.resume} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  ) : "N/A"}
                  {/* --- END OF FIX --- */}
=======
                    // Construct the full URL to the resume file on the server
                    <a
                      href={app.resume}
                      target='_blank'
                      rel='noopener noreferrer'>
                      View Resume
                    </a>
=======
                    // Use the resume URL directly
                    <a
                      href={app.resume}
                      target='_blank'
                      rel='noopener noreferrer'>
                      View Resume
                    </a>
>>>>>>> Stashed changes
                  ) : (
                    'N/A'
                  )}
                </td>
<<<<<<< Updated upstream
                <td
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => handleReject(app._id)}>
                  Reject
>>>>>>> 241581076bec5f15d8d2088c59014fb878a1c0c6
=======
                <td>
                  <button
                    className="reject-button" // Add a class for styling
                    onClick={() => handleReject(app._id)}>
                    Reject
                  </button>
>>>>>>> Stashed changes
                </td>
              </tr>
            ))
          ) : (
            <tr>
<<<<<<< Updated upstream
              <td colSpan='9'>No applications yet</td>
=======
              {/* Updated colSpan to match the new number of columns */}
              <td colSpan='10'>No applications yet</td>
>>>>>>> Stashed changes
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminViewApplications
