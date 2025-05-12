import React, { useState } from 'react';
import './Navbar.css';
import { FaUser, FaSignInAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verifica a página atual
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="MedInventory Logo" />
        <span className="navbar-title">MedInventory</span>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/home">About</Link></li>
        <li><ScrollLink to="services" smooth={true} duration={500}>Services</ScrollLink></li>
        <li><ScrollLink to="plans" smooth={true} duration={500}>Plans</ScrollLink></li>
        <li><ScrollLink to="faq" smooth={true} duration={500}>Help</ScrollLink></li>
        <li><Link to="/terms">Terms & Conditions</Link></li>
      </ul>
      <div className="navbar-buttons">
        <Link to="/signup">
          <button className={`signup-btn ${isSignupPage ? 'active' : ''}`}>
            <FaUser Alt /> SIGNUP
          </button>
        </Link>
        <Link to="/login">
          <button className={`login-btn ${isLoginPage ? 'active' : ''}`}>
            <FaSignInAlt /> LOGIN
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;