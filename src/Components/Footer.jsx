import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin, FaWhatsapp, FaPaperPlane } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-section">
          <div className="new">
          <p className="tagline">
            Crafting unforgettable digital experiences with innovative solutions. 
            Your vision, our expertise.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
          </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
            <li><Link to="/about" onClick={scrollToTop}>About Us</Link></li>
            <li><Link to="/services/payroll-Services" onClick={scrollToTop}>Payroll Services</Link></li>
            <li><Link to="/campus-hiring" onClick={scrollToTop}>Campus Hiring & Drives</Link></li>
            <li><Link to="/college-connect" onClick={scrollToTop}>College Connect</Link></li>
          </ul>
        </div>

        {/* Our Expertise */}
        <div className="footer-section">
          <h3 className="footer-title">Our Expertise</h3>
          <ul>
            <li>Talent Acquisition</li>
            <li>HR Solutions</li>
            <li>Campus Engagement</li>
            <li>Career Development</li>
            <li>Technology Advisory</li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="footer-section">
          <h3 className="footer-title">Stay Connected</h3>
          <p>Subscribe for insights, latest trends, and exclusive updates.</p>
          <div className="subscribe-box">
            <input type="email" placeholder="Your Email Address" />
            <button className="send-btn">
              <FaPaperPlane />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2025 Zero7 Technologies. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
