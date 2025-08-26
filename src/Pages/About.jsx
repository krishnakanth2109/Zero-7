import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About Our Mission & Impact</h1>
          <p className="subheading">Building bridges between ambition and opportunity in the new world of work</p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="who-we-are">
        <div className="container">
          <div className="section-content">
            <div className="text-content">
              <h2>Who We Are</h2>
              <p>We're career architects and talent strategists united by a common belief: everyone deserves access to meaningful work, and every business deserves access to exceptional talent.</p>
              <p>Founded in 2018, we've grown from a passionate startup to a trusted partner for both job seekers and Fortune 500 companies. What sets us apart is our dual focus—we don't just place candidates, we prepare them through rigorous training programs developed with industry leaders.</p>
              <p>Our team brings together decades of experience in HR, education technology, and corporate training to create solutions that actually work in today's rapidly evolving job market.</p>
            </div>
            <div className="image-container">
              <img src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Diverse team collaborating in modern office" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className="vision-values">
        <div className="container">
          <h2>Our Core Beliefs</h2>
          <p className="section-intro">These principles guide every decision we make and relationship we build</p>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                </svg>
              </div>
              <h3>Potential Over Pedigree</h3>
              <p>We see beyond resumes to identify and develop raw talent. Our programs are designed to help people from all backgrounds succeed in high-growth careers.</p>
            </div>
            
            <div className="value-card">
              <div className="icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3l-5-5 5-5v3h4v4z"/>
                </svg>
              </div>
              <h3>Partnership, Not Transactions</h3>
              <p>We measure success by long-term career growth and team retention—not just placement numbers. Our clients become collaborators in curriculum development.</p>
            </div>
            
            <div className="value-card">
              <div className="icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3>Data Meets Humanity</h3>
              <p>While we leverage cutting-edge assessment tools and labor market analytics, we never forget that behind every data point is a human story.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="leadership">
        <div className="container">
          <h2>Our Leadership</h2>
          <p className="section-intro">The passionate minds building the future of work</p>
          
          <div className="founder-message">
            <div className="founder-image">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80" alt="Rajesh Verma, Founder & CEO" />
            </div>
            <div className="founder-text">
              <h3>Our Origin Story</h3>
              <blockquote>
                "After witnessing brilliant candidates get overlooked and companies struggle to find talent, I knew there had to be a better way. We're not just filling positions—we're creating economic mobility while solving critical business needs. Our alumni now lead teams at top companies, and that's the impact that keeps us going."
              </blockquote>
              <p className="founder-name">— Rajesh Verma, Founder & CEO</p>
              <p className="founder-credentials">Former Head of Talent Development at TechMahindra | HR Innovator Award Winner 2022</p>
            </div>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80" alt="Priya Sharma" />
              </div>
              <h3>Priya Sharma</h3>
              <p className="position">Chief Learning Officer</p>
              <p className="bio">Designed award-winning curricula used by 50+ corporate partners. Believes learning should be as dynamic as the workplace.</p>
            </div>
            
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80" alt="Amit Patel" />
              </div>
              <h3>Amit Patel</h3>
              <p className="position">Head of Strategic Partnerships</p>
              <p className="bio">Connects top talent with innovative companies. Known for his uncanny ability to match culture fit.</p>
            </div>
            
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80" alt="Neha Gupta" />
              </div>
              <h3>Neha Gupta</h3>
              <p className="position">Chief Operations Officer</p>
              <p className="bio">Scales solutions without sacrificing quality. Her operational rigor ensures we deliver on every promise.</p>
            </div>
          </div>
          
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Careers Transformed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">120+</span>
              <span className="stat-label">Enterprise Partners</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">94%</span>
              <span className="stat-label">Placement Retention</span>
            </div>
          </div>
          
          <div className="cta-buttons">
            <button className="primary-btn">Join Our Mission</button>
            <button className="secondary-btn">See Open Roles</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;