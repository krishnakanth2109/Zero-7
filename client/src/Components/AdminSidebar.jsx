// File: src/Components/AdminSidebar.jsx (Complete and Corrected)

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
  UserCog,
  UserRound,
  UserSearch,
} from 'lucide-react'
import api from '../api/axios'
import { io } from 'socket.io-client'
import Cookie from 'js-cookie'
import './AdminSidebar.css'

export default function AdminSidebar({ isOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [openServices, setOpenServices] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const [newRequestCount, setNewRequestCount] = useState(0)

  useEffect(() => {
    if (
      location.pathname.startsWith('/admin/it-programs') ||
      location.pathname.startsWith('/admin/non-it-programs')
    ) {
      setOpenServices(true)
    }
  }, [location.pathname])

  const isActive = (path) => location.pathname === path
  const isSubmenuActive = location.pathname.includes('programs')

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get('/forms/count-new')
        setNewCount(res.data.count ?? 0)
      } catch (err) {
        console.error('Failed to fetch counts:', err)
      }
    }
    fetchCounts()
  }, [])

  useEffect(() => {
    if (location.pathname === '/admin/forms') setNewCount(0)
    if (location.pathname === '/admin/view-requests') setNewRequestCount(0)
  }, [location.pathname])

  useEffect(() => {
    const socket_url = (
      process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
    ).replace('/api', '')
    const socket = io(socket_url)

    socket.on('newFormSubmission', () => setNewCount((prev) => prev + 1))
    socket.on('newInfoRequest', () => setNewRequestCount((prev) => prev + 1))

    return () => socket.disconnect()
  }, [])

  const handleLogout = () => {
    Cookie.remove('token')
    Cookie.remove('user')
    navigate('/admin')
  }

  return (
    <aside
      className={`admin-sidebar overflow-scroll ${!isOpen ? 'collapsed' : ''}`}>
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
            }`}
            data-tooltip='Dashboard'>
            <div className='dashboard-icon'>
              <LayoutDashboard style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>Dashboard</span>
            </div>
          </Link>

          <div className='dropdown-container'>
            <div
              onClick={() => setOpenServices(!openServices)}
              className={`sidebar-link services-header ${
                isSubmenuActive ? 'active' : ''
              }`}
              data-tooltip='Services'>
              <div className='dashboard-icon'>
                <HardDrive style={{ width: '18px', flexShrink: 0 }} />{' '}
                <span className='link-text'>Services</span>
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
                  }`}
                  data-tooltip='IT Services'>
                  IT Services
                </Link>
                <Link
                  to='/admin/non-it-programs'
                  className={`sidebar-link ${
                    isActive('/admin/non-it-programs') ? 'active' : ''
                  }`}
                  data-tooltip='Non-IT Services'>
                  Non IT Services
                </Link>
              </div>
            )}
          </div>

          <Link
            to='/admin/forms'
            className={`sidebar-link ${
              isActive('/admin/forms') ? 'active' : ''
            }`}
            data-tooltip='Form Submissions'>
            <div className='dashboard-cont'>
              <div className='dashboard-icon'>
                <CardSim style={{ width: '18px', flexShrink: 0 }} />
                <span className='link-text'>Form Submissions</span>
              </div>
              {newCount > 0 && (
                <span className='notification-badge'>{newCount}</span>
              )}
            </div>
          </Link>

          <Link
            to='/admin/manage-jobs'
            className={`sidebar-link ${
              isActive('/admin/manage-jobs') ? 'active' : ''
            }`}
            data-tooltip='Manage Jobs'>
            <div className='dashboard-icon'>
              <CircleUser style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>Manage Jobs</span>
            </div>
          </Link>

          <Link
            to='/admin/applications'
            className={`sidebar-link ${
              isActive('/admin/applications') ? 'active' : ''
            }`}
            data-tooltip='View Applications'>
            <div className='dashboard-icon'>
              <Store style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>View Applications</span>
            </div>
          </Link>
          <Link
            to='/admin/studentenrollment'
            className={`sidebar-link ${
              isActive('/admin/studentenrollment') ? 'active' : ''
            }`}>
            <div className='dashboard-icon'>
              <Store style={{ width: '18px' }} />
              <span className='link-text'>Student Enrollments</span>
            </div>
          </Link>

          <Link
            to='/admin/new-batch-dashboard'
            className={`sidebar-link ${
              isActive('/admin/new-batch-dashboard') ? 'active' : ''
            }`}
            data-tooltip='New Batches'>
            <div className='dashboard-icon'>
              <GraduationCap style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>New Batches</span>
            </div>
          </Link>

          <Link
            to='/admin/manage-blogs'
            className={`sidebar-link ${
              isActive('/admin/manage-blogs') ? 'active' : ''
            }`}
            data-tooltip='Manage Blogs'>
            <div className='dashboard-icon'>
              <Shield style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>Manage Blogs</span>
            </div>
          </Link>

          <Link
            to='/admin/manage-candidates'
            className={`sidebar-link ${
              isActive('/admin/manage-candidates') ? 'active' : ''
            }`}
            data-tooltip='Manage Candidates'>
            <div className='dashboard-icon'>
              <UserRound style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>Manage Candidates</span>
            </div>
          </Link>

          <Link
            to='/admin/view-requests'
            className={`sidebar-link ${
              isActive('/admin/view-requests') ? 'active' : ''
            }`}
            data-tooltip='View Requests'>
            <div className='dashboard-cont'>
              <div className='dashboard-icon'>
                <AudioLines style={{ width: '18px', flexShrink: 0 }} />{' '}
                <span className='link-text'>View Requests</span>
              </div>
              {newRequestCount > 0 && (
                <span className='notification-badge'>{newRequestCount}</span>
              )}
            </div>
          </Link>

          <Link
            to='/admin/manage-managers'
            className={`sidebar-link ${
              isActive('/admin/manage-managers') ? 'active' : ''
            }`}
            data-tooltip='Add Managers'>
            <div className='dashboard-icon'>
              <UserCog style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>Add Managers</span>
            </div>
          </Link>

          <Link
            to='/admin/manage-recruiters'
            className={`sidebar-link ${
              isActive('/admin/manage-recruiters') ? 'active' : ''
            }`}
            data-tooltip='Add Recruiters'>
            <div className='dashboard-icon'>
              <UserSearch style={{ width: '18px', flexShrink: 0 }} />{' '}
              <span className='link-text'>Add Recruiters</span>
            </div>
          </Link>
          <button
            className='logout-btn'
            onClick={handleLogout}
            data-tooltip='Logout'>
            <LogOut size={18} />
            <span className='link-text'>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}
