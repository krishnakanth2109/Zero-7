import React, { useState, useEffect, useRef } from "react";
import { 
  CloudArrowUpIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  GlobeAltIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import api from "../api/axios";

const Resumemarketing = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysisResult]);

  // Logic: File Validation
  const pickFile = (f) => {
    const acceptTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!acceptTypes.includes(f.type)) return alert("Only PDF & DOCX are allowed.");
    if (f.size > 5 * 1024 * 1024) return alert("Max size is 5MB");
    setFile(f);
  };

  const startUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('resumeFile', file); 

    try {
      const response = await api.post('/resume/analyze', formData, {
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      setTimeout(() => {
        setAnalysisResult(response.data);
        setUploading(false);
      }, 1000);
    } catch (error) {
      alert("Analysis failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#1a4fbd] text-white pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Verified Career Accelerator</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
              Master the <span className="text-[#facc15]">ATS Logic</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-lg mb-10 leading-relaxed font-medium">
              Our proprietary neural analysis engine mimics top-tier recruiters to ensure your resume survives the 6-second scan and ranks #1 in Applicant Tracking Systems.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <img key={i} className="w-10 h-10 rounded-full border-2 border-blue-600" src={`https://i.pravatar.cc/150?u=${i}`} alt="user"/>
                 ))}
                 <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold">+2k</div>
               </div>
               <div className="text-sm">
                 <p className="font-bold">Trusted by 2,400+ Students</p>
                 <p className="text-blue-200 text-xs">Placed in Fortune 500 companies</p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-4">
               <div className="bg-white rounded-xl p-4 shadow-lg text-slate-800 flex justify-between items-center">
                  <div className="text-xs font-bold uppercase text-slate-400">Parsing Engine</div>
                  <div className="text-blue-600 font-bold">Semantic Analysis</div>
               </div>
               <div className="bg-white rounded-xl p-6 shadow-lg text-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400">RELEVANCY</span>
                    <span className="text-xs font-bold text-slate-400">Keyword Density 85.4%</span>
                  </div>
                  <div className="font-bold text-lg mb-4">Industry Match</div>
                  <div className="flex flex-wrap gap-2">
                    {["#ReactJS", "#SystemDesign", "#CloudArch", "#Agile"].map(t => (
                      <span key={t} className="bg-slate-100 text-slate-600 text-[10px] px-3 py-1 rounded-md font-bold">{t}</span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY COMPREHENSIVE ANALYSIS */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 uppercase tracking-tight">
            Why <span className="text-[#6366f1]">Comprehensive</span> Resume Analysis
          </h2>
          <p className="text-slate-500 mb-16 max-w-2xl mx-auto font-medium">
            Our deep-scan technology evaluates your profile across three critical dimensions used by modern hiring teams.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "ATS Compatibility Score", color: "blue", list: ["Header & Contact Data Verification", "Table & Graphic Interference Check", "Font & Formatting Optimization"] },
              { title: "Keyword Intelligence", color: "green", list: ["JD-Specific Match Percentage", "Hard vs. Soft Skill Distribution", "Hidden Skill Gap Analysis"] },
              { title: "Strategic Coaching", color: "purple", list: ["Action Verb Strength Review", "Quantifiable Impact Metrics", "Experience Hierarchy Check"] }
            ].map((card, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow text-left">
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-blue-50 text-blue-600`}>
                   <ChartBarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-slate-900">{card.title}</h3>
                <ul className="space-y-4">
                  {card.list.map(li => (
                    <li key={li} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <CheckCircleIcon className="w-5 h-5 text-blue-500" /> {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROCESS SECTION (UPDATED TO LIGHT BLUE) */}
      <section className="py-24 bg-[#f0f7ff] text-slate-900"> {/* Changed bg color here */}
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 uppercase">
            Comprehensive <span className="text-blue-600">Analysis Process</span>
          </h2>
          <p className="text-slate-500 mb-16 max-w-2xl mx-auto font-medium">
            Our systematic approach to engineering the perfect career document.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Deep Resume Parsing", icon: <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />, desc: "Extract contact info, education, experience, skills, and accomplishments with semantic analysis." },
              { title: "Multi-Dimensional Scoring", icon: <ChartBarIcon className="w-6 h-6 text-emerald-600" />, desc: "Comprehensive scoring across contact info, education, experience, keywords, and formatting." },
              { title: "Industry-Specific Insights", icon: <GlobeAltIcon className="w-6 h-6 text-indigo-600" />, desc: "Automatic industry detection and targeted recommendations based on your field." }
            ].map((box, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] text-left shadow-lg border border-blue-50">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  {box.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{box.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPLOAD SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 uppercase">Upload <span className="text-blue-600">Your Resume</span> For Analysis</h2>
          <p className="text-slate-500 mb-12 font-medium">Securely upload your document. No data is stored permanently.</p>

          <div className="max-w-3xl mx-auto bg-slate-50 rounded-[2.5rem] p-12 shadow-sm border border-slate-100">
            <div 
              className={`border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer flex flex-col items-center gap-6 ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-200 hover:border-blue-400 bg-white'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) pickFile(f); }}
              onClick={() => inputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <CloudArrowUpIcon className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xl font-bold text-slate-700">{file ? file.name : "Drop your resume here"}</p>
              <p className="text-slate-400 text-sm font-medium">Supports PDF, DOCX up to 10MB</p>
              <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => e.target.files[0] && pickFile(e.target.files[0])} />
            </div>

            <button 
              onClick={startUpload}
              disabled={!file || uploading}
              className={`w-full mt-10 py-5 rounded-full font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 ${!file || uploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {uploading ? `Analyzing... ${progress}%` : "Start Comprehensive Analysis 🚀"}
            </button>
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: "92%", label: "Placement Rate", sub: "Within 90 days of analysis" },
            { val: "98%", label: "User Satisfaction", sub: "Global student feedback" },
            { val: "80%", label: "Salary Increase", sub: "Average bump post-optimization" },
            { val: "15k+", label: "Resumes Analyzed", sub: "Total data points processed" }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">{s.val}</div>
              <p className="font-bold text-slate-800 text-sm mb-1">{s.label}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ANALYSIS RESULTS */}
      {analysisResult && (
        <section ref={resultsRef} className="py-24 bg-slate-900 text-white">
           <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold mb-4">Your Analysis Results</h2>
                 <p className="text-slate-400">Score: {analysisResult.overallScore}/100</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h4 className="font-bold mb-4 text-emerald-400">Keywords Found</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordsFound.map(k => <span key={k} className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">{k}</span>)}
                    </div>
                 </div>
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h4 className="font-bold mb-4 text-rose-400">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordsMissing.map(k => <span key={k} className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg text-xs font-bold border border-rose-500/20">{k}</span>)}
                    </div>
                 </div>
              </div>
           </div>
        </section>
      )}

    </div>
  );
};

export default Resumemarketing;