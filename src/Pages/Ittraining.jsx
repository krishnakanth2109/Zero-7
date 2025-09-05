import React, { useState, useEffect, useRef } from "react";
import "./Ittraining.css";

const Ittraining = () => {
  const [expandedId, setExpandedId] = useState(null);
  const cardRefs = useRef({});

  const itPrograms = [
    // ... (your existing programs)
    { 
      id: 1, 
      title: "Full Stack Development", 
      icon: "💻",
      description: "End-to-end development training for both frontend and backend applications.",
      details: "Our Full Stack Development program covers everything from HTML, CSS, and JavaScript to advanced React, Node.js, Express, and MongoDB. You’ll learn how to design, build, and deploy scalable, production-ready applications.",
      technologies: ["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "Express.js", "MongoDB", "Git", "REST APIs"]
    },
    { 
      id: 2, 
      title: "Cloud & DevOps", 
      icon: "☁️",
      description: "Automating infrastructure and application deployment on cloud platforms.",
      details: "This program introduces you to cloud computing concepts and DevOps practices. You’ll work with automation, CI/CD pipelines, and cloud-native deployments that are industry standard.",
      technologies: ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "Terraform", "GitHub Actions"]
    },
    { 
      id: 3, 
      title: "Data Science & AI", 
      icon: "📊",
      description: "Extract insights from data and build intelligent AI-powered applications.",
      details: "We cover the entire Data Science lifecycle, from data cleaning and analysis to building Machine Learning and Deep Learning models. This course also focuses on applying AI in real-world business cases.",
      technologies: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras", "Matplotlib", "PowerBI"]
    },
    { 
      id: 4, 
      title: "Software Testing & QA", 
      icon: "🔍",
      description: "Manual and automated testing to ensure high-quality software delivery.",
      details: "Learn both manual and automation testing strategies to deliver bug-free applications. You’ll practice automation frameworks and API testing techniques widely used in IT companies.",
      technologies: ["Selenium", "JUnit", "TestNG", "Postman", "JMeter", "Cypress", "Appium"]
    },
    { 
      id: 5, 
      title: "Cybersecurity & Ethical Hacking", 
      icon: "🛡️",
      description: "Securing systems and networks against modern cyber threats.",
      details: "This program gives insights into ethical hacking, penetration testing, and cybersecurity practices. You’ll learn how to detect vulnerabilities, secure applications, and implement compliance strategies.",
      technologies: ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Nmap", "Firewalls", "Cryptography"]
    },
    { 
      id: 6, 
      title: "Mobile App Development", 
      icon: "📱",
      description: "Build innovative mobile apps for Android and iOS platforms.",
      details: "From basic app design to advanced mobile frameworks, this program helps you create native and cross-platform applications that run smoothly across devices.",
      technologies: ["Java", "Kotlin", "Swift", "Flutter", "React Native", "Firebase", "SQLite"]
    },
    { 
      id: 7, 
      title: "Artificial Intelligence with ChatGPT & LLMs", 
      icon: "🤖",
      description: "Work with Large Language Models (LLMs) to create next-gen AI solutions.",
      details: "Understand the fundamentals of NLP, Generative AI, and ChatGPT integrations. Build AI chatbots, recommendation systems, and explore enterprise-level applications of AI.",
      technologies: ["OpenAI API", "LangChain", "Python", "Transformers", "Hugging Face", "Vector Databases"]
    },
    { 
      id: 8, 
      title: "UI/UX Design", 
      icon: "🎨",
      description: "Design creative and user-centric digital experiences.",
      details: "This program focuses on UI design principles, usability testing, wireframing, and prototyping. You’ll learn how to create visually appealing and user-friendly designs.",
      technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Photoshop", "Illustrator"]
    },
    { 
      id: 9, 
      title: "Blockchain & Web3 Development", 
      icon: "⛓️",
      description: "Create decentralized applications and smart contracts.",
      details: "This course dives deep into blockchain principles, Web3 ecosystems, and decentralized finance (DeFi). You’ll build DApps, NFTs, and secure smart contracts.",
      technologies: ["Ethereum", "Solidity", "Web3.js", "Metamask", "Polygon", "IPFS", "Truffle Suite"]
    }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    if (expandedId && cardRefs.current[expandedId]) {
      cardRefs.current[expandedId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [expandedId]);

  return (
    <div className="ittraining-container">
      {/* Hero Banner Section */}
      <section className="it-hero">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="IT Training Banner"
          className="it-hero-image"
        />
        <div className="it-hero-overlay">
          <h1>IT Services</h1>
          <p>Explore our IT services and learn about the technologies we use</p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="it-programs-section">
        <div className="it-courses-grid">
          {itPrograms.map((course) => (
            <div
              key={course.id}
              ref={(el) => (cardRefs.current[course.id] = el)}
              className={`it-course-card ${expandedId === course.id ? "expanded" : ""}`}
            >
              <div className="it-course-icon">{course.icon}</div>
              <h3 className="it-course-title">{course.title}</h3>
              <p className="it-course-description">{course.description}</p>

              <button
                className="it-learn-more-btn"
                onClick={() => toggleExpand(course.id)}
              >
                {expandedId === course.id ? "Show Less" : "Learn More"}
              </button>

              {expandedId === course.id && (
                <div className="it-course-details">
                  <p>{course.details}</p>
                  <h4>Technologies We Use:</h4>
                  <div className="tech-badge-container">
                    {course.technologies.map((tech, index) => (
                      <span key={index} className="it-tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Ittraining;
