// File: src/Pages/AdminStudentEnrollment.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios"; // Use your central axios instance
import "./AdminStudentEnrollment.css";

// Renamed component for clarity
const AdminCandidateEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        // --- FIXED: Fetch from the new, correctly named endpoint ---
        const { data } = await api.get("/candidate-enrollment");
        setEnrollments(data);
      } catch (e) {
        console.error("Error fetching enrollments:", e);
        setError("Failed to load enrollments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="view-enrollments-container">
      <h2 className="enrollments-title">Candidate Enrollments</h2>

      {loading && <div className="loading-spinner"></div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="enrollments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Location</th>
                <th>Role</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment, index) => (
                  <tr key={enrollment._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td>{enrollment.name}</td>
                    <td>{enrollment.contact}</td>
                    <td>{enrollment.email}</td>
                    <td>{enrollment.location}</td>
                    <td>{enrollment.role}</td>
                    <td>{enrollment.skills}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-enrollments">No new enrollments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateEnrollment;