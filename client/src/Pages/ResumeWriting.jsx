import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckBadgeIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ChatBubbleBottomCenterTextIcon, 
  ArrowDownTrayIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
  BriefcaseIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

const ResumeWriting = () => {
  const navigate = useNavigate();

  const handleContact = () => navigate('/contact');
  const handleResumeStart = () => navigate('/services/resume-building');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans antialiased text-slate-800 bg-white overflow-x-hidden">
      
      {/* --- CSS for specific visual effects --- */}
      <style>{`
        .blue-gradient-text {
          background: -webkit-linear-gradient(45deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-card {
            background-color: #1e40af; 
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
        }
      `}</style>

      {/* =========================================
          HERO SECTION (High Contrast & Clear Text)
      ========================================= */}
      <section 
        className="relative pt-24 pb-32 lg:pb-48 overflow-visible bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://wallpaperaccess.com/full/2095721.jpg')` }}
      >
        {/* Dark Overlay for max text readability */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white space-y-6">
              {/* Trusted Pill */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 w-fit">
                <CheckBadgeIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold tracking-wide text-white">Trusted by 5,000+ Career Professionals</span>
              </div>

              <div className="relative">
                {/* Bookmark Icon Effect */}
                <div className="absolute -top-10 right-20 hidden lg:block opacity-30">
                    <svg width="60" height="80" viewBox="0 0 60 80" fill="#cbd5e1">
                        <path d="M0 0H60V80L30 60L0 80V0Z" />
                    </svg>
                </div>
                
                {/* Main Heading - Forced to Pure White */}
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
                  Get Hired <br />
                  <span className="underline decoration-4 decoration-yellow-500/60 underline-offset-8">Faster.</span>
                </h1>
              </div>

              <p className="text-lg lg:text-xl font-medium text-slate-100 max-w-lg leading-relaxed drop-shadow-md">
                Expert-crafted resumes that pass ATS filters and deliver <span className="font-extrabold text-white bg-blue-600/60 px-2 py-0.5 rounded">5x more interview calls</span> within 30 days.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button 
                  onClick={handleContact}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Contact Us Now 
                  <span className="text-xl">→</span>
                </button>
                <button 
                  onClick={handleResumeStart}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  View Samples
                </button>
              </div>
            </div>

            {/* Right Content (Images) */}
            <div className="relative mt-10 lg:mt-0">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
               
               <div className="flex justify-center items-center gap-6 relative">
                  {/* Resume Paper Mockup */}
                  <div className="bg-white p-4 rounded-xl shadow-2xl transform rotate-[-6deg] w-48 lg:w-60 z-10 border border-gray-100">
                      <div className="w-full h-64 bg-gray-50 rounded border border-dashed border-gray-200 p-2 overflow-hidden">
                          <div className="w-1/3 h-2 bg-gray-300 mb-2 rounded"></div>
                          <div className="w-2/3 h-2 bg-gray-300 mb-4 rounded"></div>
                          <div className="space-y-2">
                              {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-full h-1.5 bg-gray-200 rounded"></div>)}
                          </div>
                      </div>
                  </div>
                  
                  {/* Professional Image */}
                  <div className="relative z-20 transform translate-y-8">
                     <img 
                       src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                       alt="Professional" 
                       className="rounded-2xl shadow-2xl w-56 lg:w-72 border-4 border-white object-cover h-80 lg:h-96"
                     />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90%] max-w-6xl z-30">
            <div className="bg-[#0f172a] rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col md:flex-row text-white">
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-slate-700/50 flex flex-col items-center md:items-start relative group">
                    <span className="text-4xl font-bold text-blue-400 mb-1">98%</span>
                    <span className="text-sm text-slate-400 font-medium">Interview Rate</span>
                </div>
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-slate-700/50 flex flex-col items-center md:items-start relative group">
                    <span className="text-4xl font-bold text-blue-400 mb-1">24-72h</span>
                    <span className="text-sm text-slate-400 font-medium">Turnaround</span>
                </div>
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-slate-700/50 flex flex-col items-center md:items-start relative group">
                    <span className="text-4xl font-bold text-blue-400 mb-1">5k+</span>
                    <span className="text-sm text-slate-400 font-medium">Success Stories</span>
                </div>
                <div className="flex-[1.5] bg-blue-700 p-8 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <SparklesIcon className="w-5 h-5 text-yellow-300" />
                            <span className="font-bold text-lg text-white">AI + Expert Review</span>
                        </div>
                        <p className="text-xs text-blue-100">Powered by AI, Refined by Experts</p>
                    </div>
                  
                </div>
            </div>
        </div>
      </section>

      {/* =========================================
          WHAT SETS US APART
      ========================================= */}
      <section className="pt-48 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase tracking-wide">
              What Sets Us <span className="text-blue-600">A Part</span>
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with human expertise to create resumes that stand out in any recruiter's inbox.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Professional Writing", icon: <DocumentTextIcon />, color: "bg-blue-500", desc: "Customized to your career objectives and target positions." },
              { title: "ATS-Friendly", icon: <CheckBadgeIcon />, color: "bg-green-500", desc: "Engineered to pass screening systems used by top companies." },
              { title: "99% Success Rate", icon: <SparklesIcon />, color: "bg-yellow-500", desc: "Proven results across every industry and experience level." },
              { title: "Excellence Guarantee", icon: <ShieldCheckIcon />, color: "bg-red-500", desc: "Multiple reviews to ensure peak professional quality." },
              { title: "30-Day Guarantee", icon: <ClockIcon />, color: "bg-purple-500", desc: "Interviews within 30 days or we rewrite it for free." },
              { title: "Fast Turnaround", icon: <BoltIcon />, color: "bg-cyan-500", desc: "Optimized resume within 24-72 hours of consultation." },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${feature.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300`}></div>
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                    <div className="w-6 h-6">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          THE ADVANTAGES
      ========================================= */}
      <section className="py-24 bg-gradient-to-br from-purple-700 to-pink-600 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20">
                        <img 
                          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" 
                          className="rounded-2xl w-full h-auto shadow-lg" alt="Laptop"
                        />
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white text-slate-800 px-8 py-4 rounded-xl shadow-xl text-center min-w-[200px] border-l-4 border-green-500">
                            <h4 className="text-xl font-bold">Resume Shortlisted</h4>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    <h2 className="text-4xl font-bold">The <span className="text-blue-200">Advantages</span></h2>
                    <div className="space-y-6">
                        {[
                          { title: "Expert Industry Writers", icon: <BriefcaseIcon /> },
                          { title: "ATS Optimization", icon: <BoltIcon /> },
                          { title: "Premium Corporate Design", icon: <SparklesIcon /> }
                        ].map((adv, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                              <div className="w-6 h-6">{adv.icon}</div>
                            </div>
                            <h4 className="text-xl font-bold pt-2">{adv.title}</h4>
                          </div>
                        ))}
                    </div>
                    <button onClick={handleContact} className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded shadow-lg transition-colors">
                        Contact Us Now
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* =========================================
          BOTTOM CTA
      ========================================= */}
      <section className="relative h-[500px] bg-fixed bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 w-[90%] max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Ready to <span className="text-blue-600 italic">Transform</span> Your Career?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button onClick={handleResumeStart} className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition-shadow shadow-lg">
                    Start My Resume Today
                </button>
                <button onClick={handleContact} className="px-8 py-3 bg-transparent border border-slate-900 text-slate-900 font-bold rounded-full hover:bg-slate-50 transition-colors">
                    Book Free Consultation
                </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-500" /> No upfront payment</div>
                <div className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-500" /> Unlimited revisions</div>
                <div className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-500" /> 24/7 Support</div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default ResumeWriting;