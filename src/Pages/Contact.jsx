import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      service: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Let's Connect</h1>
      </header>

      <div className="contact-content">
        <div className="contact-details">
          <h2>Contact Details</h2>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>6304244117 / 89198 01095</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>info@company.com</span>
            </div>
            <div className="contact-item">
              <i className="fab fa-whatsapp"></i>
              <span>+1 (555) 987-6543</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Business Ave, Suite 100<br />New York, NY 10001</span>
            </div>
          </div>
          
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304613!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1623942392926!5m2!1sen!2s" 
              width="100%" 
              height="250" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy"
              title="Company Location Map"
            ></iframe>
          </div>
        </div>

        <div className="inquiry-form">
          <h2>Quick Inquiry Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a Service</option>
                <option value="consultation">Training</option>
                <option value="design">Payroll Services</option>
                <option value="development">Resume Marketing</option>
                <option value="marketing">Campus Hiring</option>
                <option value="support">Technical Support</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Contact;