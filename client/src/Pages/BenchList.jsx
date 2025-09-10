import React, { useState, useEffect } from "react";
import "./BenchList.css";

const BenchList = () => {
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ candidates: 0, clients: 0, placements: 0 });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Sample candidate data
  const candidates = [
    { id: 1, name: "Rahul Sharma With A Very Long Name Example For Tooltip", role: "Java Developer", exp: "2 Years", location: "Hyderabad", email: "rahul@example.com", phone: "+91 9876543210" },
    { id: 2, name: "Sneha Reddy", role: "React Developer With Long Role Name Tooltip Test", exp: "1.5 Years", location: "Bangalore", email: "sneha@example.com", phone: "+91 9876509876" },
    { id: 3, name: "Amit Verma", role: "Data Analyst", exp: "2 Years", location: "Pune", email: "amit@example.com", phone: "+91 9845123456" },
  ];

  // Sample testimonials
  const testimonials = [
    {
      name: "Ramesh - HR Manager",
      text: "Zero7 helped us find quality candidates in record time. Excellent service!",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya - Placed Candidate",
      text: "The resume marketing service worked for me. I got interviews within a week!",
      img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "Sandeep - Client",
      text: "Professional team, transparent process, and great support. Highly recommend.",
      img: "https://randomuser.me/api/portraits/men/46.jpg",
    },
  ];

  // FAQs
  const faqs = [
    { q: "What is Bench Marketing?", a: "Bench marketing helps candidates on the bench find suitable projects quickly by connecting them with clients." },
    { q: "How does Resume Marketing work?", a: "We promote your profile to employers, schedule interviews, and guide you through placements." },
    { q: "Is there any fee involved?", a: "Yes, minimal charges apply for professional services. Contact us for details." },
    { q: "How long does it take to get placed?", a: "On average, candidates get interview calls within 1-3 weeks depending on demand." },
  ];

  // Animate stats
  useEffect(() => {
    let c = 0, cl = 0, p = 0;
    const interval = setInterval(() => {
      if (c < 250) c++;
      if (cl < 120) cl++;
      if (p < 500) p++;
      setStats({ candidates: c, clients: cl, placements: p });
      if (c === 250 && cl === 120 && p === 500) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bench-page">
      {/* Hero Section */}
      <section className="hero-section">
  <div className="overlay">
    <h1>Zero7 Bench List</h1>
    <p>Connecting skilled professionals with top MNCs – explore our available talent today!</p>
    <button className="btn-gradient" onClick={() => setShowForm(true)}>
      Register Now
    </button>
  </div>
</section>
      {/* Registration */}
      <section className="registration-section">
        <h2>Resume Marketing Registration</h2>
        <p>
          Join our <strong>Bench Program</strong> to get placed faster! Our management will inform you
          about the fees for resume marketing. Fill the form below to connect with us directly.
        </p>
        <button className="btn-gradient" onClick={() => setShowForm(true)}>
          Connect with Management
        </button>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card"><h2>{stats.candidates}+</h2><p>Candidates Available</p></div>
        <div className="stat-card"><h2>{stats.clients}+</h2><p>Clients Served</p></div>
        <div className="stat-card"><h2>{stats.placements}+</h2><p>Placements Done</p></div>
      </section>

      {/* Candidate List */}
      <section className="candidates-section">
        <h2>Available Candidates</h2>
        <div className="candidate-table-wrapper">
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Experience</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td title={c.name}>{c.name}</td>
                  <td title={c.role}>{c.role}</td>
                  <td title={c.exp}>{c.exp}</td>
                  <td title={c.location}>{c.location}</td>
                  <td>
                    <button className="btn-gradient" onClick={() => setSelectedCandidate(c)}>
                      Get Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Candidate details popup */}
        {selectedCandidate && (
          <div className="popup-form-overlay">
            <div className="popup-form">
              <h2>Candidate Details</h2>
              <p><strong>Name:</strong> {selectedCandidate.name}</p>
              <p><strong>Role:</strong> {selectedCandidate.role}</p>
              <p><strong>Experience:</strong> {selectedCandidate.exp}</p>
              <p><strong>Location:</strong> {selectedCandidate.location}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedCandidate.email}`}>{selectedCandidate.email}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${selectedCandidate.phone}`}>{selectedCandidate.phone}</a></p>
              <div className="form-actions">
                <button className="btn-gradient" onClick={() => setSelectedCandidate(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Info Flip Cards */}
      <section className="extra-section">
        <h2>Why Choose Our Bench Program?</h2>
        <div className="info-cards">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/faster.jpg" alt="Faster Hiring" />
                <h3>Faster Hiring</h3>
              </div>
              <div className="flip-card-back">
                <p>Our candidates are pre-screened, ensuring clients save time in recruitment.</p>
              </div>
            </div>
          </div>
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/trusted.jpg" alt="Trusted Network" />
                <h3>Trusted Network</h3>
              </div>
              <div className="flip-card-back">
                <p>Strong tie-ups with MNCs and startups to connect talent with opportunity.</p>
              </div>
            </div>
          </div>
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/support.jpg" alt="Support" />
                <h3>End-to-End Support</h3>
              </div>
              <div className="flip-card-back">
                <p>From resume marketing to interview prep, we guide you at every step.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <h2>How Our Bench Process Works</h2>
        <div className="process-steps">
          <div className="process-card"><h3>Step 1</h3><p>Candidate registers with Zero7 Bench Program.</p></div>
          <div className="process-card"><h3>Step 2</h3><p>Our team markets resumes to potential clients.</p></div>
          <div className="process-card"><h3>Step 3</h3><p>Interviews scheduled with top companies.</p></div>
          <div className="process-card"><h3>Step 4</h3><p>Candidate gets placed with full support from our team.</p></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Clients & Students Say</h2>
        <div className="testimonial-cards">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <img src={t.img} alt={t.name} className="testimonial-img" />
              <p>"{t.text}"</p>
              <h4>- {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div className={`faq-item ${openFAQ === i ? "open" : ""}`} key={i}>
            <button className="faq-question" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
              {f.q} <span>{openFAQ === i ? "−" : "+"}</span>
            </button>
            <div className="faq-answer"><p>{f.a}</p></div>
          </div>
        ))}
      </section>

      {/* Popup Registration Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Connect with Management</h2>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="tel" placeholder="Your Contact Number" required />
              <textarea placeholder="Your Query / Purpose" required></textarea>
              <div className="form-actions">
                <button type="submit" className="btn-gradient">Submit</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenchList;
