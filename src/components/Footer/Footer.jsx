import React, { useState } from "react";
import "./Footer.css";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGlobe,
  FaPaperPlane,
  FaChevronDown,
} from "react-icons/fa";

const Footer = () => {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
          <img src="/logo.png" alt="MedInventory Logo" />
          <span>MedInventory</span>
        </div>
        <p>Copyright © 2024 Cotia-Sp • All rights reserved</p>
        <div className="social-icons desktop-only">
          <FaInstagram aria-label="Instagram" />
          <FaTwitter aria-label="Twitter" />
          <FaYoutube aria-label="YouTube" />
          <FaGlobe aria-label="Website" />
        </div>
      </div>
      <div className="footer-links">
        <div className="company-section">
          <h4
            className="mobile-toggle"
            onClick={() => setIsCompanyOpen(!isCompanyOpen)}
          >
            Company
            <FaChevronDown
              className={`toggle-icon ${isCompanyOpen ? "open" : ""}`}
            />
          </h4>
          <ul className={isCompanyOpen ? "open" : ""}>
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/contact">Contact us</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
          </ul>
        </div>
        <div className="support-section">
          <h4
            className="mobile-toggle"
            onClick={() => setIsSupportOpen(!isSupportOpen)}
          >
            Support
            <FaChevronDown
              className={`toggle-icon ${isSupportOpen ? "open" : ""}`}
            />
          </h4>
          <ul className={isSupportOpen ? "open" : ""}>
            <li>
              <a href="/help-center">Help Center</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/legal">Legal</a>
            </li>
            <li>
              <a href="/privacy">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div className="newsletter">
          <h4>Stay up to date</h4>
          <div className="newsletter-input-wrapper">
            <input
              type="email"
              placeholder="Your email"
              aria-label="Newsletter email"
            />
            <button type="button" aria-label="Subscribe to newsletter">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
      <div className="mobile-footer-bottom">
        <div className="social-icons mobile-only">
          <FaInstagram aria-label="Instagram" />
          <FaTwitter aria-label="Twitter" />
          <FaYoutube aria-label="YouTube" />
          <FaGlobe aria-label="Website" />
        </div>
        <p className="mobile-copyright">© 2024 MedInventory</p>
      </div>
    </footer>
  );
};

export default Footer;
