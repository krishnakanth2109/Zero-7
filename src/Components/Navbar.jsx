import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close dropdowns when mobile menu is toggled
    if (!isMobileMenuOpen) {
      setIsServicesOpen(false);
      setIsTrainingOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/Logo6.jpg" alt="Zero7 Technologies Logo" className="logo-img" />
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
              About Us
            </Link>
          </li>

          {/* Services Dropdown */}
          <li
            className="nav-item services-item"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            onClick={() => setIsServicesOpen(!isServicesOpen)}
          >
            <div className="nav-links">
              Services
              <FontAwesomeIcon
                icon={isServicesOpen ? faChevronUp : faChevronDown}
                className="dropdown-icon"
              />
            </div>
            {isServicesOpen && (
              <ul className="services-dropdown">
                <li
                  className="training-submenu"
                  onMouseEnter={() => setIsTrainingOpen(true)}
                  onMouseLeave={() => setIsTrainingOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="dropdown-link">
                    Training
                    <FontAwesomeIcon
                      icon={isTrainingOpen ? faChevronUp : faChevronDown}
                      className="submenu-icon"
                    />
                  </div>
                  {isTrainingOpen && (
                    <ul className="training-dropdown">
                      <li>
                        <Link to="/services/it-training" className="dropdown-link" onClick={closeMobileMenu}>
                          IT Training
                        </Link>
                      </li>
                      <li>
                        <Link to="/services/non-it-training" className="dropdown-link" onClick={closeMobileMenu}>
                          Non-IT Training
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link to="/services/payroll-services" className="dropdown-link" onClick={closeMobileMenu}>
                    Payroll Services
                  </Link>
                </li>
                <li>
                  <Link to="/services/resume-marketing" className="dropdown-link" onClick={closeMobileMenu}>
                    Resume Marketing
                  </Link>
                </li>
                <li>
                  <Link to="/services/campus-hiring" className="dropdown-link" onClick={closeMobileMenu}>
                Campus Hiring
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link to="/college-connect" className="nav-links" onClick={closeMobileMenu}>
              College Connect
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/new-batches" className="nav-links" onClick={closeMobileMenu}>
              New Batches
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/digital-courses" className="nav-links" onClick={closeMobileMenu}>
              Digital Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
              Contact Us
            </Link>
          </li>

          {/* Blog link, no dropdown */}
          <li className="nav-item">
            <Link to="/blog" className="nav-links" onClick={closeMobileMenu}>
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
