import React from "react";
import "./Ittraining.css";

const Ittraining= () => {
  const itPrograms = [
    { id: 1, title: "Full Stack Development", description: "Master front-end and back-end technologies", price: "₹15,000", icon: "💻" },
    { id: 2, title: "Cloud & DevOps", description: "Learn cloud infrastructure and CI/CD pipelines", price: "₹40,000", icon: "☁️" },
    { id: 3, title: "Data Science & AI", description: "Explore machine learning and data analysis", price: "₹45,000", icon: "📊" },
    { id: 4, title: "Software Testing", description: "Become an expert in QA and automation", price: "₹30,000", icon: "🔍" }
  ];

  return (
    <div className="ittraining-container">
      <header className="it-page-header">
        <h1>IT Training Programs</h1>
        <p>Enhance your tech skills with our industry-relevant IT courses</p>
      </header>

      <section className="it-programs-section">
        <div className="it-courses-grid">
          {itPrograms.map((course) => (
            <div key={course.id} className="it-course-card">
              <div className="it-course-icon">{course.icon}</div>
              <h3 className="it-course-title">{course.title}</h3>
              <p className="it-course-description">{course.description}</p>
              <div className="it-course-price">{course.price}</div>
              <button className="it-learn-more-btn">Learn More</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Ittraining;
