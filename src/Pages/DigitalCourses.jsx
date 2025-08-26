import React, { useState } from 'react';
import './DigitalCourses.css';
import { 
  FaLaptopCode, FaCloud, FaChartLine, FaBug,
  FaUsers, FaMobileAlt, FaBriefcase, FaMoneyBill,
  FaStar, FaRegStar, FaClock, FaSignal, FaClosedCaptioning
} from "react-icons/fa";

// ================= IT Courses =================
const itCourses = [
  { 
    title: "Full Stack Development", 
    desc: "Master front-end and back-end technologies", 
    price: "₹15,000", 
    originalPrice: "₹25,000",
    icon: <FaLaptopCode />, 
    category: "IT",
    rating: 4.7,
    reviews: 1250,
    duration: "6 months",
    level: "Intermediate",
    subtitles: true,
    bestseller: true,
    updated: "Updated Aug 2025",
    moreInfo: [
      "HTML, CSS, JavaScript, React, Node.js",
      "Database: MongoDB & MySQL",
      "Deploying applications to cloud platforms",
      "Authentication & Security best practices"
    ]
  },
  { 
    title: "Cloud & DevOps", 
    desc: "Learn cloud infrastructure and CI/CD pipelines", 
    price: "₹40,000", 
    originalPrice: "₹55,000",
    icon: <FaCloud />, 
    category: "IT",
    rating: 4.6,
    reviews: 980,
    duration: "5 months",
    level: "Intermediate",
    subtitles: true,
    bestseller: false,
    updated: "Updated Aug 2025",
    moreInfo: [
      "AWS, Azure, Docker, Kubernetes",
      "CI/CD pipelines with Jenkins",
      "Hands-on cloud labs & projects",
      "Real-world deployment strategies"
    ]
  },
  { 
    title: "Data Science & AI", 
    desc: "Explore machine learning and data analysis", 
    price: "₹45,000", 
    originalPrice: "₹70,000",
    icon: <FaChartLine />, 
    category: "IT",
    rating: 4.9,
    reviews: 2100,
    duration: "7 months",
    level: "Advanced",
    subtitles: true,
    bestseller: true,
    updated: "Updated Aug 2025",
    moreInfo: [
      "Python, Machine Learning, Deep Learning",
      "Visualization with Tableau",
      "Natural Language Processing (NLP)",
      "Portfolio projects with real datasets"
    ]
  },
  { 
    title: "Software Testing", 
    desc: "Become an expert in QA and automation", 
    price: "₹30,000", 
    originalPrice: "₹40,000",
    icon: <FaBug />, 
    category: "IT",
    rating: 4.5,
    reviews: 650,
    duration: "4 months",
    level: "Beginner",
    subtitles: true,
    bestseller: false,
    updated: "Updated Aug 2025",
    moreInfo: [
      "Manual Testing & Automation",
      "Selenium, JUnit, TestNG frameworks",
      "Industry-level project training",
      "Automation best practices"
    ]
  }
];

// ================= Non-IT Courses =================
const nonItCourses = [
  { 
    title: "HR Management", 
    desc: "Modern HR practices and talent management", 
    price: "₹25,000", 
    originalPrice: "₹35,000",
    icon: <FaUsers />, 
    category: "Non-IT",
    rating: 4.6,
    reviews: 720,
    duration: "4 months",
    level: "Beginner",
    subtitles: false,
    bestseller: false,
    updated: "Updated Aug 2025",
    moreInfo: [
      "Recruitment & Talent Acquisition",
      "Payroll & Labor Laws",
      "Employee engagement strategies",
      "Performance management systems"
    ]
  },
  { 
    title: "Digital Marketing", 
    desc: "Master SEO, social media, and online campaigns", 
    price: "₹28,000", 
    originalPrice: "₹40,000",
    icon: <FaMobileAlt />, 
    category: "Non-IT",
    rating: 4.7,
    reviews: 1100,
    duration: "5 months",
    level: "Intermediate",
    subtitles: true,
    bestseller: true,
    updated: "Updated Aug 2025",
    moreInfo: [
      "SEO, SEM, Google Ads, Analytics",
      "Social Media Campaigns",
      "Email & Influencer Marketing",
      "Capstone digital project"
    ]
  },
  { 
    title: "Business Analysis", 
    desc: "Develop strategic business insights", 
    price: "₹32,000", 
    originalPrice: "₹45,000",
    icon: <FaBriefcase />, 
    category: "Non-IT",
    rating: 4.4,
    reviews: 500,
    duration: "4 months",
    level: "Intermediate",
    subtitles: false,
    bestseller: false,
    updated: "Updated Aug 2025",
    moreInfo: [
      "Requirement Gathering & Agile",
      "Use Cases, Jira Tools",
      "Case Studies with industry data",
      "Business solution design"
    ]
  },
  { 
    title: "Finance & Payroll", 
    desc: "Financial management and payroll systems", 
    price: "₹27,000", 
    originalPrice: "₹38,000",
    icon: <FaMoneyBill />, 
    category: "Non-IT",
    rating: 4.3,
    reviews: 430,
    duration: "6 months",
    level: "Beginner",
    subtitles: false,
    bestseller: false,
    updated: "Updated Aug 2025",
    moreInfo: [
      "Tally, GST, Income Tax",
      "Payroll Processing",
      "Financial compliance & reporting",
      "Placement Assistance"
    ]
  }
];

const allCourses = [...itCourses, ...nonItCourses];

// ================= Star Rating Component =================
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="star filled" />
      ))}
      {hasHalfStar && <FaRegStar className="star half" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} className="star empty" />
      ))}
      <span className="rating-value">{rating}</span>
    </div>
  );
};

// ================= DigitalCourses Main Component =================
const DigitalCourses = () => {
  const [filter, setFilter] = useState("All");

  const filteredCourses =
    filter === "All" ? allCourses : allCourses.filter(c => c.category === filter);

  return (
    <div className="digital-courses-container">
      {/* Header */}
      <section className="course-section">
        <h2>Our Training Programs</h2>
        <p className="subtitle">
          Choose from IT and Non-IT programs designed to upgrade your skills
        </p>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {["All", "IT", "Non-IT"].map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Course Grid */}
      <section className="course-section">
        <div className="course-grid">
          {filteredCourses.map((course, idx) => (
            <div key={idx} className={`course-card ${course.category}`}>
              <div className="course-main">
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p className="desc">{course.desc}</p>
                
                <div className="rating-container">
                  <StarRating rating={course.rating} />
                  <span className="reviews">({course.reviews.toLocaleString()})</span>
                </div>
                
                <div className="course-footer">
                  <div className="price-container">
                    <span className="current-price">{course.price}</span>
                    <span className="original-price">{course.originalPrice}</span>
                  </div>
                </div>
                
                {course.bestseller && (
                  <div className="bestseller-badge">Bestseller</div>
                )}
              </div>

              {/* Hover Info */}
              <div className="course-hover-info">
                <h4>{course.title}</h4>
                <div className="bestseller-updated">
                  {course.bestseller && <span className="bestseller-badge">Bestseller</span>}
                  <span className="updated-text">{course.updated}</span>
                </div>
                
                <div className="course-meta">
                  <div className="meta-item"><FaClock className="icon" /> <span>{course.duration}</span></div>
                  <div className="meta-item"><FaSignal className="icon" /> <span>{course.level}</span></div>
                  {course.subtitles && (
                    <div className="meta-item"><FaClosedCaptioning className="icon" /> <span>Subtitles</span></div>
                  )}
                </div>
                
                <div className="learning-objectives">
                  <h5>What you'll learn</h5>
                  <ul>
                    {course.moreInfo.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="hover-footer">
                  <button className="add-to-cart-btn">Buy Course</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DigitalCourses;
