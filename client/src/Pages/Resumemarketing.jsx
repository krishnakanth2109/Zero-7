// File: src/Pages/Resumemarketing.jsx

import React, { useState, useEffect, useRef } from "react";
import { 
  CloudArrowUpIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  GlobeAltIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
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

  // Helper for Score Color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
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
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">AI-Powered Analysis</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
              Optimize Your <span className="text-[#facc15]">Resume</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-lg mb-10 leading-relaxed font-medium">
              Get detailed, actionable feedback to pass Applicant Tracking Systems (ATS) and impress recruiters instantly.
            </p>
            <button 
              onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1"
            >
              Analyze My Resume Free
            </button>
          </div>

          <div className="relative hidden lg:block">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-4">
               <div className="bg-white rounded-xl p-4 shadow-lg text-slate-800 flex justify-between items-center">
                  <div className="text-xs font-bold uppercase text-slate-400">ATS Score</div>
                  <div className="text-emerald-600 font-bold text-xl">87/100</div>
               </div>
               <div className="bg-white rounded-xl p-6 shadow-lg text-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400">KEYWORD MATCH</span>
                    <span className="text-xs font-bold text-emerald-500">High Match</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[85%]"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPLOAD SECTION */}
      <section id="upload-section" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 uppercase">
            Upload <span className="text-blue-600">Your Resume</span>
          </h2>
          <p className="text-slate-500 mb-12 font-medium max-w-2xl mx-auto">
            Securely upload your document for a comprehensive review. No data is stored permanently.
          </p>

          <div className="max-w-3xl mx-auto bg-slate-50 rounded-[2.5rem] p-12 shadow-lg border border-slate-200/60">
            <div 
              className={`border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer flex flex-col items-center gap-6 ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300 hover:border-blue-400 bg-white'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) pickFile(f); }}
              onClick={() => inputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <CloudArrowUpIcon className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800 mb-2">{file ? file.name : "Drop your resume here"}</p>
                <p className="text-slate-500 text-sm font-medium">Supports PDF, DOCX up to 5MB</p>
              </div>
              <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => e.target.files[0] && pickFile(e.target.files[0])} />
            </div>

            {/* --- UPDATED BUTTON --- */}
            <button 
              onClick={startUpload}
              disabled={!file || uploading}
              className={`w-full mt-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-3 ${
                !file || uploading 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/30'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing... {progress}%
                </>
              ) : (
                <>
                  Start Comprehensive Analysis <span className="text-2xl " >🚀</span>
                </>
              )}
            </button>
            {/* ---------------------- */}

          </div>
        </div>
      </section>

      {/* 3. ANALYSIS RESULTS VIEW */}
      {analysisResult && (
        <section ref={resultsRef} className="py-24 bg-slate-50 border-t border-slate-200">
           <div className="container mx-auto px-6 max-w-6xl">
              
              {/* Header */}
              <div className="text-center mb-16">
                 <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold mb-4 border ${getScoreColor(analysisResult.overallScore)}`}>
                    Overall Score: {analysisResult.overallScore}/100
                 </div>
                 <h2 className="text-4xl font-extrabold text-slate-900">Analysis Report</h2>
                 <p className="text-slate-500 mt-2 font-medium">For: {analysisResult.extractedData?.name || "Candidate"}</p>
              </div>

              {/* Grid Layout */}
              <div className="grid lg:grid-cols-3 gap-8">
                 
                 {/* Left Column: Scores */}
                 <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                       <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <ChartBarIcon className="w-6 h-6 text-blue-600"/> Breakdown
                       </h3>
                       <div className="space-y-6">
                          {[
                            { label: "ATS Formatting", score: analysisResult.sectionScores.formatting },
                            { label: "Hard Skills", score: analysisResult.sectionScores.hardSkills },
                            { label: "Soft Skills", score: analysisResult.sectionScores.softSkills },
                            { label: "Structure", score: analysisResult.sectionScores.structure },
                            { label: "Content Quality", score: analysisResult.sectionScores.contentQuality }
                          ].map((item, idx) => (
                            <div key={idx}>
                               <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                  <span>{item.label}</span>
                                  <span>{item.score}%</span>
                               </div>
                               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                    style={{ width: `${item.score}%` }}
                                  ></div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                       <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                         <GlobeAltIcon className="w-6 h-6 text-indigo-600"/> Detected Industry
                       </h3>
                       <div className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg inline-block text-sm border border-indigo-100 uppercase tracking-wide">
                          {analysisResult.industry || "General"}
                       </div>
                       <p className="mt-4 text-sm text-slate-500 font-medium">Job Level: <span className="text-slate-800 capitalize">{analysisResult.jobLevel}</span></p>
                    </div>
                 </div>

                 {/* Right Column: Details */}
                 <div className="lg:col-span-2 space-y-8">
                    
                    {/* Recommendations */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-amber-400">
                       <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <LightBulbIcon className="w-6 h-6 text-amber-500"/> Key Recommendations
                       </h3>
                       <div className="space-y-4">
                          {analysisResult.recommendations.map((rec, i) => (
                             <div key={i} className="flex gap-4 p-4 bg-amber-50/50 rounded-xl">
                                <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                   <p className="text-slate-800 font-bold text-sm">{rec.message}</p>
                                   <p className="text-slate-600 text-sm mt-1">{rec.suggestion}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Keywords Analysis */}
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <CheckCircleIcon className="w-5 h-5 text-emerald-500"/> Found Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {analysisResult.keywordsFound.length > 0 ? (
                               analysisResult.keywordsFound.map(k => (
                                 <span key={k} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">{k}</span>
                               ))
                             ) : <span className="text-slate-400 text-sm">No specific keywords found.</span>}
                          </div>
                       </div>

                       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <ExclamationTriangleIcon className="w-5 h-5 text-rose-500"/> Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {analysisResult.keywordsMissing.length > 0 ? (
                               analysisResult.keywordsMissing.map(k => (
                                 <span key={k} className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100">{k}</span>
                               ))
                             ) : <span className="text-slate-400 text-sm">No major keywords missing.</span>}
                          </div>
                       </div>
                    </div>

                    {/* Format Strengths */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                       <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <ShieldCheckIcon className="w-6 h-6 text-blue-600"/> Formatting Strengths
                       </h3>
                       <ul className="grid md:grid-cols-2 gap-4">
                          {analysisResult.formatStrengths?.map((str, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> {str}
                             </li>
                          ))}
                       </ul>
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