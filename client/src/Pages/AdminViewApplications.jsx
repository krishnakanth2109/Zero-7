import React, { useEffect, useState } from "react";
import "./AdminViewApplications.css"; // Import the CSS file

const Job_Applications_GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwNpys2m9qGngoB2fkcSyhUxkkuegOpzzL_adw47LZoTuhTwCc4q1u5KGh7e7r-8DKI/exec";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  window.handleApplications = (response) => {
    if (response.result === "success") {
      setApplications(response.data);
    } else {
      setError("Failed to load applications");
    }
    setLoading(false); // ✅ Important: stop loading
  };

  const script = document.createElement("script");
  script.src = `${Job_Applications_GOOGLE_SHEETS_URL}?callback=handleApplications`;
  script.async = true; // ✅ Ensure async load
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
    delete window.handleApplications;
  };
}, []);


  if (loading) return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p style={{marginLeft: '15px'}}>Loading applications...</p>
    </div>
  );
  if (error) return <p>{error}</p>; // ✅ Show error if exists

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
            applications.map((app, index) => (
              <tr key={index}>
                <td>{app.name}</td>
                <td>{app.contact}</td>
                <td>{app.email}</td>
                <td>{app.experience}</td>
                <td>{app.currentSalary}</td>
                <td>{app.expectedSalary}</td>
                <td>{app.location}</td>
                <td>{app.jobRole}</td>
                <td>
                  {app.resumeUrl ? (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a>
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

export default AdminApplications;