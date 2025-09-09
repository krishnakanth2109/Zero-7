import React, { useState } from "react";
import "./Home.css";
import Context from "./Context.jsx";

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
