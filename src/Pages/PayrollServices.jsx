import React from "react";
import { FaMoneyCheckAlt, FaFileInvoiceDollar, FaUserTie, FaCogs } from "react-icons/fa";
import "./PayrollServices.css";

const PayrollServices = () => {
  return (
    <main className="ps-wrapper">

      {/* 1. Hero Section */}
      <section className="ps-hero">
        <div className="ps-hero-content">
          <h1>Simplify Payroll. Empower Your Workforce.</h1>
          <p>
            End-to-end payroll that’s accurate, compliant, and fast —
            supporting in-house and remote teams.
          </p>
          <a href="#consultation" className="ps-btn">
            Request Free Payroll Consultation
          </a>
        </div>
        <div className="ps-hero-img">
          <img
            src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200&auto=format&fit=crop"
            alt="Payroll team at work"
          />
        </div>
      </section>

      {/* 2. What We Offer (icons only) */}
      <section className="ps-offer">
        <div className="ps-section-head">
          <h2>What We Offer</h2>
        </div>
        <div className="ps-grid">

          <div className="ps-card">
            <div className="ps-icon-circle"><FaMoneyCheckAlt /></div>
            <h3>Salary Processing</h3>
            <p>Accurate payroll for in-house and remote staff.</p>
          </div>

          <div className="ps-card">
            <div className="ps-icon-circle"><FaFileInvoiceDollar /></div>
            <h3>Tax & Compliance</h3>
            <p>Manage TDS, ESI, PF, and statutory filings with ease.</p>
          </div>

          <div className="ps-card">
            <div className="ps-icon-circle"><FaUserTie /></div>
            <h3>Contractor Support</h3>
            <p>Flexible payroll for freelancers and contractors.</p>
          </div>

          <div className="ps-card">
            <div className="ps-icon-circle"><FaCogs /></div>
            <h3>Custom Setup</h3>
            <p>Tailored payroll for startups and SMEs.</p>
          </div>

        </div>
      </section>

      {/* 3. Benefits & CTA */}
      <section className="ps-benefits" id="consultation">
        <div className="ps-benefits-img">
          <img
            src="https://images.unsplash.com/photo-1523958203904-cdcb402031fd?q=80&w=1200&auto=format&fit=crop"
            alt="Happy business team"
          />
        </div>
        <div className="ps-benefits-content">
          <h2>Benefits for Employers</h2>
          <ul>
            <li>Save time, reduce errors</li>
            <li>Stay compliant with labor laws</li>
            <li>Focus on core business</li>
          </ul>

          <form className="ps-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your name" required />
            <input type="email" placeholder="Work email" required />
            <input type="text" placeholder="Company" required />
            <button type="submit" className="ps-btn ps-btn-full">
              Request Free Payroll Consultation
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default PayrollServices;
