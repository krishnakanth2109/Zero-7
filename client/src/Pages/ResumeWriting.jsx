import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ChatBubbleLeftRightIcon, 
  PencilSquareIcon, 
  DocumentArrowDownIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  SparklesIcon,
  RocketLaunchIcon, 
  ShieldCheckIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

const ResumeWriting = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const handleNavigateToContact = () => {
    navigate('/contact');
  };

  const handleNavigateToResumeBuilder = () => {
    navigate('/services/resume-building');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* --- Custom Animations --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-up { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>

      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="relative min-h-screen flex items-center justify-center bg-indigo-950 text-white overflow-hidden pt-20 pb-20">
        
        {/* Background Image with Transparency/Opacity Fix */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
            {/* Deep Blue Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/90 via-indigo-950/95 to-indigo-950"></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Trusted Pill */}
            <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-6 py-2 mb-10 animate-fade-up bg-white/5 backdrop-blur-sm">
              <SparklesIcon className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium tracking-wide text-white">Trusted by 5,000+ Professionals</span>
            </div>

            {/* Main Heading - FIXED COLOR (Pure White) */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-white animate-fade-up" style={{animationDelay: '0.1s'}}>
              Get <span className="text bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Hired</span> Faster
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light text-indigo-100 leading-relaxed animate-fade-up" style={{animationDelay: '0.2s'}}>
              Professional resume writing that gets you <span className="font-bold text-yellow-400">5x more interviews</span> and lands your dream job.
            </p>

            {/* Stats Grid - Outline Style to match screenshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fade-up mt-16" style={{animationDelay: '0.4s'}}>
              {[
                { number: "98%", label: "Success Rate" },
                { number: "24-72h", label: "Fast Delivery" },
                { number: "5k+", label: "Resumes Crafted" },
                { number: "4.9/5", label: "Top Rated" }
              ].map((stat, index) => (
                <div key={index} className="p-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition duration-300 flex flex-col justify-center items-center h-40">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                  <div className="text-sm font-semibold text-white uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
        </div>
      </section>
      
      {/* =========================================
          "OUR PROCESS" SECTION (Light Theme)
      ========================================= */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 uppercase tracking-tight">
              Our <span className="text-indigo-600">Process</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Results-focused and hassle-free. We do the heavy lifting so you can focus on preparing for the interview.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                step: "01", 
                title: "Tell Us Your Story", 
                text: "Upload your existing resume and let us know what you are looking for in terms of goals, accomplishments, and positions.",
                icon: <DocumentArrowDownIcon className="w-6 h-6 text-indigo-600" />,
                img: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              },
              { 
                step: "02", 
                title: "Expert Consultation", 
                text: "Work one-on-one with your own professional writer to craft and polish your career message and personal brand.",
                icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-indigo-600" />,
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyrP2DiLjt032F-X8K5WGsMC70IiRl9O6N-g&s"
              },
              { 
                step: "03", 
                title: "Download Resume", 
                text: "Download your professionally written, ATS friendly resume in 24-72 hours. It's good to go to start applying now.",
                icon: <RocketLaunchIcon className="w-6 h-6 text-indigo-600" />,
                img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                <div className="h-48 overflow-hidden relative">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>
                <div className="p-8 pt-0 relative">
                  <div className="absolute -top-10 left-8 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold text-indigo-900 border border-slate-100">
                    {card.step}
                  </div>
                  <div className="mt-8 mb-6 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{card.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          WHAT SETS US APART
      ========================================= */}
      <section className="relative py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              What Sets Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Apart</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with human expertise to create resumes that stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Tailored to You", icon: <UserGroupIcon className="w-6 h-6 text-indigo-600" />, desc: "Customized to your specific career goals and target industry." },
              { title: "ATS Optimized", icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />, desc: "Keywords and formatting designed to pass automated screening tools." },
              { title: "Proven Results", icon: <SparklesIcon className="w-6 h-6 text-amber-500" />, desc: "99% of our clients land interviews within 60 days." },
              { title: "Quality Guarantee", icon: <ShieldCheckIcon className="w-6 h-6 text-purple-600" />, desc: "Unlimited revisions until you are 100% satisfied with the draft." },
              { title: "Fast Turnaround", icon: <CalendarDaysIcon className="w-6 h-6 text-red-500" />, desc: "Get your first draft in as little as 24-48 hours." },
              { title: "Industry Experts", icon: <PencilSquareIcon className="w-6 h-6 text-cyan-600" />, desc: "Writers with background in HR and Recruitment across sectors." },
            ].map((item, index) => (
              <div key={index} className="group p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION (Reduced Button Sizes)
      ========================================= */}
      <section className="relative py-28 px-4 bg-indigo-950 text-center overflow-hidden">
        
        {/* Background Image - Reduced Opacity */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
          {/* Heavy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-blue-900/90 to-indigo-950/95"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to <span className="text-indigo-400">Launch</span> Your Career?
          </h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who landed their dream jobs. No upfront fees, 100% satisfaction guarantee.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            
            {/* Start My Resume Button - SMALLER SIZE */}
            <button 
              onClick={handleNavigateToResumeBuilder}
              className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl shadow-indigo-900/50 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <RocketLaunchIcon className="h-5 w-5" />
              Start My Resume
            </button>
            
            {/* Book Consultation Button - SMALLER SIZE */}
            <button 
              onClick={handleNavigateToContact}
              className="px-6 py-3 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <PlayCircleIcon className="h-5 w-5" />
              Book Free Consultation
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-indigo-200 font-medium opacity-80">
            <div className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-green-400" /> No upfront payment</div>
            <div className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-green-400" /> 100% Satisfaction Guarantee</div>
            <div className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-green-400" /> Secure & Confidential</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeWriting;