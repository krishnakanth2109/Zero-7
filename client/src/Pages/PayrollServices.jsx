import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaWallet, 
  FaFileInvoice, 
  FaUserShield, 
  FaTools 
} from 'react-icons/fa';
import api from '../api/axios';

const PayrollServices = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/payroll-consultations', formData);
      alert('Thank you! Your request has been submitted successfully.');
      setFormData({ name: '', email: '', company: '' });
    } catch (error) {
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-white overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 font-semibold text-sm">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              TRUSTED PAYROLL SOLUTIONS
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Simplify <span className="text-blue-600">Payroll.</span> <br />
              Empower Your Workforce.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Simplify your business operations with our efficient and accurate payroll services. We handle everything from salary processing to compliance.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <a href="#consultation" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all text-center">
                Request Free Payroll Consultation
              </a>
            
             
            </motion.div>
          </motion.div>

          {/* Right Image with Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200" 
                alt="Payroll team" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Efficiency Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-emerald-500 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Efficiency</p>
                <p className="text-3xl font-black">+40%</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICE OFFERINGS GRID */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <p className="text-blue-600 font-bold tracking-widest text-sm uppercase">Service Offerings</p>
            <h2 className="text-4xl font-bold text-slate-900">Comprehensive Payroll Management</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Salary Processing", icon: <FaWallet />, desc: "Accurate and timely payroll for your in-house and remote staff.", color: "bg-blue-100 text-blue-600" },
              { title: "Tax & Compliance", icon: <FaFileInvoice />, desc: "Manage TDS, ESI, PF, and all statutory filings with absolute ease.", color: "bg-emerald-100 text-emerald-600" },
              { title: "Contractor Support", icon: <FaUserShield />, desc: "Flexible payroll cycles designed specifically for freelancers.", color: "bg-violet-100 text-violet-600" },
              { title: "Custom Setup", icon: <FaTools />, desc: "Tailored payroll workflows built for the unique needs of startups.", color: "bg-orange-100 text-orange-600" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BENEFITS & FORM SECTION */}
      <section className="py-24 bg-blue-50/50" id="consultation">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-slate-900">Benefits For Employers</h2>
            <div className="space-y-6">
              {[
                "Save time and drastically reduce manual errors",
                "Stay 100% compliant with ever-changing labor laws",
                "Focus on core business growth while we handle the rest"
              ].map((text, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-blue-100"
                >
                  <FaCheckCircle className="text-emerald-500 text-2xl flex-shrink-0" />
                  <span className="font-bold text-slate-700">{text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Team Image */}
            <div className="rounded-[2rem] overflow-hidden shadow-lg border-8 border-white">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200" alt="Team" className="w-full h-[300px] object-cover" />
            </div>
          </div>

          {/* THE FORM BOX */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-2xl border border-blue-50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900">Get Started Today</h3>
                <p className="text-slate-500">Ready to streamline your payroll? Fill out the form and our experts will reach out.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Acme Inc."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing...' : 'Request Free Payroll Consultation'}
                </button>
                
              
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PayrollServices;