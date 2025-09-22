import React, { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, User, Phone, Mail, MapPin, FileText, DollarSign, Clock } from "lucide-react";
import "./CurrentHirings.css";

const API_URL = "http://localhost:5000"; // Your backend server URL

const CurrentHirings = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    resume: null,
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enrollmentData = new FormData();
    enrollmentData.append("name", formData.name);
    enrollmentData.append("contact", formData.contact);
    enrollmentData.append("email", formData.email);
    enrollmentData.append("location", formData.location);
    enrollmentData.append("resume", formData.resume);

    try {
      await axios.post(`${API_URL}/api/enrollments`, enrollmentData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Enrollment form submitted successfully! ✅");
      console.log("Enrollment Data:", formData);
      setFormData({
        name: "",
        contact: "",
        email: "",
        location: "",
        resume: null,
      });
      // Clear the file input manually
      e.target.reset();
    } catch (error) {
      console.error("Error submitting enrollment form:", error);
      alert("Failed to submit enrollment form. Please check the console for details.");
    }
  };

  const handleApplyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setApplyData({ ...applyData, resume: files[0] });
    } else {
      setApplyData({ ...applyData, [name]: value });
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (selectedJobIndex === null) return;

    const job = jobPositions[selectedJobIndex];
    const applicationData = new FormData();
    applicationData.append("jobId", job._id);
    applicationData.append("name", applyData.name);
    applicationData.append("contact", applyData.contact);
    applicationData.append("email", applyData.email);
    applicationData.append("experience", applyData.experience);
    applicationData.append("currentSalary", applyData.currentSalary);
    applicationData.append("expectedSalary", applyData.expectedSalary);
    applicationData.append("location", applyData.location);
    applicationData.append("resume", applyData.resume);

    try {
      await axios.post(`${API_URL}/api/applications`, applicationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Application submitted for ${job.role} ✅`);
      console.log("Application Data:", applyData);
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
      setSelectedJobIndex(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please check the console for details.");
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
      <section className="form-section">
        <h2>Student Enrollment Form</h2>
        <form onSubmit={handleSubmit} className="enrollment-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Your Location" value={formData.location} onChange={handleChange} required />
          <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required />
          <button type="submit">Submit</button>
        </form>
      </section>

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