import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Ittraining.css";

// ✅ Use env variable with fallback
const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}/it-programs`;

const Ittraining = () => {
  const [programs, setPrograms] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error fetching IT programs:", err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="ittraining-container">
      {/* Hero Banner */}
      <section className="it-hero">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="IT Training Banner"
          className="it-hero-image"
        />
        <div className="it-hero-overlay">
          <h1>IT Training & Placement Services</h1>
          <p>
            Learn industry-ready skills with certification support, real-world
            projects, and guaranteed interview opportunities.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="it-programs-section">
        <h2 className="section-heading">Our Training Programs</h2>
        <p className="section-subheading">
          Explore our specialized IT training courses designed with
          placement-focused outcomes.
        </p>

        <div className="it-courses-grid">
          {programs.map((course) => (
            <div
              key={course._id}
              ref={(el) => (cardRefs.current[course._id] = el)}
              className={`it-course-card ${
                expandedId === course._id ? "expanded" : ""
              }`}
            >
              <div className="it-course-icon">{course.icon}</div>
              <h3 className="it-course-title">{course.title}</h3>
              <p className="it-course-description">{course.description}</p>
              <span className="price-badge">{course.price}</span>

              <button
                className="it-learn-more-btn"
                onClick={() => toggleExpand(course._id)}
              >
                {expandedId === course._id ? "Show Less" : "Learn More"}
              </button>

              {expandedId === course._id && (
                <div className="it-course-details">
                  <p>{course.details}</p>
                  <h4>Technologies Covered:</h4>
                  <div className="tech-badge-container">
                    {course.technologies?.map((tech, index) => (
                      <span key={index} className="it-tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="placement-info">
                    <h4>Placement Assistance:</h4>
                    <ul>
                      <li>Resume building & mock interviews</li>
                      <li>Certification guidance</li>
                      <li>Interview opportunities with IT firms & MNCs</li>
                      <li>Career mentorship sessions</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Ittraining;
