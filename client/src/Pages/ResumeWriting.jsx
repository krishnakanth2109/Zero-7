import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ChatBubbleLeftRightIcon, 
  PencilSquareIcon, 
  DocumentArrowDownIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
// Removed the import for StarIconSolid as it's no longer used

const ResumeWriting = () => {
  const navigate = useNavigate();
  // Removed the state and logic for testimonials
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  const handleNavigateToContact = () => {
    navigate('/contact');
  };

  useEffect(() => {
    setIsVisible(true);
    setAnimated(true);
    // Removed the setInterval logic for testimonials
  }, []);

  // The 'testimonials' array has been removed

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-sky-200 rounded-full blur-3xl opacity-25 animate-ping delay-700"></div>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-sky-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center transform scale-105 animate-zoom-in-out"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/70 to-sky-900/70"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 opacity-30 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-cyan-300 opacity-40 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-sky-300 opacity-35 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/3 right-20 w-20 h-20 bg-blue-400 opacity-30 rounded-full animate-float-slow delay-500"></div>

        <div className={`max-w-6xl mx-auto text-center px-4 relative z-10 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8 animate-pulse hover:scale-110 transition-transform duration-300">
            <SparklesIcon className="h-5 w-5 text-yellow-300 animate-spin" />
            <span className="text-sm font-semibold text-white">Trusted by 5,000+ Professionals</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent animate-gradient-x">Get Hired</span>
            </h1>
            
            <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed font-light text-white animate-fade-in-up delay-300">
            Professional resume writing that gets you <span className="font-bold text-yellow-300 animate-pulse">5x more interviews</span> and lands your dream job faster
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-500">
            {[
                { number: "98%", label: "Interview Rate" },
                { number: "24-72h", label: "Delivery Time" },
                { number: "5000+", label: "Resumes Written" },
                { number: "4.9/5", label: "Client Rating" }
            ].map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2 animate-bounce" style={{animationDelay: `${index * 200}ms`}}>
                    {stat.number}
                </div>
                <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
            ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 animate-fade-in-up delay-700">
            <button 
                onClick={handleNavigateToContact}
                className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-5 px-12 rounded-2xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 text-lg animate-pulse hover:animate-none"
            >
                <RocketLaunchIcon className="h-6 w-6 group-hover:rotate-45 transition-transform duration-300" />
                Create My Resume
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
                onClick={handleNavigateToContact}
                className="group bg-transparent border-2 border-white text-white font-bold py-5 px-12 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-3 text-lg"
            >
                <PlayCircleIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                Watch Demo
            </button>
            </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
        </div>
      </section>
      
      {/* --- Why Choose Us? Section --- */}
      <section className="py-24 px-4 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Why We're <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Different</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with human expertise to create resumes that stand out
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-fade-in-left">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Professional Resume"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">ATS Optimized</div>
                    <div className="text-sm text-gray-600">99% Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 animate-float-medium delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Quality Guarantee</div>
                    <div className="text-sm text-gray-600">30-Day Promise</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 animate-fade-in-right">
              {[
                { icon: <UserGroupIcon className="h-8 w-8" />, title: "Industry Expert Writers", description: "Our writers come from top companies and understand what hiring managers are looking for in your specific industry.", color: "from-blue-500 to-cyan-500", delay: "delay-100" },
                { icon: <CheckCircleIcon className="h-8 w-8" />, title: "ATS Optimization", description: "Every resume is optimized to pass through Applicant Tracking Systems used by 99% of Fortune 500 companies.", color: "from-blue-500 to-sky-500", delay: "delay-200" },
                { icon: <SparklesIcon className="h-8 w-8" />, title: "Premium Design", description: "Beautiful, modern designs that capture attention while maintaining professional standards.", color: "from-sky-500 to-blue-600", delay: "delay-300" },
                { icon: <CalendarDaysIcon className="h-8 w-8" />, title: "Fast Turnaround", description: "Get your professionally crafted resume within 24-72 hours, with expedited options available.", color: "from-cyan-500 to-blue-500", delay: "delay-400" }
              ].map((feature, index) => (
                <div key={index} className={`group flex gap-6 p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-blue-100 animate-fade-in-up ${feature.delay}`}>
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-24 px-4 relative bg-gradient-to-br from-blue-600 to-sky-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 animate-zoom-in-out"></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-cyan-300 rounded-full opacity-30 animate-bounce"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-black mb-6">
              Our <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">3-Step</span> Process
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Simple, transparent, and designed to get you results quickly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: <DocumentArrowDownIcon className="h-12 w-12" />, title: "Share Your Story", description: "Upload your current resume and share your career goals, achievements, and target positions.", image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", color: "from-blue-500 to-cyan-500", animation: "animate-fade-in-up delay-100" },
              { step: "02", icon: <ChatBubbleLeftRightIcon className="h-12 w-12" />, title: "Expert Consultation", description: "Work one-on-one with your dedicated writer to refine your career narrative and strategy.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyrP2DiLjt032F-X8K5WGsMC70IiRl9O6N-g&s", color: "from-sky-500 to-blue-600", animation: "animate-fade-in-up delay-200" },
              { step: "03", icon: <PencilSquareIcon className="h-12 w-12" />, title: "Get Your Resume", description: "Receive your professionally crafted, ATS-optimized resume within 24-72 hours.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", color: "from-cyan-500 to-blue-500", animation: "animate-fade-in-up delay-300" }
            ].map((step, index) => (
              <div key={index} className={`group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${step.animation}`}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl animate-pulse">{step.step}</div>
                <div className="mb-6 overflow-hidden rounded-2xl transform group-hover:scale-110 transition-transform duration-700">
                  <img src={step.image} alt={step.title} className="w-full h-48 object-cover"/>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>{step.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-blue-200 leading-relaxed">{step.description}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Packages / Pricing Section --- */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center transform scale-110"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Success</span> Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect plan to accelerate your career journey
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Essential", popular: false, features: ["Professional Resume Rewrite", "ATS Optimization", "24-48 Hour Delivery", "2 Rounds of Revisions", "Basic Cover Letter"], buttonText: "Get Started", border: "border-blue-200", bg: "from-blue-50 to-cyan-50", badge: null, animation: "animate-fade-in-up delay-100" },
              { name: "Professional", popular: true, features: ["Everything in Essential +", "LinkedIn Profile Optimization", "Career Coaching Session", "Unlimited Revisions", "Target Company Research", "Interview Preparation Guide"], buttonText: "Most Popular", border: "border-blue-500", bg: "from-blue-50 to-sky-50", badge: "Best Value", scale: "transform scale-105", animation: "animate-fade-in-up delay-200" },
              { name: "Executive", popular: false, features: ["Everything in Professional +", "Executive Career Strategy", "Multiple Resume Versions", "Priority 24/7 Support", "Salary Negotiation Guide", "90-Day Career Support"], buttonText: "Go Premium", border: "border-cyan-300", bg: "from-cyan-50 to-blue-50", badge: "Executive", animation: "animate-fade-in-up delay-300" }
            ].map((pkg, index) => (
              <div key={index} className={`relative bg-gradient-to-br ${pkg.bg} p-8 rounded-3xl shadow-2xl border-2 ${pkg.border} ${pkg.scale || ''} transform transition-all duration-500 hover:scale-105 hover:shadow-3xl group ${pkg.animation}`}>
                {pkg.popular && ( <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce"> <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-2xl"> {pkg.buttonText} </div> </div> )}
                {pkg.badge && !pkg.popular && ( <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"> <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-2xl text-sm"> {pkg.badge} </div> </div> )}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-gray-900 mb-4 transform group-hover:scale-110 transition-transform duration-300">{pkg.name}</h3>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300"> <SparklesIcon className="h-8 w-8" /> </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => ( <li key={i} className="flex items-start gap-3 transform hover:translate-x-2 transition-transform duration-300"> <CheckCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" /> <span className="text-gray-700">{feature}</span> </li> ))}
                </ul>
                <button onClick={handleNavigateToContact} className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${ pkg.popular ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' }`}>
                  {pkg.popular ? 'Get Started Now' : pkg.buttonText}
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16 animate-fade-in-up delay-500">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-8 py-6 shadow-lg border border-blue-200 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheckIcon className="h-8 w-8 text-blue-500 animate-pulse" />
              <div className="text-left">
                <div className="font-bold text-gray-900">30-Day Interview Guarantee</div>
                <div className="text-gray-600">Get interviews within 30 days or we'll rewrite your resume for free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 animate-zoom-in-out"></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 opacity-20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-400 opacity-25 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-sky-400 opacity-20 rounded-full animate-float-fast"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            Ready to <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Transform</span> Your Career?
          </h2>
          
          <p className="text-2xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed text-blue-200">
            Join thousands of professionals who landed their dream jobs with our resume writing service
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { value: "24-72h", label: "Delivery Time", color: "text-blue-200" },
              { value: "98%", label: "Success Rate", color: "text-cyan-200" },
              { value: "30-Day", label: "Guarantee", color: "text-sky-200" }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 transform hover:scale-110 transition-transform duration-300">
                <div className={`text-2xl font-black ${item.color} animate-pulse`}>{item.value}</div>
                <div className="text-sm text-blue-200">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <button 
              onClick={handleNavigateToContact}
              className="group bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold py-6 px-16 rounded-2xl hover:from-blue-300 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-4 text-xl animate-pulse hover:animate-none"
            >
              <RocketLaunchIcon className="h-7 w-7 group-hover:rotate-45 transition-transform duration-300" />
              Start My Resume Now
              <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button 
              onClick={handleNavigateToContact}
              className="group bg-transparent border-2 border-white text-white font-bold py-6 px-16 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-4 text-xl"
            >
              <PlayCircleIcon className="h-7 w-7 group-hover:scale-110 transition-transform" />
              Book Free Consultation
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-blue-300">
            {[
              "No upfront payment required",
              "100% satisfaction guarantee",
              "Secure & confidential"
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="h-5 w-5 text-cyan-400 animate-pulse" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>
    </div>
  );
};

export default ResumeWriting;