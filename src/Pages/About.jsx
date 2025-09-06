import React, { useEffect, useState } from "react";
import "./About.css";

const About = () => {
  const [stats, setStats] = useState({
    careers: 0,
    partners: 0,
    retention: 0,
  });

  // Animate stats dynamically
  useEffect(() => {
    let careers = 0;
    let partners = 0;
    let retention = 0;

    const interval = setInterval(() => {
      if (careers < 5000) careers += 100;
      if (partners < 120) partners += 5;
      if (retention < 94) retention += 2;

      setStats({
        careers: careers > 5000 ? 5000 : careers,
        partners: partners > 120 ? 120 : partners,
        retention: retention > 94 ? 94 : retention,
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <h1>About Zero7 Technologies</h1>
          <p className="subheading">
            Building bridges between ambition and opportunity in the new world of work
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="who-we-are">
        <div className="container">
          <div className="section-content">
            <div className="text-content">
              <h2>Who We Are</h2>
              <p>
                At <strong>Zero7 Technologies</strong>, we are more than just a workforce
                solutions provider—we are career builders and innovation enablers.
                Established in 2025, our mission is to empower job seekers, career
                changers, and professionals with gaps to re-enter the job market with
                confidence.
              </p>
              <p>
                We specialize in <b>IT & Non-IT Training</b>, <b>Resume Marketing</b>,
                <b> Payroll Process Outsourcing</b>, and <b>Campus Drives</b>. Our
                unique approach blends human-centric mentoring with modern tools that
                make careers future-proof.
              </p>
              <p>
                With our dedicated team, strong industry partnerships, and
                community-driven approach, we ensure that talent and opportunity find
                their perfect match.
              </p>
            </div>
            <div className="image-container">
              <img
                src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className="vision-values">
        <div className="container">
          <h2>Our Core Beliefs</h2>
          <p className="section-intro">
            These principles guide every step of our journey
          </p>

          <div className="values-grid">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    alt="Potential"
                  />
                </div>
                <div className="flip-card-back">
                  <h3>Potential Over Pedigree</h3>
                  <p>
                    We believe talent is everywhere. Our programs focus on
                    nurturing hidden potential rather than just credentials.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                    alt="Partnership"
                  />
                </div>
                <div className="flip-card-back">
                  <h3>Partnership, Not Transactions</h3>
                  <p>
                    We build long-term relationships with individuals and
                    organizations—success for us means sustainable growth for
                    everyone involved.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                    alt="Data Meets Humanity"
                  />
                </div>
                <div className="flip-card-back">
                  <h3>Data Meets Humanity</h3>
                  <p>
                    We use analytics and market intelligence to empower careers,
                    but we never forget the human story behind every number.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d"
                    alt="Innovation"
                  />
                </div>
                <div className="flip-card-back">
                  <h3>Innovation at Core</h3>
                  <p>
                    Our solutions evolve with the future of work—ensuring that
                    every professional stays relevant and every company stays
                    competitive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{stats.careers}+</span>
          <span className="stat-label">Careers Transformed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.partners}+</span>
          <span className="stat-label">Enterprise Partners</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.retention}%</span>
          <span className="stat-label">Placement Retention</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Be Part of the Change</h2>
        <p>
          Whether you’re a job seeker or a business looking for top talent,
          Zero7 Technologies is here to support your growth journey.
        </p>
        <div className="cta-buttons">
          <button className="primary-btn">Join Our Mission</button>
          <button className="secondary-btn">Explore Opportunities</button>
        </div>
      </section>
    </div>
  );
};

export default About;
