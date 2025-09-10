import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/clg-cnt.jpg";
import "./CollegeConnect.css";

const CollegeConnect = () => {
  const navigate = useNavigate();

  const handleContactRedirect = () => {
    navigate("/contact");
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
        <form>
          <div className="form-group">
            <label>College Name</label>
            <input type="text" placeholder="Enter your college name" required />
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input type="text" placeholder="Enter contact person name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" placeholder="Enter phone number" required />
          </div>

          <div className="form-group">
            <label>Proposal Type</label>
            <select required>
              <option value="">-- Select --</option>
              <option value="placements">Placements</option>
              <option value="technologies">Technologies</option>
              <option value="internships">Internships</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Write your proposal..." required></textarea>
          </div>

          <button type="submit" className="btn-primary">Submit Proposal</button>
        </form>
      </section>
    </div>
  );
};

export default CollegeConnect;
