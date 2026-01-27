// File: src/Components/AdminSidebar.jsx

import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AlignHorizontalJustifyStart,
  AudioLines,
  Building,
  ChevronDown,
  CircleUser,
  ClipboardList,
  FileUser,
  Gift,
  GraduationCap,
  HardDrive,
  Hourglass,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Receipt,
  Shield,
  Store,
  UserCog,
  UserSearch,
  Users,
  Briefcase,
  FolderOpen,
  Quote,
} from 'lucide-react'
import Cookie from 'js-cookie'
import './AdminSidebar.css'

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [openInterviews, setOpenInterviews] = useState(false)
  const [openBenchManagement, setOpenBenchManagement] = useState(false)
  const [openCandidates, setOpenCandidates] = useState(false)
  const [openJobsCompanies, setOpenJobsCompanies] = useState(false)
  const [openRequests, setOpenRequests] = useState(false)
  const [openServices, setOpenServices] = useState(false)

  const [newRequestCount, setNewRequestCount] = useState(0)

  const user = Cookie.get('user') ? JSON.parse(Cookie.get('user')) : null
  const role = user?.role?.toLowerCase() || ''

  const isActive = (path) => location.pathname === path
  const isSubmenuActive = (paths) => paths.some(path => location.pathname.includes(path))

  const handleLogout = () => {
    Cookie.remove('token')
    Cookie.remove('user')
    navigate('/admin')
  }

  const closeOnMobile = () => {
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  const commonLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const adminLinks = [
    ...commonLinks,
    {
      type: 'dropdown',
      key: 'interviews',
      label: 'Interviews',
      icon: FileUser,
      state: openInterviews,
      setState: setOpenInterviews,
      submenu: [
        { path: '/admin/interviews', label: 'Interviews', icon: FileUser },
        { path: '/admin/interviews/approvals', label: 'Interviews Approvals', icon: Hourglass },
      ]
    },
    {
      type: 'dropdown',
      key: 'bench-management',
      label: 'Bench Management',
      icon: AlignHorizontalJustifyStart,
      state: openBenchManagement,
      setState: setOpenBenchManagement,
      submenu: [
        { path: '/admin/manage-candidates', label: 'Manage Bench List', icon: AlignHorizontalJustifyStart },
        { path: '/admin/candidateList', label: 'Bench Approvals', icon: Hourglass },
      ]
    },
    {
      type: 'dropdown',
      key: 'candidates',
      label: 'Candidates',
      icon: Users,
      state: openCandidates,
      setState: setOpenCandidates,
      submenu: [
        { path: '/admin/studentenrollment', label: 'Candidate Enrollment', icon: Store },
        { path: '/admin/applications', label: 'View Applications', icon: Layers },
        { path: '/admin/placedcandidates', label: 'Placed Candidates', icon: CircleUser },
        { path: '/admin/digital-courses-enrollment', label: 'Digital Courses Enrollment', icon: GraduationCap },
      ]
    },
    {
      type: 'dropdown',
      key: 'jobs-companies',
      label: 'Jobs & Companies',
      icon: Briefcase,
      state: openJobsCompanies,
      setState: setOpenJobsCompanies,
      submenu: [
        { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: CircleUser },
        { path: '/admin/companies', label: 'Manage Companies', icon: Building },
      ]
    },
    {
      type: 'dropdown',
      key: 'requests',
      label: 'Requests',
      icon: FolderOpen,
      state: openRequests,
      setState: setOpenRequests,
      submenu: [
        { path: '/admin/payroll-requests', label: 'Payroll Requests', icon: Receipt },
        { path: '/admin/view-requests', label: 'View Requests', icon: AudioLines, isNotification: true },
      ]
    },
    { path: '/admin/manage-recruiters', label: 'Add Recruiter', icon: UserSearch },
    { path: '/admin/manage-managers', label: 'Add Managers', icon: UserCog },
    { path: '/admin/manage-blogs', label: 'Manage Blogs', icon: Shield },
    { path: '/admin/manage-testimonials', label: 'Manage Testimonials', icon: Quote },
    { path: '/admin/new-batch-dashboard', label: 'New Batches', icon: FileUser },
    { path: '/admin/forms', label: 'College Connect Form', icon: Layers },
    { path: '/admin/manage-offer', label: 'Manage Offer', icon: Gift },
    { path: '/admin/batch-enrollments', label: 'Batch Enrollments', icon: ClipboardList },
    {
      type: 'dropdown',
      key: 'services',
      label: 'Services',
      icon: HardDrive,
      state: openServices,
      setState: setOpenServices,
      submenu: [
        // Updated to link to existing Admin components for IT/Non-IT and new routes for others
        { path: '/admin/it-programs', label: 'IT Training', icon: HardDrive },
        { path: '/admin/non-it-programs', label: 'Non-IT Training', icon: Layers },
        { path: '/admin/manage-digital-courses', label: 'Digital Courses', icon: GraduationCap },
 
      
      ]
    },
    { path: '/admin/contact-inquiries', label: 'Contact Inquiries', icon: MessageSquare },
  ]

  // (Keeping managerLinks and recruiterLinks same as provided for brevity, 
  // ensure you add the services dropdown there if they also need access)
  const managerLinks = [ ...commonLinks /* ... your manager links ... */ ]; 
  const recruiterLinks = [ ...commonLinks /* ... your recruiter links ... */ ];

  let linksToRender = []
  if (role === 'admin') linksToRender = adminLinks
  else if (role === 'manager') linksToRender = managerLinks
  else if (role === 'recruiter') linksToRender = recruiterLinks
  else linksToRender = commonLinks

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className='admin-sidebar-header'>
        <div className='logo-img'>
          {isOpen ? (
            <img src='/Logo6.jpg' alt='logo' className='h-[30px] w-[40px]' />
          ) : (
            <img src='/L1.png' alt='logo1' className='h-[32px] w-[32px]' />
          )}
        </div>
      </div>
      
      <nav className="sidebar-nav-container">
        {linksToRender.map((link, index) => {
          if (link.type === 'dropdown') {
            const submenuPaths = link.submenu.map(item => item.path)
            const isDropdownActive = isSubmenuActive(submenuPaths)

            return (
              <div className='dropdown-container' key={link.key || index}>
                <div
                  onClick={() => link.setState(!link.state)}
                  className={`sidebar-link services-header ${isDropdownActive ? 'active' : ''}`}
                  data-tooltip={link.label}>
                  <div className='dashboard-icon'>
                    <link.icon style={{ width: '18px', flexShrink: 0 }} />
                    <span className='link-text'>{link.label}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`dropdown-arrow ${link.state ? 'rotate' : ''}`}
                  />
                </div>
                {link.state && (
                  <div className='submenu'>
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.path}
                        to={sublink.path}
                        onClick={closeOnMobile}
                        className={`sidebar-link ${isActive(sublink.path) ? 'active' : ''}`}
                        data-tooltip={sublink.label}
                      >
                        <div className='dashboard-icon'>
                          {sublink.icon && <sublink.icon style={{ width: '16px', flexShrink: 0 }} />}
                          <span className='link-text'>{sublink.label}</span>
                        </div>
                      </Link>
                    ))}
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
                <link.icon style={{ width: '18px', flexShrink: 0 }} />
                <span className='link-text'>{link.label}</span>
              </div>
              {link.isNotification && newRequestCount > 0 && (
                <span className='notification-badge'>{newRequestCount}</span>
              )}
            </Link>
          )
        })}

        <button
          className="logout-btn"
          data-tooltip="Logout" 
          onClick={() => {
            closeOnMobile();
            handleLogout();
          }}
        >
          <LogOut size={18} />
          <span className='link-text'>Logout</span>
        </button>
      </nav>
    </aside>
  )
}