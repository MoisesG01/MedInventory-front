import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Verifica a página atual
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  // Scroll para o topo quando a rota muda
  useEffect(() => {
    // Se há um hash na URL e estamos na home, fazer scroll para o elemento
    if (location.pathname === "/home" && location.hash) {
      const elementId = location.hash.substring(1); // Remove o #
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (e) => {
    closeMenu();
    // Pequeno delay para garantir que a navegação ocorra antes do scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleScrollLink = (sectionId) => {
    closeMenu();
    // Validar sectionId para prevenir XSS - apenas alfanuméricos e hífen
    const validSectionId = /^[a-zA-Z0-9-]+$/.test(sectionId) ? sectionId : "";
    if (!validSectionId) {
      console.warn("Invalid sectionId:", sectionId);
      return;
    }

    if (location.pathname !== "/home") {
      // Se não estiver na home, navega para home com hash usando navigate
      navigate(`/home#${validSectionId}`);
    } else {
      // Se já estiver na home, apenas faz scroll
      const element = document.getElementById(validSectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/home");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="MedInventory Logo" />
        <span className="navbar-title">MedInventory</span>
      </div>
      <div
        className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/home" onClick={handleNavigation}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/home" onClick={handleNavigation}>
            About
          </Link>
        </li>
        <li>
          <span
            onClick={() => handleScrollLink("services")}
            className="scroll-link"
          >
            Services
          </span>
        </li>
        <li>
          <span
            onClick={() => handleScrollLink("plans")}
            className="scroll-link"
          >
            Plans
          </span>
        </li>
        <li>
          <span onClick={() => handleScrollLink("faq")} className="scroll-link">
            Help
          </span>
        </li>
        <li>
          <Link to="/terms" onClick={handleNavigation}>
            Terms & Conditions
          </Link>
        </li>
      </ul>
      <div className={`navbar-buttons ${isMenuOpen ? "active" : ""}`}>
        {isAuthenticated ? (
          <>
            <div className="navbar-user-info">
              <span className="navbar-username">
                <FaUser /> {user?.nome || user?.username}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> SAIR
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" onClick={handleNavigation}>
              <button className={`signup-btn ${isSignupPage ? "active" : ""}`}>
                <FaUser /> SIGNUP
              </button>
            </Link>
            <Link to="/login" onClick={handleNavigation}>
              <button className={`login-btn ${isLoginPage ? "active" : ""}`}>
                <FaSignInAlt /> LOGIN
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
