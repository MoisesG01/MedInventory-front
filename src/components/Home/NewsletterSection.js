import React from 'react';
import './NewsletterSection.css';

const NewsletterSection = () => (
  <section className="newsletter-section">
    <h2>Subscribe to our newsletter and stay updated</h2>
    <div className="newsletter-input-container">
      <input type="email" placeholder="Enter your email" className="newsletter-input" />
      <button className="subscribe-button">Subscribe</button>
    </div>
  </section>
);

export default NewsletterSection;
