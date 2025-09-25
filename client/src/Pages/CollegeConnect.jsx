import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/clg-cnt.jpg";
import "./CollegeConnect.css";

const CollegeConnect = () => {
  const navigate = useNavigate();

  const handleContactRedirect = () => {
    navigate("/contact");
  };

  // --- Form State ---
  const [formData, setFormData] = useState({
    collegeName: "",
    contactPerson: "",
    email: "",
    phone: "",
    proposalType: "",
    message: "",
  });

  const [status, setStatus] = useState(""); // For success/failure message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const url = "https://script.google.com/macros/s/AKfycbxWj5ICteqi9nWgKMhY4z7ztj81QU3CSRQk_IXLXtu86McNdMx41aQapkZX1r6dUoYt/exec"; // Replace with your Web App URL

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.status === "success") {
        setStatus("Proposal submitted successfully!");
        setFormData({
          collegeName: "",
          contactPerson: "",
          email: "",
          phone: "",
          proposalType: "",
          message: "",
        });
      } else {
        setStatus("Failed to submit proposal.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error submitting proposal.");
    }
  };

  return (
    <div className="college-connect">
      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <h1>Welcome to College Connect</h1>
          <p>Empowering Students with Opportunities for a brighter future.</p>
          <button className="btn-primary">Get Started</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About College Connect</h2>
        <p>
          College Connect is a platform designed to empower students by providing access to 
          internships, training programs, workshops, and placement opportunities. 
          We collaborate with colleges and universities to create a direct connection 
          between academic learning and industry needs.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Internships</h3>
            <p>Hands-on opportunities to gain real-world industry experience.</p>
          </div>
          <div className="feature-card">
            <h3>Training Programs</h3>
            <p>Specialized sessions to enhance skills and career readiness.</p>
          </div>
          <div className="feature-card">
            <h3>Workshops</h3>
            <p>Interactive workshops conducted by industry experts.</p>
          </div>
          <div className="feature-card">
            <h3>Placements</h3>
            <p>Connecting students with companies for their career growth.</p>
          </div>
        </div>
      </section>

      {/* Get Connected Section */}
      <section className="get-connected">
        <h2>Get Connected</h2>
        <p>
          Want to collaborate with us? Reach out today and let’s build a future together.
        </p>
        <button onClick={handleContactRedirect} className="btn-secondary">
          Contact Us
        </button>
      </section>

      {/* Proposal Form */}
      <section className="proposal-form">
        <h2>College to Company Proposal Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>College Name</label>
            <input
              type="text"
              name="collegeName"
              placeholder="Enter your college name"
              required
              value={formData.collegeName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              placeholder="Enter contact person name"
              required
              value={formData.contactPerson}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Proposal Type</label>
            <select
              name="proposalType"
              required
              value={formData.proposalType}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="placements">Placements</option>
              <option value="technologies">Technologies</option>
              <option value="internships">Internships</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Write your proposal..."
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">Submit Proposal</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </section>
    </div>
  );
};

export default CollegeConnect;
