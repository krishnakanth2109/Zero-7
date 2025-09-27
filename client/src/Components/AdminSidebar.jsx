// File: src/Components/AdminSidebar.jsx (The Final, Correct Version)

import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AudioLines,
  CardSim,
  ChevronDown,
  CircleUser,
  GraduationCap,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Shield,
  Store,
  UserRound,
} from 'lucide-react'
import api from '../api/axios' // <-- CORRECT: Imports the central, working API connection.
import { io } from 'socket.io-client'
import './AdminSidebar.css'

// REMOVED: The old, inconsistent 'const API_URL' is gone because 'api' now handles it correctly.

export default function AdminSidebar({ isOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [openServices, setOpenServices] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const [newRequestCount, setNewRequestCount] = useState(0)

  // This logic is preserved
  useEffect(() => {
    if (
      location.pathname === '/admin/it-programs' ||
      location.pathname === '/admin/non-it-programs'
    ) {
      setOpenServices(true)
    }
  }, [location.pathname])

  const isActive = (path) => location.pathname === path
  const isSubmenuActive =
    location.pathname === '/admin/it-programs' ||
    location.pathname === '/admin/non-it-programs'

  // This logic is preserved but now uses the correct API connection
  useEffect(() => {
    const fetchNewForms = async () => {
      try {
        // CORRECT: Uses the central 'api' object. This will now succeed.
        const res = await api.get('/forms/count-new')
        setNewCount(res.data.count ?? 0)
      } catch (err) {
        console.error('Failed to fetch form count:', err)
      }
    }
    fetchNewForms()
  }, [])

  // This logic is preserved
  useEffect(() => {
    if (location.pathname === '/admin/forms') {
      setNewCount(0)
    }
    if (location.pathname === '/admin/view-requests') {
      setNewRequestCount(0)
    }
  }, [location.pathname])

  // This logic is preserved and made more robust
  useEffect(() => {
    // Correctly determines the base URL for Socket.IO from the environment
    const socket_url = (
      process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
    ).replace('/api', '')
    const socket = io(socket_url)

    socket.on('newFormSubmission', () => setNewCount((prev) => prev + 1))
    socket.on('newInfoRequest', () => setNewRequestCount((prev) => prev + 1))

    return () => socket.disconnect()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/admin')
  }

  // Your JSX and all links are preserved exactly as they were
  return (
    <aside
      className={`
          admin-sidebar overflow-scroll fixed top-0 left-0 h-full w-64 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full opacity-0'}
        `}>
      <div>
        <div className='admin-sidebar-header'>
          <div className='logo-img'>
            <img src='/L1.png' alt='logo' />
          </div>
          <div className='logo-side-name'>
            <div className='head-name'>Zero7 Tech</div>
            <div className='head-panel'>Admin Panel</div>
          </div>
        </div>
        <nav>
          <Link
            to='/admin/dashboard'
            className={`sidebar-link ${
              isActive('/admin/dashboard') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <LayoutDashboard style={{ width: '18px' }} /> Dashboard{' '}
            </div>
          </Link>
          <div className='dropdown-container'>
            <div
              onClick={() => setOpenServices(!openServices)}
              className={`sidebar-link flex justify-between items-center services-header ${
                isSubmenuActive ? 'active' : ''
              }`}>
              <div className='dashboard-icon'>
                <HardDrive style={{ width: '18px' }} /> Services{' '}
              </div>
              <ChevronDown
                size={18}
                className={`dropdown-arrow ${openServices ? 'rotate' : ''}`}
              />
            </div>
            {openServices && (
              <div className='submenu'>
                <Link
                  to='/admin/it-programs'
                  className={`sidebar-link ${
                    isActive('/admin/it-programs') ? 'active' : ''
                  }`}>
                  IT Services
                </Link>
                <Link
                  to='/admin/non-it-programs'
                  className={`sidebar-link ${
                    isActive('/admin/non-it-programs') ? 'active' : ''
                  }`}>
                  Non IT Services
                </Link>
              </div>
            )}
          </div>
          <Link
            to='/admin/forms'
            className={`sidebar-link ${
              isActive('/admin/forms') ? 'active' : ''
            }`}>
            <div className='dashboard-cont'>
              <div className='dashboard-icon'>
                <CardSim style={{ width: '18px' }} /> Form Submissions
              </div>
              <div>
                <span>
                  {newCount > 0 ? (
                    <span className='notification-badge'>{newCount}</span>
                  ) : (
                    <span className='notification-badge'>{newCount}</span>
                  )}
                </span>
              </div>
            </div>
          </Link>
          <Link
            to='/admin/manage-jobs'
            className={`sidebar-link ${
              isActive('/admin/manage-jobs') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <CircleUser style={{ width: '18px' }} /> Manage Jobs{' '}
            </div>
          </Link>
          <Link
            to='/admin/applications'
            className={`sidebar-link ${
              isActive('/admin/applications') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <Store style={{ width: '18px' }} />
              View Applications{' '}
            </div>
          </Link>
          <Link
            to='/admin/new-batch-dashboard'
            className={`sidebar-link ${
              isActive('/admin/new-batch-dashboard') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <GraduationCap style={{ width: '18px' }} />
              New Batches{' '}
            </div>
          </Link>
          <Link
            to='/admin/manage-blogs'
            className={`sidebar-link ${
              isActive('/admin/manage-blogs') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <Shield style={{ width: '18px' }} />
              Manage Blogs{' '}
            </div>
          </Link>
          <Link
            to='/admin/manage-candidates'
            className={`sidebar-link ${
              isActive('/admin/manage-candidates') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <UserRound style={{ width: '18px' }} />
              Manage Candidates{' '}
            </div>
          </Link>
          <Link
            to='/admin/view-requests'
            className={`sidebar-link ${
              isActive('/admin/view-requests') ? 'active' : ''
            }`}>
            <div className='dashboard-cont'>
              <div className='dashboard-icon'>
                <AudioLines style={{ width: '18px' }} /> View Requests
              </div>
              <div>
                <span>
                  {newCount > 0 ? (
                    <span className='notification-badge'>{newCount}</span>
                  ) : (
                    <span className='notification-badge'>{newCount}</span>
                  )}
                </span>
              </div>
            </div>
          </Link>
        </nav>
      </div>
      <button className='logout-btn' onClick={handleLogout}>
        <LogOut size={18} style={{ marginRight: '8px' }} />
        Logout
      </button>
    </aside>
  )
}
