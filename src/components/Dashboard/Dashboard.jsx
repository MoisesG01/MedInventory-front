import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import { FaBars } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        user={user}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div
        className={`dashboard-content ${sidebarCollapsed ? "collapsed" : ""}`}
      >
        <button
          className="dashboard-mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FaBars />
        </button>
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
