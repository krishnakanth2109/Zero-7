import React, { useEffect, useState } from "react";
import "./AdminViewApplications.css"; // Import the CSS file

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxf3HDT5zGZQqPkkDTC_72jSd-OASNrCd71FiRxtnv3Q3EK3o8YzfiHYRwBP1b_StjJ/exec"; // replace with your script URL

const ViewEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch data on component mount
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await fetch(GOOGLE_SHEETS_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnrollments(data);
      } catch (e) {
        console.error("Error fetching enrollments:", e);
        setError("Failed to load enrollments. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchEnrollments();
  }, []);




  return (
    <div className="view-enrollments-container">
      <h2 className="enrollments-title">Enrolled Students</h2>

      {loading && (
        <div className="loading-spinner">
        </div>
        
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="enrollments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Location</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((student, index) => (
                  <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td>{student.Name}</td>
                    <td>{student.Contact}</td>
                    <td>{student.Email}</td>
                    <td>{student.Location}</td>
                    <td>
                      <a 
                        href={student.Resume} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="resume-link"
                      >
                        View Resume
                      </a>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-enrollments">No enrollments yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewEnrollments;