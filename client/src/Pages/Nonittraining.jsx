import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Nonittraining.css";

// ✅ Use env variable with fallback
const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}/non-it-programs`;

const Nonittraining = () => {
  const [programs, setPrograms] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(API_URL);
      setPrograms(res.data);
    } catch (err) {
      console.error("Error fetching Non-IT programs:", err);
    }
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="nonittraining-container">
      {/* Hero Banner */}
      <section className="nonit-hero">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Non-IT Training Banner"
          className="nonit-hero-image"
        />
        <div className="nonit-hero-overlay">
          <h1>Non-IT Training & Placement Services</h1>
          <p>
            Explore industry-demanded courses with 100% placement assistance in
            top companies.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="nonit-programs-section">
        <div className="nonit-courses-grid">
          {programs.map((course) => (
            <div
              key={course._id}
              className={`nonit-course-card ${
                expandedCard === course._id ? "expanded" : ""
              }`}
            >
              <div className="nonit-course-icon">{course.icon}</div>
              <h3 className="nonit-course-title">{course.title}</h3>
              <p className="nonit-course-description">{course.description}</p>

              <button
                className="nonit-learn-more-btn"
                onClick={() => toggleCard(course._id)}
              >
                {expandedCard === course._id ? "Show Less" : "Learn More"}
              </button>

              {expandedCard === course._id && (
                <div className="nonit-course-details">
                  {/* Details first */}
                  {course.details}

                  {/* Skills */}
                  {course.skills?.length > 0 && (
                    <>
                      <h4>Skills You’ll Gain:</h4>
                      <ul className="nonit-course-technologies">
                        {course.skills.map((skill, index) => (
                          <li key={index} className="nonit-tech-badge">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Duration */}
                  {course.duration && (
                    <p>
                      <strong>Duration:</strong> {course.duration}
                    </p>
                  )}

                  {/* Price */}
                  {course.price && (
                    <p className="nonit-price">
                      <strong>Course Fee:</strong> {course.price}
                    </p>
                  )}

                  <p className="nonit-placement">
                    ✅ Placement Support Available
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Nonittraining;
