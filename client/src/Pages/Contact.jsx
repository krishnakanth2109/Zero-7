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
              <span>ops@zero7technologies.com</span>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>201, 2nd floor, Spline Arcade, Opp Rajugari Biryani<br />Ayyappa Society Main Road, Madhapur<br/>Hyderabad, Telangana, 500081</span>
            </div>
          </div>
          
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.279330956011!2d78.38993397331942!3d17.446339601107837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9167790c2429%3A0xe761ca87ad0d7005!2sSpline%20Arcade!5e0!3m2!1sen!2sin!4v1756298878073!5m2!1sen!2sin" 
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