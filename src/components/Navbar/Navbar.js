import React from 'react';
import './Navbar.css';
import { FaUserAlt, FaSignInAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const location = useLocation();

  // Verifica a página atual
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="MedInventory Logo" />
        <span className="navbar-title">MedInventory</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/home">About</Link></li>
        <li><ScrollLink to="services" smooth={true} duration={500}>Services</ScrollLink></li>
        <li><ScrollLink to="plans" smooth={true} duration={500}>Plans</ScrollLink></li>
        <li><Link to="/home">Terms & Conditions</Link></li>
        <li><ScrollLink to="faq" smooth={true} duration={500}>Help</ScrollLink></li>
      </ul>
      <div className="navbar-buttons">
        <Link to="/signup">
          <button className={`signup-btn ${isSignupPage ? 'active' : ''}`}>
            <FaUserAlt /> SIGNUP
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
