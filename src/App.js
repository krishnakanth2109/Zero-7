import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Footer from './Components/Footer';
import NewBatches from './Pages/NewBatches';
import Login from './Pages/admin/Login';


// ✅ import the new page
import CampusHiring from './Pages/CampusHiring';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />}>
            <Route path="it-training" element={<Ittraining />} />
            <Route path="non-it-training" element={<NonIttraining />} />
            <Route path="payroll-services" element={<PayrollServices />} />
            <Route path="resume-marketing" element={<Resumemarketing />} />
            {/* ✅ add campus hiring under services */}
            <Route path="campus-hiring" element={<CampusHiring />} />
          </Route>
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/digital-courses" element={<DigitalCourses />} />
          <Route path="/new-batches" element={<NewBatches />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/college-connect" element={<CollegeConnect />} />
          <Route path="/admin" element={<Login />} />

        </Routes>
      </div>
      {/* ✅ Footer stays global */}
      <Footer />
    </div>
  );
}

export default App;
