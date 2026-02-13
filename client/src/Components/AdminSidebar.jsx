// File: src/Components/AdminSidebar.jsx

import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  HardDrive,
  Layers,
  GraduationCap,
  FileText,
  CreditCard,
  Building,
  Users,
  ClipboardList,
  Briefcase,
  MessageSquare,
  Ticket,
  FileUser,
  Award,
  Scroll,
  UserCog,
  UserPlus,
  Quote,
  LogOut,
  ChevronDown,
  Gift
} from 'lucide-react'
import Cookie from 'js-cookie'

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()

  // --- State for Dropdowns ---
  const [openServices, setOpenServices] = useState(false)
  const [openEnrollments, setOpenEnrollments] = useState(false)
  const [openJobs, setOpenJobs] = useState(false)
  const [openBench, setOpenBench] = useState(false)
  const [openPlacements, setOpenPlacements] = useState(false)
  const [openAdminMgmt, setOpenAdminMgmt] = useState(false)
  const [openContent, setOpenContent] = useState(false)

  // Notification count (mock logic)
  const [newRequestCount] = useState(0)

  // User Role Detection
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

  // --- 1. ADMIN LINKS (Full Access) ---
  const adminLinks = [
    ...commonLinks,
    {
      type: 'dropdown',
      label: 'Services',
      icon: HardDrive, 
      state: openServices,
      setState: setOpenServices,
      submenu: [
        { path: '/admin/it-programs', label: 'IT Training', icon: HardDrive },
        { path: '/admin/non-it-programs', label: 'Non-IT Training', icon: Layers },
        { path: '/admin/manage-digital-courses', label: 'Digital Courses', icon: GraduationCap },
        { path: '/admin/payroll-requests', label: 'Payroll Services', icon: CreditCard },
        { path: "/admin/college-connect", label: 'College Connect', icon: Building },
      ]
    },
    {
      type: 'dropdown',
      label: 'Enrollments',
      icon: ClipboardList,
      state: openEnrollments,
      setState: setOpenEnrollments,
      submenu: [
        { path: '/admin/studentenrollment', label: 'Training Enrolls', icon: Users },
        { path: '/admin/digital-courses-enrollment', label: 'Digital Course Enrolls', icon: GraduationCap },
        { path: '/admin/batch-enrollments', label: 'Bench Enrolls', icon: Layers },
      ]
    },
    {
      type: 'dropdown',
      label: 'Bench Management',
      icon: Users,
      state: openBench,
      setState: setOpenBench,
      submenu: [
        { path: '/admin/manage-candidates', label: 'Bench List', icon: Users },
        { path: '/admin/candidateList', label: 'Bench Approvals', icon: FileUser },
      ]
    },
    {
      type: 'dropdown',
      label: 'Job & Recruitment',
      icon: Briefcase,
      state: openJobs,
      setState: setOpenJobs,
      submenu: [
        { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
        { path: '/admin/applications', label: 'Job Applications', icon: FileText },
        { path: '/admin/contact-inquiries', label: 'Contact Info', icon: MessageSquare },
        { path: '/admin/manage-blogs', label: 'Blogs', icon: FileText },
      ]
    },
    { path: '/admin/view-requests', label: 'Request Management', icon: Ticket, isNotification: true },
    {
      type: 'dropdown',
      label: 'Placement & Hiring',
      icon: Award,
      state: openPlacements,
      setState: setOpenPlacements,
      submenu: [
        { path: '/admin/interviews', label: 'Interviews', icon: Users },
        { path: '/admin/interviews/approvals', label: 'Interview Approvals', icon: FileUser },
        { path: '/admin/placedcandidates', label: 'Placed Candidates', icon: Award },
        { path: '/admin/college-connect', label: 'College Proposals', icon: Scroll },
      ]
    },
    {
      type: 'dropdown',
      label: 'Admin Management',
      icon: UserCog,
      state: openAdminMgmt,
      setState: setOpenAdminMgmt,
      submenu: [
        { path: '/admin/manage-managers', label: 'Add Manager', icon: UserCog },
        { path: '/admin/manage-recruiters', label: 'Add Recruiters', icon: UserPlus },
      ]
    },
    {
      type: 'dropdown',
      label: 'Content Management',
      icon: Layers,
      state: openContent,
      setState: setOpenContent,
      submenu: [
        { path: '/admin/manage-testimonials', label: 'Testimonials', icon: Quote },
        { path: '/admin/manage-offer', label: 'Manage Offers', icon: Gift },
      ]
    },
  ]

  // --- 2. MANAGER LINKS ---
  // Added: Bench List, Manage Jobs, Job Applications, Interviews
  const managerLinks = [
    ...commonLinks,
    // Bench Management (New)
    {
      type: 'dropdown',
      label: 'Bench Management',
      icon: Users,
      state: openBench,
      setState: setOpenBench,
      submenu: [
        { path: '/admin/manage-candidates', label: 'Bench List', icon: Users },
      ]
    },
    // Job & Recruitment (New)
    {
      type: 'dropdown',
      label: 'Job & Recruitment',
      icon: Briefcase,
      state: openJobs,
      setState: setOpenJobs,
      submenu: [
        { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
        { path: '/admin/applications', label: 'Job Applications', icon: FileText },
      ]
    },
    // Placement & Hiring (Updated with Interviews)
    {
      type: 'dropdown',
      label: 'Placement & Hiring',
      icon: Award,
      state: openPlacements,
      setState: setOpenPlacements,
      submenu: [
        { path: '/admin/interviews', label: 'Interviews', icon: Users },
        { path: '/admin/placedcandidates', label: 'Placed Candidates', icon: Award },
        { path: '/admin/college-connect', label: 'College Proposals', icon: Scroll },
      ]
    },
    // Admin Mgmt
    { path: '/admin/manage-recruiters', label: 'Add Recruiters', icon: UserPlus },
    // Success Stories
    { path: '/admin/manage-testimonials', label: 'Stories Success', icon: Quote },
    
    // Recruiter Tools (Dropdowns)
    {
      type: 'dropdown',
      label: 'Programs & Services',
      icon: HardDrive,
      state: openServices,
      setState: setOpenServices,
      submenu: [
        { path: '/admin/it-programs', label: 'IT Training', icon: HardDrive },
        { path: '/admin/non-it-programs', label: 'Non-IT Training', icon: Layers },
      ]
    },
    {
      type: 'dropdown',
      label: 'Recruiter Enrollments',
      icon: ClipboardList,
      state: openEnrollments,
      setState: setOpenEnrollments,
      submenu: [
        { path: '/admin/digital-courses-enrollment', label: 'Digital Course Enrolls', icon: GraduationCap },
        { path: '/admin/batch-enrollments', label: 'Bench Enrolls', icon: Layers },
      ]
    },
  ]

  // --- 3. RECRUITER LINKS ---
  // Added: Bench List, Manage Jobs, Job Applications, Interviews
  const recruiterLinks = [
    ...commonLinks,
    // Bench Management (New)
    {
      type: 'dropdown',
      label: 'Bench Management',
      icon: Users,
      state: openBench,
      setState: setOpenBench,
      submenu: [
        { path: '/admin/manage-candidates', label: 'Bench List', icon: Users },
      ]
    },
    // Job & Recruitment (New)
    {
      type: 'dropdown',
      label: 'Job & Recruitment',
      icon: Briefcase,
      state: openJobs,
      setState: setOpenJobs,
      submenu: [
        { path: '/admin/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
        { path: '/admin/applications', label: 'Job Applications', icon: FileText },
      ]
    },
    // Interviews (New)
    { path: '/admin/interviews', label: 'Interviews', icon: Users },

    // Existing Services
    {
      type: 'dropdown',
      label: 'Services',
      icon: HardDrive,
      state: openServices,
      setState: setOpenServices,
      submenu: [
        { path: '/admin/it-programs', label: 'IT Training', icon: HardDrive },
        { path: '/admin/non-it-programs', label: 'Non-IT Training', icon: Layers },
      ]
    },
    // Existing Enrollments
    {
      type: 'dropdown',
      label: 'Enrollments',
      icon: ClipboardList,
      state: openEnrollments,
      setState: setOpenEnrollments,
      submenu: [
        { path: '/admin/digital-courses-enrollment', label: 'Digital Course Enrolls', icon: GraduationCap },
        { path: '/admin/batch-enrollments', label: 'Bench Enrolls', icon: Layers },
      ]
    },
  ]

  // Select links based on user role
  let linksToRender = []
  if (role === 'admin') linksToRender = adminLinks
  else if (role === 'manager') linksToRender = managerLinks
  else if (role === 'recruiter') linksToRender = recruiterLinks
  else linksToRender = commonLinks

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 text-gray-800 transition-all duration-300 ease-in-out z-30 shadow-xl overflow-y-auto overflow-x-hidden
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
          ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-white sticky top-0 z-10 overflow-hidden whitespace-nowrap">
          {isOpen ? (
             <img src='/Logo6.jpg' alt='logo' className='h-12 w-50 object-contain max-w-[80%]' />
          ) : (
             <img src='/L1.png' alt='logo' className='h-8 w-8 object-contain' />
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {linksToRender.map((link, index) => {
            
            // --- Dropdown Item ---
            if (link.type === 'dropdown') {
              const submenuPaths = link.submenu.map(item => item.path)
              const isDropdownActive = isSubmenuActive(submenuPaths)

              return (
                <div key={index} className="mb-1">
                  <button
                    onClick={() => {
                        if(!isOpen) setIsOpen(true); 
                        link.setState(!link.state);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group
                      ${isDropdownActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`w-5 h-5 flex-shrink-0 ${isDropdownActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                      <span className={`font-medium transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {link.label}
                      </span>
                    </div>
                    {isOpen && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${link.state ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${link.state && isOpen ? 'max-h-screen opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-gray-50 rounded-lg py-1 mx-2 border border-gray-100">
                      {link.submenu.map((sublink, subIndex) => (
                        <Link
                          key={subIndex}
                          to={sublink.path}
                          onClick={closeOnMobile}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-md mx-1
                            ${isActive(sublink.path) 
                              ? 'text-blue-700 font-semibold bg-blue-100/50' 
                              : 'text-gray-500 hover:text-blue-700 hover:bg-blue-50'}
                          `}
                        >
                          <span className="whitespace-nowrap">{sublink.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            // --- Standard Link Item ---
            return (
              <Link
                key={index}
                to={link.path}
                onClick={closeOnMobile}
                className={`flex items-center justify-between p-3 rounded-lg mb-1 transition-all duration-200 group relative
                  ${isActive(link.path) 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                `}
              >
                <div className="flex items-center gap-3">
                  <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive(link.path) ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                  <span className={`font-medium transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {link.label}
                  </span>
                </div>
                {link.isNotification && newRequestCount > 0 && isOpen && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{newRequestCount}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={() => { closeOnMobile(); handleLogout(); }}
            className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`ml-3 font-medium transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}