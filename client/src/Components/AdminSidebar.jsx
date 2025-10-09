// File: src/Components/AdminSidebar.jsx

import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AlignHorizontalJustifyStart,
  AudioLines,
  Building,
  CardSim,
  ChevronDown,
  CircleUser,
  FileUser,
  GraduationCap,
  HardDrive,
  Hourglass,
  Layers,
  LayoutDashboard,
  LogOut,
  Shield,
  Store,
  UserCog,
  UserRound,
  UserSearch,
} from 'lucide-react'
import Cookie from 'js-cookie'
import './AdminSidebar.css'

export default function AdminSidebar({ isOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [openServices, setOpenServices] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const [newRequestCount, setNewRequestCount] = useState(0)

  // Get user info and role from cookie
  const user = Cookie.get('user') ? JSON.parse(Cookie.get('user')) : null
  const role = user?.role

  const isActive = (path) => location.pathname === path
  const isSubmenuActive = location.pathname.includes('programs')

  const handleLogout = () => {
    Cookie.remove('token')
    Cookie.remove('user')
    navigate('/admin')
  }

  // Common links
  const commonLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  // All possible links for admin
  const allLinks = [
    ...commonLinks,
    { path: '/admin/interviews', label: 'Interviews', icon: FileUser },
    { path: 'interviews/approvals', label: 'Interviews Approvals', icon: Hourglass },
    { path: '/admin/manage-candidates', label: 'Manage Candidates', icon: AlignHorizontalJustifyStart },
    { path: '/admin/candidateList', label: 'Candidates Approvals', icon: Hourglass },
    { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: CircleUser },
    { path: '/admin/companies', label: 'Manage Companies', icon: Building },
    { path: '/admin/studentenrollment', label: 'Student Enrollment', icon: Store },
    { path: '/admin/applications', label: 'View Applications', icon: Layers },
    { path: '/admin/view-requests', label: 'View Requests', icon: AudioLines, isNotification: true },
    { path: '/admin/manage-recruiters', label: 'Add Recruiter', icon: UserSearch },
    { path: '/admin/manage-managers', label: 'Add Managers', icon: UserCog },
    { path: '/admin/manage-blogs', label: 'Manage Blogs', icon: Shield },
    { path: '/admin/new-batch-dashboard', label: 'New Batches', icon: FileUser },  
    { path: '/admin/forms', label: 'Form', icon: Layers },
    { path: '/admin/it-programs', label: 'IT Programs', icon: HardDrive, isDropdown: true },


  ]

  // Sidebar config for manager and recruiter
  const sidebarConfig = {
    manager: [
       ...commonLinks,
      { path: '/admin/interviews', label: 'Interviews', icon: FileUser },
      { path: 'interviews/approvals', label: 'Interviews Approvals', icon: Hourglass},
  { path: '/admin/manage-candidates', label: 'Manage Candidates', icon: AlignHorizontalJustifyStart },
      { path: '/admin/candidateList', label: 'Candidates Approvals', icon: Hourglass },
      { path: '/admin/companies', label: 'Manage Companies', icon: Building },
      { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: CircleUser },
      { path: '/admin/studentenrollment', label: 'Student Enrollment', icon: Store },
      { path: '/admin/applications', label: 'View Applications', icon: Layers  },
      { path: '/admin/view-requests', label: 'View Requests', icon: AudioLines, isNotification: true },
      { path: '/admin/manage-recruiters', label: 'Add Recruiter', icon: UserSearch },
      { path: '/admin/it-programs', label: 'IT Programs', icon: HardDrive, isDropdown: true },
   
    ],
    recruiter: [
       ...commonLinks,
      { path: '/admin/interviews', label: 'Interviews', icon: FileUser },
      { path: '/admin/manage-candidates', label: 'Manage Candidates', icon: UserRound },
      { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: CircleUser },
    ],

  }

  // Decide which links to render
  let linksToRender = []
  if (role === 'Admin') linksToRender = allLinks
  else if (role === 'manager') linksToRender = sidebarConfig.manager
  else if (role === 'recruiter') linksToRender = sidebarConfig.recruiter
  else linksToRender = commonLinks

  return (
    <aside className={`admin-sidebar overflow-scroll ${!isOpen ? 'collapsed' : ''}`}>
      <div>
        <div className='admin-sidebar-header'>
          <div className='logo-img'>
            <img src='/Logo6.jpg' alt='logo' className='h-[30px] w-[40px]' />
          </div>
          <div className='logo-side-name'>
          
          </div>
        </div>

        <nav>
          {linksToRender.map((link) => {
            // Handle dropdown submenu for IT/Non-IT programs
            if (link.isDropdown) {
              return (
                <div className='dropdown-container' key={link.path}>
                  <div
                    onClick={() => setOpenServices(!openServices)}
                    className={`sidebar-link services-header ${isSubmenuActive ? 'active' : ''}`}
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
                        className={`sidebar-link ${isActive('/admin/it-programs') ? 'active' : ''}`}
                        data-tooltip='IT Services'>
                        IT Services
                      </Link>
                      <Link
                        to='/admin/non-it-programs'
                        className={`sidebar-link ${isActive('/admin/non-it-programs') ? 'active' : ''}`}
                        data-tooltip='Non-IT Services'>
                        Non IT Services
                      </Link>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
                data-tooltip={link.label}>
                <div className='dashboard-icon'>
                  <link.icon style={{ width: '18px', flexShrink: 0 }} />{' '}
                  <span className='link-text'>{link.label}</span>
                </div>
                {link.isNotification && newRequestCount > 0 && (
                  <span className='notification-badge'>{newRequestCount}</span>
                )}
              </Link>
            )
          })}

          <button className='logout-btn' onClick={handleLogout} data-tooltip='Logout'>
            <LogOut size={18} />
            <span className='link-text'>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}
