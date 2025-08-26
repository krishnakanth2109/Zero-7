import React, { useState, useEffect } from "react";
import "./Home.css";
import Context from "./Context.jsx";

const images = [
  "/imgg.png",
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
];

const SLIDE_DURATION = 10000; // 10s per image

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    purpose: "",
  });

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto slide
  useEffect(() => {
    const timer = setTimeout(goToNext, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Progress bar animation
  useEffect(() => {
    let start = Date.now();
    let frame;

    const animate = () => {
      let elapsed = Date.now() - start;
      let percentage = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(percentage);

      if (percentage < 100) {
        frame = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [currentIndex]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    alert("Form submitted successfully! Manager will be notified.");
    setShowForm(false);
    setFormData({ name: "", number: "", email: "", purpose: "" });
  };

  return (
    <div>
      {/* ✅ Hero Slider Section */}
      <div className="slider">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="slide"
            className={`slider-image ${index === currentIndex ? "active" : ""}`}
          />
        ))}

        <button className="prev" onClick={goToPrev}>❮</button>
        <button className="next" onClick={goToNext}>❯</button>
      </div>

      {/* ✅ Keep Context (main content below hero) */}
      <Context />

      {/* ✅ Popup Form */}
      {showForm && (
        <div className="form-popup">
          <div className="form-container">
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
