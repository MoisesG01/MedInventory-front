import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import { FaArrowLeft, FaRocket, FaBars } from "react-icons/fa";
import "./ComingSoon.css";

const ComingSoon = ({ title, description, icon: Icon }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="coming-soon-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div
        className={`coming-soon-container ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="coming-soon-inner">
          {/* Mobile Menu Button */}
          <button
            className="coming-soon-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </button>

          {/* Back Button */}
          <button
            className="coming-soon-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
            Voltar ao Dashboard
          </button>

          {/* Content */}
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              {Icon ? <Icon /> : <FaRocket />}
            </div>
            <h1 className="coming-soon-title">{title || "Em Breve"}</h1>
            <p className="coming-soon-description">
              {description ||
                "Esta funcionalidade está em desenvolvimento e estará disponível em breve."}
            </p>
            <div className="coming-soon-animation">
              <div className="coming-soon-dot"></div>
              <div className="coming-soon-dot"></div>
              <div className="coming-soon-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
