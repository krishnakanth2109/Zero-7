import React, { useState } from "react";
import "./Nonittraining.css";

const Nonittraining = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const nonItPrograms = [
    { 
      id: 5, 
      title: "HR Management", 
      description: "Modern HR practices and talent management", 
      icon: "👥",
      details: "This program provides a comprehensive understanding of Human Resource Management in a corporate environment. You will learn how to manage recruitment processes, onboard employees, design performance evaluation frameworks, and ensure labor law compliance. The course also emphasizes HR analytics, payroll systems, and advanced employee engagement practices to prepare you for HR roles in MNCs and startups.",
      skills: ["Recruitment", "Employee Engagement", "HR Analytics", "Compliance", "Payroll Tools"],
      price: "₹25,000 (3 months)"
    },
    { 
      id: 6, 
      title: "Digital Marketing", 
      description: "Master SEO, social media, and online campaigns", 
      icon: "📱",
      details: "This course equips you with the latest strategies and tools used in digital marketing. You’ll learn how to create data-driven campaigns, perform keyword research, optimize websites for search engines, and manage paid advertising campaigns. Placement-focused training includes live projects on Google Ads, Facebook Ads, and content marketing, making you job-ready for digital marketing agencies or freelancing.",
      skills: ["SEO", "SEM", "Google Ads", "Content Marketing", "Social Media Strategy"],
      price: "₹30,000 (4 months)"
    },
    { 
      id: 7, 
      title: "Business Analysis", 
      description: "Develop strategic business insights", 
      icon: "📈",
      details: "The Business Analysis program trains you to act as a bridge between business stakeholders and IT teams. You will learn requirement gathering techniques, process modeling, and documentation best practices. Case studies on banking, healthcare, and retail industries are included, along with training in agile business analysis using tools like Jira and Confluence. Placement assistance is provided for BA and PMO roles.",
      skills: ["Requirement Gathering", "Process Mapping", "Data Analysis", "MS Visio", "Jira"],
      price: "₹35,000 (4 months)"
    },
    { 
      id: 8, 
      title: "Finance & Payroll", 
      description: "Financial management and payroll systems", 
      icon: "💰",
      details: "This program provides a hands-on approach to managing corporate finance and payroll systems. Topics include payroll compliance, tax calculations, investment declarations, and government regulations. You will also practice using payroll and accounting tools like Tally ERP and advanced Excel. Special placement support is available for finance and payroll executive roles in corporates and SMEs.",
      skills: ["Payroll Processing", "Taxation", "Financial Reporting", "Tally", "Excel"],
      price: "₹28,000 (3 months)"
    },
    { 
      id: 9, 
      title: "Project Management", 
      description: "Lead and deliver successful projects", 
      icon: "📊",
      details: "Designed for aspiring managers and team leads, this course covers project lifecycle management, from initiation to closure. You’ll explore Agile and Scrum frameworks, learn about risk management, budgeting, stakeholder communication, and resource allocation. Real-world case studies are included to prepare you for PMP and Scrum Master certifications. Placement training includes mock interviews and leadership workshops.",
      skills: ["Agile", "Scrum", "Risk Management", "Project Scheduling", "MS Project"],
      price: "₹40,000 (5 months)"
    },
    { 
      id: 10, 
      title: "Sales & Marketing", 
      description: "Boost business growth through sales expertise", 
      icon: "💼",
      details: "This course enhances your ability to strategize and execute effective sales and marketing campaigns. It covers customer psychology, negotiation skills, B2B/B2C strategies, CRM platforms, and pipeline management. Live case studies and roleplays are included to sharpen your sales skills. Placement assistance includes access to corporate tie-ups for sales, BD, and marketing executive roles.",
      skills: ["CRM", "Negotiation", "B2B Sales", "Customer Acquisition", "Communication"],
      price: "₹27,000 (3 months)"
    }
  ];

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="nonittraining-container">
      {/* Hero Banner Section */}
      <section className="nonit-hero">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Non-IT Training Banner"
          className="nonit-hero-image"
        />
        <div className="nonit-hero-overlay">
          <h1>Non-IT Training & Placement Services</h1>
          <p>
            Explore industry-demanded courses with 100% placement assistance in top companies.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="nonit-programs-section">
        <div className="nonit-courses-grid">
          {nonItPrograms.map((course) => (
            <div 
              key={course.id} 
              className={`nonit-course-card ${expandedCard === course.id ? "expanded" : ""}`}
            >
              <div className="nonit-course-icon">{course.icon}</div>
              <h3 className="nonit-course-title">{course.title}</h3>
              <p className="nonit-course-description">{course.description}</p>
              
              <button 
                className="nonit-learn-more-btn" 
                onClick={() => toggleCard(course.id)}
              >
                {expandedCard === course.id ? "Show Less" : "Learn More"}
              </button>

              {expandedCard === course.id && (
                <div className="nonit-course-details">
                  <p>{course.details}</p>
                  <h4>Skills You’ll Gain:</h4>
                  <ul className="nonit-course-technologies">
                    {course.skills.map((skill, index) => (
                      <li key={index} className="nonit-tech-badge">{skill}</li>
                    ))}
                  </ul>
                  <p className="nonit-price"><strong>Course Fee:</strong> {course.price}</p>
                  <p className="nonit-placement">✅ Placement Support Available</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Nonittraining;
