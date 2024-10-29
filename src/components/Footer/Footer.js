import React from 'react';
import './Footer.css';
import { FaInstagram, FaTwitter, FaYoutube, FaGlobe, FaPaperPlane } from 'react-icons/fa'; // Importando o ícone do avião de papel

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
          <img src="/logo.png" alt="MedInventory Logo" />
          <span>MedInventory</span>
        </div>
        <p>Copyright © 2024 Cotia-Sp</p>
        <p>All rights reserved</p>
        <div className="social-icons">
          <FaInstagram />
          <FaTwitter />
          <FaYoutube />
          <FaGlobe />
        </div>
      </div>
      <div className="footer-links">
        <div className="company-section">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About us</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact us</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
        </div>
        <div className="support-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help-center">Help Center</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/legal">Legal</a></li>
            <li><a href="/privacy">Privacy policy</a></li>
          </ul>
        </div>
        <div className="newsletter">
          <h4>Stay up to date</h4>
          <input type="email" placeholder="Your email address" />
          <button type="button"><FaPaperPlane /></button> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
