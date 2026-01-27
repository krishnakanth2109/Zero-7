import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isMobileMenuOpen) setIsServicesOpen(false)
  }

  const toggleServices = (e) => {
    e.preventDefault();
    setIsServicesOpen(!isServicesOpen)
  }

  // Closes everything when switching to a main page (Home, About, etc)
  const handleMainLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }

  // Closes only the mobile drawer, keeps Services open on desktop
  const handleServiceClick = () => {
    if (window.innerWidth <= 960) {
      setIsMobileMenuOpen(false);
      setIsServicesOpen(false);
    }
  }

  return (
    <nav className={`navbar ${isServicesOpen ? 'services-expanded' : ''}`}>
      <div className='navbar-container'>
        <NavLink to='/' className='navbar-logo' onClick={handleMainLinkClick}>
          <img src='/Logo6.jpg' alt='Logo' className='logo-img' />
        </NavLink>

        <div className='mobile-menu-icon' onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className='nav-item'>
            <NavLink to='/' className={({ isActive }) => isActive ? 'nav-links active-link' : 'nav-links'} onClick={handleMainLinkClick}>Home</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/about' className={({ isActive }) => isActive ? 'nav-links active-link' : 'nav-links'} onClick={handleMainLinkClick}>About Us</NavLink>
          </li>

          {/* Services Parent */}
          <li className={`nav-item services-item ${isServicesOpen ? 'open' : ''}`}>
            <div className='nav-links' onClick={toggleServices} style={{ cursor: 'pointer' }}>
              Services <FontAwesomeIcon icon={isServicesOpen ? faChevronUp : faChevronDown} className='dropdown-icon' />
            </div>

            {/* FULL WIDTH SUB-HEADER */}
            <div className={`services-mega-menu ${isServicesOpen ? 'show' : ''}`}>
              <div className="mega-menu-container">
                <NavLink to='/services/it-training' className='menu-btn' onClick={handleServiceClick}>IT Training</NavLink>
                <NavLink to='/services/non-it-training' className='menu-btn' onClick={handleServiceClick}>Non-IT Training</NavLink>
                <NavLink to='/digital-courses' className='menu-btn' onClick={handleServiceClick}>Digital Courses</NavLink>
                <NavLink to='/services/resume-writing' className='menu-btn' onClick={handleServiceClick}>Resume Writing</NavLink>
                <NavLink to='/services/payroll-services' className='menu-btn' onClick={handleServiceClick}>Payroll Services</NavLink>
                <NavLink to='/services/resume-marketing' className='menu-btn' onClick={handleServiceClick}>Resume Marketing</NavLink>
                <NavLink to='/services/college-connect' className='menu-btn' onClick={handleServiceClick}>College Connect</NavLink>
              </div>
            </div>
          </li>

          <li className='nav-item'>
            <NavLink to='/new-batches' className={({ isActive }) => isActive ? 'nav-links active-link' : 'nav-links'} onClick={handleMainLinkClick}>New Batches</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/bench-list' className={({ isActive }) => isActive ? 'nav-links active-link' : 'nav-links'} onClick={handleMainLinkClick}>Bench List</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/current-hirings' className={({ isActive }) => isActive ? 'nav-links active-link' : 'nav-links'} onClick={handleMainLinkClick}>Current Hirings</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/contact' className={({ isActive }) => isActive ? 'nav-links active-link' : 'nav-links'} onClick={handleMainLinkClick}>Contact Us</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/blog' onClick={handleMainLinkClick} className='nav-links'>
              <img src='https://cdn-icons-png.flaticon.com/512/10026/10026257.png' alt='blog' style={{ height: '35px' }} />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar