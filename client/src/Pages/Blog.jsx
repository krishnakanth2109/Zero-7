// File: src/Pages/Blog.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';

// Define the old, hard-coded blog posts as a fallback
const fallbackBlogs = [
  {
    _id: 'it-skills-2025',
    title: 'Top 5 In-Demand IT Skills in 2025',
    description: 'Discover the most valuable IT skills that will dominate the job market in 2025 and how you can start learning them today to future-proof your career.',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'campus-to-corporate',
    title: 'Campus to Corporate: How to Prepare for Placement',
    description: 'Essential tips and strategies for college students to successfully transition from campus life to the corporate world during placement season.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'payroll-outsourcing',
    title: 'Why Payroll Outsourcing Saves Startups Time & Money',
    description: 'Learn how outsourcing payroll operations can help startups reduce costs, ensure compliance, and focus on their core business activities.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  }
];

// Define the API URL for fetching data
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Blog = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs); // Initialize state with fallback data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs`);
        // If the fetch is successful and returns at least one blog, use that data
        if (response.data && response.data.length > 0) {
          setBlogs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        // If there's an error, the component will just keep displaying the fallback blogs
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []); // The empty array ensures this effect runs only once on component mount

  const handleReadMore = (articleId) => {
    console.log(`Navigating to article ${articleId}`);
    // In the future, this could navigate to a detailed blog post page:
    // navigate(`/blog/${articleId}`);
    alert(`Read More action for article: ${articleId}`);
  };

  const handleSubscribe = () => {
    console.log('Opening newsletter subscription');
    alert('Opening newsletter subscription form');
  };

  return (
    <div className="blog-container">
      {/* Header Section (remains the same) */}
      <header className="blog-header">
        <h1>Insights, Tips & Career Resources</h1>
        <p>Build authority with useful content.</p>
      </header>

      {/* Blog Cards Section (now dynamic) */}
      <div className="blog-grid">
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <div className="card-image">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title}
                />
                <div className="image-overlay"></div>
              </div>
              <div className="card-content">
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <button 
                  className="blog-read-more" 
                  onClick={() => handleReadMore(blog._id)}
                  aria-label={`Read more about ${blog.title}`}
                >
                  Read More <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA Section (remains the same) */}
      <div className="blog-cta-section">
        <div className="blog-cta-content">
          <h2>Stay Updated with Our Latest Insights</h2>
          <p>Subscribe to our newsletter and never miss out on career tips, industry trends, and professional advice.</p>
          <button className="blog-cta-button" onClick={handleSubscribe}>
            Subscribe to Newsletter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;