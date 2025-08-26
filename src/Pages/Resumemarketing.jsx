import React, { useState, useEffect, useRef } from "react";
import "./Resumemarketing.css";

const Resumemarketing = () => {
  const [animatedIcons, setAnimatedIcons] = useState([false, false, false]);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimatedIcons([true, false, false]), 300);
    const t2 = setTimeout(() => setAnimatedIcons([true, true, false]), 600);
    const t3 = setTimeout(() => setAnimatedIcons([true, true, true]), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const acceptTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSizeMB = 5;

  const validateFile = (f) => {
    if (!acceptTypes.includes(f.type)) return "Only PDF / DOC / DOCX Allowed";
    if (f.size > maxSizeMB * 1024 * 1024) return `Max Size ${maxSizeMB} MB`;
    return null;
  };

  const pickFile = (f) => {
    const err = validateFile(f);
    if (err) {
      alert(err);
      return;
    }
    setFile(f);
  };

  const onInputChange = (e) => {
    if (e.target.files?.[0]) pickFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  };

  const startUpload = () => {
    if (!file) {
      inputRef.current?.focus();
      return;
    }
    setUploading(true);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setUploading(false);
          setTimeout(() => {
            setFile(null);
            setProgress(0);
          }, 1600);
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  return (
    <div className="resume-marketing-container">
      {/* Header */}
      <header className="marketing-header">
        <div className="rm-container">
          <h1>Get Your Resume In Front Of The Right Eyes</h1>
          <p className="header-subtitle">
            Light, Clean, And Professional Resume Marketing — Tuned For ATS +
            Recruiters
          </p>
        </div>
      </header>

      <main className="marketing-content">
        {/* Why */}
        <section className="why-section">
          <div className="rm-container">
            <h2>Why Resume Marketing?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h4.5a.75.75 0 100-1.5h-4.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  </svg>
                </div>
                <h3>Stand Out On Portals</h3>
                <p>Optimized Formatting And Keywords So You Rise In Searches.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3>Reach Decision-Makers</h3>
                <p>Targeted Distribution To Recruiters And Hiring Managers.</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3>More Interview Calls</h3>
                <p>Clients Often See Two To Three Times More Responses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How */}
        <section className="how-section">
          <div className="rm-container">
            <h2>How It Works</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className={`step-icon ${animatedIcons[0] ? "animated" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                  </svg>
                </div>
                <div className="step-content">
                  <h3>Resume Audit And Enhancement</h3>
                  <p>ATS-Friendly Structure, Keywords, And Impact Bullets.</p>
                </div>
              </div>

              <div className="process-step">
                <div className={`step-icon ${animatedIcons[1] ? "animated" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 22.5a3 3 0 003-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 01-.712 1.321l-5.683-3.06a1.5 1.5 0 00-1.422 0l-5.683 3.06a.75.75 0 01-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 003 3h15z" />
                  </svg>
                </div>
                <div className="step-content">
                  <h3>Targeted Submission</h3>
                  <p>Reach The Right Roles, Not Just Any Role.</p>
                </div>
              </div>

              <div className="process-step">
                <div className={`step-icon ${animatedIcons[2] ? "animated" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="step-content">
                  <h3>Follow-Ups And Tracking</h3>
                  <p>We Nudge And Track Responses While You Prepare.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload */}
        <section className="upload-section">
          <div className="rm-container">
            <div className="upload-card">
              <div className="upload-info">
                <h2>Upload Your Resume</h2>
                <p className="muted">PDF / DOC / DOCX • Up To 5 MB • Secure And Private</p>

                <ul className="bullets">
                  <li>Smart Parsing For ATS Compatibility</li>
                  <li>Role-Based Keyword Enrichment</li>
                  <li>Personalized Recruiter Outreach</li>
                </ul>

                <div className="badges">
                  <span>SSL Secured</span>
                  <span>GDPR-Ready</span>
                  <span>No Spam</span>
                </div>
              </div>

              <div
                className={`dropzone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
              >
                {!file && (
                  <>
                    <svg className="dz-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5z" />
                      <path d="M3 15.75a.75.75 0 01.75.75v2.25A1.5 1.5 0 005.25 20.25h13.5A1.5 1.5 0 0020.25 18V16.5a.75.75 0 011.5 0V18a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" />
                    </svg>

                    <div className="dz-text">
                      <strong>Drag & Drop</strong> Your Resume Here{" "}
                      <button
                        type="button"
                        className="link choose"
                        onClick={() => inputRef.current?.click()}
                        aria-label="Choose a file from your device"
                      >
                        Choose File
                      </button>
                    </div>
                  </>
                )}

                {file && (
                  <div className="file-row">
                    <div className="file-meta">
                      <div className="file-name" title={file.name}>{file.name}</div>
                      <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    {!uploading && (
                      <button type="button" className="btn tiny" onClick={() => setFile(null)}>
                        Remove
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  className="hidden-input"
                  accept=".pdf,.doc,.docx"
                  onChange={onInputChange}
                />

                {uploading && (
                  <div className="progress">
                    <div className="bar" style={{ width: `${progress}%` }} />
                    <span className="pct">{progress}%</span>
                  </div>
                )}
              </div>

              <div className="actions">
                <button
                  className="btn primary"
                  onClick={startUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading…" : "Upload And Start Marketing"}
                </button>
              </div>

              {!uploading && progress === 100 && (
                <div className="toast success" role="status">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Resume Uploaded. Our Team Will Contact You Soon.
                </div>
              )}

              <p className="footnote">
                By Uploading, You Agree To Our{" "}
                <button type="button" className="alink" onClick={(e) => e.preventDefault()}>
                  Terms
                </button>{" "}
                And{" "}
                <button type="button" className="alink" onClick={(e) => e.preventDefault()}>
                  Privacy
                </button>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resumemarketing;
