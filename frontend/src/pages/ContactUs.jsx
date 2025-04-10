import React from 'react';
import './StaticPages.css';

const ContactUs = () => {
  return (
    <div className="static-page-container">
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! Whether you have a question, feedback, or partnership inquiry, reach out anytime.</p>
      
      <div className="contact-details">
        <p><strong>Email:</strong> support@travelmate.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Address:</strong> TravelMate HQ, 3rd Floor, Innovate Tower, Bangalore, India</p>
      </div>
    </div>
  );
};

export default ContactUs;
