// File: src/App.js (Fully Corrected)

import { useEffect } from 'react'
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import Cookie from 'js-cookie'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import About from './Pages/About'
import Services from './Pages/Services'
import Testimonials from './Pages/Testimonials'
import Blog from './Pages/Blog'
import FAQs from './Pages/FAQs'
import Contact from './Pages/Contact'
import CollegeConnect from './Pages/CollegeConnect'
import BenchList from './Pages/BenchList'
import FloatingWhatsApp from './Components/FloatingWhatsApp'
import Footer from './Components/Footer'
import AdminLayout from './Pages/AdminLayout'
import AdminDashboard from './Pages/AdminDashboard'
import AdminItPrograms from './Pages/AdminItPrograms'
import AdminNonItPrograms from './Pages/AdminNonItPrograms'
import AdminForms from './Components/AdminHomeForm'
import CurrentHirings from './Pages/CurrentHirings'
import AdminManageJobs from './Pages/AdminManageJobs'
import AdminViewApplications from './Pages/AdminViewApplications'
import NewBatchDashboard from './Pages/NewBatchDashboard.jsx'
import Login from './Pages/admin/Login'
import NewBatches from './Pages/NewBatches'

// --- THE FIX IS HERE: ALL IMPORTS ARE CORRECTED TO BE DEFAULT IMPORTS ---
import ManageBlogs from './Pages/ManageBlogs'
import AdminManageCandidates from './Pages/AdminManageCandidates'
import AdminViewRequests from './Pages/AdminViewRequests'

import './App.css'

const LoginPage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    const hasToken = Cookie.get('token')

    if (isAdmin && hasToken) {
      console.log('User already authenticated, redirecting to dashboard...')
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])
  const handleLoginSuccess = () => {
    localStorage.setItem('isAdmin', 'true')
    navigate('/admin/dashboard')
  }
  return <Login onLogin={handleLoginSuccess} />
}

const PrivateRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin')
  const token = Cookie.get('token')

  // Check if user is authenticated
  const isAuthenticated = isAdmin && token

  if (!isAuthenticated) {
    // Clear any stale data
    localStorage.removeItem('isAdmin')
    return <Navigate to='/admin' replace />
  }

  return children
}

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className='App'>
      {!isAdminPage && <Navbar />}
      <div className='content'>
        <Routes>
          {/* All routes are correct and preserved */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/new-batches' element={<NewBatches />} />
          <Route path='/bench-list' element={<BenchList />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/college-connect' element={<CollegeConnect />} />
          <Route path='/current-hirings' element={<CurrentHirings />} />
          {/* Admin Login Route */}
          <Route path='/admin' element={<LoginPage />} />
          {/* Admin Protected Routes */}
          <Route
            path='/admin/*'
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='it-programs' element={<AdminItPrograms />} />
            <Route path='non-it-programs' element={<AdminNonItPrograms />} />
            <Route path='forms' element={<AdminForms />} />
            <Route path='manage-jobs' element={<AdminManageJobs />} />
            <Route path='applications' element={<AdminViewApplications />} />
            <Route path='new-batch-dashboard' element={<NewBatchDashboard />} />
            <Route path='manage-blogs' element={<ManageBlogs />} />
            <Route
              path='manage-candidates'
              element={<AdminManageCandidates />}
            />
            <Route path='view-requests' element={<AdminViewRequests />} />
          </Route>
        </Routes>
      </div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingWhatsApp />}
    </div>
  )
}

export default App
