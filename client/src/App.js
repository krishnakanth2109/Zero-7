import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Testimonials from './Pages/Testimonials';
import Blog from './Pages/Blog';
import FAQs from './Pages/FAQs';
import Contact from './Pages/Contact';
import CollegeConnect from "./Pages/CollegeConnect";
import PayrollServices from './Pages/PayrollServices';
import Resumemarketing from './Pages/Resumemarketing';
import DigitalCourses from './Pages/DigitalCourses';
import Ittraining from './Pages/Ittraining';  
import NonIttraining from './Pages/Nonittraining';
import NewBatches from './Pages/NewBatches';
import Login from './Pages/admin/Login';
import BenchList from './Pages/BenchList';
import FloatingWhatsApp from "./Components/FloatingWhatsApp"; 
import Footer from './Components/Footer';

// ✅ Admin Layout & Pages
import AdminLayout from "./Pages/AdminLayout";
import AdminItPrograms from './Pages/AdminItPrograms';
import AdminDashboard from './Pages/AdminDashboard';
import AdminNonItPrograms from './Pages/AdminNonItPrograms';

// ✅ Other Pages
import CurrentHirings from "./Pages/CurrentHirings";
import CampusHiring from "./Pages/CampusHiring"; 

import './App.css';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {!isAdminPage && <Navbar />}
      <div className="content">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />}>
            <Route path="it-training" element={<Ittraining />} />
            <Route path="non-it-training" element={<NonIttraining />} />
            <Route path="payroll-services" element={<PayrollServices />} />
            <Route path="resume-marketing" element={<Resumemarketing />} />
            <Route path="campus-hiring" element={<CampusHiring />} />
          </Route>
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/digital-courses" element={<DigitalCourses />} />
          <Route path="/new-batches" element={<NewBatches />} />
          <Route path="/bench-list" element={<BenchList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/college-connect" element={<CollegeConnect />} />
          <Route path="/current-hirings" element={<CurrentHirings />} />

          {/* Admin Pages - use AdminLayout */}
          <Route path="/admin" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/it-programs" element={<AdminItPrograms />} />
            <Route path="/admin/non-it-programs" element={<AdminNonItPrograms />} />
          </Route>
        </Routes>
      </div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingWhatsApp />}
    </div>
  );
}

export default App;
