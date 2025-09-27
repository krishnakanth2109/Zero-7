import React, { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, User, Phone, Mail, MapPin, FileText, DollarSign, Clock } from "lucide-react";
import "./CurrentHirings.css";

const API_URL = "http://localhost:5000"; 


// Your backend server URL

const CurrentHirings = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    resume: "",
  });

  const [applyData, setApplyData] = useState({
    name: "",
    contact: "",
    email: "",
    experience: "",
    currentSalary: "",
    expectedSalary: "",
    location: "",
    resume: null,
  });

  const [selectedJobIndex, setSelectedJobIndex] = useState(null);

  // Fetch job positions from the backend when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/jobs`);
        setJobPositions(response.data);
      } catch (error) {
        console.error("Error fetching job positions:", error);
        alert("Could not fetch job listings. Please try again later.");
      }
    };
    fetchJobs();
  }, []);

const handleApplyChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "resume") {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setApplyData({
        ...applyData,
        resume: {
          name: file.name,
          type: file.type,
          data: reader.result.split(",")[1], // Base64 only
        },
      });
    };
    reader.readAsDataURL(file);
  } else {
    setApplyData({ ...applyData, [name]: value });
  }
};


const handleApplySubmit = async (e) => {
  e.preventDefault();

  const selectedJob = jobPositions[selectedJobIndex];

  const formDataToSend = {
    ...applyData,
    jobRole: selectedJob.role,
  };

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzkJT0y4eIeKIcKEgmLl2A_QOmDuqan0uPBM_Z9GKn9rAC_tNQoT7E-KzwHOuA4RGNK/exec",
      {
        method: "POST",
        body: JSON.stringify(formDataToSend), // ✅ no headers
      }
    );

    const result = await response.json(); // Apps Script returns JSON
    if (result.result === "success") {
      alert("Application submitted!");
      setSelectedJobIndex(null);
      setApplyData({
        name: "",
        contact: "",
        email: "",
        experience: "",
        currentSalary: "",
        expectedSalary: "",
        location: "",
        resume: null,
      });
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    alert("Submission failed. Check console for details.");
  }
};




  
  return (
    <div className="current-hirings-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Current Hirings</h1>
          <p>Join the best companies through Zero7 Technologies</p>
        </div>
      </section>

      {/* Intro */}
      <section className="intro-section">
        <h2>We are Hiring!</h2>
        <p>
          At Zero7 Technologies, we connect freshers and experienced professionals
          with top companies. Fill out the form below to enroll and be a part of our hiring program.
        </p>
      </section>

      {/* Enrollment */}


      {/* Job Listings */}
      <section className="jobs-section">
        <h2>Available Job Positions</h2>
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
            {jobPositions.map((job, index) => (
              <React.Fragment key={job._id || index}>
                <tr>
                  <td>{job.role}</td>
                  <td>{job.exp}</td>
                  <td>{job.skills}</td>
                  <td>{job.salary}</td>
                  <td>{job.location}</td>
                  <td>
                    <button
                      className="apply-btn"
                      onClick={() => setSelectedJobIndex(index === selectedJobIndex ? null : index)}
                    >
                      {selectedJobIndex === index ? "Close" : "Apply"}
                    </button>
                  </td>
                </tr>

                {selectedJobIndex === index && (
                  <tr className="apply-form-row">
                    <td colSpan="6">
                      <div className="apply-form-container slide-down">
               <h3><Briefcase size={20} className="icon" /> Apply for {job.role}</h3>

                        <form onSubmit={handleApplySubmit} className="apply-form">
                          <div className="input-group">
                            <User size={16} /> <input type="text" name="name" placeholder="Your Name" value={applyData.name} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group">
                            <Phone size={16} /> <input type="tel" name="contact" placeholder="Contact Number" value={applyData.contact} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group">
                            <Mail size={16} /> <input type="email" name="email" placeholder="Email Address" value={applyData.email} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group">
                            <Clock size={16} /> <input type="text" name="experience" placeholder="Experience (in years)" value={applyData.experience} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group">
                            <DollarSign size={16} /> <input type="text" name="currentSalary" placeholder="Current Salary" value={applyData.currentSalary} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group">
                            <DollarSign size={16} /> <input type="text" name="expectedSalary" placeholder="Expected Salary" value={applyData.expectedSalary} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group">
                            <MapPin size={16} /> <input type="text" name="location" placeholder="Your Location" value={applyData.location} onChange={handleApplyChange} required />
                          </div>
                          <div className="input-group file-input">
                            <FileText size={16} /> <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleApplyChange} required />
                          </div>
                          <div className="form-buttons">
                            <button type="submit">Submit Application</button>
                            <button type="button" className="cancel-btn" onClick={() => setSelectedJobIndex(null)}>Cancel</button>
                          </div>
                        </form>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default CurrentHirings;