import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, Users, TrendingUp, RefreshCw, 
  Handshake, Wrench, Network, Award, 
  MonitorPlay, Wallet, FileText, UserCheck,
  Briefcase, Building2, GraduationCap, CheckCircle2,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  // --- SCROLL FIX: Helper function to scroll top then navigate ---
  const handleNavigate = (path) => {
    window.scrollTo(0, 0); // This forces the scrollbar to the top
    navigate(path);
  };

  // --- Stats Animation ---
  const [stats, setStats] = useState({ careers: 0, partners: 0, retention: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        careers: prev.careers < 5000 ? prev.careers + 100 : 5000,
        partners: prev.partners < 120 ? prev.partners + 5 : 120,
        retention: prev.retention < 94 ? prev.retention + 2 : 94,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // --- Data Objects ---
  const principles = [
    { 
      icon: <Rocket className="w-6 h-6 text-white" />, 
      title: "Innovation First", 
      desc: "Leveraging cutting-edge methodologies and technologies to deliver forward-thinking solutions.",
      bg: "bg-blue-500"
    },
    { 
      icon: <TrendingUp className="w-6 h-6 text-white" />, 
      title: "Result-Oriented", 
      desc: "Our programs are designed to yield measurable outcomes and real-world applications.",
      bg: "bg-indigo-500"
    },
    { 
      icon: <Users className="w-6 h-6 text-white" />, 
      title: "People-Centric", 
      desc: "We believe in the power of human potential, focusing on creating personalized experiences.",
      bg: "bg-sky-500"
    },
    { 
      icon: <RefreshCw className="w-6 h-6 text-white" />, 
      title: "Continuous Growth", 
      desc: "We advocate for lifelong learning and constantly evolving to meet industry demands.",
      bg: "bg-emerald-500"
    }
  ];

  const reasons = [
    { icon: <Handshake className="w-6 h-6 text-blue-600" />, title: "Visionary Foundation", desc: "Bridging the gap between talent and opportunity with unmatched solutions." },
    { icon: <Wrench className="w-6 h-6 text-blue-600" />, title: "Practical Training", desc: "Focus on hands-on skills over theory for immediate application." },
    { icon: <Network className="w-6 h-6 text-blue-600" />, title: "Extensive Network", desc: "Strong connections with top corporates, colleges, and recruiters." },
    { icon: <RefreshCw className="w-6 h-6 text-blue-600" />, title: "Commitment to Growth", desc: "Dedicated to career transformation and enhancing employability." },
    { icon: <Users className="w-6 h-6 text-blue-600" />, title: "Trusted Reliability", desc: "Built on integrity, transparency, and excellence in every interaction." },
    { icon: <Award className="w-6 h-6 text-blue-600" />, title: "Proven Track Record", desc: "Thousands of careers transformed and trusted partnerships established." }
  ];

  const services = [
    { icon: <MonitorPlay className="w-8 h-8 text-blue-600" />, title: "IT & Non-IT Training", tags: ["Specialized", "Expert-led", "Job-Ready"] },
    { icon: <Wallet className="w-8 h-8 text-emerald-600" />, title: "Payroll Outsourcing", tags: ["Compliant", "Accurate", "Efficient"] },
    { icon: <FileText className="w-8 h-8 text-amber-500" />, title: "Resume Marketing", tags: ["ATS Optimized", "Personalized", "Impactful"] },
    { icon: <UserCheck className="w-8 h-8 text-purple-600" />, title: "Bench Marketing", tags: ["Utilization", "Quick Deployment", "Strategic"] }
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 overflow-x-hidden">
      
      {/* 1. Header Section */}
      <section className="relative pt-20 pb-16 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm tracking-wide">
            About Zero7 Technologies
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            About <span className="text-blue-700">Zero7 Technologies</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Zero7 Technologies is your partner in learning, growing, and realizing your potential. 
            We are dedicated to helping job seekers and organizations build a brighter tomorrow, today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleNavigate('/current-hirings')}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
            >
              Join Our Mission <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-700 hover:text-blue-700 transition-all duration-300"
            >
              Our Foundation <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Empowering Careers, <br />
              <span className="text-blue-700">Transforming Lives</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              At Zero7 Technologies, we believe every career deserves a second chance and every talent 
              deserves the right platform. Established in 2025, we specialize in bridging the gap between talent and opportunity.
            </p>
            <div className="border-l-4 border-blue-600 pl-4 py-1 my-6 bg-slate-50 rounded-r-lg">
              <p className="text-slate-800 font-medium italic text-lg">
                "Our mission is to empower individuals with skills, confidence, and opportunities."
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "IT & Non-IT Training Programs",
                "Payroll Process Outsourcing",
                "Resume Marketing Excellence",
                "Campus Drive Partnerships"
              ].map((item, i) => (
                <div key={i} className="flex items-center text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-2xl transform rotate-2"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Team Collaboration" 
              className="relative rounded-2xl shadow-xl w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* 3. Principles */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase block mb-2">Our Core Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Principles That <span className="text-blue-700">Guide Us</span>
            </h2>
            <p className="text-slate-600 text-lg">
              These core beliefs shape our approach to education, integrity, and long-term success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 group">
                <div className={`${item.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-20 px-6 bg-[#1e293b] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors duration-300">
            <div className="flex justify-center mb-4 text-sky-400">
              <Rocket className="w-10 h-10" />
            </div>
            <div className="text-5xl font-extrabold mb-2 text-white tracking-tight">{stats.careers}+</div>
            <div className="text-lg font-bold text-sky-200 uppercase tracking-wide mb-2">Careers Transformed</div>
            <p className="text-slate-400 text-sm">Individuals placed in dream roles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors duration-300">
            <div className="flex justify-center mb-4 text-sky-400">
              <Handshake className="w-10 h-10" />
            </div>
            <div className="text-5xl font-extrabold mb-2 text-white tracking-tight">{stats.partners}+</div>
            <div className="text-lg font-bold text-sky-200 uppercase tracking-wide mb-2">Enterprise Partners</div>
            <p className="text-slate-400 text-sm">Leading companies trust us</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors duration-300">
            <div className="flex justify-center mb-4 text-sky-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="text-5xl font-extrabold mb-2 text-white tracking-tight">{stats.retention}%</div>
            <div className="text-lg font-bold text-sky-200 uppercase tracking-wide mb-2">Placement Retention</div>
            <p className="text-slate-400 text-sm">Long-term career success</p>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">Why Zero7 <span className="text-blue-700">Technologies?</span></h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Founded with a vision to bridge the gap between talent and opportunity, we deliver practical solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((item, idx) => (
              <div key={idx} className="flex flex-col items-start p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Comprehensive Services */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Our Expertise</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              Our Comprehensive <span className="text-blue-700">Services</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start border-t-4 border-transparent hover:border-blue-600 hover:-translate-y-2">
                <div className="mb-6 p-3 bg-slate-50 rounded-lg">{svc.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{svc.title}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {svc.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Who We Empower */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Our Impact</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              Who We <span className="text-blue-700">Empower</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 1: Job Seekers */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto text-blue-600">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-4">For Job Seekers</h3>
              <p className="text-slate-600 text-center mb-8 flex-grow">
                We provide tools, training, and confidence to help you land your next role, whether fresh or experienced.
              </p>
              <ul className="space-y-3 mb-8">
                {["Resume Optimization", "Skill Enhancement", "Placement Support", "Interview Prep"].map((pt, i) => (
                  <li key={i} className="flex items-center text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleNavigate('/current-hirings')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Start Your Journey
              </button>
            </div>

            {/* Card 2: Companies */}
            <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl transform scale-105 z-10 flex flex-col">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto text-white">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">For Companies</h3>
              <p className="text-blue-100 text-center mb-8 flex-grow">
                Access a pool of vetted, skilled candidates ready to contribute. We streamline your hiring process.
              </p>
              <ul className="space-y-3 mb-8">
                {["Pre-screened Talent", "Quick Turnaround", "Customized Training", "Cost-effective Hiring"].map((pt, i) => (
                  <li key={i} className="flex items-center text-sm font-medium text-blue-50">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mr-3 flex-shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleNavigate('/bench-list')}
                className="w-full py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Hire Talent
              </button>
            </div>

            {/* Card 3: Colleges */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto text-blue-600">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-4">For Colleges</h3>
              <p className="text-slate-600 text-center mb-8 flex-grow">
                Bridge the gap between academia and industry. We partner to host drives and boost placement rates.
              </p>
              <ul className="space-y-3 mb-8">
                {["Campus Hiring Drives", "Industry Curriculum", "Skill Workshops", "Placement Assistance"].map((pt, i) => (
                  <li key={i} className="flex items-center text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
              {/* UPDATED: Path changed to /services/college-connect */}
              <button 
                onClick={() => handleNavigate('/services/college-connect')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Vision & Mission */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-blue-600 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-700">
              <Rocket className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h4>
            <p className="text-slate-600 italic leading-relaxed text-lg">
              "To be a leading force in career empowerment and talent solutions, creating a future where every individual has the opportunity to achieve their professional potential."
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-indigo-600 hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-indigo-700">
              <Handshake className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h4>
            <p className="text-slate-600 italic leading-relaxed text-lg">
              "To provide high-quality training and strategic staffing solutions that bridge skill gaps, foster career growth, and drive organizational success."
            </p>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA */}
      <section className="py-24 px-6 bg-[#0B3B69] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold tracking-wide mb-8 border border-white/20">
            Ready For Your Next Step?
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight uppercase tracking-tight">
            Step Into the Future with <br />
            <span className="text-blue-300">Zero7 Technologies</span>
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Whether you’re a job seeker or a business looking for top talent, we are here to support your growth journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => handleNavigate('/current-hirings')}
              className="px-8 py-4 bg-white text-[#0B3B69] font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-xl flex items-center justify-center"
            >
              Join Our Mission <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigate('/bench-list')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Get Opportunities <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;