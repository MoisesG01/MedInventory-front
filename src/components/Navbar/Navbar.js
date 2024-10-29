import React from 'react';
import './Navbar.css';
import { FaUserAlt, FaSignInAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

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
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/terms">Terms & Conditions</Link></li>
        <li><Link to="/help">Help</Link></li>
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
