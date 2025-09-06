import React, { useState } from "react";
import "./Home.css";
import Context from "./Context.jsx";

// Reusable FlipCard component
const FlipCard = ({ image, title, children }) => {
  const [tiltStyle, setTiltStyle] = useState({});
  const [flipped, setFlipped] = useState(false);

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 10;
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: "rotateX(0deg) rotateY(0deg) scale(1)" });
    setFlipped(false);
  };

  const handleMouseEnter = () => {
    setFlipped(true);
  };

  return (
    <div
      className={`flip-card ${flipped ? "is-flipped" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      tabIndex="0"
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <div className="flip-card-inner" style={tiltStyle}>
        <div className="flip-card-front">
          <img src={image} alt={title} className="flip-card-image" />
          <div className="flip-card-front-caption">
            <h3>{title}</h3>
          </div>
        </div>

        <div className="flip-card-back">
          <div className="flip-card-back-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    purpose: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    alert("Form submitted successfully! Manager will be notified.");
    setShowForm(false);
    setFormData({ name: "", number: "", email: "", purpose: "" });
  };

  return (
    <div className="home-root">
      {/* Hero with background video only */}
      <header className="video-hero" role="banner">
        <video
          className="hero-video"
          src="/Logo video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </header>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-heading">Our Offerings</h2>
          <p className="section-lead">Practical learning. Real-world outcomes.</p>

          <div className="cards-grid">
            <FlipCard image="/image13.jpg" title="Training & Upskilling">
              <h3>Training & Upskilling</h3>
              <p>
                Customized programs, hands-on projects and placement support for
                freshers & professionals.
              </p>
              <button className="card-btn" onClick={() => setShowForm(true)}>
                Get Started
              </button>
            </FlipCard>

            <FlipCard image="/image14.jpg" title="Recruitment">
              <h3>Recruitment</h3>
              <p>
                End-to-end talent solutions for startups & enterprises —
                screening, interviewing and onboarding.
              </p>
              <button className="card-btn" onClick={() => setShowForm(true)}>
                Contact Sales
              </button>
            </FlipCard>

            <FlipCard image="/image15.jpg" title="Career Coaching">
              <h3>Career Coaching</h3>
              <p>
                1-on-1 mentoring, resume & interview prep to boost your career
                trajectory.
              </p>
              <button className="card-btn" onClick={() => setShowForm(true)}>
                Book Mentor
              </button>
            </FlipCard>
          </div>
        </div>
      </section>

      {/* Keep Context */}
      <Context />

      {/* Popup Form */}
      {showForm && (
        <div className="form-popup" role="dialog" aria-modal="true">
          <div className="form-container">
            <button
              className="form-close-x"
              aria-label="Close"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h3>Career Consultation Form</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="number"
                placeholder="Your Number"
                value={formData.number}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="purpose"
                placeholder="Purpose of Consultation"
                value={formData.purpose}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
