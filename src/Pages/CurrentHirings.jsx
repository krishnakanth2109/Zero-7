import React, { useState } from "react";
import { Briefcase, User, Phone, Mail, MapPin, FileText, DollarSign, Clock } from "lucide-react";
import "./CurrentHirings.css";

const CurrentHirings = () => {
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully! ✅");
    console.log("Form Data:", formData);
    setFormData({
      name: "",
      contact: "",
      email: "",
      location: "",
      resume: null,
    });
  };

  const handleApplyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setApplyData({ ...applyData, resume: files[0] });
    } else {
      setApplyData({ ...applyData, [name]: value });
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const job = jobPositions[selectedJobIndex];
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
  };

  const jobPositions = [
    { role: "Frontend Developer", exp: "0-2 yrs", skills: "React, JS, HTML, CSS", salary: "3-4 LPA", location: "Hyderabad" },
    { role: "Backend Developer", exp: "1-3 yrs", skills: "Node.js, Express, MongoDB", salary: "4-6 LPA", location: "Hyderabad" },
    { role: "Full Stack Developer", exp: "0-2 yrs", skills: "MERN Stack", salary: "3.5-5 LPA", location: "Bangalore" },
    { role: "Java Developer", exp: "1-2 yrs", skills: "Core Java, Spring Boot", salary: "4-6 LPA", location: "Pune" },
    { role: "Python Developer", exp: "0-2 yrs", skills: "Django, Flask, APIs", salary: "3-5 LPA", location: "Chennai" },
    { role: "Mobile App Developer", exp: "0-2 yrs", skills: "React Native, Flutter", salary: "3-4.5 LPA", location: "Remote" },
    { role: "UI/UX Designer", exp: "0-2 yrs", skills: "Figma, Adobe XD", salary: "3-4 LPA", location: "Hyderabad" },
    { role: "Cloud Engineer", exp: "1-2 yrs", skills: "AWS, Azure", salary: "5-7 LPA", location: "Bangalore" },
    { role: "Data Analyst", exp: "0-2 yrs", skills: "SQL, Excel, Power BI", salary: "3-4.5 LPA", location: "Hyderabad" },
    { role: "QA Tester", exp: "0-2 yrs", skills: "Manual, Automation", salary: "3-4 LPA", location: "Pune" },
  ];

  return (
    <div className="current-hirings-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* <img src="/hero-hiring.jpg" alt="Hiring Banner" className="hero-image" /> */}
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
              <React.Fragment key={index}>
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
